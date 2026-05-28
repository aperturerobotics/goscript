// Generated file based on interface_comparable_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ref = {
	Key(): any
}

$.registerInterfaceType(
	"main.ref",
	null,
	[{ name: "Key", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
)

export type valueHash = Uint8Array

export function valueHash_Key(h: valueHash): any {
	return $.namedValueInterfaceValue<any>(h, "main.valueHash", {Key: (receiver: any, ...args: any[]) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.valueHash")
}

export function sameKey(a: ref | null, b: ref | null): boolean {
	return $.comparableEqual($.pointerValue<Exclude<ref, null>>(a).Key(), $.pointerValue<Exclude<ref, null>>(b).Key())
}

export function differentKey(a: ref | null, b: ref | null): boolean {
	return !$.comparableEqual($.pointerValue<Exclude<ref, null>>(a).Key(), $.pointerValue<Exclude<ref, null>>(b).Key())
}

export async function main(): globalThis.Promise<void> {
	let a = new Uint8Array([0, $.uint(7, 8), 0, 0])
	let b = new Uint8Array([0, $.uint(7, 8), 0, 0])
	let c = new Uint8Array([0, 0, $.uint(7, 8), 0])

	$.println("same:", sameKey($.namedValueInterfaceValue<ref | null>(a, "main.valueHash", {Key: (receiver: any, ...args: any[]) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.valueHash"), $.namedValueInterfaceValue<ref | null>(b, "main.valueHash", {Key: (receiver: any, ...args: any[]) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.valueHash")))
	$.println("different:", differentKey($.namedValueInterfaceValue<ref | null>(a, "main.valueHash", {Key: (receiver: any, ...args: any[]) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.valueHash"), $.namedValueInterfaceValue<ref | null>(c, "main.valueHash", {Key: (receiver: any, ...args: any[]) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.valueHash")))
}

if ($.isMainScript(import.meta)) {
	await main()
}
