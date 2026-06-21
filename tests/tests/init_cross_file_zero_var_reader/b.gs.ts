// Generated file based on b.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as reflect from "@goscript/reflect/index.js"

import * as __goscript_a from "./a.gs.ts"
import "./a.gs.ts"

export var registry: globalThis.Map<number, number> | null

export function __goscript_init_registry(): void {
	if (((registry) as any) === undefined) {
		registry = $.makeMap<number, number>()
	}
}

export function __goscript_get_registry(): globalThis.Map<number, number> | null {
	if (((registry) as any) === undefined) {
		__goscript_init_registry()
	}
	return registry
}

export function __goscript_set_registry(__goscriptValue: globalThis.Map<number, number> | null): void {
	registry = __goscriptValue
}

export var counter: number

export function __goscript_init_counter(): void {
	if (((counter) as any) === undefined) {
		counter = 0
	}
}

export function __goscript_get_counter(): number {
	if (((counter) as any) === undefined) {
		__goscript_init_counter()
	}
	return counter
}

export function __goscript_set_counter(__goscriptValue: number): void {
	counter = __goscriptValue
}

export var shared: $.VarRef<number>

export function __goscript_init_shared(): void {
	if (((shared) as any) === undefined) {
		shared = $.varRef(0)
	}
}

export function __goscript_get_shared(): $.VarRef<number> {
	if (((shared) as any) === undefined) {
		__goscript_init_shared()
	}
	return shared
}

export function __goscript_set_shared(__goscriptValue: number): void {
	__goscript_get_shared().value = __goscriptValue
}

export function readTable(): void {
	__goscript_set_counter(__goscript_get_counter() + 1)
	__goscript_a.__goscript_set_remoteCounter(__goscript_a.__goscript_get_remoteCounter() + 1)
	__goscript_set_shared(7)
	let ptr = shared
	$.println($.len(__goscript_a.__goscript_get_table()), $.len(__goscript_get_registry()), $.uint(__goscript_get_counter(), 64), __goscript_a.__goscript_get_remoteCounter(), $.pointerValue<number>(ptr), __goscript_a.__goscript_get_stringType() != null)
}

export async function main(): globalThis.Promise<void> {
}

if ($.isMainScript(import.meta)) {
	await main()
}
