// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInt = number

export function MyInt_Double(m: MyInt): number {
	return $.int(m) * 2
}

export async function main(): Promise<void> {
	// Test direct method call on type conversion
	let result = MyInt_Double(5)
	$.println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	let fn = ((__receiver) => () => MyInt_Double(__receiver))(10)
	$.println("Method ref call:", fn!())
}


if ($.isMainScript(import.meta)) {
	await main()
}
