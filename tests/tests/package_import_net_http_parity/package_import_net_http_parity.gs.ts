// Generated file based on package_import_net_http_parity.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/bytes/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let h: http.Header = new globalThis.Map<string, $.Slice<string>>([])
	http.Header_Set(h, "content-type", "text/plain")
	http.Header_Add(h, "content-type", "charset=utf-8")
	$.println("header:", http.CanonicalHeaderKey("x-test"), await http.Header_Get(h, "CONTENT-TYPE"), $.len(http.Header_Values(h, "content-type")))

	let [major, minor, ok] = http.ParseHTTPVersion("HTTP/2.0")
	$.println("proto:", major, minor, ok)
	$.println("status:", http.MethodPatch, http.StatusNetworkAuthenticationRequired, http.StatusText(http.StatusNetworkAuthenticationRequired))

	let __goscriptTuple0: any = http.NewRequest(http.MethodPut, "https://example.invalid/path?q=1", $.interfaceValue<io.Reader | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(http.NoBody))), "http.noBody"))
	let req: http.Request | $.VarRef<http.Request> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("request error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	http.Header_Set($.pointerValue<http.Request>(req).Header, "Cookie", "space=wave")
	$.println("request:", $.pointerValue<http.Request>(req).Method, $.pointerValue<any>($.pointerValue<http.Request>(req).URL).Path, http.Request.prototype.ProtoAtLeast.call($.pointerValue<http.Request>(req), 1, 1), $.len(http.Request.prototype.Cookies.call($.pointerValue<http.Request>(req))))

	let rec: httptest.ResponseRecorder | $.VarRef<httptest.ResponseRecorder> | null = httptest.NewRecorder()
	http.Error($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder"))!, http.ProtocolError.prototype.Error.call($.pointerValue<http.ProtocolError>(http.ErrNotSupported)), http.StatusForbidden)
	$.println("recorder:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, bytes.Buffer.prototype.String.call($.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body)))

	rec = httptest.NewRecorder()
	await http.ServeContent($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder"))!, req, "content.txt", $.markAsStructValue(new time.Time()), $.pointerValueOrNil($.interfaceValue<io.ReadSeeker | null>(strings.NewReader("served"), "*strings.Reader"))!)
	$.println("servecontent:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, bytes.Buffer.prototype.String.call($.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body)))

	let __goscriptTuple1: any = http.NewRequest(http.MethodHead, "https://example.invalid/content.txt", $.interfaceValue<io.Reader | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(http.NoBody))), "http.noBody"))
	let headReq: http.Request | $.VarRef<http.Request> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		$.println("head request error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	rec = httptest.NewRecorder()
	await http.ServeContent($.pointerValueOrNil($.interfaceValue<http.ResponseWriter | null>(rec, "*httptest.ResponseRecorder"))!, headReq, "content.txt", $.markAsStructValue(new time.Time()), $.pointerValueOrNil($.interfaceValue<io.ReadSeeker | null>(strings.NewReader("hidden"), "*strings.Reader"))!)
	$.println("servecontent head:", $.pointerValue<httptest.ResponseRecorder>(rec).Code, bytes.Buffer.prototype.Len.call($.pointerValue<bytes.Buffer>($.pointerValue<httptest.ResponseRecorder>(rec).Body)))

	let srv: httptest.Server | $.VarRef<httptest.Server> | null = httptest.NewTLSServer($.pointerValueOrNil(http.NotFoundHandler())!)
	__defer.defer(() => { httptest.Server.prototype.Close.call($.pointerValue<httptest.Server>(srv)) })
	$.println("server:", !$.stringEqual($.pointerValue<httptest.Server>(srv).URL, ""), httptest.Server.prototype.Client.call($.pointerValue<httptest.Server>(srv)) != null, httptest.DefaultRemoteAddr)
}

if ($.isMainScript(import.meta)) {
	await main()
}
