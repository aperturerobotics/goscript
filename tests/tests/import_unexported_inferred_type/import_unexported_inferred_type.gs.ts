// Generated file based on import_unexported_inferred_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_unexported_inferred_type/dep/index.js"

export let closed: any = $.markAsStructValue((dep.ErrClosed).clone())

export async function main(): Promise<void> {
	$.println($.markAsStructValue((closed).clone()).Error())
}


if ($.isMainScript(import.meta)) {
	await main()
}
