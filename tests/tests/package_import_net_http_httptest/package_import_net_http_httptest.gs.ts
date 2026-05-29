// Generated file based on package_import_net_http_httptest.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as mime from "@goscript/mime/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"
import "@goscript/mime/index.js"
import "@goscript/net/http/index.js"
import "@goscript/net/http/httptest/index.js"

export function setAttachment(w: http.ResponseWriter | null, name: string): void {
	http.Header_Set($.pointerValue<Exclude<http.ResponseWriter, null>>(w).Header(), "Content-Disposition", mime.FormatMediaType("attachment", new Map<string, string>([["filename", name]])))
}

export async function main(): globalThis.Promise<void> {
	let w: httptest.ResponseRecorder | $.VarRef<httptest.ResponseRecorder> | null = httptest.NewRecorder()
	http.Header_Set(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(w)), "X-Test", "ok")
	$.println(await http.Header_Get(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(w)), "X-Test"))

	setAttachment($.interfaceValue<http.ResponseWriter | null>(w, "*httptest.ResponseRecorder"), "hello.txt")
	$.println(await http.Header_Get(httptest.ResponseRecorder.prototype.Header.call($.pointerValue<httptest.ResponseRecorder>(w)), "Content-Disposition"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
