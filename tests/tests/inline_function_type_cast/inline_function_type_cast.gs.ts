// Generated file based on inline_function_type_cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Greeter = (name: string) => string

export async function main(): Promise<void> {
	let theInlineVar = (name: string): string => {
	return "Hello, " + name
}
	let castedGreeter = $.namedFunction(theInlineVar, "main.Greeter")
	$.println(castedGreeter("Inline World"))
	type Adder = (a: number, b: number) => number
	let theInlineAdder = (a: number, b: number): number => {
	return a + b
}
	let castedAdder = $.namedFunction(theInlineAdder, "main.Adder")
	$.println(castedAdder(5, 7))
}


if ($.isMainScript(import.meta)) {
	await main()
}
