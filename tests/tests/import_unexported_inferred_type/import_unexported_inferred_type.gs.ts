// Generated file based on import_unexported_inferred_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_unexported_inferred_type/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_unexported_inferred_type/dep/index.js"

export let closed: any = $.markAsStructValue($.cloneStructValue(dep.ErrClosed))

export function __goscript_set_closed(value: any): void {
	closed = value
}

export async function main(): globalThis.Promise<void> {
	$.println($.markAsStructValue($.cloneStructValue(closed)).Error())
}

if ($.isMainScript(import.meta)) {
	await main()
}
