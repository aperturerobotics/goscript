// Generated file based on c.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_b from "./b.gs.ts"
import "./b.gs.ts"

export var marker: number

export function __goscript_init_marker(): void {
	if (((marker) as any) === undefined) {
		marker = 1
	}
}

export function __goscript_get_marker(): number {
	if (((marker) as any) === undefined) {
		__goscript_init_marker()
	}
	return marker
}

export function __goscript_set_marker(__goscriptValue: number): void {
	marker = __goscriptValue
}

function __goscriptInit0(): void {
	__goscript_b.readTable()
}

__goscriptInit0()
