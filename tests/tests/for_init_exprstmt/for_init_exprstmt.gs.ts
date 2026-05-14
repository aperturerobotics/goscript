// Generated file based on for_init_exprstmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function init_func(): void {
	$.println("init_func called")
}

export async function main(): Promise<void> {
	for (init_func(); false; ) {
		$.println("loop body (should not be printed)")
	}
	$.println("done")
}


if ($.isMainScript(import.meta)) {
	await main()
}
