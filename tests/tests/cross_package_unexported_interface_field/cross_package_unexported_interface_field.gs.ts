// Generated file based on cross_package_unexported_interface_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/cross_package_unexported_interface_field/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/cross_package_unexported_interface_field/dep/index.js"

export async function main(): globalThis.Promise<void> {
	let holder = $.markAsStructValue($.cloneStructValue(dep.NewHolder()))
	$.println(await $.pointerValue<any>(holder.Hidden).Ping())
}

if ($.isMainScript(import.meta)) {
	await main()
}
