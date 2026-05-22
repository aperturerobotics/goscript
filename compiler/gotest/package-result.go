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

// PhaseStatus names a package-test phase state.
type PhaseStatus string

const (
	// PhaseStatusPending means the phase has not run yet.
	PhaseStatusPending PhaseStatus = "pending"
	// PhaseStatusPass means the phase passed.
	PhaseStatusPass PhaseStatus = "pass"
	// PhaseStatusFail means the phase failed.
	PhaseStatusFail PhaseStatus = "fail"
	// PhaseStatusSkip means the phase was skipped.
	PhaseStatusSkip PhaseStatus = "skip"
)

// PackagePhases records structured package-test phase status.
type PackagePhases struct {
	// Workspace covers workspace files and tool discovery.
	Workspace PhaseStatus
	// Compile covers GoScript compile/lowering work.
	Compile PhaseStatus
	// Emit covers TypeScript emit/copy output work.
	Emit PhaseStatus
	// TypeCheck covers tsgo execution.
	TypeCheck PhaseStatus
	// Runtime covers Bun test execution.
	Runtime PhaseStatus
}

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
	// Phases records structured status for each runner phase.
	Phases PackagePhases
	// Owner is the primary owner classification for failures.
	Owner Owner
	// Error is the concise package failure message.
	Error string
	// Output is raw process output for the package.
	Output string
	// Elapsed is the package runtime.
	Elapsed time.Duration
}
