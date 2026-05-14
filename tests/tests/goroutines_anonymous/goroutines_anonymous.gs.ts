// Generated file based on goroutines_anonymous.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let msgs = $.makeChannel<string>(1, "", "both")
	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
	await $.chanSend(msgs, "anonymous function worker")
}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	$.println(await $.chanRecv(msgs))
}


if ($.isMainScript(import.meta)) {
	await main()
}
