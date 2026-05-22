// Generated file based on var_init_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let a: number = 10

export function __goscript_set_a(value: number): void {
	a = value
}

export let b: number = a + 5

export function __goscript_set_b(value: number): void {
	b = value
}

export let c: number = b * 2

export function __goscript_set_c(value: number): void {
	c = value
}

export async function main(): globalThis.Promise<void> {
	$.println("a:", a)
	$.println("b:", b)
	$.println("c:", c)
}

if ($.isMainScript(import.meta)) {
	await main()
}
