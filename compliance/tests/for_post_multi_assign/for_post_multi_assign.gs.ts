// Generated file based on for_post_multi_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	for (let i = 0, j = 5; i < j; [i, j] = [i + 1, j - 1]) {
		console.log(i, j)
	}
	console.log("done")
}

