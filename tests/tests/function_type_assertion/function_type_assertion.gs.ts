// Generated file based on function_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Greeter = ((name: string) => string) | null

export type Adder = ((a: number, b: number) => number) | null

export function greet(name: string): string {
	return "Hello, " + name
}

export function add(a: number, b: number): number {
	return a + b
}

export function getGreeter(): any {
	return $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")
}

export function getAdder(): any {
	return $.interfaceValue<any>($.namedFunction(add, "main.Adder"), "main.Adder")
}

export class FuncContainer {
	public get myFunc(): any {
		return this._fields.myFunc.value
	}
	public set myFunc(value: any) {
		this._fields.myFunc.value = value
	}

	public _fields: {
		myFunc: $.VarRef<any>
	}

	constructor(init?: Partial<{myFunc?: any}>) {
		this._fields = {
			myFunc: $.varRef(init?.myFunc ?? null)
		}
	}

	public clone(): FuncContainer {
		const cloned = new FuncContainer()
		cloned._fields = {
			myFunc: $.varRef(this._fields.myFunc.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.FuncContainer",
		new FuncContainer(),
		[],
		FuncContainer,
		{"myFunc": { kind: $.TypeKind.Interface, methods: [] }}
	)
}

export async function main(): Promise<void> {
	let i: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")
	let [fn, ok] = $.typeAssertTuple<Greeter>(i, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	if (ok) {
		$.println(fn!("World"))
	} else {
		$.println("Simple assertion failed")
	}
	let j: any = $.interfaceValue<any>($.namedFunction(add, "main.Adder"), "main.Adder")
	let __goscriptTuple538 = $.typeAssertTuple<Adder>(j, { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let addFn = __goscriptTuple538[0]
	ok = __goscriptTuple538[1]
	if (ok) {
		$.println(addFn!(5, 3))
	} else {
		$.println("Simple adder assertion failed")
	}
	let returnedFn = getGreeter()
	let __goscriptTuple746 = $.typeAssertTuple<Greeter>(returnedFn, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let greetFn = __goscriptTuple746[0]
	ok = __goscriptTuple746[1]
	if (ok) {
		$.println(greetFn!("Gopher"))
	} else {
		$.println("Returned function assertion failed")
	}
	let returnedAdder = getAdder()
	let __goscriptTuple912 = $.typeAssertTuple<Adder>(returnedAdder, { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let addFnFromFunc = __goscriptTuple912[0]
	ok = __goscriptTuple912[1]
	if (ok) {
		$.println(addFnFromFunc!(10, 20))
	} else {
		$.println("Returned adder assertion failed")
	}
	let container = $.markAsStructValue(new FuncContainer({myFunc: $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")}))
	let __goscriptTuple1163 = $.typeAssertTuple<Greeter>(container.myFunc, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let structFn = __goscriptTuple1163[0]
	ok = __goscriptTuple1163[1]
	if (ok) {
		$.println(structFn!("Struct"))
	} else {
		$.println("Struct function assertion failed")
	}
	let adderContainer = $.markAsStructValue(new FuncContainer({myFunc: $.interfaceValue<any>($.namedFunction(add, "main.Adder"), "main.Adder")}))
	let __goscriptTuple1359 = $.typeAssertTuple<Adder>(adderContainer.myFunc, { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let structAdderFn = __goscriptTuple1359[0]
	ok = __goscriptTuple1359[1]
	if (ok) {
		$.println(structAdderFn!(7, 8))
	} else {
		$.println("Struct adder assertion failed")
	}
	let funcMap = $.makeMap<string, any>()
	$.mapSet(funcMap, "greeter", $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter"))
	$.mapSet(funcMap, "adder", $.interfaceValue<any>($.namedFunction(add, "main.Adder"), "main.Adder"))
	let __goscriptTuple1655 = $.typeAssertTuple<Greeter>($.mapGet(funcMap, "greeter", null)[0], { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let mapFn = __goscriptTuple1655[0]
	ok = __goscriptTuple1655[1]
	if (ok) {
		$.println(mapFn!("Map"))
	} else {
		$.println("Map function assertion failed")
	}
	let __goscriptTuple1788 = $.typeAssertTuple<Adder>($.mapGet(funcMap, "adder", null)[0], { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let mapAdderFn = __goscriptTuple1788[0]
	ok = __goscriptTuple1788[1]
	if (ok) {
		$.println(mapAdderFn!(1, 2))
	} else {
		$.println("Map adder assertion failed")
	}
	let funcSlice = $.makeSlice<any>(2)
	funcSlice![0] = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")
	funcSlice![1] = $.interfaceValue<any>($.namedFunction(add, "main.Adder"), "main.Adder")
	let __goscriptTuple2058 = $.typeAssertTuple<Greeter>(funcSlice![0], { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let sliceFn = __goscriptTuple2058[0]
	ok = __goscriptTuple2058[1]
	if (ok) {
		$.println(sliceFn!("Slice"))
	} else {
		$.println("Slice function assertion failed")
	}
	let __goscriptTuple2192 = $.typeAssertTuple<Adder>(funcSlice![1], { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let sliceAdderFn = __goscriptTuple2192[0]
	ok = __goscriptTuple2192[1]
	if (ok) {
		$.println(sliceAdderFn!(9, 9))
	} else {
		$.println("Slice adder assertion failed")
	}
	let k: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")
	let [, ok1] = $.typeAssertTuple<Greeter>(k, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	$.println(ok1)
	let [, ok2] = $.typeAssertTuple<Adder>(k, { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	$.println(ok2)
	let l: any = "not a function"
	let [, ok3] = $.typeAssertTuple<Greeter>(l, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	$.println(ok3)
	let nilInterface: any = null
	let [nilFn, okNil] = $.typeAssertTuple<Greeter>(nilInterface, { kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	if (!okNil && nilFn == null) {
		$.println("Nil interface assertion correct")
	} else {
		$.println("Nil interface assertion failed")
	}
	let wrongFnInterface: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter"), "main.Greeter")
	let [wrongFn, okWrong] = $.typeAssertTuple<Adder>(wrongFnInterface, { kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	if (!okWrong && wrongFn == null) {
		$.println("Wrong function type assertion correct")
	} else {
		$.println("Wrong function type assertion failed")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
