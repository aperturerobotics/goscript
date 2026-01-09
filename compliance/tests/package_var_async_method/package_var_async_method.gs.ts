// Generated file based on package_var_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export let cache: $.VarRef<sync.Map> = $.varRef(new sync.Map())

// This function calls an async method on a package-level variable
export async function getValueFromCache(key: string): Promise<[null | any, boolean]> {
	return await cache!.value.Load(key)
}

export async function main(): Promise<void> {
	await cache!.value.Store("hello", "world")

	let [val, ok] = await getValueFromCache("hello")
	if (ok) {
		$.println("Found:", $.mustTypeAssert<string>(val, {kind: $.TypeKind.Basic, name: 'string'}))
	}
}

