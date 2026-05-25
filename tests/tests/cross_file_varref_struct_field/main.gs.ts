// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_info from "./info.gs.ts"
import "./info.gs.ts"

export async function main(): globalThis.Promise<void> {
	__goscript_info.infoPtr()
	$.println($.pointerValue<__goscript_info.floatInfo>(__goscript_info.info).mantbits, $.pointerValue<__goscript_info.floatInfo>(__goscript_info.info).expbits)
}

if ($.isMainScript(import.meta)) {
	await main()
}
