// Generated file based on b.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_a from "./a.gs.ts"
import "@goscript/sync/index.js"
import "./a.gs.ts"

export let lock: $.VarRef<sync.Mutex> = $.varRef($.markAsStructValue(new sync.Mutex()))

export function __goscript_set_lock(__goscriptValue: sync.Mutex): void {
	lock.value = __goscriptValue
}

export var first: __goscript_a.holder

export async function __goscript_init_first(): globalThis.Promise<void> {
	if (((first) as any) === undefined) {
		first = await $.markAsStructValue($.cloneStructValue(await makeFirst()))
	}
}

export function __goscript_get_first(): __goscript_a.holder {
	if (((first) as any) === undefined) {
		throw new Error("goscript package variable first read before initialization")
	}
	return first
}

export function __goscript_set_first(__goscriptValue: __goscript_a.holder): void {
	first = __goscriptValue
}

export async function makeFirst(): globalThis.Promise<__goscript_a.holder> {
	using __defer = new $.DisposableStack()
	await lock.value.Lock()
	__defer.defer(() => { lock.value.Unlock() })
	return $.markAsStructValue(new __goscript_a.holder({n: __goscript_a.__goscript_get_seed()}))
}
