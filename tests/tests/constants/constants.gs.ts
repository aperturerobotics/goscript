// Generated file based on constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const Pi: number = 157/50

export const Truth: boolean = false

export const Greeting: string = "Hello, Constants!"

export const IV0: number = 1

export const IV1: number = 2

export const IV2: number = 3

export let DigestIV: number[] = [$.uint(IV0, 32), $.uint(IV1, 32), $.uint(IV2, 32)]

export function __goscript_set_DigestIV(value: number[]): void {
	DigestIV = value
}

export let Nothing: any = null

export function __goscript_set_Nothing(value: any): void {
	Nothing = value
}

export async function main(): globalThis.Promise<void> {
	$.println(Pi)
	$.println(Truth)
	// println(Big) // Commented out until large integer handling is implemented
	// println(Small) // Commented out as it depends on Big
	$.println(Greeting)
	$.println($.uint(DigestIV[0], 32), $.uint(DigestIV[1], 32), $.uint(DigestIV[2], 32))
	$.println($.uint($.uint(4, 8), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
