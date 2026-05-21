// Generated file based on imported_generic_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as helper from "@goscript/github.com/aperturerobotics/goscript/tests/tests/imported_generic_function/helper/index.js"

export async function main(): Promise<void> {
	let box = $.markAsStructValue($.cloneStructValue(helper.Wrap({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 21)))
	$.println("wrapped:", box.Value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
