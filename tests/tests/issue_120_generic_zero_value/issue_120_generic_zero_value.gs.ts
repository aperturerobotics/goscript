// Generated file based on issue_120_generic_zero_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as strconv from "@goscript/strconv/index.ts"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type IntVal = number

export function IntVal_String(i: IntVal): string {
	return strconv.Itoa($.int(i))
}

export type StringVal = string

export function StringVal_String(s: StringVal): string {
	return s
}

export function ZeroValue(__typeArgs: $.GenericTypeArgs | undefined): any {
	let zero: any = $.genericZero(__typeArgs, "T", null)
	return zero
}

export function CallString(__typeArgs: $.GenericTypeArgs | undefined, v: any): string {
	return $.callGenericMethod(__typeArgs, "T", "String", v)
}

export function Sum(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<any>): any {
	let sum: any = $.genericZero(__typeArgs, "T", null)
	return sum
}

export async function main(): Promise<void> {
	let zeroInt = ZeroValue({T: { type: "main.IntVal", zero: () => 0, methods: {String: IntVal_String} }})
	$.println("ZeroValue[IntVal]:", IntVal_String(zeroInt))
	let zeroStr = ZeroValue({T: { type: "main.StringVal", zero: () => "", methods: {String: StringVal_String} }})
	$.println("ZeroValue[StringVal] len:", $.len(StringVal_String(zeroStr)))
	$.println("CallString on zero IntVal:", CallString({T: { type: "main.IntVal", zero: () => 0, methods: {String: IntVal_String} }}, zeroInt))
	$.println("CallString on zero StringVal len:", $.len(CallString({T: { type: "main.StringVal", zero: () => "", methods: {String: StringVal_String} }}, zeroStr)))
	let sumInt = Sum({T: { type: "main.IntVal", zero: () => 0, methods: {String: IntVal_String} }}, null)
	$.println("Sum[IntVal]():", IntVal_String(sumInt))
	let sumStr = Sum({T: { type: "main.StringVal", zero: () => "", methods: {String: StringVal_String} }}, null)
	$.println("Sum[StringVal]() len:", $.len(StringVal_String(sumStr)))
	$.println("zeroInt == 0:", zeroInt == 0)
	$.println("zeroStr == \"\":", zeroStr == "")
}


if ($.isMainScript(import.meta)) {
	await main()
}
