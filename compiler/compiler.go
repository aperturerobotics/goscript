package compiler

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"go/ast"
	"go/constant"
	"go/token"
	"go/types"
	"os"
	"path/filepath"
	"slices"
	"sort"
	"strings"

	gs "github.com/aperturerobotics/goscript"
	"github.com/sirupsen/logrus"
	"golang.org/x/tools/go/packages"
)

// Compiler is the root compiler for a project. It orchestrates the loading
// and compilation of Go packages into TypeScript. It holds project-wide
// configuration and uses `golang.org/x/tools/go/packages` to load
// Go package information.
type Compiler struct {
	le     *logrus.Entry
	config Config
	opts   packages.Config
}

// NewCompiler builds a new Compiler instance.
// It takes a compiler configuration, a logger entry, and an optional
// `packages.Config` for loading Go packages. If `opts` is nil,
// default options are used, configured for JavaScript/WebAssembly (js/wasm)
// target and to load comprehensive package information (types, syntax, etc.).
// It validates the provided configuration before creating the compiler.
func NewCompiler(conf *Config, le *logrus.Entry, opts *packages.Config) (*Compiler, error) {
	if err := conf.Validate(); err != nil {
		return nil, err
	}

	if opts == nil {
		opts = &packages.Config{Env: os.Environ()}
	}
	// opts.Logf = c.le.Debugf
	opts.Tests = false
	opts.Env = append(opts.Env, "GOOS=js", "GOARCH=wasm")
	opts.Dir = conf.Dir
	opts.BuildFlags = conf.BuildFlags

	// NeedName adds Name and PkgPath.
	// NeedFiles adds GoFiles and OtherFiles.
	// NeedCompiledGoFiles adds CompiledGoFiles.
	// NeedImports adds Imports. If NeedDeps is not set, the Imports field will contain
	// "placeholder" Packages with only the ID set.
	// NeedDeps adds the fields requested by the LoadMode in the packages in Imports.
	// NeedExportsFile adds ExportsFile.
	// NeedTypes adds Types, Fset, and IllTyped.
	// NeedSyntax adds Syntax.
	// NeedTypesInfo adds TypesInfo.
	// NeedTypesSizes adds TypesSizes.
	// TODO: disable these if not needed
	opts.Mode |= packages.NeedName |
		packages.NeedFiles |
		packages.NeedCompiledGoFiles |
		packages.NeedImports |
		packages.NeedDeps |
		packages.NeedExportFile |
		packages.NeedTypes |
		packages.NeedSyntax |
		packages.NeedTypesInfo |
		packages.NeedTypesSizes

	return &Compiler{
		config: *conf,
		le:     le,
		opts:   *opts,
	}, nil
}

// CompilationResult contains information about what was compiled
type CompilationResult struct {
	// CompiledPackages contains the package paths of all packages that were actually compiled to TypeScript
	CompiledPackages []string
	// CopiedPackages contains the package paths of all packages that were copied from handwritten sources
	CopiedPackages []string
	// OriginalPackages contains the package paths that were explicitly requested for compilation
	OriginalPackages []string
}

// CompilePackages loads Go packages based on the provided patterns and
// then compiles each loaded package into TypeScript. It uses the context for
// cancellation and applies the compiler's configured options during package loading.
// For each successfully loaded package, it creates a `PackageCompiler` and
// invokes its `Compile` method.
// If c.config.AllDependencies is true, it will also compile all dependencies
// of the requested packages, including standard library dependencies.
// Returns a CompilationResult with information about what was compiled.
func (c *Compiler) CompilePackages(ctx context.Context, patterns ...string) (*CompilationResult, error) {
	opts := c.opts
	opts.Context = ctx

	// First, load the initial packages with NeedImports to get all dependencies
	opts.Mode |= packages.NeedImports
	pkgs, err := packages.Load(&opts, patterns...)
	if err != nil {
		return nil, fmt.Errorf("failed to load packages: %w", err)
	}

	// build a list of packages that patterns matched
	patternPkgPaths := make([]string, 0, len(pkgs))
	for _, pkg := range pkgs {
		patternPkgPaths = append(patternPkgPaths, pkg.PkgPath)
	}

	result := &CompilationResult{
		OriginalPackages: patternPkgPaths,
	}

	// If AllDependencies is true, we need to collect all dependencies
	if c.config.AllDependencies {
		// Create a set to track processed packages by their ID
		processed := make(map[string]bool)
		var allPkgs []*packages.Package

		// Helper function to check if a package has a handwritten equivalent
		hasHandwrittenEquivalent := func(pkgPath string) bool {
			gsSourcePath := "gs/" + pkgPath
			_, gsErr := gs.GsOverrides.ReadDir(gsSourcePath)
			return gsErr == nil
		}

		// Visit all packages and their dependencies
		var visit func(pkg *packages.Package)
		visit = func(pkg *packages.Package) {
			if pkg == nil || processed[pkg.ID] {
				return
			}
			processed[pkg.ID] = true

			// Add this package to the list of all packages
			allPkgs = append(allPkgs, pkg)

			// Check if this package has a handwritten equivalent
			if hasHandwrittenEquivalent(pkg.PkgPath) {
				// Add this package but don't visit its dependencies
				return
			}

			// Visit all imports, including standard library packages
			for _, imp := range pkg.Imports {
				// Skip protobuf-go-lite packages and their dependencies
				if isProtobufGoLitePackage(imp.PkgPath) {
					continue
				}

				// Skip packages that are only used by .pb.go files
				if isPackageOnlyUsedByProtobufFiles(pkg, imp.PkgPath) {
					continue
				}

				visit(imp)
			}
		}

		// Start visiting from the initial packages
		for _, pkg := range pkgs {
			visit(pkg)
		}

		// Now we have collected all dependencies, but they only have minimal information.
		// We need to reload them with complete type information for compilation.
		// Collect all package paths from the dependency graph
		var pkgPaths []string
		pkgPathSet := make(map[string]bool) // Use set to avoid duplicates

		for _, pkg := range allPkgs {
			if pkg.PkgPath != "" && !pkgPathSet[pkg.PkgPath] {
				pkgPaths = append(pkgPaths, pkg.PkgPath)
				pkgPathSet[pkg.PkgPath] = true
			}
		}

		// Reload all collected packages with complete type information
		if len(pkgPaths) > 0 {
			fullOpts := c.opts
			fullOpts.Context = ctx
			// Use LoadAllSyntax to get complete type information, syntax trees, and type checking
			fullOpts.Mode = packages.LoadAllSyntax

			reloadedPkgs, err := packages.Load(&fullOpts, pkgPaths...)
			if err != nil {
				return nil, fmt.Errorf("failed to reload packages with complete type information: %w", err)
			}

			// Replace the minimal packages with the fully loaded ones
			pkgs = reloadedPkgs
		} else {
			// No packages to reload, use the original set
			pkgs = allPkgs
		}
	}

	// If DisableEmitBuiltin is false, we need to copy the builtin package to the output directory
	if !c.config.DisableEmitBuiltin {
		c.le.Debugf("Copying builtin package to output directory")
		builtinPath := "gs/builtin"
		outputPath := ComputeModulePath(c.config.OutputPath, "builtin")
		if err := c.copyEmbeddedPackage(builtinPath, outputPath); err != nil {
			return nil, fmt.Errorf("failed to copy builtin package to output directory: %w", err)
		}
		result.CopiedPackages = append(result.CopiedPackages, "builtin")
	}

	// Track which gs packages have been processed to avoid duplicates
	processedGsPackages := make(map[string]bool)

	// Create a map of all loaded packages for dependency analysis
	allPackages := make(map[string]*packages.Package)
	for _, pkg := range pkgs {
		allPackages[pkg.PkgPath] = pkg
	}

	// Compile all packages
	for _, pkg := range pkgs {
		// Check if the package has a handwritten equivalent
		// If the package was explicitly requested, skip this logic
		if !slices.Contains(patternPkgPaths, pkg.PkgPath) {
			gsSourcePath := "gs/" + pkg.PkgPath
			_, gsErr := gs.GsOverrides.ReadDir(gsSourcePath)
			if gsErr != nil && !os.IsNotExist(gsErr) {
				return nil, gsErr
			}
			if gsErr == nil {
				if c.config.DisableEmitBuiltin {
					// c.le.Infof("Skipping compilation for overridden package %s", pkg.PkgPath)
					result.CopiedPackages = append(result.CopiedPackages, pkg.PkgPath)
					continue
				} else {
					// If DisableEmitBuiltin is false, we need to copy the handwritten package and its dependencies
					if err := c.copyGsPackageWithDependencies(pkg.PkgPath, processedGsPackages, result); err != nil {
						return nil, fmt.Errorf("failed to copy handwritten package %s with dependencies: %w", pkg.PkgPath, err)
					}
					continue
				}
			}
		}

		// Fail fast on packages that failed to load to avoid hiding errors
		if len(pkg.Errors) > 0 {
			var msgs []string
			for _, e := range pkg.Errors {
				// packages.Error is a struct; collect all messages
				msgs = append(msgs, e.Error())
			}
			return nil, fmt.Errorf("package %s has load errors: %s", pkg.PkgPath, strings.Join(msgs, "; "))
		}

		pkgCompiler, err := NewPackageCompiler(c.le, &c.config, pkg, allPackages)
		if err != nil {
			return nil, fmt.Errorf("failed to create package compiler for %s: %w", pkg.PkgPath, err)
		}

		if err := pkgCompiler.Compile(ctx); err != nil {
			return nil, fmt.Errorf("failed to compile package %s: %w", pkg.PkgPath, err)
		}

		c.le.Info(pkg.PkgPath)

		result.CompiledPackages = append(result.CompiledPackages, pkg.PkgPath)
	}

	return result, nil
}

// PackageCompiler is responsible for compiling an entire Go package into
// its TypeScript equivalent. It manages the compilation of individual files
// within the package and determines the output path for the compiled package.
type PackageCompiler struct {
	le           *logrus.Entry
	compilerConf *Config
	outputPath   string
	pkg          *packages.Package
	allPackages  map[string]*packages.Package
}

// NewPackageCompiler creates a new `PackageCompiler` for a given Go package.
// It initializes the compiler with the necessary configuration, logger, and
// the `packages.Package` data obtained from `golang.org/x/tools/go/packages`.
// It also computes the base output path for the compiled TypeScript files of the package.
func NewPackageCompiler(
	le *logrus.Entry,
	compilerConf *Config,
	pkg *packages.Package,
	allPackages map[string]*packages.Package,
) (*PackageCompiler, error) {
	res := &PackageCompiler{
		le:           le,
		pkg:          pkg,
		compilerConf: compilerConf,
		outputPath:   ComputeModulePath(compilerConf.OutputPath, pkg.PkgPath),
		allPackages:  allPackages,
	}

	return res, nil
}

// Compile orchestrates the compilation of all Go files within the package.
//
// It iterates through each syntax file (`ast.File`) of the package,
// determines its relative path for logging, and then invokes `CompileFile`
// to handle the compilation of that specific file.
//
// After compiling all files, it generates an index.ts file that re-exports
// all exported symbols, allowing the package to be imported correctly.
//
// The working directory (`wd`) is used to make file paths in logs more readable.
func (c *PackageCompiler) Compile(ctx context.Context) error {
	wd := c.compilerConf.Dir
	if wd == "" {
		var err error
		wd, err = os.Getwd()
		if err != nil {
			return err
		}
	}

	// Perform package-level analysis for auto-imports
	packageAnalysis := AnalyzePackageImports(c.pkg)

	// Perform comprehensive package-level analysis for code generation
	analysis := AnalyzePackageFiles(c.pkg, c.allPackages)

	// Track all compiled files for later generating the index.ts
	compiledFiles := make([]string, 0, len(c.pkg.CompiledGoFiles))

	// Compile the files in the package one at a time
	for i, f := range c.pkg.Syntax {
		fileName := c.pkg.CompiledGoFiles[i]
		relWdFileName, err := filepath.Rel(wd, fileName)
		if err != nil {
			return err
		}

		// Check if this is a .pb.go file that should be skipped
		baseFileName := filepath.Base(fileName)
		if strings.HasSuffix(baseFileName, ".pb.go") {
			// Check if there's a corresponding .pb.ts file
			pbTsFileName := strings.TrimSuffix(baseFileName, ".pb.go") + ".pb.ts"
			packageDir := filepath.Dir(fileName)
			pbTsPath := filepath.Join(packageDir, pbTsFileName)

			if _, err := os.Stat(pbTsPath); err == nil {
				// .pb.ts file exists, copy it instead of transpiling .pb.go
				c.le.WithField("file", relWdFileName).Debug("found .pb.ts file, copying instead of transpiling .pb.go")

				if err := c.copyProtobufTSFile(pbTsPath, pbTsFileName); err != nil {
					return fmt.Errorf("failed to copy protobuf .pb.ts file: %w", err)
				}

				// Add the .pb file to our compiled files list for index generation
				pbFileName := strings.TrimSuffix(baseFileName, ".pb.go") + ".pb"
				compiledFiles = append(compiledFiles, pbFileName)
				continue // Skip transpiling this .pb.go file
			}
		}

		// log just the filename
		c.le.Debugf("GS: %s", filepath.Base(fileName))
		if err := c.CompileFile(ctx, fileName, f, analysis, packageAnalysis); err != nil {
			return err
		}

		// Add the base filename to our list for the index.ts generation
		// Strip .go extension and add .gs
		gsFileName := strings.TrimSuffix(baseFileName, ".go") + ".gs"
		compiledFiles = append(compiledFiles, gsFileName)
	}

	// After compiling all files, generate the index.ts file
	if err := c.generateIndexFile(compiledFiles); err != nil {
		return err
	}

	return nil
}

// generateIndexFile creates an index.ts file in the package output directory
// that re-exports only Go-exported symbols from the compiled TypeScript files.
// This ensures the package can be imported correctly by TypeScript modules
// while maintaining proper Go package boundaries.
func (c *PackageCompiler) generateIndexFile(compiledFiles []string) error {
	indexFilePath := filepath.Join(c.outputPath, "index.ts")

	// Open the file for writing
	indexFile, err := os.OpenFile(indexFilePath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	defer indexFile.Close() //nolint:errcheck

	// Write selective re-exports for each compiled file
	for _, fileName := range compiledFiles {
		// Check if this is a protobuf file
		if strings.HasSuffix(fileName, ".pb") {
			// For protobuf files, add a simple re-export
			pbTsFileName := fileName + ".ts"
			if err := func() error {
				var _ string = pbTsFileName
				return c.writeProtobufExports(indexFile, fileName)
			}(); err != nil {
				return err
			}
			continue
		}

		// Find which symbols this file exports
		var valueSymbols []string
		var typeSymbols []string
		var structSymbols []string // New: Track structs separately

		// Find the corresponding syntax file
		for i, syntax := range c.pkg.Syntax {
			syntaxFileName := c.pkg.CompiledGoFiles[i]
			syntaxBaseFileName := filepath.Base(syntaxFileName)
			syntaxGsFileName := strings.TrimSuffix(syntaxBaseFileName, ".go") + ".gs"

			if syntaxGsFileName != fileName {
				continue
			}

			// Collect exported symbols from this specific file
			for _, decl := range syntax.Decls {
				switch d := decl.(type) {
				case *ast.FuncDecl:
					if d.Recv == nil && d.Name.IsExported() {
						valueSymbols = append(valueSymbols, sanitizeIdentifier(d.Name.Name))
					} else if d.Recv != nil && len(d.Recv.List) == 1 && d.Name.IsExported() {
						recvField := d.Recv.List[0]
						recvTypeExpr := recvField.Type
						if star, ok := recvTypeExpr.(*ast.StarExpr); ok {
							recvTypeExpr = star.X
						}
						if ident, ok := recvTypeExpr.(*ast.Ident); ok {
							typeObj := c.pkg.TypesInfo.ObjectOf(ident)
							if typeObj != nil && typeObj.Exported() {
								if typeName, ok := typeObj.(*types.TypeName); ok {
									underlying := typeName.Type().Underlying()
									if _, isStruct := underlying.(*types.Struct); !isStruct {
										methodName := sanitizeIdentifier(ident.Name + "_" + d.Name.Name)
										valueSymbols = append(valueSymbols, methodName)
									}
								}
							}
						}
					}
				case *ast.GenDecl:
					for _, spec := range d.Specs {
						switch s := spec.(type) {
						case *ast.TypeSpec:
							if s.Name.IsExported() {
								// Check if this is a struct type
								if _, isStruct := s.Type.(*ast.StructType); isStruct {
									// Structs become TypeScript classes and need both type and value exports
									structSymbols = append(structSymbols, sanitizeIdentifier(s.Name.Name))
								} else {
									// Other type declarations (interfaces, type definitions, type aliases)
									// become TypeScript types and must be exported with "export type"
									typeSymbols = append(typeSymbols, sanitizeIdentifier(s.Name.Name))
								}
							}
						case *ast.ValueSpec:
							for _, name := range s.Names {
								if name.IsExported() {
									valueSymbols = append(valueSymbols, sanitizeIdentifier(name.Name))
								}
							}
						}
					}
				}
			}
			break
		}

		// Write exports if this file has exported symbols
		if len(valueSymbols) > 0 {
			sort.Strings(valueSymbols)
			exportLine := fmt.Sprintf("export { %s } from \"./%s.js\"\n",
				strings.Join(valueSymbols, ", "), fileName)
			if _, err := indexFile.WriteString(exportLine); err != nil {
				return err
			}
		}

		// Write struct exports (both as types and values)
		if len(structSymbols) > 0 {
			sort.Strings(structSymbols)
			// Export classes as values (which makes them available as both types and values in TypeScript)
			exportLine := fmt.Sprintf("export { %s } from \"./%s.js\"\n",
				strings.Join(structSymbols, ", "), fileName)
			if _, err := indexFile.WriteString(exportLine); err != nil {
				return err
			}
		}

		if len(typeSymbols) > 0 {
			sort.Strings(typeSymbols)
			exportLine := fmt.Sprintf("export type { %s } from \"./%s.js\"\n",
				strings.Join(typeSymbols, ", "), fileName)
			if _, err := indexFile.WriteString(exportLine); err != nil {
				return err
			}
		}
	}

	return nil
}

// CompileFile handles the compilation of a single Go source file to TypeScript.
// It uses the pre-computed package-level analysis for accurate TypeScript generation
// (e.g., about varRefing, async functions, defer statements, receiver usage across files).
// Then, it creates a `FileCompiler` instance for the file and invokes its
// `Compile` method to generate the TypeScript code.
func (p *PackageCompiler) CompileFile(ctx context.Context, name string, syntax *ast.File, analysis *Analysis, packageAnalysis *PackageAnalysis) error {
	fileCompiler, err := NewFileCompiler(p.compilerConf, p.pkg, syntax, name, analysis, packageAnalysis)
	if err != nil {
		return err
	}
	return fileCompiler.Compile(ctx)
}

// FileCompiler is responsible for compiling a single Go source file (`ast.File`)
// into a corresponding TypeScript file. It manages the output file creation,
// initializes the `TSCodeWriter` for TypeScript code generation, and uses a
// `GoToTSCompiler` to translate Go declarations and statements.
type FileCompiler struct {
	compilerConfig  *Config
	codeWriter      *TSCodeWriter
	pkg             *packages.Package
	ast             *ast.File
	fullPath        string
	Analysis        *Analysis
	PackageAnalysis *PackageAnalysis
}

// NewFileCompiler creates a new `FileCompiler` for a specific Go file.
// It takes the global compiler configuration, the Go package information,
// the AST of the file, its full path, and the pre-computed analysis results.
// This setup provides all necessary context for translating the file.
func NewFileCompiler(
	compilerConf *Config,
	pkg *packages.Package,
	astFile *ast.File,
	fullPath string,
	analysis *Analysis,
	packageAnalysis *PackageAnalysis,
) (*FileCompiler, error) {
	return &FileCompiler{
		compilerConfig:  compilerConf,
		pkg:             pkg,
		ast:             astFile,
		fullPath:        fullPath,
		Analysis:        analysis,
		PackageAnalysis: packageAnalysis,
	}, nil
}

// Compile generates the TypeScript code for the Go file.
// It determines the output TypeScript file path, creates the necessary
// directories, and opens the output file. It then initializes a `TSCodeWriter`
// and a `GoToTSCompiler`. A standard import for the `@goscript/builtin`
// runtime (aliased as `$`) is added, followed by the translation of all
// top-level declarations in the Go file.
func (c *FileCompiler) Compile(ctx context.Context) error {
	f := c.ast
	pkgPath := c.pkg.PkgPath

	outputFilePath := TranslateGoFilePathToTypescriptFilePath(pkgPath, filepath.Base(c.fullPath))
	outputFilePathAbs := filepath.Join(c.compilerConfig.OutputPath, outputFilePath)

	if err := os.MkdirAll(filepath.Dir(outputFilePathAbs), 0o755); err != nil {
		return err
	}

	of, err := os.OpenFile(outputFilePathAbs, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	defer of.Close() //nolint:errcheck

	c.codeWriter = NewTSCodeWriter(of)

	// Pass analysis to compiler
	goWriter := NewGoToTSCompiler(c.codeWriter, c.pkg, c.Analysis)

	// Add import for the goscript runtime using namespace import and alias
	c.codeWriter.WriteLinef("import * as $ from %q", "@goscript/builtin/index.js")

	// Check if there are any .pb.go files in this package and add imports for them
	if err := c.addProtobufImports(); err != nil {
		return fmt.Errorf("failed to add protobuf imports: %w", err)
	}

	// Generate auto-imports for functions from other files in the same package
	currentFileName := strings.TrimSuffix(filepath.Base(c.fullPath), ".go")
	if imports := c.PackageAnalysis.FunctionCalls[currentFileName]; imports != nil {
		// Sort source files for consistent import order
		var sourceFiles []string
		for sourceFile := range imports {
			sourceFiles = append(sourceFiles, sourceFile)
		}
		sort.Strings(sourceFiles)

		for _, sourceFile := range sourceFiles {
			functions := imports[sourceFile]
			if len(functions) > 0 {
				// Apply sanitization to function names
				var sanitizedFunctions []string
				for _, fn := range functions {
					sanitizedFunctions = append(sanitizedFunctions, sanitizeIdentifier(fn))
				}
				// Sort functions for consistent output
				sort.Strings(sanitizedFunctions)
				c.codeWriter.WriteLinef("import { %s } from \"./%s.gs.js\";",
					strings.Join(sanitizedFunctions, ", "), sourceFile)
			}
		}
	}

	// Generate auto-imports for types from other files in the same package
	if typeImports := c.PackageAnalysis.TypeCalls[currentFileName]; typeImports != nil {
		// Sort source files for consistent import order
		var sourceFiles []string
		for sourceFile := range typeImports {
			sourceFiles = append(sourceFiles, sourceFile)
		}
		sort.Strings(sourceFiles)

		for _, sourceFile := range sourceFiles {
			typeImports := typeImports[sourceFile]
			if len(typeImports) > 0 {
				// Filter out protobuf types - they should be imported from .pb.js files, not .gs.js files
				var nonProtobufTypes []string
				for _, typeName := range typeImports {
					// Check if this type is a protobuf type by looking at its type info
					isProtobuf := false
					if typeObj := c.pkg.Types.Scope().Lookup(typeName); typeObj != nil {
						objType := typeObj.Type()
						if namedType, ok := objType.(*types.Named); ok {
							// Use the same detection logic as codegen
							if goWriter.isProtobufType(namedType) {
								isProtobuf = true
							}
						}
					}
					if !isProtobuf {
						nonProtobufTypes = append(nonProtobufTypes, typeName)
					}
				}

				if len(nonProtobufTypes) > 0 {
					// Apply sanitization to type names
					var sanitizedTypes []string
					for _, typeName := range nonProtobufTypes {
						sanitizedTypes = append(sanitizedTypes, sanitizeIdentifier(typeName))
					}
					// Sort types for consistent output
					sort.Strings(sanitizedTypes)
					c.codeWriter.WriteLinef("import { %s } from \"./%s.gs.js\";",
						strings.Join(sanitizedTypes, ", "), sourceFile)
				}
			}
		}
	}

	c.codeWriter.WriteLine("") // Add a newline after imports

	if err := goWriter.WriteDecls(f.Decls); err != nil {
		return fmt.Errorf("failed to write declarations: %w", err)
	}

	return nil
}

// GoToTSCompiler is the core component responsible for translating Go AST nodes
// and type information into TypeScript code. It uses a `TSCodeWriter` to output
// the generated TypeScript and relies on `Analysis` data to make informed
// decisions about code generation (e.g., varRefing, async behavior).
type GoToTSCompiler struct {
	tsw *TSCodeWriter
	pkg *packages.Package

	analysis *Analysis

	// Context flags
	insideAddressOf bool // true when processing operand of & operator
}

// It initializes the compiler with a `TSCodeWriter` for output,
// Go package information (`packages.Package`), and pre-computed
// analysis results (`Analysis`) to guide the translation process.
func NewGoToTSCompiler(tsw *TSCodeWriter, pkg *packages.Package, analysis *Analysis) *GoToTSCompiler {
	return &GoToTSCompiler{
		tsw:      tsw,
		pkg:      pkg,
		analysis: analysis,
	}
}

// getDeterministicID generates a deterministic unique ID based on file position
// This replaces the non-deterministic Pos() values to ensure reproducible builds
func (c *GoToTSCompiler) getDeterministicID(pos token.Pos) string {
	if !pos.IsValid() {
		return "0000"
	}

	// Get file position information
	position := c.pkg.Fset.Position(pos)

	// Use package path + base filename + line + column for deterministic hashing
	// This avoids absolute path differences between build environments
	baseFilename := filepath.Base(position.Filename)
	if baseFilename == "" {
		baseFilename = "unknown"
	}

	packagePath := c.pkg.PkgPath
	if packagePath == "" {
		packagePath = "main"
	}

	// Create a string that uniquely identifies this position using only relative/stable info
	positionStr := fmt.Sprintf("%s:%s:%d:%d", packagePath, baseFilename, position.Line, position.Column)

	// Hash the position string with SHA256
	hash := sha256.Sum256([]byte(positionStr))

	// Convert to hex and take the last 4 characters (lowercase)
	hexStr := hex.EncodeToString(hash[:])
	return hexStr[len(hexStr)-4:]
}

// --- Exported Node-Specific Writers ---

// WriteIdent translates a Go identifier (`ast.Ident`) used as a value (e.g.,
// variable, function name) into its TypeScript equivalent.
//   - If the identifier is `nil`, it writes `null`.
//   - If the identifier refers to a constant, it writes the constant's evaluated value.
//   - Otherwise, it writes the identifier's name.
//   - If `accessVarRefedValue` is true and the analysis (`c.analysis.NeedsVarRefAccess`)
//     indicates the variable is variable referenced, `.value` is appended to access the contained value.
//
// This function relies on `go/types` (`TypesInfo.Uses` or `Defs`) to resolve
// the identifier and the `Analysis` data to determine varRefing needs.
func (c *GoToTSCompiler) WriteIdent(exp *ast.Ident, accessVarRefedValue bool) {
	if exp.Name == "nil" {
		c.tsw.WriteLiterally("null")
		return
	}

	// Check if this identifier has a pre-computed mapping (e.g., wrapper function receiver)
	if mappedName := c.analysis.GetIdentifierMapping(exp); mappedName != "" {
		c.tsw.WriteLiterally(c.sanitizeIdentifier(mappedName))
		return
	}

	// Use TypesInfo to find the object associated with the identifier
	var obj types.Object
	obj = c.pkg.TypesInfo.Uses[exp]
	if obj == nil {
		obj = c.pkg.TypesInfo.Defs[exp]
	}

	// Check if this identifier refers to a constant
	if obj != nil {
		if constObj, isConst := obj.(*types.Const); isConst {
			// Evaluate constants to literals in these cases:
			// 1. Predeclared constants (like iota, true, false) - these have nil package
			// 2. Constants from the current package that are computed expressions
			//    (like iota-based constants or mathematical expressions)
			//
			// For simple assignments from imported constants (const x = pkg.Y),
			// preserve the variable name for better readability.

			if constObj.Pkg() == nil {
				// Predeclared constants - always evaluate to literals
				c.writeConstantValue(constObj)
				return
			}

			if constObj.Pkg() == c.pkg.Types {
				// This is a constant from the current package.
				// Check if it's a simple assignment by looking at the constant value:
				// If the constant has the same name as an identifier in the import,
				// it's likely a simple assignment and we should preserve the name.
				// Otherwise, evaluate to literal (for computed expressions like iota).

				// For now, let's be conservative and evaluate current package constants
				// to literals to maintain compatibility with existing behavior.
				// This handles iota-based constants correctly.
				c.writeConstantValue(constObj)
				return
			}
		}
	}

	// Write the identifier name first, sanitizing if it's a reserved word
	c.tsw.WriteLiterally(c.sanitizeIdentifier(exp.Name))

	// Determine if we need to access .value based on analysis data
	if obj != nil && accessVarRefedValue && c.analysis.NeedsVarRefAccess(obj) {
		c.tsw.WriteLiterally("!.value")
	}
}

// WriteCaseClause translates a Go `case` clause (`ast.CaseClause`) from within
// a `switch` statement into its TypeScript `case` or `default` equivalent.
//   - If `exp.List` is nil, it's a `default` case, written as `default:`.
//   - If `exp.List` is not nil, it's a `case` with one or more match expressions.
//     It's written as `case expr1_ts, expr2_ts, ... :`. (Note: Go's `case`
//     doesn't allow multiple expressions this way, but TypeScript does. This code
//     implies Go's fallthrough is not directly modeled here but rather by explicit
//     `break`s, and each Go `case` becomes one or more TS `case` labels if needed,
//     though current implementation writes them comma-separated which is valid TS syntax).
//   - The body of the case (`exp.Body`) is translated statement by statement using `WriteStmt`.
//   - A `break;` statement is automatically added at the end of the TypeScript case
//     body, because Go `switch` cases have implicit breaks, whereas TypeScript
//     cases fall through by default.
func (c *GoToTSCompiler) WriteCaseClause(exp *ast.CaseClause) error {
	if exp.List == nil {
		// Default case
		c.tsw.WriteLiterally("default:")
		c.tsw.WriteLine("")
	} else {
		// Case with expressions
		// For Go's `case expr1, expr2:`, we translate to:
		// case expr1:
		// case expr2:
		// ... body ...
		// break
		for _, caseExpr := range exp.List {
			c.tsw.WriteLiterally("case ")
			if err := c.WriteValueExpr(caseExpr); err != nil {
				return fmt.Errorf("failed to write case clause expression: %w", err)
			}
			c.tsw.WriteLiterally(":")
			c.tsw.WriteLine("")
		}
	}

	// The body is written once, after all case labels for this clause.
	// Indentation for the body starts here.
	c.tsw.Indent(1)
	for _, stmt := range exp.Body {
		if err := c.WriteStmt(stmt); err != nil {
			return fmt.Errorf("failed to write statement in case clause body: %w", err)
		}
	}
	// Add break statement (Go's switch has implicit breaks, TS needs explicit break)
	c.tsw.WriteLine("break")
	c.tsw.Indent(-1)
	return nil
}

// writeChannelReceiveWithOk handles the specific Go assignment pattern
// `value, ok := <-channel` (or `:=`).
// It translates this into a TypeScript destructuring assignment/declaration
// from the result of `await channel_ts.receiveWithOk()`.
// The `receiveWithOk()` runtime method is expected to return an object like
// `{ value: receivedValue, ok: boolean }`.
//
// - If `tok` is `token.DEFINE` (for `:=`), it generates `const { value: valueName, ok: okName } = ...`.
// - Otherwise (for `=`), it generates `{ value: valueName, ok: okName } = ...` (if not a declaration).
// - Blank identifiers (`_`) on the LHS are handled:
//   - If `value` is blank: `const { ok: okName } = ...` or `{ ok: okName } = ...`.
//   - If `ok` is blank: `const { value: valueName } = ...` or `{ value: valueName } = ...`.
//   - If both are blank, it simply writes `await channel_ts.receiveWithOk()` to
//     execute the receive for its potential side effects (though `receiveWithOk`
//     is primarily for its return values) and discards the result.
//
// This ensures that the Go channel receive with existence check is correctly
// mapped to the asynchronous TypeScript channel helper.
func (c *GoToTSCompiler) writeChannelReceiveWithOk(lhs []ast.Expr, unaryExpr *ast.UnaryExpr, tok token.Token) error {
	// Ensure LHS has exactly two expressions
	if len(lhs) != 2 {
		return fmt.Errorf("internal error: writeChannelReceiveWithOk called with %d LHS expressions", len(lhs))
	}

	// Get variable names, handling blank identifiers
	valueIsBlank := false
	okIsBlank := false
	var valueName string
	var okName string

	if valIdent, ok := lhs[0].(*ast.Ident); ok {
		if valIdent.Name == "_" {
			valueIsBlank = true
		} else {
			valueName = valIdent.Name
		}
	} else {
		return fmt.Errorf("unhandled LHS expression type for value in channel receive: %T", lhs[0])
	}

	if okIdent, ok := lhs[1].(*ast.Ident); ok {
		if okIdent.Name == "_" {
			okIsBlank = true
		} else {
			okName = okIdent.Name
		}
	} else {
		return fmt.Errorf("unhandled LHS expression type for ok in channel receive: %T", lhs[1])
	}

	// Generate destructuring assignment/declaration for val, ok := <-channel
	keyword := ""
	if tok == token.DEFINE {
		keyword = "const " // Use const for destructuring declaration
	}

	// Build the destructuring pattern, handling blank identifiers correctly for TS
	patternParts := []string{}
	if !valueIsBlank {
		// Map the 'value' field to the Go variable name
		patternParts = append(patternParts, fmt.Sprintf("value: %s", valueName))
	} else {
		// If both are blank, just await the call and return
		if okIsBlank {
			c.tsw.WriteLiterally("await $.chanRecvWithOk(")
			if err := c.WriteValueExpr(unaryExpr.X); err != nil { // Channel expression
				return fmt.Errorf("failed to write channel expression in receive: %w", err)
			}
			c.tsw.WriteLiterally(")")
			c.tsw.WriteLine("")
			return nil // Nothing to assign
		}
		// Only value is blank, need to map 'ok' property
		patternParts = append(patternParts, fmt.Sprintf("ok: %s", okName))
	}

	if !okIsBlank && !valueIsBlank { // Both are present
		patternParts = append(patternParts, fmt.Sprintf("ok: %s", okName))
	}
	// If both are blank, patternParts remains empty, handled earlier.

	destructuringPattern := fmt.Sprintf("{ %s }", strings.Join(patternParts, ", "))

	// Write the destructuring assignment/declaration
	c.tsw.WriteLiterally(keyword) // "const " or ""
	c.tsw.WriteLiterally(destructuringPattern)
	c.tsw.WriteLiterally(" = await $.chanRecvWithOk(")
	if err := c.WriteValueExpr(unaryExpr.X); err != nil { // Channel expression
		return fmt.Errorf("failed to write channel expression in receive: %w", err)
	}
	c.tsw.WriteLiterally(")")
	c.tsw.WriteLine("")

	return nil
}

// WriteDoc translates a Go comment group (`ast.CommentGroup`) into TypeScript comments,
// preserving the original style (line `//` or block `/* ... */`).
// - If `doc` is nil, it does nothing.
// - It iterates through each `ast.Comment` in the group.
// - If a comment starts with `//`, it's written as a TypeScript line comment.
// - If a comment starts with `/*`, it's written as a TypeScript block comment:
//   - Single-line block comments (`/* comment */`) are kept on one line.
//   - Multi-line block comments are formatted with `/*` on its own line,
//     each content line prefixed with ` * `, and ` */` on its own line.
//
// This function helps maintain documentation and explanatory comments from the
// Go source in the generated TypeScript code.
func (c *GoToTSCompiler) WriteDoc(doc *ast.CommentGroup) {
	if doc == nil {
		return
	}

	for _, comment := range doc.List {
		// Preserve original comment style (// or /*)
		if strings.HasPrefix(comment.Text, "//") {
			c.tsw.WriteLine(comment.Text)
		} else if strings.HasPrefix(comment.Text, "/*") {
			// Write block comments potentially spanning multiple lines
			// Remove /* and */, then split by newline
			content := strings.TrimSuffix(strings.TrimPrefix(comment.Text, "/*"), "*/")
			lines := strings.Split(content, "\n") // Use \n as Split expects a separator string

			if len(lines) == 1 && !strings.Contains(lines[0], "\n") { // Check again for internal newlines just in case
				// Keep single-line block comments on one line
				c.tsw.WriteLinef("/*%s*/", lines[0])
			} else {
				// Write multi-line block comments
				c.tsw.WriteLine("/*")
				for _, line := range lines {
					// WriteLine handles indentation preamble automatically
					c.tsw.WriteLine(" *" + line) // Add conventional * prefix
				}
				c.tsw.WriteLine(" */")
			}
		} else {
			// Should not happen for valid Go comments, but handle defensively
			c.tsw.WriteCommentLine(" Unknown comment format: " + comment.Text)
		}
	}
}

// sanitizeIdentifier is a method wrapper around the package-level sanitizeIdentifier function
func (c *GoToTSCompiler) sanitizeIdentifier(name string) string {
	return sanitizeIdentifier(name)
}

// writeConstantValue writes the evaluated value of a Go constant to TypeScript.
// It handles different constant types (integer, float, string, boolean, complex)
// and writes the appropriate TypeScript literal.
func (c *GoToTSCompiler) writeConstantValue(constObj *types.Const) {
	val := constObj.Val()

	switch val.Kind() {
	case constant.Int:
		// For integer constants, write the string representation
		c.tsw.WriteLiterally(val.String())
	case constant.Float:
		// For float constants, write the string representation
		c.tsw.WriteLiterally(val.String())
	case constant.String:
		// For string constants, write as a quoted string literal
		// Use constant.StringVal to get the full string value without truncation,
		// then manually add quotes since StringVal returns the unquoted string
		stringValue := constant.StringVal(val)
		c.tsw.WriteLiterallyf("%q", stringValue) // %q adds proper quotes and escaping
	case constant.Bool:
		// For boolean constants, write true/false
		if constant.BoolVal(val) {
			c.tsw.WriteLiterally("true")
		} else {
			c.tsw.WriteLiterally("false")
		}
	case constant.Complex:
		// For complex constants, we need to handle them specially
		// For now, write as a comment indicating unsupported
		c.tsw.WriteLiterally("/* complex constant: " + val.String() + " */")
	default:
		// For unknown constant types, write as a comment
		c.tsw.WriteLiterally("/* unknown constant: " + val.String() + " */")
	}
}

// copyEmbeddedPackage recursively copies files from an embedded FS path to a filesystem directory.
// It handles both regular files and directories, but only copies .gs.ts and .ts files.
// It preserves existing subdirectories that aren't being overwritten.
func (c *Compiler) copyEmbeddedPackage(embeddedPath string, outputPath string) error {
	// Create the output path if it doesn't exist
	if err := os.MkdirAll(outputPath, 0o755); err != nil {
		return fmt.Errorf("failed to create output directory %s: %w", outputPath, err)
	}

	// List the entries in the embedded path
	entries, err := gs.GsOverrides.ReadDir(embeddedPath)
	if err != nil {
		return fmt.Errorf("failed to read embedded directory %s: %w", embeddedPath, err)
	}

	// Process each entry
	for _, entry := range entries {
		entryPath := filepath.Join(embeddedPath, entry.Name())
		outputEntryPath := filepath.Join(outputPath, entry.Name())

		if entry.IsDir() {
			// Create the output directory
			if err := os.MkdirAll(outputEntryPath, 0o755); err != nil {
				return fmt.Errorf("failed to create output directory %s: %w", outputEntryPath, err)
			}

			// Recursively copy the directory contents
			if err := c.copyEmbeddedPackage(entryPath, outputEntryPath); err != nil {
				return err
			}
		} else {
			// Only copy .gs.ts and .ts files, skip .go files and others
			fileName := entry.Name()
			if !strings.HasSuffix(fileName, ".gs.ts") && !strings.HasSuffix(fileName, ".ts") {
				// c.le.Debugf("Skipping non-TypeScript file: %s", fileName)
				continue
			}

			// Skip .test.ts files
			if strings.HasSuffix(fileName, ".test.ts") {
				// c.le.Debugf("Skipping test file: %s", fileName)
				continue
			}

			// Remove existing file if it exists (but preserve directories)
			if stat, err := os.Stat(outputEntryPath); err == nil && !stat.IsDir() {
				if err := os.Remove(outputEntryPath); err != nil {
					return fmt.Errorf("failed to remove existing file %s: %w", outputEntryPath, err)
				}
			}

			// Read the file content from the embedded FS
			content, err := gs.GsOverrides.ReadFile(entryPath)
			if err != nil {
				return fmt.Errorf("failed to read embedded file %s: %w", entryPath, err)
			}

			// Write the content to the output file
			if err := os.WriteFile(outputEntryPath, content, 0o644); err != nil {
				return fmt.Errorf("failed to write file %s: %w", outputEntryPath, err)
			}
		}
	}

	return nil
}

// GsPackageMetadata holds metadata about a gs/ package
type GsPackageMetadata struct {
	// Dependencies lists the import paths that this gs/ package requires
	Dependencies []string        `json:"dependencies,omitempty"`
	AsyncMethods map[string]bool `json:"asyncMethods,omitempty"`
}

// ReadGsPackageMetadata reads dependency metadata from meta.json file in a gs/ package
func (c *Compiler) ReadGsPackageMetadata(gsSourcePath string) (*GsPackageMetadata, error) {
	metadata := &GsPackageMetadata{
		Dependencies: []string{},
		AsyncMethods: make(map[string]bool),
	}

	// Try to read meta.json file
	metaFilePath := filepath.Join(gsSourcePath, "meta.json")
	content, err := gs.GsOverrides.ReadFile(metaFilePath)
	if err != nil {
		// Only treat missing file as "no metadata"; surface other errors
		if os.IsNotExist(err) {
			return metadata, nil
		}
		return nil, fmt.Errorf("failed to read meta.json in %s: %w", gsSourcePath, err)
	}

	// Parse the JSON content
	if err := json.Unmarshal(content, metadata); err != nil {
		return metadata, fmt.Errorf("failed to parse meta.json in %s: %w", gsSourcePath, err)
	}

	return metadata, nil
}

// copyGsPackageWithDependencies copies a gs/ package and all its dependencies recursively
// It tracks already processed packages to avoid infinite loops and duplicate work
func (c *Compiler) copyGsPackageWithDependencies(packagePath string, processedPackages map[string]bool, result *CompilationResult) error {
	// Check if we've already processed this package
	if processedPackages[packagePath] {
		return nil
	}

	// Mark this package as being processed
	processedPackages[packagePath] = true

	gsSourcePath := "gs/" + packagePath

	// Check if the gs package actually exists
	_, gsErr := gs.GsOverrides.ReadDir(gsSourcePath)
	if gsErr != nil {
		if os.IsNotExist(gsErr) {
			c.le.Debugf("gs package %s does not exist, skipping", packagePath)
			return nil
		}
		return gsErr
	}

	// Read metadata to get dependencies
	metadata, err := c.ReadGsPackageMetadata(gsSourcePath)
	if err != nil {
		// Surface metadata errors instead of silently continuing
		return fmt.Errorf("failed to read metadata for gs package %s: %w", packagePath, err)
	}

	// Log dependencies if any are found
	/*
		if len(metadata.Dependencies) > 0 {
			c.le.Debugf("Package %s has dependencies: %v", packagePath, metadata.Dependencies)
		}
	*/

	// First, recursively process all dependencies
	for _, depPath := range metadata.Dependencies {
		if err := c.copyGsPackageWithDependencies(depPath, processedPackages, result); err != nil {
			return fmt.Errorf("failed to copy dependency %s of package %s: %w", depPath, packagePath, err)
		}
	}

	// Now copy the package itself
	// c.le.Debugf("Copying handwritten package %s to output directory", packagePath)

	// Compute output path for this package
	outputPath := ComputeModulePath(c.config.OutputPath, packagePath)

	// Create the output directory
	if err := os.MkdirAll(outputPath, 0o755); err != nil {
		return fmt.Errorf("failed to create output directory for %s: %w", packagePath, err)
	}

	// Copy files from embedded FS to output directory
	if err := c.copyEmbeddedPackage(gsSourcePath, outputPath); err != nil {
		return fmt.Errorf("failed to copy embedded package %s: %w", packagePath, err)
	}

	result.CopiedPackages = append(result.CopiedPackages, packagePath)
	return nil
}
