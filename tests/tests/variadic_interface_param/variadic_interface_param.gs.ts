// Generated file based on variadic_interface_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function testVariadicInterface(name: string, values: $.Slice<any>): void {
	$.println("Name:", name)
	$.println("Values count:", $.len(values))
	for (let i = 0; i < $.len(values); i++) {
		let v = values[i]
		if (v != null) {
			$.println("Value", i, "is not nil")
		} else {
			$.println("Value", i, "is nil")
		}
	}
}

export async function main(): Promise<void> {
	testVariadicInterface("test1", "hello", 42, true)
	testVariadicInterface("test2", null, "world")
	testVariadicInterface("test3")
	let values = ["a", "b", "c"]
	testVariadicInterface("test4", values)
}


if ($.isMainScript(import.meta)) {
	await main()
}
