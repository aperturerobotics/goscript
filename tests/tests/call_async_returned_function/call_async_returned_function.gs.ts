// Generated file based on call_async_returned_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export async function getCallback(): Promise<((_p0: string) => void) | null> {
	await cache.value.Load(1)
	return $.functionValue((msg: string): void => {
		$.println("Callback:", msg)
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] })
}

export async function main(): Promise<void> {
	// Call the function returned by an async function
	// This should generate: (await getCallback())!("hello")
	// NOT: await getCallback()!("hello")
	void (await getCallback())!("hello")
}


if ($.isMainScript(import.meta)) {
	await main()
}
