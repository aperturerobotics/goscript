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
import "@goscript/sort/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/unicode/index.js"
import "@goscript/unicode/utf8/index.js"
import "./op_string.gs.ts"
import "./perl_groups.gs.ts"
import "./regexp.gs.ts"
import "./simplify.gs.ts"

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
			Code: $.varRef(init?.Code ?? ("" as unknown as ErrorCode)),
			Expr: $.varRef(init?.Expr ?? ("" as unknown as string))
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
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Error,
		[{ name: "Code", key: "Code", type: { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" } }, { name: "Expr", key: "Expr", type: { kind: $.TypeKind.Basic, name: "string" } }]
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

	public get repeats(): bigint {
		return this._fields.repeats.value
	}
	public set repeats(value: bigint) {
		this._fields.repeats.value = value
	}

	public get height(): globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null {
		return this._fields.height.value
	}
	public set height(value: globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null) {
		this._fields.height.value = value
	}

	public get size(): globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint> | null {
		return this._fields.size.value
	}
	public set size(value: globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint> | null) {
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
		repeats: $.VarRef<bigint>
		height: $.VarRef<globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null>
		size: $.VarRef<globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint> | null>
	}

	constructor(init?: Partial<{flags?: Flags, stack?: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>, free?: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, numCap?: number, wholeRegexp?: string, tmpClass?: $.Slice<number>, numRegexp?: number, numRunes?: number, repeats?: bigint, height?: globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null, size?: globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint> | null}>) {
		this._fields = {
			flags: $.varRef(init?.flags ?? (0 as unknown as Flags)),
			stack: $.varRef(init?.stack ?? (null as unknown as $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>)),
			free: $.varRef(init?.free ?? (null as unknown as __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null)),
			numCap: $.varRef(init?.numCap ?? (0 as unknown as number)),
			wholeRegexp: $.varRef(init?.wholeRegexp ?? ("" as unknown as string)),
			tmpClass: $.varRef(init?.tmpClass ?? (null as unknown as $.Slice<number>)),
			numRegexp: $.varRef(init?.numRegexp ?? (0 as unknown as number)),
			numRunes: $.varRef(init?.numRunes ?? (0 as unknown as number)),
			repeats: $.varRef(init?.repeats ?? (0n as unknown as bigint)),
			height: $.varRef(init?.height ?? (null as unknown as globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number> | null)),
			size: $.varRef(init?.size ?? (null as unknown as globalThis.Map<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint> | null))
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
		while ((i > 0) && ($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![i - 1]).Op < 128)) {
			i--
		}
		let subs: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> = $.goSlice($.pointerValue<parser>(p).stack, i, undefined)
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, i)

		// Make sure top class is clean.
		// All the others already are (see swapVerticalBar).
		if ($.len(subs) > 0) {
			cleanAlt(subs![$.len(subs) - 1])
		}

		// Empty alternate is special case
		// (shouldn't happen but easy to handle).
		if ($.len(subs) == 0) {
			return parser.prototype.push.call(p, parser.prototype.newRegexp.call(p, $.uint(1, 8)))
		}

		return parser.prototype.push.call(p, parser.prototype.collapse.call(p, subs, $.uint(19, 8)))
	}

	public appendGroup(r: $.Slice<number>, g: charGroup): $.Slice<number> {
		let p: parser | $.VarRef<parser> | null = this
		if ($.uint(($.pointerValue<parser>(p).flags & 1), 16) == $.uint(0, 16)) {
			if (g.sign < 0) {
				r = appendNegatedClass(r, g._class)
			} else {
				r = appendClass(r, g._class)
			}
		} else {
			let tmp: $.Slice<number> = $.goSlice($.pointerValue<parser>(p).tmpClass, undefined, 0)
			tmp = appendFoldedClass(tmp, g._class)
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
				let [h, ok] = $.mapGet<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number, number>($.pointerValue<parser>(p).height, re, 0)
				if (ok) {
					return h
				}
			}
		}
		let h = 1
		for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let sub = __goscriptRangeTarget0![__rangeIndex]
			let hsub = parser.prototype.calcHeight.call(p, sub, false)
			if (h < (1 + hsub)) {
				h = 1 + hsub
			}
		}
		$.mapSet($.pointerValue<parser>(p).height, re, h)
		return h
	}

	public calcSize(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, force: boolean): bigint {
		let p: parser | $.VarRef<parser> | null = this
		if (!force) {
			{
				let __goscriptTuple0: any = $.mapGet<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint, bigint>($.pointerValue<parser>(p).size, re, 0n)
				let size = __goscriptTuple0[0]
				let ok = __goscriptTuple0[1]
				if (ok) {
					return size
				}
			}
		}

		let size: bigint = 0n
		switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
			case 3:
			{
				size = $.int64($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune))
				break
			}
			case 13:
			case 14:
			{
				size = $.int64Add(2, parser.prototype.calcSize.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false))
				break
			}
			case 15:
			case 16:
			{
				size = $.int64Add(1, parser.prototype.calcSize.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false))
				break
			}
			case 18:
			{
				for (let __goscriptRangeTarget1 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
					let sub = __goscriptRangeTarget1![__rangeIndex]
					size = $.int64Add(size, parser.prototype.calcSize.call(p, sub, false))
				}
				break
			}
			case 19:
			{
				for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
					let sub = __goscriptRangeTarget2![__rangeIndex]
					size = $.int64Add(size, parser.prototype.calcSize.call(p, sub, false))
				}
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 1) {
					size = $.int64Add(size, $.int64Sub($.int64($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)), 1))
				}
				break
			}
			case 17:
			{
				let sub = parser.prototype.calcSize.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0], false)
				if ($.pointerValue<__goscript_regexp.Regexp>(re).Max == -1) {
					if ($.pointerValue<__goscript_regexp.Regexp>(re).Min == 0) {
						size = $.int64Add(2, sub)
					} else {
						size = $.int64Add(1, ($.int64Mul($.int64($.pointerValue<__goscript_regexp.Regexp>(re).Min), sub)))
					}
					break
				}
				// x{2,5} = xx(x(x(x)?)?)?
				size = $.int64Add(($.int64Mul($.int64($.pointerValue<__goscript_regexp.Regexp>(re).Max), sub)), $.int64($.pointerValue<__goscript_regexp.Regexp>(re).Max - $.pointerValue<__goscript_regexp.Regexp>(re).Min))
				break
			}
		}

		size = $.max(1n, size)
		$.mapSet($.pointerValue<parser>(p).size, re, size)
		return size
	}

	public checkHeight(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		let p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).numRegexp < 1000) {
			return
		}
		if ($.pointerValue<parser>(p).height == null) {
			$.pointerValue<parser>(p).height = $.makeMap<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, number>()
			for (let __goscriptRangeTarget3 = $.pointerValue<parser>(p).stack, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
				let re = __goscriptRangeTarget3![__rangeIndex]
				parser.prototype.checkHeight.call(p, re)
			}
		}
		if (parser.prototype.calcHeight.call(p, re, true) > 1000) {
			$.panic($.namedValueInterfaceValue<any>("expression nests too deeply", "syntax.ErrorCode", {String: (receiver: any, ...args: any[]) => (ErrorCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" }))
		}
	}

	public checkLimits(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		const p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).numRunes > 33554432) {
			$.panic($.namedValueInterfaceValue<any>("expression too large", "syntax.ErrorCode", {String: (receiver: any, ...args: any[]) => (ErrorCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" }))
		}
		parser.prototype.checkSize.call(p, re)
		parser.prototype.checkHeight.call(p, re)
	}

	public checkSize(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
		let p: parser | $.VarRef<parser> | null = this
		if ($.pointerValue<parser>(p).size == null) {
			// We haven't started tracking size yet.
			// Do a relatively cheap check to see if we need to start.
			// Maintain the product of all the repeats we've seen
			// and don't track if the total number of regexp nodes
			// we've seen times the repeat product is in budget.
			if ($.pointerValue<parser>(p).repeats == 0n) {
				$.pointerValue<parser>(p).repeats = 1n
			}
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(17, 8)) {
				let n = $.pointerValue<__goscript_regexp.Regexp>(re).Max
				if (n == -1) {
					n = $.pointerValue<__goscript_regexp.Regexp>(re).Min
				}
				if (n <= 0) {
					n = 1
				}
				if ($.int64(n) > ($.int64Div(3355443, $.pointerValue<parser>(p).repeats))) {
					$.pointerValue<parser>(p).repeats = 3355443n
				} else {
					$.pointerValue<parser>(p).repeats = $.int64Mul($.pointerValue<parser>(p).repeats, $.int64(n))
				}
			}
			if ($.int64($.pointerValue<parser>(p).numRegexp) < ($.int64Div(3355443, $.pointerValue<parser>(p).repeats))) {
				return
			}

			// We need to start tracking size.
			// Make the map and belatedly populate it
			// with info about everything we've constructed so far.
			$.pointerValue<parser>(p).size = $.makeMap<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, bigint>()
			for (let __goscriptRangeTarget4 = $.pointerValue<parser>(p).stack, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
				let re = __goscriptRangeTarget4![__rangeIndex]
				parser.prototype.checkSize.call(p, re)
			}
		}

		if (parser.prototype.calcSize.call(p, re, true) > 3355443) {
			$.panic($.namedValueInterfaceValue<any>("expression too large", "syntax.ErrorCode", {String: (receiver: any, ...args: any[]) => (ErrorCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" }))
		}
	}

	public collapse(subs: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>, op: __goscript_regexp.Op): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if ($.len(subs) == 1) {
			return subs![0]
		}
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(op, 8))
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 0)
		for (let __goscriptRangeTarget5 = subs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let sub = __goscriptRangeTarget5![__rangeIndex]
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub).Op, 8) == $.uint(op, 8)) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.appendSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, $.pointerValue<__goscript_regexp.Regexp>(sub).Sub)
				parser.prototype.reuse.call(p, sub)
			} else {
				$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Sub, sub)
			}
		}
		if ($.uint(op, 8) == $.uint(19, 8)) {
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub = parser.prototype.factor.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub)
			if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) == 1) {
				let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
				re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
				parser.prototype.reuse.call(p, old)
			}
		}
		return re
	}

	public concat(): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		parser.prototype.maybeConcat.call(p, $.int(-1, 32), $.uint(0, 16))

		// Scan down to find pseudo-operator | or (.
		let i = $.len($.pointerValue<parser>(p).stack)
		while ((i > 0) && ($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![i - 1]).Op < 128)) {
			i--
		}
		let subs: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> = $.goSlice($.pointerValue<parser>(p).stack, i, undefined)
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, i)

		// Empty concatenation is special case.
		if ($.len(subs) == 0) {
			return parser.prototype.push.call(p, parser.prototype.newRegexp.call(p, $.uint(2, 8)))
		}

		return parser.prototype.push.call(p, parser.prototype.collapse.call(p, subs, $.uint(18, 8)))
	}

	public factor(sub: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>): $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> {
		const p: parser | $.VarRef<parser> | null = this
		if ($.len(sub) < 2) {
			return sub
		}

		// Round 1: Factor out common literal prefixes.
		let str: $.Slice<number> = null as $.Slice<number>
		let strflags: Flags = 0
		let start = 0
		let out: $.Slice<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null> = $.goSlice(sub, undefined, 0)
		for (let i = 0; i <= $.len(sub); i++) {
			// Invariant: the Regexps that were in sub[0:start] have been
			// used or marked for reuse, and the slice space has been reused
			// for out (len(out) <= start).
			//
			// Invariant: sub[start:i] consists of regexps that all begin
			// with str as modified by strflags.
			let istr: $.Slice<number> = null as $.Slice<number>
			let iflags: Flags = 0
			if (i < $.len(sub)) {
				let __goscriptTuple1: any = parser.prototype.leadingString.call(p, sub![i])
				istr = __goscriptTuple1[0]
				iflags = $.uint(__goscriptTuple1[1], 16)
				if ($.uint(iflags, 16) == $.uint(strflags, 16)) {
					let same = 0
					while (((same < $.len(str)) && (same < $.len(istr))) && ($.int(str![same], 32) == $.int(istr![same], 32))) {
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
					let prefix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(3, 8))
					$.pointerValue<__goscript_regexp.Regexp>(prefix).Flags = $.uint(strflags, 16)
					$.pointerValue<__goscript_regexp.Regexp>(prefix).Rune = $.appendSlice($.goSlice($.pointerValue<__goscript_regexp.Regexp>(prefix).Rune, undefined, 0), str)

					for (let j = start; j < i; j++) {
						sub![j] = parser.prototype.removeLeadingString.call(p, sub![j], $.len(str))
						parser.prototype.checkLimits.call(p, sub![j])
					}
					let suffix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.collapse.call(p, $.goSlice(sub, start, i), $.uint(19, 8))

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(18, 8))
					$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.append($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, 0), prefix, suffix)
					out = $.append(out, re)
				}
			}

			// Prepare for next iteration.
			start = i
			str = istr
			strflags = $.uint(iflags, 16)
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
		let first: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = null as __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null
		for (let i = 0; i <= $.len(sub); i++) {
			// Invariant: the Regexps that were in sub[0:start] have been
			// used or marked for reuse, and the slice space has been reused
			// for out (len(out) <= start).
			//
			// Invariant: sub[start:i] consists of regexps that all begin with ifirst.
			let ifirst: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = null as __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null
			if (i < $.len(sub)) {
				ifirst = parser.prototype.leadingRegexp.call(p, sub![i])
				if (((first != null) && __goscript_regexp.Regexp.prototype.Equal.call(first, ifirst)) && (isCharClass(first) || ((($.uint($.pointerValue<__goscript_regexp.Regexp>(first).Op, 8) == $.uint(17, 8)) && ($.pointerValue<__goscript_regexp.Regexp>(first).Min == $.pointerValue<__goscript_regexp.Regexp>(first).Max)) && isCharClass($.pointerValue<__goscript_regexp.Regexp>(first).Sub![0])))) {
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
						parser.prototype.checkLimits.call(p, sub![j])
					}
					let suffix: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.collapse.call(p, $.goSlice(sub, start, i), $.uint(19, 8))

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(18, 8))
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
						if (($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Op < $.pointerValue<__goscript_regexp.Regexp>(sub![j]).Op) || (($.uint($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Op, 8) == $.uint($.pointerValue<__goscript_regexp.Regexp>(sub![j]).Op, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(sub![max]).Rune) < $.len($.pointerValue<__goscript_regexp.Regexp>(sub![j]).Rune)))) {
							max = j
						}
					}
					let __goscriptAssign0_0: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = sub![max]
					let __goscriptAssign0_1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = sub![start]
					sub![start] = __goscriptAssign0_0
					sub![max] = __goscriptAssign0_1

					for (let j = start + 1; j < i; j++) {
						mergeCharClass(sub![start], sub![j])
						parser.prototype.reuse.call(p, sub![j])
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
		for (let __goscriptRangeTarget6 = sub, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
			if ((((i + 1) < $.len(sub)) && ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub![i]).Op, 8) == $.uint(2, 8))) && ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub![i + 1]).Op, 8) == $.uint(2, 8))) {
				continue
			}
			out = $.append(out, sub![i])
		}
		sub = out

		return sub
	}

	public leadingRegexp(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(2, 8)) {
			return null
		}
		if (($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(18, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub).Op, 8) == $.uint(2, 8)) {
				return null
			}
			return sub
		}
		return re
	}

	public leadingString(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): [$.Slice<number>, Flags] {
		const p: parser | $.VarRef<parser> | null = this
		if (($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(18, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
		}
		if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) != $.uint(3, 8)) {
			return [null, $.uint(0, 16)]
		}
		return [$.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.uint($.pointerValue<__goscript_regexp.Regexp>(re).Flags & 1, 16)]
	}

	public literal(r: number): void {
		const p: parser | $.VarRef<parser> | null = this
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(3, 8))
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint($.pointerValue<parser>(p).flags, 16)
		if ($.uint(($.pointerValue<parser>(p).flags & 1), 16) != $.uint(0, 16)) {
			r = $.int(minFoldRune($.int(r, 32)), 32)
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune0[0] = $.int(r, 32)
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 1)
		parser.prototype.push.call(p, re)
	}

	public maybeConcat(r: number, flags: Flags): boolean {
		let p: parser | $.VarRef<parser> | null = this
		let n = $.len($.pointerValue<parser>(p).stack)
		if (n < 2) {
			return false
		}

		let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
		if ((($.uint($.pointerValue<__goscript_regexp.Regexp>(re1).Op, 8) != $.uint(3, 8)) || ($.uint($.pointerValue<__goscript_regexp.Regexp>(re2).Op, 8) != $.uint(3, 8))) || ($.uint(($.pointerValue<__goscript_regexp.Regexp>(re1).Flags & 1), 16) != $.uint(($.pointerValue<__goscript_regexp.Regexp>(re2).Flags & 1), 16))) {
			return false
		}

		// Push re1 into re2.
		$.pointerValue<__goscript_regexp.Regexp>(re2).Rune = $.appendSlice($.pointerValue<__goscript_regexp.Regexp>(re2).Rune, $.pointerValue<__goscript_regexp.Regexp>(re1).Rune)

		// Reuse re1 if possible.
		if (r >= 0) {
			$.pointerValue<__goscript_regexp.Regexp>(re1).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re1).Rune0, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re1).Rune![0] = $.int(r, 32)
			$.pointerValue<__goscript_regexp.Regexp>(re1).Flags = $.uint(flags, 16)
			return true
		}

		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 1)
		parser.prototype.reuse.call(p, re1)
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
		$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(op, 8)
		return re
	}

	public op(op: __goscript_regexp.Op): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(op, 8))
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint($.pointerValue<parser>(p).flags, 16)
		return parser.prototype.push.call(p, re)
	}

	public async parseClass(s: string): globalThis.Promise<[string, $.GoError]> {
		const p: parser | $.VarRef<parser> | null = this
		let rest: string = ""
		let err: $.GoError = null as $.GoError
		let t = $.sliceStringOrBytes(s, 1, undefined)
		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(4, 8))
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint($.pointerValue<parser>(p).flags, 16)
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0)

		let sign = +1
		if ((!$.stringEqual(t, "")) && ($.uint($.indexStringOrBytes(t, 0), 8) == $.uint(94, 8))) {
			sign = -1
			t = $.sliceStringOrBytes(t, 1, undefined)

			// If character class does not match \n, add it here,
			// so that negation later will do the right thing.
			if ($.uint(($.pointerValue<parser>(p).flags & 4), 16) == $.uint(0, 16)) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.int(10, 32), $.int(10, 32))
			}
		}

		let _class: $.Slice<number> = $.pointerValue<__goscript_regexp.Regexp>(re).Rune
		let first = true
		while ((($.stringEqual(t, "")) || ($.uint($.indexStringOrBytes(t, 0), 8) != $.uint(93, 8))) || first) {
			// POSIX: - is only okay unescaped as first or last in class.
			// Perl: - is okay anywhere.
			if (((((!$.stringEqual(t, "")) && ($.uint($.indexStringOrBytes(t, 0), 8) == $.uint(45, 8))) && ($.uint(($.pointerValue<parser>(p).flags & 64), 16) == $.uint(0, 16))) && !first) && (($.len(t) == 1) || ($.uint($.indexStringOrBytes(t, 1), 8) != $.uint(93, 8)))) {
				let [, size] = utf8.DecodeRuneInString($.sliceStringOrBytes(t, 1, undefined))
				return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid character class range", Expr: $.sliceStringOrBytes(t, undefined, 1 + size)}), "*syntax.Error")]
			}
			first = false

			// Look for POSIX [:alnum:] etc.
			if ((($.len(t) > 2) && ($.uint($.indexStringOrBytes(t, 0), 8) == $.uint(91, 8))) && ($.uint($.indexStringOrBytes(t, 1), 8) == $.uint(58, 8))) {
				let __goscriptTuple2: any = parser.prototype.parseNamedClass.call(p, t, _class)
				let nclass: $.Slice<number> = __goscriptTuple2[0]
				let nt = __goscriptTuple2[1]
				let __goscriptShadow0 = __goscriptTuple2[2]
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
			let __goscriptTuple3: any = await parser.prototype.parseUnicodeClass.call(p, t, _class)
			let nclass: $.Slice<number> = __goscriptTuple3[0]
			let nt = __goscriptTuple3[1]
			let __goscriptShadow1 = __goscriptTuple3[2]
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
				let __goscriptTuple4: any = parser.prototype.parsePerlClassEscape.call(p, t, _class)
				let __goscriptShadow2: $.Slice<number> = __goscriptTuple4[0]
				let __goscriptShadow3 = __goscriptTuple4[1]
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
				let __goscriptTuple5: any = parser.prototype.parseClassChar.call(p, t, s)
				lo = $.int(__goscriptTuple5[0], 32)
				t = __goscriptTuple5[1]
				__goscriptShadow1 = __goscriptTuple5[2]
				if (__goscriptShadow1 != null) {
					return ["", __goscriptShadow1]
				}
			}
			hi = $.int(lo, 32)
			// [a-] means (a|-) so check for final ].
			if ((($.len(t) >= 2) && ($.uint($.indexStringOrBytes(t, 0), 8) == $.uint(45, 8))) && ($.uint($.indexStringOrBytes(t, 1), 8) != $.uint(93, 8))) {
				t = $.sliceStringOrBytes(t, 1, undefined)
				{
					let __goscriptTuple6: any = parser.prototype.parseClassChar.call(p, t, s)
					hi = $.int(__goscriptTuple6[0], 32)
					t = __goscriptTuple6[1]
					__goscriptShadow1 = __goscriptTuple6[2]
					if (__goscriptShadow1 != null) {
						return ["", __goscriptShadow1]
					}
				}
				if (hi < lo) {
					rng = $.sliceStringOrBytes(rng, undefined, $.len(rng) - $.len(t))
					return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid character class range", Expr: rng}), "*syntax.Error")]
				}
			}
			if ($.uint(($.pointerValue<parser>(p).flags & 1), 16) == $.uint(0, 16)) {
				_class = appendRange(_class, $.int(lo, 32), $.int(hi, 32))
			} else {
				_class = appendFoldedRange(_class, $.int(lo, 32), $.int(hi, 32))
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
		parser.prototype.push.call(p, re)
		return [t, null]
	}

	public parseClassChar(s: string, wholeClass: string): [number, string, $.GoError] {
		const p: parser | $.VarRef<parser> | null = this
		let r: number = 0
		let rest: string = ""
		let err: $.GoError = null as $.GoError
		if ($.stringEqual(s, "")) {
			return [$.int(0, 32), "", $.interfaceValue<$.GoError>(new Error({Code: "missing closing ]", Expr: wholeClass}), "*syntax.Error")]
		}

		// Allow regular escape sequences even though
		// many need not be escaped in this context.
		if ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(92, 8)) {
			const __goscriptReturn0 = parser.prototype.parseEscape.call(p, s)
			return [$.int(__goscriptReturn0[0], 32), __goscriptReturn0[1], __goscriptReturn0[2]]
		}

		const __goscriptReturn1 = nextRune(s)
		return [$.int(__goscriptReturn1[0], 32), __goscriptReturn1[1], __goscriptReturn1[2]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public parseEscape(s: string): [number, string, $.GoError] {
		const p: parser | $.VarRef<parser> | null = this
		let r: number = 0
		let rest: string = ""
		let err: $.GoError = null as $.GoError
		let t = $.sliceStringOrBytes(s, 1, undefined)
		if ($.stringEqual(t, "")) {
			return [$.int(0, 32), "", $.interfaceValue<$.GoError>(new Error({Code: "trailing backslash at end of expression", Expr: ""}), "*syntax.Error")]
		}
		let __goscriptTuple7: any = nextRune(t)
		let c = $.int(__goscriptTuple7[0], 32)
		t = __goscriptTuple7[1]
		err = __goscriptTuple7[2]
		if (err != null) {
			return [$.int(0, 32), "", err]
		}

		Switch: {
			switch (c) {
				default:
				{
					if ((c < utf8.RuneSelf) && !isalnum($.int(c, 32))) {
						// Escaped non-word characters are always themselves.
						// PCRE is not quite so rigorous: it accepts things like
						// \q, but we don't. We once rejected \_, but too many
						// programs and people insist on using it, so allow \_.
						return [$.int(c, 32), t, null]
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
					if ((($.stringEqual(t, "")) || ($.indexStringOrBytes(t, 0) < 48)) || ($.indexStringOrBytes(t, 0) > 55)) {
						break
					}
				}
				case 48:
				{
					r = $.int(c - 48, 32)
					for (let i = 1; i < 3; i++) {
						if ((($.stringEqual(t, "")) || ($.indexStringOrBytes(t, 0) < 48)) || ($.indexStringOrBytes(t, 0) > 55)) {
							break
						}
						r = $.int(((r * 8) + $.int($.indexStringOrBytes(t, 0), 32)) - 48, 32)
						t = $.sliceStringOrBytes(t, 1, undefined)
					}
					return [$.int(r, 32), t, null]
					break
				}
				case 120:
				{
					if ($.stringEqual(t, "")) {
						break
					}
					{
						let __goscriptTuple8: any = nextRune(t)
						c = $.int(__goscriptTuple8[0], 32)
						t = __goscriptTuple8[1]
						err = __goscriptTuple8[2]
						if (err != null) {
							return [$.int(0, 32), "", err]
						}
					}
					if ($.int(c, 32) == $.int(123, 32)) {
						// Any number of digits in braces.
						// Perl accepts any text at all; it ignores all text
						// after the first non-hex digit. We require only hex digits,
						// and at least one.
						let nhex = 0
						r = $.int(0, 32)
						while (true) {
							if ($.stringEqual(t, "")) {
								break Switch
							}
							{
								let __goscriptTuple9: any = nextRune(t)
								c = $.int(__goscriptTuple9[0], 32)
								t = __goscriptTuple9[1]
								err = __goscriptTuple9[2]
								if (err != null) {
									return [$.int(0, 32), "", err]
								}
							}
							if ($.int(c, 32) == $.int(125, 32)) {
								break
							}
							let v = $.int(unhex($.int(c, 32)), 32)
							if (v < 0) {
								break Switch
							}
							r = $.int((r * 16) + v, 32)
							if (r > unicode.MaxRune) {
								break Switch
							}
							nhex++
						}
						if (nhex == 0) {
							break Switch
						}
						return [$.int(r, 32), t, null]
					}

					// Easy case: two hex digits.
					let x = $.int(unhex($.int(c, 32)), 32)
					{
						let __goscriptTuple10: any = nextRune(t)
						c = $.int(__goscriptTuple10[0], 32)
						t = __goscriptTuple10[1]
						err = __goscriptTuple10[2]
						if (err != null) {
							return [$.int(0, 32), "", err]
						}
					}
					let y = $.int(unhex($.int(c, 32)), 32)
					if ((x < 0) || (y < 0)) {
						break
					}
					return [$.int((x * 16) + y, 32), t, null]
					break
				}
				case 97:
				{
					return [$.int(7, 32), t, err]
					break
				}
				case 102:
				{
					return [$.int(12, 32), t, err]
					break
				}
				case 110:
				{
					return [$.int(10, 32), t, err]
					break
				}
				case 114:
				{
					return [$.int(13, 32), t, err]
					break
				}
				case 116:
				{
					return [$.int(9, 32), t, err]
					break
				}
				case 118:
				{
					return [$.int(11, 32), t, err]
					break
				}
			}
		}
		return [$.int(0, 32), "", $.interfaceValue<$.GoError>(new Error({Code: "invalid escape sequence", Expr: $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))}), "*syntax.Error")]
	}

	public parseInt(s: string): [number, string, boolean] {
		const p: parser | $.VarRef<parser> | null = this
		let n: number = 0
		let rest: string = ""
		let ok: boolean = false
		if ((($.stringEqual(s, "")) || ($.indexStringOrBytes(s, 0) < 48)) || (57 < $.indexStringOrBytes(s, 0))) {
			return [n, rest, ok]
		}
		// Disallow leading zeros.
		if (((($.len(s) >= 2) && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(48, 8))) && (48 <= $.indexStringOrBytes(s, 1))) && ($.indexStringOrBytes(s, 1) <= 57)) {
			return [n, rest, ok]
		}
		let t = s
		while (((!$.stringEqual(s, "")) && (48 <= $.indexStringOrBytes(s, 0))) && ($.indexStringOrBytes(s, 0) <= 57)) {
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
		let out: $.Slice<number> = null as $.Slice<number>
		let rest: string = ""
		let err: $.GoError = null as $.GoError
		if ((($.len(s) < 2) || ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(91, 8))) || ($.uint($.indexStringOrBytes(s, 1), 8) != $.uint(58, 8))) {
			return [out, rest, err]
		}

		let i = strings.Index($.sliceStringOrBytes(s, 2, undefined), ":]")
		if (i < 0) {
			return [out, rest, err]
		}
		i = i + (2)
		let name = $.sliceStringOrBytes(s, 0, i + 2)
		s = $.sliceStringOrBytes(s, i + 2, undefined)
		let g = $.markAsStructValue($.cloneStructValue($.mapGet<string, charGroup, charGroup>(__goscript_perl_groups.__goscript_get_posixGroup(), name, $.markAsStructValue(new charGroup()))[0]))
		if (g.sign == 0) {
			return [null, "", $.interfaceValue<$.GoError>(new Error({Code: "invalid character class range", Expr: name}), "*syntax.Error")]
		}
		return [parser.prototype.appendGroup.call(p, r, $.markAsStructValue($.cloneStructValue(g))), s, null]
	}

	public parsePerlClassEscape(s: string, r: $.Slice<number>): [$.Slice<number>, string] {
		const p: parser | $.VarRef<parser> | null = this
		let out: $.Slice<number> = null as $.Slice<number>
		let rest: string = ""
		if ((($.uint(($.pointerValue<parser>(p).flags & 64), 16) == $.uint(0, 16)) || ($.len(s) < 2)) || ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(92, 8))) {
			return [out, rest]
		}
		let g = $.markAsStructValue($.cloneStructValue($.mapGet<string, charGroup, charGroup>(__goscript_perl_groups.__goscript_get_perlGroup(), $.sliceStringOrBytes(s, 0, 2), $.markAsStructValue(new charGroup()))[0]))
		if (g.sign == 0) {
			return [out, rest]
		}
		return [parser.prototype.appendGroup.call(p, r, $.markAsStructValue($.cloneStructValue(g))), $.sliceStringOrBytes(s, 2, undefined)]
	}

	public parsePerlFlags(s: string): [string, $.GoError] {
		let p: parser | $.VarRef<parser> | null = this
		let rest: string = ""
		let err: $.GoError = null as $.GoError
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
		let startsWithP = (($.len(t) > 4) && ($.uint($.indexStringOrBytes(t, 2), 8) == $.uint(80, 8))) && ($.uint($.indexStringOrBytes(t, 3), 8) == $.uint(60, 8))
		let startsWithName = ($.len(t) > 3) && ($.uint($.indexStringOrBytes(t, 2), 8) == $.uint(60, 8))

		if (startsWithP || startsWithName) {
			// position of expr start
			let exprStartPos = 4
			if (startsWithName) {
				exprStartPos = 3
			}

			// Pull out name.
			let end = strings.IndexRune(t, $.int(62, 32))
			if (end < 0) {
				{
					err = checkUTF8(t)
					if (err != null) {
						return ["", err]
					}
				}
				return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid named capture", Expr: s}), "*syntax.Error")]
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
				return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid named capture", Expr: capture}), "*syntax.Error")]
			}

			// Like ordinary capture, but named.
			$.pointerValue<parser>(p).numCap++
			let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.op.call(p, $.uint(128, 8))
			$.pointerValue<__goscript_regexp.Regexp>(re).Cap = $.pointerValue<parser>(p).numCap
			$.pointerValue<__goscript_regexp.Regexp>(re).Name = name
			return [$.sliceStringOrBytes(t, end + 1, undefined), null]
		}

		// Non-capturing group. Might also twiddle Perl flags.
		let c: number = 0
		t = $.sliceStringOrBytes(t, 2, undefined)
		let flags = $.uint($.pointerValue<parser>(p).flags, 16)
		let sign = +1
		let sawFlag = false
		Loop: while (!$.stringEqual(t, "")) {
			{
				let __goscriptTuple11: any = nextRune(t)
				c = $.int(__goscriptTuple11[0], 32)
				t = __goscriptTuple11[1]
				err = __goscriptTuple11[2]
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
					flags = flags | ($.uint(1, 16))
					sawFlag = true
					break
				}
				case 109:
				{
					flags = flags & ~(($.uint(16, 16)))
					sawFlag = true
					break
				}
				case 115:
				{
					flags = flags | ($.uint(8, 16))
					sawFlag = true
					break
				}
				case 85:
				{
					flags = flags | ($.uint(32, 16))
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
					flags = $.uint($.uint(~flags, 16), 16)
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
						flags = $.uint($.uint(~flags, 16), 16)
					}
					if ($.int(c, 32) == $.int(58, 32)) {
						// Open new group
						parser.prototype.op.call(p, $.uint(128, 8))
					}
					$.pointerValue<parser>(p).flags = $.uint(flags, 16)
					return [t, null]
					break
				}
			}
		}

		return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid or unsupported Perl syntax", Expr: $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))}), "*syntax.Error")]
	}

	public parseRepeat(s: string): [number, number, string, boolean] {
		const p: parser | $.VarRef<parser> | null = this
		let min: number = 0
		let max: number = 0
		let rest: string = ""
		let ok: boolean = false
		if (($.stringEqual(s, "")) || ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(123, 8))) {
			return [min, max, rest, ok]
		}
		s = $.sliceStringOrBytes(s, 1, undefined)
		let ok1: boolean = false
		{
			let __goscriptTuple12: any = parser.prototype.parseInt.call(p, s)
			min = __goscriptTuple12[0]
			s = __goscriptTuple12[1]
			ok1 = __goscriptTuple12[2]
			if (!ok1) {
				return [min, max, rest, ok]
			}
		}
		if ($.stringEqual(s, "")) {
			return [min, max, rest, ok]
		}
		if ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(44, 8)) {
			max = min
		} else {
			s = $.sliceStringOrBytes(s, 1, undefined)
			if ($.stringEqual(s, "")) {
				return [min, max, rest, ok]
			}
			if ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(125, 8)) {
				max = -1
			} else {
				{
					let __goscriptTuple13: any = parser.prototype.parseInt.call(p, s)
					max = __goscriptTuple13[0]
					s = __goscriptTuple13[1]
					ok1 = __goscriptTuple13[2]
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
		if (($.stringEqual(s, "")) || ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(125, 8))) {
			return [min, max, rest, ok]
		}
		rest = $.sliceStringOrBytes(s, 1, undefined)
		ok = true
		return [min, max, rest, ok]
	}

	public parseRightParen(): $.GoError {
		let p: parser | $.VarRef<parser> | null = this
		parser.prototype.concat.call(p)
		if (parser.prototype.swapVerticalBar.call(p)) {
			// pop vertical bar
			$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, $.len($.pointerValue<parser>(p).stack) - 1)
		}
		parser.prototype.alternate.call(p)

		let n = $.len($.pointerValue<parser>(p).stack)
		if (n < 2) {
			return $.interfaceValue<$.GoError>(new Error({Code: "unexpected )", Expr: $.pointerValue<parser>(p).wholeRegexp}), "*syntax.Error")
		}
		let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
		$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 2)
		if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re2).Op, 8) != $.uint(128, 8)) {
			return $.interfaceValue<$.GoError>(new Error({Code: "unexpected )", Expr: $.pointerValue<parser>(p).wholeRegexp}), "*syntax.Error")
		}
		// Restore flags at time of paren.
		$.pointerValue<parser>(p).flags = $.uint($.pointerValue<__goscript_regexp.Regexp>(re2).Flags, 16)
		if ($.pointerValue<__goscript_regexp.Regexp>(re2).Cap == 0) {
			// Just for grouping.
			parser.prototype.push.call(p, re1)
		} else {
			$.pointerValue<__goscript_regexp.Regexp>(re2).Op = $.uint(13, 8)
			$.pointerValue<__goscript_regexp.Regexp>(re2).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re2).Sub0, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re2).Sub![0] = re1
			parser.prototype.push.call(p, re2)
		}
		return null
	}

	public async parseUnicodeClass(s: string, r: $.Slice<number>): globalThis.Promise<[$.Slice<number>, string, $.GoError]> {
		let p: parser | $.VarRef<parser> | null = this
		let out: $.Slice<number> = null as $.Slice<number>
		let rest: string = ""
		let err: $.GoError = null as $.GoError
		if (((($.uint(($.pointerValue<parser>(p).flags & 128), 16) == $.uint(0, 16)) || ($.len(s) < 2)) || ($.uint($.indexStringOrBytes(s, 0), 8) != $.uint(92, 8))) || (($.uint($.indexStringOrBytes(s, 1), 8) != $.uint(112, 8)) && ($.uint($.indexStringOrBytes(s, 1), 8) != $.uint(80, 8)))) {
			return [out, rest, err]
		}

		// Committed to parse or return error.
		let sign = +1
		if ($.uint($.indexStringOrBytes(s, 1), 8) == $.uint(80, 8)) {
			sign = -1
		}
		let t = $.sliceStringOrBytes(s, 2, undefined)
		let __goscriptTuple14: any = nextRune(t)
		let c = $.int(__goscriptTuple14[0], 32)
		t = __goscriptTuple14[1]
		err = __goscriptTuple14[2]
		if (err != null) {
			return [out, rest, err]
		}
		let seq: string = ""
		let name: string = ""
		if ($.int(c, 32) != $.int(123, 32)) {
			// Single-letter name.
			seq = $.sliceStringOrBytes(s, undefined, $.len(s) - $.len(t))
			name = $.sliceStringOrBytes(seq, 2, undefined)
		} else {
			// Name is in braces.
			let end = strings.IndexRune(s, $.int(125, 32))
			if (end < 0) {
				{
					err = checkUTF8(s)
					if (err != null) {
						return [out, rest, err]
					}
				}
				return [null, "", $.interfaceValue<$.GoError>(new Error({Code: "invalid character class range", Expr: s}), "*syntax.Error")]
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
		if ((!$.stringEqual(name, "")) && ($.uint($.indexStringOrBytes(name, 0), 8) == $.uint(94, 8))) {
			sign = -sign
			name = $.sliceStringOrBytes(name, 1, undefined)
		}

		let __goscriptTuple15: any = await unicodeTable(name)
		let tab: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = __goscriptTuple15[0]
		let fold: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = __goscriptTuple15[1]
		let tsign = __goscriptTuple15[2]
		if (tab == null) {
			return [null, "", $.interfaceValue<$.GoError>(new Error({Code: "invalid character class range", Expr: seq}), "*syntax.Error")]
		}
		if (tsign < 0) {
			sign = -sign
		}

		if (($.uint(($.pointerValue<parser>(p).flags & 1), 16) == $.uint(0, 16)) || (fold == null)) {
			if (sign > 0) {
				r = appendTable(r, tab)
			} else {
				r = appendNegatedTable(r, tab)
			}
		} else {
			// Merge and clean tab and fold in a temporary buffer.
			// This is necessary for the negative case and just tidy
			// for the positive case.
			let tmp: $.Slice<number> = $.goSlice($.pointerValue<parser>(p).tmpClass, undefined, 0)
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
		parser.prototype.concat.call(p)

		// The concatenation we just parsed is on top of the stack.
		// If it sits above an opVerticalBar, swap it below
		// (things below an opVerticalBar become an alternation).
		// Otherwise, push a new vertical bar.
		if (!parser.prototype.swapVerticalBar.call(p)) {
			parser.prototype.op.call(p, $.uint(129, 8))
		}
	}

	public push(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		let p: parser | $.VarRef<parser> | null = this
		$.pointerValue<parser>(p).numRunes = $.pointerValue<parser>(p).numRunes + ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune))
		if ((($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(4, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2)) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32))) {
			// Single rune.
			if (parser.prototype.maybeConcat.call(p, $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32), $.uint($.pointerValue<parser>(p).flags & ~(1), 16))) {
				return null
			}
			$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(3, 8)
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, 1)
			$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint($.pointerValue<parser>(p).flags & ~(1), 16)
		} else {
			if ((((((($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(4, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 4)) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32))) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2], 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![3], 32))) && ($.int(unicode.SimpleFold($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32)), 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2], 32))) && ($.int(unicode.SimpleFold($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2], 32)), 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32))) || ((((($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(4, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2)) && ($.int(($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0] + 1), 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32))) && ($.int(unicode.SimpleFold($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32)), 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32))) && ($.int(unicode.SimpleFold($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32)), 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32)))) {
				// Case-insensitive rune like [Aa] or [Δδ].
				if (parser.prototype.maybeConcat.call(p, $.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32), $.uint($.pointerValue<parser>(p).flags | 1, 16))) {
					return null
				}

				// Rewrite as (case-insensitive) literal.
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(3, 8)
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, 1)
				$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint($.pointerValue<parser>(p).flags | 1, 16)
			} else {
				// Incremental concatenation.
				parser.prototype.maybeConcat.call(p, $.int(-1, 32), $.uint(0, 16))
			}
		}

		$.pointerValue<parser>(p).stack = $.append($.pointerValue<parser>(p).stack, re)
		parser.prototype.checkLimits.call(p, re)
		return re
	}

	public removeLeadingRegexp(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, reuse: boolean): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if (($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(18, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			if (reuse) {
				parser.prototype.reuse.call(p, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0])
			}
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, undefined, $.copy($.pointerValue<__goscript_regexp.Regexp>(re).Sub, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub, 1, undefined)))
			switch ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)) {
				case 0:
				{
					$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(2, 8)
					$.pointerValue<__goscript_regexp.Regexp>(re).Sub = null
					break
				}
				case 1:
				{
					let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
					re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
					parser.prototype.reuse.call(p, old)
					break
				}
			}
			return re
		}
		if (reuse) {
			parser.prototype.reuse.call(p, re)
		}
		return parser.prototype.newRegexp.call(p, $.uint(2, 8))
	}

	public removeLeadingString(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, n: number): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		const p: parser | $.VarRef<parser> | null = this
		if (($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(18, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) > 0)) {
			// Removing a leading string in a concatenation
			// might simplify the concatenation.
			let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]
			sub = parser.prototype.removeLeadingString.call(p, sub, n)
			$.pointerValue<__goscript_regexp.Regexp>(re).Sub![0] = sub
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(sub).Op, 8) == $.uint(2, 8)) {
				parser.prototype.reuse.call(p, sub)
				switch ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub)) {
					case 0:
					case 1:
					{
						$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(2, 8)
						$.pointerValue<__goscript_regexp.Regexp>(re).Sub = null
						break
					}
					case 2:
					{
						let old: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = re
						re = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![1]
						parser.prototype.reuse.call(p, old)
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

		if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(3, 8)) {
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, undefined, $.copy($.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, n, undefined)))
			if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 0) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(2, 8)
			}
		}
		return re
	}

	public repeat(op: __goscript_regexp.Op, min: number, max: number, before: string, after: string, lastRepeat: string): [string, $.GoError] {
		let p: parser | $.VarRef<parser> | null = this
		let flags = $.uint($.pointerValue<parser>(p).flags, 16)
		if ($.uint(($.pointerValue<parser>(p).flags & 64), 16) != $.uint(0, 16)) {
			if (($.len(after) > 0) && ($.uint($.indexStringOrBytes(after, 0), 8) == $.uint(63, 8))) {
				after = $.sliceStringOrBytes(after, 1, undefined)
				flags = flags ^ ($.uint(32, 16))
			}
			if (!$.stringEqual(lastRepeat, "")) {
				// In Perl it is not allowed to stack repetition operators:
				// a** is a syntax error, not a doubled star, and a++ means
				// something else entirely, which we don't support!
				return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid nested repetition operator", Expr: $.sliceStringOrBytes(lastRepeat, undefined, $.len(lastRepeat) - $.len(after))}), "*syntax.Error")]
			}
		}
		let n = $.len($.pointerValue<parser>(p).stack)
		if (n == 0) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: "missing argument to repetition operator", Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
		}
		let sub: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
		if ($.pointerValue<__goscript_regexp.Regexp>(sub).Op >= 128) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: "missing argument to repetition operator", Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
		}

		let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = parser.prototype.newRegexp.call(p, $.uint(op, 8))
		$.pointerValue<__goscript_regexp.Regexp>(re).Min = min
		$.pointerValue<__goscript_regexp.Regexp>(re).Max = max
		$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint(flags, 16)
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Sub0, undefined, 1)
		$.pointerValue<__goscript_regexp.Regexp>(re).Sub![0] = sub
		$.pointerValue<parser>(p).stack![n - 1] = re
		parser.prototype.checkLimits.call(p, re)

		if ((($.uint(op, 8) == $.uint(17, 8)) && ((min >= 2) || (max >= 2))) && !repeatIsValid(re, 1000)) {
			return ["", $.interfaceValue<$.GoError>(new Error({Code: "invalid repeat count", Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
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
		if ((((n >= 3) && ($.uint($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<parser>(p).stack![n - 2]).Op, 8) == $.uint(129, 8))) && isCharClass($.pointerValue<parser>(p).stack![n - 1])) && isCharClass($.pointerValue<parser>(p).stack![n - 3])) {
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
			parser.prototype.reuse.call(p, re1)
			$.pointerValue<parser>(p).stack = $.goSlice($.pointerValue<parser>(p).stack, undefined, n - 1)
			return true
		}

		if (n >= 2) {
			let re1: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 1]
			let re2: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = $.pointerValue<parser>(p).stack![n - 2]
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re2).Op, 8) == $.uint(129, 8)) {
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
		[{ name: "alternate", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "appendGroup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }] }, { name: "calcHeight", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "calcSize", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "checkHeight", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "checkLimits", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "checkSize", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "collapse", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "concat", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "factor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } } }] }, { name: "leadingRegexp", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "leadingString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }, { type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "syntax.Flags" } }] }, { name: "literal", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "maybeConcat", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "newRegexp", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "op", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "parseClass", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parseClassChar", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parseEscape", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parseInt", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "parseNamedClass", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parsePerlClassEscape", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }, { type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "parsePerlFlags", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parseRepeat", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "parseRightParen", args: [], returns: [{ type: "error" }] }, { name: "parseUnicodeClass", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "parseVerticalBar", args: [], returns: [] }, { name: "push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "removeLeadingRegexp", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "removeLeadingString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }] }, { name: "repeat", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: "error" }] }, { name: "reuse", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "swapVerticalBar", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		parser,
		[{ name: "flags", key: "flags", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "syntax.Flags" } }, { name: "stack", key: "stack", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } } }, { name: "free", key: "free", type: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }, { name: "numCap", key: "numCap", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "wholeRegexp", key: "wholeRegexp", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "tmpClass", key: "tmpClass", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }, { name: "numRegexp", key: "numRegexp", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "numRunes", key: "numRunes", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "repeats", key: "repeats", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "height", key: "height", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { name: "size", key: "size", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, elemType: { kind: $.TypeKind.Basic, name: "int64" } } }]
	)
}

export class charGroup {
	public get sign(): number {
		return this._fields.sign.value
	}
	public set sign(value: number) {
		this._fields.sign.value = value
	}

	public get _class(): $.Slice<number> {
		return this._fields._class.value
	}
	public set _class(value: $.Slice<number>) {
		this._fields._class.value = value
	}

	public _fields: {
		sign: $.VarRef<number>
		_class: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{sign?: number, _class?: $.Slice<number>}>) {
		this._fields = {
			sign: $.varRef(init?.sign ?? (0 as unknown as number)),
			_class: $.varRef(init?._class ?? (null as unknown as $.Slice<number>))
		}
	}

	public clone(): charGroup {
		const cloned = new charGroup()
		cloned._fields = {
			sign: $.varRef(this._fields.sign.value),
			_class: $.varRef(this._fields._class.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"syntax.charGroup",
		() => new charGroup(),
		[],
		charGroup,
		[{ name: "sign", key: "sign", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "class", key: "_class", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } }]
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
			p: $.varRef(init?.p ?? (null as unknown as $.VarRef<$.Slice<number>> | null))
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
		let p: $.Slice<number> = $.pointerValue<$.Slice<number>>(ra.p)
		i = i * (2)
		j = j * (2)
		return (p![i] < p![j]) || (($.int(p![i], 32) == $.int(p![j], 32)) && (p![i + 1] > p![j + 1]))
	}

	public Swap(i: number, j: number): void {
		const ra = this
		let p: $.Slice<number> = $.pointerValue<$.Slice<number>>(ra.p)
		i = i * (2)
		j = j * (2)
		let __goscriptAssign6_0: number = $.int(p![j], 32)
		let __goscriptAssign6_1: number = $.int(p![j + 1], 32)
		let __goscriptAssign6_2: number = $.int(p![i], 32)
		let __goscriptAssign6_3: number = $.int(p![i + 1], 32)
		p![i] = __goscriptAssign6_0
		p![i + 1] = __goscriptAssign6_1
		p![j] = __goscriptAssign6_2
		p![j + 1] = __goscriptAssign6_3
	}

	static __typeInfo = $.registerStructType(
		"syntax.ranges",
		() => new ranges(),
		[{ name: "Len", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Less", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Swap", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		ranges,
		[{ name: "p", key: "p", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } } } }]
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
	if ((r < 65) || (r > 125251)) {
		return $.int(r, 32)
	}
	let m = $.int(r, 32)
	let r0 = $.int(r, 32)
	for (r = $.int(unicode.SimpleFold($.int(r, 32)), 32); $.int(r, 32) != $.int(r0, 32); r = $.int(unicode.SimpleFold($.int(r, 32)), 32)) {
		m = $.int($.min($.int(m, 32), $.int(r, 32)), 32)
	}
	return $.int(m, 32)
}

export function repeatIsValid(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, n: number): boolean {
	if ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(17, 8)) {
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
			n = Math.trunc(n / m)
		}
	}
	for (let __goscriptRangeTarget7 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
		let sub = __goscriptRangeTarget7![__rangeIndex]
		if (!repeatIsValid(sub, n)) {
			return false
		}
	}
	return true
}

export function cleanAlt(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
	switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
		case 4:
		{
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = cleanClass($.pointerValue<__goscript_regexp.Regexp>(re)._fields.Rune)
			if ((($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 2) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32) == $.int(0, 32))) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32) == $.int(unicode.MaxRune, 32))) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = null
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(6, 8)
				return
			}
			if ((((($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 4) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32) == $.int(0, 32))) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![1], 32) == $.int((10 - 1), 32))) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![2], 32) == $.int((10 + 1), 32))) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![3], 32) == $.int(unicode.MaxRune, 32))) {
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = null
				$.pointerValue<__goscript_regexp.Regexp>(re).Op = $.uint(5, 8)
				return
			}
			if (($.cap($.pointerValue<__goscript_regexp.Regexp>(re).Rune) - $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune)) > 100) {
				// re.Rune will not grow any more.
				// Make a copy or inline to reclaim storage.
				$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.appendSlice($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0), $.pointerValue<__goscript_regexp.Regexp>(re).Rune)
			}
			break
		}
	}
}

export function literalRegexp(s: string, flags: Flags): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
	let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = new __goscript_regexp.Regexp({Op: $.uint(3, 8)})
	$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint(flags, 16)
	$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0)
	for (const [__rangeIndex, c] of $.rangeString(s)) {
		if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) >= $.cap($.pointerValue<__goscript_regexp.Regexp>(re).Rune)) {
			// string is too long to fit in Rune0.  let Go handle it
			$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.stringToRunes(s)
			break
		}
		$.pointerValue<__goscript_regexp.Regexp>(re).Rune = $.append($.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.int(c, 32))
	}
	return re
}

export async function Parse(s: string, flags: Flags): globalThis.Promise<[__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError]> {
	return await parse(s, $.uint(flags, 16))
}

export async function parse(s: string, flags: Flags): globalThis.Promise<[__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError]> {
	let err: $.GoError = null as $.GoError
	using __defer = new $.DisposableStack()
	__defer.defer(() => { ((): void => {
		{
			let r = $.recover()
			let __goscriptSwitch0 = r
			switch (true) {
				default:
				{
					$.panic(r)
					break
				}
				case $.comparableEqual(__goscriptSwitch0, null):
				{
					break
				}
				case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<any>("expression too large", "syntax.ErrorCode", {String: (receiver: any, ...args: any[]) => (ErrorCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" })):
				{
					err = $.interfaceValue<$.GoError>(new Error({Code: "expression too large", Expr: s}), "*syntax.Error")
					break
				}
				case $.comparableEqual(__goscriptSwitch0, $.namedValueInterfaceValue<any>("expression nests too deeply", "syntax.ErrorCode", {String: (receiver: any, ...args: any[]) => (ErrorCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "string", typeName: "syntax.ErrorCode" })):
				{
					err = $.interfaceValue<$.GoError>(new Error({Code: "expression nests too deeply", Expr: s}), "*syntax.Error")
					break
				}
			}
		}
	})() })

	if ($.uint((flags & 2), 16) != $.uint(0, 16)) {
		// Trivial parser for literal string.
		{
			let __goscriptShadow4 = checkUTF8(s)
			if (__goscriptShadow4 != null) {
				const __goscriptReturn3: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, __goscriptShadow4]
				err = __goscriptReturn3[1]
				__defer[Symbol.dispose]()
				return [__goscriptReturn3[0], err]
			}
		}
		const __goscriptReturn4: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [literalRegexp(s, $.uint(flags, 16)), null]
		err = __goscriptReturn4[1]
		__defer[Symbol.dispose]()
		return [__goscriptReturn4[0], err]
	}

	// Otherwise, must do real work.
	let p: $.VarRef<parser> = $.varRef($.markAsStructValue(new parser()))
	let c: number = 0
	let op: __goscript_regexp.Op = 0
	let lastRepeat: string = ""
	p.value.flags = $.uint(flags, 16)
	p.value.wholeRegexp = s
	let t = s
	while (!$.stringEqual(t, "")) {
		let repeat = ""
		BigSwitch: {
			switch ($.indexStringOrBytes(t, 0)) {
				default:
				{
					{
						let __goscriptTuple16: any = nextRune(t)
						c = $.int(__goscriptTuple16[0], 32)
						t = __goscriptTuple16[1]
						err = __goscriptTuple16[2]
						if (err != null) {
							const __goscriptReturn5: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn5[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn5[0], err]
						}
					}
					p.value.literal($.int(c, 32))
					break
				}
				case 40:
				{
					if ((($.uint((p.value.flags & 64), 16) != $.uint(0, 16)) && ($.len(t) >= 2)) && ($.uint($.indexStringOrBytes(t, 1), 8) == $.uint(63, 8))) {
						// Flag changes and non-capturing groups.
						{
							let __goscriptTuple17: any = p.value.parsePerlFlags(t)
							t = __goscriptTuple17[0]
							err = __goscriptTuple17[1]
							if (err != null) {
								const __goscriptReturn6: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
								err = __goscriptReturn6[1]
								__defer[Symbol.dispose]()
								return [__goscriptReturn6[0], err]
							}
						}
						break
					}
					p.value.numCap++
					$.pointerValue<__goscript_regexp.Regexp>(p.value.op($.uint(128, 8))).Cap = p.value.numCap
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
							const __goscriptReturn7: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn7[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn7[0], err]
						}
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 94:
				{
					if ($.uint((p.value.flags & 16), 16) != $.uint(0, 16)) {
						p.value.op($.uint(9, 8))
					} else {
						p.value.op($.uint(7, 8))
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 36:
				{
					if ($.uint((p.value.flags & 16), 16) != $.uint(0, 16)) {
						$.pointerValue<__goscript_regexp.Regexp>(p.value.op($.uint(10, 8))).Flags = $.pointerValue<__goscript_regexp.Regexp>(p.value.op($.uint(10, 8))).Flags | ($.uint(256, 16))
					} else {
						p.value.op($.uint(8, 8))
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 46:
				{
					if ($.uint((p.value.flags & 8), 16) != $.uint(0, 16)) {
						p.value.op($.uint(6, 8))
					} else {
						p.value.op($.uint(5, 8))
					}
					t = $.sliceStringOrBytes(t, 1, undefined)
					break
				}
				case 91:
				{
					{
						let __goscriptTuple18: any = await p.value.parseClass(t)
						t = __goscriptTuple18[0]
						err = __goscriptTuple18[1]
						if (err != null) {
							const __goscriptReturn8: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn8[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn8[0], err]
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
							op = $.uint(14, 8)
							break
						}
						case 43:
						{
							op = $.uint(15, 8)
							break
						}
						case 63:
						{
							op = $.uint(16, 8)
							break
						}
					}
					let after = $.sliceStringOrBytes(t, 1, undefined)
					{
						let __goscriptTuple19: any = p.value.repeat($.uint(op, 8), 0, 0, before, after, lastRepeat)
						after = __goscriptTuple19[0]
						err = __goscriptTuple19[1]
						if (err != null) {
							const __goscriptReturn9: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn9[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn9[0], err]
						}
					}
					repeat = before
					t = after
					break
				}
				case 123:
				{
					op = $.uint(17, 8)
					let before = t
					let [min, max, after, ok] = p.value.parseRepeat(t)
					if (!ok) {
						// If the repeat cannot be parsed, { is a literal.
						p.value.literal($.int(123, 32))
						t = $.sliceStringOrBytes(t, 1, undefined)
						break
					}
					if ((((min < 0) || (min > 1000)) || (max > 1000)) || ((max >= 0) && (min > max))) {
						// Numbers were too big, or max is present and min > max.
						const __goscriptReturn10: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, $.interfaceValue<$.GoError>(new Error({Code: "invalid repeat count", Expr: $.sliceStringOrBytes(before, undefined, $.len(before) - $.len(after))}), "*syntax.Error")]
						err = __goscriptReturn10[1]
						__defer[Symbol.dispose]()
						return [__goscriptReturn10[0], err]
					}
					{
						let __goscriptTuple20: any = p.value.repeat($.uint(op, 8), min, max, before, after, lastRepeat)
						after = __goscriptTuple20[0]
						err = __goscriptTuple20[1]
						if (err != null) {
							const __goscriptReturn11: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn11[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn11[0], err]
						}
					}
					repeat = before
					t = after
					break
				}
				case 92:
				{
					if (($.uint((p.value.flags & 64), 16) != $.uint(0, 16)) && ($.len(t) >= 2)) {
						switch ($.indexStringOrBytes(t, 1)) {
							case 65:
							{
								p.value.op($.uint(9, 8))
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 98:
							{
								p.value.op($.uint(11, 8))
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 66:
							{
								p.value.op($.uint(12, 8))
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
							case 67:
							{
								const __goscriptReturn12: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, $.interfaceValue<$.GoError>(new Error({Code: "invalid escape sequence", Expr: $.sliceStringOrBytes(t, undefined, 2)}), "*syntax.Error")]
								err = __goscriptReturn12[1]
								__defer[Symbol.dispose]()
								return [__goscriptReturn12[0], err]
								break
							}
							case 81:
							{
								let lit: string = ""
								let __goscriptTuple21: any = strings.Cut($.sliceStringOrBytes(t, 2, undefined), "\\E")
								lit = __goscriptTuple21[0]
								t = __goscriptTuple21[1]
								while (!$.stringEqual(lit, "")) {
									let __goscriptTuple22: any = nextRune(lit)
									let __goscriptShadow5 = $.int(__goscriptTuple22[0], 32)
									let rest = __goscriptTuple22[1]
									let __goscriptShadow6 = __goscriptTuple22[2]
									if (__goscriptShadow6 != null) {
										const __goscriptReturn13: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, __goscriptShadow6]
										err = __goscriptReturn13[1]
										__defer[Symbol.dispose]()
										return [__goscriptReturn13[0], err]
									}
									p.value.literal($.int(__goscriptShadow5, 32))
									lit = rest
								}
								break BigSwitch
								break
							}
							case 122:
							{
								p.value.op($.uint(10, 8))
								t = $.sliceStringOrBytes(t, 2, undefined)
								break BigSwitch
								break
							}
						}
					}

					let re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null = p.value.newRegexp($.uint(4, 8))
					$.pointerValue<__goscript_regexp.Regexp>(re).Flags = $.uint(p.value.flags, 16)

					// Look for Unicode character group like \p{Han}
					if (($.len(t) >= 2) && (($.uint($.indexStringOrBytes(t, 1), 8) == $.uint(112, 8)) || ($.uint($.indexStringOrBytes(t, 1), 8) == $.uint(80, 8)))) {
						let __goscriptTuple23: any = await p.value.parseUnicodeClass(t, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0))
						let r: $.Slice<number> = __goscriptTuple23[0]
						let rest = __goscriptTuple23[1]
						let __goscriptShadow7 = __goscriptTuple23[2]
						if (__goscriptShadow7 != null) {
							const __goscriptReturn14: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, __goscriptShadow7]
							err = __goscriptReturn14[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn14[0], err]
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
						let __goscriptTuple24: any = p.value.parsePerlClassEscape(t, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune0, undefined, 0))
						let r: $.Slice<number> = __goscriptTuple24[0]
						let rest = __goscriptTuple24[1]
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
						let __goscriptTuple25: any = p.value.parseEscape(t)
						c = $.int(__goscriptTuple25[0], 32)
						t = __goscriptTuple25[1]
						err = __goscriptTuple25[2]
						if (err != null) {
							const __goscriptReturn15: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, err]
							err = __goscriptReturn15[1]
							__defer[Symbol.dispose]()
							return [__goscriptReturn15[0], err]
						}
					}
					p.value.literal($.int(c, 32))
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
		const __goscriptReturn16: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [null, $.interfaceValue<$.GoError>(new Error({Code: "missing closing )", Expr: s}), "*syntax.Error")]
		err = __goscriptReturn16[1]
		__defer[Symbol.dispose]()
		return [__goscriptReturn16[0], err]
	}
	const __goscriptReturn17: [__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, $.GoError] = [p.value.stack![0], null]
	err = __goscriptReturn17[1]
	__defer[Symbol.dispose]()
	return [__goscriptReturn17[0], err]
	throw new globalThis.Error("goscript: unreachable return")
}

export function isValidCaptureName(name: string): boolean {
	if ($.stringEqual(name, "")) {
		return false
	}
	for (const [__rangeIndex, c] of $.rangeString(name)) {
		if (($.int(c, 32) != $.int(95, 32)) && !isalnum($.int(c, 32))) {
			return false
		}
	}
	return true
}

export function isCharClass(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): boolean {
	return (((($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(3, 8)) && ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 1)) || ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(4, 8))) || ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(5, 8))) || ($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Op, 8) == $.uint(6, 8))
}

export function matchRune(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, r: number): boolean {
	switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
		case 3:
		{
			return ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 1) && ($.int($.pointerValue<__goscript_regexp.Regexp>(re).Rune![0], 32) == $.int(r, 32))
			break
		}
		case 4:
		{
			for (let i = 0; i < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune); i = i + (2)) {
				if (($.pointerValue<__goscript_regexp.Regexp>(re).Rune![i] <= r) && (r <= $.pointerValue<__goscript_regexp.Regexp>(re).Rune![i + 1])) {
					return true
				}
			}
			return false
			break
		}
		case 5:
		{
			return $.int(r, 32) != $.int(10, 32)
			break
		}
		case 6:
		{
			return true
			break
		}
	}
	return false
}

export function mergeCharClass(dst: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, src: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): void {
	switch ($.pointerValue<__goscript_regexp.Regexp>(dst).Op) {
		case 6:
		{
			break
		}
		case 5:
		{
			if (matchRune(src, $.int(10, 32))) {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Op = $.uint(6, 8)
			}
			break
		}
		case 4:
		{
			if ($.uint($.pointerValue<__goscript_regexp.Regexp>(src).Op, 8) == $.uint(3, 8)) {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.int($.pointerValue<__goscript_regexp.Regexp>(src).Rune![0], 32), $.uint($.pointerValue<__goscript_regexp.Regexp>(src).Flags, 16))
			} else {
				$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendClass($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.pointerValue<__goscript_regexp.Regexp>(src).Rune)
			}
			break
		}
		case 3:
		{
			if (($.int($.pointerValue<__goscript_regexp.Regexp>(src).Rune![0], 32) == $.int($.pointerValue<__goscript_regexp.Regexp>(dst).Rune![0], 32)) && ($.uint($.pointerValue<__goscript_regexp.Regexp>(src).Flags, 16) == $.uint($.pointerValue<__goscript_regexp.Regexp>(dst).Flags, 16))) {
				break
			}
			$.pointerValue<__goscript_regexp.Regexp>(dst).Op = $.uint(4, 8)
			$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.goSlice($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, undefined, 0), $.int($.pointerValue<__goscript_regexp.Regexp>(dst).Rune![0], 32), $.uint($.pointerValue<__goscript_regexp.Regexp>(dst).Flags, 16))
			$.pointerValue<__goscript_regexp.Regexp>(dst).Rune = appendLiteral($.pointerValue<__goscript_regexp.Regexp>(dst).Rune, $.int($.pointerValue<__goscript_regexp.Regexp>(src).Rune![0], 32), $.uint($.pointerValue<__goscript_regexp.Regexp>(src).Flags, 16))
			break
		}
	}
}

export let anyTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: $.uint(0, 16), Hi: $.uint((65536) - 1, 16), Stride: $.uint(1, 16)}))]), R32: $.arrayToSlice<unicode.Range32>([$.markAsStructValue(new unicode.Range32({Lo: $.uint(65536, 32), Hi: $.uint(unicode.MaxRune, 32), Stride: $.uint(1, 32)}))])})

export function __goscript_set_anyTable(__goscriptValue: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	anyTable = __goscriptValue
}

export let asciiTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: $.uint(0, 16), Hi: $.uint(0x7F, 16), Stride: $.uint(1, 16)}))])})

export function __goscript_set_asciiTable(__goscriptValue: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	asciiTable = __goscriptValue
}

export let asciiFoldTable: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: $.uint(0, 16), Hi: $.uint(0x7F, 16), Stride: $.uint(1, 16)})), $.markAsStructValue(new unicode.Range16({Lo: $.uint(0x017F, 16), Hi: $.uint(0x017F, 16), Stride: $.uint(1, 16)})), $.markAsStructValue(new unicode.Range16({Lo: $.uint(0x212A, 16), Hi: $.uint(0x212A, 16), Stride: $.uint(1, 16)}))])})

export function __goscript_set_asciiFoldTable(__goscriptValue: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	asciiFoldTable = __goscriptValue
}

export let categoryAliases: {"once": sync.Once, "m": globalThis.Map<string, string> | null} = {"once": $.markAsStructValue(new sync.Once()), "m": null}

export function __goscript_set_categoryAliases(__goscriptValue: {"once": sync.Once, "m": globalThis.Map<string, string> | null}): void {
	categoryAliases = __goscriptValue
}

export function initCategoryAliases(): void {
	categoryAliases.m = $.makeMap<string, string>()
	for (let [name, actual] of unicode.CategoryAliases?.entries() ?? []) {
		$.mapSet(categoryAliases.m, canonicalName(name), actual)
	}
}

export function canonicalName(name: string): string {
	let b: $.Slice<number> = null as $.Slice<number>
	let first = true
	for (let i = 0; i < $.len(name); i++) {
		let c = $.uint($.indexStringOrBytes(name, i), 8)
		switch (true) {
			case (($.uint(c, 8) == $.uint(95, 8)) || ($.uint(c, 8) == $.uint(45, 8))) || ($.uint(c, 8) == $.uint(32, 8)):
			{
				c = $.uint(32, 8)
				break
			}
			case first:
			{
				if ((97 <= c) && (c <= 122)) {
					c = c - ($.uint(97 - 65, 8))
				}
				first = false
				break
			}
			default:
			{
				if ((65 <= c) && (c <= 90)) {
					c = c + ($.uint(97 - 65, 8))
				}
				break
			}
		}
		if (b == null) {
			if (($.uint(c, 8) == $.uint($.indexStringOrBytes(name, i), 8)) && ($.uint(c, 8) != $.uint(32, 8))) {
				// No changes so far, avoid allocating b.
				continue
			}
			b = $.makeSlice<number>(i, $.len(name), "byte")
			$.copy(b, $.sliceStringOrBytes(name, undefined, i))
		}
		if ($.uint(c, 8) == $.uint(32, 8)) {
			continue
		}
		b = $.append(b, $.uint(c, 8))
	}
	if (b == null) {
		return name
	}
	return $.bytesToString(b)
}

export async function unicodeTable(name: string): globalThis.Promise<[unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, number]> {
	let tab: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = null as unicode.RangeTable | $.VarRef<unicode.RangeTable> | null
	let fold: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = null as unicode.RangeTable | $.VarRef<unicode.RangeTable> | null
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
			return [$.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.Categories, "LC", null)[0], $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.FoldCategory, "LC", null)[0], +1]
			break
		}
	}
	{
		let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.Categories, name, null)[0]
		if (t != null) {
			return [t, $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.FoldCategory, name, null)[0], +1]
		}
	}
	{
		let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.Scripts, name, null)[0]
		if (t != null) {
			return [t, $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.FoldScript, name, null)[0], +1]
		}
	}

	// unicode.CategoryAliases makes liberal use of underscores in its names
	// (they are defined that way by Unicode), but we want to match ignoring
	// the underscores, so make our own map with canonical names.
	await categoryAliases.once.Do(initCategoryAliases)
	{
		let actual = $.mapGet<string, string, string>(categoryAliases.m, name, "")[0]
		if (!$.stringEqual(actual, "")) {
			let t: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.Categories, actual, null)[0]
			return [t, $.mapGet<string, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null, unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>(unicode.FoldCategory, actual, null)[0], +1]
		}
	}
	return [null, null, 0]
}

export function cleanClass(rp: $.VarRef<$.Slice<number>> | null): $.Slice<number> {

	// Sort by lo increasing, hi decreasing to break ties.
	sort.Sort($.interfaceValue<sort.Interface | null>($.markAsStructValue(new ranges({p: rp})), "syntax.ranges"))

	let r: $.Slice<number> = $.pointerValue<$.Slice<number>>(rp)
	if ($.len(r) < 2) {
		return r
	}

	// Merge abutting, overlapping.
	let w = 2
	for (let i = 2; i < $.len(r); i = i + (2)) {
		let lo = $.int(r![i], 32)
		let hi = $.int(r![i + 1], 32)
		if (lo <= (r![w - 1] + 1)) {
			// merge with previous range
			if (hi > r![w - 1]) {
				r![w - 1] = $.int(hi, 32)
			}
			continue
		}
		// new disjoint range
		r![w] = $.int(lo, 32)
		r![w + 1] = $.int(hi, 32)
		w = w + (2)
	}

	return $.goSlice(r, undefined, w)
}

export function inCharClass(r: number, _class: $.Slice<number>): boolean {
	let [, ok] = sort.Find(Math.trunc($.len(_class) / 2), $.functionValue((i: number): number => {
		let lo = $.int(_class![2 * i], 32)
		let hi = $.int(_class![(2 * i) + 1], 32)
		if (r > hi) {
			return +1
		}
		if (r < lo) {
			return -1
		}
		return 0
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
	return ok
}

export function appendLiteral(r: $.Slice<number>, x: number, flags: Flags): $.Slice<number> {
	if ($.uint((flags & 1), 16) != $.uint(0, 16)) {
		return appendFoldedRange(r, $.int(x, 32), $.int(x, 32))
	}
	return appendRange(r, $.int(x, 32), $.int(x, 32))
}

export function appendRange(r: $.Slice<number>, lo: number, hi: number): $.Slice<number> {
	// Expand last range or next to last range if it overlaps or abuts.
	// Checking two ranges helps when appending case-folded
	// alphabets, so that one range can be expanding A-Z and the
	// other expanding a-z.
	let n = $.len(r)
	for (let i = 2; i <= 4; i = i + (2)) {
		if (n >= i) {
			let rlo = $.int(r![n - i], 32)
			let rhi = $.int(r![(n - i) + 1], 32)
			if ((lo <= (rhi + 1)) && (rlo <= (hi + 1))) {
				if (lo < rlo) {
					r![n - i] = $.int(lo, 32)
				}
				if (hi > rhi) {
					r![(n - i) + 1] = $.int(hi, 32)
				}
				return r
			}
		}
	}

	return $.append(r, $.int(lo, 32), $.int(hi, 32))
}

export function appendFoldedRange(r: $.Slice<number>, lo: number, hi: number): $.Slice<number> {
	// Optimizations.
	if ((lo <= 65) && (hi >= 125251)) {
		// Range is full: folding can't add more.
		return appendRange(r, $.int(lo, 32), $.int(hi, 32))
	}
	if ((hi < 65) || (lo > 125251)) {
		// Range is outside folding possibilities.
		return appendRange(r, $.int(lo, 32), $.int(hi, 32))
	}
	if (lo < 65) {
		// [lo, minFold-1] needs no folding.
		r = appendRange(r, $.int(lo, 32), $.int(65 - 1, 32))
		lo = $.int(65, 32)
	}
	if (hi > 125251) {
		// [maxFold+1, hi] needs no folding.
		r = appendRange(r, $.int(125251 + 1, 32), $.int(hi, 32))
		hi = $.int(125251, 32)
	}

	// Brute force. Depend on appendRange to coalesce ranges on the fly.
	for (let c = $.int(lo, 32); c <= hi; c++) {
		r = appendRange(r, $.int(c, 32), $.int(c, 32))
		let f = $.int(unicode.SimpleFold($.int(c, 32)), 32)
		while ($.int(f, 32) != $.int(c, 32)) {
			r = appendRange(r, $.int(f, 32), $.int(f, 32))
			f = $.int(unicode.SimpleFold($.int(f, 32)), 32)
		}
	}
	return r
}

export function appendClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	for (let i = 0; i < $.len(x); i = i + (2)) {
		r = appendRange(r, $.int(x![i], 32), $.int(x![i + 1], 32))
	}
	return r
}

export function appendFoldedClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	for (let i = 0; i < $.len(x); i = i + (2)) {
		r = appendFoldedRange(r, $.int(x![i], 32), $.int(x![i + 1], 32))
	}
	return r
}

export function appendNegatedClass(r: $.Slice<number>, x: $.Slice<number>): $.Slice<number> {
	let nextLo = $.int(0, 32)
	for (let i = 0; i < $.len(x); i = i + (2)) {
		let lo = $.int(x![i], 32)
		let hi = $.int(x![i + 1], 32)
		if (nextLo <= (lo - 1)) {
			r = appendRange(r, $.int(nextLo, 32), $.int(lo - 1, 32))
		}
		nextLo = $.int(hi + 1, 32)
	}
	if (nextLo <= unicode.MaxRune) {
		r = appendRange(r, $.int(nextLo, 32), $.int(unicode.MaxRune, 32))
	}
	return r
}

export function appendTable(r: $.Slice<number>, x: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): $.Slice<number> {
	for (let __goscriptRangeTarget8 = $.pointerValue<unicode.RangeTable>(x).R16, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
		let xr = __goscriptRangeTarget8![__rangeIndex]
		let lo = $.int($.int(xr.Lo, 32), 32)
		let hi = $.int($.int(xr.Hi, 32), 32)
		let stride = $.int($.int(xr.Stride, 32), 32)
		if ($.int(stride, 32) == $.int(1, 32)) {
			r = appendRange(r, $.int(lo, 32), $.int(hi, 32))
			continue
		}
		for (let c = $.int(lo, 32); c <= hi; c = c + ($.int(stride, 32))) {
			r = appendRange(r, $.int(c, 32), $.int(c, 32))
		}
	}
	for (let __goscriptRangeTarget9 = $.pointerValue<unicode.RangeTable>(x).R32, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
		let xr = __goscriptRangeTarget9![__rangeIndex]
		let lo = $.int($.int(xr.Lo, 32), 32)
		let hi = $.int($.int(xr.Hi, 32), 32)
		let stride = $.int($.int(xr.Stride, 32), 32)
		if ($.int(stride, 32) == $.int(1, 32)) {
			r = appendRange(r, $.int(lo, 32), $.int(hi, 32))
			continue
		}
		for (let c = $.int(lo, 32); c <= hi; c = c + ($.int(stride, 32))) {
			r = appendRange(r, $.int(c, 32), $.int(c, 32))
		}
	}
	return r
}

export function appendNegatedTable(r: $.Slice<number>, x: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): $.Slice<number> {
	let nextLo = $.int(0, 32)
	for (let __goscriptRangeTarget10 = $.pointerValue<unicode.RangeTable>(x).R16, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
		let xr = __goscriptRangeTarget10![__rangeIndex]
		let lo = $.int($.int(xr.Lo, 32), 32)
		let hi = $.int($.int(xr.Hi, 32), 32)
		let stride = $.int($.int(xr.Stride, 32), 32)
		if ($.int(stride, 32) == $.int(1, 32)) {
			if (nextLo <= (lo - 1)) {
				r = appendRange(r, $.int(nextLo, 32), $.int(lo - 1, 32))
			}
			nextLo = $.int(hi + 1, 32)
			continue
		}
		for (let c = $.int(lo, 32); c <= hi; c = c + ($.int(stride, 32))) {
			if (nextLo <= (c - 1)) {
				r = appendRange(r, $.int(nextLo, 32), $.int(c - 1, 32))
			}
			nextLo = $.int(c + 1, 32)
		}
	}
	for (let __goscriptRangeTarget11 = $.pointerValue<unicode.RangeTable>(x).R32, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
		let xr = __goscriptRangeTarget11![__rangeIndex]
		let lo = $.int($.int(xr.Lo, 32), 32)
		let hi = $.int($.int(xr.Hi, 32), 32)
		let stride = $.int($.int(xr.Stride, 32), 32)
		if ($.int(stride, 32) == $.int(1, 32)) {
			if (nextLo <= (lo - 1)) {
				r = appendRange(r, $.int(nextLo, 32), $.int(lo - 1, 32))
			}
			nextLo = $.int(hi + 1, 32)
			continue
		}
		for (let c = $.int(lo, 32); c <= hi; c = c + ($.int(stride, 32))) {
			if (nextLo <= (c - 1)) {
				r = appendRange(r, $.int(nextLo, 32), $.int(c - 1, 32))
			}
			nextLo = $.int(c + 1, 32)
		}
	}
	if (nextLo <= unicode.MaxRune) {
		r = appendRange(r, $.int(nextLo, 32), $.int(unicode.MaxRune, 32))
	}
	return r
}

export function negateClass(r: $.Slice<number>): $.Slice<number> {
	let nextLo = $.int(0, 32)
	let w = 0
	for (let i = 0; i < $.len(r); i = i + (2)) {
		let lo = $.int(r![i], 32)
		let hi = $.int(r![i + 1], 32)
		if (nextLo <= (lo - 1)) {
			r![w] = $.int(nextLo, 32)
			r![w + 1] = $.int(lo - 1, 32)
			w = w + (2)
		}
		nextLo = $.int(hi + 1, 32)
	}
	r = $.goSlice(r, undefined, w)
	if (nextLo <= unicode.MaxRune) {
		// It's possible for the negation to have one more
		// range - this one - than the original class, so use append.
		r = $.append(r, $.int(nextLo, 32), $.int(unicode.MaxRune, 32))
	}
	return r
}

export function checkUTF8(s: string): $.GoError {
	while (!$.stringEqual(s, "")) {
		let __goscriptTuple26: any = utf8.DecodeRuneInString(s)
		let rune = $.int(__goscriptTuple26[0], 32)
		let size = __goscriptTuple26[1]
		if (($.int(rune, 32) == $.int(utf8.RuneError, 32)) && (size == 1)) {
			return $.interfaceValue<$.GoError>(new Error({Code: "invalid UTF-8", Expr: s}), "*syntax.Error")
		}
		s = $.sliceStringOrBytes(s, size, undefined)
	}
	return null
}

export function nextRune(s: string): [number, string, $.GoError] {
	let c: number = 0
	let t: string = ""
	let err: $.GoError = null as $.GoError
	let __goscriptTuple27: any = utf8.DecodeRuneInString(s)
	c = $.int(__goscriptTuple27[0], 32)
	let size = __goscriptTuple27[1]
	if (($.int(c, 32) == $.int(utf8.RuneError, 32)) && (size == 1)) {
		return [$.int(0, 32), "", $.interfaceValue<$.GoError>(new Error({Code: "invalid UTF-8", Expr: s}), "*syntax.Error")]
	}
	return [$.int(c, 32), $.sliceStringOrBytes(s, size, undefined), null]
}

export function isalnum(c: number): boolean {
	return (((48 <= c) && (c <= 57)) || ((65 <= c) && (c <= 90))) || ((97 <= c) && (c <= 122))
}

export function unhex(c: number): number {
	if ((48 <= c) && (c <= 57)) {
		return $.int(c - 48, 32)
	}
	if ((97 <= c) && (c <= 102)) {
		return $.int((c - 97) + 10, 32)
	}
	if ((65 <= c) && (c <= 70)) {
		return $.int((c - 65) + 10, 32)
	}
	return $.int(-1, 32)
}
