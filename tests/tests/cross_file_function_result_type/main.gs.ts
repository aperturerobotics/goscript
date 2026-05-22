// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_helper from "./helper.gs.ts"

export async function main(): globalThis.Promise<void> {
	let tok: __goscript_helper.token | $.VarRef<__goscript_helper.token> | null = __goscript_helper.newToken(9)
	$.println(__goscript_helper.consumeToken(tok))
}


if ($.isMainScript(import.meta)) {
	await main()
}
