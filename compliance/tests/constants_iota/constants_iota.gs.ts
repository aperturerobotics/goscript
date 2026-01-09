// Generated file based on constants_iota.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

// ignore first value by assigning to blank identifier

export let KB: ByteSize = (1 << (10 * 0))

export let MB: ByteSize = 0

export let GB: ByteSize = 0

export let TB: ByteSize = 0

export let North: Direction = 0

export let East: Direction = 0

export let South: Direction = 0

export let West: Direction = 0

export let Red: number = 0

export let Green: number = 0

export let Blue: number = 0

export let Sunday: number = 0

export let Monday: number = 0

export let Tuesday: number = 0

export let Wednesday: number = 0

export let Thursday: number = 0

export let Friday: number = 0

export let Saturday: number = 0

export let First: number = 0 + 1

export let Second: number = 0 + 1

export let Third: number = 0 + 1

export let A: number = 0 * 2

export let B: number = 0

export let C: number = 0

export type ByteSize = number;

export type Direction = number;

export async function main(): Promise<void> {
	$.println("ByteSize constants:")
	$.println("KB:", 1024)
	$.println("MB:", 1048576)
	$.println("GB:", 1073741824)
	$.println("TB:", 1099511627776)

	$.println("Direction constants:")
	$.println("North:", 0)
	$.println("East:", 1)
	$.println("South:", 2)
	$.println("West:", 3)

	$.println("Color constants:")
	$.println("Red:", 0)
	$.println("Green:", 1)
	$.println("Blue:", 2)

	$.println("Day constants:")
	$.println("Sunday:", 0)
	$.println("Monday:", 1)
	$.println("Tuesday:", 2)
	$.println("Wednesday:", 3)
	$.println("Thursday:", 4)
	$.println("Friday:", 5)
	$.println("Saturday:", 6)

	$.println("Arithmetic constants:")
	$.println("First:", 1)
	$.println("Second:", 2)
	$.println("Third:", 3)

	$.println("Multiplication constants:")
	$.println("A:", 0)
	$.println("B:", 2)
	$.println("C:", 4)
}

