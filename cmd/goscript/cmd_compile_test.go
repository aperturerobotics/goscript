package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCompileCommandForwardsBuildFlags(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cli\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "default.go"), strings.Join([]string{
		"//go:build !customtag",
		"",
		"package cli",
		`const selected = "default"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "tagged.go"), strings.Join([]string{
		"//go:build customtag",
		"",
		"package cli",
		`const selected = "custom"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package cli",
		"func Selected() string { return selected }",
		"",
	}, "\n"))

	app := newApp()
	err := app.Run([]string{
		"goscript",
		"compile",
		"--package",
		".",
		"--output",
		outputDir,
		"--dir",
		dir,
		"--build-flags",
		"-tags=customtag",
	})
	if err != nil {
		t.Fatalf("compile command failed: %v", err)
	}

	generatedPath := filepath.Join(outputDir, "@goscript", "example.test", "cli", "main.gs.ts")
	generated, err := os.ReadFile(generatedPath)
	if err != nil {
		t.Fatalf("read generated file: %v", err)
	}
	if !strings.Contains(string(generated), `./tagged.gs.ts`) {
		t.Fatalf("expected main output to import tagged source, got:\n%s", generated)
	}
	taggedPath := filepath.Join(outputDir, "@goscript", "example.test", "cli", "tagged.gs.ts")
	tagged, err := os.ReadFile(taggedPath)
	if err != nil {
		t.Fatalf("read tagged generated file: %v", err)
	}
	if !strings.Contains(string(tagged), `"custom"`) {
		t.Fatalf("expected tagged generated file to use tagged source, got:\n%s", tagged)
	}
	if strings.Contains(string(tagged), `"default"`) {
		t.Fatalf("tagged generated file used source excluded by build tag:\n%s", tagged)
	}
}

func TestCompileCommandPreservesCommaSeparatedBuildFlagValues(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cli\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "default.go"), strings.Join([]string{
		"//go:build !(customtag && othertag)",
		"",
		"package cli",
		`const selected = "default"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "tagged.go"), strings.Join([]string{
		"//go:build customtag && othertag",
		"",
		"package cli",
		`const selected = "custom"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package cli",
		"func Selected() string { return selected }",
		"",
	}, "\n"))

	app := newApp()
	err := app.Run([]string{
		"goscript",
		"compile",
		"--package",
		".",
		"--output",
		outputDir,
		"--dir",
		dir,
		"--build-flags=-tags=customtag,othertag",
	})
	if err != nil {
		t.Fatalf("compile command failed: %v", err)
	}

	taggedPath := filepath.Join(outputDir, "@goscript", "example.test", "cli", "tagged.gs.ts")
	tagged, err := os.ReadFile(taggedPath)
	if err != nil {
		t.Fatalf("read tagged generated file: %v", err)
	}
	if !strings.Contains(string(tagged), `"custom"`) {
		t.Fatalf("expected tagged generated file to use tagged source, got:\n%s", tagged)
	}
}

func TestCompileCommandPreservesCommaSeparatedBuildFlagEnvValue(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cli\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "default.go"), strings.Join([]string{
		"//go:build !(customtag && othertag)",
		"",
		"package cli",
		`const selected = "default"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "tagged.go"), strings.Join([]string{
		"//go:build customtag && othertag",
		"",
		"package cli",
		`const selected = "custom"`,
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package cli",
		"func Selected() string { return selected }",
		"",
	}, "\n"))

	t.Setenv("GOSCRIPT_BUILD_FLAGS", "-tags=customtag,othertag")

	app := newApp()
	err := app.Run([]string{
		"goscript",
		"compile",
		"--package",
		".",
		"--output",
		outputDir,
		"--dir",
		dir,
	})
	if err != nil {
		t.Fatalf("compile command failed: %v", err)
	}

	taggedPath := filepath.Join(outputDir, "@goscript", "example.test", "cli", "tagged.gs.ts")
	tagged, err := os.ReadFile(taggedPath)
	if err != nil {
		t.Fatalf("read tagged generated file: %v", err)
	}
	if !strings.Contains(string(tagged), `"custom"`) {
		t.Fatalf("expected tagged generated file to use tagged source, got:\n%s", tagged)
	}
}

func writeFile(t *testing.T, path string, content string) {
	t.Helper()
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
}
