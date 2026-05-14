// Generated file based on select_receive_on_closed_channel_no_default.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let ch = $.makeChannel<number>(0, 0, "both")
	ch!.close()

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ch,
			onSelected: async (result) => {
				let val = result.value
				let ok = result.ok
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
