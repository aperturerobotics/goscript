// Generated file based on named_result_func_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function makeLookup(): ((_p0: boolean) => [number, string]) | null {
	return $.functionValue((ok: boolean): [number, string] => {
		let value: number = 0
		let label: string = ""
		if (!ok) {
			return [value, label]
		}
		value = 7
		label = "set"
		return [value, label]
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "string" }] })
}

export async function main(): Promise<void> {
	let lookup = makeLookup()

	let [value, label] = lookup!(false)
	$.println(value)
	$.println(label == "")

	let __goscriptTuple0 = lookup!(true)
	value = __goscriptTuple0[0]
	label = __goscriptTuple0[1]
	$.println(value)
	$.println(label)
}


if ($.isMainScript(import.meta)) {
	await main()
}
