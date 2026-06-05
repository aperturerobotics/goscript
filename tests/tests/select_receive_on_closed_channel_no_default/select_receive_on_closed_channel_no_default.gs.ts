// Generated file based on select_receive_on_closed_channel_no_default.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let ch: $.Channel<number> | null = $.makeChannel<number>(0, 0, "both")
	ch!.close()

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch,
			onSelected: async (__goscriptSelect0Result) => {
				let val = __goscriptSelect0Result.value
				let ok = __goscriptSelect0Result.ok
				if (ok) {
					$.println("Received value with ok==true:", val)
				} else {
					$.println("Received zero value with ok==false:", val)
				}
			}
		}
	], false)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
