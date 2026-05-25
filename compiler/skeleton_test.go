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
		"$.println(Greeting, total)",
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
		"export let two: holder = undefined as unknown as holder",
		"export function __goscript_get_two(): holder",
		"export let remoteZero: __goscript_a.remote = undefined as unknown as __goscript_a.remote",
		"export function __goscript_get_remoteZero(): __goscript_a.remote",
		"__goscript_a.one",
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
		"export let table: $.Slice<detail> = undefined as unknown as $.Slice<detail>",
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
		"export let first: Point | $.VarRef<Point> | null = undefined as unknown as Point | $.VarRef<Point> | null",
		"export function __goscript_get_first(): Point | $.VarRef<Point> | null",
		"function __goscript_get___goscriptTuple",
		"export let later: number = 7",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
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
	if !strings.Contains(text, "table = $.append(__goscript_get_table(), 2)") {
		t.Fatalf("missing direct lazy package var assignment:\n%s", text)
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
		"import * as __goscript_local from \"./local.gs.ts\"",
		"import \"./local.gs.ts\"",
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
		"let copy = $.markAsStructValue($.cloneStructValue(original.value))",
		"let pointer: Counter | $.VarRef<Counter> | null = original",
		"Counter.prototype.Set.call(pointer, 2)",
		"Counter.prototype.Set.call(NewCounter(), 5)",
		"let [, ok] = $.typeAssertTuple<Counter | $.VarRef<Counter> | null>(iface, { kind: $.TypeKind.Pointer, elemType: \"main.Counter\" })",
		"\"Value\": { type: { kind: $.TypeKind.Basic, name: \"int\" }, tag: \"json:\\\"value\\\"\" }",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
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
		"slice![0] = arr[1]",
		"let m: Map<string, number> | null = $.makeMap<string, number>()",
		"$.mapSet(m, \"one\", 1)",
		"let [value, ok] = $.mapGet(m, \"missing\", 0)",
		"slice![0]",
		"literal![2]",
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
		"export type ReadCloser = null | {",
		"Read(): string",
		"Close(): string",
		"$.registerInterfaceType(\n\t\"main.ReadCloser\"",
		"((__receiver) => () => __receiver.Inc())($.pointerValue<Counter>(counter))",
		"$.namedFunction(greet, \"main.Greeter\")",
		"$.interfaceValue<any>(null, \"*struct{Name string}\")",
		"elemType: { kind: $.TypeKind.Struct, methods: [], fields: {\"Name\": { kind: $.TypeKind.Basic, name: \"string\" }} }",
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
		"export type FileInfo = null | {",
		"$.println($.pointerValue<Exclude<FileInfo, null>>(info).Name())",
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
		"$.println($.pointerValue<Exclude<Animal, null>>(animal).Name())",
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
		"export function CallString(__typeArgs: $.GenericTypeArgs | undefined, v: any): string",
		"export function Sum(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<any>): any",
		"export function Copy<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>): $.Slice<T>",
		"return $.append($.arrayToSlice<T>([]), ...(vals ?? []))",
		"let seen: Set = $.makeMap<number, {}>()",
		"$.mapSet(seen, 1, {})",
		"$.genericZero(__typeArgs, \"T\", null)",
		"$.callGenericMethod(__typeArgs, \"T\", \"String\", v)",
		"ZeroValue({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)($.pointerValue(receiver), ...args)} }})",
		"CallString({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)($.pointerValue(receiver), ...args)} }}, zero)",
		"Sum({T: { type: \"main.MyInt\", zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (MyInt_String as any)($.pointerValue(receiver), ...args)} }}, null)",
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
		"export type Callback = ((value: number) => string | globalThis.Promise<string>) | null",
		"export async function call(cb: ((value: number) => string | globalThis.Promise<string>) | null): globalThis.Promise<string> {\n\treturn await cb!(1)",
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
		"let ch = $.makeChannel<number>(1, 0, \"both\")",
		"await $.chanSend($.pointerValue<Worker>(w).ch, v)",
		"return await $.chanRecv($.pointerValue<Worker>(w).ch)",
		"await using __defer = new $.AsyncDisposableStack()",
		"queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {",
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
		"Fn: $.VarRef<((_p0: lib.Box) => [lib.Box, $.GoError] | globalThis.Promise<[lib.Box, $.GoError]>) | null>",
		"Ptr: $.VarRef<atomic.Pointer<(() => void) | null>>",
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
	if !strings.Contains(text, "return $.uint($.pointerValue<Exclude<hash.Hash64, null>>(h).Sum64(), 64)") {
		t.Fatalf("missing uint64 return normalization:\n%s", text)
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
		"$.pointerValue<number[]>(dep.Table)[1]",
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
		"$.pointerValue<number[]>(__goscript_table.Table)[1]",
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
	if !strings.Contains(text, "const __goscriptConvert1 = await ($.functionValue(async ") {
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
