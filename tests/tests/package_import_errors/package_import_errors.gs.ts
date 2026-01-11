// Generated file based on package_import_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

export async function main(): Promise<void> {
	// Test basic error creation
	let err1 = errors.New("first error")
	let err2 = errors.New("second error")

	$.println("err1:", err1!.Error())
	$.println("err2:", err2!.Error())

	// Test error comparison
	$.println("err1 == err2:", err1 == err2)
	$.println("err1 == nil:", err1 == null)

	// Test nil error
	let nilErr: $.GoError = null
	$.println("nilErr == nil:", nilErr == null)

	$.println("test finished")
}

