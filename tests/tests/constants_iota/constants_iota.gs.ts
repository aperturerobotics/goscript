// Generated file based on constants_iota.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type ByteSize = number

export const _: number = iota

export const KB: ByteSize = 1 << (10 * iota)

export const MB: ByteSize = 0

export const GB: ByteSize = 0

export const TB: ByteSize = 0

export type Direction = number

export const North: Direction = iota

export const East: Direction = 0

export const South: Direction = 0

export const West: Direction = 0

export const Red: number = iota

export const Green: number = 0

export const Blue: number = 0

export const Sunday: number = iota

export const Monday: number = 0

export const Tuesday: number = 0

export const Wednesday: number = 0

export const Thursday: number = 0

export const Friday: number = 0

export const Saturday: number = 0

export const First: number = iota + 1

export const Second: number = iota + 1

export const Third: number = iota + 1

export const A: number = iota * 2

export const B: number = 0

export const C: number = 0

export async function main(): Promise<void> {
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
