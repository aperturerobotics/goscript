// Generated file based on variadic_interface_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function testVariadicInterface(name: string, values: $.Slice<any>): void {
	$.println("Name:", name)
	$.println("Values count:", $.len(values))
	for (let i = 0; i < $.len(values); i++) {
		let v = values![i]
		// We can't do much with interface{} values in the compiled output
		// but we can at least check they're passed correctly
		if (v != null) {
			$.println("Value", i, "is not nil")
		} else {
			$.println("Value", i, "is nil")
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// Test with various argument types
	testVariadicInterface("test1", $.arrayToSlice<any>(["hello", 42, true]))
	testVariadicInterface("test2", $.arrayToSlice<any>([null, "world"]))
	testVariadicInterface("test3", null)

	// Test with slice expansion
	let values = $.arrayToSlice<any>(["a", "b", "c"])
	testVariadicInterface("test4", values)
}


if ($.isMainScript(import.meta)) {
	await main()
}
