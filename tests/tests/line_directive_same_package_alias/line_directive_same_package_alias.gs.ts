// Generated file based on line_directive_same_package_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_generated from "./generated.gs.ts"
import "./generated.gs.ts"

export async function main(): globalThis.Promise<void> {
	let sym: __goscript_generated.yySymType = $.markAsStructValue(new __goscript_generated.yySymType())
	sym.value = 3
	let parser: __goscript_generated.yyParserImpl | $.VarRef<__goscript_generated.yyParserImpl> | null = __goscript_generated.yyNewParser()
	$.println(sym.value, parser != null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
