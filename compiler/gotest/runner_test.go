package gotest

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestRunnerRunsOrdinaryPackageTest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/gotest\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package gotest",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package gotest",
			"",
			"import \"testing\"",
			"",
			"func TestAdd(t *testing.T) {",
			"\tif Add(1, 2) != 3 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
		Verbose:  true,
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].Tests[0].Name != "TestAdd" {
		t.Fatalf("unexpected test discovery: %#v", result.Packages[0].Tests)
	}
}

func TestRunnerRunsExternalPackageTest(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod": "module example.test/external\n\ngo 1.25.3\n",
		"value.go": strings.Join([]string{
			"package external",
			"",
			"func Add(a int, b int) int {",
			"\treturn a + b",
			"}",
			"",
		}, "\n"),
		"value_test.go": strings.Join([]string{
			"package external_test",
			"",
			"import (",
			"\t\"testing\"",
			"",
			"\texternal \"example.test/external\"",
			")",
			"",
			"func TestExternalAdd(t *testing.T) {",
			"\tif external.Add(4, 5) != 9 {",
			"\t\tt.Fatalf(\"unexpected sum\")",
			"\t}",
			"}",
			"",
		}, "\n"),
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Timeout:  30 * time.Second,
	})
	if err != nil {
		t.Fatalf("run external package test: %v", err)
	}
	if !result.Passed() {
		t.Fatalf("expected external package test to pass: %#v", result.Packages)
	}
	if len(result.Packages) != 1 || len(result.Packages[0].Tests) != 1 {
		t.Fatalf("unexpected package results: %#v", result.Packages)
	}
	if result.Packages[0].TestPackagePath == "" {
		t.Fatalf("expected test package path: %#v", result.Packages[0])
	}
}

func TestRunnerRejectsInvalidRunPattern(t *testing.T) {
	moduleDir := writeFixture(t, map[string]string{
		"go.mod":   "module example.test/badrun\n\ngo 1.25.3\n",
		"value.go": "package badrun\n",
	})

	result, err := NewRunner().Run(context.Background(), &Request{
		Dir:      moduleDir,
		Patterns: []string{"."},
		Run:      "[",
	})
	if err != nil {
		t.Fatalf("run package test: %v", err)
	}
	if result.Passed() {
		t.Fatalf("expected invalid run pattern to fail")
	}
	if result.Packages[0].Owner != OwnerPackageGraph {
		t.Fatalf("unexpected owner classification: %#v", result.Packages[0])
	}
}

func writeFixture(t *testing.T, files map[string]string) string {
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
