// Generated file based on named_return_multiple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function processValues(input: number): [number, string, boolean] {
	let num: number = 0
	let text: string = ""
	let ok: boolean = false
	num = input * 2
	if (input > 5) {
		text = "greater than five"
		ok = true
	} else {
		text = "five or less"
	}
	return [num, text, ok]
}

export async function main(): globalThis.Promise<void> {
	let [n1, t1, o1] = processValues(10)
	$.println(n1)
	$.println(t1)
	$.println(o1)

	let [n2, t2, o2] = processValues(3)
	$.println(n2)
	$.println(t2)
	$.println(o2)

	// Test with an anonymous function and potentially unassigned named returns
	let [n3, t3, o3] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		if (val == 1) {
			resInt = 100
		} else {
			if (val == 2) {
				resInt = 200
				resStr = "set string"
			}
		}
		return [resInt, resStr, resBool]
	})(1)

	$.println(n3)
	$.println(t3)
	$.println(o3)

	let [n4, t4, o4] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		if (val == 1) {
			resInt = 100
		} else {
			if (val == 2) {
				resInt = 200
				resStr = "set string for val 2"
			}
		}
		return [resInt, resStr, resBool]
	})(2)

	$.println(n4)
	$.println(t4)
	$.println(o4)

	let [n5, t5, o5] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		if (val == 1) {
			resInt = 100
		} else {
			if (val == 2) {
				resInt = 200
				resStr = "set string for val 2"
			}
		}
		return [resInt, resStr, resBool]
	})(3)

	$.println(n5)
	$.println(t5)
	$.println(o5)
}

if ($.isMainScript(import.meta)) {
	await main()
}
