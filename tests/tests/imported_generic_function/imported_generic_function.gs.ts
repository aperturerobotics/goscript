// Generated file based on imported_generic_function.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as helper from "@goscript/github.com/aperturerobotics/goscript/tests/tests/imported_generic_function/helper/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/imported_generic_function/helper/index.js"

export function collectValues(value: helper.Value | null): [$.Slice<helper.Value | null>, $.GoError] {
	const __goscriptReturn0 = helper.Collect({T: { type: "helper.Value", zero: () => null, methods: {GetValue: (receiver: any, ...args: any[]) => receiver.GetValue(...args)} }}, value)
	return [(__goscriptReturn0[0] as $.Slice<helper.Value | null>), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export function collectAssigned(value: helper.Value | null): [$.Slice<helper.Value | null>, $.GoError] {
	let __goscriptTuple0: any = helper.Collect({T: { type: "helper.Value", zero: () => null, methods: {GetValue: (receiver: any, ...args: any[]) => receiver.GetValue(...args)} }}, value)
	let values: $.Slice<helper.Value | null> = (__goscriptTuple0[0] as $.Slice<helper.Value | null>)
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [values, null]
}

export async function main(): globalThis.Promise<void> {
	let box = ($.markAsStructValue($.cloneStructValue(helper.Wrap({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 21))) as helper.Box)
	$.println("wrapped:", box.Value)
	let __goscriptTuple1: any = collectValues($.interfaceValue<helper.Value | null>($.markAsStructValue(new helper.IntValue({N: 34})), "helper.IntValue"))
	let values: $.Slice<helper.Value | null> = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		$.println($.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("collected:", $.pointerValue<Exclude<helper.Value, null>>(values![0]).GetValue())
	let __goscriptTuple2: any = collectAssigned($.interfaceValue<helper.Value | null>($.markAsStructValue(new helper.IntValue({N: 35})), "helper.IntValue"))
	let assigned: $.Slice<helper.Value | null> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		$.println($.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("assigned:", $.pointerValue<Exclude<helper.Value, null>>(assigned![0]).GetValue())
}

if ($.isMainScript(import.meta)) {
	await main()
}
