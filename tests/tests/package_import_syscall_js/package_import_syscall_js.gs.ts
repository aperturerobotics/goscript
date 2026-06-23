// Generated file based on package_import_syscall_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as js from "@goscript/syscall/js/index.js"
import "@goscript/syscall/js/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let global = $.markAsStructValue($.cloneStructValue(js.Global()))
	$.markAsStructValue($.cloneStructValue(global)).Set("__GOSCRIPT_JS_TEST__", $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(js.ValueOf($.interfaceValue<any>(new globalThis.Map<string, any>([["name", "goscript"], ["nums", $.interfaceValue<any>($.arrayToSlice<any>([$.namedValueInterfaceValue<any>(1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(2, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(3, "int", {}, { kind: $.TypeKind.Basic, name: "int" })]), "[]any")]]), "map[string]any")))), "js.Value"))
	let obj = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(global)).Get("__GOSCRIPT_JS_TEST__")))
	$.println("type:", js.Type_String($.markAsStructValue($.cloneStructValue(obj)).Type()))
	$.println("name:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(obj)).Get("name"))).String())
	$.println("length:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(obj)).Get("nums"))).Length())

	let cb = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		return $.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int() + 1, "int", {}, { kind: $.TypeKind.Basic, name: "int" })
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", { kind: $.TypeKind.Slice, elemType: "js.Value" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(cb)).Release() })
	$.println("callback:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(cb)).Invoke($.namedValueInterfaceValue<any>(41, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))).Int())

	let bytes = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(global)).Get("Uint8Array"))).New($.namedValueInterfaceValue<any>(3, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(0, $.namedValueInterfaceValue<any>(65, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(1, $.namedValueInterfaceValue<any>(66, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(2, $.namedValueInterfaceValue<any>(67, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	let dst: $.Slice<number> = $.makeSlice<number>(3, undefined, "byte")
	js.CopyBytesToGo(dst, $.markAsStructValue($.cloneStructValue(bytes)))
	$.println("bytes:", $.bytesToString(dst))
}

if ($.isMainScript(import.meta)) {
	await main()
}
