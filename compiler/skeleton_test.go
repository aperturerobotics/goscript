package compiler

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"slices"
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
		"import * as $ from \"@goscript/builtin/index.js\"",
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

func TestCompilePackagesEmitsShadowedBuiltinCalls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/shadowbuiltin\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package shadowbuiltin",
			"type Value struct {",
			"  N int",
			"}",
			"func Build(new func() (*Value, error)) (*Value, error) {",
			"  return new()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "shadowbuiltin", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return _new!()") {
		t.Fatalf("shadowed builtin call was not emitted as a callable value:\n%s", text)
	}
}

func TestCompilePackagesQuotesRawStringLiterals(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/rawstrings\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package rawstrings",
			"func Values() (string, string) {",
			"  return `\\u00`, `invalid escape char after \\`",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "rawstrings", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, `return ["\\u00", "invalid escape char after \\"]`) {
		t.Fatalf("raw string literals were not quoted for TypeScript:\n%s", text)
	}
}

func TestCompilePackagesUsesEmbedOverride(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":       "module example.test/embedblank\n\ngo 1.25.3\n",
		"version.txt":  "1.2.3\n",
		"version..txt": "4.5.6\n",
		"binary.bin":   string([]byte{0x00, 0xff, 0x80, 0x41}),
		"main.go": strings.Join([]string{
			"package embedblank",
			"import _ \"embed\"",
			"//go:embed version.txt",
			"var Version string",
			"//go:embed version..txt",
			"var Dotted string",
			"//go:embed binary.bin",
			"var Binary []byte",
			"func GetVersion() string {",
			"  return Version",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir, AllDependencies: true}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err.Error())
	}
	if !slices.Contains(result.CopiedPackages, "embed") {
		t.Fatalf("embed override was not copied: %#v", result.CopiedPackages)
	}
	if _, err := os.Stat(filepath.Join(outputDir, "@goscript", "embed", "index.ts")); err != nil {
		t.Fatalf("embed override missing from output: %v", err)
	}
	if _, err := os.Stat(filepath.Join(outputDir, "@goscript", "embed", "embed.gs.ts")); !os.IsNotExist(err) {
		t.Fatalf("stdlib embed was emitted instead of override: %v", err)
	}
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "embedblank", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), "export let Version: string = \"1.2.3\\n\"") {
		t.Fatalf("embedded string content was not emitted:\n%s", string(content))
	}
	if !strings.Contains(string(content), "export let Dotted: string = \"4.5.6\\n\"") {
		t.Fatalf("embedded dotted filename content was not emitted:\n%s", string(content))
	}
	if !strings.Contains(string(content), "export let Binary: $.Slice<number> = new Uint8Array([0, 255, 128, 65])") {
		t.Fatalf("embedded binary content was not emitted as byte values:\n%s", string(content))
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
	if !strings.Contains(string(mainContent), "import * as subpkg from \"@goscript/example.test/imports/subpkg/index.js\"") {
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

func TestCompilePackagesEmitsIndexAddressRefs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/indexaddr\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Item struct { N int }",
			"func set(ptr *int, value int) {",
			"  *ptr = value",
			"}",
			"func Use(values []int, i int) int {",
			"  set(&values[i], 9)",
			"  return values[i]",
			"}",
			"func Items() []*Item {",
			"  return []*Item{{N: 1}}",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	_, err = comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "indexaddr", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "set($.indexRef(values!, i), 9)") {
		t.Fatalf("missing index address reference:\n%s", text)
	}
	if !strings.Contains(text, "new Item({N: 1})") {
		t.Fatalf("missing elided pointer composite literal:\n%s", text)
	}
}

func TestCompilePackagesEmitsStructMethodsAndPointerAssertions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/structs\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Counter struct {",
			"  // Value counts reads.",
			"  Value int `json:\"value\"`",
			"}",
			"func (c Counter) Read() int {",
			"  return c.Value",
			"}",
			"func (c *Counter) Set(v int) {",
			"  c.Value = v",
			"}",
			"func NewCounter() *Counter {",
			"  return &Counter{Value: 3}",
			"}",
			"func main() {",
			"  original := Counter{Value: 1}",
			"",
			"  // Copy should stay readable in generated output.",
			"  copy := original",
			"  pointer := &original",
			"  pointer.Set(2)",
			"  NewCounter().Set(5)",
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
		"// Value counts reads.\n\tpublic get Value(): number",
		"public clone(): Counter",
		"public Read(): number",
		"public Set(v: number): void",
		"let original = $.varRef($.markAsStructValue(new Counter({Value: 1})))",
		"let original = $.varRef($.markAsStructValue(new Counter({Value: 1})))\n\n\t// Copy should stay readable in generated output.\n\tlet copy",
		"let copy = $.markAsStructValue(original.value.clone())",
		"let pointer: Counter | $.VarRef<Counter> | null = original",
		"$.pointerValue<Counter>(pointer).Set(2)",
		"$.pointerValue<Counter>(NewCounter()).Set(5)",
		"let [, ok] = $.typeAssertTuple<Counter | $.VarRef<Counter> | null>(iface, { kind: $.TypeKind.Pointer, elemType: \"main.Counter\" })",
		"\"Value\": { type: { kind: $.TypeKind.Basic, name: \"int\" }, tag: \"json:\\\"value\\\"\" }",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsNestedPointerStorageAssertions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/pointers\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func main() {",
			"  var x int = 10",
			"  p1 := &x",
			"  p2 := &p1",
			"  p3 := &p2",
			"  ***p3 = 12",
			"  println(x)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "pointers", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"let x: $.VarRef<number> = $.varRef(10)",
		"let p1 = $.varRef(x)",
		"let p2 = $.varRef(p1)",
		"let p3 = p2",
		"$.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))!.value = 12",
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
			"  literal := []int{1, 2}",
			"  literal = append(literal, 3)",
			"  slice = append(slice, 5)",
			"  slice[0] = arr[1]",
			"  m := make(map[string]int)",
			"  m[\"one\"] = 1",
			"  value, ok := m[\"missing\"]",
			"  text := \"hé\"",
			"  var list MySlice",
			"  list.Add(7)",
			"  println(arr[1], slice[0], literal[2], len(slice), cap(slice), len(empty), value, ok, text[0], text[1], MyInt(5).Double(), len(list))",
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
		"let literal = $.arrayToSlice<number>([1, 2])",
		"literal = $.append(literal, 3)",
		"slice![0] = arr[1]",
		"let m = $.makeMap<string, number>()",
		"$.mapSet(m, \"one\", 1)",
		"let [value, ok] = $.mapGet(m, \"missing\", 0)",
		"slice![0]",
		"literal![2]",
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
		"export type Greeter = ((name: string) => string) | null",
		"export type ReadCloser = null | {",
		"Read(): string",
		"Close(): string",
		"$.registerInterfaceType(\n\t\"main.ReadCloser\"",
		"((__receiver) => () => __receiver.Inc())($.pointerValue<Counter>(counter))",
		"$.namedFunction(greet, \"main.Greeter\")",
		"$.typedNil(\"*struct{Name string}\")",
		"elemType: { kind: $.TypeKind.Struct, methods: [], fields: {\"Name\": { kind: $.TypeKind.Basic, name: \"string\" }} }",
		"let fn = __goscriptTuple",
		"switch (true)",
		"case $.typeAssert<any>(__goscriptTypeSwitchValue, \"main.ReadCloser\").ok",
		"let v = $.typeAssert<any>(__goscriptTypeSwitchValue, \"main.ReadCloser\").value",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAssertsInterfaceMethodReceivers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interface-receivers\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type FileInfo interface { Name() string }",
			"type fileInfo struct { name string }",
			"func (f fileInfo) Name() string { return f.name }",
			"func stat() (FileInfo, error) { return fileInfo{name: \"demo\"}, nil }",
			"func main() {",
			"  info, err := stat()",
			"  if err == nil {",
			"    println(info.Name())",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "interface-receivers", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type FileInfo = null | {",
		"$.println($.pointerValue(info).Name())",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesBoxesTypedNilInterfaceValues(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/typed-nil-interface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Animal interface { Name() string }",
			"type Dog struct { name string }",
			"func (d *Dog) Name() string {",
			"  if d == nil {",
			"    return \"unknown dog\"",
			"  }",
			"  return d.name",
			"}",
			"func FindDog() *Dog { return nil }",
			"func FindAnimal() Animal { return Animal(FindDog()) }",
			"func main() {",
			"  animal := FindAnimal()",
			"  println(animal.Name())",
			"  var dog *Dog = nil",
			"  var a Animal = dog",
			"  println(a == nil)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "typed-nil-interface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"return $.interfaceValue<Animal | null>(FindDog(), \"*main.Dog\")",
		"$.println($.pointerValue(animal).Name())",
		"let a: Animal | null = $.interfaceValue<Animal | null>(dog, \"*main.Dog\")",
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
		"let seen = $.makeMap<number, {}>()",
		"$.mapSet(seen, 1, {})",
		"$.genericZero(__typeArgs, \"T\", null)",
		"$.callGenericMethod(__typeArgs, \"T\", \"String\", v)",
		"ZeroValue({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: MyInt_String} }})",
		"CallString({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: MyInt_String} }}, zero)",
		"Sum({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: MyInt_String} }}, null)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAttachesFunctionLiteralTypeInfo(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/function-type-info\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Callback func(value int) string",
			"func call(cb Callback) string {",
			"  return cb(1)",
			"}",
			"func main() {",
			"  fn := func(value int) string {",
			"    return \"\"",
			"  }",
			"  var cb Callback = nil",
			"  _ = fn",
			"  _ = cb",
			"  _ = call(fn)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "function-type-info", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type Callback = ((value: number) => string) | null",
		"export function call(cb: Callback): string {\n\treturn cb!(1)",
		"$.functionValue((value: number): string => {",
		"kind: $.TypeKind.Function",
		"params: [{ kind: $.TypeKind.Basic, name: \"int\" }]",
		"results: [{ kind: $.TypeKind.Basic, name: \"string\" }]",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesEmitsRecursiveFunctionTypeInfo(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/recursive-function-type\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Handler func(Handler) Handler",
			"type Holder struct { Next Handler }",
			"func main() { _ = Holder{} }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "recursive-function-type", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type Handler = ((_p0: Handler) => Handler) | null",
		"\"Next\": { kind: $.TypeKind.Function, name: \"main.Handler\"",
		"params: [{ kind: $.TypeKind.Function, params: [], results: [] }]",
		"results: [{ kind: $.TypeKind.Function, params: [], results: [] }]",
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
		"export type Collector = ((label: string, parts: $.Slice<string>) => string) | null",
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
		"fn!(\"fn\", $.arrayToSlice<string>([\"x\"]))",
		"$.pointerValue(joiner).Join($.arrayToSlice<string>([\"q\", \"r\"]))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPacksVariadicCallsInGeneratedSubpackage(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/variadic-subpackage\n\ngo 1.25.3\n",
		"json/json.go": strings.Join([]string{
			"package json",
			"import \"fmt\"",
			"type State struct { err error }",
			"func (s *State) SetErrorf(format string, a ...any) {",
			"  s.err = fmt.Errorf(format, a...)",
			"}",
			"func (s *State) Read(key string) {",
			"  s.SetErrorf(\"bad %q\", key)",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "./json"); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "variadic-subpackage", "json", "json.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	want := "$.pointerValue<State>(s).SetErrorf(\"bad %q\", $.arrayToSlice<any>([key]))"
	if !strings.Contains(text, want) {
		t.Fatalf("missing %q in generated output:\n%s", want, text)
	}
	if strings.Contains(text, "$.pointerValue<State>(s).SetErrorf(\"bad %q\", key)") {
		t.Fatalf("generated override subpackage call was not packed:\n%s", text)
	}
}

func TestCompilePackagesLowersRangeOverFunctionIterators(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/iterators\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func pairs(yield func(int, string) bool) {",
			"  values := []string{\"a\", \"b\"}",
			"  for i, v := range values {",
			"    if !yield(i, v) {",
			"      break",
			"    }",
			"  }",
			"}",
			"func main() {",
			"  for i, v := range pairs {",
			"    println(i, v)",
			"  }",
			"  var last int",
			"  for last = range pairs {",
			"    println(last)",
			"  }",
			"  for i := range 3 {",
			"    if i == 1 {",
			"      continue",
			"    }",
			"    println(i)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "iterators", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"if (!_yield!(i, v))",
		"break",
		"pairs!((i, v) => {",
		"last = __goscriptRange",
		"return true",
		"continue",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesLowersFunctionIteratorControlFlow(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/iterator-control\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func values(yield func(int) bool) {",
			"  for i := range 4 {",
			"    if !yield(i) {",
			"      return",
			"    }",
			"  }",
			"}",
			"func first(limit int) int {",
			"  j := 3",
			"  for i := 0; i < j; i, j = i+1, j-1 {",
			"    println(i, j)",
			"  }",
			"  for v := range values {",
			"    if v == 0 {",
			"      continue",
			"    }",
			"    for i := range 2 {",
			"      if i == 1 {",
			"        break",
			"      }",
			"    }",
			"    if v == limit {",
			"      break",
			"    }",
			"    switch v {",
			"    case 2:",
			"      return v",
			"    }",
			"    switch any(v).(type) {",
			"    case int:",
			"      if v == 3 {",
			"        return v",
			"      }",
			"    }",
			"  }",
			"  return -1",
			"}",
			"func main() { println(first(3)) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "iterator-control", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"let __goscriptRangeReturn",
		"let __goscriptRangeReturnValue",
		"return true",
		"return false",
		"__goscriptRangeReturnValue",
		"if (__goscriptRangeReturn",
		"return __goscriptRangeReturnValue",
		"for (let i = 0; i < j; [i, j] = [i + 1, j - 1])",
		"for (let i = 0; i < 2; i++)",
		"switch (v)",
		"const __goscriptTypeSwitchValue",
		"switch (true)",
		"case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: \"int\" }).ok",
		"break",
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
		"await $.chanSend($.pointerValue<Worker>(w).ch, v)",
		"return await $.chanRecv($.pointerValue<Worker>(w).ch)",
		"await using __defer = new $.AsyncDisposableStack()",
		"queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {",
		"$.selectStatement<any, void>([",
		"let v = result.value",
		"await call($.interfaceValue<Processor | null>(new Worker({ch: $.makeChannel<number>(1, 0, \"both\")}), \"*main.Worker\"))",
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

func TestCompilePackagesLowersSwitchesAndFunctionValueCalls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/switchcall\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func main() {",
			"  value := 2",
			"  switch value {",
			"  case 1:",
			"    println(\"one\")",
			"  case 2, 3:",
			"    local := \"two-three\"",
			"    println(local)",
			"  default:",
			"    println(\"other\")",
			"  }",
			"  switch {",
			"  case value > 1:",
			"    println(\"positive\")",
			"  }",
			"Block:",
			"  for value > 0 {",
			"    switch value {",
			"    case 2:",
			"      value--",
			"      fallthrough",
			"    case 1:",
			"      break Block",
			"    }",
			"  }",
			"Again:",
			"  value--",
			"  if value > 0 {",
			"    goto Again",
			"  }",
			"  release := func() { println(\"release\") }",
			"  rel := &release",
			"  (*rel)()",
			"  wrapped := func() {",
			"    defer println(\"wrapped deferred\")",
			"    println(\"wrapped body\")",
			"  }",
			"  wrapped()",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "switchcall", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"switch (value) {",
		"case 2:",
		"case 3:",
		"let local = \"two-three\"",
		"switch (true) {",
		"Block: while (value > 0)",
		"break Block",
		"Again: while (true)",
		"continue Again",
		"($.pointerValue<(() => void) | null>(rel))!()",
		"$.functionValue((): void => {\n\t\tusing __defer = new $.DisposableStack()",
		"__defer.defer(() => { $.println(\"wrapped deferred\") })",
		"$.println(\"wrapped body\")",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Count(text, "\t\tbreak\n") < 3 {
		t.Fatalf("switch cases were not rendered with implicit breaks:\n%s", text)
	}
	if strings.Contains(text, "fallthrough") {
		t.Fatalf("fallthrough marker leaked into generated output:\n%s", text)
	}
}

func TestCompilePackagesLowersMethodValuesWithFixedParameters(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/methodvalue\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Counter int",
			"func (c Counter) Add(n int) int {",
			"  return int(c) + n",
			"}",
			"type Runner struct{}",
			"func (r Runner) Run() {",
			"  println(\"run\")",
			"}",
			"func main() {",
			"  c := Counter(4)",
			"  add := c.Add",
			"  println(add(3))",
			"  r := Runner{}",
			"  run := r.Run",
			"  run()",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "methodvalue", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"((__receiver) => (n: number) => Counter_Add(__receiver, n))(c)",
		"((__receiver) => () => __receiver.Run())(",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "...args: any[]") {
		t.Fatalf("method value lowering still uses spread args:\n%s", text)
	}
}

func TestCompilePackagesQualifiesImportedTypesInSignaturesAndZeroValues(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/qualified\n\ngo 1.25.3\n",
		"lib/lib.go": strings.Join([]string{
			"package lib",
			"type Box struct {",
			"  Value int",
			"}",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"example.test/qualified/lib\"",
			"  \"sync/atomic\"",
			")",
			"type Holder struct {",
			"  Box lib.Box",
			"  Boxes []lib.Box",
			"  Fn func(lib.Box) (lib.Box, error)",
			"  Ptr atomic.Pointer[func()]",
			"}",
			"func Use(fn func(lib.Box) (lib.Box, error), box lib.Box) (lib.Box, error) {",
			"  return fn(box)",
			"}",
			"func main() {",
			"  _ = Holder{}",
			"  _, _ = Use(func(box lib.Box) (lib.Box, error) { return box, nil }, lib.Box{})",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "qualified", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"Box: $.VarRef<lib.Box>",
		"Boxes: $.VarRef<$.Slice<lib.Box>>",
		"Fn: $.VarRef<((_p0: lib.Box) => [lib.Box, $.GoError] | Promise<[lib.Box, $.GoError]>) | null>",
		"Ptr: $.VarRef<atomic.Pointer<(() => void) | null>>",
		"$.markAsStructValue(new lib.Box())",
		"$.markAsStructValue(new atomic.Pointer<(() => void) | null>())",
		"export function Use(fn: ((_p0: lib.Box) => [lib.Box, $.GoError]) | null, box: lib.Box): [lib.Box, $.GoError]",
		"$.functionValue((box: lib.Box): [lib.Box, $.GoError] => {",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesLowersUnaryBitwiseComplement(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/unary-bitwise\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"var value = 1",
			"func main() {",
			"  mask := 7",
			"  mask &^= 3",
			"  println(^value, value &^ 3, mask, 0700)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "unary-bitwise", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"mask = mask & ~(3)",
		"$.println(~value, value & ~(3), mask, 0o700)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompileSourceToTypeScriptCompilesSingleFile(t *testing.T) {
	output, err := CompileSourceToTypeScript("package main\nfunc main() { println(\"hi\") }\n", "main")
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(output, "$.println(\"hi\")") {
		t.Fatalf("missing println in generated output:\n%s", output)
	}
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
