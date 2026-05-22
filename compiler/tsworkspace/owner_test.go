package tsworkspace

import (
	"context"
	"os"
	"path/filepath"
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
