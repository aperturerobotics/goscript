// Generated file based on primitive_error_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyError = number;

export function MyError_Error(e: MyError): string {
	if (e == 0) {
		return "no error"
	}
	return "error occurred"
}


// mayFail returns an error if n is negative
export function mayFail(n: number): $.GoError {
	if (n < 0) {
		return $.wrapPrimitiveError((n as MyError), MyError_Error)
	}
	return null
}

export async function main(): Promise<void> {
	let err = mayFail(5)
	if (err == null) {
		$.println("mayFail(5): no error")
	} else {
		$.println("mayFail(5):", err!.Error())
	}

	err = mayFail(-1)
	if (err == null) {
		$.println("mayFail(-1): no error")
	} else {
		$.println("mayFail(-1):", err!.Error())
	}
}

