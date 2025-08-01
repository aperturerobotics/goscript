// Generated file based on flag_bitwise_op.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let O_WRONLY: number = 0x1
	let O_CREATE: number = 0x40
	let O_APPEND: number = 0x400
	let O_TRUNC: number = 0x200
	let flag = ((1 | 64) | 1024)
	if ((flag & 1024) != 0) {
		console.log("O_APPEND is set: Expected: O_APPEND is set, Actual: O_APPEND is set")
	}
	 else {
		console.log("O_APPEND is not set: Expected: (no output)")
	}
	if ((flag & 512) != 0) {
		console.log("O_TRUNC is set: Expected: (no output)")
	}
	 else {
		console.log("O_TRUNC is not set: Expected: O_TRUNC is not set, Actual: O_TRUNC is not set")
	}

	flag = (1 | 64)
	if ((flag & 1024) != 0) {
		console.log("O_APPEND is set: Expected: (no output)")
	}
	 else {
		console.log("O_APPEND is not set: Expected: O_APPEND is not set, Actual: O_APPEND is not set")
	}
}

