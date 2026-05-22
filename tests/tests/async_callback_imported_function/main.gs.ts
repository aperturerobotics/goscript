// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/async_callback_imported_function/subpkg/index.js"

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 7)

	await subpkg.Run("async callback", $.functionValue(async (): globalThis.Promise<$.GoError> => {
		$.println("value:", await $.chanRecv(ch))
		return null
	}, { kind: $.TypeKind.Function, params: [], results: ["error"] }))
}


if ($.isMainScript(import.meta)) {
	await main()
}
