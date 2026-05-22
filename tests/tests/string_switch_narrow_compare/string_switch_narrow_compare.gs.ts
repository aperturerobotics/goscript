// Generated file based on string_switch_narrow_compare.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function valid(network: string): boolean {
	switch (network) {
		case "tcp":
		case "udp":
		{
			break
		}
		default:
		{
			return false
			break
		}
	}
	return (network as string) != ""
}

export async function main(): globalThis.Promise<void> {
	$.println(valid("tcp"), valid(""))
}

if ($.isMainScript(import.meta)) {
	await main()
}
