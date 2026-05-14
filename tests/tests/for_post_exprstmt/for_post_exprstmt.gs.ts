// Generated file based on for_post_exprstmt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export let counter: number = 0

export function increment_counter(): void {
	counter++
	$.println("counter incremented to", counter)
}

export async function main(): Promise<void> {
	for (let i = 0; i < 2; increment_counter()) {
		$.println("loop iteration:", i)
		i++
	}
	$.println("done", "final counter:", counter)
}


if ($.isMainScript(import.meta)) {
	await main()
}
