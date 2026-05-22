package main

import (
	"bytes"
	"path/filepath"
	"strings"
	"testing"
)

func TestTestCommandHelp(t *testing.T) {
	var out bytes.Buffer
	app := newApp()
	app.Writer = &out

	err := app.Run([]string{"goscript", "test", "--help"})
	if err != nil {
		t.Fatalf("test help failed: %v", err)
	}
	help := out.String()
	for _, expected := range []string{"compile and run Go package tests through GoScript", "--tags", "--run", "--count", "--short", "--timeout"} {
		if !strings.Contains(help, expected) {
			t.Fatalf("help output missing %q:\n%s", expected, help)
		}
	}
}

func TestTestCommandRunsPackageTest(t *testing.T) {
	dir := t.TempDir()
	writeFile(t, filepath.Join(dir, "go.mod"), "module example.test/cmdtest\n\ngo 1.25.3\n")
	writeFile(t, filepath.Join(dir, "value.go"), strings.Join([]string{
		"package cmdtest",
		"func Value() int { return 7 }",
		"",
	}, "\n"))
	writeFile(t, filepath.Join(dir, "value_test.go"), strings.Join([]string{
		"package cmdtest",
		"import \"testing\"",
		"func TestValue(t *testing.T) {",
		"\tif Value() != 7 {",
		"\t\tt.Fatal(\"bad value\")",
		"\t}",
		"}",
		"",
	}, "\n"))

	var out bytes.Buffer
	app := newApp()
	app.Writer = &out
	err := app.Run([]string{
		"goscript",
		"test",
		"--dir",
		dir,
		"--workdir",
		filepath.Join(dir, ".tmp", "cmd-test"),
		"-v",
		".",
	})
	if err != nil {
		t.Fatalf("test command failed: %v\n%s", err, out.String())
	}
	if !strings.Contains(out.String(), "ok  \texample.test/cmdtest") {
		t.Fatalf("expected ok package output, got:\n%s", out.String())
	}
}

func TestTestCommandRejectsUnsupportedFlags(t *testing.T) {
	app := newApp()
	err := app.Run([]string{"goscript", "test", "--cover", "."})
	if err == nil {
		t.Fatalf("expected unsupported flag to fail")
	}
	if !strings.Contains(err.Error(), "flag provided but not defined") {
		t.Fatalf("unexpected unsupported flag error: %v", err)
	}
}
