// Generated file based on async_func_lit_switch_await.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let fn: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null = null as unknown as ((_p0: number) => boolean | globalThis.Promise<boolean>) | null

export function __goscript_set_fn(__goscriptValue: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): void {
	fn = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let ch: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ch, true)
	fn = $.functionValue(async (value: number): globalThis.Promise<boolean> => {
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
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))
	$.println(await fn!(0))
}

if ($.isMainScript(import.meta)) {
	await main()
}
