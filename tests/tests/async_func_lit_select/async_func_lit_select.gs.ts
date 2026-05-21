// Generated file based on async_func_lit_select.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

export async function main(): Promise<void> {
	if (false) {
		let fn = $.functionValue(async (): Promise<boolean> => {
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, boolean>([
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (result) => {
						return true
					}
				}
			], true)
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}
			throw new Error("unreachable select")
		}, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })
		fn
	}
	fmt.Println("select literal ok")
}


if ($.isMainScript(import.meta)) {
	await main()
}
