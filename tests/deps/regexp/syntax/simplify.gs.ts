// Generated file based on simplify.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_op_string from "./op_string.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"
import "./op_string.gs.ts"
import "./parse.gs.ts"
import "./regexp.gs.ts"

export function simplify1(op: __goscript_regexp.Op, flags: __goscript_parse.Flags, sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
	// Special case: repeat the empty string as much as
	// you want, but it's still the empty string.
	if ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub).Op, 8) == $.uint(2, 8)) {
		return sub
	}
	// The operators are idempotent if the flags match.
	if (($.uint(op, 8) == $.uint($.pointerValue<__goscript_regexp.Regexp>(sub).Op, 8)) && ($.uint((flags & 32), 16) == $.uint(($.pointerValue<__goscript_regexp.Regexp>(sub).Flags & 32), 16))) {
		return sub
	}
	if ((((re != null) && ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(op, 8))) && ($.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Flags & 32), 16) == $.uint((flags & 32), 16))) && (sub == $.arrayIndex($.pointerValue<__goscript_regexp.Regexp>(re).Sub!, 0))) {
		return re
	}

	re = new __goscript_regexp.Regexp({Op: $.uint(op, 8), Flags: $.uint(flags, 16)})
	$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 0), sub)
	return re
}
