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
		path := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
			t.Fatal(err.Error())
		}
		if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
			t.Fatal(err.Error())
		}
	}
	return dir
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
