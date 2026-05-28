// Generated file based on constants_iota.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ByteSize = number

export type Direction = number

export const KB: ByteSize = 1024

export const MB: ByteSize = 1048576

export const GB: ByteSize = 1073741824

export const TB: ByteSize = 1099511627776

export const North: Direction = 0

export const East: Direction = 1

export const South: Direction = 2

export const West: Direction = 3

export const Red: number = 0

export const Green: number = 1

export const Blue: number = 2

export const Sunday: number = 0

export const Monday: number = 1

export const Tuesday: number = 2

export const Wednesday: number = 3

export const Thursday: number = 4

export const Friday: number = 5

export const Saturday: number = 6

export const First: number = 1

export const Second: number = 2

export const Third: number = 3

export const A: number = 0

export const B: number = 2

export const C: number = 4

export async function main(): globalThis.Promise<void> {
	$.println("ByteSize constants:")
	$.println("KB:", $.int(1024))
	$.println("MB:", $.int(1048576))
	$.println("GB:", $.int(1073741824))
	$.println("TB:", $.int(1099511627776))

	$.println("Direction constants:")
	$.println("North:", $.int(0))
	$.println("East:", $.int(1))
	$.println("South:", $.int(2))
	$.println("West:", $.int(3))

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

if ($.isMainScript(import.meta)) {
	await main()
}
