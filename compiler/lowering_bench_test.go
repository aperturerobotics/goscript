package compiler

import (
	"context"
	"go/ast"
	"go/types"
	"os"
	"path/filepath"
	"testing"
)

type loweringBenchFixture struct {
	model                *SemanticModel
	owner                *LoweringOwner
	semPkg               *semanticPackage
	lazyPackageVarsByPkg map[string]map[types.Object]bool
	file                 loweringBenchFile
	genDecls             []loweringBenchGenDecl
	stmtLists            []loweringBenchStmtList
}

type loweringBenchFile struct {
	file            *ast.File
	sourcePath      string
	associated      []*ast.FuncDecl
	declFiles       map[types.Object]string
	outputNames     map[string]string
	lazyPackageVars map[types.Object]bool
}

type loweringBenchGenDecl struct {
	ctx  lowerFileContext
	decl *ast.GenDecl
}

type loweringBenchStmtList struct {
	ctx   lowerFileContext
	stmts []ast.Stmt
}

func BenchmarkLoweringPackage(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		if _, diagnostics := fixture.owner.lowerPackage(
			fixture.model,
			fixture.semPkg,
			make(map[string]map[types.Object]bool),
			make(runtimeMethodSetCache),
			LoweringOptions{},
		); diagnosticsHaveErrors(diagnostics) {
			b.Fatal(diagnostics)
		}
	}
}

func BenchmarkLoweringAnalyzeLocalFileReferences(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = fixture.owner.analyzeLocalFileReferences(
			fixture.semPkg,
			fixture.file.file,
			fixture.file.sourcePath,
			fixture.file.associated,
			fixture.file.declFiles,
			fixture.file.outputNames,
			make(runtimeMethodSetCache),
		)
	}
}

func BenchmarkLoweringFile(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		if _, diagnostics := fixture.owner.lowerFile(
			fixture.model,
			fixture.semPkg,
			fixture.file.file,
			fixture.file.sourcePath,
			fixture.file.declFiles,
			fixture.file.outputNames,
			fixture.file.lazyPackageVars,
			fixture.lazyPackageVarsByPkg,
			make(runtimeMethodSetCache),
			false,
		); diagnosticsHaveErrors(diagnostics) {
			b.Fatal(diagnostics)
		}
	}
}

func BenchmarkLoweringGenDecls(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		for _, target := range fixture.genDecls {
			if _, diagnostics := fixture.owner.lowerGenDecl(target.ctx, target.decl); diagnosticsHaveErrors(diagnostics) {
				b.Fatal(diagnostics)
			}
		}
	}
}

func BenchmarkLoweringStmtLists(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		for _, target := range fixture.stmtLists {
			if _, diagnostics := fixture.owner.lowerStmtList(target.ctx, target.stmts); diagnosticsHaveErrors(diagnostics) {
				b.Fatal(diagnostics)
			}
		}
	}
}

func BenchmarkLoweringPackageDeclFiles(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = packageDeclFiles(fixture.semPkg)
	}
}

func BenchmarkLoweringLazyPackageVars(b *testing.B) {
	fixture := newLoweringBenchFixture(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = fixture.owner.lazyPackageVars(fixture.semPkg, fixture.file.declFiles)
	}
}

func newLoweringBenchFixture(tb testing.TB) *loweringBenchFixture {
	tb.Helper()
	dir := tb.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "go.mod"), []byte("module example.test/loweringbench\n\ngo 1.25.3\n"), 0o644); err != nil {
		tb.Fatal(err)
	}
	for name, source := range loweringBenchSources {
		if err := os.WriteFile(filepath.Join(dir, name), []byte(source), 0o644); err != nil {
			tb.Fatal(err)
		}
	}

	service := NewCompileService()
	req := &CompileRequest{
		Dir:        dir,
		OutputPath: filepath.Join(dir, "out"),
		Patterns:   []string{"."},
	}
	graph, graphDiagnostics := service.PackageGraphOwner().Load(context.Background(), req)
	if diagnosticsHaveErrors(graphDiagnostics) {
		tb.Fatal(graphDiagnostics)
	}
	model, semanticDiagnostics := service.SemanticModelOwner().Build(context.Background(), graph)
	if diagnosticsHaveErrors(semanticDiagnostics) {
		tb.Fatal(semanticDiagnostics)
	}
	semPkg := model.packages["example.test/loweringbench"]
	if semPkg == nil {
		tb.Fatal("missing benchmark semantic package")
	}
	owner := service.LoweringOwner()
	declFiles := packageDeclFiles(semPkg)
	outputNames := packageOutputNames(semPkg)
	lazyPackageVarsByPkg := make(map[string]map[types.Object]bool)
	lazyPackageVars := owner.packageLazyVars(semPkg, lazyPackageVarsByPkg, declFiles)

	var benchFile loweringBenchFile
	var genDecls []loweringBenchGenDecl
	var stmtLists []loweringBenchStmtList
	for idx, file := range semPkg.source.Syntax {
		sourcePath := sourceFilePath(semPkg, idx, file)
		associated := owner.methodDeclsForFileTypes(semPkg, file)
		localRefs := owner.analyzeLocalFileReferences(semPkg, file, sourcePath, associated, declFiles, outputNames, make(runtimeMethodSetCache))
		ctx := lowerFileContext{
			model:                model,
			semPkg:               semPkg,
			file:                 file,
			importAliases:        make(map[string]string),
			importPaths:          make(map[string]string),
			importNames:          make(map[string]string),
			importObjects:        make(map[*types.PkgName]string),
			sourcePath:           sourcePath,
			localAliases:         localRefs.aliases,
			lazyPackageVars:      lazyPackageVars,
			lazyPackageVarsByPkg: lazyPackageVarsByPkg,
			tempNames:            newTempNameOwner(),
			topLevel:             true,
		}
		if filepath.Base(sourcePath) == "bench.go" {
			benchFile = loweringBenchFile{
				file:            file,
				sourcePath:      sourcePath,
				associated:      associated,
				declFiles:       declFiles,
				outputNames:     outputNames,
				lazyPackageVars: lazyPackageVars,
			}
		}
		for _, decl := range file.Decls {
			switch typed := decl.(type) {
			case *ast.GenDecl:
				genDecls = append(genDecls, loweringBenchGenDecl{ctx: ctx, decl: typed})
			case *ast.FuncDecl:
				fn, _ := semPkg.source.TypesInfo.Defs[typed.Name].(*types.Func)
				signature, _ := fn.Type().(*types.Signature)
				bodyCtx := ctx.withSignature(signature).withAsyncFunction(owner.functionAsync(ctx, fn))
				if typed.Body != nil {
					stmtLists = append(stmtLists, loweringBenchStmtList{ctx: bodyCtx, stmts: typed.Body.List})
				}
			}
		}
	}
	if benchFile.file == nil {
		tb.Fatal("missing bench.go fixture file")
	}
	if len(genDecls) == 0 || len(stmtLists) == 0 {
		tb.Fatalf("incomplete lowering benchmark fixture: genDecls=%d stmtLists=%d", len(genDecls), len(stmtLists))
	}
	return &loweringBenchFixture{
		model:                model,
		owner:                owner,
		semPkg:               semPkg,
		lazyPackageVarsByPkg: lazyPackageVarsByPkg,
		file:                 benchFile,
		genDecls:             genDecls,
		stmtLists:            stmtLists,
	}
}

var loweringBenchSources = map[string]string{
	"bench.go": `package loweringbench

type Number interface {
	~int | ~int64
}

type Item[T Number] struct {
	ID     int
	Name   string
	Values []T
	Meta   map[string]T
	Next   *Item[T]
}

type Processor[T Number] interface {
	Process(Item[T]) (T, error)
}

type Runner[T Number] struct {
	Items []Item[T]
	Proc  Processor[T]
}

var GlobalItems = []Item[int]{
	{ID: 1, Name: "one", Values: []int{1, 2, 3}, Meta: map[string]int{"a": 1}},
	{ID: 2, Name: "two", Values: []int{4, 5, 6}, Meta: map[string]int{"b": 2}},
}

var Lookup = map[string]Item[int]{
	"one": GlobalItems[0],
	"two": GlobalItems[1],
}

func (r *Runner[T]) Sum(seed T) (T, error) {
	total := seed
	for idx, item := range r.Items {
		for _, value := range item.Values {
			total += value
		}
		if r.Proc != nil {
			next, err := r.Proc.Process(item)
			if err != nil {
				return total, err
			}
			total += next
		}
		if idx%2 == 0 {
			total += T(idx)
		}
	}
	return total, nil
}

func UseRunner(r *Runner[int]) int {
	total, err := r.Sum(10)
	if err != nil {
		return -1
	}
	switch {
	case total > 100:
		return total / 2
	case total > 20:
		return total + len(r.Items)
	default:
		return total
	}
}
`,
	"flow.go": `package loweringbench

func FoldItems(items []Item[int], fn func(Item[int]) int) int {
	total := 0
	for _, item := range items {
		total += fn(item)
	}
	return total
}

func ComplexFlow(items []Item[int], ch chan int) int {
	total := 0
	for idx := 0; idx < len(items); idx++ {
		item := items[idx]
		select {
		case ch <- item.ID:
			total += item.ID
		default:
			total += len(item.Values)
		}
		for key, value := range item.Meta {
			if key == "" {
				continue
			}
			total += value
		}
	}
	return total
}
`,
	"types.go": `package loweringbench

type NamedInt int

func (n NamedInt) Process(item Item[int]) (int, error) {
	return int(n) + item.ID + len(item.Values), nil
}

type Pair[A, B any] struct {
	A A
	B B
}

type Registry struct {
	ByName map[string]Processor[int]
	Pairs  []Pair[string, Item[int]]
}

func NewRegistry() *Registry {
	return &Registry{
		ByName: map[string]Processor[int]{"default": NamedInt(3)},
		Pairs: []Pair[string, Item[int]]{{A: "one", B: GlobalItems[0]}},
	}
}
`,
}
