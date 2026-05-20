// Generated file based on package_import_csync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as csync from "@goscript/github.com/aperturerobotics/util/csync/index.js"

export async function main(): Promise<void> {
	using __defer = new $.DisposableStack()
	let mtx: $.VarRef<csync.Mutex> = $.varRef($.markAsStructValue(new csync.Mutex()))
	let counter: number = 0
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))

	let [ctx, cancel] = context.WithTimeout($.pointerValue(context.Background()), 5 * time.Second)
	__defer.defer(() => { cancel!() })

	// Number of goroutines to spawn
	let numWorkers = 5
	wg.value.Add(numWorkers)

	// Function that will be run by each worker
	let worker = $.functionValue(async (id: number): Promise<void> => {
		using __defer = new $.DisposableStack()
		__defer.defer(() => { wg.value.Done() })

		// Try to acquire the lock
		let [relLock, err] = await mtx.value.Lock(ctx)
		if (err != null) {
			$.println("worker", id, "failed to acquire lock:", $.pointerValue(err).Error())
			return
		}
		__defer.defer(() => { relLock!() })

		// Critical section
		// println("worker", id, "entered critical section") - non-deterministic, leave commented out
		let current = counter
		time.Sleep(100 * time.Millisecond)
		counter = current + 1
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] })

	// Start worker goroutines
	for (let i = 0; i < numWorkers; i++) {
		queueMicrotask(async () => { worker!(i) })
	}

	// Wait for all workers to complete or context timeout
	let done = $.makeChannel<Record<string, unknown>>(0, {}, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
		await wg.value.Wait()
		done!.close()
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: done,
			onSelected: async (result) => {
				$.println("All workers completed successfully")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: $.pointerValue(ctx).Done(),
			onSelected: async (result) => {
				$.println("Test timed out:", $.pointerValue($.pointerValue(ctx).Err()).Error())
			}
		}
	], false)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}

	$.println("Final counter value:", counter)
	if (counter != numWorkers) {
		$.panic("counter does not match expected value")
	}

	$.println("success: csync.Mutex test completed")
}


if ($.isMainScript(import.meta)) {
	await main()
}
