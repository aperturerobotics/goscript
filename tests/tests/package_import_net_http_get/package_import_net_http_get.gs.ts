// Generated file based on package_import_net_http_get.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let server: httptest.Server | $.VarRef<httptest.Server> | null = httptest.NewServer($.pointerValueOrNil($.namedValueInterfaceValue<http.Handler | null>($.namedFunction($.functionValue(async (w: http.ResponseWriter | null, r: http.Request | $.VarRef<http.Request> | null): globalThis.Promise<void> => {
		let data: $.Slice<number> = null as $.Slice<number>
		if ($.pointerValue<http.Request>(r).Body != null) {
			let readErr: $.GoError = null as $.GoError
			let __goscriptTuple0: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Request>(r).Body as io.Reader | null))!)
			data = __goscriptTuple0[0]
			readErr = __goscriptTuple0[1]
			if (readErr != null) {
				$.pointerValue<Exclude<http.ResponseWriter, null>>(w).WriteHeader(http.StatusInternalServerError)
				{
					let [, writeErr] = $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes("read error: " + $.pointerValue<Exclude<$.GoError, null>>(readErr).Error()))
					if (writeErr != null) {
						return
					}
				}
				return
			}
		}
		if ($.len(data) != 0) {
			{
				let [, writeErr] = $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes(($.pointerValue<http.Request>(r).Method + ":") + $.bytesToString(data)))
				if (writeErr != null) {
					return
				}
			}
			return
		}
		{
			let [, writeErr] = $.pointerValue<Exclude<http.ResponseWriter, null>>(w).Write($.stringToBytes($.pointerValue<http.Request>(r).Method))
			if (writeErr != null) {
				return
			}
		}
	}, ({ kind: $.TypeKind.Function, params: ["http.ResponseWriter", { kind: $.TypeKind.Pointer, elemType: "http.Request" }], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", { kind: $.TypeKind.Pointer, elemType: "http.Request" }], results: [] } as $.FunctionTypeInfo)), "http.HandlerFunc", {ServeHTTP: (receiver: any, ...args: any[]) => (http.HandlerFunc_ServeHTTP as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, ({ kind: $.TypeKind.Function, name: "http.HandlerFunc", params: ["http.ResponseWriter", { kind: $.TypeKind.Pointer, elemType: "http.Request" }], results: [] } as $.FunctionTypeInfo)))!)
	__defer.defer(() => { httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(server)) })

	let __goscriptTuple1: any = await http.Get($.pointerValue<httptest.Server>(server).URL)
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		$.println("get error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(resp).Body).Close() })

	let __goscriptTuple2: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(resp).Body as io.Reader | null))!)
	let data: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		$.println("read error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("get status:", $.pointerValue<http.Response>(resp).StatusCode)
	$.println("get body:", $.bytesToString(data))

	let __goscriptTuple3: any = await http.Client.prototype.Get.call($.pointerValue<http.Client>(httptest.Server.prototype.Client.call($.pointerValue<httptest.Server>(server))), $.pointerValue<httptest.Server>(server).URL)
	let clientResp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		$.println("client get error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(clientResp).Body).Close() })

	let __goscriptTuple4: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(clientResp).Body as io.Reader | null))!)
	data = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		$.println("client get read error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("client get status:", $.pointerValue<http.Response>(clientResp).StatusCode)
	$.println("client get body:", $.bytesToString(data))

	let __goscriptTuple5: any = await http.Client.prototype.Head.call($.pointerValue<http.Client>(httptest.Server.prototype.Client.call($.pointerValue<httptest.Server>(server))), $.pointerValue<httptest.Server>(server).URL)
	let headResp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		$.println("head error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(headResp).Body).Close() })
	$.println("head status:", $.pointerValue<http.Response>(headResp).StatusCode)

	let __goscriptTuple6: any = await http.Client.prototype.Post.call($.pointerValue<http.Client>(httptest.Server.prototype.Client.call($.pointerValue<httptest.Server>(server))), $.pointerValue<httptest.Server>(server).URL, "text/plain", $.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("payload"), "*strings.Reader"))!)
	let postResp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	if (err != null) {
		$.println("post error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(postResp).Body).Close() })

	let __goscriptTuple7: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(postResp).Body as io.Reader | null))!)
	data = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	if (err != null) {
		$.println("post read error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("post status:", $.pointerValue<http.Response>(postResp).StatusCode)
	$.println("post body:", $.bytesToString(data))

	let __goscriptTuple8: any = http.NewRequest(http.MethodGet, $.pointerValue<httptest.Server>(server).URL, null)
	let transportReq: http.Request | $.VarRef<http.Request> | null = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		$.println("transport request error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let __goscriptTuple9: any = await http.Transport.prototype.RoundTrip.call($.pointerValue<http.Transport>((new http.Transport())), transportReq)
	let transportResp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		$.println("transport error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	__defer.defer(() => { $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<http.Response>(transportResp).Body).Close() })
	let __goscriptTuple10: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(transportResp).Body as io.Reader | null))!)
	data = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		$.println("transport read error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("transport status:", $.pointerValue<http.Response>(transportResp).StatusCode)
	$.println("transport body:", $.bytesToString(data))
}

if ($.isMainScript(import.meta)) {
	await main()
}
