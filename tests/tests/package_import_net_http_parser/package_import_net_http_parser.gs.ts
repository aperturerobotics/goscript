// Generated file based on package_import_net_http_parser.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as http from "@goscript/net/http/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/bufio/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/net/http/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	let requestWire = ((((("POST /chunk HTTP/1.1\r\n" + "Host: example.com\r\n") + "Transfer-Encoding: chunked\r\n") + "X-Test: one\r\n") + "X-Test: two\r\n") + "\r\n") + "5\r\nhello\r\n0\r\n\r\n"
	let __goscriptTuple0: any = await http.ReadRequest(bufio.NewReader($.interfaceValue<io.Reader | null>(strings.NewReader(requestWire), "*strings.Reader")))
	let req: http.Request | $.VarRef<http.Request> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		fmt.Println("request error:", (err as any))
		return
	}
	let __goscriptTuple1: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Request>(req).Body as io.Reader | null))!)
	let reqBody: $.Slice<number> = __goscriptTuple1[0]
	let reqBodyErr = __goscriptTuple1[1]
	fmt.Printf("request %s %s %s %s %d %d %s %d %d %t %d %q %v\n", $.pointerValue<http.Request>(req).Method, $.pointerValue<http.Request>(req).Host, $.pointerValue<any>($.pointerValue<http.Request>(req).URL).Path, $.pointerValue<any>($.pointerValue<http.Request>(req).URL).RawQuery, $.namedValueInterfaceValue<any>($.pointerValue<http.Request>(req).ProtoMajor, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.pointerValue<http.Request>(req).ProtoMinor, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), http.Request.prototype.UserAgent.call($.pointerValue<http.Request>(req)), $.namedValueInterfaceValue<any>($.len(http.Header_Values($.pointerValue<http.Request>(req).Header, "X-Test")), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.pointerValue<http.Request>(req).ContentLength, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), $.pointerValue<http.Request>(req).Close, $.namedValueInterfaceValue<any>($.len($.pointerValue<http.Request>(req).TransferEncoding), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.bytesToString(reqBody), (reqBodyErr as any))

	let responseWire = ((("HTTP/1.1 201 Created\r\n" + "Content-Type: text/plain\r\n") + "Content-Length: 5\r\n") + "\r\n") + "hello"
	let __goscriptTuple2: any = await http.ReadResponse(bufio.NewReader($.interfaceValue<io.Reader | null>(strings.NewReader(responseWire), "*strings.Reader")), req)
	let resp: http.Response | $.VarRef<http.Response> | null = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		fmt.Println("response error:", (err as any))
		return
	}
	let __goscriptTuple3: any = await io.ReadAll($.pointerValueOrNil(($.pointerValue<http.Response>(resp).Body as io.Reader | null))!)
	let respBody: $.Slice<number> = __goscriptTuple3[0]
	let respBodyErr = __goscriptTuple3[1]
	fmt.Printf("response %s %d %d %d %s %d %t %d %q %v\n", $.pointerValue<http.Response>(resp).Status, $.namedValueInterfaceValue<any>($.pointerValue<http.Response>(resp).StatusCode, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.pointerValue<http.Response>(resp).ProtoMajor, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.pointerValue<http.Response>(resp).ProtoMinor, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), await http.Header_Get($.pointerValue<http.Response>(resp).Header, "Content-Type"), $.namedValueInterfaceValue<any>($.pointerValue<http.Response>(resp).ContentLength, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), $.pointerValue<http.Response>(resp).Close, $.namedValueInterfaceValue<any>($.len($.pointerValue<http.Response>(resp).TransferEncoding), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.bytesToString(respBody), (respBodyErr as any))
}

if ($.isMainScript(import.meta)) {
	await main()
}
