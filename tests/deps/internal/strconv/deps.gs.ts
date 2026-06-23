// Generated file based on deps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function float64frombits(__goscriptParam0: bigint): number {
	let b: $.VarRef<bigint> = $.varRef(__goscriptParam0)
	return $.unsafePointerRef<number>((b as any)).value
}

export function float32frombits(__goscriptParam1: number): number {
	let b: $.VarRef<number> = $.varRef(__goscriptParam1)
	return $.unsafePointerRef<number>((b as any)).value
}

export function float64bits(__goscriptParam2: number): bigint {
	let f: $.VarRef<number> = $.varRef(__goscriptParam2)
	return $.unsafePointerRef<bigint>((f as any)).value
}

export function float32bits(__goscriptParam3: number): number {
	let f: $.VarRef<number> = $.varRef(__goscriptParam3)
	return $.uint($.unsafePointerRef<number>((f as any)).value, 32)
}

export function inf(sign: number): number {
	let v: bigint = 0n
	if (sign >= 0) {
		v = 9218868437227405312n
	} else {
		v = 18442240474082181120n
	}
	return float64frombits(v)
}

export function isNaN(f: number): boolean {
	let _is: boolean = false
	return f != f
}

export function nan(): number {
	return float64frombits(9221120237041090561n)
}
