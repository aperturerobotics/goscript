// Generated file based on primitive_error_cross_file.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_error_type from "./error_type.gs.ts"

export function fail(): $.GoError {
	return $.wrapPrimitiveError(1, __goscript_error_type.remoteError_Error)
}

export async function main(): globalThis.Promise<void> {
	let err = fail()
	if (err != null) {
		$.println($.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
