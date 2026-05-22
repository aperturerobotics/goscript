// Generated file based on blank_func_decl.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

function __goscriptBlankFunc0(): void {
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	x[0]
}

function __goscriptBlankFunc1(): void {
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	x[0]
}

export async function main(): Promise<void> {
	$.println("blank funcs ok")
}


if ($.isMainScript(import.meta)) {
	await main()
}
