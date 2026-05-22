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

export function MyInt_Double(m: MyInt): number {
	return $.int(m) * 2
}

export function asDoubler(v: MyInt): Doubler | null {
	return $.namedValueInterfaceValue<Doubler | null>(v, "main.MyInt", {Double: MyInt_Double})
}

export async function main(): globalThis.Promise<void> {
	// Test direct method call on type conversion
	let result = MyInt_Double(5)
	$.println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	let fn: (() => number | globalThis.Promise<number>) | null = ((__receiver) => () => MyInt_Double(__receiver))(10)
	$.println("Method ref call:", await fn!())

	let d: Doubler | null = $.namedValueInterfaceValue<Doubler | null>(12, "main.MyInt", {Double: MyInt_Double})
	$.println("Interface method call:", $.pointerValue<Exclude<Doubler, null>>(d).Double())

	let ret = asDoubler(13)
	$.println("Returned interface call:", $.pointerValue<Exclude<Doubler, null>>(ret).Double())

	let [asserted, ok] = $.typeAssertTuple<MyInt>(ret, "main.MyInt")
	$.println("Interface assertion:", $.int(asserted), ok)
}


if ($.isMainScript(import.meta)) {
	await main()
}
