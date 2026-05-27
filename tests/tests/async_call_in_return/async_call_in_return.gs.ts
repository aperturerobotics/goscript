// Generated file based on async_call_in_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(__goscriptValue: sync.Map): void {
	cache.value = __goscriptValue
}

export async function getFromCache(key: string): globalThis.Promise<[any, boolean]> {
	let [val, ok] = await cache.value.Load(key)
	return [val, ok]
}

export async function getFromCacheInline(key: string): globalThis.Promise<[any, boolean]> {
	return await cache.value.Load(key)
}

export async function main(): globalThis.Promise<void> {
	await cache.value.Store("test", 42)

	let [val1, ok1] = await getFromCache("test")
	if (ok1) {
		$.println("getFromCache found:", $.mustTypeAssert<number>(val1, { kind: $.TypeKind.Basic, name: "int" }))
	}

	let [val2, ok2] = await getFromCacheInline("test")
	if (ok2) {
		$.println("getFromCacheInline found:", $.mustTypeAssert<number>(val2, { kind: $.TypeKind.Basic, name: "int" }))
	}

	let [, ok3] = await getFromCache("missing")
	if (!ok3) {
		$.println("Not found as expected")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
