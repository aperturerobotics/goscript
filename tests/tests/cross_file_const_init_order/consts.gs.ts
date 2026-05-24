// Generated file based on consts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_register from "./register.gs.ts"
import "./register.gs.ts"

export const Store: number = 0

export let Default: __goscript_register.thing = undefined as unknown as __goscript_register.thing

export function __goscript_get_Default(): __goscript_register.thing {
	if (((Default) as any) === undefined) {
		Default = $.markAsStructValue($.cloneStructValue(__goscript_register.newThing()))
	}
	return Default
}

export function __goscript_set_Default(value: __goscript_register.thing): void {
	Default = value
}
