// Generated file based on constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export const Pi: number = 3.14

export const Truth: boolean = false

export const Greeting: string = "Hello, Constants!"

export let Nothing: any = null

export async function main(): Promise<void> {
	$.println(Pi)
	$.println(Truth)
	$.println(Greeting)
	$.println($.int(4))
}


if ($.isMainScript(import.meta)) {
	await main()
}
