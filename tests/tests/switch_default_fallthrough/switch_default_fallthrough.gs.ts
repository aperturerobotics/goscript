// Generated file based on switch_default_fallthrough.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function classify(value: number): string {
	switch (value) {
		default:
		{
		}
		case 1:
		{
			return "one"
			break
		}
		case 2:
		{
			return "two"
			break
		}
	}
}

export async function main(): Promise<void> {
	$.println(classify(0))
	$.println(classify(1))
	$.println(classify(2))
}


if ($.isMainScript(import.meta)) {
	await main()
}
