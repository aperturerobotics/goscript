package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"testing"
)

func TestOverrideRegistryPlansRuntimeAndOverrideDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "fmt",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(packages, pkg) {
			t.Fatalf("missing %s in copy plan: %v", pkg, packages)
		}
	}
	if slices.Index(packages, "errors") > slices.Index(packages, "fmt") {
		t.Fatalf("dependency order is wrong: %v", packages)
	}
}

func TestOverrideRegistryFactsAreImmutable(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	facts, diagnostics := owner.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("override facts failed: %#v", diagnostics)
	}

	metadata := facts.Metadata("sync")
	if !metadata.AsyncMethods["Map.Load"] {
		t.Fatalf("expected sync Map.Load async metadata")
	}
	metadata.AsyncMethods["Map.Load"] = false
	metadata.Dependencies = append(metadata.Dependencies, "mutated")

	metadata = facts.Metadata("sync")
	if !metadata.AsyncMethods["Map.Load"] {
		t.Fatalf("override metadata mutation leaked back into facts")
	}
	if slices.Contains(metadata.Dependencies, "mutated") {
		t.Fatalf("override dependency mutation leaked back into facts: %v", metadata.Dependencies)
	}

	pkg, dependencies, ok := facts.copyPackage("fmt")
	if !ok {
		t.Fatalf("missing fmt copy package facts")
	}
	if !slices.Contains(dependencies, "errors") {
		t.Fatalf("expected fmt dependency on errors, got %v", dependencies)
	}
	dependencies = append(dependencies, "mutated")
	if len(pkg.files) == 0 {
		t.Fatalf("expected fmt copy files")
	}
	pkg.files[0].data[0] = '!'

	pkg, dependencies, ok = facts.copyPackage("fmt")
	if !ok {
		t.Fatalf("missing fmt copy package facts after mutation")
	}
	if slices.Contains(dependencies, "mutated") {
		t.Fatalf("copy dependency mutation leaked back into facts: %v", dependencies)
	}
	if len(pkg.files) == 0 || pkg.files[0].data[0] == '!' {
		t.Fatalf("copy file mutation leaked back into facts")
	}

	ledger := facts.parityLedger("net/http")
	if got := ledger.Symbols["ServeFile"].Status; got != overrideParityStatusReal {
		t.Fatalf("expected net/http ServeFile real parity, got %q", got)
	}
	ledger.Symbols["ServeFile"] = overrideParityEntry{Status: overrideParityStatusDeferred}

	ledger = facts.parityLedger("net/http")
	if got := ledger.Symbols["ServeFile"].Status; got != overrideParityStatusReal {
		t.Fatalf("parity ledger mutation leaked back into facts: %q", got)
	}
}

func TestOverrideRegistryCopiesRuntimeAndOverrides(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	req := &CompileRequest{
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	plan, diagnostics := owner.CopyPlan(context.Background(), req, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "fmt",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}
	copied, diagnostics := owner.CopyPackages(context.Background(), req, plan)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy failed: %#v", diagnostics)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(copied, pkg) {
			t.Fatalf("missing copied package %s in %v", pkg, copied)
		}
	}
	for _, path := range []string{
		"@goscript/builtin/index.ts",
		"@goscript/errors/index.ts",
		"@goscript/fmt/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(req.OutputPath, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected copied file %s: %v", path, err)
		}
	}
	if _, err := os.Stat(filepath.Join(req.OutputPath, "@goscript", "fmt", "fmt.test.ts")); !os.IsNotExist(err) {
		t.Fatalf("override copy should not include test files")
	}
}

func TestOverrideRegistryCopiesExternalOverride(t *testing.T) {
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/lib/index.ts", strings.Join([]string{
		"import * as helper from '@goscript/example.test/helper/index.js'",
		"export function Run(): void { helper.Run() }",
		"",
	}, "\n"))
	writeFixtureFile(t, overrideDir, "example.test/lib/meta.json", `{"dependencies":["example.test/helper"]}`)
	writeFixtureFile(t, overrideDir, "example.test/helper/index.ts", "export function Run(): void {}\n")

	owner := NewOverrideRegistryOwner(overrideDir)
	req := &CompileRequest{
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	plan, diagnostics := owner.CopyPlan(context.Background(), req, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "example.test/lib",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}
	copied, diagnostics := owner.CopyPackages(context.Background(), req, plan)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy failed: %#v", diagnostics)
	}
	for _, pkg := range []string{"builtin", "example.test/helper", "example.test/lib"} {
		if !slices.Contains(copied, pkg) {
			t.Fatalf("missing copied package %s in %v", pkg, copied)
		}
	}
	for _, path := range []string{
		"@goscript/example.test/helper/index.ts",
		"@goscript/example.test/lib/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(req.OutputPath, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected copied file %s: %v", path, err)
		}
	}
}

func TestOverrideRegistryReportsMissingOverridePackage(t *testing.T) {
	_, diagnostics := NewOverrideRegistryOwner().CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "does/not/exist",
		OverrideCandidate: true,
	}}})
	requireDiagnosticCode(t, diagnostics, "goscript/overrides:missing-package")
}

func TestOverrideRegistryPlansOsOverrideDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "os",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}
	if !slices.Contains(packages, "os") {
		t.Fatalf("missing os in copy plan: %v", packages)
	}
	if slices.Contains(packages, "internal/poll") {
		t.Fatalf("os copy plan includes stale internal/poll dependency: %v", packages)
	}
}

func TestOverrideRegistryPlansNestedOverrideMetadataDependencies(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	plan, diagnostics := owner.CopyPlan(context.Background(), &CompileRequest{
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}, &PackageGraph{Nodes: []*PackageGraphNode{{
		PkgPath:           "github.com/aperturerobotics/wasivm/wazero/kernel/runtime/browser",
		OverrideCandidate: true,
	}}})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("copy plan failed: %#v", diagnostics)
	}

	var packages []string
	for _, pkg := range plan.packages {
		packages = append(packages, pkg.path)
	}

	runtimePkg := "github.com/aperturerobotics/wasivm/wazero/kernel/runtime"
	browserPkg := "github.com/aperturerobotics/wasivm/wazero/kernel/runtime/browser"
	for _, pkg := range []string{"builtin", runtimePkg, browserPkg} {
		if !slices.Contains(packages, pkg) {
			t.Fatalf("missing %s in copy plan: %v", pkg, packages)
		}
	}
	if slices.Index(packages, runtimePkg) > slices.Index(packages, browserPkg) {
		t.Fatalf("nested override dependency order is wrong: %v", packages)
	}
}

func TestCompilePackagesCopiesRuntimeOverrides(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/overridecopy\n\ngo 1.25.3\n",
		"main.go": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"ok\") }\n",
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatalf("compile failed: %v\n%#v", err, result.Diagnostics)
	}
	for _, pkg := range []string{"builtin", "errors", "fmt"} {
		if !slices.Contains(result.CopiedPackages, pkg) {
			t.Fatalf("missing copied package %s in %#v", pkg, result.CopiedPackages)
		}
	}
	for _, path := range []string{
		"@goscript/example.test/overridecopy/main.gs.ts",
		"@goscript/builtin/index.ts",
		"@goscript/fmt/index.ts",
	} {
		if _, err := os.Stat(filepath.Join(out, filepath.FromSlash(path))); err != nil {
			t.Fatalf("expected output file %s: %v", path, err)
		}
	}
}

func TestCompilePackagesAwaitsOverrideAsyncMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/overrideasync\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync\"",
			"func main() {",
			"  var m sync.Map",
			"  if value, ok := m.Load(\"key\"); ok {",
			"    println(value)",
			"  }",
			"}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "overrideasync", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), "let [value, ok] = await m.value.Load(\"key\")") {
		t.Fatalf("override async method call was not awaited:\n%s", string(content))
	}
}

func TestCompilePackagesPropagatesOverrideAsyncInterfaceMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/overrideasynciface\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"net/http\"",
			"type client struct { rt http.RoundTripper }",
			"func (c *client) Do(req *http.Request) (*http.Response, error) {",
			"  return c.rt.RoundTrip(req)",
			"}",
			"func Use(c *client, req *http.Request) (*http.Response, error) {",
			"  return c.Do(req)",
			"}",
			"func main() {}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "overrideasynciface", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"public async Do(req: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<[http.Response | $.VarRef<http.Response> | null, $.GoError]>",
		"return await $.pointerValue<Exclude<http.RoundTripper, null>>($.pointerValue<client>(c).rt).RoundTrip(req)",
		"export async function Use(c: client | $.VarRef<client> | null, req: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<[http.Response | $.VarRef<http.Response> | null, $.GoError]>",
		"return await client.prototype.Do.call(c, req)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAwaitsOverrideAsyncInterfaceMethodCalls(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/overrideasyncinterfacemethod\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"sync\"",
			"func Use(l sync.Locker) {",
			"  l.Lock()",
			"  l.Unlock()",
			"}",
			"func main() {}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "overrideasyncinterfacemethod", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Use(l: sync.Locker | null): globalThis.Promise<void>",
		"await $.pointerValue<Exclude<sync.Locker, null>>(l).Lock()",
		"$.pointerValue<Exclude<sync.Locker, null>>(l).Unlock()",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAwaitsNetHTTPServeHTTPOverrideMethods(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/httpserveasync\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"net/http\"",
			"func Use(h http.Handler, hf http.HandlerFunc, mux *http.ServeMux, w http.ResponseWriter, r *http.Request) {",
			"  h.ServeHTTP(w, r)",
			"  hf.ServeHTTP(w, r)",
			"  mux.ServeHTTP(w, r)",
			"}",
			"func main() {}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "httpserveasync", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	text := string(content)
	for _, want := range []string{
		"export async function Use(",
		"await $.pointerValue<Exclude<http.Handler, null>>(h).ServeHTTP($.pointerValueOrNil(w)!, r)",
		"await http.HandlerFunc_ServeHTTP(hf, $.pointerValueOrNil(w)!, r)",
		"await http.ServeMux.prototype.ServeHTTP.call($.pointerValue<http.ServeMux>(mux), $.pointerValueOrNil(w)!, r)",
	} {
		if !strings.Contains(text, want) {
			t.Fatalf("missing %q in generated output:\n%s", want, text)
		}
	}
}

func TestCompilePackagesAwaitsOverrideAsyncFunctions(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/overrideasyncfunc\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"io/fs\"",
			"  \"path/filepath\"",
			"  \"sync\"",
			")",
			"func main() {",
			"  var m sync.Map",
			"  _ = filepath.WalkDir(\".\", func(path string, d fs.DirEntry, err error) error {",
			"    if _, ok := m.Load(path); ok {",
			"      return nil",
			"    }",
			"    return nil",
			"  })",
			"}",
			"",
		}, "\n"),
	})
	out := filepath.Join(t.TempDir(), "out")
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      out,
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}

	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err.Error())
	}
	content, err := os.ReadFile(filepath.Join(out, "@goscript", "example.test", "overrideasyncfunc", "main.gs.ts"))
	if err != nil {
		t.Fatal(err.Error())
	}
	if !strings.Contains(string(content), "await filepath.WalkDir") {
		t.Fatalf("override async function call was not awaited:\n%s", string(content))
	}
	if !strings.Contains(string(content), "$.functionValue(async") {
		t.Fatalf("walk callback was not lowered as async:\n%s", string(content))
	}
}

func TestOverrideParityVerifierResolvesEffectiveTypeScriptExports(t *testing.T) {
	files := map[string]string{
		"example.test/lib/index.ts": strings.Join([]string{
			"export { RenamedSource as Renamed } from './named.js'",
			"export type { TypeShape } from './types.js'",
			"export * from './star.js'",
			"",
		}, "\n"),
		"example.test/lib/named.ts": "export function RenamedSource(): void {}\n",
		"example.test/lib/star.ts":  "export class Star {}\n",
		"example.test/lib/types.ts": "export interface TypeShape {}\n",
	}
	exports := make(map[string]typeScriptExport)
	if err := collectTypeScriptExports("example.test/lib/index.ts", files, exports, make(map[string]bool)); err != nil {
		t.Fatal(err.Error())
	}
	for _, name := range []string{"Renamed", "TypeShape", "Star"} {
		if !exports[name].present() {
			t.Fatalf("effective TypeScript exports missing %s: %v", name, exports)
		}
	}
	if exports["RenamedSource"].present() {
		t.Fatalf("named re-export source leaked into effective exports: %v", exports)
	}
	if !exports["Renamed"].value || exports["Renamed"].typ {
		t.Fatalf("renamed function export should be value-only: %#v", exports["Renamed"])
	}
	if !exports["TypeShape"].typ || exports["TypeShape"].value {
		t.Fatalf("type re-export should be type-only: %#v", exports["TypeShape"])
	}
	if !exports["Star"].value || !exports["Star"].typ {
		t.Fatalf("class star export should carry value and type shapes: %#v", exports["Star"])
	}
}

func TestOverrideParityVerifierValidatesNamedReExportSources(t *testing.T) {
	files := map[string]string{
		"example.test/lib/index.ts": "export { Missing } from './named.js'\n",
		"example.test/lib/named.ts": "export function Present(): void {}\n",
	}
	err := collectTypeScriptExports("example.test/lib/index.ts", files, make(map[string]typeScriptExport), make(map[string]bool))
	if err == nil {
		t.Fatalf("expected missing named re-export source to fail")
	}
	if !strings.Contains(err.Error(), "re-exports missing symbol Missing") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestOverrideParityVerifierValidatesLocalNamedExportSources(t *testing.T) {
	files := map[string]string{
		"example.test/lib/index.ts": "export { Missing }\n",
	}
	err := collectTypeScriptExports("example.test/lib/index.ts", files, make(map[string]typeScriptExport), make(map[string]bool))
	if err == nil {
		t.Fatalf("expected missing local named export source to fail")
	}
	if !strings.Contains(err.Error(), "exports missing local value symbol Missing") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestOverrideParityVerifierReportsStrictUnclassifiedSymbol(t *testing.T) {
	result, err := compileParityFixture(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
	}, "export function Present(): void {}\n")
	if err == nil {
		t.Fatalf("expected compile to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-unclassified")
}

func TestOverrideParityVerifierReportsMissingTypeScriptExport(t *testing.T) {
	result, err := compileParityFixture(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
		"Missing": {Status: overrideParityStatusReal},
	}, "export function Present(): void {}\n")
	if err == nil {
		t.Fatalf("expected compile to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-export")
}

func TestOverrideParityVerifierRejectsTypeOnlyValueExport(t *testing.T) {
	result, err := compileParityFixture(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
		"Missing": {Status: overrideParityStatusReal},
	}, strings.Join([]string{
		"export function Present(): void {}",
		"export type Missing = unknown",
		"",
	}, "\n"))
	if err == nil {
		t.Fatalf("expected compile to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-export")
}

func TestOverrideParityVerifierRejectsTypeOnlyStructExport(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/structparity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/structparity/lib\"",
			"func main() { _ = lib.StructExport{} }",
			"",
		}, "\n"),
		"lib/lib.go": strings.Join([]string{
			"package lib",
			"type StructExport struct{}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/structparity/lib/index.ts", "export type StructExport = {}\n")
	writeFixtureFile(t, overrideDir, "example.test/structparity/lib/parity.json", parityFixtureJSON(t, map[string]overrideParityEntry{
		"StructExport": {Status: overrideParityStatusReal},
	}))

	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		OverrideDirs:    []string{overrideDir},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatalf("expected compile to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-missing-export")
}

func TestOverrideParityVerifierReportsBlockedTypeScriptExport(t *testing.T) {
	result, err := compileParityFixture(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
		"Missing": {Status: overrideParityStatusBlocked, Reason: "blocked by fixture"},
	}, strings.Join([]string{
		"export function Present(): void {}",
		"export function Missing(): void {}",
		"",
	}, "\n"))
	if err == nil {
		t.Fatalf("expected compile to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-unexpected-export")
}

func TestOverrideParityVerifierAllowsDeferredMissingExports(t *testing.T) {
	result, err := compileParityFixture(t, map[string]overrideParityEntry{
		"Present": {Status: overrideParityStatusReal},
		"Missing": {Status: overrideParityStatusDeferred},
	}, "export function Present(): void {}\n")
	if err != nil {
		t.Fatalf("compile failed: %v\n%#v", err, result.Diagnostics)
	}
}

func TestOverrideParityVerifierReportsDeferredAtPhaseClose(t *testing.T) {
	owner := NewOverrideRegistryOwner()
	facts, diagnostics := owner.Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("override facts failed: %#v", diagnostics)
	}

	diagnostics = NewOverrideParityVerifier().VerifyNoDeferred(facts,
		"net/http",
		"net/http/httptest",
		"encoding/json",
		"mime",
		"time",
		"reflect",
		"math/bits",
		"strings",
		"strconv",
		"compress/zlib",
		"io",
		"go/scanner",
		"hash",
		"internal/goarch",
		"os",
		"runtime",
		"runtime/pprof",
		"runtime/trace",
	)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("override ledgers still contain deferred entries: %#v", diagnostics)
	}
}

func TestOverrideParityVerifierAcceptsPhase4Ledgers(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/phase4parity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import (",
			"  \"compress/zlib\"",
			"  \"encoding/json\"",
			"  \"go/scanner\"",
			"  \"hash\"",
			"  \"io\"",
			"  \"math/bits\"",
			"  \"mime\"",
			"  \"os\"",
			"  \"reflect\"",
			"  \"strconv\"",
			"  \"strings\"",
			"  \"time\"",
			")",
			"var _ = json.Valid",
			"var _ = mime.TypeByExtension",
			"var _ = time.RFC1123",
			"var _ = reflect.VisibleFields",
			"var _ = bits.Rem32",
			"var _ = strings.ToValidUTF8",
			"var _ = strconv.FormatComplex",
			"var _ = zlib.NoCompression",
			"var _ io.ReadSeekCloser",
			"var _ = scanner.PrintError",
			"var _ hash.XOF",
			"var _ = os.ErrNoHandle",
			"func main() {}",
			"",
		}, "\n"),
	})
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatalf("compile failed: %v\n%#v", err, result.Diagnostics)
	}
}

func TestOverrideParityVerifierReportsBlockedUse(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/blockedparity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"reflect\"",
			"func main() {",
			"  _ = reflect.FuncOf(nil, nil, false)",
			"}",
			"",
		}, "\n"),
	})
	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatalf("expected blocked reflect.FuncOf use to fail")
	}
	requireDiagnosticCode(t, result.Diagnostics, "goscript/overrides:parity-blocked-use")
}

func compileParityFixture(
	t *testing.T,
	symbols map[string]overrideParityEntry,
	index string,
) (*CompilationResult, error) {
	t.Helper()

	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/parity\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package main",
			"import \"example.test/parity/lib\"",
			"func main() { lib.Present() }",
			"",
		}, "\n"),
		"lib/lib.go": strings.Join([]string{
			"package lib",
			"func Present() {}",
			"func Missing() {}",
			"",
		}, "\n"),
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/parity/lib/index.ts", index)
	writeFixtureFile(t, overrideDir, "example.test/parity/lib/parity.json", parityFixtureJSON(t, symbols))

	comp, err := NewCompiler(&Config{
		Dir:             moduleDir,
		OutputPath:      filepath.Join(t.TempDir(), "out"),
		OverrideDirs:    []string{overrideDir},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	return comp.CompilePackages(context.Background(), ".")
}

func parityFixtureJSON(t *testing.T, symbols map[string]overrideParityEntry) string {
	t.Helper()

	var b strings.Builder
	b.WriteString("{\"schemaVersion\":1,\"strict\":true,\"symbols\":{")
	names := make([]string, 0, len(symbols))
	for name := range symbols {
		names = append(names, name)
	}
	slices.Sort(names)
	for idx, name := range names {
		if idx != 0 {
			b.WriteByte(',')
		}
		entry := symbols[name]
		b.WriteString(strconv.Quote(name))
		b.WriteString(":{\"status\":")
		b.WriteString(strconv.Quote(string(entry.Status)))
		if entry.Reason != "" {
			b.WriteString(",\"reason\":")
			b.WriteString(strconv.Quote(entry.Reason))
		}
		b.WriteString("}")
	}
	b.WriteString("}}\n")
	return b.String()
}
