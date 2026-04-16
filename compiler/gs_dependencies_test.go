package compiler

import (
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"github.com/sirupsen/logrus"
)

func TestReadGsPackageMetadata(t *testing.T) {
	// Create a basic compiler configuration
	config := &Config{
		OutputPath: "./test_output",
		Dir:        ".",
	}

	// Create a logger (set to warn level to reduce noise in tests)
	logger := logrus.New()
	logger.SetLevel(logrus.WarnLevel)
	le := logrus.NewEntry(logger)

	// Create a compiler
	comp, err := NewCompiler(config, le, nil)
	if err != nil {
		t.Fatalf("Failed to create compiler: %v", err)
	}

	// Test reading metadata from the bytes package
	metadata, err := comp.ReadGsPackageMetadata("gs/bytes")
	if err != nil {
		t.Fatalf("Failed to read metadata: %v", err)
	}

	// Check that we found the expected dependencies
	if len(metadata.Dependencies) == 0 {
		t.Errorf("Expected at least one dependency, got none")
	}

	// Check for the specific "iter" dependency
	foundIter := slices.Contains(metadata.Dependencies, "iter")

	if !foundIter {
		t.Errorf("Expected to find 'iter' dependency, got dependencies: %v", metadata.Dependencies)
	}

	// Also check for other expected dependencies from the bytes package
	expectedDeps := []string{"errors", "io", "iter", "unicode", "unicode/utf8", "unsafe"}
	for _, expected := range expectedDeps {
		found := slices.Contains(metadata.Dependencies, expected)
		if !found {
			t.Errorf("Expected to find dependency '%s', got dependencies: %v", expected, metadata.Dependencies)
		}
	}
}

func TestReadGsPackageMetadataWithAsyncMethods(t *testing.T) {
	// Create a basic compiler configuration
	config := &Config{
		OutputPath: "./test_output",
		Dir:        ".",
	}

	// Create a logger (set to warn level to reduce noise in tests)
	logger := logrus.New()
	logger.SetLevel(logrus.WarnLevel)
	le := logrus.NewEntry(logger)

	// Create a compiler
	comp, err := NewCompiler(config, le, nil)
	if err != nil {
		t.Fatalf("Failed to create compiler: %v", err)
	}

	// Test reading metadata from the sync package (which has async methods)
	metadata, err := comp.ReadGsPackageMetadata("gs/sync")
	if err != nil {
		t.Fatalf("Failed to read metadata: %v", err)
	}

	// Check that we have async methods
	if len(metadata.AsyncMethods) == 0 {
		t.Errorf("Expected at least one async method for sync package, got none")
	}

	// Check for specific async methods
	expectedAsyncMethods := []string{"Mutex.Lock", "WaitGroup.Wait", "RWMutex.Lock"}
	for _, methodName := range expectedAsyncMethods {
		if isAsync, exists := metadata.AsyncMethods[methodName]; !exists {
			t.Errorf("Expected to find async method '%s'", methodName)
		} else if !isAsync {
			t.Errorf("Expected method '%s' to be async, but it's not", methodName)
		}
	}
}

func TestReadGsPackageMetadataNonExistent(t *testing.T) {
	// Create a basic compiler configuration
	config := &Config{
		OutputPath: "./test_output",
		Dir:        ".",
	}

	// Create a logger (set to warn level to reduce noise in tests)
	logger := logrus.New()
	logger.SetLevel(logrus.WarnLevel)
	le := logrus.NewEntry(logger)

	// Create a compiler
	comp, err := NewCompiler(config, le, nil)
	if err != nil {
		t.Fatalf("Failed to create compiler: %v", err)
	}

	// Test reading metadata from a non-existent package
	metadata, err := comp.ReadGsPackageMetadata("gs/nonexistent")
	if err != nil {
		t.Fatalf("Expected no error for non-existent package, got: %v", err)
	}

	// Should return empty metadata for non-existent packages
	if len(metadata.Dependencies) != 0 {
		t.Errorf("Expected empty dependencies for non-existent package, got: %v", metadata.Dependencies)
	}

	if len(metadata.AsyncMethods) != 0 {
		t.Errorf("Expected empty async methods for non-existent package, got: %v", metadata.AsyncMethods)
	}
}

func TestCompilePackagesCopiesHandwrittenDependencies(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "goscript-gs-deps")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	wd, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get working directory: %v", err)
	}

	config := &Config{
		OutputPath:         tempDir,
		Dir:                filepath.Dir(wd),
		AllDependencies:    true,
		DisableEmitBuiltin: false,
	}

	logger := logrus.New()
	logger.SetLevel(logrus.WarnLevel)
	le := logrus.NewEntry(logger)

	comp, err := NewCompiler(config, le, nil)
	if err != nil {
		t.Fatalf("Failed to create compiler: %v", err)
	}

	_, err = comp.CompilePackages(
		context.Background(),
		"github.com/aperturerobotics/goscript/tests/tests/package_import_slices",
	)
	if err != nil {
		t.Fatalf("Compilation failed: %v", err)
	}

	cmpPath := filepath.Join(tempDir, "@goscript", "cmp", "index.ts")
	if _, err := os.Stat(cmpPath); err != nil {
		t.Fatalf("Expected handwritten dependency at %s: %v", cmpPath, err)
	}
}

func TestCompilePackagesEmitTypeScriptImportSpecifiers(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "goscript-ts-imports")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	wd, err := os.Getwd()
	if err != nil {
		t.Fatalf("Failed to get working directory: %v", err)
	}

	config := &Config{
		OutputPath:         tempDir,
		Dir:                filepath.Dir(wd),
		AllDependencies:    true,
		DisableEmitBuiltin: false,
	}

	logger := logrus.New()
	logger.SetLevel(logrus.WarnLevel)
	le := logrus.NewEntry(logger)

	comp, err := NewCompiler(config, le, nil)
	if err != nil {
		t.Fatalf("Failed to create compiler: %v", err)
	}

	_, err = comp.CompilePackages(
		context.Background(),
		"github.com/aperturerobotics/goscript/tests/tests/package_import",
		"github.com/aperturerobotics/goscript/tests/tests/map_value_field_access_cross_file",
	)
	if err != nil {
		t.Fatalf("Compilation failed: %v", err)
	}

	assertFileContains(t,
		filepath.Join(
			tempDir,
			"@goscript",
			"github.com",
			"aperturerobotics",
			"goscript",
			"tests",
			"tests",
			"package_import",
			"package_import.gs.ts",
		),
		[]string{
			`@goscript/builtin/index.ts`,
			`@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import/subpkg/index.ts`,
		},
		[]string{
			".js",
		},
	)

	assertFileContains(t,
		filepath.Join(
			tempDir,
			"@goscript",
			"github.com",
			"aperturerobotics",
			"goscript",
			"tests",
			"tests",
			"package_import",
			"subpkg",
			"index.ts",
		),
		[]string{
			`"./subpkg.gs.ts"`,
		},
		[]string{
			".gs.js",
		},
	)

	assertFileContains(t,
		filepath.Join(
			tempDir,
			"@goscript",
			"github.com",
			"aperturerobotics",
			"goscript",
			"tests",
			"tests",
			"map_value_field_access_cross_file",
			"read.gs.ts",
		),
		[]string{
			`"./types.gs.ts"`,
			`@goscript/builtin/index.ts`,
		},
		[]string{
			".gs.js",
			"index.js",
		},
	)
}

func assertFileContains(t *testing.T, path string, want []string, wantAbsent []string) {
	t.Helper()

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("Failed to read %s: %v", path, err)
	}
	text := string(data)

	for _, s := range want {
		if !strings.Contains(text, s) {
			t.Fatalf("Expected %s to contain %q\n%s", path, s, text)
		}
	}

	for _, s := range wantAbsent {
		if strings.Contains(text, s) {
			t.Fatalf("Expected %s to omit %q\n%s", path, s, text)
		}
	}
}
