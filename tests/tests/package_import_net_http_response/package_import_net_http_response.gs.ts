// Generated file based on package_import_net_http_response.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"
import "@goscript/net/http/index.js"

export async function main(): globalThis.Promise<void> {
	let resp = $.markAsStructValue(new http.Response({StatusCode: http.StatusOK}))

	$.println("status:", resp.StatusCode, http.StatusText(resp.StatusCode))
}

if ($.isMainScript(import.meta)) {
	await main()
}
