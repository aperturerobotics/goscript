// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Basic type switch with variable and default case
	let i: any = "hello"
	{
		const __goscriptTypeSwitchValue = i
		switch (true) {
			case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				{
					let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
					$.println("int", v)
				}
				break
			case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
				{
					let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
					$.println("string", v)
				}
				break
			default:
				{
					let v = __goscriptTypeSwitchValue
					$.println("unknown")
				}
				break
		}
	}

	// Type switch without variable
	let x: any = 123
	{
		const __goscriptTypeSwitchValue = x
		switch (true) {
			case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).ok:
				$.println("bool")
				break
			case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				$.println("int")
				break
		}
	}

	// Type switch with multiple types in a case
	let y: any = true
	{
		const __goscriptTypeSwitchValue = y
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }):
				{
					let v = __goscriptTypeSwitchValue
					$.println("number", v)
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }):
				{
					let v = __goscriptTypeSwitchValue
					$.println("string or bool", v)
				}
				break
		}
	}

	// Type switch with initialization statement
	let z = getInterface()
	{
		const __goscriptTypeSwitchValue = z
		switch (true) {
			case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				{
					let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
					$.println("z is int", v)
				}
				break
		}
	}

	// Default-only type switch
	let w: any = "test"
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				$.println("default only")
				break
		}
	}
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				$.println("default only, value is", $.mustTypeAssert<string>(w, { kind: $.TypeKind.Basic, name: "string" }))
				break
		}
	}

	for (let __rangeIndex = 0; __rangeIndex < $.len($.arrayToSlice<any>([$.int(7)])); __rangeIndex++) {
		let v = $.arrayToSlice<any>([$.int(7)])![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				default:
					{
						let v = __goscriptTypeSwitchValue
						$.println("shadow default", $.mustTypeAssert<number>(v, { kind: $.TypeKind.Basic, name: "int" }))
					}
					break
			}
		}
	}

	let count = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len($.arrayToSlice<any>([1, "skip", 2])); __rangeIndex++) {
		let v = $.arrayToSlice<any>([1, "skip", 2])![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
						$.println("continue", v)
						continue
					}
					break
				case $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
					{
						let v = $.typeAssert<any>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
						count += v
					}
					break
			}
		}
		$.println("after switch")
	}
	$.println("type switch count", count)
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function getInterface(): any {
	return 42
}
