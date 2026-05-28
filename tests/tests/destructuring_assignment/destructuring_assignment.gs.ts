// Generated file based on destructuring_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"
import "@goscript/fmt/index.js"

export function multiReturn(): [number, number] {
	return [10, 20]
}

export function multiReturnThree(): [string, number, number] {
	return ["test", 100, 200]
}

export async function main(): globalThis.Promise<void> {
	// Test simple destructuring that should work
	let [x, y] = multiReturn()
	fmt.Printf("x=%d, y=%d\n", $.namedValueInterfaceValue<any>(x, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(y, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))

	// Test three-value destructuring
	let [name, line, col] = multiReturnThree()
	fmt.Printf("name=%s, line=%d, col=%d\n", name, $.namedValueInterfaceValue<any>(line, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(col, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))

	// Test reassignment to existing variables
	let a: number = 0
	let b: number = 0
	let __goscriptTuple0: any = multiReturn()
	a = __goscriptTuple0[0]
	b = __goscriptTuple0[1]
	fmt.Printf("a=%d, b=%d\n", $.namedValueInterfaceValue<any>(a, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(b, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
}

if ($.isMainScript(import.meta)) {
	await main()
}
