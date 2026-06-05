// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function wrap(fn: (() => number | globalThis.Promise<number>) | null, ch: $.Channel<number> | null): (() => number | globalThis.Promise<number>) | null {
	return $.functionValue(async (): globalThis.Promise<number> => {
		return await $.chanRecv(ch)
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	let fn: (() => number | globalThis.Promise<number>) | null = $.functionValue((): number => {
		return 1
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	fn = wrap(fn, ch)
	await $.chanSend(ch, 9)
	$.println(await fn!())
}

if ($.isMainScript(import.meta)) {
	await main()
}
