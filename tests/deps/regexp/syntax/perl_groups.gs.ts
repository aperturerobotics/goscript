// Generated file based on perl_groups.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_parse from "./parse.gs.ts"
import "./parse.gs.ts"

export let code1: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32)])

export function __goscript_set_code1(value: $.Slice<number>): void {
	code1 = value
}

export let code2: $.Slice<number> = $.arrayToSlice<number>([$.int(0x9, 32), $.int(0xa, 32), $.int(0xc, 32), $.int(0xd, 32), $.int(0x20, 32), $.int(0x20, 32)])

export function __goscript_set_code2(value: $.Slice<number>): void {
	code2 = value
}

export let code3: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32), $.int(0x41, 32), $.int(0x5a, 32), $.int(0x5f, 32), $.int(0x5f, 32), $.int(0x61, 32), $.int(0x7a, 32)])

export function __goscript_set_code3(value: $.Slice<number>): void {
	code3 = value
}

export let perlGroup: Map<string, __goscript_parse.charGroup> | null = undefined as unknown as Map<string, __goscript_parse.charGroup> | null

export function __goscript_get_perlGroup(): Map<string, __goscript_parse.charGroup> | null {
	if (((perlGroup) as any) === undefined) {
		perlGroup = new Map<string, __goscript_parse.charGroup>([["\\d", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code1}))], ["\\D", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code1}))], ["\\s", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code2}))], ["\\S", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code2}))], ["\\w", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code3}))], ["\\W", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code3}))]])
	}
	return perlGroup
}

export function __goscript_set_perlGroup(value: Map<string, __goscript_parse.charGroup> | null): void {
	perlGroup = value
}

export let code4: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32), $.int(0x41, 32), $.int(0x5a, 32), $.int(0x61, 32), $.int(0x7a, 32)])

export function __goscript_set_code4(value: $.Slice<number>): void {
	code4 = value
}

export let code5: $.Slice<number> = $.arrayToSlice<number>([$.int(0x41, 32), $.int(0x5a, 32), $.int(0x61, 32), $.int(0x7a, 32)])

export function __goscript_set_code5(value: $.Slice<number>): void {
	code5 = value
}

export let code6: $.Slice<number> = $.arrayToSlice<number>([$.int(0x0, 32), $.int(0x7f, 32)])

export function __goscript_set_code6(value: $.Slice<number>): void {
	code6 = value
}

export let code7: $.Slice<number> = $.arrayToSlice<number>([$.int(0x9, 32), $.int(0x9, 32), $.int(0x20, 32), $.int(0x20, 32)])

export function __goscript_set_code7(value: $.Slice<number>): void {
	code7 = value
}

export let code8: $.Slice<number> = $.arrayToSlice<number>([$.int(0x0, 32), $.int(0x1f, 32), $.int(0x7f, 32), $.int(0x7f, 32)])

export function __goscript_set_code8(value: $.Slice<number>): void {
	code8 = value
}

export let code9: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32)])

export function __goscript_set_code9(value: $.Slice<number>): void {
	code9 = value
}

export let code10: $.Slice<number> = $.arrayToSlice<number>([$.int(0x21, 32), $.int(0x7e, 32)])

export function __goscript_set_code10(value: $.Slice<number>): void {
	code10 = value
}

export let code11: $.Slice<number> = $.arrayToSlice<number>([$.int(0x61, 32), $.int(0x7a, 32)])

export function __goscript_set_code11(value: $.Slice<number>): void {
	code11 = value
}

export let code12: $.Slice<number> = $.arrayToSlice<number>([$.int(0x20, 32), $.int(0x7e, 32)])

export function __goscript_set_code12(value: $.Slice<number>): void {
	code12 = value
}

export let code13: $.Slice<number> = $.arrayToSlice<number>([$.int(0x21, 32), $.int(0x2f, 32), $.int(0x3a, 32), $.int(0x40, 32), $.int(0x5b, 32), $.int(0x60, 32), $.int(0x7b, 32), $.int(0x7e, 32)])

export function __goscript_set_code13(value: $.Slice<number>): void {
	code13 = value
}

export let code14: $.Slice<number> = $.arrayToSlice<number>([$.int(0x9, 32), $.int(0xd, 32), $.int(0x20, 32), $.int(0x20, 32)])

export function __goscript_set_code14(value: $.Slice<number>): void {
	code14 = value
}

export let code15: $.Slice<number> = $.arrayToSlice<number>([$.int(0x41, 32), $.int(0x5a, 32)])

export function __goscript_set_code15(value: $.Slice<number>): void {
	code15 = value
}

export let code16: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32), $.int(0x41, 32), $.int(0x5a, 32), $.int(0x5f, 32), $.int(0x5f, 32), $.int(0x61, 32), $.int(0x7a, 32)])

export function __goscript_set_code16(value: $.Slice<number>): void {
	code16 = value
}

export let code17: $.Slice<number> = $.arrayToSlice<number>([$.int(0x30, 32), $.int(0x39, 32), $.int(0x41, 32), $.int(0x46, 32), $.int(0x61, 32), $.int(0x66, 32)])

export function __goscript_set_code17(value: $.Slice<number>): void {
	code17 = value
}

export let posixGroup: Map<string, __goscript_parse.charGroup> | null = undefined as unknown as Map<string, __goscript_parse.charGroup> | null

export function __goscript_get_posixGroup(): Map<string, __goscript_parse.charGroup> | null {
	if (((posixGroup) as any) === undefined) {
		posixGroup = new Map<string, __goscript_parse.charGroup>([["[:alnum:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code4}))], ["[:^alnum:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code4}))], ["[:alpha:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code5}))], ["[:^alpha:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code5}))], ["[:ascii:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code6}))], ["[:^ascii:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code6}))], ["[:blank:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code7}))], ["[:^blank:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code7}))], ["[:cntrl:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code8}))], ["[:^cntrl:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code8}))], ["[:digit:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code9}))], ["[:^digit:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code9}))], ["[:graph:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code10}))], ["[:^graph:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code10}))], ["[:lower:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code11}))], ["[:^lower:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code11}))], ["[:print:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code12}))], ["[:^print:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code12}))], ["[:punct:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code13}))], ["[:^punct:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code13}))], ["[:space:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code14}))], ["[:^space:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code14}))], ["[:upper:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code15}))], ["[:^upper:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code15}))], ["[:word:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code16}))], ["[:^word:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code16}))], ["[:xdigit:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: +1, _class: code17}))], ["[:^xdigit:]", $.markAsStructValue(new __goscript_parse.charGroup({sign: -1, _class: code17}))]])
	}
	return posixGroup
}

export function __goscript_set_posixGroup(value: Map<string, __goscript_parse.charGroup> | null): void {
	posixGroup = value
}
