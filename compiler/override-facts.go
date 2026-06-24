package compiler

import (
	"bytes"
	"context"
	"errors"
	"go/ast"
	"go/parser"
	"go/token"
	"io"
	"io/fs"
	"maps"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"slices"
	"strings"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
	gs "github.com/s4wave/goscript"
)

var (
	overrideBehaviorTestIdentifierPattern      = regexp.MustCompile(`\b[A-Za-z_$][A-Za-z0-9_$]*\b`)
	overrideBehaviorTestNamedImportPattern     = regexp.MustCompile(`(?s)import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"]\.[^'"]*['"]`)
	overrideBehaviorTestNamespaceImportPattern = regexp.MustCompile(`import\s+\*\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*)\s+from\s+['"]\.[^'"]*['"]`)
)

// OverrideFacts is the immutable compiler-visible view of GoScript overrides.
type OverrideFacts struct {
	packages map[string]overridePackageFacts
}

type overridePackageFacts struct {
	metadata            OverrideMetadata
	parity              overrideParityLedger
	behaviorTestSymbols map[string]bool
	copyPackage         overrideCopyPackage
	dependencies        []string
}

type overridePackageRoot struct {
	pkgPath string
	fsys    fs.FS
	dir     string
}

// HasPackage returns true when pkgPath has a GoScript override package.
func (f *OverrideFacts) HasPackage(pkgPath string) bool {
	if f == nil || pkgPath == "" {
		return false
	}
	_, ok := f.packages[pkgPath]
	return ok
}

// Metadata returns compiler-visible override metadata for a package path.
func (f *OverrideFacts) Metadata(pkgPath string) OverrideMetadata {
	if f == nil {
		return newOverrideMetadata()
	}
	pkg := f.packages[pkgPath]
	return cloneOverrideMetadata(pkg.metadata)
}

func (f *OverrideFacts) parityLedger(pkgPath string) overrideParityLedger {
	if f == nil {
		return newOverrideParityLedger()
	}
	pkg := f.packages[pkgPath]
	return cloneOverrideParityLedger(pkg.parity)
}

func (f *OverrideFacts) behaviorTestSymbols(pkgPath string) map[string]bool {
	if f == nil {
		return nil
	}
	pkg := f.packages[pkgPath]
	return cloneBoolMap(pkg.behaviorTestSymbols)
}

// IsMethodAsync returns true when override metadata marks a method async.
func (f *OverrideFacts) IsMethodAsync(pkgPath, method string) bool {
	if f == nil {
		return false
	}
	pkg := f.packages[pkgPath]
	return pkg.metadata.AsyncMethods[method]
}

// IsFunctionAsync returns true when override metadata marks a package-level function async.
func (f *OverrideFacts) IsFunctionAsync(pkgPath, function string) bool {
	if f == nil {
		return false
	}
	pkg := f.packages[pkgPath]
	return pkg.metadata.AsyncFunctions[function]
}

func (f *OverrideFacts) copyPackage(pkgPath string) (overrideCopyPackage, []string, bool) {
	if f == nil {
		return overrideCopyPackage{}, nil, false
	}
	pkg, ok := f.packages[pkgPath]
	if !ok {
		return overrideCopyPackage{}, nil, false
	}
	return cloneOverrideCopyPackage(pkg.copyPackage), slices.Clone(pkg.dependencies), true
}

func (f *OverrideFacts) importPackageRoot(importPath string) (string, bool) {
	if f == nil {
		return "", false
	}
	importPath = strings.TrimPrefix(importPath, "@goscript/")
	importPath = strings.TrimSuffix(importPath, ".js")
	importPath = strings.TrimSuffix(importPath, ".ts")
	if before, ok := strings.CutSuffix(importPath, "/index"); ok {
		importPath = before
	}
	parts := strings.Split(importPath, "/")
	for idx := len(parts); idx > 0; idx-- {
		candidate := strings.Join(parts[:idx], "/")
		if f.HasPackage(candidate) {
			return candidate, true
		}
	}
	return "", false
}

func buildOverrideFacts(ctx context.Context, overrideDirs []string) (*OverrideFacts, []Diagnostic) {
	roots, diagnostics := discoverOverridePackageRoots(overrideDirs)
	if diagnosticsHaveErrors(diagnostics) {
		return nil, diagnostics
	}
	paths := make([]string, 0, len(roots))
	for pkgPath := range roots {
		paths = append(paths, pkgPath)
	}
	slices.Sort(paths)

	facts := &OverrideFacts{packages: make(map[string]overridePackageFacts, len(paths))}
	goldenBehaviorTests := loadGoldenBehaviorTests()
	for _, pkgPath := range paths {
		if err := ctx.Err(); err != nil {
			return facts, []Diagnostic{contextCanceledDiagnostic(err)}
		}
		metadata, err := loadOverrideMetadata(roots[pkgPath])
		if err != nil {
			diagnostics = append(diagnostics, overrideError("read override metadata", pkgPath, err))
			continue
		}
		parity, err := loadOverrideParityLedger(roots[pkgPath])
		if err != nil {
			diagnostics = append(diagnostics, overrideError("read override parity ledger", pkgPath, err))
			continue
		}
		copyPackage, dependencies, packageDiagnostics := loadOverrideCopyPackage(roots[pkgPath], roots, metadata)
		diagnostics = append(diagnostics, packageDiagnostics...)
		if diagnosticsHaveErrors(packageDiagnostics) {
			continue
		}
		behaviorTests, err := loadOverrideBehaviorTests(roots[pkgPath], roots)
		if err != nil {
			diagnostics = append(diagnostics, overrideError("read override behavior tests", pkgPath, err))
			continue
		}
		maps.Copy(behaviorTests, goldenBehaviorTests[pkgPath])
		facts.packages[pkgPath] = overridePackageFacts{
			metadata:            cloneOverrideMetadata(metadata),
			parity:              cloneOverrideParityLedger(parity),
			behaviorTestSymbols: behaviorTests,
			copyPackage:         copyPackage,
			dependencies:        dependencies,
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return facts, diagnostics
	}
	return facts, diagnostics
}

func discoverOverridePackageRoots(overrideDirs []string) (map[string]overridePackageRoot, []Diagnostic) {
	roots := make(map[string]overridePackageRoot)
	var diagnostics []Diagnostic
	for _, dir := range overrideDirs {
		dir = strings.TrimSpace(dir)
		if dir == "" {
			continue
		}
		abs, err := filepath.Abs(dir)
		if err != nil {
			diagnostics = append(diagnostics, overrideError("resolve override directory", dir, err))
			continue
		}
		if err := discoverOverridePackageRootsInFS(roots, os.DirFS(abs), ".", false); err != nil {
			diagnostics = append(diagnostics, overrideError("discover override packages", abs, err))
		}
	}
	if err := discoverOverridePackageRootsInFS(roots, gs.GsOverrides, "gs", true); err != nil {
		diagnostics = append(diagnostics, overrideError("discover override packages", "embedded gs", err))
	}
	return roots, diagnostics
}

func discoverOverridePackageRootsInFS(
	roots map[string]overridePackageRoot,
	fsys fs.FS,
	rootDir string,
	embedded bool,
) error {
	return fs.WalkDir(fsys, rootDir, func(filePath string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() || path.Base(filePath) != "index.ts" {
			return nil
		}
		pkgPath := strings.TrimPrefix(path.Dir(filePath), rootDir+"/")
		if rootDir == "." {
			pkgPath = path.Dir(filePath)
		}
		if pkgPath != "." && pkgPath != "" {
			if _, exists := roots[pkgPath]; !exists || !embedded {
				roots[pkgPath] = overridePackageRoot{
					pkgPath: pkgPath,
					fsys:    fsys,
					dir:     path.Dir(filePath),
				}
			}
		}
		return nil
	})
}

func loadOverrideMetadata(root overridePackageRoot) (OverrideMetadata, error) {
	metadata := newOverrideMetadata()
	data, err := fs.ReadFile(root.fsys, path.Join(root.dir, "meta.json"))
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return metadata, nil
		}
		return OverrideMetadata{}, err
	}

	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "dependencies":
			for iter.ReadArray() {
				metadata.Dependencies = append(metadata.Dependencies, iter.ReadString())
			}
		case "asyncMethods":
			for method := iter.ReadObject(); method != ""; method = iter.ReadObject() {
				metadata.AsyncMethods[method] = iter.ReadBool()
			}
		case "asyncFunctions":
			for function := iter.ReadObject(); function != ""; function = iter.ReadObject() {
				metadata.AsyncFunctions[function] = iter.ReadBool()
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return OverrideMetadata{}, iter.Error
	}
	return metadata, nil
}

func loadOverrideCopyPackage(
	root overridePackageRoot,
	roots map[string]overridePackageRoot,
	metadata OverrideMetadata,
) (overrideCopyPackage, []string, []Diagnostic) {
	pkgPath := root.pkgPath
	if _, ok := roots[pkgPath]; !ok {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:missing-package",
			Message:  "override package does not exist",
			Detail:   pkgPath,
		}}
	}

	facts := &OverrideFacts{packages: make(map[string]overridePackageFacts, len(roots))}
	for root := range roots {
		facts.packages[root] = overridePackageFacts{}
	}

	copyPackage := overrideCopyPackage{path: pkgPath}
	dependencySet := make(map[string]bool)
	for _, dependency := range metadata.Dependencies {
		dependency = strings.TrimSpace(dependency)
		if dependency != "" && dependency != pkgPath {
			dependencySet[dependency] = true
		}
	}

	err := fs.WalkDir(root.fsys, root.dir, func(filePath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			nestedPkg := strings.TrimPrefix(filePath, root.dir+"/")
			if root.dir == "." {
				nestedPkg = filePath
			} else if nestedPkg != filePath {
				nestedPkg = path.Join(pkgPath, nestedPkg)
			}
			if _, ok := roots[nestedPkg]; nestedPkg != pkgPath && ok {
				return fs.SkipDir
			}
			return nil
		}
		if !isOverrideSourceFile(filePath) {
			return nil
		}
		data, readErr := fs.ReadFile(root.fsys, filePath)
		if readErr != nil {
			return readErr
		}
		rel := strings.TrimPrefix(filePath, root.dir+"/")
		if root.dir == "." {
			rel = filePath
		} else if rel != filePath {
			rel = path.Join(pkgPath, rel)
		}
		copyPackage.files = append(copyPackage.files, overrideCopyFile{
			path: rel,
			data: data,
		})
		for _, imported := range scanOverrideImports(string(data)) {
			dependency, ok := facts.importPackageRoot(imported)
			if ok && dependency != "builtin" && dependency != pkgPath {
				dependencySet[dependency] = true
			}
		}
		return nil
	})
	if err != nil {
		return overrideCopyPackage{}, nil, []Diagnostic{overrideError("read override package", pkgPath, err)}
	}

	if len(copyPackage.files) == 0 {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:empty-package",
			Message:  "override package does not contain TypeScript source files",
			Detail:   pkgPath,
		}}
	}
	slices.SortFunc(copyPackage.files, func(a, b overrideCopyFile) int {
		return strings.Compare(a.path, b.path)
	})

	dependencies := make([]string, 0, len(dependencySet))
	for dependency := range dependencySet {
		dependencies = append(dependencies, dependency)
	}
	slices.Sort(dependencies)
	return copyPackage, dependencies, nil
}

func loadOverrideBehaviorTests(
	root overridePackageRoot,
	roots map[string]overridePackageRoot,
) (map[string]bool, error) {
	symbols := make(map[string]bool)
	err := fs.WalkDir(root.fsys, root.dir, func(filePath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			nestedPkg := strings.TrimPrefix(filePath, root.dir+"/")
			if root.dir == "." {
				nestedPkg = filePath
			} else if nestedPkg != filePath {
				nestedPkg = path.Join(root.pkgPath, nestedPkg)
			}
			if _, ok := roots[nestedPkg]; nestedPkg != root.pkgPath && ok {
				return fs.SkipDir
			}
			return nil
		}
		if !strings.HasSuffix(filePath, ".test.ts") {
			return nil
		}
		data, readErr := fs.ReadFile(root.fsys, filePath)
		if readErr != nil {
			return readErr
		}
		maps.Copy(symbols, scanOverrideBehaviorTestSymbols(string(data)))
		return nil
	})
	if err != nil {
		return nil, err
	}
	return symbols, nil
}

func scanOverrideBehaviorTestSymbols(data string) map[string]bool {
	body := stripTypeScriptCommentsAndStrings(typeScriptBodyWithoutImports(data))
	bodyIdentifiers := make(map[string]bool)
	for _, match := range overrideBehaviorTestIdentifierPattern.FindAllString(body, -1) {
		bodyIdentifiers[match] = true
	}

	symbols := make(map[string]bool)
	for _, match := range overrideBehaviorTestNamedImportPattern.FindAllStringSubmatch(data, -1) {
		if match[1] != "" {
			continue
		}
		for _, namedImport := range parseNamedTypeScriptExports(match[2], false) {
			if bodyIdentifiers[namedImport.target] {
				symbols[namedImport.source] = true
			}
		}
	}
	for _, match := range overrideBehaviorTestNamespaceImportPattern.FindAllStringSubmatch(data, -1) {
		namespaceSelectorPattern := regexp.MustCompile(`\b` + regexp.QuoteMeta(match[1]) + `\.([A-Za-z_$][A-Za-z0-9_$]*)\b`)
		for _, selector := range namespaceSelectorPattern.FindAllStringSubmatch(body, -1) {
			symbols[selector[1]] = true
		}
	}
	return symbols
}

func typeScriptBodyWithoutImports(data string) string {
	var body strings.Builder
	inImport := false
	for line := range strings.SplitAfterSeq(data, "\n") {
		trimmed := strings.TrimSpace(line)
		if !inImport && strings.HasPrefix(trimmed, "import ") {
			if !strings.Contains(trimmed, " from ") &&
				!strings.HasPrefix(trimmed, `import "`) &&
				!strings.HasPrefix(trimmed, `import '`) {
				inImport = true
			}
			body.WriteByte('\n')
			continue
		}
		if inImport {
			if strings.Contains(trimmed, " from ") {
				inImport = false
			}
			body.WriteByte('\n')
			continue
		}
		body.WriteString(line)
	}
	return body.String()
}

func stripTypeScriptCommentsAndStrings(data string) string {
	var body strings.Builder
	const (
		modeCode = iota
		modeLineComment
		modeBlockComment
		modeSingleString
		modeDoubleString
		modeTemplateString
	)
	mode := modeCode
	escaped := false
	for i := 0; i < len(data); i++ {
		ch := data[i]
		next := byte(0)
		if i+1 < len(data) {
			next = data[i+1]
		}
		switch mode {
		case modeCode:
			switch {
			case ch == '/' && next == '/':
				body.WriteByte(' ')
				body.WriteByte(' ')
				i++
				mode = modeLineComment
			case ch == '/' && next == '*':
				body.WriteByte(' ')
				body.WriteByte(' ')
				i++
				mode = modeBlockComment
			case ch == '\'':
				body.WriteByte(' ')
				mode = modeSingleString
			case ch == '"':
				body.WriteByte(' ')
				mode = modeDoubleString
			case ch == '`':
				body.WriteByte(' ')
				mode = modeTemplateString
			default:
				body.WriteByte(ch)
			}
		case modeLineComment:
			if ch == '\n' {
				body.WriteByte(ch)
				mode = modeCode
				continue
			}
			body.WriteByte(' ')
		case modeBlockComment:
			if ch == '*' && next == '/' {
				body.WriteByte(' ')
				body.WriteByte(' ')
				i++
				mode = modeCode
				continue
			}
			if ch == '\n' {
				body.WriteByte(ch)
				continue
			}
			body.WriteByte(' ')
		case modeSingleString, modeDoubleString, modeTemplateString:
			quote := byte('\'')
			if mode == modeDoubleString {
				quote = '"'
			}
			if mode == modeTemplateString {
				quote = '`'
			}
			if ch == '\n' {
				body.WriteByte(ch)
				escaped = false
				if mode != modeTemplateString {
					mode = modeCode
				}
				continue
			}
			body.WriteByte(' ')
			if escaped {
				escaped = false
				continue
			}
			if ch == '\\' {
				escaped = true
				continue
			}
			if ch == quote {
				mode = modeCode
			}
		}
	}
	return body.String()
}

func loadGoldenBehaviorTests() map[string]map[string]bool {
	testsDir, ok := findGoldenTestsDir()
	if !ok {
		return nil
	}
	result := make(map[string]map[string]bool)
	_ = filepath.WalkDir(testsDir, func(filePath string, entry fs.DirEntry, err error) error {
		if err != nil || entry.IsDir() || filepath.Ext(filePath) != ".go" {
			return nil
		}
		file, parseErr := parser.ParseFile(token.NewFileSet(), filePath, nil, parser.SkipObjectResolution)
		if parseErr != nil {
			return nil
		}
		importAliases := make(map[string]string)
		dotImports := make(map[string]bool)
		for _, spec := range file.Imports {
			if spec.Path == nil {
				continue
			}
			pkgPath := strings.Trim(spec.Path.Value, `"`)
			if spec.Name != nil {
				switch spec.Name.Name {
				case ".":
					dotImports[pkgPath] = true
				case "_":
				default:
					importAliases[spec.Name.Name] = pkgPath
				}
				continue
			}
			importAliases[path.Base(pkgPath)] = pkgPath
		}
		if len(importAliases) == 0 && len(dotImports) == 0 {
			return nil
		}
		ast.Inspect(file, func(node ast.Node) bool {
			switch expr := node.(type) {
			case *ast.SelectorExpr:
				ident, ok := expr.X.(*ast.Ident)
				if !ok {
					return true
				}
				pkgPath, ok := importAliases[ident.Name]
				if !ok {
					return true
				}
				addBehaviorTestSymbol(result, pkgPath, expr.Sel.Name)
			case *ast.Ident:
				for pkgPath := range dotImports {
					addBehaviorTestSymbol(result, pkgPath, expr.Name)
				}
			}
			return true
		})
		return nil
	})
	return result
}

func findGoldenTestsDir() (string, bool) {
	wd, err := os.Getwd()
	if err != nil {
		return "", false
	}
	for {
		candidate := filepath.Join(wd, "tests", "tests")
		if info, statErr := os.Stat(candidate); statErr == nil && info.IsDir() {
			return candidate, true
		}
		parent := filepath.Dir(wd)
		if parent == wd {
			return "", false
		}
		wd = parent
	}
}

func addBehaviorTestSymbol(index map[string]map[string]bool, pkgPath, symbol string) {
	if pkgPath == "" || symbol == "" {
		return
	}
	if index[pkgPath] == nil {
		index[pkgPath] = make(map[string]bool)
	}
	index[pkgPath][symbol] = true
}

func newOverrideMetadata() OverrideMetadata {
	return OverrideMetadata{
		AsyncFunctions: make(map[string]bool),
		AsyncMethods:   make(map[string]bool),
	}
}

func cloneOverrideMetadata(metadata OverrideMetadata) OverrideMetadata {
	return OverrideMetadata{
		Dependencies:   slices.Clone(metadata.Dependencies),
		AsyncFunctions: cloneBoolMap(metadata.AsyncFunctions),
		AsyncMethods:   cloneBoolMap(metadata.AsyncMethods),
	}
}

func cloneBoolMap(values map[string]bool) map[string]bool {
	cloned := make(map[string]bool, len(values))
	maps.Copy(cloned, values)
	return cloned
}

func cloneOverrideCopyPackage(pkg overrideCopyPackage) overrideCopyPackage {
	cloned := overrideCopyPackage{
		path:  pkg.path,
		files: make([]overrideCopyFile, 0, len(pkg.files)),
	}
	for _, file := range pkg.files {
		cloned.files = append(cloned.files, overrideCopyFile{
			path: file.path,
			data: bytes.Clone(file.data),
		})
	}
	return cloned
}
