// Generated file based on for_post_assign_stmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let x: number = 0
	for (let i = 0; i < 3; x = i) {
		$.println("looping, i:", i, "x_before_post:", x)
		i++
	}
	$.println("final x:", x)
}


if ($.isMainScript(import.meta)) {
	await main()
}
