package compiler

import (
	"context"
	"go/ast"
	"go/types"
	"path"
	"regexp"
	"slices"
	"strings"

	"github.com/pkg/errors"
)

var (
	overrideExportDeclarationPattern = regexp.MustCompile(`(?m)^\s*export\s+(?:async\s+)?(const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)`)
	overrideLocalDeclarationPattern  = regexp.MustCompile(`(?m)^\s*(?:export\s+)?(?:async\s+)?(const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)`)
	overrideImportNamedPattern       = regexp.MustCompile(`(?s)import\s+(type\s+)?\{([^}]*)\}\s+from\s+['"][^'"]+['"]`)
	overrideExportNamedPattern       = regexp.MustCompile(`(?s)export\s+(type\s+)?\{([^}]*)\}\s*(?:from\s+['"]([^'"]+)['"])?`)
	overrideExportAllPattern         = regexp.MustCompile(`(?m)^\s*export\s+\*\s+from\s+['"]([^'"]+)['"]`)
)

type goPackageExport struct {
	name          string
	requiresValue bool
}

type typeScriptExport struct {
	value bool
	typ   bool
}

type namedTypeScriptExport struct {
	source   string
	target   string
	typeOnly bool
}

// OverrideParityVerifier owns compiler-side parity checks for ledgered overrides.
type OverrideParityVerifier struct{}

// NewOverrideParityVerifier creates the override parity verifier.
func NewOverrideParityVerifier() *OverrideParityVerifier {
	return &OverrideParityVerifier{}
}

// Verify checks ledgered override packages against JS/WASM Go exports and
// effective TypeScript package exports.
func (v *OverrideParityVerifier) Verify(
	ctx context.Context,
	graph *PackageGraph,
	facts *OverrideFacts,
) []Diagnostic {
	if err := ctx.Err(); err != nil {
		return []Diagnostic{contextCanceledDiagnostic(err)}
	}
	if graph == nil || facts == nil {
		return nil
	}

	var diagnostics []Diagnostic
	for _, node := range graph.Nodes {
		if err := ctx.Err(); err != nil {
			return append(diagnostics, contextCanceledDiagnostic(err))
		}
		if node == nil || !node.OverrideCandidate {
			continue
		}
		ledger := facts.parityLedger(node.PkgPath)
		if !ledger.Strict && len(ledger.Symbols) == 0 {
			continue
		}
		pkg := graph.packagesByPath[node.PkgPath]
		if pkg == nil || pkg.Types == nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-no-package",
				Message:  "override parity verification requires typed Go package facts",
				Detail:   node.PkgPath,
			})
			continue
		}
		exports, err := facts.effectiveTypeScriptExports(node.PkgPath)
		if err != nil {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-export-scan",
				Message:  "override parity verification failed to scan TypeScript exports",
				Detail:   node.PkgPath + ": " + err.Error(),
			})
			continue
		}
		diagnostics = append(diagnostics, verifyOverrideParityPackage(
			node.PkgPath,
			pkg.Types,
			ledger,
			exports,
			facts.behaviorTestSymbols(node.PkgPath),
		)...)
	}
	diagnostics = append(diagnostics, verifyBlockedOverrideUses(graph, facts)...)
	return diagnostics
}

func overrideParityRequiresTypedGraph(graph *PackageGraph, facts *OverrideFacts) bool {
	if graph == nil || facts == nil {
		return false
	}
	for _, node := range graph.Nodes {
		if node == nil || !node.OverrideCandidate {
			continue
		}
		ledger := facts.parityLedger(node.PkgPath)
		if ledger.Strict || len(ledger.Symbols) != 0 {
			return true
		}
	}
	for _, pkg := range facts.packages {
		for _, entry := range pkg.parity.Symbols {
			if entry.Status == overrideParityStatusBlocked {
				return true
			}
		}
	}
	return false
}

// VerifyNoDeferred reports transient parity entries that remain in packages
// whose parity surface is expected to be closed.
func (v *OverrideParityVerifier) VerifyNoDeferred(facts *OverrideFacts, pkgPaths ...string) []Diagnostic {
	if facts == nil {
		return nil
	}
	var diagnostics []Diagnostic
	for _, pkgPath := range pkgPaths {
		ledger := facts.parityLedger(pkgPath)
		symbols := make([]string, 0, len(ledger.Symbols))
		for symbol := range ledger.Symbols {
			symbols = append(symbols, symbol)
		}
		slices.Sort(symbols)
		for _, symbol := range symbols {
			entry := ledger.Symbols[symbol]
			if entry.Status != overrideParityStatusDeferred {
				continue
			}
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-deferred",
				Message:  "override parity ledger still contains a transient deferred symbol",
				Detail:   pkgPath + "." + symbol,
			})
		}
	}
	return diagnostics
}

func verifyOverrideParityPackage(
	pkgPath string,
	goPkg *types.Package,
	ledger overrideParityLedger,
	tsExports map[string]typeScriptExport,
	behaviorTests map[string]bool,
) []Diagnostic {
	goExports := exportedPackageSymbols(goPkg)
	goExportSet := make(map[string]bool, len(goExports))
	var diagnostics []Diagnostic
	for _, symbol := range goExports {
		goExportSet[symbol.name] = true
		obj := goPkg.Scope().Lookup(symbol.name)
		entry, ok := ledger.Symbols[symbol.name]
		if ledger.Strict && !ok {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-unclassified",
				Message:  "Go export is missing from override parity ledger",
				Detail:   pkgPath + "." + symbol.name,
			})
			continue
		}
		if !ok {
			continue
		}
		if entry.Status.requiresExport() && !symbol.satisfiedBy(tsExports[symbol.name]) {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-missing-export",
				Message:  "override parity ledger requires a TypeScript export that is missing",
				Detail:   pkgPath + "." + symbol.name + " is classified as " + string(entry.Status),
			})
		}
		if entry.Status == overrideParityStatusReal && isPackageLevelFunc(obj) && !behaviorTests[symbol.name] {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityWarning,
				Code:     "goscript/overrides:parity-missing-behavior-test",
				Message:  "real override function is missing a locatable behavior test",
				Detail:   pkgPath + "." + symbol.name,
			})
		}
		if entry.Status.forbidsExport() && tsExports[symbol.name].present() {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-unexpected-export",
				Message:  "override parity ledger marks a Go export blocked, but TypeScript exports it",
				Detail:   pkgPath + "." + symbol.name + " is classified as " + string(entry.Status),
			})
		}
	}
	for symbol := range ledger.Symbols {
		if !goExportSet[symbol] {
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-unknown-symbol",
				Message:  "override parity ledger references a symbol not exported by the Go package",
				Detail:   pkgPath + "." + symbol,
			})
		}
	}
	return diagnostics
}

func isPackageLevelFunc(obj types.Object) bool {
	_, ok := obj.(*types.Func)
	return ok
}

func (symbol goPackageExport) satisfiedBy(export typeScriptExport) bool {
	if symbol.requiresValue {
		return export.value
	}
	return export.typ
}

func (export typeScriptExport) present() bool {
	return export.value || export.typ
}

func exportedPackageSymbols(goPkg *types.Package) []goPackageExport {
	if goPkg == nil || goPkg.Scope() == nil {
		return nil
	}
	names := goPkg.Scope().Names()
	symbols := make([]goPackageExport, 0, len(names))
	for _, name := range names {
		if !ast.IsExported(name) {
			continue
		}
		obj := goPkg.Scope().Lookup(name)
		typeName, isTypeName := obj.(*types.TypeName)
		symbols = append(symbols, goPackageExport{
			name:          name,
			requiresValue: !isTypeName || typeNameRequiresValue(typeName),
		})
	}
	slices.SortFunc(symbols, func(a, b goPackageExport) int {
		return strings.Compare(a.name, b.name)
	})
	return symbols
}

func typeNameRequiresValue(typeName *types.TypeName) bool {
	if typeName == nil || typeName.Type() == nil {
		return false
	}
	_, ok := types.Unalias(typeName.Type()).Underlying().(*types.Struct)
	return ok
}

func verifyBlockedOverrideUses(graph *PackageGraph, facts *OverrideFacts) []Diagnostic {
	if graph == nil || facts == nil {
		return nil
	}
	seen := make(map[string]bool)
	var diagnostics []Diagnostic
	for _, node := range graph.Nodes {
		if node == nil || node.OverrideCandidate {
			continue
		}
		pkg := graph.packagesByPath[node.PkgPath]
		if pkg == nil || pkg.TypesInfo == nil {
			continue
		}
		sourcePkgPath := packagePath(pkg)
		for ident, obj := range pkg.TypesInfo.Uses {
			if ident == nil || obj == nil || obj.Pkg() == nil {
				continue
			}
			if sourcePkgPath == obj.Pkg().Path() {
				continue
			}
			ledger := facts.parityLedger(obj.Pkg().Path())
			entry, ok := ledger.Symbols[obj.Name()]
			if !ok || entry.Status != overrideParityStatusBlocked {
				continue
			}
			key := sourcePkgPath + "->" + obj.Pkg().Path() + "." + obj.Name()
			if seen[key] {
				continue
			}
			seen[key] = true
			diagnostics = append(diagnostics, Diagnostic{
				Severity: DiagnosticSeverityError,
				Code:     "goscript/overrides:parity-blocked-use",
				Message:  "Go code uses an override symbol classified as blocked",
				Detail:   obj.Pkg().Path() + "." + obj.Name() + ": " + entry.Reason,
			})
		}
	}
	return diagnostics
}

func (f *OverrideFacts) effectiveTypeScriptExports(pkgPath string) (map[string]typeScriptExport, error) {
	pkg, _, ok := f.copyPackage(pkgPath)
	if !ok {
		return nil, errors.Errorf("override package %q is missing", pkgPath)
	}
	files := make(map[string]string, len(pkg.files))
	for _, file := range pkg.files {
		files[path.Clean(file.path)] = string(file.data)
	}
	exports := make(map[string]typeScriptExport)
	visited := make(map[string]bool)
	if err := collectTypeScriptExports(path.Join(pkgPath, "index.ts"), files, exports, visited); err != nil {
		return nil, err
	}
	return exports, nil
}

func collectTypeScriptExports(
	filePath string,
	files map[string]string,
	exports map[string]typeScriptExport,
	visited map[string]bool,
) error {
	filePath = path.Clean(filePath)
	if visited[filePath] {
		return nil
	}
	visited[filePath] = true
	data, ok := files[filePath]
	if !ok {
		return errors.Errorf("missing %s", filePath)
	}
	localBindings := localTypeScriptBindings(data)
	for _, match := range overrideExportDeclarationPattern.FindAllStringSubmatch(data, -1) {
		addTypeScriptExport(exports, match[2], typeScriptExportForDeclaration(match[1]))
	}
	for _, match := range overrideExportNamedPattern.FindAllStringSubmatch(data, -1) {
		namedExports := parseNamedTypeScriptExports(match[2], match[1] != "")
		if match[3] == "" {
			if err := addLocalNamedTypeScriptExports(filePath, exports, localBindings, namedExports); err != nil {
				return err
			}
			continue
		}
		target, ok := resolveOverrideExportPath(filePath, match[3])
		if !ok {
			continue
		}
		targetExports := make(map[string]typeScriptExport)
		if err := collectTypeScriptExports(target, files, targetExports, make(map[string]bool)); err != nil {
			return err
		}
		for _, namedExport := range namedExports {
			sourceExport := targetExports[namedExport.source]
			if !sourceExport.present() {
				return errors.Errorf("%s re-exports missing symbol %s from %s", filePath, namedExport.source, target)
			}
			exportShape := sourceExport
			if namedExport.typeOnly {
				if !sourceExport.typ {
					return errors.Errorf("%s re-exports missing type symbol %s from %s", filePath, namedExport.source, target)
				}
				exportShape = typeScriptExport{typ: true}
			} else if !sourceExport.value {
				return errors.Errorf("%s re-exports missing value symbol %s from %s", filePath, namedExport.source, target)
			}
			addTypeScriptExport(exports, namedExport.target, exportShape)
		}
	}
	for _, match := range overrideExportAllPattern.FindAllStringSubmatch(data, -1) {
		target, ok := resolveOverrideExportPath(filePath, match[1])
		if ok {
			if err := collectTypeScriptExports(target, files, exports, visited); err != nil {
				return err
			}
		}
	}
	return nil
}

func typeScriptExportForDeclaration(kind string) typeScriptExport {
	switch kind {
	case "const", "let", "var", "function":
		return typeScriptExport{value: true}
	case "class", "enum":
		return typeScriptExport{value: true, typ: true}
	case "interface", "type":
		return typeScriptExport{typ: true}
	default:
		return typeScriptExport{}
	}
}

func addTypeScriptExport(exports map[string]typeScriptExport, name string, export typeScriptExport) {
	if name == "" {
		return
	}
	current := exports[name]
	current.value = current.value || export.value
	current.typ = current.typ || export.typ
	exports[name] = current
}

func localTypeScriptBindings(data string) map[string]typeScriptExport {
	bindings := make(map[string]typeScriptExport)
	for _, match := range overrideLocalDeclarationPattern.FindAllStringSubmatch(data, -1) {
		addTypeScriptExport(bindings, match[2], typeScriptExportForDeclaration(match[1]))
	}
	for _, match := range overrideImportNamedPattern.FindAllStringSubmatch(data, -1) {
		for _, namedImport := range parseNamedTypeScriptExports(match[2], match[1] != "") {
			exportShape := typeScriptExport{value: true, typ: true}
			if namedImport.typeOnly {
				exportShape = typeScriptExport{typ: true}
			}
			addTypeScriptExport(bindings, namedImport.target, exportShape)
		}
	}
	return bindings
}

func addLocalNamedTypeScriptExports(
	filePath string,
	exports map[string]typeScriptExport,
	localBindings map[string]typeScriptExport,
	namedExports []namedTypeScriptExport,
) error {
	for _, namedExport := range namedExports {
		exportShape := localBindings[namedExport.source]
		if namedExport.typeOnly {
			if !exportShape.typ {
				return errors.Errorf("%s exports missing local type symbol %s", filePath, namedExport.source)
			}
			exportShape = typeScriptExport{typ: true}
		} else if !exportShape.value {
			return errors.Errorf("%s exports missing local value symbol %s", filePath, namedExport.source)
		}
		addTypeScriptExport(exports, namedExport.target, exportShape)
	}
	return nil
}

func parseNamedTypeScriptExports(list string, statementTypeOnly bool) []namedTypeScriptExport {
	var exports []namedTypeScriptExport
	for item := range strings.SplitSeq(list, ",") {
		item = strings.TrimSpace(item)
		if item == "" {
			continue
		}
		typeOnly := statementTypeOnly
		if strings.HasPrefix(item, "type ") {
			typeOnly = true
			item = strings.TrimSpace(strings.TrimPrefix(item, "type "))
		}
		parts := strings.Fields(item)
		if len(parts) == 0 {
			continue
		}
		namedExport := namedTypeScriptExport{
			source:   parts[0],
			target:   parts[0],
			typeOnly: typeOnly,
		}
		if len(parts) >= 3 && parts[len(parts)-2] == "as" {
			namedExport.target = parts[len(parts)-1]
		}
		exports = append(exports, namedExport)
	}
	return exports
}

func resolveOverrideExportPath(currentFile, spec string) (string, bool) {
	if !strings.HasPrefix(spec, ".") {
		return "", false
	}
	target := path.Clean(path.Join(path.Dir(currentFile), spec))
	switch path.Ext(target) {
	case ".js", ".ts":
		target = strings.TrimSuffix(target, path.Ext(target)) + ".ts"
	case "":
		target = path.Join(target, "index.ts")
	}
	return target, true
}
