// Generated file based on async_call_in_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef(new sync.Map())

export async function getFromCache(key: string): Promise<[null | any, boolean]> {
	let [val, ok] = await cache!.value.Load(key)
	return [val, ok]
}

export async function getFromCacheInline(key: string): Promise<[null | any, boolean]> {
	return await cache!.value.Load(key)
}

export async function main(): Promise<void> {
	await cache!.value.Store("test", 42)

	let [val1, ok1] = await getFromCache("test")
	if (ok1) {
		$.println("getFromCache found:", $.mustTypeAssert<number>(val1, {kind: $.TypeKind.Basic, name: 'number'}))
	}

	let [val2, ok2] = await getFromCacheInline("test")
	if (ok2) {
		$.println("getFromCacheInline found:", $.mustTypeAssert<number>(val2, {kind: $.TypeKind.Basic, name: 'number'}))
	}

	let [, ok3] = await getFromCache("missing")
	if (!ok3) {
		$.println("Not found as expected")
	}
}

