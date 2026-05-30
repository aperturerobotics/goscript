// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInt = number

export type Doubler = {
	Double(): number
}

$.registerInterfaceType(
	"main.Doubler",
	null,
	[{ name: "Double", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type Stringer = {
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
	return $.namedValueInterfaceValue<Doubler | null>(v, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" })
}

export function sumDoublers(vals: $.Slice<Doubler | null>): number {
	return $.pointerValue<Exclude<Doubler, null>>(vals![0]).Double() + $.pointerValue<Exclude<Doubler, null>>(vals![1]).Double()
}

export function assertDoubler(__typeArgs: $.GenericTypeArgs | undefined, v: Doubler | null): [any, boolean] {
	let [out, ok] = $.typeAssertTuple<any>(v, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [{ name: "Double", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] })
	return [out, ok]
}

export function assertStringer(__typeArgs: $.GenericTypeArgs | undefined, v: Stringer | null): [any, boolean] {
	let [out, ok] = $.typeAssertTuple<any>(v, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] })
	return [out, ok]
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

	let d: Doubler | null = $.namedValueInterfaceValue<Doubler | null>(12, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" })
	$.println("Interface method call:", $.pointerValue<Exclude<Doubler, null>>(d).Double())

	let ret = asDoubler(13)
	$.println("Returned interface call:", $.pointerValue<Exclude<Doubler, null>>(ret).Double())

	let [asserted, ok] = $.typeAssertTuple<MyInt>(ret, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" })
	$.println("Interface assertion:", $.int(asserted), ok)

	let vals: $.Slice<Doubler | null> = null as $.Slice<Doubler | null>
	vals = $.append(vals, $.namedValueInterfaceValue<Doubler | null>(14, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" }), $.namedValueInterfaceValue<Doubler | null>(15, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" }))
	$.println("Interface slice append:", sumDoublers(vals))

	let __goscriptTuple0: any = assertDoubler({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.MyInt" }, zero: () => 0, methods: {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "Double", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] }}, ret)
	let genericAsserted = (__goscriptTuple0[0] as MyInt)
	let genericOK = __goscriptTuple0[1]
	$.println("Generic interface assertion:", $.int(genericAsserted), genericOK)

	let flag: $.VarRef<boolean> = $.varRef(false)
	let stringer: Stringer | null = $.namedValueInterfaceValue<Stringer | null>(newMyBool(true, flag), "*main.MyBool", {String: (receiver: any, ...args: any[]) => (MyBool_String as any)(receiver, ...args)}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool", typeName: "main.MyBool" } })
	$.println("Pointer primitive interface:", $.pointerValue<Exclude<Stringer, null>>(stringer).String(), flag.value)

	let __goscriptTuple1: any = assertStringer({T: { type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool", typeName: "main.MyBool" } }, zero: () => null, methods: {String: (receiver: any, ...args: any[]) => (MyBool_String as any)(receiver, ...args)}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, stringer)
	let genericPointer: $.VarRef<MyBool> | null = (__goscriptTuple1[0] as $.VarRef<MyBool> | null)
	let genericPointerOK = __goscriptTuple1[1]
	$.println("Generic pointer interface assertion:", MyBool_String(genericPointer), genericPointerOK)
}

if ($.isMainScript(import.meta)) {
	await main()
}
