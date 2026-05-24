// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInt = number

export type Doubler = null | {
	Double(): number
}

$.registerInterfaceType(
	"main.Doubler",
	null,
	[{ name: "Double", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type MyBool = boolean

export function MyInt_Double(m: MyInt): number {
	return $.int(m) * 2
}

export function MyBool_String(b: $.VarRef<MyBool> | null): string {
	if ($.pointerValue<MyBool>(b)) {
		return "true"
	}
	return "false"
}

export function asDoubler(v: MyInt): Doubler | null {
	return $.namedValueInterfaceValue<Doubler | null>(v, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)($.pointerValue(receiver), ...args)})
}

export function newMyBool(value: boolean, target: $.VarRef<boolean> | null): $.VarRef<MyBool> | null {
	target!.value = value
	return target
}

export async function main(): globalThis.Promise<void> {
	// Test direct method call on type conversion
	let result = MyInt_Double(5)
	$.println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	let fn: (() => number | globalThis.Promise<number>) | null = ((__receiver) => () => MyInt_Double(__receiver))(10)
	$.println("Method ref call:", await fn!())

	let d: Doubler | null = $.namedValueInterfaceValue<Doubler | null>(12, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)($.pointerValue(receiver), ...args)})
	$.println("Interface method call:", $.pointerValue<Exclude<Doubler, null>>(d).Double())

	let ret = asDoubler(13)
	$.println("Returned interface call:", $.pointerValue<Exclude<Doubler, null>>(ret).Double())

	let [asserted, ok] = $.typeAssertTuple<MyInt>(ret, "main.MyInt")
	$.println("Interface assertion:", $.int(asserted), ok)

	let flag: $.VarRef<boolean> = $.varRef(false)
	let stringer: Stringer | null = $.namedValueInterfaceValue<Stringer | null>(newMyBool(true, flag), "*main.MyBool", {String: (receiver: any, ...args: any[]) => (MyBool_String as any)(receiver, ...args)})
	$.println("Pointer primitive interface:", $.pointerValue<Exclude<Stringer, null>>(stringer).String(), flag.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
