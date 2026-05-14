// Generated file based on return_async_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

import * as time from "@goscript/time/index.ts"

export function AsyncFunction(): string {
	time.Sleep(10 * time.Millisecond)
	return "result"
}

export function SyncWrapper(): string {
	return AsyncFunction()
}

export function AnotherAsyncFunction(ctx: context.Context): [string, $.GoError] {
	time.Sleep(5 * time.Millisecond)
	return ["async result", null]
}

export function WrapperWithError(ctx: context.Context): [string, $.GoError] {
	return AnotherAsyncFunction(ctx)
}

export async function main(): Promise<void> {
	let result1 = SyncWrapper()
	$.println("Result1:", result1)
	let ctx = context.Background()
	let [result2, err] = WrapperWithError(ctx)
	if (err != null) {
		$.println("Error:", err!.Error())
		return
	}
	$.println("Result2:", result2)
}


if ($.isMainScript(import.meta)) {
	await main()
}
