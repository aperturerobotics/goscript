// Generated file based on multiple_return_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function multipleReturnValues(): [number, string, boolean] {
	return [42, "hello", true]
}

export async function main(): Promise<void> {
	let [a, b, c] = multipleReturnValues()
	console.log(a)
	console.log(b)
	console.log(c)

	let [x, , z] = multipleReturnValues()
	console.log(x)
	console.log(z)

	let [, y, ] = multipleReturnValues()
	console.log(y)
}

