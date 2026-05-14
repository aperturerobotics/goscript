// Generated file based on issue_118_goroutine_starvation.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as sync from "@goscript/sync/index.ts"

import * as time from "@goscript/time/index.ts"

export async function main(): Promise<void> {
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	let done = $.makeChannel<boolean>(0, false, "both")
	let result = $.makeChannel<number>(2, 0, "both")
	wg.value.Go($.functionValue(async (): Promise<void> => {
	let sum = 0
	for (let i = 0; i < 1000000; i++) {
		sum += i
	}
	await $.chanSend(result, sum)
}, { kind: $.TypeKind.Function, params: [], results: [] }))
	wg.value.Go($.functionValue(async (): Promise<void> => {
	await $.chanSend(result, 42)
}, { kind: $.TypeKind.Function, params: [], results: [] }))
	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
	await wg.value.Wait()
	done.close()
}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	let results = $.arrayToSlice<number>([])
	let timeout = time.After(5 * time.Second)
	for (let __rangeIndex = 0; __rangeIndex < 2; __rangeIndex++) {
		const [__goscriptSelectHasReturn3480658, __goscriptSelectValue3480658] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: result,
				onSelected: async (result) => {
					let r = result.value
					results = $.append(results, r)
				}
			},
			{
				id: 1,
				isSend: false,
				channel: timeout,
				onSelected: async (result) => {
					$.println("TIMEOUT: goroutine starvation detected")
					return
				}
			},
			{
				id: 2,
				isSend: false,
				channel: done,
				onSelected: async (result) => {
				}
			}
		], false)
		if (__goscriptSelectHasReturn3480658) {
			return __goscriptSelectValue3480658
		}
	}
	$.println("worker1 completed")
	$.println("worker2 completed")
	$.println("no starvation detected")
}


if ($.isMainScript(import.meta)) {
	await main()
}
