// Generated file based on generic_async_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function inner(__typeArgs: $.GenericTypeArgs | undefined, ch: $.Channel<any> | null): globalThis.Promise<any> {
	return await $.chanRecv(ch)
}

export async function outer(__typeArgs: $.GenericTypeArgs | undefined, ch: $.Channel<any> | null): globalThis.Promise<any> {
	return await inner({T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ch)
}

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 7)
	$.println("value:", await outer({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ch))
}


if ($.isMainScript(import.meta)) {
	await main()
}
