// Generated file based on return_async_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/time/index.js"

export async function AsyncFunction(): globalThis.Promise<string> {
	await time.Sleep(10000000n)
	return "result"
}

export async function SyncWrapper(): globalThis.Promise<string> {
	return AsyncFunction()
}

export async function AnotherAsyncFunction(ctx: context.Context | null): globalThis.Promise<[string, $.GoError]> {
	await time.Sleep(5000000n)
	return ["async result", null]
}

export async function WrapperWithError(ctx: context.Context | null): globalThis.Promise<[string, $.GoError]> {
	return AnotherAsyncFunction(ctx)
}

export async function main(): globalThis.Promise<void> {
	// These calls should work properly with async/await
	let result1 = await SyncWrapper()
	$.println("Result1:", result1)

	let ctx = context.Background()
	let [result2, err] = await WrapperWithError(ctx)
	if (err != null) {
		$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("Result2:", result2)
}

if ($.isMainScript(import.meta)) {
	await main()
}
