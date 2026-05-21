// Generated file based on package_import_net_http_httptest.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as mime from "@goscript/mime/index.js"

import * as http from "@goscript/net/http/index.js"

import * as httptest from "@goscript/net/http/httptest/index.js"

export function setAttachment(w: http.ResponseWriter | null, name: string): void {
	http.Header_Set($.pointerValue(w).Header(), "Content-Disposition", mime.FormatMediaType("attachment", new Map<string, string>([["filename", name]])))
}

export async function main(): Promise<void> {
	let w = httptest.NewRecorder()
	http.Header_Set($.pointerValue<httptest.ResponseRecorder>(w).Header(), "X-Test", "ok")
	$.println(http.Header_Get($.pointerValue<httptest.ResponseRecorder>(w).Header(), "X-Test"))

	setAttachment($.interfaceValue<http.ResponseWriter | null>(w, "*httptest.ResponseRecorder"), "hello.txt")
	$.println(http.Header_Get($.pointerValue<httptest.ResponseRecorder>(w).Header(), "Content-Disposition"))
}


if ($.isMainScript(import.meta)) {
	await main()
}
