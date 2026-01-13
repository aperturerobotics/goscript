// Generated file based on issue_120_generic_zero_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

export type IntVal = number;

export function IntVal_String(i: IntVal): string {
	return strconv.Itoa(i)
}


export type StringVal = string;

export function StringVal_String(s: StringVal): string {
	return s
}


export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
  'main.Stringer',
  null, // Zero value for interface is null
  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

// ZeroValue returns the zero value of type T
export function ZeroValue<T extends Stringer>(): T {
	let zero: T = null as any
	return zero
}

// CallString calls the String method on a value of type T
export function CallString<T extends Stringer>(v: T): string {
	return v!.String()
}

// Sum demonstrates zero value + method call in a generic context
export function Sum<T extends Stringer>(...vals: T[]): T {
	// Should be 0 for IntVal, "" for StringVal
	let sum: T = null as any
	// Note: We can't actually add T values in Go without more constraints
	// This just tests that sum has the right zero value and String() works
	return sum
}

export async function main(): Promise<void> {
	// Test 1: Zero value of IntVal should be 0
	let zeroInt = ZeroValue<IntVal>()
	$.println("ZeroValue[IntVal]:", IntVal_String(zeroInt))

	// Test 2: Zero value of StringVal should be ""
	let zeroStr = ZeroValue<StringVal>()
	$.println("ZeroValue[StringVal]:", StringVal_String(zeroStr))

	// Test 3: CallString on zero value
	$.println("CallString on zero IntVal:", CallString(zeroInt))
	$.println("CallString on zero StringVal:", CallString(zeroStr))

	// Test 4: Sum returns zero value
	let sumInt = Sum<IntVal>()
	$.println("Sum[IntVal]():", IntVal_String(sumInt))

	let sumStr = Sum<StringVal>()
	$.println("Sum[StringVal]():", StringVal_String(sumStr))

	// Test 5: Verify the actual values
	$.println("zeroInt == 0:", zeroInt == 0)
	$.println("zeroStr == \"\":", zeroStr == "")
}

