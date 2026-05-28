// Generated file based on constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const Pi: number = 157/50

export const Truth: boolean = false

export const Greeting: string = "Hello, Constants!"

export const IV0: number = 1

export const IV1: number = 2

export const IV2: number = 3

export let DigestIV: number[] = [$.uint(1, 32), $.uint(2, 32), $.uint(3, 32)]

export function __goscript_set_DigestIV(__goscriptValue: number[]): void {
	DigestIV = __goscriptValue
}

export let Nothing: any = null

export function __goscript_set_Nothing(__goscriptValue: any): void {
	Nothing = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	$.println(157/50)
	$.println(false)
	// println(Big) // Commented out until large integer handling is implemented
	// println(Small) // Commented out as it depends on Big
	$.println("Hello, Constants!")
	$.println($.uint(DigestIV[0], 32), $.uint(DigestIV[1], 32), $.uint(DigestIV[2], 32))
	$.println($.uint($.uint(4, 8), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
