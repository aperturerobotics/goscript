// Generated file based on simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	$.println("Hello world!")
}


if ($.isMainScript(import.meta)) {
	await main()
}
