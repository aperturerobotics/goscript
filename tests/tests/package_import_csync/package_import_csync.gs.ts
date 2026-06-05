// Generated file based on package_import_csync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as csync from "@goscript/github.com/aperturerobotics/util/csync/index.js"
import "@goscript/context/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/util/csync/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let mtx: $.VarRef<csync.Mutex> = $.varRef($.markAsStructValue(new csync.Mutex()))
	let counter: number = 0
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))

	let [ctx, cancel] = context.WithTimeout($.pointerValueOrNil(context.Background())!, $.int64Mul(5, time.Second))
	__defer.defer(async () => { await cancel!() })

	// Number of goroutines to spawn
	let numWorkers = 5
	wg.value.Add(numWorkers)

	// Function that will be run by each worker
	let worker: ((id: number) => void) | null = $.functionValue(async (id: number): globalThis.Promise<void> => {
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(() => { wg.value.Done() })

		// Try to acquire the lock
		let [relLock, err] = await mtx.value.Lock(ctx)
		if (err != null) {
			$.println("worker", id, "failed to acquire lock:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
		__defer.defer(async () => { await relLock!() })

		// Critical section
		// println("worker", id, "entered critical section") - non-deterministic, leave commented out
		let current = counter
		await time.Sleep($.int64Mul(100, time.Millisecond))
		counter = current + 1
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo))

	// Start worker goroutines
	for (let i = 0; i < numWorkers; i++) {
		queueMicrotask(async () => { await worker!(i) })
	}

	// Wait for all workers to complete or context timeout
	let done: $.Channel<{}> | null = $.makeChannel<{}>(0, {}, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		await wg.value.Wait()
		done!.close()
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: done,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("All workers completed successfully")
			}
		},
		{
			id: 1,
			isSend: false,
			channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect0Result) => {
				$.println("Test timed out:", $.pointerValue<Exclude<$.GoError, null>>($.pointerValue<Exclude<context.Context, null>>(ctx).Err()).Error())
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
