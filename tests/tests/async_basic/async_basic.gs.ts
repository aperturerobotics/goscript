// Generated file based on async_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function receiveFromChan(ch: $.Channel<number> | null): Promise<number> {
	let val = await $.chanRecv(ch)
	return val
}

export async function caller(ch: $.Channel<number> | null): Promise<number> {
	let result = await receiveFromChan(ch)
	return result + 1
}

export async function main(): Promise<void> {
	let myChan = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(myChan, 10)
	let finalResult = await caller(myChan)
	$.println(finalResult)
	myChan!.close()
}


if ($.isMainScript(import.meta)) {
	await main()
}
