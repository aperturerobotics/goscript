package main_test

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"github.com/aperturerobotics/goscript/compiler"
	"github.com/sirupsen/logrus"
)

func TestBuildRunExampleSimple(t *testing.T) {
	// Set up paths
	projectDir, err := filepath.Abs(".")
	if err != nil {
		t.Fatalf("failed to determine project directory: %v", err)
	}
	outputDir := filepath.Join(projectDir, "output")
	if err := os.RemoveAll(outputDir); err != nil {
		t.Fatalf("failed to remove output directory: %v", err)
	}
	t.Cleanup(func() {
		if err := os.RemoveAll(outputDir); err != nil {
			t.Logf("failed to clean output directory: %v", err)
		}
	})

	// Initialize the compiler
	logger := logrus.New()
	logger.SetLevel(logrus.DebugLevel)
	le := logrus.NewEntry(logger)

	conf := &compiler.Config{
		OutputPath: outputDir,
	}
	if err := conf.Validate(); err != nil {
		t.Fatalf("invalid compiler config: %v", err)
	}

	comp, err := compiler.NewCompiler(conf, le, nil)
	if err != nil {
		t.Fatalf("failed to create compiler: %v", err)
	}

	if _, err = comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("failed to compile example: %v", err)
	}
	if _, statErr := os.Stat(filepath.Join(outputDir, "@goscript", "example", "main.gs.ts")); statErr != nil {
		t.Fatalf("generated main output missing: %v", statErr)
	}

	cmd := exec.Command("bun", "run", "./main.ts")
	cmd.Dir = projectDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("failed to run generated example: %v\n%s", err, output)
	}

	out := string(output)
	for _, want := range []string{
		"GoScript feature tour",
		"struct: ada 12 go typescript",
		"interface: ada",
		"set: true false 3",
		"filter: 2 2 4",
		"min: 3 4 go",
		"channel: 3 1 3",
		"select: buffered",
		"cleanup: simple",
	} {
		if !strings.Contains(out, want) {
			t.Fatalf("missing %q in example output:\n%s", want, out)
		}
	}
}
