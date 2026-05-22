// Generated file based on select_default_continue.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	for (let i = 0; i < 3; i++) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, any>([
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (result) => {
					return result
				}
			}
		], true)
		switch (__goscriptSelect0Value?.id) {
			case -1:
				{
					const result = __goscriptSelect0Value
					if (i == 1) {
						continue
					}
					break
				}
		}
		$.println("selected", i)
	}
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
