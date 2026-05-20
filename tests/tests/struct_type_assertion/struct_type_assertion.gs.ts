// Generated file based on struct_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let i: any = {Name: "Alice", Number: 8005553424}

	let [s, ok] = $.typeAssertTuple<{"Name": string, "Number": number}>(i, { kind: $.TypeKind.Struct, methods: [], fields: {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Number": { kind: $.TypeKind.Basic, name: "int" }} })
	if (ok) {
		$.println("Name:", s.Name, "Number:", s.Number)
	} else {
		$.println("Type assertion failed")
	}

	let [j, ok2] = $.typeAssertTuple<{"Age": number}>(i, { kind: $.TypeKind.Struct, methods: [], fields: {"Age": { kind: $.TypeKind.Basic, name: "int" }} })
	if (ok2) {
		$.println("Age:", j.Age)
	} else {
		$.println("Second type assertion failed as expected")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
