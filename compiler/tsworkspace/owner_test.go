package tsworkspace

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestOwnerWritesWorkspaceFiles(t *testing.T) {
	dir := t.TempDir()
	owner := NewOwner(dir, dir)

	if result := owner.EnsurePackageJSON(); result.Failed() {
		t.Fatalf("write package json: %s", result.Error)
	}
	if result := owner.WriteJSON(PhaseWorkspace, "tsconfig.json", map[string]any{
		"compilerOptions": map[string]any{
			"strict": true,
		},
	}); result.Failed() {
		t.Fatalf("write tsconfig: %s", result.Error)
	}

	for _, name := range []string{"package.json", "tsconfig.json"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Fatalf("expected %s: %v", name, err)
		}
	}
}

func TestOwnerRejectsWorkspacePathEscapes(t *testing.T) {
	dir := t.TempDir()
	owner := NewOwner(dir, dir)

	for _, name := range []string{"../escape.ts", filepath.Join("nested", "..", "..", "escape.ts"), filepath.Join(dir, "escape.ts")} {
		if result := owner.WriteFile(PhaseWorkspace, name, "escape"); !result.Failed() {
			t.Fatalf("expected %s to fail", name)
		}
	}
}

func TestOwnerRunsToolsWithCapturedOutput(t *testing.T) {
	dir := t.TempDir()
	owner := NewOwner(dir, dir)

	result := owner.RunTool(context.Background(), PhaseRuntime, dir, "go", "env", "GOVERSION")
	if result.Failed() {
		t.Fatalf("run tool: %s\n%s", result.Error, result.Output)
	}
	if result.Output == "" {
		t.Fatalf("expected captured output")
	}
	if len(result.Command) == 0 {
		t.Fatalf("expected command capture")
	}
}

func TestOwnerWritesNodeAmbientTypes(t *testing.T) {
	dir := t.TempDir()
	owner := NewOwner(dir, dir)

	if result := owner.EnsureNodeAmbientTypes(); result.Failed() {
		t.Fatalf("write node ambient types: %s", result.Error)
	}
	data, err := os.ReadFile(filepath.Join(dir, NodeAmbientTypesFile))
	if err != nil {
		t.Fatalf("read node ambient types: %v", err)
	}
	if !strings.Contains(string(data), "declare module 'node:fs'") {
		t.Fatalf("node ambient types missing node:fs declaration: %s", data)
	}
}

func TestOwnerSkipsNodeAmbientTypesWhenNodeTypesExist(t *testing.T) {
	dir := t.TempDir()
	if err := os.MkdirAll(filepath.Join(dir, "node_modules", "@types", "node"), 0o755); err != nil {
		t.Fatal(err.Error())
	}
	owner := NewOwner(filepath.Join(dir, "work"), dir)

	if result := owner.EnsureNodeAmbientTypes(); result.Failed() {
		t.Fatalf("write node ambient types: %s", result.Error)
	}
	data, err := os.ReadFile(filepath.Join(dir, "work", NodeAmbientTypesFile))
	if err != nil {
		t.Fatalf("read node ambient types: %v", err)
	}
	if strings.TrimSpace(string(data)) != "" {
		t.Fatalf("node ambient types should be empty when @types/node is already visible: %s", data)
	}
}
