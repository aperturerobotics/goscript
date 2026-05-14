package main_test

import (
	"context"
	"errors"
	"os"
	"path/filepath"
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

	_, err = comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatalf("expected complex example to exceed the v2 seed subset")
	}
	var compileErr *compiler.CompileError
	if !errors.As(err, &compileErr) {
		t.Fatalf("expected CompileError, got %T: %v", err, err)
	}
	foundUnsupported := false
	for _, diagnostic := range compileErr.Diagnostics {
		if diagnostic.Code == "goscript/lowering:unsupported" {
			foundUnsupported = true
			break
		}
	}
	if !foundUnsupported {
		t.Fatalf("expected unsupported lowering diagnostic, got %#v", compileErr.Diagnostics)
	}
	if _, statErr := os.Stat(outputDir); !os.IsNotExist(statErr) {
		t.Fatalf("compile wrote output directory before unsupported lowering stopped: %v", statErr)
	}
}
