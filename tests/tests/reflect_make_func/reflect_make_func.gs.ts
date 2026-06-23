// Generated file based on reflect_make_func.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	let intType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	let boolType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }})

	let unaryType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([intType]), $.arrayToSlice<reflect.Type | null>([stringType]), false)
	let unaryValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(unaryType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf("value-" + String.fromCodePoint($.int($.int64Add(48, $.markAsStructValue($.cloneStructValue(args![0])).Int()), 32)))))])
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }], results: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }] } as $.FunctionTypeInfo)))))
	let unary: ((_p0: number) => string | globalThis.Promise<string>) | null = $.mustTypeAssert<((_p0: number) => string | globalThis.Promise<string>) | null>($.markAsStructValue($.cloneStructValue(unaryValue)).Interface(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	$.println("direct:", await unary!(7))
	let reflectedUnary: $.Slice<reflect.Value> = await $.markAsStructValue($.cloneStructValue(unaryValue)).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>(8, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))))]))
	$.println("reflected:", $.markAsStructValue($.cloneStructValue(reflectedUnary![0])).String())
	let [, wrong] = $.typeAssertTuple<((_p0: string) => string | globalThis.Promise<string>) | null>($.markAsStructValue($.cloneStructValue(unaryValue)).Interface(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))
	$.println("wrong assertion:", wrong)

	let zeroType = reflect.FuncOf(null, null, false)
	let zeroCalled = false
	let zeroValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(zeroType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		zeroCalled = true
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }], results: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }] } as $.FunctionTypeInfo)))))
	await $.mustTypeAssert<(() => void) | null>($.markAsStructValue($.cloneStructValue(zeroValue)).Interface(), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))!()
	$.println("zero:", zeroCalled)

	let tupleType = reflect.FuncOf(null, $.arrayToSlice<reflect.Type | null>([intType, boolType]), false)
	let tupleValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(tupleType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>(3, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf(true)))])
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }], results: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }] } as $.FunctionTypeInfo)))))
	let tuple: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = $.mustTypeAssert<(() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null>($.markAsStructValue($.cloneStructValue(tupleValue)).Interface(), ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))
	let [_number, ok] = await tuple!()
	$.println("tuple direct:", _number, ok)
	let reflectedTuple: $.Slice<reflect.Value> = await $.markAsStructValue($.cloneStructValue(tupleValue)).Call(null)
	$.println("tuple reflected:", $.markAsStructValue($.cloneStructValue(reflectedTuple![0])).Int(), $.markAsStructValue($.cloneStructValue(reflectedTuple![1])).Bool())

	let variadicType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([intType, reflect.SliceOf($.pointerValueOrNil(stringType)!)]), $.arrayToSlice<reflect.Type | null>([intType]), true)
	let variadicValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(variadicType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>($.int($.markAsStructValue($.cloneStructValue(args![0])).Int()) + $.markAsStructValue($.cloneStructValue(args![1])).Len(), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))))])
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }], results: [{ kind: $.TypeKind.Slice, elemType: "reflect.Value" }] } as $.FunctionTypeInfo)))))
	let variadic: ((_p0: number, _p1: $.Slice<string>) => number | globalThis.Promise<number>) | null = $.mustTypeAssert<((_p0: number, _p1: $.Slice<string>) => number | globalThis.Promise<number>) | null>($.markAsStructValue($.cloneStructValue(variadicValue)).Interface(), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }], results: [{ kind: $.TypeKind.Basic, name: "int" }], isVariadic: true } as $.FunctionTypeInfo))
	$.println("variadic direct:", await variadic!(10, $.arrayToSlice<string>(["a", "b"])))
	let reflectedVariadic: $.Slice<reflect.Value> = await $.markAsStructValue($.cloneStructValue(variadicValue)).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>(20, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("a"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("b"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("c")))]))
	$.println("variadic reflected:", $.markAsStructValue($.cloneStructValue(reflectedVariadic![0])).Int())
	let reflectedSlice: $.Slice<reflect.Value> = await $.markAsStructValue($.cloneStructValue(variadicValue)).CallSlice($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>(30, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>($.arrayToSlice<string>(["a", "b"]), "[]string"))))]))
	$.println("variadic callslice:", $.markAsStructValue($.cloneStructValue(reflectedSlice![0])).Int())

	$.println("reflect_make_func test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
