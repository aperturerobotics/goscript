// Generated file based on consts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_register from "./register.gs.ts"
import "./register.gs.ts"

export const Store: number = 0

export var Default: __goscript_register.thing

export function __goscript_init_Default(): void {
	if (((Default) as any) === undefined) {
		Default = $.markAsStructValue($.cloneStructValue(__goscript_register.newThing()))
	}
}

export function __goscript_get_Default(): __goscript_register.thing {
	if (((Default) as any) === undefined) {
		__goscript_init_Default()
	}
	return Default
}

export function __goscript_set_Default(__goscriptValue: __goscript_register.thing): void {
	Default = __goscriptValue
}
