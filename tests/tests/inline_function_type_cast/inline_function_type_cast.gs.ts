// Generated file based on inline_function_type_cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Greeter = ((name: string) => string) | null

export async function main(): Promise<void> {
	let theInlineVar = $.functionValue((name: string): string => {
	return "Hello, " + name
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] })
	let castedGreeter = $.namedFunction(theInlineVar, "main.Greeter")
	$.println(castedGreeter!("Inline World"))
	type Adder = ((a: number, b: number) => number) | null
	let theInlineAdder = $.functionValue((a: number, b: number): number => {
	return a + b
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	let castedAdder = $.namedFunction(theInlineAdder, "main.Adder")
	$.println(castedAdder!(5, 7))
}


if ($.isMainScript(import.meta)) {
	await main()
}
