// Generated file based on b.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_a from "./a.gs.ts"
import "./a.gs.ts"

function __goscriptInit0(): void {
	__goscript_a.__goscript_set_hook($.functionValue((): number => {
		return 2
	}, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))
}

export async function main(): globalThis.Promise<void> {
	$.println(await __goscript_a.read())
}

__goscriptInit0()

if ($.isMainScript(import.meta)) {
	await main()
}
