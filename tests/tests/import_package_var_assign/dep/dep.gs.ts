// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let Count: number = 1

export function __goscript_set_Count(value: number): void {
	Count = value
}

export let Hook: (() => $.GoError | globalThis.Promise<$.GoError>) | null = null as (() => $.GoError | globalThis.Promise<$.GoError>) | null

export function __goscript_set_Hook(value: (() => $.GoError | globalThis.Promise<$.GoError>) | null): void {
	Hook = value
}

export function Current(): number {
	return Count
}

export async function Wait(): globalThis.Promise<$.GoError> {
	let ch = $.makeChannel<$.GoError>(1, null, "both")
	await $.chanSend(ch, null)
	return await $.chanRecv(ch)
}

export async function Run(): globalThis.Promise<$.GoError> {
	return await Hook!()
}
