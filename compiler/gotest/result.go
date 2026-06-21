package gotest

import "github.com/s4wave/goscript/compiler"

// Result describes one GoScript package-test run.
type Result struct {
	// WorkDir is the generated test workspace.
	WorkDir string
	// OutputRoot is the generated TypeScript package root.
	OutputRoot string
	// Packages are deterministic package-level test results.
	Packages []PackageResult
	// Diagnostics are compiler diagnostics surfaced during the run.
	Diagnostics []compiler.Diagnostic
}

// Passed returns true when every package result passed or had no tests.
func (r *Result) Passed() bool {
	if r == nil {
		return false
	}
	for _, pkg := range r.Packages {
		if pkg.Action == ActionFail {
			return false
		}
	}
	return true
}
