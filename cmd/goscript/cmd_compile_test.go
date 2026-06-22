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

func TestCompileCommandForwardsPackageBlocklist(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cli\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package cli",
		`import "example.test/cli/dep"`,
		"func Selected() int { return dep.Value() }",
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "dep", "dep.go"), strings.Join([]string{
		"package dep",
		"func Value() int { return 1 }",
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
		"--all-dependencies",
		"--package-blocklist=example.test/cli/dep,example.test/unused",
	})
	if err == nil {
		t.Fatal("expected package blocklist error")
	}
	text := err.Error()
	if !strings.Contains(text, "goscript/package-graph:blocklisted-package") {
		t.Fatalf("expected blocklist diagnostic, got %q", text)
	}
	if !strings.Contains(text, "example.test/cli -> example.test/cli/dep") {
		t.Fatalf("expected CLI diagnostic to include import chain, got %q", text)
	}
}

func TestCompileCommandForwardsCompilerCacheRoot(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	cacheRoot := filepath.Join(dir, "cache")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/clicache\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package clicache",
		"const Value = 1",
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
		"--compiler-cache-root",
		cacheRoot,
	})
	if err != nil {
		t.Fatalf("compile command failed: %v", err)
	}

	if got := countCompilerCacheManifests(t, cacheRoot); got == 0 {
		t.Fatal("compiler cache root did not receive cache manifests")
	}
}

func TestCompileCommandForwardsCompilerCacheRootEnv(t *testing.T) {
	dir := t.TempDir()
	outputDir := filepath.Join(dir, "output")
	cacheRoot := filepath.Join(dir, "cache")
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/clicacheenv\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "main.go"), strings.Join([]string{
		"package clicacheenv",
		"const Value = 1",
		"",
	}, "\n"))
	t.Setenv("GOSCRIPT_COMPILER_CACHE_ROOT", cacheRoot)

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

	if got := countCompilerCacheManifests(t, cacheRoot); got == 0 {
		t.Fatal("compiler cache env root did not receive cache manifests")
	}
}

func writeFile(t *testing.T, path string, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("create parent for %s: %v", path, err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
}

func countCompilerCacheManifests(t *testing.T, cacheRoot string) int {
	t.Helper()
	count := 0
	err := filepath.WalkDir(cacheRoot, func(_ string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !entry.IsDir() && entry.Name() == "manifest.json" {
			count++
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return count
}
