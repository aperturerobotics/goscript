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
	$.println("KB:", $.int(KB))
	$.println("MB:", $.int(MB))
	$.println("GB:", $.int(GB))
	$.println("TB:", $.int(TB))

	$.println("Direction constants:")
	$.println("North:", $.int(North))
	$.println("East:", $.int(East))
	$.println("South:", $.int(South))
	$.println("West:", $.int(West))

	$.println("Color constants:")
	$.println("Red:", Red)
	$.println("Green:", Green)
	$.println("Blue:", Blue)

	$.println("Day constants:")
	$.println("Sunday:", Sunday)
	$.println("Monday:", Monday)
	$.println("Tuesday:", Tuesday)
	$.println("Wednesday:", Wednesday)
	$.println("Thursday:", Thursday)
	$.println("Friday:", Friday)
	$.println("Saturday:", Saturday)

	$.println("Arithmetic constants:")
	$.println("First:", First)
	$.println("Second:", Second)
	$.println("Third:", Third)

	$.println("Multiplication constants:")
	$.println("A:", A)
	$.println("B:", B)
	$.println("C:", C)
}

if ($.isMainScript(import.meta)) {
	await main()
}
