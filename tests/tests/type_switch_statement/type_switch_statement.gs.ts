// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
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
}


if ($.isMainScript(import.meta)) {
	await main()
}

export function getInterface(): any {
	return 42
}
