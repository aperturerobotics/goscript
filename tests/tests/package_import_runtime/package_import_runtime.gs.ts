// Generated file based on package_import_runtime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"

export async function main(): Promise<void> {
	// Test basic runtime functions
	$.println("GOOS:", runtime.GOOS)

	// println("Version:", runtime.Version()) - not stable for the test (go.mod may change)
	// println("NumCPU:", runtime.NumCPU()) - not stable for the test (number of cores may change)
	$.println("GOARCH:", runtime.GOARCH)

	// Test GOMAXPROCS
	let procs = runtime.GOMAXPROCS(0) // Get current value
	$.println("GOMAXPROCS(-1):", runtime.GOMAXPROCS(-1))
	$.println("GOMAXPROCS(0):", procs)

	// Test NumGoroutine
	$.println("NumGoroutine:", runtime.NumGoroutine())

	// Test GC (should be no-op)
	await runtime.GC()
	$.println("GC called successfully")
}

