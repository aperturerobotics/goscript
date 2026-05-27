// Generated file based on op_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_regexp from "./regexp.gs.ts"
import "@goscript/strconv/index.js"
import "./regexp.gs.ts"

export const _Op_name_0: string = "NoMatchEmptyMatchLiteralCharClassAnyCharNotNLAnyCharBeginLineEndLineBeginTextEndTextWordBoundaryNoWordBoundaryCaptureStarPlusQuestRepeatConcatAlternate"

export const _Op_name_1: string = "opPseudo"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	x[1 - 1]
	x[2 - 2]
	x[3 - 3]
	x[4 - 4]
	x[5 - 5]
	x[6 - 6]
	x[7 - 7]
	x[8 - 8]
	x[9 - 9]
	x[10 - 10]
	x[11 - 11]
	x[12 - 12]
	x[13 - 13]
	x[14 - 14]
	x[15 - 15]
	x[16 - 16]
	x[17 - 17]
	x[18 - 18]
	x[19 - 19]
	x[128 - 128]
}

export let _Op_index_0: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(7, 8), $.uint(17, 8), $.uint(24, 8), $.uint(33, 8), $.uint(45, 8), $.uint(52, 8), $.uint(61, 8), $.uint(68, 8), $.uint(77, 8), $.uint(84, 8), $.uint(96, 8), $.uint(110, 8), $.uint(117, 8), $.uint(121, 8), $.uint(125, 8), $.uint(130, 8), $.uint(136, 8), $.uint(142, 8), $.uint(151, 8)])

export function __goscript_set__Op_index_0(__goscriptValue: Uint8Array): void {
	_Op_index_0 = __goscriptValue
}

export function Op_String(i: __goscript_regexp.Op): string {
	switch (true) {
		case (1 <= i) && (i <= 19):
		{
			i -= $.uint(1, 8)
			return $.sliceStringOrBytes(_Op_name_0, _Op_index_0[i], _Op_index_0[i + 1])
			break
		}
		case $.uint(i, 8) == $.uint(128, 8):
		{
			return _Op_name_1
			break
		}
		default:
		{
			return ("Op(" + strconv.FormatInt($.int($.int(i)), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
