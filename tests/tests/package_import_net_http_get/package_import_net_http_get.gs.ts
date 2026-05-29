// Generated file based on package_import_net_http_get.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"
import "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let server: httptest.Server | $.VarRef<httptest.Server> | null = httptest.NewServer($.pointerValueOrNil($.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue((w: http.ResponseWriter | null, _p1: http.Request | $.VarRef<http.Request> | null): void => {
		$.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write(new Uint8Array([111, 107]))
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", { kind: $.TypeKind.Pointer, elemType: "http.Request" }], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc"), "http.HandlerFunc", {ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", { kind: $.TypeKind.Pointer, elemType: "http.Request" }], results: [] } as $.FunctionTypeInfo)))!)
	__defer.defer(() => { httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(server)) })

	let __goscriptTuple0: any = await http.Get($.pointerValue<httptest.Server>(server).URL)
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("get error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(resp).Body).Close() })

	let __goscriptTuple1: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(resp).Body as io.Reader | null))!)
	let data: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		$.println("read error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("get status:", $.pointerValue<http.Response>(resp).StatusCode)
	$.println("get body:", $.bytesToString(data))
}

if ($.isMainScript(import.meta)) {
	await main()
}
