// Generated file based on go_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let x: any = $.interfaceValue<any>($.functionValue((): void => {
		$.println("goroutine executed")
	}, { kind: $.TypeKind.Function, params: [], results: [] }), "func()")
	queueMicrotask(async () => { $.mustTypeAssert<(() => void) | null>(x, { kind: $.TypeKind.Function, params: [], results: [] })!() })
	$.println("main finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
