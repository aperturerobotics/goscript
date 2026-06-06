// Generated file based on issue_120_generic_zero_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/strconv/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export type IntVal = number

export type StringVal = string

export type Pair = number[]

export function IntVal_String(i: IntVal): string {
	return strconv.Itoa($.int(i))
}

export function StringVal_String(s: StringVal): string {
	return s
}

export function ZeroValue(__typeArgs: $.GenericTypeArgs | undefined): any {
	let zero: any = $.genericZero(__typeArgs, "T", null)
	return zero
}

export function ZeroArrayLiteral(__typeArgs: $.GenericTypeArgs | undefined): any {
	return $.genericZero(__typeArgs, "T", null)
}

export async function CallString(__typeArgs: $.GenericTypeArgs | undefined, v: any): globalThis.Promise<string> {
	return await $.callGenericMethod(__typeArgs, "T", "String", v)
}

export function Sum<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>): any {
	let sum: any = $.genericZero(__typeArgs, "T", null)
	// Note: We can't actually add T values in Go without more constraints
	// This just tests that sum has the right zero value and String() works
	return sum
}

export async function main(): globalThis.Promise<void> {
	// Test 1: Zero value of IntVal should be 0
	let zeroInt = (ZeroValue({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.IntVal" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}) as IntVal)
	$.println("ZeroValue[IntVal]:", IntVal_String(zeroInt))

	// Test 2: Zero value of StringVal should be ""
	let zeroStr = (ZeroValue({T: { type: { kind: $.TypeKind.Basic, name: "string", typeName: "main.StringVal" }, zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}) as StringVal)
	$.println("ZeroValue[StringVal] len:", $.len(StringVal_String(zeroStr)))

	// Test 3: CallString on zero value
	$.println("CallString on zero IntVal:", await CallString({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.IntVal" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, zeroInt))
	$.println("CallString on zero StringVal len:", $.len(await CallString({T: { type: { kind: $.TypeKind.Basic, name: "string", typeName: "main.StringVal" }, zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, zeroStr)))

	// Test 4: Sum returns zero value
	let sumInt = (Sum({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.IntVal" }, zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, null) as IntVal)
	$.println("Sum[IntVal]():", IntVal_String(sumInt))

	let sumStr = (Sum({T: { type: { kind: $.TypeKind.Basic, name: "string", typeName: "main.StringVal" }, zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, null) as StringVal)
	$.println("Sum[StringVal]() len:", $.len(StringVal_String(sumStr)))

	// Test 5: Verify the actual values
	$.println("zeroInt == 0:", zeroInt == 0)
	$.println("zeroStr == \"\":", $.stringEqual(zeroStr, ""))

	// Test 6: T{} returns the instantiated array zero value.
	let zeroPair = (ZeroArrayLiteral({T: { type: "main.Pair", zero: () => Array.from({ length: 2 }, () => 0) }}) as Pair)
	$.println("ZeroArrayLiteral[Pair] len:", $.len(zeroPair))
	$.println("ZeroArrayLiteral[Pair] zero:", (zeroPair[0] == 0) && (zeroPair[1] == 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}
