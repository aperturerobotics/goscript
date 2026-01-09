// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Basic type switch with variable and default case
	let i: null | any = "hello"
	$.typeSwitch(i, [{ types: [{kind: $.TypeKind.Basic, name: 'number'}], body: (v) => {
		$.println("int", v)
	}},
	{ types: [{kind: $.TypeKind.Basic, name: 'string'}], body: (v) => {
		$.println("string", v)
	}}], () => {
		$.println("unknown")
	})

	// Type switch without variable
	let x: null | any = 123
	$.typeSwitch(x, [{ types: [{kind: $.TypeKind.Basic, name: 'boolean'}], body: () => {
		$.println("bool")
	}},
	{ types: [{kind: $.TypeKind.Basic, name: 'number'}], body: () => {
		$.println("int")
	}}])

	// Type switch with multiple types in a case
	let y: null | any = true
	$.typeSwitch(y, [{ types: [{kind: $.TypeKind.Basic, name: 'number'}, {kind: $.TypeKind.Basic, name: 'number'}], body: (v) => {
		$.println("number", v)
	}},
	{ types: [{kind: $.TypeKind.Basic, name: 'string'}, {kind: $.TypeKind.Basic, name: 'boolean'}], body: (v) => {
		$.println("string or bool", v)
	}}])

	// Type switch with initialization statement
	{
		let z = getInterface()
		$.typeSwitch(z, [{ types: [{kind: $.TypeKind.Basic, name: 'number'}], body: (v) => {
			$.println("z is int", v)
		}}])
	}

	// Default-only type switch
	let w: null | any = "test"
	$.typeSwitch(w, [], () => {
		$.println("default only")
	})
	$.typeSwitch(w, [], () => {
		$.println("default only, value is", $.mustTypeAssert<string>(w, {kind: $.TypeKind.Basic, name: 'string'}))
	})
}

export function getInterface(): null | any {
	return 42
}

