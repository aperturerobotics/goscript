// Generated file based on var_init_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let a: number = 10

export let b: number = a + 5

export let c: number = b * 2

export async function main(): Promise<void> {
	$.println("a:", a)
	$.println("b:", b)
	$.println("c:", c)
}

