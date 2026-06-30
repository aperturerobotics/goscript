// Generated file based on named_result_defer_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function syncReturn(): [number, string] {
	let value: number = 0
	let err: string = ""
	using __defer = new $.DisposableStack()
	__defer.defer(() => { ((): void => {
		err = "deferred"
	})() })
	const __goscriptReturn0: [number, string] = [7, ""]
	value = __goscriptReturn0[0]
	err = __goscriptReturn0[1]
	__defer.dispose()
	return [value, err]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function asyncReturn(ch: $.Channel<string> | null): globalThis.Promise<[number, string]> {
	let value: number = 0
	let err: string = ""
	await using __defer = new $.AsyncDisposableStack()
	__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
		err = await $.chanRecv(ch)
	})() })
	await $.chanSend(ch, "async deferred")
	const __goscriptReturn1: [number, string] = [11, ""]
	value = __goscriptReturn1[0]
	err = __goscriptReturn1[1]
	await __defer.dispose()
	return [value, err]
	throw new globalThis.Error("goscript: unreachable return")
}

export function blankReturn(): [number, string] {
	let err: string = ""
	using __defer = new $.DisposableStack()
	__defer.defer(() => { ((): void => {
		err = "blank deferred"
	})() })
	const __goscriptReturn2: [number, string] = [13, ""]
	err = __goscriptReturn2[1]
	__defer.dispose()
	return [__goscriptReturn2[0], err]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let [v, err] = syncReturn()
	$.println("sync", v, err)

	let ch: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")
	let __goscriptTuple0: any = await asyncReturn(ch)
	v = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("async", v, err)

	let __goscriptTuple1: any = blankReturn()
	v = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("blank", v, err)
}

if ($.isMainScript(import.meta)) {
	await main()
}
