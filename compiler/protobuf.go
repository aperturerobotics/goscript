package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/tools/go/packages"
)

// getProtobufMessageInterface attempts to find the protobuf-go-lite Message interface
// from the loaded packages in analysis. Returns nil if not found.
func (c *GoToTSCompiler) getProtobufMessageInterface() *types.Interface {
	if c.analysis == nil || c.analysis.AllPackages == nil {
		return nil
	}
	pkg := c.analysis.AllPackages["github.com/aperturerobotics/protobuf-go-lite"]
	if pkg == nil || pkg.Types == nil {
		return nil
	}
	obj := pkg.Types.Scope().Lookup("Message")
	if obj == nil {
		return nil
	}
	if tn, ok := obj.(*types.TypeName); ok {
		if iface, ok := tn.Type().Underlying().(*types.Interface); ok {
			return iface
		}
	}
	return nil
}

// typeHasMethods returns true if the given type's method set contains all the specified names.
func (c *GoToTSCompiler) typeHasMethods(t types.Type, names ...string) bool {
	mset := types.NewMethodSet(t)
	for _, name := range names {
		if mset.Lookup(nil, name) == nil {
			return false
		}
	}
	return true
}

// convertProtobufFieldName converts Go PascalCase field names to TypeScript camelCase
// for protobuf types (e.g., ExampleField -> exampleField)
func (c *GoToTSCompiler) convertProtobufFieldName(goFieldName string) string {
	if len(goFieldName) == 0 {
		return goFieldName
	}

	// Convert first character to lowercase if ASCII uppercase
	runes := []rune(goFieldName)
	if runes[0] >= 'A' && runes[0] <= 'Z' {
		runes[0] = runes[0] + ('a' - 'A')
	}
	return string(runes)
}

// isProtobufGoLitePackage checks if a package path is a protobuf-go-lite package
// that should be skipped during compilation
func isProtobufGoLitePackage(pkgPath string) bool {
	// Skip the main protobuf-go-lite package and all its subpackages
	if strings.HasPrefix(pkgPath, "github.com/aperturerobotics/protobuf-go-lite") {
		return true
	}
	// Skip json-iterator-lite which is used by protobuf-go-lite
	if strings.HasPrefix(pkgPath, "github.com/aperturerobotics/json-iterator-lite") {
		return true
	}
	return false
}

// isPackageOnlyUsedByProtobufFiles checks if a package is only imported by .pb.go files
// in the given package, which means we can skip compiling it
func isPackageOnlyUsedByProtobufFiles(pkg *packages.Package, importedPkgPath string) bool {
	// Check all files in the package to see which ones import the given package
	usedByNonPbFiles := false
	usedByPbFiles := false

	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		isPbFile := strings.HasSuffix(filepath.Base(fileName), ".pb.go")

		// Check if this file imports the package
		for _, imp := range syntax.Imports {
			if imp.Path != nil {
				importPath := strings.Trim(imp.Path.Value, `"`)
				if importPath == importedPkgPath {
					if isPbFile {
						usedByPbFiles = true
					} else {
						usedByNonPbFiles = true
					}
					break
				}
			}
		}
	}

	// If the package is only used by .pb.go files and not by regular files, we can skip it
	return usedByPbFiles && !usedByNonPbFiles
}

// copyProtobufTSFile copies a .pb.ts file to the output directory
func (c *PackageCompiler) copyProtobufTSFile(sourcePath, fileName string) error {
	// Read the source file
	content, err := os.ReadFile(sourcePath)
	if err != nil {
		return fmt.Errorf("failed to read protobuf .pb.ts file %s: %w", sourcePath, err)
	}

	// Ensure output directory exists
	if err := os.MkdirAll(c.outputPath, 0o755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	// Write to output directory
	outputPath := filepath.Join(c.outputPath, fileName)
	if err := os.WriteFile(outputPath, content, 0o644); err != nil {
		return fmt.Errorf("failed to write protobuf .pb.ts file to %s: %w", outputPath, err)
	}

	return nil
}

// writeProtobufExports writes exports for a protobuf file to the index.ts file
func (c *PackageCompiler) writeProtobufExports(indexFile *os.File, fileName string) error {
	// For protobuf files, try to parse the copied .pb.ts file in the output directory
	// to discover exported symbols and re-export them from the index. This avoids
	// hard-coding names like ExampleMsg and protobufPackage.

	pbTsPath := filepath.Join(c.outputPath, fileName+".ts")
	content, err := os.ReadFile(pbTsPath)
	if err != nil {
		return err
	}

	// Very simple export discovery: capture names from
	//  - export const Name
	//  - export interface Name
	//  - export class Name
	//  - export function Name
	// We avoid type-only exports for now.
	var exports []string
	lines := strings.Split(string(content), "\n")
	for _, ln := range lines {
		l := strings.TrimSpace(ln)
		if strings.HasPrefix(l, "export const ") {
			rest := strings.TrimPrefix(l, "export const ")
			name := takeIdent(rest)
			if name != "" {
				exports = append(exports, name)
			}
			continue
		}
		if strings.HasPrefix(l, "export interface ") {
			rest := strings.TrimPrefix(l, "export interface ")
			name := takeIdent(rest)
			if name != "" {
				exports = append(exports, name)
			}
			continue
		}
		if strings.HasPrefix(l, "export class ") {
			rest := strings.TrimPrefix(l, "export class ")
			name := takeIdent(rest)
			if name != "" {
				exports = append(exports, name)
			}
			continue
		}
		if strings.HasPrefix(l, "export function ") {
			rest := strings.TrimPrefix(l, "export function ")
			name := takeIdent(rest)
			if name != "" {
				exports = append(exports, name)
			}
			continue
		}
	}

	// If nothing found, fallback to default
	if len(exports) == 0 {
		return fmt.Errorf("no exported symbols discovered in %s.ts while generating protobuf exports", fileName)
	}

	// Deduplicate while preserving order
	seen := map[string]bool{}
	uniq := make([]string, 0, len(exports))
	for _, n := range exports {
		if !seen[n] {
			seen[n] = true
			uniq = append(uniq, n)
		}
	}

	exportLine := fmt.Sprintf("export { %s } from \"./%s.js\"\n", strings.Join(uniq, ", "), fileName)
	_, err = indexFile.WriteString(exportLine)
	return err
}

// takeIdent extracts a leading identifier token from the beginning of s.
// Returns an empty string if no valid identifier is found.
func takeIdent(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}
	// Identifier: letter or _ followed by letters, digits, or _
	var b strings.Builder
	for i, r := range s {
		if i == 0 {
			if !(r == '_' || r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z') {
				break
			}
			b.WriteRune(r)
			continue
		}
		if r == '_' || r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z' || r >= '0' && r <= '9' {
			b.WriteRune(r)
			continue
		}
		break
	}
	return b.String()
}

// addProtobufImports adds imports for protobuf types when .pb.ts files are present in the package
func (c *FileCompiler) addProtobufImports() error {
	// Check if there are any .pb.go files in this package that have corresponding .pb.ts files
	packageDir := filepath.Dir(c.fullPath)

	for _, fileName := range c.pkg.CompiledGoFiles {
		baseFileName := filepath.Base(fileName)
		if strings.HasSuffix(baseFileName, ".pb.go") {
			// Check if there's a corresponding .pb.ts file
			pbTsFileName := strings.TrimSuffix(baseFileName, ".pb.go") + ".pb.ts"
			pbTsPath := filepath.Join(packageDir, pbTsFileName)

			if _, err := os.Stat(pbTsPath); err == nil {
				// .pb.ts file exists, parse it for exports and add imports accordingly
				pbBaseName := strings.TrimSuffix(baseFileName, ".pb.go")

				content, rerr := os.ReadFile(pbTsPath)
				if rerr != nil {
					return fmt.Errorf("failed to read %s for protobuf imports: %w", pbTsPath, rerr)
				}

				// Discover exported identifiers (const/interface/class/function)
				var exports []string
				for _, ln := range strings.Split(string(content), "\n") {
					l := strings.TrimSpace(ln)
					if strings.HasPrefix(l, "export const ") {
						if name := takeIdent(strings.TrimPrefix(l, "export const ")); name != "" {
							exports = append(exports, name)
						}
						continue
					}
					if strings.HasPrefix(l, "export interface ") {
						if name := takeIdent(strings.TrimPrefix(l, "export interface ")); name != "" {
							exports = append(exports, name)
						}
						continue
					}
					if strings.HasPrefix(l, "export class ") {
						if name := takeIdent(strings.TrimPrefix(l, "export class ")); name != "" {
							exports = append(exports, name)
						}
						continue
					}
					if strings.HasPrefix(l, "export function ") {
						if name := takeIdent(strings.TrimPrefix(l, "export function ")); name != "" {
							exports = append(exports, name)
						}
						continue
					}
				}

				if len(exports) == 0 {
					return fmt.Errorf("no exported symbols discovered in %s for protobuf imports", pbTsPath)
				}

				// Deduplicate
				seen := map[string]bool{}
				uniq := make([]string, 0, len(exports))
				for _, n := range exports {
					if !seen[n] {
						seen[n] = true
						uniq = append(uniq, n)
					}
				}

				c.codeWriter.WriteLinef("import { %s } from \"./%s.pb.js\";", strings.Join(uniq, ", "), pbBaseName)
				break
			}
		}
	}

	return nil
}

// isProtobufMethodCall checks if a call expression is a protobuf method call
func (c *GoToTSCompiler) isProtobufMethodCall(callExpr *ast.CallExpr, methodName string) bool {
	if selectorExpr, ok := callExpr.Fun.(*ast.SelectorExpr); ok {
		if selectorExpr.Sel.Name == methodName {
			if receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X); receiverType != nil {
				// Handle pointer types
				if ptrType, ok := receiverType.(*types.Pointer); ok {
					receiverType = ptrType.Elem()
				}
				isProtobuf := c.isProtobufType(receiverType)
				return isProtobuf
			}
		}
	}
	return false
}

// writeProtobufMarshalAssignment handles: data, err := msg.MarshalVT()
// Generates: const data = ExampleMsg.toBinary(msg); const err = null;
func (c *GoToTSCompiler) writeProtobufMarshalAssignment(lhs []ast.Expr, callExpr *ast.CallExpr, tok token.Token) error {
	if len(lhs) != 2 {
		return fmt.Errorf("protobuf marshal assignment requires exactly 2 LHS variables, got %d", len(lhs))
	}

	selectorExpr := callExpr.Fun.(*ast.SelectorExpr)
	receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X)
	if ptrType, ok := receiverType.(*types.Pointer); ok {
		receiverType = ptrType.Elem()
	}

	// Get the type name for the static method call
	var typeName string
	if namedType, ok := receiverType.(*types.Named); ok {
		typeName = namedType.Obj().Name()
	} else {
		return fmt.Errorf("could not determine protobuf type name")
	}

	// Handle data variable
	dataExpr := lhs[0]
	if dataIdent, ok := dataExpr.(*ast.Ident); ok && dataIdent.Name != "_" {
		if tok == token.DEFINE {
			c.tsw.WriteLiterally("const ")
		}
		c.tsw.WriteLiterally(dataIdent.Name)
		c.tsw.WriteLiterally(" = ")
		c.tsw.WriteLiterally(typeName)
		c.tsw.WriteLiterally(".toBinary(")
		if err := c.WriteValueExpr(selectorExpr.X); err != nil {
			return fmt.Errorf("failed to write receiver for MarshalVT: %w", err)
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")
	}

	// Handle err variable with proper type annotation
	errExpr := lhs[1]
	if errIdent, ok := errExpr.(*ast.Ident); ok && errIdent.Name != "_" {
		if tok == token.DEFINE {
			c.tsw.WriteLiterally("let ")
		}
		c.tsw.WriteLiterally(errIdent.Name)
		c.tsw.WriteLiterally(": $.GoError | null = null as $.GoError | null")
		c.tsw.WriteLine("")
	}

	return nil
}

// writeProtobufUnmarshalAssignment handles: err = out.UnmarshalVT(data)
// Generates: out = ExampleMsg.fromBinary(data); err = null;
func (c *GoToTSCompiler) writeProtobufUnmarshalAssignment(lhs []ast.Expr, callExpr *ast.CallExpr) error {
	if len(lhs) != 1 {
		return fmt.Errorf("protobuf unmarshal assignment requires exactly 1 LHS variable, got %d", len(lhs))
	}

	selectorExpr := callExpr.Fun.(*ast.SelectorExpr)
	receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X)
	if ptrType, ok := receiverType.(*types.Pointer); ok {
		receiverType = ptrType.Elem()
	}

	// Get the type name for the static method call
	var typeName string
	if namedType, ok := receiverType.(*types.Named); ok {
		typeName = namedType.Obj().Name()
	} else {
		return fmt.Errorf("could not determine protobuf type name")
	}

	// The LHS should be the err variable, but we need to assign to the receiver instead
	errExpr := lhs[0]
	if errIdent, ok := errExpr.(*ast.Ident); ok {
		// First, assign the result of fromBinary to the receiver
		if err := c.WriteValueExpr(selectorExpr.X); err != nil {
			return fmt.Errorf("failed to write receiver for UnmarshalVT: %w", err)
		}
		c.tsw.WriteLiterally(" = ")
		c.tsw.WriteLiterally(typeName)
		c.tsw.WriteLiterally(".fromBinary(")
		if len(callExpr.Args) > 0 {
			c.tsw.WriteLiterally("$.normalizeBytes(")
			if err := c.WriteValueExpr(callExpr.Args[0]); err != nil {
				return fmt.Errorf("failed to write argument for UnmarshalVT: %w", err)
			}
			c.tsw.WriteLiterally(")")
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")

		// Then set err to null (but only if it's not a blank identifier)
		// Note: We don't set err = null here because err was declared as const
		// The error handling will be skipped since err is always null for protobuf-es-lite
		if errIdent.Name != "_" {
			// Actually reassign err to maintain proper typing for subsequent error checks
			c.tsw.WriteLiterally(errIdent.Name)
			c.tsw.WriteLiterally(" = null as $.GoError | null")
			c.tsw.WriteLine("")
		}
	}

	return nil
}

// writeProtobufMethodCall handles protobuf method calls in expression context
// Returns true if the call was handled as a protobuf method, false otherwise
func (c *GoToTSCompiler) writeProtobufMethodCall(exp *ast.CallExpr) (bool, error) {
	selectorExpr, ok := exp.Fun.(*ast.SelectorExpr)
	if !ok {
		return false, nil
	}

	methodName := selectorExpr.Sel.Name

	// Check if this is a protobuf method call
	if methodName == "MarshalVT" || methodName == "UnmarshalVT" || methodName == "MarshalJSON" || methodName == "UnmarshalJSON" {
		// Get the receiver type
		if receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X); receiverType != nil {
			// Handle pointer types
			if ptrType, ok := receiverType.(*types.Pointer); ok {
				receiverType = ptrType.Elem()
			}

			// Check if the receiver is a protobuf type
			if c.isProtobufType(receiverType) {
				if namedType, ok := receiverType.(*types.Named); ok {
					typeName := namedType.Obj().Name()

					switch methodName {
					case "MarshalVT":
						// Transform msg.MarshalVT() to ExampleMsg.toBinary(msg)
						c.tsw.WriteLiterally(typeName)
						c.tsw.WriteLiterally(".toBinary(")
						if err := c.WriteValueExpr(selectorExpr.X); err != nil {
							return true, fmt.Errorf("failed to write receiver for MarshalVT: %w", err)
						}
						c.tsw.WriteLiterally(")")
						return true, nil
					case "MarshalJSON":
						// Transform msg.MarshalJSON() to ExampleMsg.toJsonString(msg)
						c.tsw.WriteLiterally(typeName)
						c.tsw.WriteLiterally(".toJsonString(")
						if err := c.WriteValueExpr(selectorExpr.X); err != nil {
							return true, fmt.Errorf("failed to write receiver for MarshalJSON: %w", err)
						}
						c.tsw.WriteLiterally(")")
						return true, nil
					case "UnmarshalVT":
						// Transform out.UnmarshalVT(data) to ExampleMsg.fromBinary(data)
						c.tsw.WriteLiterally(typeName)
						c.tsw.WriteLiterally(".fromBinary($.normalizeBytes(")
						if len(exp.Args) > 0 {
							if err := c.WriteValueExpr(exp.Args[0]); err != nil {
								return true, fmt.Errorf("failed to write argument for UnmarshalVT: %w", err)
							}
						}
						c.tsw.WriteLiterally("))")
						return true, nil
					case "UnmarshalJSON":
						// Transform out.UnmarshalJSON(data) to ExampleMsg.fromJsonString(data)
						c.tsw.WriteLiterally(typeName)
						c.tsw.WriteLiterally(".fromJsonString(")
						if len(exp.Args) > 0 {
							if err := c.WriteValueExpr(exp.Args[0]); err != nil {
								return true, fmt.Errorf("failed to write argument for UnmarshalJSON: %w", err)
							}
						}
						c.tsw.WriteLiterally(")")
						return true, nil
					}
				}
			}
		}
	}

	return false, nil
}

// writeProtobufCompositeLit handles protobuf composite literals
// Returns true if the literal was handled as a protobuf type, false otherwise
func (c *GoToTSCompiler) writeProtobufCompositeLit(exp *ast.CompositeLit, litType types.Type) (bool, error) {
	// Check if this is a protobuf type
	var isProtobuf bool

	if nt, ok := litType.(*types.Named); ok {
		if c.isProtobufType(nt) {
			isProtobuf = true
		}
	} else if ptrType, ok := litType.(*types.Pointer); ok {
		if namedElem, ok := ptrType.Elem().(*types.Named); ok {
			if c.isProtobufType(namedElem) {
				isProtobuf = true
			}
		}
	}

	if !isProtobuf {
		return false, nil
	}

	// For protobuf types, use MessageType.create() instead of new Constructor()
	if _, ok := litType.(*types.Pointer); ok {
		// For pointer types, we need to get the element type
		if starExpr, ok := exp.Type.(*ast.StarExpr); ok {
			c.WriteTypeExpr(starExpr.X)
		} else {
			// Fallback: write the pointer type and use create
			c.WriteTypeExpr(exp.Type)
		}
	} else {
		c.WriteTypeExpr(exp.Type)
	}
	c.tsw.WriteLiterally(".create")

	return true, nil
}

// convertProtobufFieldNameInLiteral converts field names for protobuf composite literals
func (c *GoToTSCompiler) convertProtobufFieldNameInLiteral(keyName string, litType types.Type) string {
	// Check if this is a protobuf type
	if namedType, ok := litType.(*types.Named); ok {
		if c.isProtobufType(namedType) {
			return c.convertProtobufFieldName(keyName)
		}
	} else if ptrType, ok := litType.(*types.Pointer); ok {
		if namedElem, ok := ptrType.Elem().(*types.Named); ok {
			if c.isProtobufType(namedElem) {
				return c.convertProtobufFieldName(keyName)
			}
		}
	}
	return keyName
}

// writeProtobufMarshalJSONAssignment handles: data, err := msg.MarshalJSON()
// Generates: const data = ExampleMsg.toJsonString(msg); err = null;
func (c *GoToTSCompiler) writeProtobufMarshalJSONAssignment(lhs []ast.Expr, callExpr *ast.CallExpr, tok token.Token) error {
	if len(lhs) != 2 {
		return fmt.Errorf("protobuf marshal JSON assignment requires exactly 2 LHS variables, got %d", len(lhs))
	}

	selectorExpr := callExpr.Fun.(*ast.SelectorExpr)
	receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X)
	if ptrType, ok := receiverType.(*types.Pointer); ok {
		receiverType = ptrType.Elem()
	}

	// Get the type name for the static method call
	var typeName string
	if namedType, ok := receiverType.(*types.Named); ok {
		typeName = namedType.Obj().Name()
	} else {
		return fmt.Errorf("could not determine protobuf type name")
	}

	// Handle data variable (first variable)
	dataExpr := lhs[0]
	if dataIdent, ok := dataExpr.(*ast.Ident); ok && dataIdent.Name != "_" {
		// For := assignments, check if this is a new variable
		isNewVar := true
		if tok == token.DEFINE {
			// Check if the variable is already in scope by looking at Uses
			if obj := c.pkg.TypesInfo.Uses[dataIdent]; obj != nil {
				isNewVar = false
			}
		}

		if tok == token.DEFINE && isNewVar {
			c.tsw.WriteLiterally("const ")
		}
		c.tsw.WriteLiterally(dataIdent.Name)
		c.tsw.WriteLiterally(" = ")
		c.tsw.WriteLiterally(typeName)
		c.tsw.WriteLiterally(".toJsonString(")
		if err := c.WriteValueExpr(selectorExpr.X); err != nil {
			return fmt.Errorf("failed to write receiver for MarshalJSON: %w", err)
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")
	}

	// Handle err variable (second variable)
	errExpr := lhs[1]
	if errIdent, ok := errExpr.(*ast.Ident); ok && errIdent.Name != "_" {
		// For := assignments, check if this is a new variable
		isNewVar := true
		if tok == token.DEFINE {
			// Check if the variable is already in scope by looking at Uses
			if obj := c.pkg.TypesInfo.Uses[errIdent]; obj != nil {
				isNewVar = false
			}
		}

		if tok == token.DEFINE && isNewVar {
			c.tsw.WriteLiterally("let ")
		}
		c.tsw.WriteLiterally(errIdent.Name)
		if tok == token.DEFINE && isNewVar {
			c.tsw.WriteLiterally(": $.GoError | null")
		}
		c.tsw.WriteLiterally(" = null as $.GoError | null")
		c.tsw.WriteLine("")
	}

	return nil
}

// writeProtobufUnmarshalJSONAssignment handles: err = out.UnmarshalJSON(data)
// Generates: out = ExampleMsg.fromJsonString(data); err = null;
func (c *GoToTSCompiler) writeProtobufUnmarshalJSONAssignment(lhs []ast.Expr, callExpr *ast.CallExpr, tok token.Token) error {
	if len(lhs) != 1 {
		return fmt.Errorf("protobuf unmarshal JSON assignment requires exactly 1 LHS variable, got %d", len(lhs))
	}

	selectorExpr := callExpr.Fun.(*ast.SelectorExpr)
	receiverType := c.pkg.TypesInfo.TypeOf(selectorExpr.X)
	if ptrType, ok := receiverType.(*types.Pointer); ok {
		receiverType = ptrType.Elem()
	}

	// Get the type name for the static method call
	var typeName string
	if namedType, ok := receiverType.(*types.Named); ok {
		typeName = namedType.Obj().Name()
	} else {
		return fmt.Errorf("could not determine protobuf type name")
	}

	// The LHS should be the err variable, but we need to assign to the receiver instead
	errExpr := lhs[0]
	if errIdent, ok := errExpr.(*ast.Ident); ok {
		// First, assign the result of fromJsonString to the receiver
		if err := c.WriteValueExpr(selectorExpr.X); err != nil {
			return fmt.Errorf("failed to write receiver for UnmarshalJSON: %w", err)
		}
		c.tsw.WriteLiterally(" = ")
		c.tsw.WriteLiterally(typeName)
		c.tsw.WriteLiterally(".fromJsonString(")
		if len(callExpr.Args) > 0 {
			if err := c.WriteValueExpr(callExpr.Args[0]); err != nil {
				return fmt.Errorf("failed to write argument for UnmarshalJSON: %w", err)
			}
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")

		// Then set err to null (but only if it's not a blank identifier)
		if errIdent.Name != "_" {
			// For := assignments, check if this is a new variable
			isNewVar := true
			if tok == token.DEFINE {
				// Check if the variable is already in scope by looking at Uses
				if obj := c.pkg.TypesInfo.Uses[errIdent]; obj != nil {
					isNewVar = false
				}
			}

			if tok == token.DEFINE && isNewVar {
				c.tsw.WriteLiterally("let ")
			}
			c.tsw.WriteLiterally(errIdent.Name)
			if tok == token.DEFINE && isNewVar {
				c.tsw.WriteLiterally(": $.GoError | null")
			}
			c.tsw.WriteLiterally(" = null as $.GoError | null")
			c.tsw.WriteLine("")
		}
	}

	return nil
}
