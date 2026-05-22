// Generated file based on function_nil_zero_narrowing.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Cancel = (() => void) | null

export async function main(): globalThis.Promise<void> {
	let cancel1: Cancel = null as Cancel
	let cancel2: Cancel = null as Cancel
	let __goscriptAssign0_0: Cancel = (null as Cancel)
	let __goscriptAssign0_1: Cancel = (null as Cancel)
	cancel1 = __goscriptAssign0_0
	cancel2 = __goscriptAssign0_1
	if (cancel1 != null) {
		await cancel1!()
	}
	if (cancel2 != null) {
		await cancel2!()
	}
	$.println("ok")
}


if ($.isMainScript(import.meta)) {
	await main()
}
