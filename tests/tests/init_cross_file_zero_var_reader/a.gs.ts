// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as __goscript_c from "./c.gs.ts"
import "@goscript/reflect/index.js"
import "./c.gs.ts"

export var table: $.Slice<number>

export function __goscript_init_table(): void {
	if (((table) as any) === undefined) {
		table = null as $.Slice<number>
	}
}

export function __goscript_get_table(): $.Slice<number> {
	if (((table) as any) === undefined) {
		__goscript_init_table()
	}
	return table
}

export function __goscript_set_table(__goscriptValue: $.Slice<number>): void {
	table = __goscriptValue
}

export var remoteCounter: number

export function __goscript_init_remoteCounter(): void {
	if (((remoteCounter) as any) === undefined) {
		remoteCounter = 0
	}
}

export function __goscript_get_remoteCounter(): number {
	if (((remoteCounter) as any) === undefined) {
		__goscript_init_remoteCounter()
	}
	return remoteCounter
}

export function __goscript_set_remoteCounter(__goscriptValue: number): void {
	remoteCounter = __goscriptValue
}

export var stringType: reflect.Type | null

export function __goscript_init_stringType(): void {
	if (((stringType) as any) === undefined) {
		stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	}
}

export function __goscript_get_stringType(): reflect.Type | null {
	if (((stringType) as any) === undefined) {
		__goscript_init_stringType()
	}
	return stringType
}

export function __goscript_set_stringType(__goscriptValue: reflect.Type | null): void {
	stringType = __goscriptValue
}
