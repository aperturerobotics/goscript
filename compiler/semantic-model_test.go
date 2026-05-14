package compiler

import (
	"context"
	"go/types"
	"path/filepath"
	"strings"
	"testing"
)

func TestSemanticModelBuildsDeclarationFacts(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/semantic\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package semantic",
			"import \"fmt\"",
			"type Counter struct { Value int }",
			"const Answer = 42",
			"var Global Counter",
			"func Print() { fmt.Println(Answer) }",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)
	semPkg := requireSemanticPackage(t, model, "example.test/semantic")

	for _, decl := range []struct {
		kind string
		name string
	}{
		{kind: "type", name: "Counter"},
		{kind: "const", name: "Answer"},
		{kind: "var", name: "Global"},
		{kind: "func", name: "Print"},
	} {
		if !hasSemanticDeclaration(semPkg, decl.kind, decl.name) {
			t.Fatalf("missing declaration %s %s in %#v", decl.kind, decl.name, semPkg.declarations)
		}
	}
	if len(semPkg.imports) != 1 || semPkg.imports[0].path != "fmt" {
		t.Fatalf("unexpected imports: %#v", semPkg.imports)
	}

	global := requireSemanticValue(t, model, graph, "example.test/semantic", "Global")
	if !global.topLevel || global.zeroValueKind != "struct-zero" {
		t.Fatalf("unexpected Global value facts: %#v", global)
	}
	if global.position.file == "" || global.position.line == 0 {
		t.Fatalf("expected Global source position, got %#v", global.position)
	}
	if len(semPkg.initOrder) != 1 || semPkg.initOrder[0].Name() != "Global" {
		t.Fatalf("unexpected init order: %#v", semPkg.initOrder)
	}
}

func TestSemanticModelRecordsAddressTakenVarRefs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/varref\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package varref",
			"func Use() {",
			"  x := 1",
			"  p := &x",
			"  _ = &p",
			"}",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)

	for _, name := range []string{"x", "p"} {
		obj := requireDefinedObject(t, graph, "example.test/varref", name)
		if !model.addressTaken[obj] || !model.needsVarRef[obj] {
			t.Fatalf("expected %s to be address-taken and need VarRef", name)
		}
	}
}

func TestSemanticModelRecordsStructFieldsAndReceivers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/structs\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package structs",
			"type Counter struct {",
			"  // Value counts reads.",
			"  Value int",
			"  Label string",
			"}",
			"func (c Counter) Read() int { return c.Value }",
			"func (c *Counter) Set(v int) { c.Value = v }",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)
	counter := requireSemanticType(t, graph, model, "example.test/structs", "Counter")

	if len(counter.fields) != 2 ||
		counter.fields[0].name != "Value" ||
		counter.fields[1].name != "Label" {
		t.Fatalf("unexpected Counter fields: %#v", counter.fields)
	}
	if counter.fields[0].doc != "Value counts reads." {
		t.Fatalf("unexpected Counter.Value doc: %#v", counter.fields[0].doc)
	}

	read := requireDefinedFunc(t, graph, "example.test/structs", "Read")
	set := requireDefinedFunc(t, graph, "example.test/structs", "Set")
	if model.functions[read].receiver == nil ||
		model.functions[read].receiver.Obj().Name() != "Counter" ||
		model.functions[read].receiverPointer {
		t.Fatalf("unexpected value receiver facts: %#v", model.functions[read])
	}
	if model.functions[set].receiver == nil ||
		model.functions[set].receiver.Obj().Name() != "Counter" ||
		!model.functions[set].receiverPointer {
		t.Fatalf("unexpected pointer receiver facts: %#v", model.functions[set])
	}
}

func TestSemanticModelMarksNamedValueForPointerReceiverCall(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/namedrecv\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package namedrecv",
			"type Numbers []int",
			"func (n *Numbers) Add(v int) { *n = append(*n, v) }",
			"func Use() {",
			"  var n Numbers",
			"  n.Add(1)",
			"}",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)
	found := false
	for obj := range model.needsVarRef {
		if obj.Name() == "n" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("expected named slice value receiver call to force VarRef")
	}
}

func TestSemanticModelRecordsGeneratedImportNeeds(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/imports\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package imports",
			"import \"example.test/imports/subpkg\"",
			"var Zero subpkg.Item",
			"",
		}, "\n"),
		"subpkg/item.go": "package subpkg\ntype Item struct { Value int }\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)

	imports := generatedImportsForFile(t, model, "main.go")
	if !imports["example.test/imports/subpkg"] {
		t.Fatalf("expected generated import for subpkg, got %#v", imports)
	}
}

func TestSemanticModelRecordsInterfaceAssertionAndNilFacts(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interfaces\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package interfaces",
			"type Reader interface { Read() int }",
			"type Impl struct{}",
			"func (Impl) Read() int { return 1 }",
			"func Use() {",
			"  var i Reader = Impl{}",
			"  _, _ = i.(Impl)",
			"  var p *Impl = nil",
			"  var sink Reader = p",
			"  var empty interface{} = nil",
			"  _, _ = sink, empty",
			"}",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)
	semPkg := requireSemanticPackage(t, model, "example.test/interfaces")

	if len(semPkg.typeAssertions) != 1 ||
		!strings.Contains(semPkg.typeAssertions[0].target.String(), "Impl") {
		t.Fatalf("unexpected type assertions: %#v", semPkg.typeAssertions)
	}
	for _, kind := range []string{"typed-nil", "typed-nil-interface-risk", "nil-interface"} {
		if !hasNilFactKind(semPkg, kind) {
			t.Fatalf("missing nil fact %q in %#v", kind, semPkg.nilFacts)
		}
	}
	if !hasInterfaceImplementation(model, "Impl", "Reader", false) {
		t.Fatalf("missing Impl -> Reader interface implementation: %#v", model.interfaceImplementations)
	}
}

func TestSemanticModelColorsAsyncFunctionsAndOverrides(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/async\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package async",
			"import \"sync\"",
			"type Locker interface { Lock() }",
			"type AsyncLocker struct { ch chan struct{} }",
			"func (a *AsyncLocker) Lock() { <-a.ch }",
			"func UseInterface(l Locker) { l.Lock() }",
			"func CallChannel(a *AsyncLocker) { a.Lock() }",
			"func UseMutex(mu *sync.Mutex) { mu.Lock() }",
			"func Immediate() {}",
			"",
		}, "\n"),
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	model := buildSemanticModel(t, graph)

	for _, name := range []string{"UseInterface", "CallChannel", "UseMutex"} {
		fn := requireDefinedFunc(t, graph, "example.test/async", name)
		if !model.functions[fn].async {
			t.Fatalf("expected %s to be async, got %#v", name, model.functions[fn])
		}
	}
	immediate := requireDefinedFunc(t, graph, "example.test/async", "Immediate")
	if model.functions[immediate].async {
		t.Fatalf("did not expect Immediate to be async: %#v", model.functions[immediate])
	}
	if !hasInterfaceImplementation(model, "AsyncLocker", "Locker", true) {
		t.Fatalf("missing *AsyncLocker -> Locker implementation: %#v", model.interfaceImplementations)
	}
}

func buildSemanticModel(t *testing.T, graph *PackageGraph) *SemanticModel {
	t.Helper()

	model, diagnostics := NewSemanticModelOwner(NewOverrideRegistryOwner()).Build(context.Background(), graph)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("semantic model build failed: %#v", diagnostics)
	}
	if model == nil {
		t.Fatalf("semantic model build returned nil")
	}
	return model
}

func requireSemanticPackage(t *testing.T, model *SemanticModel, pkgPath string) *semanticPackage {
	t.Helper()

	semPkg := model.packages[pkgPath]
	if semPkg == nil {
		t.Fatalf("missing semantic package %q in %#v", pkgPath, model.packages)
	}
	return semPkg
}

func hasSemanticDeclaration(semPkg *semanticPackage, kind string, name string) bool {
	for _, decl := range semPkg.declarations {
		if decl.kind == kind && decl.name == name {
			return true
		}
	}
	return false
}

func requireSemanticValue(
	t *testing.T,
	model *SemanticModel,
	graph *PackageGraph,
	pkgPath string,
	name string,
) *semanticValue {
	t.Helper()

	obj := requireDefinedObject(t, graph, pkgPath, name)
	value := model.values[obj]
	if value == nil {
		t.Fatalf("missing semantic value for %s", name)
	}
	return value
}

func requireSemanticType(
	t *testing.T,
	graph *PackageGraph,
	model *SemanticModel,
	pkgPath string,
	name string,
) *semanticType {
	t.Helper()

	obj, _ := requireDefinedObject(t, graph, pkgPath, name).(*types.TypeName)
	if obj == nil {
		t.Fatalf("defined object %s is not a type", name)
	}
	named, _ := obj.Type().(*types.Named)
	if named == nil {
		t.Fatalf("defined type %s is not named", name)
	}
	semType := model.types[named]
	if semType == nil {
		t.Fatalf("missing semantic type for %s", name)
	}
	return semType
}

func requireDefinedFunc(t *testing.T, graph *PackageGraph, pkgPath string, name string) *types.Func {
	t.Helper()

	fn, _ := requireDefinedObject(t, graph, pkgPath, name).(*types.Func)
	if fn == nil {
		t.Fatalf("defined object %s is not a function", name)
	}
	return fn
}

func requireDefinedObject(t *testing.T, graph *PackageGraph, pkgPath string, name string) types.Object {
	t.Helper()

	pkg := graph.packagesByPath[pkgPath]
	if pkg == nil {
		t.Fatalf("missing loaded package %q", pkgPath)
	}
	for ident, obj := range pkg.TypesInfo.Defs {
		if ident.Name == name && obj != nil {
			return obj
		}
	}
	t.Fatalf("missing defined object %s in %s", name, pkgPath)
	return nil
}

func generatedImportsForFile(t *testing.T, model *SemanticModel, base string) map[string]bool {
	t.Helper()

	for file, imports := range model.generatedImports {
		if filepath.Base(file) == base {
			return imports
		}
	}
	t.Fatalf("missing generated imports for %s in %#v", base, model.generatedImports)
	return nil
}

func hasNilFactKind(semPkg *semanticPackage, kind string) bool {
	for _, fact := range semPkg.nilFacts {
		if fact.kind == kind {
			return true
		}
	}
	return false
}

func hasInterfaceImplementation(model *SemanticModel, typ string, iface string, pointer bool) bool {
	for _, implementation := range model.interfaceImplementations {
		if implementation.pointer != pointer ||
			implementation.typ == nil ||
			implementation.iface == nil {
			continue
		}
		if implementation.typ.Obj().Name() == typ && implementation.iface.Obj().Name() == iface {
			return true
		}
	}
	return false
}
