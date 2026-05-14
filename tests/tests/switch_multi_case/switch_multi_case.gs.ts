// Generated file based on switch_multi_case.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let stdNumMonth = 1
	let stdZeroMonth = 2
	let month = 0
	let value = "someValue"
	let err: $.GoError = null
	let getnum = $.functionValue((v: string, flag: boolean): [number, string, $.GoError] => {
	if (flag) {
		return [12, v + "_processed_flag_true", null]
	}
	return [1, v + "_processed_flag_false", null]
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "string" }, "error"] })
	let std = 2
	switch (std) {
		case stdNumMonth:
		case stdZeroMonth:
		{
			let __goscriptTuple428 = getnum!(value, std == stdZeroMonth)
			month = __goscriptTuple428[0]
			value = __goscriptTuple428[1]
			err = __goscriptTuple428[2]
			if (err != null) {
				$.println("Error:", err!.Error())
			}
			$.println("Month:", month, "Value:", value)
			break
		}
		case 3:
		{
			$.println("Std is 3")
			break
		}
		default:
		{
			$.println("Default case")
			break
		}
	}
	std = 1
	switch (std) {
		case stdNumMonth:
		case stdZeroMonth:
		{
			let __goscriptTuple712 = getnum!(value, std == stdZeroMonth)
			month = __goscriptTuple712[0]
			value = __goscriptTuple712[1]
			err = __goscriptTuple712[2]
			if (err != null) {
				$.println("Error:", err!.Error())
			}
			$.println("Month:", month, "Value:", value)
			break
		}
		case 3:
		{
			$.println("Std is 3")
			break
		}
		default:
		{
			$.println("Default case")
			break
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
