// Generated file based on atoc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_atof from "./atof.gs.ts"

import * as __goscript_atoi from "./atoi.gs.ts"
import "./atof.gs.ts"
import "./atoi.gs.ts"

export function ParseComplex(s: string, bitSize: number): [$.Complex, $.GoError] {
	let size = 64
	if (bitSize == 64) {
		size = 32
	}

	// Remove parentheses, if any.
	if ((($.len(s) >= 2) && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(40, 8))) && ($.uint($.indexStringOrBytes(s, $.len(s) - 1), 8) == $.uint(41, 8))) {
		s = $.sliceStringOrBytes(s, 1, $.len(s) - 1)
	}

	let pending: $.GoError = null as $.GoError

	// Read real part (possibly imaginary part if followed by 'i').
	let [re, n, err] = __goscript_atof.parseFloatPrefix(s, size)
	if (err != null) {
		if (!$.comparableEqual(err, 1)) {
			return [$.complex(0, 0), err]
		}
		pending = err
	}
	s = $.sliceStringOrBytes(s, n, undefined)

	// If we have nothing left, we're done.
	if ($.len(s) == 0) {
		return [$.complex(re, 0), pending]
	}

	// Otherwise, look at the next character.
	switch ($.indexStringOrBytes(s, 0)) {
		case 43:
		{
			if (($.len(s) > 1) && ($.uint($.indexStringOrBytes(s, 1), 8) != $.uint(43, 8))) {
				s = $.sliceStringOrBytes(s, 1, undefined)
			}
			break
		}
		case 45:
		{
			break
		}
		case 105:
		{
			if ($.len(s) == 1) {
				return [$.complex(0, re), pending]
			}
		}
		default:
		{
			return [$.complex(0, 0), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
			break
		}
	}

	// Read imaginary part.
	let __goscriptTuple0: any = __goscript_atof.parseFloatPrefix(s, size)
	let im = __goscriptTuple0[0]
	n = __goscriptTuple0[1]
	err = __goscriptTuple0[2]
	if (err != null) {
		if (!$.comparableEqual(err, 1)) {
			return [$.complex(0, 0), err]
		}
		pending = err
	}
	s = $.sliceStringOrBytes(s, n, undefined)
	if (!$.stringEqual(s, "i")) {
		return [$.complex(0, 0), $.namedValueInterfaceValue<$.GoError>(2, "strconv.Error", {"Error": __goscript_atoi.Error_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "strconv.Error" })]
	}
	return [$.complex(re, im), pending]
}
