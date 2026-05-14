// Generated file based on package_var_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as sync from "@goscript/sync/index.ts"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export async function getValueFromCache(key: string): Promise<[any, boolean]> {
	return await cache.value.Load(key)
}

export async function main(): Promise<void> {
	await cache.value.Store("hello", "world")
	let [val, ok] = await getValueFromCache("hello")
	if (ok) {
		$.println("Found:", $.mustTypeAssert<string>(val, { kind: $.TypeKind.Basic, name: "string" }))
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
