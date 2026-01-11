// Generated file based on named_return_multiple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

// Test function with multiple named return values
export function processValues(input: number): [number, string, boolean] {
	let num: number = 0
	let text: string = ""
	let ok: boolean = false
	{
		num = input * 2

		// ok remains false (its zero value)
		if (input > 5) {
			text = "greater than five"
			ok = true
		} else {

			// ok remains false (its zero value)
			text = "five or less"
			// ok remains false (its zero value)
		}
		return [num, text, ok]
	}
}

export async function main(): Promise<void> {
	let [n1, t1, o1] = processValues(10)
	$.println(n1) // Expected: 20
	$.println(t1) // Expected: greater than five
	$.println(o1) // Expected: true

	let [n2, t2, o2] = processValues(3)
	$.println(n2) // Expected: 6
	$.println(t2) // Expected: five or less
	$.println(o2) // Expected: false

	// Test with an anonymous function and potentially unassigned named returns

	// resStr and resBool are not assigned, should be zero values

	// resBool is not assigned, should be zero value

	// all are unassigned, should be zero values
	let [n3, t3, o3] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		{

			// resStr and resBool are not assigned, should be zero values

			// resBool is not assigned, should be zero value
			if (val == 1) {
				resInt = 100

			} else if (val == 2) {
				resInt = 200
				resStr = "set string"

			} else {

			}
			// all are unassigned, should be zero values

			return [resInt, resStr, resBool]
		}})(1)

	$.println(n3) // Expected: 100
	$.println(t3) // Expected: "" (empty string)
	$.println(o3) // Expected: false

	// resBool is not assigned

	// all are unassigned
	let [n4, t4, o4] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		{

			// resBool is not assigned
			if (val == 1) {
				resInt = 100
			} else if (val == 2) {
				resInt = 200
				resStr = "set string for val 2"

			} else {

			}
			// all are unassigned

			return [resInt, resStr, resBool]
		}})(2)

	$.println(n4) // Expected: 200
	$.println(t4) // Expected: "set string for val 2"
	$.println(o4) // Expected: false

	// all are unassigned here, so will take zero values
	let [n5, t5, o5] = ((val: number): [number, string, boolean] => {
		let resInt: number = 0
		let resStr: string = ""
		let resBool: boolean = false
		{
			if (val == 1) {
				resInt = 100
			} else if (val == 2) {
				resInt = 200
				resStr = "set string for val 2"
			} else {

			}
			// all are unassigned here, so will take zero values

			return [resInt, resStr, resBool]
		}})(3)

	$.println(n5) // Expected: 0
	$.println(t5) // Expected: ""
	$.println(o5) // Expected: false
}

