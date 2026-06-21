// Generated file based on package_import_dot_qualified.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_dot_qualified/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_dot_qualified/dep/index.js"

export async function main(): globalThis.Promise<void> {
	let box = $.markAsStructValue($.cloneStructValue(dep.NewBox(3)))
	$.println(dep.Double(dep.Value), box.N)
}

if ($.isMainScript(import.meta)) {
	await main()
}
