// Generated file based on alt_exit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as os from "@goscript/os/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/fmt/index.js"
import "@goscript/os/index.js"

export let handlers: $.Slice<(() => void) | null> = $.arrayToSlice<(() => void) | null>([])

export function __goscript_set_handlers(__goscriptValue: $.Slice<(() => void) | null>): void {
	handlers = __goscriptValue
}

export async function runHandler(handler: (() => void) | null): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
		{
			let err = $.recover()
			if (err != null) {
				await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "Error: Logrus exit handler error:", err)
			}
		}
	})() })

	await handler!()
}

export async function runHandlers(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = handlers, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let handler = __goscriptRangeTarget0![__rangeIndex]
		await runHandler(handler)
	}
}

export async function Exit(code: number): globalThis.Promise<void> {
	await runHandlers()
	os.Exit(code)
}

export function RegisterExitHandler(handler: (() => void) | null): void {
	handlers = $.append(handlers, handler)
}

export function DeferExitHandler(handler: (() => void) | null): void {
	handlers = $.appendSlice($.arrayToSlice<(() => void) | null>([handler]), handlers)
}
