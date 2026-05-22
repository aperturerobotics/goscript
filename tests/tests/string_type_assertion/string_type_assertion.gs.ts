// Generated file based on string_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let w: any = "test"
	$.println("value is", $.mustTypeAssert<string>(w, { kind: $.TypeKind.Basic, name: "string" }))
}

if ($.isMainScript(import.meta)) {
	await main()
}
