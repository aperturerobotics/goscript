// Generated file based on switch_case_scope.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let x = 1

	switch (x) {
		case 1: {
			let [y, z] = [10, 20]
			$.println(y + z)
			break
		}
		case 2: {
			let [y, z] = [30, 40]
			$.println(y + z)
			break
		}
	}

	$.println("done")
}

