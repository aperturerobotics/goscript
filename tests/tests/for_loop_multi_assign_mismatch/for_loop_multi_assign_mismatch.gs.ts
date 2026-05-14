// Generated file based on for_loop_multi_assign_mismatch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function getValues(): [number, boolean] {
	return [42, true]
}

export async function main(): Promise<void> {
	for (let [value, ok] = getValues(); ok; ) {
		$.println("value:", value)
		break
	}
	$.println("done")
}


if ($.isMainScript(import.meta)) {
	await main()
}
