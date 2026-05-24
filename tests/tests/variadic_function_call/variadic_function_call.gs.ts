// Generated file based on variadic_function_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export function TestFS(fsys: string, expected: $.Slice<string>): $.GoError {
	return testFS(fsys, expected)
}

export function testFS(fsys: string, expected: $.Slice<string>): $.GoError {
	if ($.len(expected) == 0) {
		return errors.New("no expected values")
	}

	for (let __goscriptRangeTarget0 = expected, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let exp = __goscriptRangeTarget0![i]
		$.println((("Expected[" + String.fromCodePoint($.int(i + 48, 32))) + "]: ") + exp)
	}

	$.println("File system: " + fsys)
	return null
}

export async function main(): globalThis.Promise<void> {
	let expected: $.Slice<string> = $.arrayToSlice<string>(["file1.txt", "file2.txt", "file3.txt"])

	// This is the problematic line - should generate spread syntax in TypeScript
	let err = TestFS("myfs", expected)

	if (err != null) {
		$.println("Error: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		$.println("Success!")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
