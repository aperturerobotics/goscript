// Generated file based on expr_stmt_iife_asi.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let _unique = true
	void ((): void => {
		if (_unique) {
			_unique = false
		}
	})()
	$.println(_unique)
}

if ($.isMainScript(import.meta)) {
	await main()
}
