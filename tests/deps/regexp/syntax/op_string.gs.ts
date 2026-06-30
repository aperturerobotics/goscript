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
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 3 - 3)
	$.arrayIndex(x, 4 - 4)
	$.arrayIndex(x, 5 - 5)
	$.arrayIndex(x, 6 - 6)
	$.arrayIndex(x, 7 - 7)
	$.arrayIndex(x, 8 - 8)
	$.arrayIndex(x, 9 - 9)
	$.arrayIndex(x, 10 - 10)
	$.arrayIndex(x, 11 - 11)
	$.arrayIndex(x, 12 - 12)
	$.arrayIndex(x, 13 - 13)
	$.arrayIndex(x, 14 - 14)
	$.arrayIndex(x, 15 - 15)
	$.arrayIndex(x, 16 - 16)
	$.arrayIndex(x, 17 - 17)
	$.arrayIndex(x, 18 - 18)
	$.arrayIndex(x, 19 - 19)
	$.arrayIndex(x, 128 - 128)
}

export let _Op_index_0: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(7, 8), $.uint(17, 8), $.uint(24, 8), $.uint(33, 8), $.uint(45, 8), $.uint(52, 8), $.uint(61, 8), $.uint(68, 8), $.uint(77, 8), $.uint(84, 8), $.uint(96, 8), $.uint(110, 8), $.uint(117, 8), $.uint(121, 8), $.uint(125, 8), $.uint(130, 8), $.uint(136, 8), $.uint(142, 8), $.uint(151, 8)])

export function __goscript_set__Op_index_0(__goscriptValue: Uint8Array): void {
	_Op_index_0 = __goscriptValue
}

export function Op_String(i: __goscript_regexp.Op): string {
	switch (true) {
		case ($.uint(1, 8) <= $.uint(i, 8)) && ($.uint(i, 8) <= $.uint(19, 8)):
		{
			i = i - ($.uint(1, 8))
			return $.sliceStringOrBytes("NoMatchEmptyMatchLiteralCharClassAnyCharNotNLAnyCharBeginLineEndLineBeginTextEndTextWordBoundaryNoWordBoundaryCaptureStarPlusQuestRepeatConcatAlternate", $.arrayIndex(_Op_index_0, i), $.arrayIndex(_Op_index_0, i + 1))
			break
		}
		case $.uint(i, 8) == $.uint(128, 8):
		{
			return "opPseudo"
			break
		}
		default:
		{
			return ("Op(" + strconv.FormatInt($.int64(i), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
