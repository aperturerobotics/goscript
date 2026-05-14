// Generated file based on for_init_multi_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	for (let i = 0; i < 2; i++) {
		$.println(i, j)
		j += 10
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
