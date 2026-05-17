package gotest

// Test describes one discovered Go test function.
type Test struct {
	// Name is the Go TestXxx function name.
	Name string
	// PackagePath is the package variant that exports the function.
	PackagePath string
}
