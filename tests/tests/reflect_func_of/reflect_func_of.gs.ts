// Generated file based on reflect_func_of.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	let intType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	let sliceStringType = reflect.SliceOf($.pointerValueOrNil(stringType)!)

	let fnType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([intType]), $.arrayToSlice<reflect.Type | null>([stringType]), false)
	$.println("func:", $.pointerValue<Exclude<reflect.Type, null>>(fnType).String(), $.pointerValue<Exclude<reflect.Type, null>>(fnType).Kind() == reflect.Func, $.pointerValue<Exclude<reflect.Type, null>>(fnType).NumIn(), $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(fnType).In(0)).String(), $.pointerValue<Exclude<reflect.Type, null>>(fnType).NumOut(), $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(fnType).Out(0)).String(), $.pointerValue<Exclude<reflect.Type, null>>(fnType).IsVariadic())

	let variadicType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([sliceStringType]), $.arrayToSlice<reflect.Type | null>([intType]), true)
	$.println("variadic:", $.pointerValue<Exclude<reflect.Type, null>>(variadicType).String(), $.pointerValue<Exclude<reflect.Type, null>>(variadicType).NumIn(), $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(variadicType).In(0)).String(), $.pointerValue<Exclude<reflect.Type, null>>(variadicType).NumOut(), $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(variadicType).Out(0)).String(), $.pointerValue<Exclude<reflect.Type, null>>(variadicType).IsVariadic())

	$.println("reflect_func_of test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
