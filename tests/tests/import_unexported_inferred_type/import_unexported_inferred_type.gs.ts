// Generated file based on import_unexported_inferred_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/import_unexported_inferred_type/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/import_unexported_inferred_type/dep/index.js"

export let closed: any = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(dep.ErrClosed)))

export function __goscript_set_closed(__goscriptValue: any): void {
	closed = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	$.println($.markAsStructValue($.cloneStructValue(closed)).Error())
}

if ($.isMainScript(import.meta)) {
	await main()
}
