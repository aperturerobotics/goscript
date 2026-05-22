// Generated file based on error_pointer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type customErr = string

export function customErr_Error(e: customErr): string {
	return e
}

export function setErr(err: $.VarRef<$.GoError> | null): void {
	err!.value = $.wrapPrimitiveError("pointer error", customErr_Error)
}

export async function main(): Promise<void> {
	let err: $.VarRef<$.GoError> = $.varRef(null)
	setErr(err)
	if (err.value != null) {
		$.println($.pointerValue<Exclude<$.GoError, null>>(err.value).Error())
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
