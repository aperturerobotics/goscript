// Generated file based on op_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_regexp from "./regexp.gs.ts"

export const _Op_name_0: string = "NoMatchEmptyMatchLiteralCharClassAnyCharNotNLAnyCharBeginLineEndLineBeginTextEndTextWordBoundaryNoWordBoundaryCaptureStarPlusQuestRepeatConcatAlternate"

export const _Op_name_1: string = "opPseudo"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	x[__goscript_regexp.OpNoMatch - 1]
	x[__goscript_regexp.OpEmptyMatch - 2]
	x[__goscript_regexp.OpLiteral - 3]
	x[__goscript_regexp.OpCharClass - 4]
	x[__goscript_regexp.OpAnyCharNotNL - 5]
	x[__goscript_regexp.OpAnyChar - 6]
	x[__goscript_regexp.OpBeginLine - 7]
	x[__goscript_regexp.OpEndLine - 8]
	x[__goscript_regexp.OpBeginText - 9]
	x[__goscript_regexp.OpEndText - 10]
	x[__goscript_regexp.OpWordBoundary - 11]
	x[__goscript_regexp.OpNoWordBoundary - 12]
	x[__goscript_regexp.OpCapture - 13]
	x[__goscript_regexp.OpStar - 14]
	x[__goscript_regexp.OpPlus - 15]
	x[__goscript_regexp.OpQuest - 16]
	x[__goscript_regexp.OpRepeat - 17]
	x[__goscript_regexp.OpConcat - 18]
	x[__goscript_regexp.OpAlternate - 19]
	x[__goscript_regexp.opPseudo - 128]
}

export let _Op_index_0: number[] = [0, 7, 17, 24, 33, 45, 52, 61, 68, 77, 84, 96, 110, 117, 121, 125, 130, 136, 142, 151]

export function __goscript_set__Op_index_0(value: number[]): void {
	_Op_index_0 = value
}

export function Op_String(i: __goscript_regexp.Op): string {
	switch (true) {
		case (1 <= i) && (i <= 19):
		{
			i -= 1
			return $.sliceStringOrBytes(_Op_name_0, _Op_index_0[i], _Op_index_0[i + 1])
			break
		}
		case i == 128:
		{
			return _Op_name_1
			break
		}
		default:
		{
			return ("Op(" + strconv.FormatInt($.int(i), 10)) + ")"
			break
		}
	}
}
