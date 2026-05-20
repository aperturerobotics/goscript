package gotest

import "time"

// Action names the package-level result action.
type Action string

const (
	// ActionPass means the package tests passed.
	ActionPass Action = "pass"
	// ActionFail means the package tests failed.
	ActionFail Action = "fail"
	// ActionSkip means the package has no runnable tests.
	ActionSkip Action = "skip"
)

// PackageResult describes one package-test result.
type PackageResult struct {
	// PackagePath is the package under test.
	PackagePath string
	// TestPackagePath is the package variant that contains test functions.
	TestPackagePath string
	// TestImports are direct imports from selected test variants.
	TestImports []string
	// Tests are the selected tests for this package.
	Tests []Test
	// Action is the package result.
	Action Action
	// Owner is the primary owner classification for failures.
	Owner Owner
	// Error is the concise package failure message.
	Error string
	// Output is raw process output for the package.
	Output string
	// Elapsed is the package runtime.
	Elapsed time.Duration
}
