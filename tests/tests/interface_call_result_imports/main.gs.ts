// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep1 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep1/index.js"

import * as dep2 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep2/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep1/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep2/index.js"

export async function main(): globalThis.Promise<void> {
	let v = dep1.Make()
	$.println($.pointerValue<Exclude<dep2.Value, null>>(v).Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}
