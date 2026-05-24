// Generated file based on cross_file_struct_typeinfo_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_a from "./a.gs.ts"

import * as __goscript_b from "./b.gs.ts"
import "./a.gs.ts"
import "./b.gs.ts"

export async function main(): globalThis.Promise<void> {
	let a = $.markAsStructValue($.cloneStructValue(__goscript_a.makeA()))
	let b = $.markAsStructValue($.cloneStructValue(__goscript_b.makeB()))
	$.println("ok:", a.next == null, b.inner.next == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
