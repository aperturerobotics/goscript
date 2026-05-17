// Package gotest owns GoScript package-test execution.
package gotest

// Owner classifies the package owner that should receive a test-runner failure.
type Owner string

const (
	// OwnerPackageGraph classifies package pattern, build tag, or dependency graph failures.
	OwnerPackageGraph Owner = "PackageGraphOwner"
	// OwnerSemanticModel classifies Go type or semantic fact failures.
	OwnerSemanticModel Owner = "SemanticModelOwner"
	// OwnerLowering classifies unsupported Go-to-GoScript lowering failures.
	OwnerLowering Owner = "LoweringOwner"
	// OwnerTypeScriptEmitter classifies invalid emitted TypeScript failures.
	OwnerTypeScriptEmitter Owner = "TypeScriptEmitterOwner"
	// OwnerRuntimePackage classifies GoScript runtime primitive failures.
	OwnerRuntimePackage Owner = "RuntimePackageOwner"
	// OwnerOverridePackage classifies handwritten package override failures.
	OwnerOverridePackage Owner = "OverridePackageOwner"
	// OwnerTestRunner classifies generated testmain, execution, and aggregation failures.
	OwnerTestRunner Owner = "TestRunnerOwner"
	// OwnerSpacewaveHarness classifies target-ring or harness selection failures.
	OwnerSpacewaveHarness Owner = "SpacewaveHarnessOwner"
)
