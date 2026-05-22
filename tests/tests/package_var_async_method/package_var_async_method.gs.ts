// Generated file based on package_var_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(value: sync.Map): void {
	cache.value = value
}

export async function getValueFromCache(key: string): globalThis.Promise<[any, boolean]> {
	return await cache.value.Load(key)
}

export async function main(): globalThis.Promise<void> {
	await cache.value.Store("hello", "world")

	let [val, ok] = await getValueFromCache("hello")
	if (ok) {
		$.println("Found:", $.mustTypeAssert<string>(val, { kind: $.TypeKind.Basic, name: "string" }))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
