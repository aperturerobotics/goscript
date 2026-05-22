// Generated file based on simplify.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_op_string from "./op_string.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"

export function simplify1(op: __goscript_regexp.Op, flags: __goscript_parse.Flags, sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
	// Special case: repeat the empty string as much as
	// you want, but it's still the empty string.
	if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op == __goscript_regexp.OpEmptyMatch) {
		return sub
	}
	// The operators are idempotent if the flags match.
	if ((op == $.pointerValue<__goscript_regexp.Regexp>(sub).Op) && ((flags & __goscript_parse.NonGreedy) == ($.pointerValue<__goscript_regexp.Regexp>(sub).Flags & __goscript_parse.NonGreedy))) {
		return sub
	}
	if ((((re != null) && ($.pointerValue<__goscript_regexp.Regexp>(re).Op == op)) && (($.pointerValue<__goscript_regexp.Regexp>(re).Flags & __goscript_parse.NonGreedy) == (flags & __goscript_parse.NonGreedy))) && (sub == $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0])) {
		return re
	}

	re = new __goscript_regexp.Regexp({Op: op, Flags: flags})
	$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 0), sub)
	return re
}
