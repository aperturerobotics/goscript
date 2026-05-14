// Generated file based on package_import_csync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

import * as sync from "@goscript/sync/index.ts"

import * as time from "@goscript/time/index.ts"

import * as csync from "@goscript/github.com/aperturerobotics/util/csync/index.ts"

export async function main(): Promise<void> {
	using __defer = new $.DisposableStack()
	let mtx: $.VarRef<csync.Mutex> = $.varRef($.markAsStructValue(new csync.Mutex()))
	let counter: number = 0
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	let [ctx, cancel] = context.WithTimeout(context.Background(), 5 * time.Second)
	__defer.defer(() => { cancel() })
	let numWorkers = 5
	wg.value.Add(numWorkers)
	let worker = $.functionValue(async (id: number): Promise<void> => {
	using __defer = new $.DisposableStack()
	__defer.defer(() => { wg.value.Done() })
	let [relLock, err] = await mtx.value.Lock(ctx)
	if (err != null) {
		$.println("worker", id, "failed to acquire lock:", err!.Error())
		return
	}
	__defer.defer(() => { relLock() })
	let current = counter
	time.Sleep(100 * time.Millisecond)
	counter = current + 1
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] })
	for (let i = 0; i < numWorkers; i++) {
		queueMicrotask(async () => { worker(i) })
	}
	let done = $.makeChannel<Record<string, unknown>>(0, {}, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): Promise<void> => {
	await wg.value.Wait()
	done.close()
}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	const [__goscriptSelectHasReturn4801746, __goscriptSelectValue4801746] = await $.selectStatement<any, void>([
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
			channel: ctx!.Done(),
			onSelected: async (result) => {
				$.println("Test timed out:", ctx!.Err()!.Error())
			}
		}
	], false)
	if (__goscriptSelectHasReturn4801746) {
		return __goscriptSelectValue4801746
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
