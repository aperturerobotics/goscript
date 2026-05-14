package compiler

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestConfigValidate(t *testing.T) {
	tests := []struct {
		name    string
		config  *Config
		wantErr bool
		errMsg  string
	}{
		{
			name: "valid config",
			config: &Config{
				Dir:        "/some/dir",
				OutputPath: "/output/path",
				BuildFlags: []string{"-tags", "sometag"},
			},
		},
		{
			name: "empty output path root",
			config: &Config{
				Dir:        "/some/dir",
				BuildFlags: []string{"-tags", "sometag"},
			},
		},
		{
			name:    "nil config",
			config:  nil,
			wantErr: true,
			errMsg:  "config cannot be nil",
		},
		{
			name: "nil fset gets initialized",
			config: &Config{
				OutputPath: "/output/path",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.config.Validate()
			if (err != nil) != tt.wantErr {
				t.Fatalf("Config.Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
			if err != nil && err.Error() != tt.errMsg {
				t.Fatalf("Config.Validate() error = %q, want %q", err.Error(), tt.errMsg)
			}
			if err == nil && tt.config.fset == nil {
				t.Fatalf("Config.Validate() did not initialize fset")
			}
		})
	}
}

func TestCompilePackagesRejectsSingleFileBeforeOutput(t *testing.T) {
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), "main.go")
	if err == nil {
		t.Fatal("expected single-file request to fail")
	}
	requireDiagnostic(t, err, "goscript/request:single-file-unsupported")
	if result == nil || len(result.Diagnostics) == 0 {
		t.Fatalf("expected structured diagnostics in result")
	}
	if _, statErr := os.Stat(outputDir); !os.IsNotExist(statErr) {
		t.Fatalf("compile wrote output directory before validation stopped: %v", statErr)
	}
}

func TestCompilePackagesEmitsSimplePackage(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/simple\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"const Greeting = \"Hello\"",
			"func Add(a int, b int) int {",
			"  return a + b",
			"}",
			"func main() {",
			"  total := Add(2, 3)",
			"  size := len(Greeting)",
			"  print(\"total:\", size)",
			"  if total == 5 {",
			"    println(Greeting, total)",
			"  }",
			"  if false {",
			"    panic(\"unreachable\")",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err.Error())
	}
	if result == nil || len(result.CompiledPackages) != 1 || result.CompiledPackages[0] != "example.test/simple" {
		t.Fatalf("unexpected result: %#v", result)
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "simple", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"import * as $ from \"@goscript/builtin/index.ts\"",
		"export const Greeting: string = \"Hello\"",
		"export function Add(a: number, b: number): number",
		"export async function main(): Promise<void>",
		"let size = $.len(Greeting)",
		"$.print(\"total:\", size)",
		"$.println(Greeting, total)",
		"$.panic(\"unreachable\")",
		"await main()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsPackageLocalImport(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/imports\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/imports/subpkg\"",
			"func main() {",
			"  var b subpkg.Builder",
			"  b.Set(\"built\")",
			"  println(b.Value)",
			"  println(subpkg.Greet(\"world\"))",
			"  println(localMessage())",
			"}",
			"",
		}, "\n"),
		"helper.go": strings.Join([]string{
			"package main",
			"func localMessage() string {",
			"  return \"from helper\"",
			"}",
			"",
		}, "\n"),
		"subpkg/subpkg.go": strings.Join([]string{
			"package subpkg",
			"type Builder struct {",
			"  Value string",
			"}",
			"func (b *Builder) Set(value string) {",
			"  b.Value = value",
			"}",
			"func Greet(name string) string {",
			"  return \"Hello, \" + name",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      outputDir,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err.Error())
	}
	if result == nil || len(result.CompiledPackages) != 2 {
		t.Fatalf("unexpected result: %#v", result)
	}
	mainFile := filepath.Join(outputDir, "@goscript", "example.test", "imports", "main.gs.ts")
	mainContent, err := os.ReadFile(mainFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(mainContent), "import * as subpkg from \"@goscript/example.test/imports/subpkg/index.ts\"") {
		t.Fatalf("missing package-local import:\n%s", string(mainContent))
	}
	if !strings.Contains(string(mainContent), "let b: $.VarRef<subpkg.Builder> = $.varRef($.markAsStructValue(new subpkg.Builder()))") {
		t.Fatalf("missing imported struct zero value qualification:\n%s", string(mainContent))
	}
	if !strings.Contains(string(mainContent), "import * as __goscript_helper from \"./helper.gs.ts\"") ||
		!strings.Contains(string(mainContent), "$.println(__goscript_helper.localMessage())") {
		t.Fatalf("missing same-package helper import:\n%s", string(mainContent))
	}
	indexFile := filepath.Join(outputDir, "@goscript", "example.test", "imports", "subpkg", "index.ts")
	indexContent, err := os.ReadFile(indexFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if string(indexContent) != "export { Builder, Greet } from \"./subpkg.gs.ts\"\n" {
		t.Fatalf("unexpected subpkg index:\n%s", string(indexContent))
	}
	mainIndexFile := filepath.Join(outputDir, "@goscript", "example.test", "imports", "index.ts")
	mainIndexContent, err := os.ReadFile(mainIndexFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if strings.Contains(string(mainIndexContent), "localMessage") {
		t.Fatalf("unexported helper leaked into package index:\n%s", string(mainIndexContent))
	}
}

func TestCompilePackagesEmitsStructMethodsAndPointerAssertions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/structs\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Counter struct { Value int }",
			"func (c Counter) Read() int {",
			"  return c.Value",
			"}",
			"func (c *Counter) Set(v int) {",
			"  c.Value = v",
			"}",
			"func main() {",
			"  original := Counter{Value: 1}",
			"  copy := original",
			"  pointer := &original",
			"  pointer.Set(2)",
			"  var iface any = pointer",
			"  _, ok := iface.(*Counter)",
			"  println(copy.Read(), original.Read(), ok)",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "structs", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export class Counter",
		"public clone(): Counter",
		"public Read(): number",
		"public Set(v: number): void",
		"let original = $.varRef($.markAsStructValue(new Counter({Value: 1})))",
		"let copy = $.markAsStructValue(original.value.clone())",
		"let pointer = original",
		"$.pointerValue(pointer).Set(2)",
		"let [, ok] = $.typeAssertTuple<Counter | $.VarRef<Counter> | null>(iface, { kind: $.TypeKind.Pointer, elemType: \"main.Counter\" })",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsArraySliceMapStringAndNamedMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/collections\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type MyInt int",
			"func (m MyInt) Double() int { return int(m) * 2 }",
			"type MySlice []int",
			"func (s *MySlice) Add(v int) { *s = append(*s, v) }",
			"func main() {",
			"  arr := [3]int{1: 10}",
			"  slice := make([]int, 0, 2)",
			"  empty := []rune{}",
			"  slice = append(slice, 5)",
			"  slice[0] = arr[1]",
			"  m := make(map[string]int)",
			"  m[\"one\"] = 1",
			"  value, ok := m[\"missing\"]",
			"  text := \"hé\"",
			"  var list MySlice",
			"  list.Add(7)",
			"  println(arr[1], slice[0], len(slice), cap(slice), len(empty), value, ok, text[0], text[1], MyInt(5).Double(), len(list))",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "collections", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type MyInt = number",
		"export function MyInt_Double(m: MyInt): number",
		"export type MySlice = $.Slice<number>",
		"export function MySlice_Add(s: $.VarRef<MySlice>, v: number): void",
		"let arr = [0, 10, 0]",
		"let slice = $.makeSlice<number>(0, 2, \"number\")",
		"let empty = $.arrayToSlice<number>([])",
		"slice![0] = arr[1]",
		"let m = $.makeMap<string, number>()",
		"$.mapSet(m, \"one\", 1)",
		"let [value, ok] = $.mapGet(m, \"missing\", 0)",
		"slice![0]",
		"let list: $.VarRef<MySlice> = $.varRef(null)",
		"MySlice_Add(list, 7)",
		"$.indexStringOrBytes(text, 0)",
		"MyInt_Double(5)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsInterfacesMethodValuesTypeSwitchesAndFunctionAssertions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interfaces\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Greeter func(name string) string",
			"func greet(name string) string { return \"hello \" + name }",
			"type Reader interface { Read() string }",
			"type Closer interface { Close() string }",
			"type ReadCloser interface { Reader; Closer }",
			"type Counter struct { Value int }",
			"func (c *Counter) Inc() { c.Value++ }",
			"func (c Counter) Read() string { return \"read\" }",
			"func (c Counter) Close() string { return \"close\" }",
			"func call(fn func()) { fn() }",
			"func main() {",
			"  counter := &Counter{}",
			"  call(counter.Inc)",
			"  var rc ReadCloser = counter",
			"  _, ok := rc.(ReadCloser)",
			"  var i any = Greeter(greet)",
			"  fn, ok := i.(Greeter)",
			"  var l any = (*struct { Name string })(nil)",
			"  _, ok2 := l.(*struct { Name string })",
			"  switch v := rc.(type) {",
			"  case ReadCloser:",
			"    println(v.Read(), fn(\"gopher\"), ok, ok2)",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "interfaces", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type Greeter = (name: string) => string",
		"export type ReadCloser = null | {",
		"Read(): string",
		"Close(): string",
		"$.registerInterfaceType(\n\t\"main.ReadCloser\"",
		"((__receiver) => (...args: any[]) => __receiver.Inc(...args))($.pointerValue(counter))",
		"$.namedFunction(greet, \"main.Greeter\")",
		"$.typedNil(\"*struct{Name string}\")",
		"elemType: { kind: $.TypeKind.Struct, methods: [], fields: {\"Name\": { kind: $.TypeKind.Basic, name: \"string\" }} }",
		"let fn = __goscriptTuple",
		"$.typeSwitch(",
		"types: [\"main.ReadCloser\"]",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsGenericMethodsAliasesAndDictionaries(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/generics\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Stringer interface { String() string }",
			"type MyInt int",
			"func (m MyInt) String() string { return \"int\" }",
			"type Box[T any] struct { value T }",
			"func (b Box[T]) Get() T { return b.value }",
			"func NewBox[T any](value T) Box[T] { return Box[T]{value: value} }",
			"type Set[T comparable] map[T]struct{}",
			"func ZeroValue[T Stringer]() T {",
			"  var zero T",
			"  return zero",
			"}",
			"func CallString[T Stringer](v T) string { return v.String() }",
			"func Sum[T Stringer](vals ...T) T {",
			"  var zero T",
			"  return zero",
			"}",
			"func main() {",
			"  box := NewBox(7)",
			"  println(box.Get())",
			"  seen := make(Set[int])",
			"  seen[1] = struct{}{}",
			"  zero := ZeroValue[MyInt]()",
			"  println(CallString(zero))",
			"  sum := Sum[MyInt]()",
			"  println(CallString(sum))",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "generics", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public Get(): any",
		"export function NewBox(__typeArgs: $.GenericTypeArgs | undefined, value: any): Box",
		"let seen = $.makeMap<number, Record<string, unknown>>()",
		"$.mapSet(seen, 1, {})",
		"$.genericZero(__typeArgs, \"T\", null)",
		"$.callGenericMethod(__typeArgs, \"T\", \"String\", v)",
		"ZeroValue({T: { zero: () => 0, methods: {String: MyInt_String} }})",
		"CallString({T: { zero: () => 0, methods: {String: MyInt_String} }}, zero)",
		"Sum({T: { zero: () => 0, methods: {String: MyInt_String} }}, null)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPacksVariadicCalls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/variadic\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Collector func(label string, parts ...string) string",
			"type Joiner interface {",
			"  Join(parts ...string) string",
			"}",
			"type Path struct{}",
			"func collect(label string, parts ...string) string {",
			"  for _, part := range parts {",
			"    if part == \"\" {",
			"      return label",
			"    }",
			"  }",
			"  return label + string(rune(len(parts)+'0'))",
			"}",
			"func maybeErr(parts ...string) error { return nil }",
			"func (Path) Join(parts ...string) string {",
			"  return collect(\"method\", parts...)",
			"}",
			"func main() {",
			"  parts := []string{\"a\", \"b\"}",
			"  collect(\"none\")",
			"  collect(\"two\", \"a\", \"b\")",
			"  collect(\"spread\", parts...)",
			"  parts = append(parts, \"c\", \"d\")",
			"  maybeErr(\"ok\")",
			"  var fn Collector = collect",
			"  fn(\"fn\", \"x\")",
			"  var joiner Joiner = Path{}",
			"  joiner.Join(\"q\", \"r\")",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "variadic", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type Collector = (label: string, parts: $.Slice<string>) => string",
		"Join(parts: $.Slice<string>): string",
		"export function collect(label: string, parts: $.Slice<string>): string",
		"let part = parts![__rangeIndex]",
		"export function maybeErr(parts: $.Slice<string>): $.GoError",
		"public Join(parts: $.Slice<string>): string",
		"collect(\"none\", null)",
		"collect(\"two\", $.arrayToSlice<string>([\"a\", \"b\"]))",
		"collect(\"spread\", parts)",
		"$.append(parts, \"c\", \"d\")",
		"maybeErr($.arrayToSlice<string>([\"ok\"]))",
		"fn(\"fn\", $.arrayToSlice<string>([\"x\"]))",
		"joiner.Join($.arrayToSlice<string>([\"q\", \"r\"]))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsAsyncChannelsSelectAndDefer(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/async\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Processor interface { Process(v int) int }",
			"type Worker struct { ch chan int }",
			"func (w *Worker) Process(v int) int {",
			"  w.ch <- v",
			"  return <-w.ch",
			"}",
			"func call(p Processor) int { return p.Process(2) }",
			"func main() {",
			"  ch := make(chan int, 1)",
			"  defer func() { <-ch }()",
			"  go func() { ch <- 1 }()",
			"  select {",
			"  case v := <-ch:",
			"    println(v)",
			"  default:",
			"    println(\"default\")",
			"  }",
			"  _ = call(&Worker{ch: make(chan int, 1)})",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "async", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"Process(v: number): Promise<number>",
		"public async Process(v: number): Promise<number>",
		"let ch = $.makeChannel<number>(1, 0, \"both\")",
		"await $.chanSend($.pointerValue(w).ch, v)",
		"return await $.chanRecv($.pointerValue(w).ch)",
		"await using __defer = new $.AsyncDisposableStack()",
		"queueMicrotask(async () => { await (async (): Promise<void> => {",
		"$.selectStatement([",
		"let v = result.value",
		"await call(new Worker({ch: $.makeChannel<number>(1, 0, \"both\")}))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesScopesIfInitDeclarations(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/ifinit\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func pair() (string, bool) {",
			"  return \"value\", true",
			"}",
			"func main() {",
			"  if value, ok := pair(); ok {",
			"    println(value)",
			"  }",
			"  if value, ok := pair(); ok {",
			"    println(value)",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "ifinit", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if strings.Count(string(content), "{\n\t\tlet [value, ok] = pair()") != 2 {
		t.Fatalf("if init declarations were not block scoped:\n%s", string(content))
	}
}

func TestCompilePackagesReportsUnsupportedUnaryBeforeOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/unsupported\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"var value = 1",
			"func main() {",
			"  println(^value)",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatal("expected unsupported unary expression to fail")
	}
	requireDiagnostic(t, err, "goscript/lowering:unsupported")
	if result == nil || len(result.Diagnostics) == 0 {
		t.Fatalf("expected structured diagnostics in result")
	}
	if _, statErr := os.Stat(outputDir); !os.IsNotExist(statErr) {
		t.Fatalf("compile wrote output directory after lowering failed: %v", statErr)
	}
}

func TestCompileSourceToTypeScriptStopsAtSkeleton(t *testing.T) {
	_, err := CompileSourceToTypeScript("package main\nfunc main() {}\n", "main")
	if err == nil {
		t.Fatal("expected WASM source compile to fail in the skeleton")
	}
	requireDiagnostic(t, err, "goscript/wasm:single-file-unsupported")
}

func requireDiagnostic(t *testing.T, err error, code string) {
	t.Helper()

	var compileErr *CompileError
	if !errors.As(err, &compileErr) {
		t.Fatalf("expected CompileError, got %T: %v", err, err)
	}
	for _, diag := range compileErr.Diagnostics {
		if diag.Code == code {
			return
		}
	}
	t.Fatalf("missing diagnostic %q in %#v", code, compileErr.Diagnostics)
}
