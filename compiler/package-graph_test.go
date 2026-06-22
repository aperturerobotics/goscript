package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func TestCompileRequestValidation(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/request\n\ngo 1.25.3\n",
		"main.go": "package main\nfunc main() {}\n",
	})
	owner := NewCompileRequestOwner()

	tests := []struct {
		name string
		req  *CompileRequest
		code string
	}{
		{
			name: "empty package",
			req: &CompileRequest{
				Patterns:            []string{""},
				Dir:                 moduleDir,
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:empty-package",
		},
		{
			name: "single file",
			req: &CompileRequest{
				Patterns:            []string{"main.go"},
				Dir:                 moduleDir,
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:single-file-unsupported",
		},
		{
			name: "no output",
			req: &CompileRequest{
				Patterns:            []string{"."},
				Dir:                 moduleDir,
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:no-output",
		},
		{
			name: "no module",
			req: &CompileRequest{
				Patterns:            []string{"."},
				Dir:                 t.TempDir(),
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:no-module",
		},
		{
			name: "empty build flag",
			req: &CompileRequest{
				Patterns:            []string{"."},
				Dir:                 moduleDir,
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				BuildFlags:          []string{" "},
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:empty-build-flag",
		},
		{
			name: "dependency mode",
			req: &CompileRequest{
				Patterns:            []string{"."},
				Dir:                 moduleDir,
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				DependencyMode:      DependencyMode("invalid"),
				RuntimeEmissionMode: RuntimeEmissionModeEmit,
			},
			code: "goscript/request:dependency-mode",
		},
		{
			name: "runtime emission mode",
			req: &CompileRequest{
				Patterns:            []string{"."},
				Dir:                 moduleDir,
				OutputPath:          filepath.Join(t.TempDir(), "out"),
				DependencyMode:      DependencyModeRequested,
				RuntimeEmissionMode: RuntimeEmissionMode("invalid"),
			},
			code: "goscript/request:runtime-emission-mode",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			diagnostics := owner.Validate(tt.req)
			requireDiagnosticCode(t, diagnostics, tt.code)
		})
	}
}

func TestPackageGraphLoadsRequestedPackage(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/graph\n\ngo 1.25.3\n",
		"main.go": "package main\nfunc main() {}\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	if len(graph.Nodes) != 1 {
		t.Fatalf("expected one requested node, got %d", len(graph.Nodes))
	}
	node := graph.Nodes[0]
	if node.PkgPath != "example.test/graph" || !node.Requested {
		t.Fatalf("unexpected node: %#v", node)
	}
	if node.ModulePath != "example.test/graph" {
		t.Fatalf("unexpected module path: %q", node.ModulePath)
	}
}

func TestPackageGraphReportsLoadErrors(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/loaderr\n\ngo 1.25.3\n",
		"main.go": "package main\nimport \"missing.invalid/pkg\"\nfunc main() { _ = pkg.Value }\n",
	})
	_, diagnostics := NewPackageGraphOwner().Load(context.Background(), &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})
	requireDiagnosticCode(t, diagnostics, "goscript/package-graph:load-error")
}

func TestPackageGraphHonorsBuildFlags(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":      "module example.test/tags\n\ngo 1.25.3\n",
		"default.go":  "package tags\nconst Selected = \"default\"\n",
		"tagged.go":   "//go:build customtag\n\npackage tags\nconst Tagged = true\n",
		"excluded.go": "//go:build !customtag\n\npackage tags\nconst Excluded = true\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		BuildFlags:          []string{"-tags=customtag"},
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	var compiled []string
	for _, file := range graph.Nodes[0].CompiledGoFiles {
		compiled = append(compiled, filepath.Base(file))
	}
	if !slices.Contains(compiled, "tagged.go") {
		t.Fatalf("expected tagged.go in compiled files: %v", compiled)
	}
	if slices.Contains(compiled, "excluded.go") {
		t.Fatalf("did not expect excluded.go in compiled files: %v", compiled)
	}
}

func TestPackageGraphNormalizesCompiledFileOrder(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/order\n\ngo 1.25.3\n",
		"z.go":   "package order\nconst Z = 1\n",
		"a.go":   "package order\nconst A = 1\n",
		"m.go":   "package order\nconst M = 1\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	pkg := graph.packagesByPath["example.test/order"]
	if pkg == nil {
		t.Fatalf("missing loaded package")
	}
	var compiled []string
	var syntax []string
	for idx, file := range pkg.Syntax {
		compiled = append(compiled, filepath.Base(pkg.CompiledGoFiles[idx]))
		syntax = append(syntax, filepath.Base(pkg.Fset.Position(file.Package).Filename))
	}
	if want := []string{"a.go", "m.go", "z.go"}; !slices.Equal(compiled, want) || !slices.Equal(syntax, want) {
		t.Fatalf("compiled files and syntax must sort together, got compiled=%v syntax=%v", compiled, syntax)
	}
}

func TestPackageGraphAddsGoScriptBuildTag(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":       "module example.test/goscripttag\n\ngo 1.25.3\n",
		"default.go":   "package goscripttag\nconst Selected = \"default\"\n",
		"goscript.go":  "//go:build goscript\n\npackage goscripttag\nconst GoScript = true\n",
		"excluded.go":  "//go:build !goscript\n\npackage goscripttag\nconst Excluded = true\n",
		"customtag.go": "//go:build customtag\n\npackage goscripttag\nconst Custom = true\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		BuildFlags:          []string{"-tags=customtag"},
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	var compiled []string
	for _, file := range graph.Nodes[0].CompiledGoFiles {
		compiled = append(compiled, filepath.Base(file))
	}
	for _, expected := range []string{"default.go", "goscript.go", "customtag.go"} {
		if !slices.Contains(compiled, expected) {
			t.Fatalf("expected %s in compiled files: %v", expected, compiled)
		}
	}
	if slices.Contains(compiled, "excluded.go") {
		t.Fatalf("did not expect excluded.go in compiled files: %v", compiled)
	}
}

func TestPackageGraphLoadsLocalReplacement(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": strings.Join([]string{
			"module example.test/app",
			"",
			"go 1.25.3",
			"",
			"require example.test/lib v0.0.0",
			"replace example.test/lib => ./lib",
			"",
		}, "\n"),
		"main.go":       "package main\nimport \"example.test/lib\"\nfunc main() { lib.Value() }\n",
		"lib/go.mod":    "module example.test/lib\n\ngo 1.25.3\n",
		"lib/value.go":  "package lib\nfunc Value() int { return 1 }\n",
		"lib/unused.go": "package lib\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	if graph.NodesByPackagePath["example.test/lib"] == nil {
		t.Fatalf("expected local replacement dependency in graph")
	}
}

func TestPackageBlocklistAllowsCleanFixture(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":       "module example.test/blockclean\n\ngo 1.25.3\n",
		"main.go":      "package blockclean\nimport \"example.test/blockclean/dep\"\nfunc Value() int { return dep.Value() }\n",
		"dep/dep.go":   "package dep\nfunc Value() int { return 1 }\n",
		"other/doc.go": "package other\n",
	})
	comp, err := NewCompiler(&Config{
		Dir:              moduleDir,
		OutputPath:       filepath.Join(t.TempDir(), "out"),
		AllDependencies:  true,
		PackageBlocklist: []string{"example.test/blockclean/other"},
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with clean blocklist failed: %v", err)
	}
}

func TestPackageBlocklistReportsShortestImportChain(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":                 "module example.test/blockchain\n\ngo 1.25.3\n",
		"main.go":                "package blockchain\nimport \"example.test/blockchain/dep\"\nfunc Value() int { return dep.Value() }\n",
		"dep/dep.go":             "package dep\nimport \"example.test/blockchain/mid/blocked\"\nfunc Value() int { return blocked.Value() }\n",
		"mid/leaf.go":            "package mid\nimport \"example.test/blockchain/mid/blocked\"\nfunc Leaf() int { return blocked.Value() }\n",
		"mid/blocked/blocked.go": "package blocked\nfunc Value() int { return 1 }\n",
	})
	comp, err := NewCompiler(&Config{
		Dir:              moduleDir,
		OutputPath:       filepath.Join(t.TempDir(), "out"),
		AllDependencies:  true,
		PackageBlocklist: []string{"example.test/blockchain/mid/blocked"},
	}, nil, nil)
	if err != nil {
		t.Fatal(err.Error())
	}
	_, err = comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatal("expected blocklisted package diagnostic")
	}
	text := err.Error()
	if !strings.Contains(text, "goscript/package-graph:blocklisted-package") {
		t.Fatalf("expected blocklist diagnostic, got %q", text)
	}
	if !strings.Contains(text, `package graph contains blocklisted package "example.test/blockchain/mid/blocked"`) {
		t.Fatalf("expected blocklisted package name, got %q", text)
	}
	expected := "example.test/blockchain -> example.test/blockchain/dep -> example.test/blockchain/mid/blocked"
	if !strings.Contains(text, expected) {
		t.Fatalf("expected shortest import chain %q, got %q", expected, text)
	}
}

func TestPackageBlocklistIgnoresOverrideCandidateImports(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": strings.Join([]string{
			"module example.test/blockoverride",
			"",
			"go 1.25.3",
			"",
			"require example.test/over v0.0.0",
			"replace example.test/over => ./over",
			"",
		}, "\n"),
		"main.go":                "package blockoverride\nimport (\n\t\"example.test/over\"\n\t\"example.test/blockoverride/dep\"\n)\nfunc Value() int { return over.Value() + dep.Value() }\n",
		"dep/dep.go":             "package dep\nimport \"example.test/blockoverride/mid\"\nfunc Value() int { return mid.Value() }\n",
		"mid/mid.go":             "package mid\nimport \"example.test/blockoverride/mid/blocked\"\nfunc Value() int { return blocked.Value() }\n",
		"mid/blocked/blocked.go": "package blocked\nfunc Value() int { return 1 }\n",
		"over/go.mod": strings.Join([]string{
			"module example.test/over",
			"",
			"go 1.25.3",
			"",
			"require example.test/blockoverride v0.0.0",
			"replace example.test/blockoverride => ../",
			"",
		}, "\n"),
		"over/over.go": "package over\nimport \"example.test/blockoverride/mid/blocked\"\nfunc Value() int { return blocked.Value() }\n",
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/over/index.ts", "export function Value(): number { return 0 }\n")

	overrideOwner := NewOverrideRegistryOwner(overrideDir)
	req := &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
		PackageBlocklist:    []string{"example.test/blockoverride/mid/blocked"},
	}
	graph, diagnostics := NewPackageGraphOwner(overrideOwner).Load(context.Background(), req)
	if diagnosticsHaveErrors(diagnostics) {
		chain := packageBlocklistChain(graph, req.PackageBlocklist)
		if slices.Contains(chain, "example.test/over") {
			t.Fatalf("blocklist chain routed through override candidate: %v", chain)
		}
		expected := []string{
			"example.test/blockoverride",
			"example.test/blockoverride/dep",
			"example.test/blockoverride/mid",
			"example.test/blockoverride/mid/blocked",
		}
		if !slices.Equal(chain, expected) {
			t.Fatalf("expected real import chain %v, got %v", expected, chain)
		}
	} else {
		t.Fatal("expected blocklisted package diagnostic via the real import path")
	}
}

func TestPackageGraphDetectsOverrideCandidates(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/override\n\ngo 1.25.3\n",
		"main.go": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"ok\") }\n",
	})
	graph := loadPackageGraph(t, &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	})

	node := graph.NodesByPackagePath["fmt"]
	if node == nil {
		t.Fatalf("expected fmt node in graph")
	}
	if !node.OverrideCandidate {
		t.Fatalf("expected fmt to be detected as an override candidate")
	}
}

func TestPackageGraphDetectsExternalOverrideCandidates(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": strings.Join([]string{
			"module example.test/externaloverride",
			"",
			"go 1.25.3",
			"",
			"require example.test/lib v0.0.0",
			"replace example.test/lib => ./lib",
			"",
		}, "\n"),
		"main.go": "package main\nimport \"example.test/lib\"\nfunc main() { lib.Run() }\n",
		"lib/go.mod": strings.Join([]string{
			"module example.test/lib",
			"",
			"go 1.25.3",
			"",
			"require example.test/heavy v0.0.0",
			"replace example.test/heavy => ../heavy",
			"",
		}, "\n"),
		"lib/lib.go":     "package lib\nimport \"example.test/heavy\"\nfunc Run() { heavy.Run() }\n",
		"heavy/go.mod":   "module example.test/heavy\n\ngo 1.25.3\n",
		"heavy/heavy.go": "package heavy\nfunc Run() {}\n",
	})
	overrideDir := filepath.Join(t.TempDir(), "gs")
	writeFixtureFile(t, overrideDir, "example.test/lib/index.ts", "export function Run(): void {}\n")

	overrideOwner := NewOverrideRegistryOwner(overrideDir)
	req := &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		DependencyMode:      DependencyModeAll,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	graph, diagnostics := NewPackageGraphOwner(overrideOwner).Load(context.Background(), req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("package graph failed: %#v", diagnostics)
	}
	lib := graph.NodesByPackagePath["example.test/lib"]
	if lib == nil || !lib.OverrideCandidate {
		t.Fatalf("expected external override candidate for lib")
	}
	if graph.NodesByPackagePath["example.test/heavy"] != nil {
		t.Fatalf("external override dependency should not be collected")
	}
}

func TestPackageGraphOverrideCandidatesRequirePackageIndex(t *testing.T) {
	parent := "github.com/aperturerobotics/wasivm/wazero/kernel"
	child := parent + "/runtime"
	facts, diagnostics := NewOverrideRegistryOwner().Facts(context.Background())
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("override facts failed: %#v", diagnostics)
	}

	if facts.HasPackage(parent) {
		t.Fatalf("parent directory without an override index was detected as an override candidate")
	}
	if !facts.HasPackage(child) {
		t.Fatalf("nested package with an override index was not detected as an override candidate")
	}
}

func TestPackageGraphLoadIdentityOmitsTypedFacts(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/identitygraph\n\ngo 1.25.3\n",
		"main.go": "package identitygraph\nconst Value = 1\n",
	})
	graph, diagnostics := NewPackageGraphOwner().LoadIdentity(context.Background(), &CompileRequest{
		Dir:        moduleDir,
		OutputPath: filepath.Join(t.TempDir(), "out"),
		Patterns:   []string{"."},
	})
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("identity graph load failed: %#v", diagnostics)
	}
	node := graph.NodesByPackagePath["example.test/identitygraph"]
	if node == nil {
		t.Fatalf("missing identity graph node: %#v", graph.NodesByPackagePath)
	}
	if len(node.CompiledGoFiles) != 1 || filepath.Base(node.CompiledGoFiles[0]) != "main.go" {
		t.Fatalf("compiled files = %#v, want main.go", node.CompiledGoFiles)
	}
	pkg := graph.packagesByPath["example.test/identitygraph"]
	if pkg == nil {
		t.Fatal("missing loaded package")
	}
	if pkg.Types != nil || pkg.TypesInfo != nil || len(pkg.Syntax) != 0 {
		t.Fatalf("identity graph loaded typed facts: Types=%v TypesInfo=%v Syntax=%d", pkg.Types, pkg.TypesInfo, len(pkg.Syntax))
	}
}

func loadPackageGraph(t *testing.T, req *CompileRequest) *PackageGraph {
	t.Helper()

	diagnostics := NewCompileRequestOwner().Validate(req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("request validation failed: %#v", diagnostics)
	}
	graph, diagnostics := NewPackageGraphOwner().Load(context.Background(), req)
	if diagnosticsHaveErrors(diagnostics) {
		t.Fatalf("package graph load failed: %#v", diagnostics)
	}
	return graph
}

func writePackageGraphFixture(t *testing.T, files map[string]string) string {
	t.Helper()

	dir := t.TempDir()
	for name, contents := range files {
		writeFixtureFile(t, dir, name, contents)
	}
	return dir
}

func writeFixtureFile(t *testing.T, root, name, contents string) {
	t.Helper()

	path := filepath.Join(root, filepath.FromSlash(name))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
		t.Fatal(err.Error())
	}
}

func requireDiagnosticCode(t *testing.T, diagnostics []Diagnostic, code string) {
	t.Helper()

	for _, diagnostic := range diagnostics {
		if diagnostic.Code == code {
			return
		}
	}
	t.Fatalf("missing diagnostic %q in %#v", code, diagnostics)
}
