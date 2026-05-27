// Generated file based on issue_118_goroutine_starvation.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	let done = $.makeChannel<boolean>(0, false, "both")
	let result = $.makeChannel<number>(2, 0, "both")

	// Worker 1: Does a tight loop (CPU-bound work)
	// In Go: Will be preempted, allowing other goroutines to run
	// In GoScript: Would block forever, starving other goroutines
	wg.value.Go($.functionValue(async (): globalThis.Promise<void> => {
		let sum = 0
		// Simulate CPU-bound work with a tight loop
		// In real code this might be a computation without I/O
		for (let i = 0; i < 1000000; i++) {
			sum = sum + (i)
		}
		await $.chanSend(result, sum)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	// Worker 2: Quick task that should complete
	// In Go: Will run concurrently with worker1
	// In GoScript: Would never run if worker1 starves the event loop
	wg.value.Go($.functionValue(async (): globalThis.Promise<void> => {
		await $.chanSend(result, 42)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	// Wait for both workers with a timeout
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		await wg.value.Wait()
		done!.close()
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	// Collect results
	let results: $.Slice<number> = $.arrayToSlice<number>([])
	let timeout = time.After($.int64Mul(5, time.Second))

	for (let __rangeIndex = 0; __rangeIndex < 2; __rangeIndex++) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: result,
				onSelected: async (__goscriptSelect0Result) => {
					let r = __goscriptSelect0Result.value
					results = $.append(results, r)
				}
			},
			{
				id: 1,
				isSend: false,
				channel: timeout,
				onSelected: async (__goscriptSelect0Result) => {
					$.println("TIMEOUT: goroutine starvation detected")
					return $.selectVoidReturn()
				}
			},
			{
				id: 2,
				isSend: false,
				channel: done,
				onSelected: async (__goscriptSelect0Result) => {
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
	}

	// Both workers completed
	$.println("worker1 completed")
	$.println("worker2 completed")
	$.println("no starvation detected")
}

if ($.isMainScript(import.meta)) {
	await main()
}
