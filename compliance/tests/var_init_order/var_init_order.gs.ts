// Generated file based on var_init_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

let a: number = 10

let b: number = a + 5

let c: number = b * 2

export async function main(): Promise<void> {
	console.log("a:", a)
	console.log("b:", b)
	console.log("c:", c)
}

