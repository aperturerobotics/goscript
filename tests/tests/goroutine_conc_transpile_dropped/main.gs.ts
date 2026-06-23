// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as conc from "@goscript/github.com/aperturerobotics/util/conc/index.js"
import "@goscript/context/index.js"
import "@goscript/sync/index.js"
import "@goscript/github.com/aperturerobotics/util/conc/index.js"

export const children: number = 16

export const leaves: number = 8

export async function main(): globalThis.Promise<void> {
	let mu: $.VarRef<sync.Mutex> = $.varRef($.markAsStructValue(new sync.Mutex()))
	let completed = 0

	let q: conc.ConcurrentQueue | $.VarRef<conc.ConcurrentQueue> | null = await conc.NewConcurrentQueue(16, null)

	let leaf: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
		// Await-free CPU span: a tight loop with no I/O or channel op.
		let sum = 0
		for (let i = 0; i < 200000; i++) {
			sum = sum + (i * 3)
		}
		sum
		await mu.value.Lock()
		completed++
		mu.value.Unlock()
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	let child: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
		let jobs: $.Slice<(() => void) | null> = $.makeSlice<(() => void) | null>(0, 8)
		for (let l = 0; l < 8; l++) {
			jobs = $.append(jobs, leaf)
		}
		await conc.ConcurrentQueue.prototype.Enqueue.call(q, jobs)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	let root: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
		let jobs: $.Slice<(() => void) | null> = $.makeSlice<(() => void) | null>(0, 16)
		for (let c = 0; c < 16; c++) {
			jobs = $.append(jobs, child)
		}
		await conc.ConcurrentQueue.prototype.Enqueue.call(q, jobs)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	await conc.ConcurrentQueue.prototype.Enqueue.call(q, $.arrayToSlice<(() => void) | null>([root]))

	{
		let err = await conc.ConcurrentQueue.prototype.WaitIdle.call(q, context.Background(), null)
		if (err != null) {
			$.println("WaitIdle error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}

	if (completed == (16 * 8)) {
		$.println("all 128 leaves completed")
	} else {
		$.println("INCOMPLETE")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
