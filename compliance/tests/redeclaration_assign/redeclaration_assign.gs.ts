// Generated file based on redeclaration_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function returnsOneIntOneBool(): [number, boolean] {
	return [7, true]
}

export async function main(): Promise<void> {
	let i: number = 0
	console.log("initial i:", i) // Use i to avoid unused error before :=

	// i already exists from the var declaration above.
	// err is a new variable being declared.
	let err: boolean
	[i, err] = returnsOneIntOneBool()

	console.log("after assign i:", i) // Use i
	// Use err
	if (err) {
		// Use err
		console.log("err is true")
	}
	 else {
		console.log("err is false")
	}
}

