// Generated file based on function_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Greeter = ((name: string) => string | globalThis.Promise<string>) | null

export type Adder = ((a: number, b: number) => number | globalThis.Promise<number>) | null

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
			myFunc: $.varRef(init?.myFunc ?? (null as unknown as any))
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
		() => new FuncContainer(),
		[],
		FuncContainer,
		[{ name: "myFunc", key: "myFunc", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function greet(name: string): string {
	return "Hello, " + name
}

export function add(a: number, b: number): number {
	return a + b
}

export function getGreeter(): any {
	return $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")
}

export function getAdder(): any {
	return $.interfaceValue<any>($.namedFunction(add, "main.Adder", ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "main.Adder")
}

export async function main(): globalThis.Promise<void> {
	// 1. Simple function type assertion
	let i: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")
	let [fn, ok] = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(i, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	if (ok) {
		$.println(await fn!("World"))
	} else {
		$.println("Simple assertion failed")
	}

	let j: any = $.interfaceValue<any>($.namedFunction(add, "main.Adder", ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "main.Adder")
	let __goscriptTuple0: any = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>(j, ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let addFn = __goscriptTuple0[0]
	ok = __goscriptTuple0[1]
	if (ok) {
		$.println(await addFn!(5, 3))
	} else {
		$.println("Simple adder assertion failed")
	}

	// 2. Type assertion of a function returned from another function
	let returnedFn = getGreeter()
	let __goscriptTuple1: any = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(returnedFn, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	let greetFn = __goscriptTuple1[0]
	ok = __goscriptTuple1[1]
	if (ok) {
		$.println(await greetFn!("Gopher"))
	} else {
		$.println("Returned function assertion failed")
	}

	let returnedAdder = getAdder()
	let __goscriptTuple2: any = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>(returnedAdder, ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let addFnFromFunc = __goscriptTuple2[0]
	ok = __goscriptTuple2[1]
	if (ok) {
		$.println(await addFnFromFunc!(10, 20))
	} else {
		$.println("Returned adder assertion failed")
	}

	// 3. Type assertion of a function in a struct field
	let container = $.markAsStructValue(new FuncContainer({myFunc: $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")}))
	let __goscriptTuple3: any = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(container.myFunc, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	let structFn = __goscriptTuple3[0]
	ok = __goscriptTuple3[1]
	if (ok) {
		$.println(await structFn!("Struct"))
	} else {
		$.println("Struct function assertion failed")
	}

	let adderContainer = $.markAsStructValue(new FuncContainer({myFunc: $.interfaceValue<any>($.namedFunction(add, "main.Adder", ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "main.Adder")}))
	let __goscriptTuple4: any = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>(adderContainer.myFunc, ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let structAdderFn = __goscriptTuple4[0]
	ok = __goscriptTuple4[1]
	if (ok) {
		$.println(await structAdderFn!(7, 8))
	} else {
		$.println("Struct adder assertion failed")
	}

	// 4. Type assertion of a function in a map
	let funcMap: globalThis.Map<string, any> | null = $.makeMap<string, any>()
	$.mapSet(funcMap, "greeter", $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter"))
	$.mapSet(funcMap, "adder", $.interfaceValue<any>($.namedFunction(add, "main.Adder", ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "main.Adder"))

	let __goscriptTuple5: any = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>($.mapGet<string, any, any>(funcMap, "greeter", null)[0], ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	let mapFn = __goscriptTuple5[0]
	ok = __goscriptTuple5[1]
	if (ok) {
		$.println(await mapFn!("Map"))
	} else {
		$.println("Map function assertion failed")
	}

	let __goscriptTuple6: any = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>($.mapGet<string, any, any>(funcMap, "adder", null)[0], ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let mapAdderFn = __goscriptTuple6[0]
	ok = __goscriptTuple6[1]
	if (ok) {
		$.println(await mapAdderFn!(1, 2))
	} else {
		$.println("Map adder assertion failed")
	}

	// 5. Type assertion of a function in a slice
	let funcSlice: $.Slice<any> = $.makeSlice<any>(2)
	funcSlice![0] = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")
	funcSlice![1] = $.interfaceValue<any>($.namedFunction(add, "main.Adder", ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)), "main.Adder")

	let __goscriptTuple7: any = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>($.arrayIndex(funcSlice!, 0), ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	let sliceFn = __goscriptTuple7[0]
	ok = __goscriptTuple7[1]
	if (ok) {
		$.println(await sliceFn!("Slice"))
	} else {
		$.println("Slice function assertion failed")
	}
	let __goscriptTuple8: any = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>($.arrayIndex(funcSlice!, 1), ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let sliceAdderFn = __goscriptTuple8[0]
	ok = __goscriptTuple8[1]
	if (ok) {
		$.println(await sliceAdderFn!(9, 9))
	} else {
		$.println("Slice adder assertion failed")
	}

	// 6. Type assertion with ok variable (successful and failing)
	let k: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")
	let [, ok1] = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(k, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	$.println(ok1)

	let [, ok2] = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>(k, ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	$.println(ok2)

	let l: any = "not a function"
	let [, ok3] = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(l, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	$.println(ok3)

	// 7. Type assertion that should panic (commented out for now to allow test to run)
	// defer func() {
	// 	if r := recover(); r != nil {
	// 		println("Panic caught as expected")
	// 	}
	// }()
	// var m interface{} = "definitely not a func"
	// _ = m.(Greeter) // This would panic
	// println("This line should not be reached if panic test is active")

	// Test with nil interface
	let nilInterface: any = null as any
	let [nilFn, okNil] = $.typeAssertTuple<((name: string) => string | globalThis.Promise<string>) | null>(nilInterface, ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	if (!okNil && (nilFn == null)) {
		$.println("Nil interface assertion correct")
	} else {
		$.println("Nil interface assertion failed")
	}

	// Test assertion to wrong function type
	let wrongFnInterface: any = $.interfaceValue<any>($.namedFunction(greet, "main.Greeter", ({ kind: $.TypeKind.Function, name: "main.Greeter", params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo)), "main.Greeter")
	let [wrongFn, okWrong] = $.typeAssertTuple<((a: number, b: number) => number | globalThis.Promise<number>) | null>(wrongFnInterface, ({ kind: $.TypeKind.Function, name: "main.Adder", params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	if (!okWrong && (wrongFn == null)) {
		$.println("Wrong function type assertion correct")
	} else {
		$.println("Wrong function type assertion failed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
