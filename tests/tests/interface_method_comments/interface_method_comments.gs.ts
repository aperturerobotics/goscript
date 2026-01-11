// Generated file based on interface_method_comments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = null | {
	// MyMethod is a method with a comment
	MyMethod(): void
}

$.registerInterfaceType(
  'main.MyInterface',
  null, // Zero value for interface is null
  [{ name: "MyMethod", args: [], returns: [] }]
);

export async function main(): Promise<void> {
	// This test verifies that comments on interface methods are preserved.
	$.println("Test started")
	// No actual execution needed, just compilation check.
	$.println("Test finished")
}

