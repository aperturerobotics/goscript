// Generated file based on call_async_returned_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(__goscriptValue: sync.Map): void {
	cache.value = __goscriptValue
}

export async function getCallback(): globalThis.Promise<((_p0: string) => void) | null> {
	await cache.value.Load($.namedValueInterfaceValue<any>(1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	return $.functionValue((msg: string): void => {
		$.println("Callback:", msg)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	// Call the function returned by an async function
	// This should generate: (await getCallback())!("hello")
	// NOT: await getCallback()!("hello")
	await (await getCallback())!("hello")
}

if ($.isMainScript(import.meta)) {
	await main()
}
