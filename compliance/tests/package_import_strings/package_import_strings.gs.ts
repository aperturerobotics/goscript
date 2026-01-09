// Generated file based on package_import_strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

export async function main(): Promise<void> {
	// This should trigger the unhandled make call error
	// strings.Builder uses make internally for its buffer
	let builder: $.VarRef<strings.Builder> = $.varRef(new strings.Builder())
	builder!.value.WriteString("Hello")
	builder!.value.WriteString(" ")
	builder!.value.WriteString("World")

	let result = builder!.value.String()
	$.println("Result:", result)

	// Also test direct make with strings.Builder
	let builderPtr = new strings.Builder({})
	builderPtr!.WriteString("Direct make test")
	$.println("Direct:", builderPtr!.String())
}

