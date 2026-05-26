// Generated file based on inline_function_type_cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Greeter = ((name: string) => string | globalThis.Promise<string>) | null

export async function main(): globalThis.Promise<void> {
	// 2. Create an inline variable with the inline function satisfying that type.
	let theInlineVar: ((name: string) => string | globalThis.Promise<string>) | null = $.functionValue((name: string): string => {
		return "Hello, " + name
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo))

	// 3. Use Greeter(theInlineVar) to cast to the Greeter declared function type.
	let castedGreeter = $.namedFunction(theInlineVar, "main.Greeter")

	// 4. Call that
	$.println(await castedGreeter!("Inline World"))

	// Test with a different signature
	type Adder = ((a: number, b: number) => number | globalThis.Promise<number>) | null
	let theInlineAdder: ((a: number, b: number) => number | globalThis.Promise<number>) | null = $.functionValue((a: number, b: number): number => {
		return a + b
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	let castedAdder = $.namedFunction(theInlineAdder, "main.Adder")
	$.println(await castedAdder!(5, 7))
}

if ($.isMainScript(import.meta)) {
	await main()
}
