package compiler

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"regexp"
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
		"export async function main(): globalThis.Promise<void>",
		"let size = 5",
		"$.print(\"total:\", size)",
		"$.println(\"Hello\", total)",
		"$.panic(\"unreachable\")",
		"await main()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesSkipsPureTopLevelBlankAssertions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/blankassert\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type named interface { Name() string }",
			"type item struct{}",
			"func (*item) Name() string { return \"item\" }",
			"var defaultItem = &item{}",
			"var _ named = defaultItem",
			"func main() { println(defaultItem.Name()) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "blankassert", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "__goscriptBlank") {
		t.Fatalf("pure top-level blank assertion emitted runtime binding:\n%s", text)
	}
	if !strings.Contains(text, "export let defaultItem") {
		t.Fatalf("missing real package variable:\n%s", text)
	}
}

func TestCompilePackagesLazilyInitializesCrossFilePackageVars(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazyvars\n\ngo 1.25.3\n",
		"a.go": strings.Join([]string{
			"package main",
			"type words []int",
			"type remote struct { n int }",
			"var one = words{1}",
			"func useTwo() int { return two.values[0] + remoteZero.n }",
			"",
		}, "\n"),
		"b.go": strings.Join([]string{
			"package main",
			"type holder struct { values words }",
			"var two = holder{one}",
			"var remoteZero remote",
			"func main() { println(useTwo(), two.values[0]) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "lazyvars", "b.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export var two: holder",
		"export function __goscript_get_two(): holder",
		"export var remoteZero: __goscript_a.remote",
		"export function __goscript_get_remoteZero(): __goscript_a.remote",
		"__goscript_a.__goscript_get_one()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	aFile := filepath.Join(outputDir, "@goscript", "example.test", "lazyvars", "a.gs.ts")
	aContent, err := os.ReadFile(aFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(aContent), "__goscript_b.__goscript_get_two()") {
		t.Fatalf("missing lazy cross-file getter use in a.go output:\n%s", string(aContent))
	}
}

func TestCompilePackagesLazilyInitializesSameFileLaterPackageVars(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazylatervars\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type detail struct { n int }",
			"var table = []detail{{n: later.n}}",
			"var later = detail{n: 7}",
			"func main() { println(table[0].n) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "lazylatervars", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export var table: $.Slice<detail>",
		"export function __goscript_get_table(): $.Slice<detail>",
		"export let later: detail = $.markAsStructValue(new detail({n: 7}))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesLazilyInitializesFunctionBodyPackageVarDependencies(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazybodyvars\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Point struct { n int }",
			"var first, _ = new(Point).SetBytes()",
			"func (p *Point) SetBytes() (*Point, error) {",
			"  p.n = later",
			"  return p, nil",
			"}",
			"var later = 7",
			"func main() { println(first.n) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "lazybodyvars", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export var first: Point | $.VarRef<Point> | null",
		"export function __goscript_get_first(): Point | $.VarRef<Point> | null",
		"function __goscript_get___goscriptTuple",
		"export let later: number = 7",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesLazilyInitializesEffectFreeTypeForFromCrossFileInit(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazytypefor\n\ngo 1.25.3\n",
		"a.go": strings.Join([]string{
			"package main",
			"import \"reflect\"",
			"var stringType = reflect.TypeFor[string]()",
			"var _ = marker",
			"",
		}, "\n"),
		"b.go": strings.Join([]string{
			"package main",
			"func readStringType() { println(stringType != nil) }",
			"func main() {}",
			"",
		}, "\n"),
		"c.go": strings.Join([]string{
			"package main",
			"var marker = 1",
			"func init() { readStringType() }",
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
	aFile := filepath.Join(outputDir, "@goscript", "example.test", "lazytypefor", "a.gs.ts")
	aContent, err := os.ReadFile(aFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	aText := string(aContent)
	for _, want := range []string{
		"export var stringType: reflect.Type | null",
		"export function __goscript_get_stringType(): reflect.Type | null",
		"stringType = reflect.TypeFor",
	} {
		if !strings.Contains(aText, want) {
			t.Fatalf("missing %q in generated a.go output:\n%s", want, aText)
		}
	}
	bFile := filepath.Join(outputDir, "@goscript", "example.test", "lazytypefor", "b.gs.ts")
	bContent, err := os.ReadFile(bFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	bText := string(bContent)
	if !strings.Contains(bText, "__goscript_a.__goscript_get_stringType() != null") {
		t.Fatalf("missing lazy TypeFor package var getter use:\n%s", bText)
	}
	if strings.Contains(bText, "__goscript_a.stringType != null") {
		t.Fatalf("cross-file init still reads TypeFor package var directly:\n%s", bText)
	}
}

func TestCompilePackagesInitializesLazyAsyncPackageVarsBeforeInit(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazyasyncvars\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync\"",
			"var lock sync.Mutex",
			"var first = makeFirst()",
			"func makeFirst() int {",
			"  lock.Lock()",
			"  defer lock.Unlock()",
			"  return later",
			"}",
			"var later = 7",
			"func init() { println(first) }",
			"func main() {}",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "lazyasyncvars", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"async function __goscript_init_first(): globalThis.Promise<void>",
		"first = await makeFirst()",
		"export function __goscript_get_first(): number",
		"await __goscript_init_first()",
		"__goscriptInit0()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAssignsLazyPackageVarsDirectly(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/lazyassign\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"var table = []int{later}",
			"var later = 1",
			"func init() {",
			"  table = append(table, 2)",
			"}",
			"func main() { println(len(table)) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "lazyassign", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "__goscript_set_table($.append(__goscript_get_table(), 2))") {
		t.Fatalf("missing lazy package var assignment through setter:\n%s", text)
	}
	if strings.Contains(text, "__goscript_get_table() =") {
		t.Fatalf("lazy getter used as assignment target:\n%s", text)
	}
}

func TestCompilePackagesAssignsImportedPackageVarsThroughSetters(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/pkgvarassign\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"var Count int",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/pkgvarassign/dep\"",
			"func bump() {",
			"  dep.Count = 1",
			"  dep.Count += 16",
			"  dep.Count++",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "pkgvarassign", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"dep.__goscript_set_Count(1)",
		"dep.__goscript_set_Count(dep.Count + 16)",
		"dep.__goscript_set_Count(dep.Count + 1)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing imported package var setter assignment %q:\n%s", want, text)
		}
	}
	if strings.Contains(text, "dep.Count +=") || strings.Contains(text, "dep.Count++") {
		t.Fatalf("imported package var assigned directly:\n%s", text)
	}
}

func TestCompilePackagesAliasesForInitShortDeclShadow(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/forinitshadow\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func checksum(n int) int {",
			"  total := 0",
			"  for n := n - 4; total <= n; total++ {",
			"    total += n",
			"  }",
			"  return total + n",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "forinitshadow", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "for (let n = n - 4") {
		t.Fatalf("for init short declaration references itself:\n%s", text)
	}
	if !regexp.MustCompile(`let __goscriptShadow\d+ = n\s+for \(let __goscriptShadow\d+ = __goscriptShadow\d+ - 4; total <= __goscriptShadow\d+; total\+\+\)`).MatchString(text) {
		t.Fatalf("missing aliased for init shadow declaration:\n%s", text)
	}
	if !strings.Contains(text, "return total + n") {
		t.Fatalf("outer n was not preserved after the loop:\n%s", text)
	}
}

func TestCompilePackagesDoesNotAliasPackageShadowWithoutRead(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/packageshadow\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"var value = 1",
			"func main() {",
			"  value := 2",
			"  var other = 3",
			"  println(value, other)",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "packageshadow", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "let value = 2") {
		t.Fatalf("local package shadow was not emitted with its source name:\n%s", text)
	}
	if strings.Contains(text, "__goscriptShadow") {
		t.Fatalf("package shadow without initializer read should not allocate a shadow alias:\n%s", text)
	}
}

func TestCompilePackagesAliasesPackageShadowInitializerReads(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/packageshadowread\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"var value = 1",
			"func helper() int { return 4 }",
			"func main() {",
			"  println(helper())",
			"  helper := 5",
			"  println(helper)",
			"  first := value",
			"  value := value + 1",
			"  {",
			"    var first = first + value",
			"    println(first)",
			"  }",
			"  println(value)",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "packageshadowread", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "let value = value + 1") || strings.Contains(text, "let first: number = 0\n\t\tfirst = first + value") {
		t.Fatalf("initializer read was emitted through a TDZ self-reference:\n%s", text)
	}
	if strings.Contains(text, "let helper = 5") {
		t.Fatalf("same-file package function shadow was emitted with a TDZ-prone source name:\n%s", text)
	}
	if strings.Count(text, "__goscriptShadow") < 3 {
		t.Fatalf("missing shadow aliases for initializer reads:\n%s", text)
	}
}

func TestCompilePackagesLowersPackageConstBeforeLocalShadow(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/constshadow\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"const headerLength = 4",
			"func parse(buf []byte) int {",
			"  if len(buf) < headerLength {",
			"    return headerLength",
			"  }",
			"  n := len(buf)",
			"  headerLength := n",
			"  return headerLength",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "constshadow", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "$.len(buf) < headerLength") || strings.Contains(text, "return headerLength\n\t}") {
		t.Fatalf("package const read was emitted through local TDZ shadow:\n%s", text)
	}
	if !strings.Contains(text, "$.len(buf) < 4") || !strings.Contains(text, "return 4") {
		t.Fatalf("package const read was not lowered to a value before local shadow:\n%s", text)
	}
	if !strings.Contains(text, "let headerLength = n") {
		t.Fatalf("local shadow was not preserved:\n%s", text)
	}
}

func TestCompilePackagesPreservesNamedUint64InterfaceTypeInfo(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/nameduint64\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Pol uint64",
			"func (p Pol) String() string { return \"\" }",
			"func box() any {",
			"  var p Pol",
			"  return &p",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "nameduint64", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	want := `$.namedValueInterfaceValue<any>(p, "*main.Pol"`
	if !strings.Contains(text, want) {
		t.Fatalf("missing named interface box %q in generated output:\n%s", want, text)
	}
	want = `elemType: { kind: $.TypeKind.Basic, name: "uint64", typeName: "main.Pol" }`
	if !strings.Contains(text, want) {
		t.Fatalf("named uint64 pointer interface box lost type metadata:\n%s", text)
	}
}

func TestCompilePackagesLowersWideIntegerConstantsForUint64Targets(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/wideconst\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Pol uint64",
			"func normalize(f Pol) Pol {",
			"  f &= Pol((1 << 54) - 1)",
			"  f |= (1 << 53) | 1",
			"  return f",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "wideconst", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{`18014398509481983n`, `9007199254740993n`} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing wide integer constant %q in generated output:\n%s", want, text)
		}
	}
}

func TestLowerWideRelationalConstants(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/widerel\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Signed int64",
			"type Unsigned uint64",
			"func signed(s Signed) bool {",
			"  return s < -9007199254740992 && s <= -9007199254740993 && -9007199254740992 > s && -9007199254740993 >= s",
			"}",
			"func unsigned(u Unsigned) bool {",
			"  return u < 9007199254740993 && u <= 9223372036854775808 && 9007199254740993 > u && 9223372036854775808 >= u",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "widerel", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		`s < -9007199254740992n`,
		`s <= -9007199254740993n`,
		`-9007199254740992n > s`,
		`-9007199254740993n >= s`,
		`u < 9007199254740993n`,
		`u <= 9223372036854775808n`,
		`9007199254740993n > u`,
		`9223372036854775808n >= u`,
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing lowered wide relational comparison %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesReadsShadowedVarRefStructFieldsOnce(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/shadowvarreffield\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type key struct { pad []byte }",
			"func fill(k *key) error { return nil }",
			"func size() int {",
			"  var key key",
			"  if err := fill(&key); err != nil {",
			"    return 0",
			"  }",
			"  return len(key.pad)",
			"}",
			"func main() { println(size()) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "shadowvarreffield", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.len(__goscriptShadow0.value.pad)") {
		t.Fatalf("missing single dereference field read:\n%s", text)
	}
	if strings.Contains(text, ".value.value.pad") {
		t.Fatalf("shadowed VarRef struct field was dereferenced twice:\n%s", text)
	}
}

func TestCompilePackagesUnwrapsAnonymousStructPointerFieldReceivers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/anonstructptr\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package anonstructptr",
			"func mergeCore(dst, src *struct {",
			"  IsBare bool",
			"  Worktree string",
			"}) {",
			"  if src.IsBare {",
			"    dst.IsBare = true",
			"  }",
			"  if src.Worktree != \"\" {",
			"    dst.Worktree = src.Worktree",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "anonstructptr", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		`$.pointerValue<{"IsBare": boolean, "Worktree": string}>(src).IsBare`,
		`$.pointerValue<{"IsBare": boolean, "Worktree": string}>(dst).IsBare = true`,
		`$.pointerValue<{"IsBare": boolean, "Worktree": string}>(dst).Worktree = $.pointerValue<{"IsBare": boolean, "Worktree": string}>(src).Worktree`,
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	for _, bad := range []string{
		"src.IsBare",
		"dst.IsBare",
		"src.Worktree",
		"dst.Worktree",
	} {
		if strings.Contains(text, bad) {
			t.Fatalf("anonymous struct pointer field receiver stayed wrapped at %q:\n%s", bad, text)
		}
	}
}

func TestCompilePackagesWrapsChannelSendInterfaceValues(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/chansendiface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type item interface { Name() string }",
			"type concrete struct{}",
			"func (*concrete) Name() string { return \"ok\" }",
			"func send(ch chan item) {",
			"  v := &concrete{}",
			"  ch <- v",
			"}",
			"func main() {}",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "chansendiface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.chanSend(ch, $.interfaceValue<item | null>(v, \"*main.concrete\"))") {
		t.Fatalf("missing interface wrapper for channel send:\n%s", text)
	}
}

func TestCompilePackagesBindsFuncLiteralVarRefParams(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/funclitvarref\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type words []int",
			"func (w *words) Add(v int) { *w = append(*w, v) }",
			"func main() {",
			"  addLen := func(w words) int {",
			"    w.Add(7)",
			"    return len(w)",
			"  }",
			"  println(addLen(nil))",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "funclitvarref", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"(__goscriptParam0: words): number => {",
		"let w: $.VarRef<words> = $.varRef(__goscriptParam0)",
		"words_Add(w, 7)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAnnotatesNewPointerShortDecls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/newptrdecl\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type OID []int",
			"func use(*OID) {}",
			"func main() {",
			"  oid := new(OID)",
			"  if len(*oid) == 0 {",
			"    oid = nil",
			"  }",
			"  use(oid)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "newptrdecl", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"let oid: $.VarRef<OID> | null = $.varRef<OID>(null as OID)",
		"oid = null",
		"use(oid)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAnnotatesNewArrayPointerShortDecls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/newarrayptrdecl\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func use(*[32]byte) {}",
			"func main() {",
			"  buf := new([32]byte)",
			"  use(buf)",
			"  if true {",
			"    buf = nil",
			"  }",
			"  use(buf)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "newarrayptrdecl", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"let buf: $.VarRef<Uint8Array> | null = $.varRef<Uint8Array>(new Uint8Array(32))",
		"buf = null",
		"use(buf)",
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
	if !strings.Contains(text, "return await _new!()") {
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

func TestCompilePackagesEmitsBinaryStringLiterals(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/binarystrings\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package binarystrings",
			"const DecodeMap = \"\\xff\\x80A\"",
			"func Value() string {",
			"  return DecodeMap",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "binarystrings", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), "$.bytesToString(new Uint8Array([255, 128, 65]))") {
		t.Fatalf("binary string literal was not emitted as byte-backed string:\n%s", string(content))
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

func TestCompilePackagesEmbedsFS(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":             "module example.test/embedfs\n\ngo 1.25.3\n",
		"assets/config.json": `{"ok":true}`,
		"assets/nested.txt":  "nested",
		"extra.txt":          "extra",
		"main.go": strings.Join([]string{
			"package embedfs",
			"import \"embed\"",
			"//go:embed assets *.txt",
			"var StaticFS embed.FS",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir, AllDependencies: true}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "embedfs", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), `export let StaticFS: embed.FS = $.markAsStructValue(new embed.FS`) {
		t.Fatalf("embedded FS was not emitted as embed.FS:\n%s", string(content))
	}
	if !strings.Contains(string(content), `["assets/config.json", new Uint8Array([123, 34, 111, 107, 34, 58, 116, 114, 117, 101, 125])]`) {
		t.Fatalf("embedded FS file content was not emitted:\n%s", string(content))
	}
	if !strings.Contains(string(content), `["assets/nested.txt", new Uint8Array([110, 101, 115, 116, 101, 100])]`) {
		t.Fatalf("embedded FS directory file content was not emitted:\n%s", string(content))
	}
	if !strings.Contains(string(content), `["extra.txt", new Uint8Array([101, 120, 116, 114, 97])]`) {
		t.Fatalf("embedded FS glob file content was not emitted:\n%s", string(content))
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

func TestCompilePackagesCallsCrossPackageUnexportedReceiverDynamically(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/unexportedreceiver\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type hidden struct{}",
			"func NewHidden() *hidden { return &hidden{} }",
			"func (h *hidden) Value() int { return 7 }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/unexportedreceiver/dep\"",
			"func main() {",
			"  h := dep.NewHidden()",
			"  println(h.Value())",
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
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	mainFile := filepath.Join(outputDir, "@goscript", "example.test", "unexportedreceiver", "main.gs.ts")
	mainContent, err := os.ReadFile(mainFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(mainContent), "$.pointerValue<any>(h).Value()") {
		t.Fatalf("cross-package unexported receiver method call was not dynamic:\n%s", string(mainContent))
	}
	if strings.Contains(string(mainContent), "dep.hidden.prototype.Value.call") {
		t.Fatalf("cross-package unexported receiver leaked through imported prototype:\n%s", string(mainContent))
	}
}

func TestCompilePackagesEmitsTypeOnlyLocalImports(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/typeonlylocal\n\ngo 1.25.3\n",
		"a.go": strings.Join([]string{
			"package main",
			"type Acceptor interface {",
			"  Accept(Payload)",
			"}",
			"",
		}, "\n"),
		"payload.go": strings.Join([]string{
			"package main",
			"type Payload struct {",
			"  Value string",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{
		Dir:        moduleDir,
		OutputPath: outputDir,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "typeonlylocal", "a.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "import type * as __goscript_payload from \"./payload.gs.ts\"") {
		t.Fatalf("missing type-only same-package import:\n%s", text)
	}
	if strings.Contains(text, "import \"./payload.gs.ts\"") {
		t.Fatalf("type-only same-package import should not force sibling module execution:\n%s", text)
	}
}

func TestCompilePackagesPreservesSourceImportAliasesForAssociatedMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/sourcealiases\n\ngo 1.25.3\n",
		"dep/block/errors.go": strings.Join([]string{
			"package block",
			"import \"errors\"",
			"var ErrUnexpectedType = errors.New(\"unexpected object type\")",
			"",
		}, "\n"),
		"dep/kvtx/block/store.go": strings.Join([]string{
			"package kvtx_block",
			"type KeyValueStore struct{}",
			"",
		}, "\n"),
		"world/world.go": strings.Join([]string{
			"package world",
			"import block \"example.test/sourcealiases/dep/kvtx/block\"",
			"type World struct {",
			"  Object *block.KeyValueStore",
			"}",
			"",
		}, "\n"),
		"world/block-world.go": strings.Join([]string{
			"package world",
			"import (",
			"  block \"example.test/sourcealiases/dep/block\"",
			"  block_kvtx \"example.test/sourcealiases/dep/kvtx/block\"",
			")",
			"func (w *World) Apply(next any) error {",
			"  if _, ok := next.(*block_kvtx.KeyValueStore); !ok {",
			"    return block.ErrUnexpectedType",
			"  }",
			"  return nil",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "./world"); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "sourcealiases", "world", "world.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	matches := regexp.MustCompile(`import \* as (\w+) from "@goscript/example\.test/sourcealiases/dep/block/index\.js"`).FindStringSubmatch(text)
	if len(matches) != 2 {
		t.Fatalf("missing dep/block import in generated output:\n%s", text)
	}
	if !strings.Contains(text, "return "+matches[1]+".ErrUnexpectedType") {
		t.Fatalf("selector did not use the alias for its source package %q:\n%s", matches[1], text)
	}
}

func TestCompilePackagesEmitsSideEffectImportsForInterfaceRegistry(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interface-registry\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/interface-registry/dep\"",
			"type localImpl struct{}",
			"func (*localImpl) Ping() string { return \"pong\" }",
			"func matchLocal(v any) bool {",
			"  switch v.(type) {",
			"  case Local:",
			"    return true",
			"  }",
			"  return false",
			"}",
			"func matchDep(v any) bool {",
			"  _, ok := v.(dep.Remote)",
			"  return ok",
			"}",
			"func main() { println(matchLocal(&localImpl{}), matchDep(nil)) }",
			"",
		}, "\n"),
		"local.go": strings.Join([]string{
			"package main",
			"type Local interface { Ping() string }",
			"",
		}, "\n"),
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type Remote interface { Remote() string }",
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

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	mainContent, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "interface-registry", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	mainText := string(mainContent)
	for _, want := range []string{
		"import * as dep from \"@goscript/example.test/interface-registry/dep/index.js\"",
		"import \"@goscript/example.test/interface-registry/dep/index.js\"",
		"import type * as __goscript_local from \"./local.gs.ts\"",
		"case $.typeAssert<__goscript_local.Local | null>(__goscriptTypeSwitchValue, \"main.Local\").ok",
		"$.typeAssertTuple<dep.Remote | null>(v, \"dep.Remote\")",
	} {
		if !strings.Contains(mainText, want) {
			t.Fatalf("missing %q in main output:\n%s", want, mainText)
		}
	}

	depIndexContent, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "interface-registry", "dep", "index.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(depIndexContent), "import \"./dep.gs.ts\"") {
		t.Fatalf("missing interface side-effect import in dep index:\n%s", string(depIndexContent))
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

func TestCompilePackagesLowersUnsafeBytePointerArithmetic(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/unsafeaddr\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"unsafe\"",
			"func Set(bits []uint64, idx uint64, mask []uint8) uint8 {",
			"  ptr := unsafe.Pointer(uintptr(unsafe.Pointer(&bits[idx>>6])) + uintptr((idx%64)>>3))",
			"  *(*uint8)(ptr) |= mask[idx%8]",
			"  return *(*uint8)(ptr)",
			"}",
			"func CopyBlock(dst []byte, words *[16]uint32) {",
			"  *(*[64]byte)(unsafe.Pointer(&dst[0])) = *(*[64]byte)(unsafe.Pointer(&words[0]))",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "unsafeaddr", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.indexByteAddress(bits!, Number($.uint64Shr(idx, 6)), 8)") {
		t.Fatalf("missing byte-addressed unsafe pointer root:\n%s", text)
	}
	if !strings.Contains(text, "$.unsafePointerRef<number>(ptr).value =") {
		t.Fatalf("missing unsafe pointer storage ref:\n%s", text)
	}
	if !strings.Contains(text, "return $.uint($.unsafePointerRef<number>(ptr).value, 8)") {
		t.Fatalf("missing unsafe pointer value ref:\n%s", text)
	}
	if !strings.Contains(text, "$.arrayPointerFromIndexRef<number>($.indexRef($.pointerValue<number[]>(words), 0), 64, 4, 1)") {
		t.Fatalf("missing byte-view array pointer conversion:\n%s", text)
	}
	if !strings.Contains(text, "$.unsafePointerCast<$.VarRef<Uint8Array> | null>($.arrayPointerFromIndexRef<number>($.indexRef(dst!, 0), 64, 1, 1))!.value =") {
		t.Fatalf("missing non-null byte-view array pointer storage:\n%s", text)
	}
}

func TestCompilePackagesLowersGMSUnsafeArrayPointerConversions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/gmsunsafe\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"reflect\"",
			"  \"unsafe\"",
			")",
			"func IntBytes(n int64) byte {",
			"  mem := (*[8]byte)(unsafe.Pointer(&n))",
			"  bytes := *mem",
			"  return bytes[0]",
			"}",
			"func StringToBytes(str string) []byte {",
			"  if len(str) == 0 {",
			"    return []byte{}",
			"  }",
			"  return (*[0x7fff0000]byte)(unsafe.Pointer((*reflect.StringHeader)(unsafe.Pointer(&str)).Data))[:len(str):len(str)]",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "gmsunsafe", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.arrayPointerFromIndexRef<bigint>($.indexRef([n.value], 0), 8, 8, 1)") {
		t.Fatalf("missing scalar unsafe array pointer conversion:\n%s", text)
	}
	if !strings.Contains(text, "$.arrayPointerFromIndexRef<number>($.indexRef($.stringToBytes(str.value), 0), 2147418112, 1, 1)") {
		t.Fatalf("missing string data unsafe array pointer conversion:\n%s", text)
	}
	if strings.Contains(text, "unsafe.Pointer(&n) as any") || strings.Contains(text, "StringHeader)(unsafe.Pointer(&str)).Data) as any") {
		t.Fatalf("unsafe array pointer conversion fell back to any cast:\n%s", text)
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
			"  ID ObjectID",
			"}",
			"type ObjectID int32",
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
		"let copy = $.markAsStructValue($.cloneStructValue(original.value))",
		"let pointer: Counter | $.VarRef<Counter> | null = original",
		"Counter.prototype.Set.call(pointer, 2)",
		"Counter.prototype.Set.call(NewCounter(), 5)",
		"let [, ok] = $.typeAssertTuple<Counter | $.VarRef<Counter> | null>(iface, { kind: $.TypeKind.Pointer, elemType: \"main.Counter\" })",
		"{ name: \"Value\", key: \"Value\", type: { kind: $.TypeKind.Basic, name: \"int\" }, tag: \"json:\\\"value\\\"\" }",
		"{ name: \"ID\", key: \"ID\", type: { kind: $.TypeKind.Basic, name: \"int32\", typeName: \"main.ObjectID\" } }",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesTypeInfoTrimFollowsReflectReachability(t *testing.T) {
	source := func(importReflect bool) string {
		lines := []string{
			"package main",
		}
		if importReflect {
			lines = append(lines,
				"import \"reflect\"",
				"var _ = reflect.TypeOf(Sample{})",
			)
		}
		lines = append(lines,
			"type Reader interface { Read(v int) string }",
			"type Sample struct { Name string `json:\"name\"` }",
			"func (Sample) Read(v int) string { return \"\" }",
			"func main() {}",
			"",
		)
		return strings.Join(lines, "\n")
	}

	t.Run("reflect absent trims registration payload", func(t *testing.T) {
		moduleDir := writePackageGraphFixture(t, map[string]string{
			"go.mod":  "module example.test/typeinfotrim\n\ngo 1.25.3\n",
			"main.go": source(false),
		})
		outputDir := filepath.Join(t.TempDir(), "output")
		comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir}, nil, nil)
		if err != nil {
			t.Fatal(err.Error())
		}

		if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
			t.Fatal(err.Error())
		}
		content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "typeinfotrim", "main.gs.ts"))
		if err != nil {
			t.Fatal(err.Error())
		}
		text := string(content)
		for _, want := range []string{
			`args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }]`,
			`returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }]`,
			`{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"" }`,
		} {
			if !strings.Contains(text, want) {
				t.Fatalf("missing trimmed type-info payload %q:\n%s", want, text)
			}
		}
		for _, dropped := range []string{
			`args: [{ name: "v", type: { kind: $.TypeKind.Basic, name: "int" } }]`,
			`returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }]`,
			`index: [0]`,
			`offset: 0`,
			`exported: true`,
		} {
			if strings.Contains(text, dropped) {
				t.Fatalf("trimmed type-info payload kept %q:\n%s", dropped, text)
			}
		}
	})

	t.Run("reflect reachable keeps full registration payload", func(t *testing.T) {
		moduleDir := writePackageGraphFixture(t, map[string]string{
			"go.mod":  "module example.test/typeinfofull\n\ngo 1.25.3\n",
			"main.go": source(true),
		})
		outputDir := filepath.Join(t.TempDir(), "output")
		comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir, AllDependencies: true}, nil, nil)
		if err != nil {
			t.Fatal(err.Error())
		}

		if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
			t.Fatal(err.Error())
		}
		content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "typeinfofull", "main.gs.ts"))
		if err != nil {
			t.Fatal(err.Error())
		}
		text := string(content)
		for _, want := range []string{
			`args: [{ name: "v", type: { kind: $.TypeKind.Basic, name: "int" } }]`,
			`returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }]`,
			`{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "json:\"name\"", index: [0], offset: 0, exported: true }`,
		} {
			if !strings.Contains(text, want) {
				t.Fatalf("missing full type-info payload %q:\n%s", want, text)
			}
		}
		if strings.Contains(text, `args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }]`) {
			t.Fatalf("reflect-reachable type-info payload was trimmed:\n%s", text)
		}
	})
}

func TestCompilePackagesEscapesReservedTypeNames(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/reservedtypes\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type static struct {",
			"  Value int",
			"}",
			"func newStatic() *static {",
			"  return &static{Value: 7}",
			"}",
			"func (s *static) Read() int {",
			"  return s.Value",
			"}",
			"func main() {",
			"  println(newStatic().Read())",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "reservedtypes", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export class _static",
		"new _static({Value: 7})",
		"public Read(): number",
		"_static.prototype.Read.call(newStatic())",
		"\"main.static\"",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "class static") {
		t.Fatalf("reserved type name was not escaped:\n%s", text)
	}
}

func TestCompilePackagesEscapesStrictModeRestrictedIdentifiers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/strictidents\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func choose(arguments int) (eval int) {",
			"  eval = arguments + 1",
			"  arguments = eval + arguments",
			"  return",
			"}",
			"func main() {",
			"  eval := choose(1)",
			"  arguments := eval + 1",
			"  println(eval, arguments)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "strictidents", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"function choose(_arguments: number): number",
		"let _eval: number = 0",
		"_eval = _arguments + 1",
		"_arguments = _eval + _arguments",
		"let _eval = choose(1)",
		"let _arguments = _eval + 1",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	for _, bad := range []string{
		"let eval",
		" eval =",
		"function choose(arguments",
		"let arguments",
		" arguments =",
	} {
		if strings.Contains(text, bad) {
			t.Fatalf("strict-mode restricted identifier was not escaped, found %q:\n%s", bad, text)
		}
	}
}

func TestCompilePackagesDoesNotEmitHiddenEmbeddedMethodOverField(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/hiddenembeddedmethod\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type embedded struct{}",
			"func (embedded) Database() string {",
			"  return \"method\"",
			"}",
			"type holder struct {",
			"  Database string",
			"  embedded",
			"}",
			"func value(h holder) string {",
			"  return h.Database",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "hiddenembeddedmethod", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public get Database(): string",
		"public set Database(value: string)",
		"return h.Database",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if got := strings.Count(text, "public Database("); got != 1 {
		t.Fatalf("expected only embedded.Database method, got %d declarations:\n%s", got, text)
	}
	holderStart := strings.Index(text, "export class holder")
	embeddedStart := strings.Index(text, "export class embedded")
	if holderStart < 0 || embeddedStart < 0 {
		t.Fatalf("missing holder or embedded class:\n%s", text)
	}
	holderText := text[holderStart:]
	if embeddedStart > holderStart {
		holderText = text[holderStart:embeddedStart]
	}
	if strings.Contains(holderText, "public Database(") {
		t.Fatalf("hidden embedded method was emitted on holder:\n%s", holderText)
	}
}

func TestCompilePackagesAvoidsPointerMethodTypeNameShadow(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/methodshadow\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type item struct {",
			"  Value int",
			"}",
			"func (i *item) read() int {",
			"  return i.Value",
			"}",
			"func total(items []*item) int {",
			"  sum := 0",
			"  for _, item := range items {",
			"    sum += item.read()",
			"  }",
			"  return sum",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "methodshadow", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.pointerValue<item>(item).read()") {
		t.Fatalf("missing direct pointer method call for shadowed type name:\n%s", text)
	}
	if strings.Contains(text, "item.prototype.read.call(item") {
		t.Fatalf("shadowed local variable used as method class:\n%s", text)
	}
}

func TestCompilePackagesErasesUnimportedTransitiveInterfaceField(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/transitivefield\n\ngo 1.25.3\n",
		"hash/hash.go": strings.Join([]string{
			"package hash",
			"type Hash interface {",
			"  Write([]byte) (int, error)",
			"}",
			"",
		}, "\n"),
		"holder/holder.go": strings.Join([]string{
			"package holder",
			"import \"example.test/transitivefield/hash\"",
			"type Hasher struct {",
			"  hash.Hash",
			"}",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/transitivefield/holder\"",
			"func write(h holder.Hasher, p []byte) error {",
			"  _, err := h.Hash.Write(p)",
			"  return err",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "transitivefield", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.pointerValue<any>(h.Hash).Write(p)") {
		t.Fatalf("missing erased transitive interface field type:\n%s", text)
	}
	if strings.Contains(text, "Exclude<Hash") {
		t.Fatalf("unimported transitive interface type leaked into output:\n%s", text)
	}
}

func TestCompilePackagesClonesNestedStructFieldsWithCloneMethodCollision(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/nestedclone\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Box struct { Value int }",
			"func (b *Box) clone() (*Box, error) {",
			"  return &Box{Value: b.Value + 1}, nil",
			"}",
			"type Holder struct { Box Box }",
			"func copyHolder(h Holder) Holder { return h }",
			"func main() {",
			"  _ = copyHolder(Holder{Box: Box{Value: 1}})",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "nestedclone", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public __goscriptClone(): Box",
		"Box: $.varRef(init?.Box ? $.markAsStructValue($.cloneStructValue(init.Box)) : $.markAsStructValue(new Box()))",
		"Box: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Box.value)))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "init.Box.clone()") || strings.Contains(text, "this._fields.Box.value.clone()") {
		t.Fatalf("nested struct-field clone bypassed cloneStructValue:\n%s", text)
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
		"export function MySlice_Add(s: $.VarRef<MySlice> | null, v: number): void",
		"let arr = [0, 10, 0]",
		"let slice: $.Slice<number> = $.makeSlice<number>(0, 2, \"number\")",
		"let empty: $.Slice<number> = $.arrayToSlice<number>([])",
		"let literal: $.Slice<number> = $.arrayToSlice<number>([1, 2])",
		"literal = $.append(literal, 3)",
		"slice![0] = $.arrayIndex(arr, 1)",
		"let m: globalThis.Map<string, number> | null = $.makeMap<string, number>()",
		"$.mapSet(m, \"one\", 1)",
		"let [value, ok] = $.mapGet<string, number, number>(m, \"missing\", 0)",
		"slice![0]",
		"$.arrayIndex(literal!, 2)",
		"let list: $.VarRef<MySlice> = $.varRef(null as MySlice)",
		"MySlice_Add(list, 7)",
		"$.indexStringOrBytes(text, 0)",
		"MyInt_Double(5)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesWrapsAddressedMapRangeValue(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/maprange\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Item struct { Values []string }",
			"func (i *Item) add(v string) { i.Values = append(i.Values, v) }",
			"func Apply(m map[int]Item, values []string) {",
			"  for k, item := range m {",
			"    for _, v := range values {",
			"      item.add(v)",
			"    }",
			"    m[k] = item",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "maprange", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"let item: $.VarRef<Item> = $.varRef($.markAsStructValue($.cloneStructValue(__goscriptRangeValue",
		"item.value.add(v)",
		"$.mapSet(m, k, $.markAsStructValue($.cloneStructValue(item.value)))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesLowersTupleAssignmentToMapIndexSet(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/maptupleassign\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func resolve(k string) (int, error) { return 7, nil }",
			"func Apply(keys []string) (map[string]int, error) {",
			"  out := make(map[string]int)",
			"  var err error",
			"  for _, k := range keys {",
			"    out[k], err = resolve(k)",
			"    if err != nil { return nil, err }",
			"  }",
			"  return out, nil",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "maptupleassign", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.mapSet(out, k, __goscriptTuple") {
		t.Fatalf("tuple assignment to map index did not write through mapSet:\n%s", text)
	}
	if strings.Contains(text, "$.mapGet(out, k, 0)[0] =") {
		t.Fatalf("tuple assignment still mutates mapGet tuple instead of map:\n%s", text)
	}
}

func TestCompilePackagesLowersPromotedNamedPrimitiveMethod(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/promotedprimitive\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"time\"",
			"type Lifetime struct { time.Duration }",
			"func Seconds(l Lifetime) float64 {",
			"  return l.Seconds()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "promotedprimitive", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return time.Duration_Seconds(l.Duration)") {
		t.Fatalf("promoted named primitive method was not lowered through the owner function:\n%s", text)
	}
	if strings.Contains(text, ".Seconds()") {
		t.Fatalf("promoted named primitive method still used a JavaScript member call:\n%s", text)
	}
}

func TestCompilePackagesMarksPackageFunctionVariablesAsync(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/packagefuncvar\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"func parse(raw string) (int, error) { return len(raw), nil }",
			"var Parse = parse",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/packagefuncvar/dep\"",
			"func parse() (int, error) {",
			"  return dep.Parse(\"turn\")",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "packagefuncvar", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "export async function parse(): globalThis.Promise<[number, $.GoError]>") {
		t.Fatalf("package function variable caller was not marked async:\n%s", text)
	}
	if !strings.Contains(text, "return await dep.Parse!(\"turn\")") {
		t.Fatalf("package function variable call was not awaited:\n%s", text)
	}
}

func TestCompilePackagesAwaitsImportedAsyncMethodsAndFunctions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/importedasync\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type Host struct{ ch chan struct{} }",
			"func (h *Host) Snapshot() (int, error) { <-h.ch; return 1, nil }",
			"func Read(h *Host) (int, error) { return h.Snapshot() }",
			"",
		}, "\n"),
		"dep/dep_test.go": strings.Join([]string{
			"package dep",
			"import \"testing\"",
			"func TestHost(t *testing.T) {}",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/importedasync/dep\"",
			"func UseMethod(h *dep.Host) (int, error) {",
			"  return h.Snapshot()",
			"}",
			"func UseFunction(h *dep.Host) (int, error) {",
			"  return dep.Read(h)",
			"}",
			"",
		}, "\n"),
		"main_test.go": strings.Join([]string{
			"package main",
			"import \"testing\"",
			"func TestUse(t *testing.T) {}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{".", "./dep"},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
		Tests:               true,
		AllDependencies:     true,
	})
	if err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "importedasync", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "export async function UseMethod") {
		t.Fatalf("imported async method caller was not marked async:\n%s", text)
	}
	if !strings.Contains(text, "return await dep.Host.prototype.Snapshot.call(h)") {
		t.Fatalf("imported async method call was not awaited:\n%s", text)
	}
	if !strings.Contains(text, "export async function UseFunction") {
		t.Fatalf("imported async function caller was not marked async:\n%s", text)
	}
	if !strings.Contains(text, "return await dep.Read(h)") {
		t.Fatalf("imported async function call was not awaited:\n%s", text)
	}
}

func TestCompilePackagesCastsConvertedTupleCallSpreads(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/tuplecallspread\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Resolver interface { Resolve() }",
			"type relay struct{}",
			"func (*relay) Resolve() {}",
			"func NewRelay() (*relay, error) { return &relay{}, nil }",
			"func R(res Resolver, err error) ([]Resolver, error) {",
			"  if err != nil { return nil, err }",
			"  return []Resolver{res}, nil",
			"}",
			"func Use() ([]Resolver, error) {",
			"  return R(NewRelay())",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "tuplecallspread", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return R(...(() => {") ||
		!strings.Contains(text, "] as [Resolver | null, $.GoError]") {
		t.Fatalf("converted tuple call spread was not cast as a TypeScript tuple:\n%s", text)
	}
}

func TestCompilePackagesPreservesBlankNamedResultSlots(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/blankresult\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func values() (first, second bool, _ error) {",
			"  first = true",
			"  return",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "blankresult", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return [first, second, null as $.GoError]") {
		t.Fatalf("blank named result slot was not preserved in naked return:\n%s", text)
	}
}

func TestCompilePackagesCastsGenericMethodResultAssignments(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/genericmethodresult\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"errors\"",
			"  \"sync/atomic\"",
			")",
			"func load() error {",
			"  var ptr atomic.Pointer[error]",
			"  err := errors.New(\"boom\")",
			"  ptr.Store(&err)",
			"  if errp := ptr.Load(); errp != nil {",
			"    return *errp",
			"  }",
			"  return nil",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "genericmethodresult", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "(ptr.value.Load() as $.VarRef<$.GoError> | null)") {
		t.Fatalf("generic method result assignment was not cast to the target type:\n%s", text)
	}
}

func TestCompilePackagesPreservesFloatConversionLiterals(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/floatconv\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"math\"",
			"func value() float64 {",
			"  return math.Pow(float64(0.69314718056), 2)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "floatconv", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "$.int(0.69314718056)") {
		t.Fatalf("float64 literal conversion was truncated through $.int:\n%s", text)
	}
	if !strings.Contains(text, "math.Pow(0.69314718056, 2)") {
		t.Fatalf("missing direct float literal conversion:\n%s", text)
	}
}

func TestCompilePackagesLowersStringOrderingThroughRuntime(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/stringorder\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"func less(left, right []byte) bool {",
			"  return string(left) < string(right)",
			"}",
			"func ordered(left, right string) bool {",
			"  return left <= right",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "stringorder", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.stringCompare(left, right) < 0",
		"$.stringCompare(left, right) <= 0",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesConvertsOverrideNamedStringToString(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/reflecttag\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"reflect\"",
			"  \"strings\"",
			")",
			"func tagText(st reflect.Type) string {",
			"  field := st.Field(0)",
			"  tag := field.Tag.Get(\"yaml\")",
			"  if tag == \"\" && strings.Index(string(field.Tag), \":\") < 0 {",
			"    tag = string(field.Tag)",
			"  }",
			"  return tag",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "reflecttag", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		`strings.Index(String(field.Tag), ":")`,
		`tag = String(field.Tag)`,
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
		"export type Greeter = ((name: string) => string | globalThis.Promise<string>) | null",
		"export type ReadCloser = {",
		"Read(): string",
		"Close(): string",
		"$.registerInterfaceType(\n\t\"main.ReadCloser\"",
		"{ name: \"Close\", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: \"string\" } }] }",
		"((__receiver) => () => __receiver.Inc())($.pointerValue<Counter>(counter))",
		"$.namedFunction(greet, \"main.Greeter\", ({ kind: $.TypeKind.Function, name: \"main.Greeter\"",
		"params: [{ kind: $.TypeKind.Basic, name: \"string\" }]",
		"results: [{ kind: $.TypeKind.Basic, name: \"string\" }]",
		"$.interfaceValue<any>(null, \"*struct{Name string}\")",
		"elemType: { kind: $.TypeKind.Struct, methods: [], fields: [{ name: \"Name\", key: \"Name\", type: { kind: $.TypeKind.Basic, name: \"string\" }",
		"let fn = __goscriptTuple",
		"switch (true)",
		"case $.typeAssert<ReadCloser | null>(__goscriptTypeSwitchValue, \"main.ReadCloser\").ok",
		"let v: ReadCloser | null = $.typeAssert<ReadCloser | null>(__goscriptTypeSwitchValue, \"main.ReadCloser\").value",
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
		"export type FileInfo = {",
		"$.println(await $.pointerValue<Exclude<FileInfo, null>>(info).Name())",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesUsesNonNilInterfaceTypeSwitchCaseVarRefs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interface-switch-varref\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type rawConn interface { Control() error }",
			"type tcpConn interface {",
			"  SyscallConn() (rawConn, error)",
			"  SetLinger(int) error",
			"}",
			"type Conn struct { c rawConn }",
			"func keep(*tcpConn) {}",
			"func NewConn(c any) (*Conn, error) {",
			"  cc := &Conn{}",
			"  var err error",
			"  switch c := c.(type) {",
			"  case tcpConn:",
			"    keep(&c)",
			"    cc.c, err = c.SyscallConn()",
			"  }",
			"  return cc, err",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "interface-switch-varref", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type tcpConn = {",
		"case $.typeAssert<tcpConn | null>(__goscriptTypeSwitchValue, \"main.tcpConn\").ok",
		"let c: $.VarRef<tcpConn | null> = $.varRef($.typeAssert<tcpConn | null>(__goscriptTypeSwitchValue, \"main.tcpConn\").value)",
		"$.pointerValue<Exclude<tcpConn, null>>(c.value).SyscallConn()",
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
		"$.println(await $.pointerValue<Exclude<Animal, null>>(animal).Name())",
		"let a: Animal | null = $.interfaceValue<Animal | null>(dog, \"*main.Dog\")",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesBoxesAliasPointerInterfacesWithTargetRuntimeType(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/alias-interface-box\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type CloudError struct{}",
			"func (*CloudError) Error() string { return \"cloud\" }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/alias-interface-box/dep\"",
			"type cloudError = dep.CloudError",
			"func Build() error {",
			"  return &cloudError{}",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "alias-interface-box", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.interfaceValue<$.GoError>(new dep.CloudError(), \"*dep.CloudError\")") {
		t.Fatalf("alias pointer was not boxed with target runtime type:\n%s", text)
	}
	if strings.Contains(text, "*main.cloudError") {
		t.Fatalf("alias pointer leaked alias runtime type:\n%s", text)
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
			"func Copy[T any](vals ...T) []T {",
			"  return append([]T{}, vals...)",
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
		"export function ZeroValue(__typeArgs: $.GenericTypeArgs | undefined): any",
		"export async function CallString(__typeArgs: $.GenericTypeArgs | undefined, v: any): globalThis.Promise<string>",
		"export function Sum<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>): any",
		"export function Copy<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>): $.Slice<T>",
		"return $.appendSlice($.arrayToSlice<T>([]), vals)",
		"let seen: Set = $.makeMap<number, {}>()",
		"$.mapSet(seen, 1, {})",
		"$.genericZero(__typeArgs, \"T\", null)",
		"await $.callGenericMethod(__typeArgs, \"T\", \"String\", v)",
		"ZeroValue({T: { type: { kind: $.TypeKind.Basic, name: \"int\", typeName: \"main.MyInt\" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: \"String\", args: [], returns: [{ name: \"_r0\", type: { kind: $.TypeKind.Basic, name: \"string\" } }] }] }})",
		"await CallString({T: { type: { kind: $.TypeKind.Basic, name: \"int\", typeName: \"main.MyInt\" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: \"String\", args: [], returns: [{ name: \"_r0\", type: { kind: $.TypeKind.Basic, name: \"string\" } }] }] }}, zero)",
		"Sum({T: { type: { kind: $.TypeKind.Basic, name: \"int\", typeName: \"main.MyInt\" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: \"String\", args: [], returns: [{ name: \"_r0\", type: { kind: $.TypeKind.Basic, name: \"string\" } }] }] }}, null)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesInfersGenericTypeArgsFromNamedArgument(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/genericnamedarg\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package genericnamedarg",
			"type Source interface { Load() int }",
			"type auto struct{}",
			"func (a *auto) Load() int { return 7 }",
			"type key[T any] struct { name string }",
			"type entry struct { factory any }",
			"var entries = map[string]*entry{}",
			"func NewKey[T any](name string) key[T] {",
			"  entries[name] = &entry{}",
			"  return key[T]{name: name}",
			"}",
			"func Register[T any](key key[T], factory func() T) {",
			"  entries[key.name].factory = factory",
			"}",
			"func Get[T any](key key[T]) T {",
			"  f := entries[key.name].factory",
			"  return f.(func() T)()",
			"}",
			"type typedLoader[T any] struct { value T }",
			"func (t *typedLoader[T]) Load() T { return t.value }",
			"func GetTyped[T any](v any) T {",
			"  src := v.(interface { Load() T })",
			"  return src.Load()",
			"}",
			"var loader = NewKey[Source](\"source\")",
			"func Use() int {",
			"  Register(loader, func() Source { return &auto{} })",
			"  src := Get(loader)",
			"  return src.Load() + GetTyped[int](&typedLoader[int]{value: 5})",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "genericnamedarg", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"await Get({T: { type: \"genericnamedarg.Source\", zero: () => null, methods: {Load: (receiver: any, ...args: any[]) => receiver.Load(...args)} }}, $.markAsStructValue($.cloneStructValue(loader)))",
		"return await $.mustTypeAssert<(() => any | globalThis.Promise<any>) | null>(f, ({ kind: $.TypeKind.Function, params: [], results: [__typeArgs?.[\"T\"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))!()",
		"$.mustTypeAssert<any>(v, { kind: $.TypeKind.Interface, methods: [{ name: \"Load\", args: [], returns: [{ name: \"_r0\", type: __typeArgs?.[\"T\"]?.type ?? { kind: $.TypeKind.Interface, methods: [] } }] }] })",
		"return await $.pointerValue<Exclude<Source, null>>(src).Load()",
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
			"  var zero Callback",
			"  var cb Callback = nil",
			"  _ = fn",
			"  _ = zero",
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
		"export type Callback = ((value: number) => string | globalThis.Promise<string>) | null",
		"export async function call(cb: ((value: number) => string | globalThis.Promise<string>) | null): globalThis.Promise<string> {\n\treturn await cb!(1)",
		"let zero: Callback | null = null as Callback | null",
		"let cb: Callback | null = (null as Callback | null)",
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
		"export type Handler = ((_p0: ((_p0: Handler | null) => Handler | null | globalThis.Promise<Handler | null>) | null) => Handler | null | globalThis.Promise<Handler | null>) | null",
		"{ name: \"Next\", key: \"Next\", type: ({ kind: $.TypeKind.Function, name: \"main.Handler\"",
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
		"export type Collector = ((label: string, parts: $.Slice<string>) => string | globalThis.Promise<string>) | null",
		"Join(parts: $.Slice<string>): string",
		"export function collect(label: string, parts: $.Slice<string>): string",
		"let part = __goscriptRangeTarget0![__rangeIndex]",
		"export function maybeErr(parts: $.Slice<string>): $.GoError",
		"public Join(parts: $.Slice<string>): string",
		"collect(\"none\", null)",
		"collect(\"two\", $.arrayToSlice<string>([\"a\", \"b\"]))",
		"collect(\"spread\", parts)",
		"$.append(parts, \"c\", \"d\")",
		"maybeErr($.arrayToSlice<string>([\"ok\"]))",
		"fn!(\"fn\", $.arrayToSlice<string>([\"x\"]))",
		"$.pointerValue<Exclude<Joiner, null>>(joiner).Join($.arrayToSlice<string>([\"q\", \"r\"]))",
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
	want := "State.prototype.SetErrorf.call(s, \"bad %q\", $.arrayToSlice<any>([key]))"
	if !strings.Contains(text, want) {
		t.Fatalf("missing %q in generated output:\n%s", want, text)
	}
	if strings.Contains(text, "$.pointerValue<State>(s).SetErrorf(\"bad %q\", key)") {
		t.Fatalf("generated override subpackage call was not packed:\n%s", text)
	}
}

func TestCompilePackagesBoxesNumericVariadicInterfaceArgs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/numeric-interface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package numericinterface",
			"func collect(values ...any) {}",
			"func main() {",
			"  var version int32 = 2",
			"  collect(version, uint32(3))",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "numeric-interface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.namedValueInterfaceValue<any>(version, \"int32\", {}, { kind: $.TypeKind.Basic, name: \"int32\" })",
		"$.namedValueInterfaceValue<any>($.uint(3, 32), \"uint32\", {}, { kind: $.TypeKind.Basic, name: \"uint32\" })",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAwaitsFmtWriterOverrides(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/fmt-writer\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package fmtwriter",
			"import \"fmt\"",
			"type writer struct { buf []byte }",
			"func (w *writer) Write(p []byte) (int, error) {",
			"  w.buf = append(w.buf, p...)",
			"  return len(p), nil",
			"}",
			"func Use(w *writer) error {",
			"  _, err := fmt.Fprintf(w, \"%s\", \"ok\")",
			"  return err",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "fmt-writer", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Use",
		"await fmt.Fprintf(",
		"$.pointerValue<writer>(w).buf = $.appendSlice($.pointerValue<writer>(w).buf, p)",
		"return err",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "...(p ?? [])") {
		t.Fatalf("append with slice expansion used JavaScript argument spreading:\n%s", text)
	}
}

func TestCompilePackagesImportsSelectedExternalFieldTypes(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/selected-field-import\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type URL struct { Path string }",
			"",
		}, "\n"),
		"api/api.go": strings.Join([]string{
			"package api",
			"import \"example.test/selected-field-import/dep\"",
			"type Request struct { URL *dep.URL }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/selected-field-import/api\"",
			"func requestPath(r *api.Request) string {",
			"  return r.URL.Path",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{Dir: moduleDir, OutputPath: outputDir, AllDependencies: true}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "selected-field-import", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"import * as dep from \"@goscript/example.test/selected-field-import/dep/index.js\"",
		"$.pointerValue<dep.URL>($.pointerValue<api.Request>(r).URL).Path",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesErasesUnavailableOverrideFieldTypes(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/override-field-type\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type URL struct { Path string }",
			"",
		}, "\n"),
		"api/api.go": strings.Join([]string{
			"package api",
			"import \"example.test/override-field-type/dep\"",
			"type Request struct { URL *dep.URL }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/override-field-type/api\"",
			"func requestPath(r *api.Request) string {",
			"  return r.URL.Path",
			"}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/override-field-type/api/index.ts", strings.Join([]string{
		"export class Request {",
		"  public URL: any = null",
		"}",
		"",
	}, "\n"))
	outputDir := filepath.Join(t.TempDir(), "output")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      outputDir,
		AllDependencies: true,
		OverrideDirs:    []string{overrideDir},
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "override-field-type", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.pointerValue<any>($.pointerValue<api.Request>(r).URL).Path") {
		t.Fatalf("missing erased override field type in generated output:\n%s", text)
	}
	if strings.Contains(text, "dep.URL") || strings.Contains(text, "pointerValue<URL>") {
		t.Fatalf("generated output referenced unavailable dependency type:\n%s", text)
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
			"  ch := make(chan int, 1)",
			"  for _, outer := range backward([]int{1, 2}) {",
			"    for range backward([]int{3}) {",
			"      ch <- outer",
			"    }",
			"  }",
			"}",
			"func backward(values []int) func(func(int, int) bool) {",
			"  return func(yield func(int, int) bool) {",
			"    for i := len(values) - 1; i >= 0; i-- {",
			"      if !yield(i, values[i]) {",
			"        return",
			"      }",
			"    }",
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
		"if (!await _yield!(i, v))",
		"break",
		"await pairs!(async (i, v) => {",
		"last = __goscriptRange",
		"return true",
		"continue",
		"await backward($.arrayToSlice<number>([1, 2]))!(async (__goscriptRange",
		"await backward($.arrayToSlice<number>([3]))!(async (__goscriptRange",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPreservesNamedFunctionResultTypes(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/namedfuncresult\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Seq func(func(int) bool)",
			"func values() Seq {",
			"  return nil",
			"}",
			"func main() {",
			"  if values() == nil {",
			"    println(\"empty\")",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "namedfuncresult", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export type Seq = ((_p0: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => void) | null",
		"export function values(): Seq | null",
		"return (null as Seq | null)",
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
			"func nestedReturn(limit int) int {",
			"  for v := range values {",
			"    for i := range values {",
			"      if i == limit {",
			"        return v + i",
			"      }",
			"    }",
			"  }",
			"  return -1",
			"}",
			"func main() { println(first(3), nestedReturn(2)) }",
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
		"case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: \"int\" }).ok",
		"break",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	nestedReturn := regexp.MustCompile(`if \(__goscriptRangeReturn\d+\) \{\n\t+__goscriptRangeReturn\d+ = true\n\t+__goscriptRangeReturnValue\d+ = __goscriptRangeReturnValue\d+!\n\t+return false\n\t+\}`)
	if !nestedReturn.MatchString(text) {
		t.Fatalf("missing nested range return propagation:\n%s", text)
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
			"func stopLoop(stop chan struct{}, done chan struct{}) {",
			"  for {",
			"    select {",
			"    case <-stop:",
			"      done <- struct{}{}",
			"      return",
			"    }",
			"  }",
			"}",
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
		"Process(v: number): number | globalThis.Promise<number>",
		"public async Process(v: number): globalThis.Promise<number>",
		"let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, \"both\")",
		"await $.chanSend($.pointerValue<Worker>(w).ch, v)",
		"return await $.chanRecv($.pointerValue<Worker>(w).ch)",
		"await using __defer = new $.AsyncDisposableStack()",
		"queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {",
		"$.selectStatement<any, void>([",
		"let v = __goscriptSelect1Result.value",
		"return $.selectVoidReturn()",
		"await call($.interfaceValue<Processor | null>(new Worker({ch: $.makeChannel<number>(1, 0, \"both\")}), \"*main.Worker\"))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPropagatesAsyncGenericInterfaceMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/genericasynciface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package genericasynciface",
			"import \"context\"",
			"type Watchable[T comparable] interface {",
			"  Get() T",
			"  Wait(ctx context.Context, old T) T",
			"}",
			"type Box[T comparable] struct { ch chan T; val T }",
			"func (b *Box[T]) Get() T { return b.val }",
			"func (b *Box[T]) Wait(ctx context.Context, old T) T {",
			"  select {",
			"  case v := <-b.ch:",
			"    return v",
			"  case <-ctx.Done():",
			"    return old",
			"  }",
			"}",
			"func Use(ctx context.Context, w Watchable[int], old int) int {",
			"  return w.Wait(ctx, old)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "genericasynciface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"Wait(ctx: context.Context | null, old: any): any | globalThis.Promise<any>",
		"public async Wait(ctx: context.Context | null, old: any): globalThis.Promise<any>",
		"return (await $.pointerValue<Exclude<Watchable, null>>(w).Wait(ctx, old) as number)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPropagatesAsyncAnonymousInterfaceMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/anonymousasynciface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package anonymousasynciface",
			"import \"context\"",
			"type Snapshot int",
			"type Watcher struct { ch chan Snapshot }",
			"func (w *Watcher) WaitValueChange(ctx context.Context, old Snapshot, errCh <-chan error) (Snapshot, error) {",
			"  select {",
			"  case v := <-w.ch:",
			"    return v, nil",
			"  case err := <-errCh:",
			"    return old, err",
			"  case <-ctx.Done():",
			"    return old, ctx.Err()",
			"  }",
			"}",
			"func Use(ctx context.Context, w interface {",
			"  WaitValueChange(context.Context, Snapshot, <-chan error) (Snapshot, error)",
			"}, old Snapshot) (Snapshot, error) {",
			"  return w.WaitValueChange(ctx, old, nil)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "anonymousasynciface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Use(ctx: context.Context | null, w: any, old: Snapshot): globalThis.Promise<[Snapshot, $.GoError]>",
		"return await $.pointerValue<any>(w).WaitValueChange(ctx, old, null)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPropagatesAsyncThroughInstantiatedNamedInterface(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/instantiatedasynciface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package instantiatedasynciface",
			"import \"context\"",
			"type Snapshot int",
			"type Watchable[T any] interface {",
			"  WaitValueChange(context.Context, T, <-chan error) (T, error)",
			"}",
			"type Container[T any] struct { ch chan T }",
			"func (c *Container[T]) WaitValueChange(ctx context.Context, old T, errCh <-chan error) (T, error) {",
			"  select {",
			"  case v := <-c.ch:",
			"    return v, nil",
			"  case err := <-errCh:",
			"    return old, err",
			"  case <-ctx.Done():",
			"    return old, ctx.Err()",
			"  }",
			"}",
			"func Bind(w Watchable[Snapshot]) {}",
			"func Use(ctx context.Context, w interface {",
			"  WaitValueChange(context.Context, Snapshot, <-chan error) (Snapshot, error)",
			"}, old Snapshot) (Snapshot, error) {",
			"  return w.WaitValueChange(ctx, old, nil)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "instantiatedasynciface", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Use(ctx: context.Context | null, w: any, old: Snapshot): globalThis.Promise<[Snapshot, $.GoError]>",
		"return await $.pointerValue<any>(w).WaitValueChange(ctx, old, null)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAwaitsUnmarkedAnonymousInterfaceMethodInsideAsyncCaller(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/anonymousifaceawait\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package anonymousifaceawait",
			"import \"context\"",
			"type Snapshot int",
			"func Use(ctx context.Context, w interface {",
			"  WaitValueChange(context.Context, Snapshot, <-chan error) (Snapshot, error)",
			"}, ch <-chan struct{}, old Snapshot) (Snapshot, error) {",
			"  select {",
			"  case <-ch:",
			"  default:",
			"  }",
			"  return w.WaitValueChange(ctx, old, nil)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "anonymousifaceawait", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return await $.pointerValue<any>(w).WaitValueChange(ctx, old, null)") {
		t.Fatalf("anonymous interface method call inside async caller was not awaited:\n%s", text)
	}
}

func TestCompilePackagesDoesNotInheritAsyncIntoSyncFunctionLiteral(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/syncfunclit\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package syncfunclit",
			"type Directive struct{}",
			"func (Directive) GetDirective() any { return nil }",
			"type Bridge struct{ keep func(Directive) (bool, error) }",
			"func NewBridge(keep func(Directive) (bool, error)) *Bridge { return &Bridge{keep: keep} }",
			"func Execute(ch <-chan struct{}) error {",
			"  select {",
			"  case <-ch:",
			"  default:",
			"  }",
			"  _ = NewBridge(func(di Directive) (bool, error) {",
			"    switch di.GetDirective().(type) {",
			"    default:",
			"      return true, nil",
			"    }",
			"  })",
			"  return nil",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "syncfunclit", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "await Directive.prototype.GetDirective.call(di)") {
		t.Fatalf("sync function literal inherited async await:\n%s", text)
	}
}

func TestCompilePackagesMarksFunctionLiteralAsyncForInterfaceMethodCall(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/funclitifaceawait\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package funclitifaceawait",
			"type Ref struct{}",
			"type BlockWithRefs interface {",
			"  ApplyBlockRef(uint32, *Ref) error",
			"}",
			"func Each(cb func(BlockWithRefs) error) error { return nil }",
			"func Copy(ref *Ref) error {",
			"  return Each(func(block BlockWithRefs) error {",
			"    if err := block.ApplyBlockRef(7, ref); err != nil {",
			"      return err",
			"    }",
			"    return nil",
			"  })",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "funclitifaceawait", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.functionValue(async (block: BlockWithRefs | null): globalThis.Promise<$.GoError> => {",
		"let err = await $.pointerValue<Exclude<BlockWithRefs, null>>(block).ApplyBlockRef($.uint(7, 32), ref)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesMarksFunctionLiteralAsyncForInterfaceMethodTypeSwitch(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/funclittypeswitchawait\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package funclittypeswitchawait",
			"type GetPeer struct{}",
			"type Directive interface{ GetDirective() any }",
			"type Bridge struct{ keep func(Directive) (bool, error) }",
			"func NewBridge(keep func(Directive) (bool, error)) *Bridge { return &Bridge{keep: keep} }",
			"func Build() *Bridge {",
			"  return NewBridge(func(di Directive) (bool, error) {",
			"    switch di.GetDirective().(type) {",
			"    case GetPeer:",
			"      return false, nil",
			"    }",
			"    return true, nil",
			"  })",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "funclittypeswitchawait", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.functionValue(async (di: Directive | null): globalThis.Promise<[boolean, $.GoError]> => {",
		"const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<Directive, null>>(di).GetDirective()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesMarksRangeFuncAsyncWhenBodyAwaits(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/rangefuncawaitbody\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package rangefuncawaitbody",
			"type Item struct{}",
			"func (i *Item) Release(ch <-chan struct{}) {",
			"  select {",
			"  case <-ch:",
			"  default:",
			"  }",
			"}",
			"func Back(items []Item) func(func(int, Item) bool) {",
			"  return func(yield func(int, Item) bool) {",
			"    for i := len(items)-1; i >= 0; i-- {",
			"      if !yield(i, items[i]) { return }",
			"    }",
			"  }",
			"}",
			"func Use(ch <-chan struct{}, items []Item) {",
			"  defer func() {",
			"    for _, v := range Back(items) {",
			"      v.Release(ch)",
			"    }",
			"  }()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "rangefuncawaitbody", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		";await (async () => {",
		"await v.value.Release(ch)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesPropagatesImportedAsyncGenericInterfaceMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/importedgenericasynciface\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"import \"context\"",
			"type Watchable[T comparable] interface {",
			"  Get() T",
			"  Wait(ctx context.Context, old T) T",
			"}",
			"type Box[T comparable] struct { ch chan T; val T }",
			"func (b *Box[T]) Get() T { return b.val }",
			"func (b *Box[T]) Wait(ctx context.Context, old T) T {",
			"  select {",
			"  case v := <-b.ch:",
			"    return v",
			"  case <-ctx.Done():",
			"    return old",
			"  }",
			"}",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package importedgenericasynciface",
			"import (",
			"  \"context\"",
			"  \"example.test/importedgenericasynciface/dep\"",
			")",
			"func Use(ctx context.Context, w dep.Watchable[int], old int) int {",
			"  return w.Wait(ctx, old)",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{".", "./dep"},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	if err != nil {
		t.Fatal(err.Error())
	}
	depOutputFile := filepath.Join(outputDir, "@goscript", "example.test", "importedgenericasynciface", "dep", "dep.gs.ts")
	depContent, err := os.ReadFile(depOutputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	depText := string(depContent)
	for _, want := range []string{
		"Wait(ctx: context.Context | null, old: any): any | globalThis.Promise<any>",
		"public async Wait(ctx: context.Context | null, old: any): globalThis.Promise<any>",
	} {
		if !strings.Contains(depText, want) {
			t.Fatalf("missing %q in generated dep output:\n%s", want, depText)
		}
	}

	mainOutputFile := filepath.Join(outputDir, "@goscript", "example.test", "importedgenericasynciface", "main.gs.ts")
	mainContent, err := os.ReadFile(mainOutputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	mainText := string(mainContent)
	if want := "return (await $.pointerValue<Exclude<dep.Watchable, null>>(w).Wait(ctx, old) as number)"; !strings.Contains(mainText, want) {
		t.Fatalf("missing %q in generated main output:\n%s", want, mainText)
	}
}

func TestCompilePackagesPropagatesAsyncInterfaceMethodsFromTestImports(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/testimportasynciface\n\ngo 1.25.3\n",
		"iface/provider.go": strings.Join([]string{
			"package iface",
			"import \"context\"",
			"type Provider interface {",
			"  Create(context.Context) (string, error)",
			"}",
			"",
		}, "\n"),
		"impl/provider.go": strings.Join([]string{
			"package impl",
			"import (",
			"  \"context\"",
			"  \"example.test/testimportasynciface/iface\"",
			")",
			"type Provider struct { ch chan string }",
			"func NewProvider() iface.Provider {",
			"  return &Provider{ch: make(chan string, 1)}",
			"}",
			"func (p *Provider) Create(ctx context.Context) (string, error) {",
			"  select {",
			"  case p.ch <- \"ok\":",
			"  case <-ctx.Done():",
			"    return \"\", ctx.Err()",
			"  }",
			"  return <-p.ch, nil",
			"}",
			"",
		}, "\n"),
		"use.go": strings.Join([]string{
			"package testimportasynciface",
			"import (",
			"  \"context\"",
			"  \"example.test/testimportasynciface/iface\"",
			")",
			"func Use(ctx context.Context, p iface.Provider) (string, error) {",
			"  return p.Create(ctx)",
			"}",
			"",
		}, "\n"),
		"use_test.go": strings.Join([]string{
			"package testimportasynciface",
			"import (",
			"  \"context\"",
			"  \"testing\"",
			"  \"example.test/testimportasynciface/impl\"",
			")",
			"func TestUse(t *testing.T) {",
			"  p := impl.NewProvider()",
			"  got, err := p.Create(context.Background())",
			"  if err != nil || got != \"ok\" {",
			"    t.Fatal(got, err)",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
		Tests:               true,
		AllDependencies:     true,
	})
	if err != nil {
		t.Fatal(err.Error())
	}

	ifaceOutputFile := filepath.Join(outputDir, "@goscript", "example.test", "testimportasynciface", "iface", "provider.gs.ts")
	ifaceContent, err := os.ReadFile(ifaceOutputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	ifaceText := string(ifaceContent)
	if want := "Create(_p0: context.Context | null): [string, $.GoError] | globalThis.Promise<[string, $.GoError]>"; !strings.Contains(ifaceText, want) {
		t.Fatalf("test-import implementation did not color interface method async:\n%s", ifaceText)
	}

	testOutputFile := filepath.Join(outputDir, "@goscript", "example.test", "testimportasynciface", "use_test.gs.ts")
	testContent, err := os.ReadFile(testOutputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	testText := string(testContent)
	if want := "let [got, err] = await $.pointerValue<Exclude<iface.Provider, null>>(p).Create(context.Background())"; !strings.Contains(testText, want) {
		t.Fatalf("test package call was not awaited:\n%s", testText)
	}
}

func TestCompilePackagesAwaitsAsyncInterfaceMethodSingleResultAssignment(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/asyncifaceassign\n\ngo 1.25.3\n",
		"iface/controller.go": strings.Join([]string{
			"package iface",
			"import \"context\"",
			"type Controller interface {",
			"  Execute(context.Context) error",
			"}",
			"",
		}, "\n"),
		"impl/controller.go": strings.Join([]string{
			"package impl",
			"import (",
			"  \"context\"",
			"  \"example.test/asyncifaceassign/iface\"",
			")",
			"type Controller struct { ch chan struct{} }",
			"func NewController() iface.Controller {",
			"  return &Controller{ch: make(chan struct{}, 1)}",
			"}",
			"func (c *Controller) Execute(ctx context.Context) error {",
			"  select {",
			"  case <-c.ch:",
			"    return nil",
			"  case <-ctx.Done():",
			"    return ctx.Err()",
			"  }",
			"}",
			"",
		}, "\n"),
		"use.go": strings.Join([]string{
			"package asyncifaceassign",
			"import (",
			"  \"context\"",
			"  \"example.test/asyncifaceassign/iface\"",
			")",
			"func Run(ctx context.Context, c iface.Controller) error {",
			"  err := c.Execute(ctx)",
			"  return err",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{".", "./iface", "./impl"},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	if err != nil {
		t.Fatal(err.Error())
	}

	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "asyncifaceassign", "use.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if want := "let err = await $.pointerValue<Exclude<iface.Controller, null>>(c).Execute(ctx)"; !strings.Contains(text, want) {
		t.Fatalf("single-result async interface assignment was not awaited:\n%s", text)
	}
}

func TestCompilePackagesAwaitsInterfaceMethodCallInsideAsyncCallerWithoutKnownImplementation(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/asyncifaceunknownimpl\n\ngo 1.25.3\n",
		"iface/controller.go": strings.Join([]string{
			"package iface",
			"import \"context\"",
			"type Controller interface {",
			"  Execute(context.Context) error",
			"}",
			"",
		}, "\n"),
		"use.go": strings.Join([]string{
			"package asyncifaceunknownimpl",
			"import (",
			"  \"context\"",
			"  \"example.test/asyncifaceunknownimpl/iface\"",
			")",
			"func Run(ctx context.Context, c iface.Controller, ready <-chan struct{}) error {",
			"  select {",
			"  case <-ready:",
			"  default:",
			"  }",
			"  err := c.Execute(ctx)",
			"  return err",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{".", "./iface"},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	if err != nil {
		t.Fatal(err.Error())
	}

	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "asyncifaceunknownimpl", "use.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if want := "let err = await $.pointerValue<Exclude<iface.Controller, null>>(c).Execute(ctx)"; !strings.Contains(text, want) {
		t.Fatalf("async caller did not await interface method with unknown implementation:\n%s", text)
	}
}

func TestCompilePackagesMarksNamedFunctionAsyncForInterfaceMethodCallWithoutKnownImplementation(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/syncifaceunknownimpl\n\ngo 1.25.3\n",
		"iface/controller.go": strings.Join([]string{
			"package iface",
			"import \"context\"",
			"type Controller interface {",
			"  Execute(context.Context) error",
			"}",
			"",
		}, "\n"),
		"use.go": strings.Join([]string{
			"package syncifaceunknownimpl",
			"import (",
			"  \"context\"",
			"  \"example.test/syncifaceunknownimpl/iface\"",
			")",
			"func Run(ctx context.Context, c iface.Controller) error {",
			"  err := c.Execute(ctx)",
			"  return err",
			"}",
			"",
		}, "\n"),
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	service := NewCompileService()
	_, err := service.Compile(context.Background(), &CompileRequest{
		Patterns:            []string{".", "./iface"},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	if err != nil {
		t.Fatal(err.Error())
	}

	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "syncifaceunknownimpl", "use.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Run(ctx: context.Context | null, c: iface.Controller | null): globalThis.Promise<$.GoError>",
		"let err = await $.pointerValue<Exclude<iface.Controller, null>>(c).Execute(ctx)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesMarksSelectReturningIfElseCasesUnreachable(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/select-if-else\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"context\"",
			"func finish(ctx context.Context, ch <-chan int, client bool) (int, error) {",
			"  select {",
			"  case <-ch:",
			"    if client {",
			"      return 1, nil",
			"    } else {",
			"      return 2, nil",
			"    }",
			"  case <-ctx.Done():",
			"    return 3, ctx.Err()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "select-if-else", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function finish(ctx: context.Context | null, ch: $.Channel<number> | null, client: boolean): globalThis.Promise<[number, $.GoError]>",
		"if (__goscriptSelect0HasReturn) {",
		"throw new Error(\"unreachable select\")",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAddsUnreachableReturnFallback(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/select-named\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"context\"",
			"func wait(ctx context.Context, ch <-chan error) (rerr error) {",
			"  select {",
			"  case <-ctx.Done():",
			"    return context.Canceled",
			"  case err := <-ch:",
			"    return err",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "select-named", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function wait(ctx: context.Context | null, ch: $.Channel<$.GoError> | null): globalThis.Promise<$.GoError>",
		"let rerr: $.GoError = null as $.GoError",
		"throw new globalThis.Error(\"goscript: unreachable return\")",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAnnotatesShortDeclInterfaceValues(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/interface-short-decl\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Reader interface { Read() int }",
			"type impl struct{ value int }",
			"func (i *impl) Read() int { return i.value }",
			"func replacement() Reader { return &impl{value: 2} }",
			"func use(r Reader, swap bool) int {",
			"  if r == nil {",
			"    return 0",
			"  }",
			"  current := r",
			"  if swap {",
			"    current = replacement()",
			"  }",
			"  return current.Read()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "interface-short-decl", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "let current: Reader | null = r") {
		t.Fatalf("missing interface short declaration annotation:\n%s", text)
	}
}

func TestCompilePackagesPropagatesImmediateFuncLitAsync(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/immediate-func-lit-async\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync\"",
			"type resolver struct {",
			"  parent *resolver",
			"  mutex sync.Mutex",
			"}",
			"func (r *resolver) lookup() (int, error) {",
			"  value := func() int {",
			"    r.mutex.Lock()",
			"    defer r.mutex.Unlock()",
			"    return 7",
			"  }()",
			"  if r.parent != nil {",
			"    return r.parent.lookup()",
			"  }",
			"  return value, nil",
			"}",
			"func use(r *resolver) (int, error) {",
			"  return r.lookup()",
			"}",
			"func main() {}",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "immediate-func-lit-async", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public async lookup(): globalThis.Promise<[number, $.GoError]>",
		"return await resolver.prototype.lookup.call($.pointerValue<resolver>(r).parent)",
		"export async function use(r: resolver | $.VarRef<resolver> | null): globalThis.Promise<[number, $.GoError]>",
		"return await resolver.prototype.lookup.call(r)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "const __goscriptReturn0 = resolver.prototype.lookup.call") {
		t.Fatalf("immediate func-literal async method call was not awaited:\n%s", text)
	}
}

func TestCompilePackagesParenthesizesAsyncFieldReceivers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/asyncfield\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Result struct { ok bool }",
			"type Box struct { ch chan int }",
			"func (b *Box) next() Result {",
			"  b.ch <- 1",
			"  return Result{ok: true}",
			"}",
			"func (b *Box) OK() bool {",
			"  return b.next().ok",
			"}",
			"func main() {",
			"  box := &Box{ch: make(chan int, 1)}",
			"  println(box.OK())",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "asyncfield", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return (await Box.prototype.next.call(b)).ok") {
		t.Fatalf("async field receiver was not parenthesized:\n%s", text)
	}
	if strings.Contains(text, "return await Box.prototype.next.call(b).ok") {
		t.Fatalf("async field receiver selected the promise before await:\n%s", text)
	}
}

func TestCompilePackagesAwaitsAsyncMethodValuesInAssignmentsAndReceivers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/asyncmethodvalues\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package asyncmethodvalues",
			"import \"reflect\"",
			"type Entry struct { value any }",
			"type Holder struct { entry *Entry }",
			"func (e *Entry) WithField(key string, value any) *Entry {",
			"  return e.WithFields(map[string]any{key: value})",
			"}",
			"func (e *Entry) WithFields(fields map[string]any) *Entry {",
			"  for _, value := range fields {",
			"    if t := reflect.TypeOf(value); t != nil {",
			"      switch {",
			"      case t.Kind() == reflect.Func:",
			"        e.value = value",
			"      }",
			"    }",
			"  }",
			"  return e",
			"}",
			"func (e *Entry) Warn(msg string) {}",
			"func Use(entry *Entry) {",
			"  le := entry.WithField(\"first\", func(){})",
			"  h := Holder{entry: entry.WithField(\"holder\", func(){})}",
			"  _ = h",
			"  le.WithField(\"second\", func(){}).Warn(\"done\")",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "asyncmethodvalues", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public async WithField(key: string, value: any): globalThis.Promise<Entry | $.VarRef<Entry> | null>",
		"let le: Entry | $.VarRef<Entry> | null = await Entry.prototype.WithField.call(entry, \"first\",",
		"const __goscriptLiteralField0 = await Entry.prototype.WithField.call(entry, \"holder\",",
		"Entry.prototype.Warn.call(await Entry.prototype.WithField.call(le, \"second\",",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	for _, bad := range []string{
		"let le: Entry | $.VarRef<Entry> | null = Entry.prototype.WithField.call",
		"const __goscriptLiteralField0 = Entry.prototype.WithField.call",
		"Entry.prototype.Warn.call(Entry.prototype.WithField.call",
	} {
		if strings.Contains(text, bad) {
			t.Fatalf("async method value was consumed without await at %q:\n%s", bad, text)
		}
	}
}

func TestCompilePackagesKeepsErrorInterfaceErrorSynchronous(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/syncerrorstring\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package syncerrorstring",
			"type wrappedError struct {",
			"  cause error",
			"  msg string",
			"}",
			"func (w *wrappedError) Error() string {",
			"  return w.msg + \": \" + w.cause.Error()",
			"}",
			"type healthError struct {",
			"  cause error",
			"  health string",
			"}",
			"type HealthError interface {",
			"  error",
			"  GetHealth() string",
			"}",
			"func (h *healthError) Error() string {",
			"  if h.cause != nil {",
			"    return h.cause.Error()",
			"  }",
			"  return h.health",
			"}",
			"func (h *healthError) GetHealth() string { return h.health }",
			"type baseError string",
			"func (b baseError) Error() string { return string(b) }",
			"func NewWrapped() error {",
			"  return &wrappedError{msg: \"load\", cause: &healthError{cause: baseError(\"missing\")}}",
			"}",
			"func ReadHealthError(h HealthError) string {",
			"  return h.Error()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "syncerrorstring", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public Error(): string {",
		"return ($.pointerValue<wrappedError>(w).msg + \": \") + $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<wrappedError>(w).cause).Error()",
		"return $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<healthError>(h).cause).Error()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	for _, bad := range []string{
		"public async Error(): globalThis.Promise<string>",
		"await $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<wrappedError>(w).cause).Error()",
		"await $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<healthError>(h).cause).Error()",
		"await $.pointerValue<HealthError>(h).Error()",
	} {
		if strings.Contains(text, bad) {
			t.Fatalf("error stringification became async at %q:\n%s", bad, text)
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
			"Drive:",
			"  window := value + 1",
			"  if window < 0 {",
			"    goto Drive",
			"  }",
			"  println(window)",
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
		"Drive: while (true)",
		"var window = value + 1",
		"$.println(window)",
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
		"$.functionValue(((__receiver) => (n: number) => Counter_Add(__receiver, n))(c), ({ kind: $.TypeKind.Function",
		"$.functionValue(((__receiver) => () => __receiver.Run())(",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
	if strings.Contains(text, "...args: any[]") {
		t.Fatalf("method value lowering still uses spread args:\n%s", text)
	}
}

func TestCompilePackagesLowersSortSearchCallbackAsAsyncCompatible(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/sync-callback\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sort\"",
			"type Item interface {",
			"  Name() string",
			"}",
			"type Items interface {",
			"  Len() int",
			"  Get(i int) Item",
			"}",
			"func Lookup(items Items, name string) int {",
			"  return sort.Search(items.Len(), func(i int) bool {",
			"    item := items.Get(i)",
			"    if item == nil {",
			"      return true",
			"    }",
			"    return item.Name() >= name",
			"  })",
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
	content, err := os.ReadFile(filepath.Join(outputDir, "@goscript", "example.test", "sync-callback", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"return await sort.Search(",
		"$.functionValue(async (i: number): globalThis.Promise<boolean> => {",
		"let item = await $.pointerValue<Exclude<Items, null>>(items).Get(i)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
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
			"type Header map[string][]string",
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
			"  Header lib.Header",
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
		"Header: $.VarRef<lib.Header>",
		"Fn: $.VarRef<((_p0: lib.Box) => [lib.Box, $.GoError] | globalThis.Promise<[lib.Box, $.GoError]>) | null>",
		"Ptr: $.VarRef<atomic.Pointer<(() => void) | null>>",
		"Header: $.varRef(init?.Header ?? (null as lib.Header))",
		"$.markAsStructValue(new lib.Box())",
		"$.markAsStructValue(new atomic.Pointer<(() => void) | null>())",
		"export async function Use(fn: ((_p0: lib.Box) => [lib.Box, $.GoError] | globalThis.Promise<[lib.Box, $.GoError]>) | null, box: lib.Box): globalThis.Promise<[lib.Box, $.GoError]>",
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
			"var wide uint64 = 1",
			"var signed int64 = 1",
			"func invert(crc uint64) uint64 {",
			"  return ^crc",
			"}",
			"func main() {",
			"  mask := 7",
			"  mask &^= 3",
			"  println(^value, ^wide, ^signed, invert(wide), value &^ 3, mask, 0700)",
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
		"return $.uint64Xor(crc, -1n)",
		"mask = mask & ~((3))",
		"$.println(Number($.int64Xor(value, -1n)), $.uint64Xor(wide, -1n), $.int64Xor(signed, -1n), invert(wide), value & ~(3), mask, 0o700)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesParenthesizesRepeatedUnarySigns(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/unary-signs\n\ngo 1.25.3\n",
		"constants.go": strings.Join([]string{
			"package main",
			"const extOffset = -0x1000",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"type Extension int32",
			"type LoadExtension struct { Num Extension }",
			"func Decode(k int32) LoadExtension {",
			"  return LoadExtension{Num: Extension(-extOffset + k)}",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "unary-signs", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "--4096") {
		t.Fatalf("generated invalid decrement token:\n%s", text)
	}
	if !strings.Contains(text, "-(-4096) + k") {
		t.Fatalf("missing parenthesized negative constant:\n%s", text)
	}
}

func TestCompilePackagesNormalizesWideIntegerReturnTargets(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/wide-return\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"hash\"",
			"func Read(h hash.Hash64) uint64 {",
			"  return h.Sum64()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "wide-return", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "return await $.pointerValue<Exclude<hash.Hash64, null>>(h).Sum64()") {
		t.Fatalf("missing uint64 return passthrough:\n%s", text)
	}
}

func TestCompilePackagesUnwrapsImportedVarRefValueMethodReceiver(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/imported-varref-receiver\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"type Info struct { Count int }",
			"func (i Info) Enabled() bool { return i.Count > 0 }",
			"func addInfo(i *Info) { i.Count = 1 }",
			"var CPU Info",
			"func init() { addInfo(&CPU) }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/imported-varref-receiver/dep\"",
			"func Enabled() bool {",
			"  return dep.CPU.Enabled()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "imported-varref-receiver", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "$.cloneStructValue($.pointerValue<dep.Info>(dep.CPU))") {
		t.Fatalf("missing imported VarRef receiver unwrap:\n%s", text)
	}
	if strings.Contains(text, "$.cloneStructValue(dep.CPU))") {
		t.Fatalf("imported VarRef receiver stayed wrapped:\n%s", text)
	}
}

func TestCompilePackagesUnwrapsOverridePointerMethodReceiver(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/override-pointer-receiver\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync/atomic\"",
			"func Read(active *atomic.Int32) int32 {",
			"  return active.Load()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "override-pointer-receiver", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "atomic.Int32.prototype.Load.call($.pointerValue<atomic.Int32>(active))") {
		t.Fatalf("override pointer receiver was not unwrapped:\n%s", text)
	}
	if strings.Contains(text, "atomic.Int32.prototype.Load.call(active)") {
		t.Fatalf("override pointer receiver stayed wrapped:\n%s", text)
	}
}

func TestCompilePackagesUsesRuntimeValueForAbsentSelectedReceiverType(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/selected-receiver-import\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"net/http\"",
			"func URLString(req *http.Request) string {",
			"  return req.URL.String()",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "selected-receiver-import", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if strings.Contains(text, "URL.prototype.String.call") {
		t.Fatalf("selected receiver method call used unqualified type:\n%s", text)
	}
	if !strings.Contains(text, "$.pointerValue<http.Request>(req).URL.String()") {
		t.Fatalf("selected receiver method call did not use runtime value method:\n%s", text)
	}
}

func TestCompilePackagesUnwrapsImportedArrayPackageVarReads(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/imported-array-var\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"var Table = [2]int{3, 5}",
			"func touch(v *[2]int) { v[0]++ }",
			"func init() { touch(&Table) }",
			"func Sum(v [2]int) int { return v[0] + v[1] }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/imported-array-var/dep\"",
			"func Read() int {",
			"  return dep.Table[1] + dep.Sum(dep.Table)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "imported-array-var", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.arrayIndex($.pointerValue<number[]>(dep.Table), 1)",
		"dep.Sum($.pointerValue<number[]>(dep.Table))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing imported array package var read %q:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAddressesImportedArrayPackageVarsAsRefs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/imported-array-var-address\n\ngo 1.25.3\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"var Table = [2]int{3, 5}",
			"func touch(v *[2]int) { v[0]++ }",
			"func init() { touch(&Table) }",
			"func SumPtr(v *[2]int) int { return v[0] + v[1] }",
			"",
		}, "\n"),
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/imported-array-var-address/dep\"",
			"func Read() int {",
			"  return dep.SumPtr(&dep.Table)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "imported-array-var-address", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "dep.SumPtr(dep.Table)") {
		t.Fatalf("missing imported array package var address:\n%s", text)
	}
	if strings.Contains(text, "dep.SumPtr($.pointerValue<number[]>(dep.Table))") ||
		strings.Contains(text, "dep._fields.Table") {
		t.Fatalf("imported array package var address was lowered as a read or field:\n%s", text)
	}
}

func TestCompilePackagesUnwrapsAliasedArrayPackageVarReads(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/aliased-array-var\n\ngo 1.25.3\n",
		"table.go": strings.Join([]string{
			"package main",
			"var Table = [2]int{3, 5}",
			"func touch(v *[2]int) { v[0]++ }",
			"func init() { touch(&Table) }",
			"func Sum(v [2]int) int { return v[0] + v[1] }",
			"",
		}, "\n"),
		"read.go": strings.Join([]string{
			"package main",
			"func Read() int {",
			"  return Table[1] + Sum(Table)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "aliased-array-var", "read.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"$.arrayIndex($.pointerValue<number[]>(__goscript_table.Table), 1)",
		"Sum($.pointerValue<number[]>(__goscript_table.Table))",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing aliased array package var read %q:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAddressesAliasedArrayPackageVarsAsRefs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/aliased-array-var-address\n\ngo 1.25.3\n",
		"table.go": strings.Join([]string{
			"package main",
			"var Table = [2]int{3, 5}",
			"func touch(v *[2]int) { v[0]++ }",
			"func init() { touch(&Table) }",
			"func SumPtr(v *[2]int) int { return v[0] + v[1] }",
			"",
		}, "\n"),
		"read.go": strings.Join([]string{
			"package main",
			"func Read() int {",
			"  return SumPtr(&Table)",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "aliased-array-var-address", "read.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "SumPtr(__goscript_table.Table)") {
		t.Fatalf("missing aliased array package var address:\n%s", text)
	}
	if strings.Contains(text, "SumPtr($.pointerValue<number[]>(__goscript_table.Table))") {
		t.Fatalf("aliased array package var address was lowered as a read:\n%s", text)
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

func TestTypeScriptEmitOwnerEmitsToMemoryOnDiskPath(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/memoryemit\n\ngo 1.25.3\n",
		"main.go": "package main\nfunc main() { println(\"memory\") }\n",
	})
	outputDir := filepath.Join(t.TempDir(), "output")
	req := &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          outputDir,
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeReference,
	}
	service := NewCompileService()
	graph, diagnostics := service.PackageGraphOwner().Load(context.Background(), req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("graph diagnostics: %#v", diagnostics)
	}
	model, diagnostics := service.SemanticModelOwner().Build(context.Background(), graph)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("semantic diagnostics: %#v", diagnostics)
	}
	program, diagnostics := service.LoweringOwner().Build(context.Background(), model)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("lowering diagnostics: %#v", diagnostics)
	}

	files, diagnostics := service.TypeScriptEmitOwner().EmitToMemory(context.Background(), program)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("memory emit diagnostics: %#v", diagnostics)
	}
	path := "@goscript/example.test/memoryemit/main.gs.ts"
	if !strings.Contains(files[path], "$.println(\"memory\")") {
		t.Fatalf("missing in-memory output: %#v", files)
	}
	if _, diagnostics := service.TypeScriptEmitOwner().Emit(context.Background(), req, program); diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("disk emit diagnostics: %#v", diagnostics)
	}
	content, err := os.ReadFile(filepath.Join(outputDir, filepath.FromSlash(path)))
	if err != nil {
		t.Fatal(err.Error())
	}
	if string(content) != files[path] {
		t.Fatalf("disk and memory emit diverged:\n%s\n---\n%s", string(content), files[path])
	}
}

func TestCompilePackagesLowersNamedStructConversionWithTypedAsyncFact(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/namedstructconvert\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"type Source struct { Value int }",
			"type Target Source",
			"func Make() Source {",
			"  ch := make(chan Source, 1)",
			"  ch <- Source{Value: 7}",
			"  return <-ch",
			"}",
			"func Convert() Target {",
			"  return Target(Make())",
			"}",
			"func ConvertLiteral() Target {",
			"  return Target(func() Source {",
			"    ch := make(chan Source, 1)",
			"    ch <- Source{Value: 9}",
			"    return <-ch",
			"  }())",
			"}",
			"func main() { println(Convert().Value) }",
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
	outputFile := filepath.Join(outputDir, "@goscript", "example.test", "namedstructconvert", "main.gs.ts")
	content, err := os.ReadFile(outputFile)
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	if !strings.Contains(text, "await (async () => { const __goscriptConvert") {
		t.Fatalf("missing async named struct conversion:\n%s", text)
	}
	if !strings.Contains(text, "$.markAsStructValue(new Target({Value: __goscriptConvert") {
		t.Fatalf("missing typed named struct conversion target:\n%s", text)
	}
	if !strings.Contains(text, "const __goscriptConvert1 = await (async ") {
		t.Fatalf("missing async fact from function literal conversion source:\n%s", text)
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
