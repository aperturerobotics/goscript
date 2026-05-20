// Generated file based on constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const Pi: number = 157/50

export const Truth: boolean = false

export const Greeting: string = "Hello, Constants!"

export let Nothing: any = null

export async function main(): Promise<void> {
	$.println(Pi)
	$.println(Truth)
	// println(Big) // Commented out until large integer handling is implemented
	// println(Small) // Commented out as it depends on Big
	$.println(Greeting)
	$.println($.int(4))
}


if ($.isMainScript(import.meta)) {
	await main()
}
