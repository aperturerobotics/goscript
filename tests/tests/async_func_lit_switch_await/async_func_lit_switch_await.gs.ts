// Generated file based on async_func_lit_switch_await.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let fn: ((_p0: number) => boolean | Promise<boolean>) | null = null

export async function main(): Promise<void> {
	let ch = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ch, true)
	fn = $.functionValue(async (value: number): Promise<boolean> => {
		switch (value) {
			case 0:
			{
				return await $.chanRecv(ch)
				break
			}
			default:
			{
				return false
				break
			}
		}
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })
	$.println(await fn!(0))
}


if ($.isMainScript(import.meta)) {
	await main()
}
