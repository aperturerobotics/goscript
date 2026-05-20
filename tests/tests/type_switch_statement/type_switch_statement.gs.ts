// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Basic type switch with variable and default case
	let i: any = "hello"
	$.typeSwitch(
		i,
		[
			{
				types: [{ kind: $.TypeKind.Basic, name: "int" }],
				body: (v) => {
					$.println("int", v)
				}
			},
			{
				types: [{ kind: $.TypeKind.Basic, name: "string" }],
				body: (v) => {
					$.println("string", v)
				}
			}
		],
		() => {
			let v = i
			$.println("unknown")
		}
	)

	// Type switch without variable
	let x: any = 123
	$.typeSwitch(
		x,
		[
			{
				types: [{ kind: $.TypeKind.Basic, name: "bool" }],
				body: () => {
					$.println("bool")
				}
			},
			{
				types: [{ kind: $.TypeKind.Basic, name: "int" }],
				body: () => {
					$.println("int")
				}
			}
		]
	)

	// Type switch with multiple types in a case
	let y: any = true
	$.typeSwitch(
		y,
		[
			{
				types: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }],
				body: (v) => {
					$.println("number", v)
				}
			},
			{
				types: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "bool" }],
				body: (v) => {
					$.println("string or bool", v)
				}
			}
		]
	)

	// Type switch with initialization statement
	let z = getInterface()
	$.typeSwitch(
		z,
		[
			{
				types: [{ kind: $.TypeKind.Basic, name: "int" }],
				body: (v) => {
					$.println("z is int", v)
				}
			}
		]
	)

	// Default-only type switch
	let w: any = "test"
	$.typeSwitch(
		w,
		[
		],
		() => {
			$.println("default only")
		}
	)
	$.typeSwitch(
		w,
		[
		],
		() => {
			$.println("default only, value is", $.mustTypeAssert<string>(w, { kind: $.TypeKind.Basic, name: "string" }))
		}
	)

	for (let __rangeIndex = 0; __rangeIndex < $.len($.arrayToSlice<any>([$.int(7)])); __rangeIndex++) {
		let v = $.arrayToSlice<any>([$.int(7)])![__rangeIndex]
		$.typeSwitch(
			v,
			[
			],
			() => {
				const __goscriptTypeSwitchDefaultValue = v
				{
					let v = __goscriptTypeSwitchDefaultValue
					$.println("shadow default", $.mustTypeAssert<number>(v, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}
		)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function getInterface(): any {
	return 42
}
