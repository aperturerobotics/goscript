// Generated file based on parse.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sort from "@goscript/sort/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_op_string from "./op_string.gs.ts"

import * as __goscript_perl_groups from "./perl_groups.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"

import * as __goscript_simplify from "./simplify.gs.ts"

export type ErrorCode = string

export type Flags = number

export class Error {
	public get Code(): ErrorCode {
		return this._fields.Code.value
	}
	public set Code(value: ErrorCode) {
		this._fields.Code.value = value
	}

	public get Expr(): string {
		return this._fields.Expr.value
	}
	public set Expr(value: string) {
		this._fields.Expr.value = value
	}

	public _fields: {
		Code: $.VarRef<ErrorCode>
		Expr: $.VarRef<string>
	}

	constructor(init?: Partial<{Code?: ErrorCode, Expr?: string}>) {
		this._fields = {
			Code: $.varRef(init?.Code ?? ""),
			Expr: $.varRef(init?.Expr ?? "")
		}
	}

	public clone(): Error {
		const cloned = new Error()
		cloned._fields = {
			Code: $.varRef(this._fields.Code.value),
			Expr: $.varRef(this._fields.Expr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: Error | $.VarRef<Error> | null = this
		return ((("error parsing regexp: " + ErrorCode_String($.pointerValue<Error>(e).Code)) + ": `") + $.pointerValue<Error>(e).Expr) + "`"
	}

	static __typeInfo = $.registerStructType(
		"syntax.Error",
		() => new Error(),
		[{ name: "Error", args: [], returns: [] }],
		Error,
		{"Code": "syntax.ErrorCode", "Expr": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class parser {
	public get flags(): Flags {
		return this._fields.flags.value
	}
	public set flags(value: Flags) {
		this._fields.flags.value = value
	}

	public get stack(): $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> {
		return this._fields.stack.value
	}
	public set stack(value: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>) {
		this._fields.stack.value = value
	}

	public get free(): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		return this._fields.free.value
	}
	public set free(value: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null) {
		this._fields.free.value = value
	}

	public get numCap(): number {
		return this._fields.numCap.value
	}
	public set numCap(value: number) {
		this._fields.numCap.value = value
	}

	public get wholeRegexp(): string {
		return this._fields.wholeRegexp.value
	}
	public set wholeRegexp(value: string) {
		this._fields.wholeRegexp.value = value
	}

	public get tmpClass(): $.Slice<number> {
		return this._fields.tmpClass.value
	}
	public set tmpClass(value: $.Slice<number>) {
		this._fields.tmpClass.value = value
	}

	public get numRegexp(): number {
		return this._fields.numRegexp.value
	}
	public set numRegexp(value: number) {
		this._fields.numRegexp.value = value
	}

	public get numRunes(): number {
		return this._fields.numRunes.value
	}
	public set numRunes(value: number) {
		this._fields.numRunes.value = value
	}

	public get repeats(): number {
		return this._fields.repeats.value
	}
	public set repeats(value: number) {
		this._fields.repeats.value = value
	}

	public get height(): Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null {
		return this._fields.height.value
	}
	public set height(value: Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null) {
		this._fields.height.value = value
	}

	public get size(): Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null {
		return this._fields.size.value
	}
	public set size(value: Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null) {
		this._fields.size.value = value
	}

	public _fields: {
		flags: $.VarRef<Flags>
		stack: $.VarRef<$.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>>
		free: $.VarRef<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>
		numCap: $.VarRef<number>
		wholeRegexp: $.VarRef<string>
		tmpClass: $.VarRef<$.Slice<number>>
		numRegexp: $.VarRef<number>
		numRunes: $.VarRef<number>
		repeats: $.VarRef<number>
		height: $.VarRef<Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null>
		size: $.VarRef<Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null>
	}

	constructor(init?: Partial<{flags?: Flags, stack?: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>, free?: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, numCap?: number, wholeRegexp?: string, tmpClass?: $.Slice<number>, numRegexp?: number, numRunes?: number, repeats?: number, height?: Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null, size?: Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null}>) {
		this._fields = {
			flags: $.varRef(init?.flags ?? 0),
			stack: $.varRef(init?.stack ?? null),
			free: $.varRef(init?.free ?? null),
			numCap: $.varRef(init?.numCap ?? 0),
			wholeRegexp: $.varRef(init?.wholeRegexp ?? ""),
			tmpClass: $.varRef(init?.tmpClass ?? null),
			numRegexp: $.varRef(init?.numRegexp ?? 0),
			numRunes: $.varRef(init?.numRunes ?? 0),
			repeats: $.varRef(init?.repeats ?? 0),
			height: $.varRef(init?.height ?? null),
			size: $.varRef(init?.size ?? null)
		}
	}

	public clone(): parser {
		const cloned = new parser()
		cloned._fields = {
			flags: $.varRef(this._fields.flags.value),
			stack: $.varRef(this._fields.stack.value),
			free: $.varRef(this._fields.free.value),
			numCap: $.varRef(this._fields.numCap.value),
			wholeRegexp: $.varRef(this._fields.wholeRegexp.value),
			tmpClass: $.varRef(this._fields.tmpClass.value),
			numRegexp: $.varRef(this._fields.numRegexp.value),
			numRunes: $.varRef(this._fields.numRunes.value),
			repeats: $.varRef(this._fields.repeats.value),
			height: $.varRef(this._fields.height.value),
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public alternate(): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		// Scan down to find pseudo-operator (.
		// There are no | above (.
		let i = $.len($.pointerValue<parser>(p).stack)
		while ((i > 0) && ($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![i - 1]).Op < __goscript_regexp.opPseudo)) {
			i--
		}
		let subs = $.goSlice($.pointerValue<parser>(p).stack, i, undefined)
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, i)

		// Make sure top class is clean.
		// All the others already are (see swapVerticalBar).
		if ($.len(subs) > 0) {
			cleanAlt(subs![$.len(subs) - 1])
		}

		// Empty alternate is special case
		// (shouldn't happen but easy to handle).
		if ($.len(subs) == 0) {
			return $.pointerValue<parser>(p).push($.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpNoMatch))
		}

		return $.pointerValue<parser>(p).push(parser.prototype.collapse.call(p, subs, __goscript_regexp.OpAlternate))
	}

	public appendGroup(r: $.Slice<number>, g: charGroup): $.Slice<number> {
		let p: parser | $.VarRef<parser> | null = this
		if (($.pointerValue<parser>(p).flags & FoldCase) == 0) {
			if (g.sign < 0) {
				r = appendNegatedClass(r, g.class)
			} else {
				r = appendClass(r, g.class)
			}
		} else {
			let tmp = $.goSlice($.pointerValue<parser>(p).tmpClass, undefined, 0)
			tmp = appendFoldedClass(tmp, g.class)
			$.pointerValue<parser>(p).tmpClass = tmp
			tmp = cleanClass($.pointerValue<parser>(p)._fields.tmpClass)
			if (g.sign < 0) {
				r = appendNegatedClass(r, tmp)
			} else {
				r = appendClass(r, tmp)
			}
		}
		return r
	}

	public calcHeight(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, force: boolean): number {
		let p: parser | $.VarRef<parser> | null = this
		if (!force) {
			{
				let [h, ok] = $.mapGet($.pointerValue<parser>(p).height, re, 0)
				if (ok) {
					return h
				}
			}
		}
		let h = 1
		for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); __rangeIndex++) {
			let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![__rangeIndex]
			let hsub = $.pointerValue<parser>(p).calcHeight(sub, false)
			if (h < (1 + hsub)) {
				h = 1 + hsub
			}
		}
		$.mapSet($.pointerValue<parser>(p).height, re, h)
		return h
	}

	public calcSize(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, force: boolean): number {
		let p: parser | $.VarRef<parser> | null = this
		if (!force) {
			{
				let __goscriptTuple0 = $.mapGet($.pointerValue<parser>(p).size, re, 0)
				let size = __goscriptTuple0[0]
				let ok = __goscriptTuple0[1]
				if (ok) {
					return size
				}
			}
		}

		let size: number = 0
		switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
			case __goscript_regexp.OpLiteral:
			{
				size = $.int($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune))
				break
			}
			case __goscript_regexp.OpCapture:
			case __goscript_regexp.OpStar:
			{
				size = 2 + $.pointerValue<parser>(p).calcSize($.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false)
				break
			}
			case __goscript_regexp.OpPlus:
			case __goscript_regexp.OpQuest:
			{
				size = 1 + $.pointerValue<parser>(p).calcSize($.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false)
				break
			}
			case __goscript_regexp.OpConcat:
			{
				for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); __rangeIndex++) {
					let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![__rangeIndex]
					size += $.pointerValue<parser>(p).calcSize(sub, false)
				}
				break
			}
			case __goscript_regexp.OpAlternate:
			{
				for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); __rangeIndex++) {
					let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![__rangeIndex]
					size += $.pointerValue<parser>(p).calcSize(sub, false)
				}
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 1) {
					size += $.int($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)) - 1
				}
				break
			}
			case __goscript_regexp.OpRepeat:
			{
				let sub = $.pointerValue<parser>(p).calcSize($.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false)
				if ($.pointerValue<__goscript_regexp.Regexp>(re).Max == -1) {
					if ($.pointerValue<__goscript_regexp.Regexp>(re).Min == 0) {
						size = 2 + sub
					} else {
						size = 1 + ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Min) * sub)
					}
					break
				}
				// x{2,5} = xx(x(x(x)?)?)?
				size = ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Max) * sub) + $.int($.pointerValue<__goscript_regexp.Regexp>(re).Max - $.pointerValue<__goscript_regexp.Regexp>(re).Min)
				break
			}
		}

		size = $.max(1, size)
		$.mapSet($.pointerValue<parser>(p).size, re, size)
		return size
	}

	public checkHeight(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		let p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).numRegexp < maxHeight) {
			return
		}
		if ($.pointerValue<parser>(p).height == null) {
			$.pointerValue<parser>(p).height = $.makeMap<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number>()
			for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<parser>(p).stack); __rangeIndex++) {
				let re = $.pointerValue<parser>(p).stack![__rangeIndex]
				$.pointerValue<parser>(p).checkHeight(re)
			}
		}
		if ($.pointerValue<parser>(p).calcHeight(re, true) > maxHeight) {
			$.panic($.namedValueInterfaceValue<any>(ErrNestingDepth, "syntax.ErrorCode", {String: ErrorCode_String}))
		}
	}

	public checkLimits(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		const p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).numRunes > maxRunes) {
			$.panic($.namedValueInterfaceValue<any>(ErrLarge, "syntax.ErrorCode", {String: ErrorCode_String}))
		}
		$.pointerValue<parser>(p).checkSize(re)
		$.pointerValue<parser>(p).checkHeight(re)
	}

	public checkSize(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		let p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).size == null) {
			// We haven't started tracking size yet.
			// Do a relatively cheap check to see if we need to start.
			// Maintain the product of all the repeats we've seen
			// and don't track if the total number of regexp nodes
			// we've seen times the repeat product is in budget.
			if ($.pointerValue<parser>(p).repeats == 0) {
				$.pointerValue<parser>(p).repeats = 1
			}
			if ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpRepeat) {
				let n = $.pointerValue<__goscript_regexp.Regexp>(re).Max
				if (n == -1) {
					n = $.pointerValue<__goscript_regexp.Regexp>(re).Min
				}
				if (n <= 0) {
					n = 1
				}
				if ($.int(n) > (Math.trunc(maxSize / $.pointerValue<parser>(p).repeats))) {
					$.pointerValue<parser>(p).repeats = maxSize
				} else {
					$.pointerValue<parser>(p).repeats *= $.int(n)
				}
			}
			if ($.int($.pointerValue<parser>(p).numRegexp) < (Math.trunc(maxSize / $.pointerValue<parser>(p).repeats))) {
				return
			}

			// We need to start tracking size.
			// Make the map and belatedly populate it
			// with info about everything we've constructed so far.
			$.pointerValue<parser>(p).size = $.makeMap<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number>()
			for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<parser>(p).stack); __rangeIndex++) {
				let re = $.pointerValue<parser>(p).stack![__rangeIndex]
				$.pointerValue<parser>(p).checkSize(re)
			}
		}

		if ($.pointerValue<parser>(p).calcSize(re, true) > maxSize) {
			$.panic($.namedValueInterfaceValue<any>(ErrLarge, "syntax.ErrorCode", {String: ErrorCode_String}))
		}
	}

	public collapse(subs: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>, op: __goscript_regexp.Op): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if ($.len(subs) == 1) {
			return subs![0]
		}
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(op)
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 0)
		for (let __rangeIndex = 0; __rangeIndex < $.len(subs); __rangeIndex++) {
			let sub = subs![__rangeIndex]
			if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op == op) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Sub, ...($.pointerValue<__goscript_regexp.Regexp>(sub).Sub ?? []))
				$.pointerValue<parser>(p).reuse(sub)
			} else {
				$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Sub, sub)
			}
		}
		if (op == __goscript_regexp.OpAlternate) {
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub = parser.prototype.factor.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub)
			if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) == 1) {
				let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
				re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
				$.pointerValue<parser>(p).reuse(old)
			}
		}
		return re
	}

	public concat(): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		$.pointerValue<parser>(p).maybeConcat(-1, 0)

		// Scan down to find pseudo-operator | or (.
		let i = $.len($.pointerValue<parser>(p).stack)
		while ((i > 0) && ($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![i - 1]).Op < __goscript_regexp.opPseudo)) {
			i--
		}
		let subs = $.goSlice($.pointerValue<parser>(p).stack, i, undefined)
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, i)

		// Empty concatenation is special case.
		if ($.len(subs) == 0) {
			return $.pointerValue<parser>(p).push($.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpEmptyMatch))
		}

		return $.pointerValue<parser>(p).push(parser.prototype.collapse.call(p, subs, __goscript_regexp.OpConcat))
	}

	public factor(sub: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>): $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> {
		const p: parser | $.VarRef<parser> | null = this
		if ($.len(sub) < 2) {
			return sub
		}

		// Round 1: Factor out common literal prefixes.
		let str: $.Slice<number> = null
		let strflags: Flags = 0
		let start = 0
		let out = $.goSlice(sub, undefined, 0)
		for (let i = 0; i <= $.len(sub); i++) {
			// Invariant: the Regexps that were in sub[0:start] have been
			// used or marked for reuse, and the slice space has been reused
			// for out (len(out) <= start).
			//
			// Invariant: sub[start:i] consists of regexps that all begin
			// with str as modified by strflags.
			let istr: $.Slice<number> = null
			let iflags: Flags = 0
			if (i < $.len(sub)) {
				let __goscriptTuple1 = parser.prototype.leadingString.call(p, sub![i])
				istr = __goscriptTuple1[0]
				iflags = __goscriptTuple1[1]
				if (iflags == strflags) {
					let same = 0
					while (((same < $.len(str)) && (same < $.len(istr))) && (str![same] == istr![same])) {
						same++
					}
					if (same > 0) {
						// Matches at least one rune in current range.
						// Keep going around.
						str = $.goSlice(str, undefined, same)
						continue
					}
				}
			}

			// Found end of a run with common leading literal string:
			// sub[start:i] all begin with str[:len(str)], but sub[i]
			// does not even begin with str[0].
			//
			// Factor out common string and append factored expression to out.
			if (i == start) {
			} else {
				if (i == (start + 1)) {
					// Just one: don't bother factoring.
					out = $.append(out, sub![start])
				} else {
					// Construct factored form: prefix(suffix1|suffix2|...)
					let prefix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpLiteral)
					$.pointerValue<__goscript_regexp.Regexp>(prefix).Flags = strflags
					$.pointerValue<__goscript_regexp.Regexp>(prefix).Rune = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(prefix).Rune, undefined, 0), ...(str ?? []))

					for (let j = start; j < i; j++) {
						sub![j] = parser.prototype.removeLeadingString.call(p, sub![j], $.len(str))
						$.pointerValue<parser>(p).checkLimits(sub![j])
					}
					let suffix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.collapse.call(p, $.goSlice(sub, start, i), __goscript_regexp.OpAlternate)

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpConcat)
					$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, 0), prefix, suffix)
					out = $.append(out, re)
				}
			}

			// Prepare for next iteration.
			start = i
			str = istr
			strflags = iflags
		}
		sub = out

		// Round 2: Factor out common simple prefixes,
		// just the first piece of each concatenation.
		// This will be good enough a lot of the time.
		//
		// Complex subexpressions (e.g. involving quantifiers)
		// are not safe to factor because that collapses their
		// distinct paths through the automaton, which affects
		// correctness in some cases.
		start = 0
		out = $.goSlice(sub, undefined, 0)
		let first: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = null
		for (let i = 0; i <= $.len(sub); i++) {
			// Invariant: the Regexps that were in sub[0:start] have been
			// used or marked for reuse, and the slice space has been reused
			// for out (len(out) <= start).
			//
			// Invariant: sub[start:i] consists of regexps that all begin with ifirst.
			let ifirst: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = null
			if (i < $.len(sub)) {
				ifirst = parser.prototype.leadingRegexp.call(p, sub![i])
				if (((first != null) && __goscript_regexp.Regexp.prototype.Equal.call(first, ifirst)) && (isCharClass(first) || ((($.pointerValue<__goscript_regexp.Regexp>(first).Op == __goscript_regexp.OpRepeat) && ($.pointerValue<__goscript_regexp.Regexp>(first).Min == $.pointerValue<__goscript_regexp.Regexp>(first).Max)) && isCharClass($.pointerValue<__goscript_regexp.Regexp>(first).Sub![0])))) {
					continue
				}
			}

			// Found end of a run with common leading regexp:
			// sub[start:i] all begin with first but sub[i] does not.
			//
			// Factor out common regexp and append factored expression to out.
			if (i == start) {
			} else {
				if (i == (start + 1)) {
					// Just one: don't bother factoring.
					out = $.append(out, sub![start])
				} else {
					// Construct factored form: prefix(suffix1|suffix2|...)
					let prefix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = first
					for (let j = start; j < i; j++) {
						let reuse = j != start
						sub![j] = parser.prototype.removeLeadingRegexp.call(p, sub![j], reuse)
						$.pointerValue<parser>(p).checkLimits(sub![j])
					}
					let suffix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.collapse.call(p, $.goSlice(sub, start, i), __goscript_regexp.OpAlternate)

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpConcat)
					$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, 0), prefix, suffix)
					out = $.append(out, re)
				}
			}

			// Prepare for next iteration.
			start = i
			first = ifirst
		}
		sub = out

		// Round 3: Collapse runs of single literals into character classes.
		start = 0
		out = $.goSlice(sub, undefined, 0)
		for (let i = 0; i <= $.len(sub); i++) {
			// Invariant: the Regexps that were in sub[0:start] have been
			// used or marked for reuse, and the slice space has been reused
			// for out (len(out) <= start).
			//
			// Invariant: sub[start:i] consists of regexps that are either
			// literal runes or character classes.
			if ((i < $.len(sub)) && isCharClass(sub![i])) {
				continue
			}

			// sub[i] is not a char or char class;
			// emit char class for sub[start:i]...
			if (i == start) {
			} else {
				if (i == (start + 1)) {
					out = $.append(out, sub![start])
				} else {
					// Make new char class.
					// Start with most complex regexp in sub[start].
					let max = start
					for (let j = start + 1; j < i; j++) {
						if (($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Op < $.pointerValue<__goscript_regexp.Regexp>(sub![j]).Op) || (($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Op == $.pointerValue<__goscript_regexp.Regexp>(sub![j]).Op) && ($.len($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Rune) < $.len($.pointerValue<__goscript_regexp.Regexp>(sub![j]).Rune)))) {
							max = j
						}
					}
					let __goscriptAssign0_0: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = sub![max]
					let __goscriptAssign0_1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = sub![start]
					sub![start] = __goscriptAssign0_0
					sub![max] = __goscriptAssign0_1

					for (let j = start + 1; j < i; j++) {
						mergeCharClass(sub![start], sub![j])
						$.pointerValue<parser>(p).reuse(sub![j])
					}
					cleanAlt(sub![start])
					out = $.append(out, sub![start])
				}
			}

			// ... and then emit sub[i].
			if (i < $.len(sub)) {
				out = $.append(out, sub![i])
			}
			start = i + 1
		}
		sub = out

		// Round 4: Collapse runs of empty matches into a single empty match.
		start = 0
		out = $.goSlice(sub, undefined, 0)
		for (let i = 0; i < $.len(sub); i++) {
			if ((((i + 1) < $.len(sub)) && ($.pointerValue<__goscript_regexp.Regexp>(sub![i]).Op == __goscript_regexp.OpEmptyMatch)) && ($.pointerValue<__goscript_regexp.Regexp>(sub![i + 1]).Op == __goscript_regexp.OpEmptyMatch)) {
				continue
			}
			out = $.append(out, sub![i])
		}
		sub = out

		return sub
	}

	public leadingRegexp(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpEmptyMatch) {
			return null
		}
		if (($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpConcat) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
			if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op == __goscript_regexp.OpEmptyMatch) {
				return null
			}
			return sub
		}
		return re
	}

	public leadingString(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): [$.Slice<number>, Flags] {
		const p: parser | $.VarRef<parser> | null = this
		if (($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpConcat) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
		}
		if ($.pointerValue<__goscript_regexp.Regexp>(re).Op != __goscript_regexp.OpLiteral) {
			return [null, 0]
		}
		return [$.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.pointerValue<__goscript_regexp.Regexp>(re).Flags & FoldCase]
	}

	public literal(r: number): void {
		const p: parser | $.VarRef<parser> | null = this
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpLiteral)
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.pointerValue<parser>(p).flags
		if (($.pointerValue<parser>(p).flags & FoldCase) != 0) {
			r = minFoldRune(r)
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune0[0] = r
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 1)
		$.pointerValue<parser>(p).push(re)
	}

	public maybeConcat(r: number, flags: Flags): boolean {
		let p: parser | $.VarRef<parser> | null = this
		let n = $.len($.pointerValue<parser>(p).stack)
		if (n < 2) {
			return false
		}

		let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
		if ((($.pointerValue<__goscript_regexp.Regexp>(re1).Op != __goscript_regexp.OpLiteral) || ($.pointerValue<__goscript_regexp.Regexp>(re2).Op != __goscript_regexp.OpLiteral)) || (($.pointerValue<__goscript_regexp.Regexp>(re1).Flags & FoldCase) != ($.pointerValue<__goscript_regexp.Regexp>(re2).Flags & FoldCase))) {
			return false
		}

		// Push re1 into re2.
		$.pointerValue<__goscript_regexp.Regexp>(re2).Rune = $.append($.pointerValue<__goscript_regexp.Regexp>(re2).Rune, ...($.pointerValue<__goscript_regexp.Regexp>(re1).Rune ?? []))

		// Reuse re1 if possible.
		if (r >= 0) {
			$.pointerValue<__goscript_regexp.Regexp>(re1).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re1).Rune0, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re1).Rune![0] = r
			$.pointerValue<__goscript_regexp.Regexp>(re1).Flags = flags
			return true
		}

		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 1)
		$.pointerValue<parser>(p).reuse(re1)
		return false
	}

	public newRegexp(op: __goscript_regexp.Op): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).free
		if (re != null) {
			$.pointerValue<parser>(p).free = $.pointerValue<__goscript_regexp.Regexp>(re).Sub0[0]
			$.assignStruct($.pointerValue<__goscript_regexp.Regexp>(re), $.markAsStructValue(new __goscript_regexp.Regexp()))
		} else {
			re = new __goscript_regexp.Regexp()
			$.pointerValue<parser>(p).numRegexp++
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Op = op
		return re
	}

	public op(op: __goscript_regexp.Op): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(op)
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.pointerValue<parser>(p).flags
		return $.pointerValue<parser>(p).push(re)
	}

	public async parseClass(s: string): globalThis.Promise<[string, $.GoError]> {
		const p: parser | $.VarRef<parser> | null = this
		let rest: string = ""
		let err: $.GoError = null
		let t = $.sliceStringOrBytes(s, 1, undefined)
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpCharClass)
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.pointerValue<parser>(p).flags
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0)

		let sign = +1
		if (((t as string) != "") && ($.indexStringOrBytes(t, 0) == 94)) {
			sign = -1
			t = $.sliceStringOrBytes(t, 1, undefined)

			// If character class does not match \n, add it here,
			// so that negation later will do the right thing.
			if (($.pointerValue<parser>(p).flags & ClassNL) == 0) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Rune, 10, 10)
			}
		}

		let _class = $.pointerValue<__goscript_regexp.Regexp>(re).Rune
		let first = true
		while ((((t as string) == "") || ($.indexStringOrBytes(t, 0) != 93)) || first) {
			// POSIX: - is only okay unescaped as first or last in class.
			// Perl: - is okay anywhere.
			if ((((((t as string) != "") && ($.indexStringOrBytes(t, 0) == 45)) && (($.pointerValue<parser>(p).flags & PerlX) == 0)) && !first) && (($.len(t) == 1) || ($.indexStringOrBytes(t, 1) != 93))) {
				let [, size] = utf8.DecodeRuneInString($.sliceStringOrBytes(t, 1, undefined))
				return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidCharRange, Expr: $.sliceStringOrBytes(t, undefined, 1 + size)}), "*syntax.Error")]
			}
			first = false

			// Look for POSIX [:alnum:] etc.
			if ((($.len(t) > 2) && ($.indexStringOrBytes(t, 0) == 91)) && ($.indexStringOrBytes(t, 1) == 58)) {
				let [nclass, nt, __goscriptShadow0] = parser.prototype.parseNamedClass.call(p, t, _class)
				if (__goscriptShadow0 != null) {
					return ["", __goscriptShadow0]
				}
				if (nclass != null) {
					let __goscriptAssign1_0: $.Slice<number> = nclass
					let __goscriptAssign1_1: string = nt
					_class = __goscriptAssign1_0
					t = __goscriptAssign1_1
					continue
				}
			}

			// Look for Unicode character group like \p{Han}.
			let [nclass, nt, __goscriptShadow1] = await $.pointerValue<parser>(p).parseUnicodeClass(t, _class)
			if (__goscriptShadow1 != null) {
				return ["", __goscriptShadow1]
			}
			if (nclass != null) {
				let __goscriptAssign2_0: $.Slice<number> = nclass
				let __goscriptAssign2_1: string = nt
				_class = __goscriptAssign2_0
				t = __goscriptAssign2_1
				continue
			}

			// Look for Perl character class symbols (extension).
			{
				let [__goscriptShadow2, __goscriptShadow3] = $.pointerValue<parser>(p).parsePerlClassEscape(t, _class)
				if (__goscriptShadow2 != null) {
					let __goscriptAssign3_0: $.Slice<number> = __goscriptShadow2
					let __goscriptAssign3_1: string = __goscriptShadow3
					_class = __goscriptAssign3_0
					t = __goscriptAssign3_1
					continue
				}
			}

			// Single character or simple range.
			let rng = t
			let lo: number = 0
			let hi: number = 0
			{
				let __goscriptTuple2 = parser.prototype.parseClassChar.call(p, t, s)
				lo = __goscriptTuple2[0]
				t = __goscriptTuple2[1]
				__goscriptShadow1 = __goscriptTuple2[2]
				if (__goscriptShadow1 != null) {
					return ["", __goscriptShadow1]
				}
			}
			hi = lo
			// [a-] means (a|-) so check for final ].
			if ((($.len(t) >= 2) && ($.indexStringOrBytes(t, 0) == 45)) && ($.indexStringOrBytes(t, 1) != 93)) {
				t = $.sliceStringOrBytes(t, 1, undefined)
				{
					let __goscriptTuple3 = parser.prototype.parseClassChar.call(p, t, s)
					hi = __goscriptTuple3[0]
					t = __goscriptTuple3[1]
					__goscriptShadow1 = __goscriptTuple3[2]
					if (__goscriptShadow1 != null) {
						return ["", __goscriptShadow1]
					}
				}
				if (hi < lo) {
					rng = $.sliceStringOrBytes(rng, undefined, $.len(rng) - $.len(t))
					return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidCharRange, Expr: rng}), "*syntax.Error")]
				}
			}
			if (($.pointerValue<parser>(p).flags & FoldCase) == 0) {
				_class = appendRange(_class, lo, hi)
			} else {
				_class = appendFoldedRange(_class, lo, hi)
			}
		}
		t = $.sliceStringOrBytes(t, 1, undefined)

		// Use &re.Rune instead of &class to avoid allocation.
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = _class
		_class = cleanClass($.pointerValue<__goscript_regexp.Regexp>(re)._fields.Rune)
		if (sign < 0) {
			_class = negateClass(_class)
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = _class
		$.pointerValue<parser>(p).push(re)
		return [t, null]
	}

	public parseClassChar(s: string, wholeClass: string): [number, string, $.GoError] {
		const p: parser | $.VarRef<parser> | null = this
		let r: number = 0
		let rest: string = ""
		let err: $.GoError = null
		if ((s as string) == "") {
			return [0, "", $.interfaceValue<$.GoError>(new Error({Code: ErrMissingBracket, Expr: wholeClass}), "*syntax.Error")]
		}

		// Allow regular escape sequences even though
		// many need not be escaped in this context.
		if ($.indexStringOrBytes(s, 0) == 92) {
			return parser.prototype.parseEscape.call(p, s)
		}

		return nextRune(s)
	}

	public parseEscape(s: string): [number, string, $.GoError] {
		const p: parser | $.VarRef<parser> | null = this
		let r: number = 0
		let rest: string = ""
		let err: $.GoError = null
		let t = $.sliceStringOrBytes(s, 1, undefined)
		if ((t as string) == "") {
			return [0, "", $.interfaceValue<$.GoError>(new Error({Code: ErrTrailingBackslash, Expr: ""}), "*syntax.Error")]
		}
		let __goscriptTuple4 = nextRune(t)
		let c = __goscriptTuple4[0]
		t = __goscriptTuple4[1]
		err = __goscriptTuple4[2]
		if (err != null) {
			return [0, "", err]
		}

		Switch: {
			switch (c) {
				default:
				{
					if ((c < utf8.RuneSelf) && !isalnum(c)) {
						// Escaped non-word characters are always themselves.
						// PCRE is not quite so rigorous: it accepts things like
						// \q, but we don't. We once rejected \_, but too many
						// programs and people insist on using it, so allow \_.
						return [c, t, null]
					}
					break
				}
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				{
					if ((((t as string) == "") || ($.indexStringOrBytes(t, 0) < 48)) || ($.indexStringOrBytes(t, 0) > 55)) {
						break
					}
				}
				case 48:
				{
					r = c - 48
					for (let i = 1; i < 3; i++) {
						if ((((t as string) == "") || ($.indexStringOrBytes(t, 0) < 48)) || ($.indexStringOrBytes(t, 0) > 55)) {
							break
						}
						r = ((r * 8) + $.int($.indexStringOrBytes(t, 0), 32)) - 48
						t = $.sliceStringOrBytes(t, 1, undefined)
					}
					return [r, t, null]
					break
				}
				case 120:
				{
					if ((t as string) == "") {
						break
					}
					{
						let __goscriptTuple5 = nextRune(t)
						c = __goscriptTuple5[0]
						t = __goscriptTuple5[1]
						err = __goscriptTuple5[2]
						if (err != null) {
							return [0, "", err]
						}
					}
					if (c == 123) {
						// Any number of digits in braces.
						// Perl accepts any text at all; it ignores all text
						// after the first non-hex digit. We require only hex digits,
						// and at least one.
						let nhex = 0
						r = 0
						while (true) {
							if ((t as string) == "") {
								break Switch
							}
							{
								let __goscriptTuple6 = nextRune(t)
								c = __goscriptTuple6[0]
								t = __goscriptTuple6[1]
								err = __goscriptTuple6[2]
								if (err != null) {
									return [0, "", err]
								}
							}
							if (c == 125) {
								break
							}
							let v = unhex(c)
							if (v < 0) {
								break Switch
							}
							r = (r * 16) + v
							if (r > unicode.MaxRune) {
								break Switch
							}
							nhex++
						}
						if (nhex == 0) {
							break Switch
						}
						return [r, t, null]
					}

					// Easy case: two hex digits.
					let x = unhex(c)
					{
						let __goscriptTuple7 = nextRune(t)
						c = __goscriptTuple7[0]
						t = __goscriptTuple7[1]
						err = __goscriptTuple7[2]
						if (err != null) {
							return [0, "", err]
						}
					}
					let y = unhex(c)
					if ((x < 0) || (y < 0)) {
						break
					}
					return [(x * 16) + y, t, null]
					break
				}
				case 97:
				{
					return [7, t, err]
					break
				}
				case 102:
				{
					return [12, t, err]
					break
				}
				case 110:
				{
					return [10, t, err]
					break
				}
				case 114:
				{
					return [13, t, err]
					break
				}
				case 116:
				{
					return [9, t, err]
					break
				}
				case 118:
				{
					return [11, t, err]
					break
				}
			}
		}
		return [0, "", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidEscape, Expr: $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))}), "*syntax.Error")]
	}

	public parseInt(s: string): [number, string, boolean] {
		const p: parser | $.VarRef<parser> | null = this
		let n: number = 0
		let rest: string = ""
		let ok: boolean = false
		if ((((s as string) == "") || ($.indexStringOrBytes(s, 0) < 48)) || (57 < $.indexStringOrBytes(s, 0))) {
			return [n, rest, ok]
		}
		// Disallow leading zeros.
		if (((($.len(s) >= 2) && ($.indexStringOrBytes(s, 0) == 48)) && (48 <= $.indexStringOrBytes(s, 1))) && ($.indexStringOrBytes(s, 1) <= 57)) {
			return [n, rest, ok]
		}
		let t = s
		while ((((s as string) != "") && (48 <= $.indexStringOrBytes(s, 0))) && ($.indexStringOrBytes(s, 0) <= 57)) {
			s = $.sliceStringOrBytes(s, 1, undefined)
		}
		rest = s
		ok = true
		// Have digits, compute value.
		t = $.sliceStringOrBytes(t, undefined, $.len(t) - $.len(s))
		for (let i = 0; i < $.len(t); i++) {
			// Avoid overflow.
			if (n >= 1e8) {
				n = -1
				break
			}
			n = ((n * 10) + $.int($.indexStringOrBytes(t, i))) - 48
		}
		return [n, rest, ok]
	}

	public parseNamedClass(s: string, r: $.Slice<number>): [$.Slice<number>, string, $.GoError] {
		const p: parser | $.VarRef<parser> | null = this
		let out: $.Slice<number> = null
		let rest: string = ""
		let err: $.GoError = null
		if ((($.len(s) < 2) || ($.indexStringOrBytes(s, 0) != 91)) || ($.indexStringOrBytes(s, 1) != 58)) {
			return [out, rest, err]
		}

		let i = strings.Index($.sliceStringOrBytes(s, 2, undefined), ":]")
		if (i < 0) {
			return [out, rest, err]
		}
		i += 2
		let name = $.sliceStringOrBytes(s, 0, i + 2)
		s = $.sliceStringOrBytes(s, i + 2, undefined)
		let g = $.markAsStructValue($.cloneStructValue($.mapGet(__goscript_perl_groups.__goscript_get_posixGroup(), name, $.markAsStructValue(new charGroup()))[0]))
		if (g.sign == 0) {
			return [null, "", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidCharRange, Expr: name}), "*syntax.Error")]
		}
		return [$.pointerValue<parser>(p).appendGroup(r, $.markAsStructValue($.cloneStructValue(g))), s, null]
	}

	public parsePerlClassEscape(s: string, r: $.Slice<number>): [$.Slice<number>, string] {
		const p: parser | $.VarRef<parser> | null = this
		let out: $.Slice<number> = null
		let rest: string = ""
		if (((($.pointerValue<parser>(p).flags & PerlX) == 0) || ($.len(s) < 2)) || ($.indexStringOrBytes(s, 0) != 92)) {
			return [out, rest]
		}
		let g = $.markAsStructValue($.cloneStructValue($.mapGet(__goscript_perl_groups.__goscript_get_perlGroup(), $.sliceStringOrBytes(s, 0, 2), $.markAsStructValue(new charGroup()))[0]))
		if (g.sign == 0) {
			return [out, rest]
		}
		return [$.pointerValue<parser>(p).appendGroup(r, $.markAsStructValue($.cloneStructValue(g))), $.sliceStringOrBytes(s, 2, undefined)]
	}

	public parsePerlFlags(s: string): [string, $.GoError] {
		let p: parser | $.VarRef<parser> | null = this
		let rest: string = ""
		let err: $.GoError = null
		let t = s

		// Check for named captures, first introduced in Python's regexp library.
		// As usual, there are three slightly different syntaxes:
		//
		//   (?P<name>expr)   the original, introduced by Python
		//   (?<name>expr)    the .NET alteration, adopted by Perl 5.10
		//   (?'name'expr)    another .NET alteration, adopted by Perl 5.10
		//
		// Perl 5.10 gave in and implemented the Python version too,
		// but they claim that the last two are the preferred forms.
		// PCRE and languages based on it (specifically, PHP and Ruby)
		// support all three as well. EcmaScript 4 uses only the Python form.
		//
		// In both the open source world (via Code Search) and the
		// Google source tree, (?P<expr>name) and (?<expr>name) are the
		// dominant forms of named captures and both are supported.
		let startsWithP = (($.len(t) > 4) && ($.indexStringOrBytes(t, 2) == 80)) && ($.indexStringOrBytes(t, 3) == 60)
		let startsWithName = ($.len(t) > 3) && ($.indexStringOrBytes(t, 2) == 60)

		if (startsWithP || startsWithName) {
			// position of expr start
			let exprStartPos = 4
			if (startsWithName) {
				exprStartPos = 3
			}

			// Pull out name.
			let end = strings.IndexRune(t, 62)
			if (end < 0) {
				{
					err = checkUTF8(t)
					if (err != null) {
						return ["", err]
					}
				}
				return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidNamedCapture, Expr: s}), "*syntax.Error")]
			}

			let capture = $.sliceStringOrBytes(t, undefined, end + 1)
			let name = $.sliceStringOrBytes(t, exprStartPos, end)
			{
				err = checkUTF8(name)
				if (err != null) {
					return ["", err]
				}
			}
			if (!isValidCaptureName(name)) {
				return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidNamedCapture, Expr: capture}), "*syntax.Error")]
			}

			// Like ordinary capture, but named.
			$.pointerValue<parser>(p).numCap++
			let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).op(opLeftParen)
			$.pointerValue<__goscript_regexp.Regexp>(re).Cap = $.pointerValue<parser>(p).numCap
			$.pointerValue<__goscript_regexp.Regexp>(re).Name = name
			return [$.sliceStringOrBytes(t, end + 1, undefined), null]
		}

		// Non-capturing group. Might also twiddle Perl flags.
		let c: number = 0
		t = $.sliceStringOrBytes(t, 2, undefined)
		let flags = $.pointerValue<parser>(p).flags
		let sign = +1
		let sawFlag = false
		Loop: while ((t as string) != "") {
			{
				let __goscriptTuple8 = nextRune(t)
				c = __goscriptTuple8[0]
				t = __goscriptTuple8[1]
				err = __goscriptTuple8[2]
				if (err != null) {
					return ["", err]
				}
			}
			switch (c) {
				default:
				{
					break Loop
					break
				}
				case 105:
				{
					flags |= FoldCase
					sawFlag = true
					break
				}
				case 109:
				{
					flags = flags & ~(OneLine)
					sawFlag = true
					break
				}
				case 115:
				{
					flags |= DotNL
					sawFlag = true
					break
				}
				case 85:
				{
					flags |= NonGreedy
					sawFlag = true
					break
				}
				case 45:
				{
					if (sign < 0) {
						break Loop
					}
					sign = -1
					// Invert flags so that | above turn into &^ and vice versa.
					// We'll invert flags again before using it below.
					flags = ~flags
					sawFlag = false
					break
				}
				case 58:
				case 41:
				{
					if (sign < 0) {
						if (!sawFlag) {
							break Loop
						}
						flags = ~flags
					}
					if (c == 58) {
						// Open new group
						$.pointerValue<parser>(p).op(opLeftParen)
					}
					$.pointerValue<parser>(p).flags = flags
					return [t, null]
					break
				}
			}
		}

		return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidPerlOp, Expr: $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))}), "*syntax.Error")]
	}

	public parseRepeat(s: string): [number, number, string, boolean] {
		const p: parser | $.VarRef<parser> | null = this
		let min: number = 0
		let max: number = 0
		let rest: string = ""
		let ok: boolean = false
		if (((s as string) == "") || ($.indexStringOrBytes(s, 0) != 123)) {
			return [min, max, rest, ok]
		}
		s = $.sliceStringOrBytes(s, 1, undefined)
		let ok1: boolean = false
		{
			let __goscriptTuple9 = parser.prototype.parseInt.call(p, s)
			min = __goscriptTuple9[0]
			s = __goscriptTuple9[1]
			ok1 = __goscriptTuple9[2]
			if (!ok1) {
				return [min, max, rest, ok]
			}
		}
		if ((s as string) == "") {
			return [min, max, rest, ok]
		}
		if ($.indexStringOrBytes(s, 0) != 44) {
			max = min
		} else {
			s = $.sliceStringOrBytes(s, 1, undefined)
			if ((s as string) == "") {
				return [min, max, rest, ok]
			}
			if ($.indexStringOrBytes(s, 0) == 125) {
				max = -1
			} else {
				{
					let __goscriptTuple10 = parser.prototype.parseInt.call(p, s)
					max = __goscriptTuple10[0]
					s = __goscriptTuple10[1]
					ok1 = __goscriptTuple10[2]
					if (!ok1) {
						return [min, max, rest, ok]
					} else {
						if (max < 0) {
							// parseInt found too big a number
							min = -1
						}
					}
				}
			}
		}
		if (((s as string) == "") || ($.indexStringOrBytes(s, 0) != 125)) {
			return [min, max, rest, ok]
		}
		rest = $.sliceStringOrBytes(s, 1, undefined)
		ok = true
		return [min, max, rest, ok]
	}

	public parseRightParen(): $.GoError {
		let p: parser | $.VarRef<parser> | null = this
		$.pointerValue<parser>(p).concat()
		if ($.pointerValue<parser>(p).swapVerticalBar()) {
			// pop vertical bar
			$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, $.len($.pointerValue<parser>(p).stack) - 1)
		}
		$.pointerValue<parser>(p).alternate()

		let n = $.len($.pointerValue<parser>(p).stack)
		if (n < 2) {
			return $.interfaceValue<$.GoError>(new Error({Code: ErrUnexpectedParen, Expr: $.pointerValue<parser>(p).wholeRegexp}), "*syntax.Error")
		}
		let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 2)
		if ($.pointerValue<__goscript_regexp.Regexp>(re2).Op != opLeftParen) {
			return $.interfaceValue<$.GoError>(new Error({Code: ErrUnexpectedParen, Expr: $.pointerValue<parser>(p).wholeRegexp}), "*syntax.Error")
		}
		// Restore flags at time of paren.
		$.pointerValue<parser>(p).flags = $.pointerValue<__goscript_regexp.Regexp>(re2).Flags
		if ($.pointerValue<__goscript_regexp.Regexp>(re2).Cap == 0) {
			// Just for grouping.
			$.pointerValue<parser>(p).push(re1)
		} else {
			$.pointerValue<__goscript_regexp.Regexp>(re2).Op = __goscript_regexp.OpCapture
			$.pointerValue<__goscript_regexp.Regexp>(re2).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re2).Sub0, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re2).Sub![0] = re1
			$.pointerValue<parser>(p).push(re2)
		}
		return null
	}

	public async parseUnicodeClass(s: string, r: $.Slice<number>): globalThis.Promise<[$.Slice<number>, string, $.GoError]> {
		let p: parser | $.VarRef<parser> | null = this
		let out: $.Slice<number> = null
		let rest: string = ""
		let err: $.GoError = null
		if ((((($.pointerValue<parser>(p).flags & UnicodeGroups) == 0) || ($.len(s) < 2)) || ($.indexStringOrBytes(s, 0) != 92)) || (($.indexStringOrBytes(s, 1) != 112) && ($.indexStringOrBytes(s, 1) != 80))) {
			return [out, rest, err]
		}

		// Committed to parse or return error.
		let sign = +1
		if ($.indexStringOrBytes(s, 1) == 80) {
			sign = -1
		}
		let t = $.sliceStringOrBytes(s, 2, undefined)
		let __goscriptTuple11 = nextRune(t)
		let c = __goscriptTuple11[0]
		t = __goscriptTuple11[1]
		err = __goscriptTuple11[2]
		if (err != null) {
			return [out, rest, err]
		}
		let seq: string = ""
		let name: string = ""
		if (c != 123) {
			// Single-letter name.
			seq = $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))
			name = $.sliceStringOrBytes(seq, 2, undefined)
		} else {
			// Name is in braces.
			let end = strings.IndexRune(s, 125)
			if (end < 0) {
				{
					err = checkUTF8(s)
					if (err != null) {
						return [out, rest, err]
					}
				}
				return [null, "", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidCharRange, Expr: s}), "*syntax.Error")]
			}
			let __goscriptAssign4_0: string = $.sliceStringOrBytes(s, undefined, end + 1)
			let __goscriptAssign4_1: string = $.sliceStringOrBytes(s, end + 1, undefined)
			seq = __goscriptAssign4_0
			t = __goscriptAssign4_1
			name = $.sliceStringOrBytes(s, 3, end)
			{
				err = checkUTF8(name)
				if (err != null) {
					return [out, rest, err]
				}
			}
		}

		// Group can have leading negation too.  \p{^Han} == \P{Han}, \P{^Han} == \p{Han}.
		if (((name as string) != "") && ($.indexStringOrBytes(name, 0) == 94)) {
			sign = -sign
			name = $.sliceStringOrBytes(name, 1, undefined)
		}

		let __goscriptTuple12 = await unicodeTable(name)
		let tab: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = __goscriptTuple12[0]
		let fold: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = __goscriptTuple12[1]
		let tsign = __goscriptTuple12[2]
		if (tab == null) {
			return [null, "", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidCharRange, Expr: seq}), "*syntax.Error")]
		}
		if (tsign < 0) {
			sign = -sign
		}

		if ((($.pointerValue<parser>(p).flags & FoldCase) == 0) || (fold == null)) {
			if (sign > 0) {
				r = appendTable(r, tab)
			} else {
				r = appendNegatedTable(r, tab)
			}
		} else {
			// Merge and clean tab and fold in a temporary buffer.
			// This is necessary for the negative case and just tidy
			// for the positive case.
			let tmp = $.goSlice($.pointerValue<parser>(p).tmpClass, undefined, 0)
			tmp = appendTable(tmp, tab)
			tmp = appendTable(tmp, fold)
			$.pointerValue<parser>(p).tmpClass = tmp
			tmp = cleanClass($.pointerValue<parser>(p)._fields.tmpClass)
			if (sign > 0) {
				r = appendClass(r, tmp)
			} else {
				r = appendNegatedClass(r, tmp)
			}
		}
		return [r, t, null]
	}

	public parseVerticalBar(): void {
		const p: parser | $.VarRef<parser> | null = this
		$.pointerValue<parser>(p).concat()

		// The concatenation we just parsed is on top of the stack.
		// If it sits above an opVerticalBar, swap it below
		// (things below an opVerticalBar become an alternation).
		// Otherwise, push a new vertical bar.
		if (!$.pointerValue<parser>(p).swapVerticalBar()) {
			$.pointerValue<parser>(p).op(opVerticalBar)
		}
	}

	public push(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		$.pointerValue<parser>(p).numRunes += $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune)
		if ((($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpCharClass) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2)) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![1])) {
			// Single rune.
			if ($.pointerValue<parser>(p).maybeConcat($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], $.pointerValue<parser>(p).flags & ~(FoldCase))) {
				return null
			}
			$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpLiteral
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.pointerValue<parser>(p).flags & ~(FoldCase)
		} else {
			if ((((((($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpCharClass) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 4)) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![1])) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2] == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![3])) && (unicode.SimpleFold($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0]) == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![2])) && (unicode.SimpleFold($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2]) == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![0])) || ((((($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpCharClass) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2)) && (($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] + 1) == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![1])) && (unicode.SimpleFold($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0]) == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![1])) && (unicode.SimpleFold($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1]) == $.pointerValue<__goscript_regexp.Regexp>(re).Rune![0]))) {
				// Case-insensitive rune like [Aa] or [Δδ].
				if ($.pointerValue<parser>(p).maybeConcat($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], $.pointerValue<parser>(p).flags | FoldCase)) {
					return null
				}

				// Rewrite as (case-insensitive) literal.
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpLiteral
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, 1)
				$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.pointerValue<parser>(p).flags | FoldCase
			} else {
				// Incremental concatenation.
				$.pointerValue<parser>(p).maybeConcat(-1, 0)
			}
		}

		$.pointerValue<parser>(p).stack = $.append($.pointerValue<parser>(p).stack, re)
		$.pointerValue<parser>(p).checkLimits(re)
		return re
	}

	public removeLeadingRegexp(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, reuse: boolean): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if (($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpConcat) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			if (reuse) {
				$.pointerValue<parser>(p).reuse($.pointerValue<__goscript_regexp.Regexp>(re).Sub![0])
			}
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, $.copy($.pointerValue<__goscript_regexp.Regexp>(re).Sub, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, 1, undefined)))
			switch ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)) {
				case 0:
				{
					$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpEmptyMatch
					$.pointerValue<__goscript_regexp.Regexp>(re).Sub = null
					break
				}
				case 1:
				{
					let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
					re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
					$.pointerValue<parser>(p).reuse(old)
					break
				}
			}
			return re
		}
		if (reuse) {
			$.pointerValue<parser>(p).reuse(re)
		}
		return $.pointerValue<parser>(p).newRegexp(__goscript_regexp.OpEmptyMatch)
	}

	public removeLeadingString(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, n: number): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if (($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpConcat) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			// Removing a leading string in a concatenation
			// might simplify the concatenation.
			let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
			sub = parser.prototype.removeLeadingString.call(p, sub, n)
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub![0] = sub
			if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op == __goscript_regexp.OpEmptyMatch) {
				$.pointerValue<parser>(p).reuse(sub)
				switch ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)) {
					case 0:
					case 1:
					{
						$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpEmptyMatch
						$.pointerValue<__goscript_regexp.Regexp>(re).Sub = null
						break
					}
					case 2:
					{
						let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
						re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![1]
						$.pointerValue<parser>(p).reuse(old)
						break
					}
					default:
					{
						$.copy($.pointerValue<__goscript_regexp.Regexp>(re).Sub, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, 1, undefined))
						$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) - 1)
						break
					}
				}
			}
			return re
		}

		if ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpLiteral) {
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, $.copy($.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, n, undefined)))
			if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 0) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpEmptyMatch
			}
		}
		return re
	}

	public repeat(op: __goscript_regexp.Op, min: number, max: number, before: string, after: string, lastRepeat: string): [string, $.GoError] {
		let p: parser | $.VarRef<parser> | null = this
		let flags = $.pointerValue<parser>(p).flags
		if (($.pointerValue<parser>(p).flags & PerlX) != 0) {
			if (($.len(after) > 0) && ($.indexStringOrBytes(after, 0) == 63)) {
				after = $.sliceStringOrBytes(after, 1, undefined)
				flags ^= NonGreedy
			}
			if ((lastRepeat as string) != "") {
				// In Perl it is not allowed to stack repetition operators:
				// a** is a syntax error, not a doubled star, and a++ means
				// something else entirely, which we don't support!
				return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidRepeatOp, Expr: $.sliceStringOrBytes(lastRepeat, undefined, $.len(lastRepeat) - $.len(after))}), "*syntax.Error")]
			}
		}
		let n = $.len($.pointerValue<parser>(p).stack)
		if (n == 0) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrMissingRepeatArgument, Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
		}
		let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op >= __goscript_regexp.opPseudo) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrMissingRepeatArgument, Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
		}

		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).newRegexp(op)
		$.pointerValue<__goscript_regexp.Regexp>(re).Min = min
		$.pointerValue<__goscript_regexp.Regexp>(re).Max = max
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = flags
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 1)
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub![0] = sub
		$.pointerValue<parser>(p).stack![n - 1] = re
		$.pointerValue<parser>(p).checkLimits(re)

		if (((op == __goscript_regexp.OpRepeat) && ((min >= 2) || (max >= 2))) && !repeatIsValid(re, 1000)) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidRepeatSize, Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
		}

		return [after, null]
	}

	public reuse(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		let p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).height != null) {
			$.deleteMapEntry($.pointerValue<parser>(p).height, re)
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub0[0] = $.pointerValue<parser>(p).free
		$.pointerValue<parser>(p).free = re
	}

	public swapVerticalBar(): boolean {
		let p: parser | $.VarRef<parser> | null = this
		// If above and below vertical bar are literal or char class,
		// can merge into a single char class.
		let n = $.len($.pointerValue<parser>(p).stack)
		if ((((n >= 3) && ($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![n - 2]).Op == opVerticalBar)) && isCharClass($.pointerValue<parser>(p).stack![n - 1])) && isCharClass($.pointerValue<parser>(p).stack![n - 3])) {
			let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
			let re3: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 3]
			// Make re3 the more complex of the two.
			if ($.pointerValue<__goscript_regexp.Regexp>(re1).Op > $.pointerValue<__goscript_regexp.Regexp>(re3).Op) {
				let __goscriptAssign5_0: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re3
				let __goscriptAssign5_1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re1
				re1 = __goscriptAssign5_0
				re3 = __goscriptAssign5_1
				$.pointerValue<parser>(p).stack![n - 3] = re3
			}
			mergeCharClass(re3, re1)
			$.pointerValue<parser>(p).reuse(re1)
			$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 1)
			return true
		}

		if (n >= 2) {
			let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
			let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
			if ($.pointerValue<__goscript_regexp.Regexp>(re2).Op == opVerticalBar) {
				if (n >= 3) {
					// Now out of reach.
					// Clean opportunistically.
					cleanAlt($.pointerValue<parser>(p).stack![n - 3])
				}
				$.pointerValue<parser>(p).stack![n - 2] = re1
				$.pointerValue<parser>(p).stack![n - 1] = re2
				return true
			}
		}
		return false
	}

	static __typeInfo = $.registerStructType(
		"syntax.parser",
		() => new parser(),
		[{ name: "alternate", args: [], returns: [] }, { name: "appendGroup", args: [], returns: [] }, { name: "calcHeight", args: [], returns: [] }, { name: "calcSize", args: [], returns: [] }, { name: "checkHeight", args: [], returns: [] }, { name: "checkLimits", args: [], returns: [] }, { name: "checkSize", args: [], returns: [] }, { name: "collapse", args: [], returns: [] }, { name: "concat", args: [], returns: [] }, { name: "factor", args: [], returns: [] }, { name: "leadingRegexp", args: [], returns: [] }, { name: "leadingString", args: [], returns: [] }, { name: "literal", args: [], returns: [] }, { name: "maybeConcat", args: [], returns: [] }, { name: "newRegexp", args: [], returns: [] }, { name: "op", args: [], returns: [] }, { name: "parseClass", args: [], returns: [] }, { name: "parseClassChar", args: [], returns: [] }, { name: "parseEscape", args: [], returns: [] }, { name: "parseInt", args: [], returns: [] }, { name: "parseNamedClass", args: [], returns: [] }, { name: "parsePerlClassEscape", args: [], returns: [] }, { name: "parsePerlFlags", args: [], returns: [] }, { name: "parseRepeat", args: [], returns: [] }, { name: "parseRightParen", args: [], returns: [] }, { name: "parseUnicodeClass", args: [], returns: [] }, { name: "parseVerticalBar", args: [], returns: [] }, { name: "push", args: [], returns: [] }, { name: "removeLeadingRegexp", args: [], returns: [] }, { name: "removeLeadingString", args: [], returns: [] }, { name: "repeat", args: [], returns: [] }, { name: "reuse", args: [], returns: [] }, { name: "swapVerticalBar", args: [], returns: [] }],
		parser,
		{"flags": "syntax.Flags", "stack": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }, "free": { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, "numCap": { kind: $.TypeKind.Basic, name: "int" }, "wholeRegexp": { kind: $.TypeKind.Basic, name: "string" }, "tmpClass": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "numRegexp": { kind: $.TypeKind.Basic, name: "int" }, "numRunes": { kind: $.TypeKind.Basic, name: "int" }, "repeats": { kind: $.TypeKind.Basic, name: "int" }, "height": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "size": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class charGroup {
	public get sign(): number {
		return this._fields.sign.value
	}
	public set sign(value: number) {
		this._fields.sign.value = value
	}

	public get class(): $.Slice<number> {
		return this._fields.class.value
	}
	public set class(value: $.Slice<number>) {
		this._fields.class.value = value
	}

	public _fields: {
		sign: $.VarRef<number>
		class: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{sign?: number, class?: $.Slice<number>}>) {
		this._fields = {
			sign: $.varRef(init?.sign ?? 0),
			class: $.varRef(init?.class ?? null)
		}
	}

	public clone(): charGroup {
		const cloned = new charGroup()
		cloned._fields = {
			sign: $.varRef(this._fields.sign.value),
			class: $.varRef(this._fields.class.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"syntax.charGroup",
		() => new charGroup(),
		[],
		charGroup,
		{"sign": { kind: $.TypeKind.Basic, name: "int" }, "class": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class ranges {
	public get p(): $.VarRef<$.Slice<number>> | null {
		return this._fields.p.value
	}
	public set p(value: $.VarRef<$.Slice<number>> | null) {
		this._fields.p.value = value
	}

	public _fields: {
		p: $.VarRef<$.VarRef<$.Slice<number>> | null>
	}

	constructor(init?: Partial<{p?: $.VarRef<$.Slice<number>> | null}>) {
		this._fields = {
			p: $.varRef(init?.p ?? null)
		}
	}

	public clone(): ranges {
		const cloned = new ranges()
		cloned._fields = {
			p: $.varRef(this._fields.p.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Len(): number {
		const ra = this
		return Math.trunc($.len($.pointerValue<$.Slice<number>>(ra.p)) / 2)
	}

	public Less(i: number, j: number): boolean {
		const ra = this
		let p = $.pointerValue<$.Slice<number>>(ra.p)
		i *= 2
		j *= 2
		return (p![i] < p![j]) || ((p![i] == p![j]) && (p![i + 1] > p![j + 1]))
	}

	public Swap(i: number, j: number): void {
		const ra = this
		let p = $.pointerValue<$.Slice<number>>(ra.p)
		i *= 2
		j *= 2
		let __goscriptAssign6_0: number = p![j]
		let __goscriptAssign6_1: number = p![j + 1]
		let __goscriptAssign6_2: number = p![i]
		let __goscriptAssign6_3: number = p![i + 1]
		p![i] = __goscriptAssign6_0
		p![i + 1] = __goscriptAssign6_1
		p![j] = __goscriptAssign6_2
		p![j + 1] = __goscriptAssign6_3
	}

	static __typeInfo = $.registerStructType(
		"syntax.ranges",
		() => new ranges(),
		[{ name: "Len", args: [], returns: [] }, { name: "Less", args: [], returns: [] }, { name: "Swap", args: [], returns: [] }],
		ranges,
		{"p": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }}
	)
}

export const ErrInternalError: ErrorCode = "regexp/syntax: internal error"

export const ErrInvalidCharClass: ErrorCode = "invalid character class"

export const ErrInvalidCharRange: ErrorCode = "invalid character class range"

export const ErrInvalidEscape: ErrorCode = "invalid escape sequence"

export const ErrInvalidNamedCapture: ErrorCode = "invalid named capture"

export const ErrInvalidPerlOp: ErrorCode = "invalid or unsupported Perl syntax"

export const ErrInvalidRepeatOp: ErrorCode = "invalid nested repetition operator"

export const ErrInvalidRepeatSize: ErrorCode = "invalid repeat count"

export const ErrInvalidUTF8: ErrorCode = "invalid UTF-8"

export const ErrMissingBracket: ErrorCode = "missing closing ]"

export const ErrMissingParen: ErrorCode = "missing closing )"

export const ErrMissingRepeatArgument: ErrorCode = "missing argument to repetition operator"

export const ErrTrailingBackslash: ErrorCode = "trailing backslash at end of expression"

export const ErrUnexpectedParen: ErrorCode = "unexpected )"

export const ErrNestingDepth: ErrorCode = "expression nests too deeply"

export const ErrLarge: ErrorCode = "expression too large"

export const FoldCase: Flags = 1

export const Literal: Flags = 2

export const ClassNL: Flags = 4

export const DotNL: Flags = 8

export const OneLine: Flags = 16

export const NonGreedy: Flags = 32

export const PerlX: Flags = 64

export const UnicodeGroups: Flags = 128

export const WasDollar: Flags = 256

export const Simple: Flags = 512

export const MatchNL: Flags = 12

export const Perl: Flags = 212

export const POSIX: Flags = 0

export const opLeftParen: __goscript_regexp.Op = 128

export const opVerticalBar: __goscript_regexp.Op = 129

export const maxHeight: number = 1000

export const maxSize: number = 3355443

export const instSize: number = 40

export const maxRunes: number = 33554432

export const runeSize: number = 4

export const minFold: number = 65

export const maxFold: number = 125251

export function ErrorCode_String(e: ErrorCode): string {
	return e
}

export function minFoldRune(r: number): number {
	if ((r < minFold) || (r > maxFold)) {
		return r
	}
	let m = r
	let r0 = r
	for (r = unicode.SimpleFold(r); r != r0; r = unicode.SimpleFold(r)) {
		m = $.min(m, r)
	}
	return m
}

export function repeatIsValid(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, n: number): boolean {
	if ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpRepeat) {
		let m = $.pointerValue<__goscript_regexp.Regexp>(re).Max
		if (m == 0) {
			return true
		}
		if (m < 0) {
			m = $.pointerValue<__goscript_regexp.Regexp>(re).Min
		}
		if (m > n) {
			return false
		}
		if (m > 0) {
			n /= m
		}
	}
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); __rangeIndex++) {
		let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![__rangeIndex]
		if (!repeatIsValid(sub, n)) {
			return false
		}
	}
	return true
}

export function cleanAlt(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
	switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
		case __goscript_regexp.OpCharClass:
		{
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = cleanClass($.pointerValue<__goscript_regexp.Regexp>(re)._fields.Rune)
			if ((($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] == 0)) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1] == unicode.MaxRune)) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = null
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpAnyChar
				return
			}
			if ((((($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 4) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] == 0)) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1] == (10 - 1))) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2] == (10 + 1))) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![3] == unicode.MaxRune)) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = null
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = __goscript_regexp.OpAnyCharNotNL
				return
			}
			if (($.cap($.pointerValue<__goscript_regexp.Regexp>(re).Rune) - $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune)) > 100) {
				// re.Rune will not grow any more.
				// Make a copy or inline to reclaim storage.
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0), ...($.pointerValue<__goscript_regexp.Regexp>(re).Rune ?? []))
			}
			break
		}
	}
}

export function literalRegexp(s: string, flags: Flags): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
	let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = new __goscript_regexp.Regexp({Op: __goscript_regexp.OpLiteral})
	$.pointerValue<__goscript_regexp.Regexp>(re).Flags = flags
	$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0)
	for (const [__rangeIndex, c] of $.rangeString(s)) {
		if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) >= $.cap($.pointerValue<__goscript_regexp.Regexp>(re).Rune)) {
			// string is too long to fit in Rune0.  let Go handle it
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.stringToRunes(s)
			break
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Rune, c)
	}
	return re
}

export async function Parse(s: string, flags: Flags): globalThis.Promise<[__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError]> {
	return await parse(s, flags)
}

export async function parse(s: string, flags: Flags): globalThis.Promise<[__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError]> {
	let err: $.GoError = null
	using __defer = new $.DisposableStack()
	__defer.defer(() => { ($.functionValue((): void => {
		{
			let r = $.recover()
			switch (r) {
				default:
				{
					$.panic(r)
					break
				}
				case null:
				{
					break
				}
				case ErrLarge:
				{
					err = $.interfaceValue<$.GoError>(new Error({Code: ErrLarge, Expr: s}), "*syntax.Error")
					break
				}
				case ErrNestingDepth:
				{
					err = $.interfaceValue<$.GoError>(new Error({Code: ErrNestingDepth, Expr: s}), "*syntax.Error")
					break
				}
			}
		}
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })

	if ((flags & Literal) != 0) {
		// Trivial parser for literal string.
		{
			let __goscriptShadow4 = checkUTF8(s)
			if (__goscriptShadow4 != null) {
				return [null, __goscriptShadow4]
			}
		}
		return [literalRegexp(s, flags), null]
	}

	// Otherwise, must do real work.
	let p: $.VarRef<parser> = $.varRef($.markAsStructValue(new parser()))
	let c: number = 0
	let op: __goscript_regexp.Op = 0
	let lastRepeat: string = ""
	p.value.flags = flags
	p.value.wholeRegexp = s
	let t = s
	while ((t as string) != "") {
		let repeat = ""
		BigSwitch: {
			switch ($.indexStringOrBytes(t, 0)) {
				default:
				{
					{
						let __goscriptTuple13 = nextRune(t)
						c = __goscriptTuple13[0]
						t = __goscriptTuple13[1]
						err = __goscriptTuple13[2]
						if (err != null) {
							return [null, err]
						}
					}
					p.value.literal(c)
					break
				}
				case 40:
				{
					if ((((p.value.flags & PerlX) != 0) && ($.len(t) >= 2)) && ($.indexStringOrBytes(t, 1) == 63)) {
						// Flag changes and non-capturing groups.
						{
							let __goscriptTuple14 = p.value.parsePerlFlags(t)
							t = __goscriptTuple14[0]
							err = __goscriptTuple14[1]
							if (err != null) {
								return [null, err]
							}
						}
						break
					}
					p.value.numCap++
					$.pointerValue<__goscript_regexp.Regexp>(p.value.op(opLeftParen)).Cap = p.value.numCap
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 124:
				{
					p.value.parseVerticalBar()
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 41:
				{
					{
						err = p.value.parseRightParen()
						if (err != null) {
							return [null, err]
						}
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 94:
				{
					if ((p.value.flags & OneLine) != 0) {
						p.value.op(__goscript_regexp.OpBeginText)
					} else {
						p.value.op(__goscript_regexp.OpBeginLine)
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 36:
				{
					if ((p.value.flags & OneLine) != 0) {
						$.pointerValue<__goscript_regexp.Regexp>(p.value.op(__goscript_regexp.OpEndText)).Flags |= WasDollar
					} else {
						p.value.op(__goscript_regexp.OpEndLine)
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 46:
				{
					if ((p.value.flags & DotNL) != 0) {
						p.value.op(__goscript_regexp.OpAnyChar)
					} else {
						p.value.op(__goscript_regexp.OpAnyCharNotNL)
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 91:
				{
					{
						let __goscriptTuple15 = await p.value.parseClass(t)
						t = __goscriptTuple15[0]
						err = __goscriptTuple15[1]
						if (err != null) {
							return [null, err]
						}
					}
					break
				}
				case 42:
				case 43:
				case 63:
				{
					let before = t
					switch ($.indexStringOrBytes(t, 0)) {
						case 42:
						{
							op = __goscript_regexp.OpStar
							break
						}
						case 43:
						{
							op = __goscript_regexp.OpPlus
							break
						}
						case 63:
						{
							op = __goscript_regexp.OpQuest
							break
						}
					}
					let after = $.sliceStringOrBytes(t, 1, undefined)
					{
						let __goscriptTuple16 = p.value.repeat(op, 0, 0, before, after, lastRepeat)
						after = __goscriptTuple16[0]
						err = __goscriptTuple16[1]
						if (err != null) {
							return [null, err]
						}
					}
					repeat = before
					t = after
					break
				}
				case 123:
				{
					op = __goscript_regexp.OpRepeat
					let before = t
					let [min, max, after, ok] = p.value.parseRepeat(t)
					if (!ok) {
						// If the repeat cannot be parsed, { is a literal.
						p.value.literal(123)
						t = $.sliceStringOrBytes(t, 1, undefined)
						break
					}
					if ((((min < 0) || (min > 1000)) || (max > 1000)) || ((max >= 0) && (min > max))) {
						// Numbers were too big, or max is present and min > max.
						return [null, $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidRepeatSize, Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
					}
					{
						let __goscriptTuple17 = p.value.repeat(op, min, max, before, after, lastRepeat)
						after = __goscriptTuple17[0]
						err = __goscriptTuple17[1]
						if (err != null) {
							return [null, err]
						}
					}
					repeat = before
					t = after
					break
				}
				case 92:
				{
					if (((p.value.flags & PerlX) != 0) && ($.len(t) >= 2)) {
						switch ($.indexStringOrBytes(t, 1)) {
							case 65:
							{
								p.value.op(__goscript_regexp.OpBeginText)
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 98:
							{
								p.value.op(__goscript_regexp.OpWordBoundary)
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 66:
							{
								p.value.op(__goscript_regexp.OpNoWordBoundary)
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 67:
							{
								return [null, $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidEscape, Expr: $.sliceStringOrBytes(t, undefined, 2)}), "*syntax.Error")]
								break
							}
							case 81:
							{
								let lit: string = ""
								let __goscriptTuple18 = strings.Cut($.sliceStringOrBytes(t, 2, undefined), "\\E")
								lit = __goscriptTuple18[0]
								t = __goscriptTuple18[1]
								while ((lit as string) != "") {
									let [__goscriptShadow5, rest, __goscriptShadow6] = nextRune(lit)
									if (__goscriptShadow6 != null) {
										return [null, __goscriptShadow6]
									}
									p.value.literal(__goscriptShadow5)
									lit = rest
								}
								break BigSwitch
								break
							}
							case 122:
							{
								p.value.op(__goscript_regexp.OpEndText)
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
						}
					}

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = p.value.newRegexp(__goscript_regexp.OpCharClass)
					$.pointerValue<__goscript_regexp.Regexp>(re).Flags = p.value.flags

					// Look for Unicode character group like \p{Han}
					if (($.len(t) >= 2) && (($.indexStringOrBytes(t, 1) == 112) || ($.indexStringOrBytes(t, 1) == 80))) {
						let [r, rest, __goscriptShadow7] = await p.value.parseUnicodeClass(t, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0))
						if (__goscriptShadow7 != null) {
							return [null, __goscriptShadow7]
						}
						if (r != null) {
							$.pointerValue<__goscript_regexp.Regexp>(re).Rune = r
							t = rest
							p.value.push(re)
							break BigSwitch
						}
					}

					// Perl character class escape.
					{
						let [r, rest] = p.value.parsePerlClassEscape(t, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0))
						if (r != null) {
							$.pointerValue<__goscript_regexp.Regexp>(re).Rune = r
							t = rest
							p.value.push(re)
							break BigSwitch
						}
					}
					p.value.reuse(re)

					// Ordinary single-character escape.
					{
						let __goscriptTuple19 = p.value.parseEscape(t)
						c = __goscriptTuple19[0]
						t = __goscriptTuple19[1]
						err = __goscriptTuple19[2]
						if (err != null) {
							return [null, err]
						}
					}
					p.value.literal(c)
					break
				}
			}
		}
		lastRepeat = repeat
	}

	p.value.concat()
	if (p.value.swapVerticalBar()) {
		// pop vertical bar
		p.value.stack = $.goSlice(p.value.stack, undefined, $.len(p.value.stack) - 1)
	}
	p.value.alternate()

	let n = $.len(p.value.stack)
	if (n != 1) {
		return [null, $.interfaceValue<$.GoError>(new Error({Code: ErrMissingParen, Expr: s}), "*syntax.Error")]
	}
	return [p.value.stack![0], null]
}

export function isValidCaptureName(name: string): boolean {
	if ((name as string) == "") {
		return false
	}
	for (const [__rangeIndex, c] of $.rangeString(name)) {
		if ((c != 95) && !isalnum(c)) {
			return false
		}
	}
	return true
}

export function isCharClass(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): boolean {
	return (((($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpLiteral) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 1)) || ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpCharClass)) || ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpAnyCharNotNL)) || ($.pointerValue<__goscript_regexp.Regexp>(re).Op == __goscript_regexp.OpAnyChar)
}

export function matchRune(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, r: number): boolean {
	switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
		case __goscript_regexp.OpLiteral:
		{
			return ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 1) && ($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] == r)
			break
		}
		case __goscript_regexp.OpCharClass:
		{
			for (let i = 0; i < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune); i += 2) {
				if (($.pointerValue<__goscript_regexp.Regexp>(re).Rune![i] <= r) && (r <= $.pointerValue<__goscript_regexp.Regexp>(re).Rune![i + 1])) {
					return true
				}
			}
			return false
			break
		}
		case __goscript_regexp.OpAnyCharNotNL:
		{
			return r != 10
			break
		}
		case __goscript_regexp.OpAnyChar:
		{
			return true
			break
		}
	}
	return false
}

export function mergeCharClass(dst: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, src: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
	switch ($.pointerValue<__goscript_regexp.Regexp>(dst).Op) {
		case __goscript_regexp.OpAnyChar:
		{
			break
		}
		case __goscript_regexp.OpAnyCharNotNL:
		{
			if (matchRune(src, 10)) {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Op = __goscript_regexp.OpAnyChar
			}
			break
		}
		case __goscript_regexp.OpCharClass:
		{
			if ($.pointerValue<__goscript_regexp.Regexp>(src).Op == __goscript_regexp.OpLiteral) {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.pointerValue<__goscript_regexp.Regexp>(src).Rune![0], $.pointerValue<__goscript_regexp.Regexp>(src).Flags)
			} else {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendClass($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.pointerValue<__goscript_regexp.Regexp>(src).Rune)
			}
			break
		}
		case __goscript_regexp.OpLiteral:
		{
			if (($.pointerValue<__goscript_regexp.Regexp>(src).Rune![0] == $.pointerValue<__goscript_regexp.Regexp>(dst).Rune![0]) && ($.pointerValue<__goscript_regexp.Regexp>(src).Flags == $.pointerValue<__goscript_regexp.Regexp>(dst).Flags)) {
				break
			}
			$.pointerValue<__goscript_regexp.Regexp>(dst).Op = __goscript_regexp.OpCharClass
			$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.goSlice($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, undefined, 0), $.pointerValue<__goscript_regexp.Regexp>(dst).Rune![0], $.pointerValue<__goscript_regexp.Regexp>(dst).Flags)
			$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.pointerValue<__goscript_regexp.Regexp>(src).Rune![0], $.pointerValue<__goscript_regexp.Regexp>(src).Flags)
			break
		}
	}
}

export let anyTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 0, Hi: (1 << 16) - 1, Stride: 1}))]), R32: $.arrayToSlice<unicode.Range32>([$.markAsStructValue(new unicode.Range32({Lo: 1 << 16, Hi: unicode.MaxRune, Stride: 1}))])})

export function __goscript_set_anyTable(value: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	anyTable = value
}

export let asciiTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 0, Hi: 0x7F, Stride: 1}))])})

export function __goscript_set_asciiTable(value: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	asciiTable = value
}

export let asciiFoldTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 0, Hi: 0x7F, Stride: 1})), $.markAsStructValue(new unicode.Range16({Lo: 0x017F, Hi: 0x017F, Stride: 1})), $.markAsStructValue(new unicode.Range16({Lo: 0x212A, Hi: 0x212A, Stride: 1}))])})

export function __goscript_set_asciiFoldTable(value: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	asciiFoldTable = value
}

export let categoryAliases: {"once": sync.Once, "m": Map<string, string> | null} = {"once": $.markAsStructValue(new sync.Once()), "m": null}

export function __goscript_set_categoryAliases(value: {"once": sync.Once, "m": Map<string, string> | null}): void {
	categoryAliases = value
}

export function initCategoryAliases(): void {
	categoryAliases.m = $.makeMap<string, string>()
	for (let [name, actual] of unicode.CategoryAliases?.entries() ?? []) {
		$.mapSet(categoryAliases.m, canonicalName(name), actual)
	}
}

export function canonicalName(name: string): string {
	let b: $.Slice<number> = null
	let first = true
	for (let i = 0; i < $.len(name); i++) {
		let c = $.indexStringOrBytes(name, i)
		switch (true) {
			case ((c == 95) || (c == 45)) || (c == 32):
			{
				c = 32
				break
			}
			case first:
			{
				if ((97 <= c) && (c <= 122)) {
					c -= 97 - 65
				}
				first = false
				break
			}
			default:
			{
				if ((65 <= c) && (c <= 90)) {
					c += 97 - 65
				}
				break
			}
		}
		if (b == null) {
			if ((c == $.indexStringOrBytes(name, i)) && (c != 32)) {
				// No changes so far, avoid allocating b.
				continue
			}
			b = $.makeSlice<number>(i, $.len(name), "byte")
			$.copy(b, $.sliceStringOrBytes(name, undefined, i))
		}
		if (c == 32) {
			continue
		}
		b = $.append(b, c)
	}
	if (b == null) {
		return name
	}
	return $.bytesToString(b)
}

export async function unicodeTable(name: string): globalThis.Promise<[unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, number]> {
	let tab: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = null
	let fold: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = null
	let sign: number = 0
	name = canonicalName(name)

	// Special cases: Any, Assigned, and ASCII.
	// Also LC is the only non-canonical Categories key, so handle it here.
	switch (name) {
		case "Any":
		{
			return [anyTable, anyTable, +1]
			break
		}
		case "Assigned":
		{
			return [unicode.Cn, unicode.Cn, -1]
			break
		}
		case "Ascii":
		{
			return [asciiTable, asciiFoldTable, +1]
			break
		}
		case "Lc":
		{
			return [$.mapGet(unicode.Categories, "LC", null)[0], $.mapGet(unicode.FoldCategory, "LC", null)[0], +1]
			break
		}
	}
	{
		let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet(unicode.Categories, name, null)[0]
		if (t != null) {
			return [t, $.mapGet(unicode.FoldCategory, name, null)[0], +1]
		}
	}
	{
		let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet(unicode.Scripts, name, null)[0]
		if (t != null) {
			return [t, $.mapGet(unicode.FoldScript, name, null)[0], +1]
		}
	}

	// unicode.CategoryAliases makes liberal use of underscores in its names
	// (they are defined that way by Unicode), but we want to match ignoring
	// the underscores, so make our own map with canonical names.
	await categoryAliases.once.Do(initCategoryAliases)
	{
		let actual = $.mapGet(categoryAliases.m, name, "")[0]
		if ((actual as string) != "") {
			let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet(unicode.Categories, actual, null)[0]
			return [t, $.mapGet(unicode.FoldCategory, actual, null)[0], +1]
		}
	}
	return [null, null, 0]
}

export function cleanClass(rp: $.VarRef<$.Slice<number>> | null): $.Slice<number> {

	// Sort by lo increasing, hi decreasing to break ties.
	sort.Sort($.interfaceValue<sort.Interface | null>($.markAsStructValue(new ranges({p: rp})), "syntax.ranges"))

	let r = $.pointerValue<$.Slice<number>>(rp)
	if ($.len(r) < 2) {
		return r
	}

	// Merge abutting, overlapping.
	let w = 2
	for (let i = 2; i < $.len(r); i += 2) {
		let lo = r![i]
		let hi = r![i + 1]
		if (lo <= (r![w - 1] + 1)) {
			// merge with previous range
			if (hi > r![w - 1]) {
				r![w - 1] = hi
			}
			continue
		}
		// new disjoint range
		r![w] = lo
		r![w + 1] = hi
		w += 2
	}

	return $.goSlice(r, undefined, w)
}

export function inCharClass(r: number, _class: $.Slice<number>): boolean {
	let [, ok] = sort.Find(Math.trunc($.len(_class) / 2), $.functionValue((i: number): number => {
		let lo = _class![2 * i]
		let hi = _class![(2 * i) + 1]
		if (r > hi) {
			return +1
		}
		if (r < lo) {
			return -1
		}
		return 0
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))
	return ok
}

export function appendLiteral(r: $.Slice<number>, x: number, flags: Flags): $.Slice<number> {
	if ((flags & FoldCase) != 0) {
		return appendFoldedRange(r, x, x)
	}
	return appendRange(r, x, x)
}

export function appendRange(r: $.Slice<number>, lo: number, hi: number): $.Slice<number> {
	// Expand last range or next to last range if it overlaps or abuts.
	// Checking two ranges helps when appending case-folded
	// alphabets, so that one range can be expanding A-Z and the
	// other expanding a-z.
	let n = $.len(r)
	for (let i = 2; i <= 4; i += 2) {
		if (n >= i) {
			let rlo = r![n - i]
			let rhi = r![(n - i) + 1]
			if ((lo <= (rhi + 1)) && (rlo <= (hi + 1))) {
				if (lo < rlo) {
					r![n - i] = lo
				}
				if (hi > rhi) {
					r![(n - i) + 1] = hi
				}
				return r
			}
		}
	}

	return $.append(r, lo, hi)
}

export function appendFoldedRange(r: $.Slice<number>, lo: number, hi: number): $.Slice<number> {
	// Optimizations.
	if ((lo <= minFold) && (hi >= maxFold)) {
		// Range is full: folding can't add more.
		return appendRange(r, lo, hi)
	}
	if ((hi < minFold) || (lo > maxFold)) {
		// Range is outside folding possibilities.
		return appendRange(r, lo, hi)
	}
	if (lo < minFold) {
		// [lo, minFold-1] needs no folding.
		r = appendRange(r, lo, minFold - 1)
		lo = minFold
	}
	if (hi > maxFold) {
		// [maxFold+1, hi] needs no folding.
		r = appendRange(r, maxFold + 1, hi)
		hi = maxFold
	}

	// Brute force. Depend on appendRange to coalesce ranges on the fly.
	for (let c = lo; c <= hi; c++) {
		r = appendRange(r, c, c)
		let f = unicode.SimpleFold(c)
		while (f != c) {
			r = appendRange(r, f, f)
			f = unicode.SimpleFold(f)
		}
	}
	return r
}

export function appendClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	for (let i = 0; i < $.len(x); i += 2) {
		r = appendRange(r, x![i], x![i + 1])
	}
	return r
}

export function appendFoldedClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	for (let i = 0; i < $.len(x); i += 2) {
		r = appendFoldedRange(r, x![i], x![i + 1])
	}
	return r
}

export function appendNegatedClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	let nextLo = 0
	for (let i = 0; i < $.len(x); i += 2) {
		let lo = x![i]
		let hi = x![i + 1]
		if (nextLo <= (lo - 1)) {
			r = appendRange(r, nextLo, lo - 1)
		}
		nextLo = hi + 1
	}
	if (nextLo <= unicode.MaxRune) {
		r = appendRange(r, nextLo, unicode.MaxRune)
	}
	return r
}

export function appendTable(r: $.Slice<number>, x: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): $.Slice<number> {
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<unicode.RangeTable>(x).R16); __rangeIndex++) {
		let xr = $.pointerValue<unicode.RangeTable>(x).R16![__rangeIndex]
		let lo = $.int(xr.Lo, 32)
		let hi = $.int(xr.Hi, 32)
		let stride = $.int(xr.Stride, 32)
		if (stride == 1) {
			r = appendRange(r, lo, hi)
			continue
		}
		for (let c = lo; c <= hi; c += stride) {
			r = appendRange(r, c, c)
		}
	}
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<unicode.RangeTable>(x).R32); __rangeIndex++) {
		let xr = $.pointerValue<unicode.RangeTable>(x).R32![__rangeIndex]
		let lo = $.int(xr.Lo, 32)
		let hi = $.int(xr.Hi, 32)
		let stride = $.int(xr.Stride, 32)
		if (stride == 1) {
			r = appendRange(r, lo, hi)
			continue
		}
		for (let c = lo; c <= hi; c += stride) {
			r = appendRange(r, c, c)
		}
	}
	return r
}

export function appendNegatedTable(r: $.Slice<number>, x: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): $.Slice<number> {
	let nextLo = 0
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<unicode.RangeTable>(x).R16); __rangeIndex++) {
		let xr = $.pointerValue<unicode.RangeTable>(x).R16![__rangeIndex]
		let lo = $.int(xr.Lo, 32)
		let hi = $.int(xr.Hi, 32)
		let stride = $.int(xr.Stride, 32)
		if (stride == 1) {
			if (nextLo <= (lo - 1)) {
				r = appendRange(r, nextLo, lo - 1)
			}
			nextLo = hi + 1
			continue
		}
		for (let c = lo; c <= hi; c += stride) {
			if (nextLo <= (c - 1)) {
				r = appendRange(r, nextLo, c - 1)
			}
			nextLo = c + 1
		}
	}
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<unicode.RangeTable>(x).R32); __rangeIndex++) {
		let xr = $.pointerValue<unicode.RangeTable>(x).R32![__rangeIndex]
		let lo = $.int(xr.Lo, 32)
		let hi = $.int(xr.Hi, 32)
		let stride = $.int(xr.Stride, 32)
		if (stride == 1) {
			if (nextLo <= (lo - 1)) {
				r = appendRange(r, nextLo, lo - 1)
			}
			nextLo = hi + 1
			continue
		}
		for (let c = lo; c <= hi; c += stride) {
			if (nextLo <= (c - 1)) {
				r = appendRange(r, nextLo, c - 1)
			}
			nextLo = c + 1
		}
	}
	if (nextLo <= unicode.MaxRune) {
		r = appendRange(r, nextLo, unicode.MaxRune)
	}
	return r
}

export function negateClass(r: $.Slice<number>): $.Slice<number> {
	let nextLo = 0
	let w = 0
	for (let i = 0; i < $.len(r); i += 2) {
		let lo = r![i]
		let hi = r![i + 1]
		if (nextLo <= (lo - 1)) {
			r![w] = nextLo
			r![w + 1] = lo - 1
			w += 2
		}
		nextLo = hi + 1
	}
	r = $.goSlice(r, undefined, w)
	if (nextLo <= unicode.MaxRune) {
		// It's possible for the negation to have one more
		// range - this one - than the original class, so use append.
		r = $.append(r, nextLo, unicode.MaxRune)
	}
	return r
}

export function checkUTF8(s: string): $.GoError {
	while ((s as string) != "") {
		let [rune, size] = utf8.DecodeRuneInString(s)
		if ((rune == utf8.RuneError) && (size == 1)) {
			return $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidUTF8, Expr: s}), "*syntax.Error")
		}
		s = $.sliceStringOrBytes(s, size, undefined)
	}
	return null
}

export function nextRune(s: string): [number, string, $.GoError] {
	let c: number = 0
	let t: string = ""
	let err: $.GoError = null
	let __goscriptTuple20 = utf8.DecodeRuneInString(s)
	c = __goscriptTuple20[0]
	let size = __goscriptTuple20[1]
	if ((c == utf8.RuneError) && (size == 1)) {
		return [0, "", $.interfaceValue<$.GoError>(new Error({Code: ErrInvalidUTF8, Expr: s}), "*syntax.Error")]
	}
	return [c, $.sliceStringOrBytes(s, size, undefined), null]
}

export function isalnum(c: number): boolean {
	return (((48 <= c) && (c <= 57)) || ((65 <= c) && (c <= 90))) || ((97 <= c) && (c <= 122))
}

export function unhex(c: number): number {
	if ((48 <= c) && (c <= 57)) {
		return c - 48
	}
	if ((97 <= c) && (c <= 102)) {
		return (c - 97) + 10
	}
	if ((65 <= c) && (c <= 70)) {
		return (c - 65) + 10
	}
	return -1
}
