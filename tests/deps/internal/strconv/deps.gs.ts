// Generated file based on deps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function float64frombits(__goscriptParam0: number): number {
	let b: $.VarRef<number> = $.varRef(__goscriptParam0)
	return $.pointerValue<number>((b as any))
}

export function float32frombits(__goscriptParam1: number): number {
	let b: $.VarRef<number> = $.varRef(__goscriptParam1)
	return $.pointerValue<number>((b as any))
}

export function float64bits(__goscriptParam2: number): number {
	let f: $.VarRef<number> = $.varRef(__goscriptParam2)
	return $.uint($.pointerValue<number>((f as any)), 64)
}

export function float32bits(__goscriptParam3: number): number {
	let f: $.VarRef<number> = $.varRef(__goscriptParam3)
	return $.uint($.pointerValue<number>((f as any)), 32)
}

export function inf(sign: number): number {
	let v: number = 0
	if (sign >= 0) {
		v = $.uint("9218868437227405312", 64)
	} else {
		v = $.uint("18442240474082181120", 64)
	}
	return float64frombits($.uint(v, 64))
}

export function isNaN(f: number): boolean {
	let _is: boolean = false
	return f != f
}

export function nan(): number {
	return float64frombits($.uint("9221120237041090561", 64))
}
