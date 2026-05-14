// Generated file based on variadic_function_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as errors from "@goscript/errors/index.ts"

export function TestFS(fsys: string, expected: $.Slice<string>): error {
	return testFS(fsys, expected)
}

export function testFS(fsys: string, expected: $.Slice<string>): error {
	if ($.len(expected) == 0) {
		return errors.New("no expected values")
	}
	for (let i = 0; i < $.len(expected); i++) {
		let exp = expected[i]
		$.println("Expected[" + String.fromCodePoint($.int(i + 48)) + "]: " + exp)
	}
	$.println("File system: " + fsys)
	return null
}

export async function main(): Promise<void> {
	let expected = ["file1.txt", "file2.txt", "file3.txt"]
	let err = TestFS("myfs", expected)
	if (err != null) {
		$.println("Error: " + err.Error())
	} else {
		$.println("Success!")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
