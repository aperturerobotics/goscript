// Generated file based on call_async_returned_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as sync from "@goscript/sync/index.ts"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export async function getCallback(): Promise<(_p0: string) => void> {
	await cache.value.Load(1)
	return $.functionValue((msg: string): void => {
	$.println("Callback:", msg)
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] })
}

export async function main(): Promise<void> {
	(await getCallback())("hello")
}


if ($.isMainScript(import.meta)) {
	await main()
}
