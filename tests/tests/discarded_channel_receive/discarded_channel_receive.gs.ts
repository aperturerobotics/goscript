// Generated file based on discarded_channel_receive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(0, 0, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
		await $.chanSend(ch, 1)
		ch!.close()
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	await $.chanRecv(ch)
	$.println("done")
}


if ($.isMainScript(import.meta)) {
	await main()
}
