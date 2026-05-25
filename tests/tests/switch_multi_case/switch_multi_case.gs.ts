// Generated file based on switch_multi_case.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let stdNumMonth = 1
	let stdZeroMonth = 2
	// stdLongMonth := 3 // Not used in this specific example but good for context

	let month = 0
	let value = "someValue"
	let err: $.GoError = null as $.GoError

	let getnum: ((v: string, flag: boolean) => [number, string, $.GoError] | globalThis.Promise<[number, string, $.GoError]>) | null = $.functionValue((v: string, flag: boolean): [number, string, $.GoError] => {
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
			let __goscriptTuple0: any = await getnum!(value, std == stdZeroMonth)
			month = __goscriptTuple0[0]
			value = __goscriptTuple0[1]
			err = __goscriptTuple0[2]
			if (err != null) {
				$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
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
			let __goscriptTuple1: any = await getnum!(value, std == stdZeroMonth)
			month = __goscriptTuple1[0]
			value = __goscriptTuple1[1]
			err = __goscriptTuple1[2]
			if (err != null) {
				$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
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
