// Generated file based on regexp.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as __goscript_op_string from "./op_string.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_simplify from "./simplify.gs.ts"
import "@goscript/strconv/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/index.js"
import "./op_string.gs.ts"
import "./parse.gs.ts"
import "./simplify.gs.ts"

export type Op = number

export class Regexp {
	public get Op(): Op {
		return this._fields.Op.value
	}
	public set Op(value: Op) {
		this._fields.Op.value = value
	}

	public get Flags(): __goscript_parse.Flags {
		return this._fields.Flags.value
	}
	public set Flags(value: __goscript_parse.Flags) {
		this._fields.Flags.value = value
	}

	public get Sub(): $.Slice<Regexp | $.VarRef<Regexp> | null> {
		return this._fields.Sub.value
	}
	public set Sub(value: $.Slice<Regexp | $.VarRef<Regexp> | null>) {
		this._fields.Sub.value = value
	}

	public get Sub0(): (Regexp | $.VarRef<Regexp> | null)[] {
		return this._fields.Sub0.value
	}
	public set Sub0(value: (Regexp | $.VarRef<Regexp> | null)[]) {
		this._fields.Sub0.value = value
	}

	public get Rune(): $.Slice<number> {
		return this._fields.Rune.value
	}
	public set Rune(value: $.Slice<number>) {
		this._fields.Rune.value = value
	}

	public get Rune0(): number[] {
		return this._fields.Rune0.value
	}
	public set Rune0(value: number[]) {
		this._fields.Rune0.value = value
	}

	public get Min(): number {
		return this._fields.Min.value
	}
	public set Min(value: number) {
		this._fields.Min.value = value
	}

	public get Max(): number {
		return this._fields.Max.value
	}
	public set Max(value: number) {
		this._fields.Max.value = value
	}

	public get Cap(): number {
		return this._fields.Cap.value
	}
	public set Cap(value: number) {
		this._fields.Cap.value = value
	}

	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public _fields: {
		Op: $.VarRef<Op>
		Flags: $.VarRef<__goscript_parse.Flags>
		Sub: $.VarRef<$.Slice<Regexp | $.VarRef<Regexp> | null>>
		Sub0: $.VarRef<(Regexp | $.VarRef<Regexp> | null)[]>
		Rune: $.VarRef<$.Slice<number>>
		Rune0: $.VarRef<number[]>
		Min: $.VarRef<number>
		Max: $.VarRef<number>
		Cap: $.VarRef<number>
		Name: $.VarRef<string>
	}

	constructor(init?: Partial<{Op?: Op, Flags?: __goscript_parse.Flags, Sub?: $.Slice<Regexp | $.VarRef<Regexp> | null>, Sub0?: (Regexp | $.VarRef<Regexp> | null)[], Rune?: $.Slice<number>, Rune0?: number[], Min?: number, Max?: number, Cap?: number, Name?: string}>) {
		this._fields = {
			Op: $.varRef(init?.Op ?? 0),
			Flags: $.varRef(init?.Flags ?? 0),
			Sub: $.varRef(init?.Sub ?? null),
			Sub0: $.varRef(init?.Sub0 !== undefined ? $.cloneArrayValue(init.Sub0) : Array.from({ length: 1 }, () => null)),
			Rune: $.varRef(init?.Rune ?? null),
			Rune0: $.varRef(init?.Rune0 !== undefined ? $.cloneArrayValue(init.Rune0) : Array.from({ length: 2 }, () => 0)),
			Min: $.varRef(init?.Min ?? 0),
			Max: $.varRef(init?.Max ?? 0),
			Cap: $.varRef(init?.Cap ?? 0),
			Name: $.varRef(init?.Name ?? "")
		}
	}

	public clone(): Regexp {
		const cloned = new Regexp()
		cloned._fields = {
			Op: $.varRef(this._fields.Op.value),
			Flags: $.varRef(this._fields.Flags.value),
			Sub: $.varRef(this._fields.Sub.value),
			Sub0: $.varRef($.cloneArrayValue(this._fields.Sub0.value)),
			Rune: $.varRef(this._fields.Rune.value),
			Rune0: $.varRef($.cloneArrayValue(this._fields.Rune0.value)),
			Min: $.varRef(this._fields.Min.value),
			Max: $.varRef(this._fields.Max.value),
			Cap: $.varRef(this._fields.Cap.value),
			Name: $.varRef(this._fields.Name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CapNames(): $.Slice<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let names: $.Slice<string> = $.makeSlice<string>(Regexp.prototype.MaxCap.call(re) + 1, undefined, "string")
		Regexp.prototype.capNames.call(re, names)
		return names
	}

	public Equal(y: Regexp | $.VarRef<Regexp> | null): boolean {
		const x: Regexp | $.VarRef<Regexp> | null = this
		if ((x == null) || (y == null)) {
			return x == y
		}
		if ($.uint($.pointerValue<Regexp>(x).Op, 8) != $.uint($.pointerValue<Regexp>(y).Op, 8)) {
			return false
		}
		switch ($.pointerValue<Regexp>(x).Op) {
			case OpEndText:
			{
				if ($.uint(($.pointerValue<Regexp>(x).Flags & 256), 16) != $.uint(($.pointerValue<Regexp>(y).Flags & 256), 16)) {
					return false
				}
				break
			}
			case OpLiteral:
			case OpCharClass:
			{
				return ($.uint(($.pointerValue<Regexp>(x).Flags & 1), 16) == $.uint(($.pointerValue<Regexp>(y).Flags & 1), 16)) && slices.Equal($.pointerValue<Regexp>(x).Rune, $.pointerValue<Regexp>(y).Rune)
				break
			}
			case OpAlternate:
			case OpConcat:
			{
				return slices.EqualFunc($.pointerValue<Regexp>(x).Sub, $.pointerValue<Regexp>(y).Sub, $.functionValue((x: Regexp | $.VarRef<Regexp> | null, y: Regexp | $.VarRef<Regexp> | null): boolean => $.pointerValue<Regexp>(x).Equal(y), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
				break
			}
			case OpStar:
			case OpPlus:
			case OpQuest:
			{
				if (($.uint(($.pointerValue<Regexp>(x).Flags & 32), 16) != $.uint(($.pointerValue<Regexp>(y).Flags & 32), 16)) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
					return false
				}
				break
			}
			case OpRepeat:
			{
				if (((($.uint(($.pointerValue<Regexp>(x).Flags & 32), 16) != $.uint(($.pointerValue<Regexp>(y).Flags & 32), 16)) || ($.pointerValue<Regexp>(x).Min != $.pointerValue<Regexp>(y).Min)) || ($.pointerValue<Regexp>(x).Max != $.pointerValue<Regexp>(y).Max)) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
					return false
				}
				break
			}
			case OpCapture:
			{
				if ((($.pointerValue<Regexp>(x).Cap != $.pointerValue<Regexp>(y).Cap) || (!$.stringEqual($.pointerValue<Regexp>(x).Name, $.pointerValue<Regexp>(y).Name))) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
					return false
				}
				break
			}
		}
		return true
	}

	public MaxCap(): number {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let m = 0
		if ($.uint($.pointerValue<Regexp>(re).Op, 8) == $.uint(OpCapture, 8)) {
			m = $.pointerValue<Regexp>(re).Cap
		}
		for (let __goscriptRangeTarget0 = $.pointerValue<Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let sub = __goscriptRangeTarget0![__rangeIndex]
			{
				let n = Regexp.prototype.MaxCap.call(sub)
				if (m < n) {
					m = n
				}
			}
		}
		return m
	}

	public Simplify(): Regexp | $.VarRef<Regexp> | null {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (re == null) {
			return null
		}
		switch ($.pointerValue<Regexp>(re).Op) {
			case OpCapture:
			case OpConcat:
			case OpAlternate:
			{
				let nre: Regexp | $.VarRef<Regexp> | null = re
				for (let __goscriptRangeTarget1 = $.pointerValue<Regexp>(re).Sub, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
					let sub = __goscriptRangeTarget1![i]
					let nsub: Regexp | $.VarRef<Regexp> | null = Regexp.prototype.Simplify.call(sub)
					if ((nre == re) && (nsub != sub)) {
						// min, max for OpRepeat
						nre = new Regexp()
						$.assignStruct($.pointerValue<Regexp>(nre), $.markAsStructValue($.cloneStructValue($.pointerValue<Regexp>(re))))
						$.pointerValue<Regexp>(nre).Rune = null
						$.pointerValue<Regexp>(nre).Sub = $.append($.goSlice($.pointerValue<Regexp>(nre).Sub0, undefined, 0), ...($.goSlice($.pointerValue<Regexp>(re).Sub, undefined, i) ?? []))
					}
					if (nre != re) {
						$.pointerValue<Regexp>(nre).Sub = $.append($.pointerValue<Regexp>(nre).Sub, nsub)
					}
				}
				return nre
				break
			}
			case OpStar:
			case OpPlus:
			case OpQuest:
			{
				let sub: Regexp | $.VarRef<Regexp> | null = Regexp.prototype.Simplify.call($.pointerValue<Regexp>(re).Sub![0])
				return __goscript_simplify.simplify1($.uint($.pointerValue<Regexp>(re).Op, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), sub, re)
				break
			}
			case OpRepeat:
			{
				if (($.pointerValue<Regexp>(re).Min == 0) && ($.pointerValue<Regexp>(re).Max == 0)) {
					return new Regexp({Op: $.uint(OpEmptyMatch, 8)})
				}
				// matches empty string at end of line
				// matches empty string at beginning of text
				let sub: Regexp | $.VarRef<Regexp> | null = Regexp.prototype.Simplify.call($.pointerValue<Regexp>(re).Sub![0])
				// matches word boundary `\b`
				// matches word non-boundary `\B`
				if ($.pointerValue<Regexp>(re).Max == -1) {
					// matches Sub[0] zero or more times
					if ($.pointerValue<Regexp>(re).Min == 0) {
						return __goscript_simplify.simplify1($.uint(OpStar, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), sub, null)
					}
					// matches concatenation of Subs
					// matches alternation of Subs
					if ($.pointerValue<Regexp>(re).Min == 1) {
						return __goscript_simplify.simplify1($.uint(OpPlus, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), sub, null)
					}

					// Equal reports whether x and y have identical structure.
					let nre: Regexp | $.VarRef<Regexp> | null = new Regexp({Op: $.uint(OpConcat, 8)})
					$.pointerValue<Regexp>(nre).Sub = $.goSlice($.pointerValue<Regexp>(nre).Sub0, undefined, 0)
					for (let i = 0; i < ($.pointerValue<Regexp>(re).Min - 1); i++) {
						$.pointerValue<Regexp>(nre).Sub = $.append($.pointerValue<Regexp>(nre).Sub, sub)
					}
					$.pointerValue<Regexp>(nre).Sub = $.append($.pointerValue<Regexp>(nre).Sub, __goscript_simplify.simplify1($.uint(OpPlus, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), sub, null))
					return nre
				}

				// The parse flags remember whether this is \z or \Z.

				if (($.pointerValue<Regexp>(re).Min == 1) && ($.pointerValue<Regexp>(re).Max == 1)) {
					return sub
				}

				let prefix: Regexp | $.VarRef<Regexp> | null = null as Regexp | $.VarRef<Regexp> | null
				if ($.pointerValue<Regexp>(re).Min > 0) {
					prefix = new Regexp({Op: $.uint(OpConcat, 8)})
					$.pointerValue<Regexp>(prefix).Sub = $.goSlice($.pointerValue<Regexp>(prefix).Sub0, undefined, 0)
					for (let i = 0; i < $.pointerValue<Regexp>(re).Min; i++) {
						$.pointerValue<Regexp>(prefix).Sub = $.append($.pointerValue<Regexp>(prefix).Sub, sub)
					}
				}

				if ($.pointerValue<Regexp>(re).Max > $.pointerValue<Regexp>(re).Min) {
					let suffix: Regexp | $.VarRef<Regexp> | null = __goscript_simplify.simplify1($.uint(OpQuest, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), sub, null)
					for (let i = $.pointerValue<Regexp>(re).Min + 1; i < $.pointerValue<Regexp>(re).Max; i++) {
						let nre2: Regexp | $.VarRef<Regexp> | null = new Regexp({Op: $.uint(OpConcat, 8)})
						$.pointerValue<Regexp>(nre2).Sub = $.append($.goSlice($.pointerValue<Regexp>(nre2).Sub0, undefined, 0), sub, suffix)
						suffix = __goscript_simplify.simplify1($.uint(OpQuest, 8), $.uint($.pointerValue<Regexp>(re).Flags, 16), nre2, null)
					}
					if (prefix == null) {
						return suffix
					}
					$.pointerValue<Regexp>(prefix).Sub = $.append($.pointerValue<Regexp>(prefix).Sub, suffix)
				}
				if (prefix != null) {
					return prefix
				}
				// (?: )
				// flagI<<negShift is (?-i:

				return new Regexp({Op: $.uint(OpNoMatch, 8)})
				break
			}
		}

		return re
	}

	public String(): string {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		let flags: $.VarRef<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null> = $.varRef(null as Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null)
		let __goscriptTuple0: any = calcFlags(re, flags)
		let must = $.uint(__goscriptTuple0[0], 8)
		let cant = $.uint(__goscriptTuple0[1], 8)
		must |= $.uint((cant & ~(flagI)) << negShift, 8)
		if ($.uint(must, 8) != $.uint(0, 8)) {
			must |= $.uint(flagOff, 8)
		}
		writeRegexp(b, re, $.uint(must, 8), flags.value)
		return b.value.String()
	}

	public capNames(names: $.Slice<string>): void {
		let re: Regexp | $.VarRef<Regexp> | null = this
		if ($.uint($.pointerValue<Regexp>(re).Op, 8) == $.uint(OpCapture, 8)) {
			names![$.pointerValue<Regexp>(re).Cap] = $.pointerValue<Regexp>(re).Name
		}
		for (let __goscriptRangeTarget2 = $.pointerValue<Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let sub = __goscriptRangeTarget2![__rangeIndex]
			Regexp.prototype.capNames.call(sub, names)
		}
	}

	static __typeInfo = $.registerStructType(
		"syntax.Regexp",
		() => new Regexp(),
		[{ name: "CapNames", args: [], returns: [] }, { name: "Equal", args: [], returns: [] }, { name: "MaxCap", args: [], returns: [] }, { name: "Simplify", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "capNames", args: [], returns: [] }],
		Regexp,
		{"Op": { kind: $.TypeKind.Basic, name: "int", typeName: "syntax.Op" }, "Flags": { kind: $.TypeKind.Basic, name: "int", typeName: "syntax.Flags" }, "Sub": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }, "Sub0": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, length: 1 }, "Rune": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "Rune0": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 2 }, "Min": { kind: $.TypeKind.Basic, name: "int" }, "Max": { kind: $.TypeKind.Basic, name: "int" }, "Cap": { kind: $.TypeKind.Basic, name: "int" }, "Name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export const OpNoMatch: Op = 1

export const OpEmptyMatch: Op = 2

export const OpLiteral: Op = 3

export const OpCharClass: Op = 4

export const OpAnyCharNotNL: Op = 5

export const OpAnyChar: Op = 6

export const OpBeginLine: Op = 7

export const OpEndLine: Op = 8

export const OpBeginText: Op = 9

export const OpEndText: Op = 10

export const OpWordBoundary: Op = 11

export const OpNoWordBoundary: Op = 12

export const OpCapture: Op = 13

export const OpStar: Op = 14

export const OpPlus: Op = 15

export const OpQuest: Op = 16

export const OpRepeat: Op = 17

export const OpConcat: Op = 18

export const OpAlternate: Op = 19

export const opPseudo: Op = 128

export const flagI: printFlags = 1

export const flagM: printFlags = 2

export const flagS: printFlags = 4

export const flagOff: printFlags = 8

export const flagPrec: printFlags = 16

export const negShift: number = 5

export const meta: string = "\\.+*?()|[]{}^$"

export type printFlags = number

export function addSpan(start: Regexp | $.VarRef<Regexp> | null, last: Regexp | $.VarRef<Regexp> | null, f: printFlags, flags: $.VarRef<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null> | null): void {
	if ($.pointerValue<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null>(flags) == null) {
		flags!.value = $.makeMap<Regexp | $.VarRef<Regexp> | null, printFlags>()
	}
	$.mapSet(($.pointerValue<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null>(flags)), start, $.uint(f, 8))
	const __goscriptMap0 = ($.pointerValue<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null>(flags))
	const __goscriptMapKey0 = last
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet(__goscriptMap0, __goscriptMapKey0, 0)[0] | $.uint(flagOff, 8))
}

export function calcFlags(re: Regexp | $.VarRef<Regexp> | null, flags: $.VarRef<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null> | null): [printFlags, printFlags] {
	let must: printFlags = 0
	let cant: printFlags = 0
	switch ($.pointerValue<Regexp>(re).Op) {
		default:
		{
			return [$.uint(0, 8), $.uint(0, 8)]
			break
		}
		case OpLiteral:
		{
			for (let __goscriptRangeTarget3 = $.pointerValue<Regexp>(re).Rune, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
				let r = __goscriptRangeTarget3![__rangeIndex]
				if (((65 <= r) && (r <= 125251)) && ($.int(unicode.SimpleFold($.int(r, 32)), 32) != $.int(r, 32))) {
					if ($.uint(($.pointerValue<Regexp>(re).Flags & 1), 16) != $.uint(0, 16)) {
						return [$.uint(flagI, 8), $.uint(0, 8)]
					} else {
						return [$.uint(0, 8), $.uint(flagI, 8)]
					}
				}
			}
			return [$.uint(0, 8), $.uint(0, 8)]
			break
		}
		case OpCharClass:
		{
			for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Rune); i += 2) {
				let lo = $.int($.max($.int(65, 32), $.int($.pointerValue<Regexp>(re).Rune![i], 32)), 32)
				let hi = $.int($.min($.int(125251, 32), $.int($.pointerValue<Regexp>(re).Rune![i + 1], 32)), 32)
				for (let r = $.int(lo, 32); r <= hi; r++) {
					for (let f = $.int(unicode.SimpleFold($.int(r, 32)), 32); $.int(f, 32) != $.int(r, 32); f = $.int(unicode.SimpleFold($.int(f, 32)), 32)) {
						if (!((lo <= f) && (f <= hi)) && !__goscript_parse.inCharClass($.int(f, 32), $.pointerValue<Regexp>(re).Rune)) {
							return [$.uint(0, 8), $.uint(flagI, 8)]
						}
					}
				}
			}
			return [$.uint(0, 8), $.uint(0, 8)]
			break
		}
		case OpAnyCharNotNL:
		{
			return [$.uint(0, 8), $.uint(flagS, 8)]
			break
		}
		case OpAnyChar:
		{
			return [$.uint(flagS, 8), $.uint(0, 8)]
			break
		}
		case OpBeginLine:
		case OpEndLine:
		{
			return [$.uint(flagM, 8), $.uint(0, 8)]
			break
		}
		case OpEndText:
		{
			if ($.uint(($.pointerValue<Regexp>(re).Flags & 256), 16) != $.uint(0, 16)) {
				return [$.uint(0, 8), $.uint(flagM, 8)]
			}
			return [$.uint(0, 8), $.uint(0, 8)]
			break
		}
		case OpCapture:
		case OpStar:
		case OpPlus:
		case OpQuest:
		case OpRepeat:
		{
			const __goscriptReturn0 = calcFlags($.pointerValue<Regexp>(re).Sub![0], flags)
			return [$.uint(__goscriptReturn0[0], 8), $.uint(__goscriptReturn0[1], 8)]
			break
		}
		case OpConcat:
		case OpAlternate:
		{
			let __goscriptShadow0: printFlags = 0
			let __goscriptShadow1: printFlags = 0
			let allCant: printFlags = 0
			let start = 0
			let last = 0
			let did = false
			for (let __goscriptRangeTarget4 = $.pointerValue<Regexp>(re).Sub, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
				let sub = __goscriptRangeTarget4![i]
				let __goscriptTuple1: any = calcFlags(sub, flags)
				let subMust = $.uint(__goscriptTuple1[0], 8)
				let subCant = $.uint(__goscriptTuple1[1], 8)
				if (($.uint((__goscriptShadow0 & subCant), 8) != $.uint(0, 8)) || ($.uint((subMust & __goscriptShadow1), 8) != $.uint(0, 8))) {
					if ($.uint(__goscriptShadow0, 8) != $.uint(0, 8)) {
						addSpan($.pointerValue<Regexp>(re).Sub![start], $.pointerValue<Regexp>(re).Sub![last], $.uint(__goscriptShadow0, 8), flags)
					}
					__goscriptShadow0 = $.uint(0, 8)
					__goscriptShadow1 = $.uint(0, 8)
					start = i
					did = true
				}
				__goscriptShadow0 |= $.uint(subMust, 8)
				__goscriptShadow1 |= $.uint(subCant, 8)
				allCant |= $.uint(subCant, 8)
				if ($.uint(subMust, 8) != $.uint(0, 8)) {
					last = i
				}
				if (($.uint(__goscriptShadow0, 8) == $.uint(0, 8)) && (start == i)) {
					start++
				}
			}
			if (!did) {
				// No conflicts: pass the accumulated must and cant upward.
				return [$.uint(__goscriptShadow0, 8), $.uint(__goscriptShadow1, 8)]
			}
			if ($.uint(__goscriptShadow0, 8) != $.uint(0, 8)) {
				// Conflicts found; need to finish final span.
				addSpan($.pointerValue<Regexp>(re).Sub![start], $.pointerValue<Regexp>(re).Sub![last], $.uint(__goscriptShadow0, 8), flags)
			}
			return [$.uint(0, 8), $.uint(allCant, 8)]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function writeRegexp(b: strings.Builder | $.VarRef<strings.Builder> | null, re: Regexp | $.VarRef<Regexp> | null, f: printFlags, flags: Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null): void {
	using __defer = new $.DisposableStack()
	f |= $.uint($.mapGet(flags, re, 0)[0], 8)
	if ((($.uint((f & flagPrec), 8) != $.uint(0, 8)) && ($.uint((f & ~((flagOff | flagPrec))), 8) != $.uint(0, 8))) && ($.uint((f & flagOff), 8) != $.uint(0, 8))) {
		// flagPrec is redundant with other flags being added and terminated
		f = f & ~($.uint(flagPrec, 8))
	}
	if ($.uint((f & ~((flagOff | flagPrec))), 8) != $.uint(0, 8)) {
		strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "(?")
		if ($.uint((f & flagI), 8) != $.uint(0, 8)) {
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "i")
		}
		if ($.uint((f & flagM), 8) != $.uint(0, 8)) {
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "m")
		}
		if ($.uint((f & flagS), 8) != $.uint(0, 8)) {
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "s")
		}
		if ($.uint((f & (192)), 8) != $.uint(0, 8)) {
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "-")
			if ($.uint((f & (64)), 8) != $.uint(0, 8)) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "m")
			}
			if ($.uint((f & (128)), 8) != $.uint(0, 8)) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "s")
			}
		}
		strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), ":")
	}
	if ($.uint((f & flagOff), 8) != $.uint(0, 8)) {
		__defer.defer(() => { strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), ")") })
	}
	if ($.uint((f & flagPrec), 8) != $.uint(0, 8)) {
		strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "(?:")
		__defer.defer(() => { strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), ")") })
	}

	switch ($.pointerValue<Regexp>(re).Op) {
		default:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), ("<invalid op" + strconv.Itoa($.int($.pointerValue<Regexp>(re).Op))) + ">")
			break
		}
		case OpNoMatch:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "[^\\x00-\\x{10FFFF}]")
			break
		}
		case OpEmptyMatch:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "(?:)")
			break
		}
		case OpLiteral:
		{
			for (let __goscriptRangeTarget5 = $.pointerValue<Regexp>(re).Rune, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
				let r = __goscriptRangeTarget5![__rangeIndex]
				escape(b, $.int(r, 32), false)
			}
			break
		}
		case OpCharClass:
		{
			if (($.len($.pointerValue<Regexp>(re).Rune) % 2) != 0) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "[invalid char class]")
				break
			}
			strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(91, 32))
			if ($.len($.pointerValue<Regexp>(re).Rune) == 0) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "^\\x00-\\x{10FFFF}")
			} else {
				if ((($.int($.pointerValue<Regexp>(re).Rune![0], 32) == $.int(0, 32)) && ($.int($.pointerValue<Regexp>(re).Rune![$.len($.pointerValue<Regexp>(re).Rune) - 1], 32) == $.int(unicode.MaxRune, 32))) && ($.len($.pointerValue<Regexp>(re).Rune) > 2)) {
					// Contains 0 and MaxRune. Probably a negated class.
					// Print the gaps.
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(94, 32))
					for (let i = 1; i < ($.len($.pointerValue<Regexp>(re).Rune) - 1); i += 2) {
						let lo = $.int($.pointerValue<Regexp>(re).Rune![i] + 1, 32)
						let hi = $.int($.pointerValue<Regexp>(re).Rune![i + 1] - 1, 32)
						escape(b, $.int(lo, 32), $.int(lo, 32) == $.int(45, 32))
						if ($.int(lo, 32) != $.int(hi, 32)) {
							if ($.int(hi, 32) != $.int((lo + 1), 32)) {
								strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(45, 32))
							}
							escape(b, $.int(hi, 32), $.int(hi, 32) == $.int(45, 32))
						}
					}
				} else {
					for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Rune); i += 2) {
						let lo = $.int($.pointerValue<Regexp>(re).Rune![i], 32)
						let hi = $.int($.pointerValue<Regexp>(re).Rune![i + 1], 32)
						escape(b, $.int(lo, 32), $.int(lo, 32) == $.int(45, 32))
						if ($.int(lo, 32) != $.int(hi, 32)) {
							if ($.int(hi, 32) != $.int((lo + 1), 32)) {
								strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(45, 32))
							}
							escape(b, $.int(hi, 32), $.int(hi, 32) == $.int(45, 32))
						}
					}
				}
			}
			strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(93, 32))
			break
		}
		case OpAnyCharNotNL:
		case OpAnyChar:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), ".")
			break
		}
		case OpBeginLine:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "^")
			break
		}
		case OpEndLine:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "$")
			break
		}
		case OpBeginText:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\A")
			break
		}
		case OpEndText:
		{
			if ($.uint(($.pointerValue<Regexp>(re).Flags & 256), 16) != $.uint(0, 16)) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "$")
			} else {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\z")
			}
			break
		}
		case OpWordBoundary:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\b")
			break
		}
		case OpNoWordBoundary:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\B")
			break
		}
		case OpCapture:
		{
			if (!$.stringEqual($.pointerValue<Regexp>(re).Name, "")) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "(?P<")
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), $.pointerValue<Regexp>(re).Name)
				strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(62, 32))
			} else {
				strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(40, 32))
			}
			if ($.uint($.pointerValue<Regexp>($.pointerValue<Regexp>(re).Sub![0]).Op, 8) != $.uint(OpEmptyMatch, 8)) {
				writeRegexp(b, $.pointerValue<Regexp>(re).Sub![0], $.uint($.mapGet(flags, $.pointerValue<Regexp>(re).Sub![0], 0)[0], 8), flags)
			}
			strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(41, 32))
			break
		}
		case OpStar:
		case OpPlus:
		case OpQuest:
		case OpRepeat:
		{
			let p = $.uint(0, 8)
			let sub: Regexp | $.VarRef<Regexp> | null = $.pointerValue<Regexp>(re).Sub![0]
			if (($.pointerValue<Regexp>(sub).Op > OpCapture) || (($.uint($.pointerValue<Regexp>(sub).Op, 8) == $.uint(OpLiteral, 8)) && ($.len($.pointerValue<Regexp>(sub).Rune) > 1))) {
				p = $.uint(flagPrec, 8)
			}
			writeRegexp(b, sub, $.uint(p, 8), flags)

			switch ($.pointerValue<Regexp>(re).Op) {
				case OpStar:
				{
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(42, 32))
					break
				}
				case OpPlus:
				{
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(43, 32))
					break
				}
				case OpQuest:
				{
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(63, 32))
					break
				}
				case OpRepeat:
				{
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(123, 32))
					strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), strconv.Itoa($.pointerValue<Regexp>(re).Min))
					if ($.pointerValue<Regexp>(re).Max != $.pointerValue<Regexp>(re).Min) {
						strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(44, 32))
						if ($.pointerValue<Regexp>(re).Max >= 0) {
							strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), strconv.Itoa($.pointerValue<Regexp>(re).Max))
						}
					}
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(125, 32))
					break
				}
			}
			if ($.uint(($.pointerValue<Regexp>(re).Flags & 32), 16) != $.uint(0, 16)) {
				strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(63, 32))
			}
			break
		}
		case OpConcat:
		{
			for (let __goscriptRangeTarget6 = $.pointerValue<Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
				let sub = __goscriptRangeTarget6![__rangeIndex]
				let p = $.uint(0, 8)
				if ($.uint($.pointerValue<Regexp>(sub).Op, 8) == $.uint(OpAlternate, 8)) {
					p = $.uint(flagPrec, 8)
				}
				writeRegexp(b, sub, $.uint(p, 8), flags)
			}
			break
		}
		case OpAlternate:
		{
			for (let __goscriptRangeTarget7 = $.pointerValue<Regexp>(re).Sub, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
				let sub = __goscriptRangeTarget7![i]
				if (i > 0) {
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(124, 32))
				}
				writeRegexp(b, sub, $.uint(0, 8), flags)
			}
			break
		}
	}
}

export function escape(b: strings.Builder | $.VarRef<strings.Builder> | null, r: number, force: boolean): void {
	if (unicode.IsPrint($.int(r, 32))) {
		if (strings.ContainsRune(meta, $.int(r, 32)) || force) {
			strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(92, 32))
		}
		strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(r, 32))
		return
	}

	switch (r) {
		case 7:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\a")
			break
		}
		case 12:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\f")
			break
		}
		case 10:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\n")
			break
		}
		case 13:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\r")
			break
		}
		case 9:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\t")
			break
		}
		case 11:
		{
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\v")
			break
		}
		default:
		{
			if (r < 0x100) {
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\x")
				let s = strconv.FormatInt($.int($.int(r)), 16)
				if ($.len(s) == 1) {
					strings.Builder.prototype.WriteRune.call($.pointerValue<strings.Builder>(b), $.int(48, 32))
				}
				strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), s)
				break
			}
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "\\x{")
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), strconv.FormatInt($.int($.int(r)), 16))
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), "}")
			break
		}
	}
}
