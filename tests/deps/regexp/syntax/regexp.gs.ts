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
			Sub0: $.varRef(init?.Sub0 ?? Array.from({ length: 1 }, () => null)),
			Rune: $.varRef(init?.Rune ?? null),
			Rune0: $.varRef(init?.Rune0 ?? Array.from({ length: 2 }, () => 0)),
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
			Sub0: $.varRef(this._fields.Sub0.value),
			Rune: $.varRef(this._fields.Rune.value),
			Rune0: $.varRef(this._fields.Rune0.value),
			Min: $.varRef(this._fields.Min.value),
			Max: $.varRef(this._fields.Max.value),
			Cap: $.varRef(this._fields.Cap.value),
			Name: $.varRef(this._fields.Name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CapNames(): $.Slice<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let names = $.makeSlice<string>($.pointerValue<Regexp>(re).MaxCap() + 1, undefined, "string")
		$.pointerValue<Regexp>(re).capNames(names)
		return names
	}

	public Equal(y: Regexp | $.VarRef<Regexp> | null): boolean {
		const x: Regexp | $.VarRef<Regexp> | null = this
		if ((x == null) || (y == null)) {
			return x == y
		}
		if ($.pointerValue<Regexp>(x).Op != $.pointerValue<Regexp>(y).Op) {
			return false
		}
		switch ($.pointerValue<Regexp>(x).Op) {
			case OpEndText:
			{
				if (($.pointerValue<Regexp>(x).Flags & __goscript_parse.WasDollar) != ($.pointerValue<Regexp>(y).Flags & __goscript_parse.WasDollar)) {
					return false
				}
				break
			}
			case OpLiteral:
			case OpCharClass:
			{
				return (($.pointerValue<Regexp>(x).Flags & __goscript_parse.FoldCase) == ($.pointerValue<Regexp>(y).Flags & __goscript_parse.FoldCase)) && slices.Equal($.pointerValue<Regexp>(x).Rune, $.pointerValue<Regexp>(y).Rune)
				break
			}
			case OpAlternate:
			case OpConcat:
			{
				return slices.EqualFunc($.pointerValue<Regexp>(x).Sub, $.pointerValue<Regexp>(y).Sub, $.functionValue((x: Regexp | $.VarRef<Regexp> | null, y: Regexp | $.VarRef<Regexp> | null): boolean => $.pointerValue<Regexp>(x).Equal(y), { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] }))
				break
			}
			case OpStar:
			case OpPlus:
			case OpQuest:
			{
				if ((($.pointerValue<Regexp>(x).Flags & __goscript_parse.NonGreedy) != ($.pointerValue<Regexp>(y).Flags & __goscript_parse.NonGreedy)) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
					return false
				}
				break
			}
			case OpRepeat:
			{
				if ((((($.pointerValue<Regexp>(x).Flags & __goscript_parse.NonGreedy) != ($.pointerValue<Regexp>(y).Flags & __goscript_parse.NonGreedy)) || ($.pointerValue<Regexp>(x).Min != $.pointerValue<Regexp>(y).Min)) || ($.pointerValue<Regexp>(x).Max != $.pointerValue<Regexp>(y).Max)) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
					return false
				}
				break
			}
			case OpCapture:
			{
				if ((($.pointerValue<Regexp>(x).Cap != $.pointerValue<Regexp>(y).Cap) || ($.pointerValue<Regexp>(x).Name != $.pointerValue<Regexp>(y).Name)) || !Regexp.prototype.Equal.call($.pointerValue<Regexp>(x).Sub![0], $.pointerValue<Regexp>(y).Sub![0])) {
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
		if ($.pointerValue<Regexp>(re).Op == OpCapture) {
			m = $.pointerValue<Regexp>(re).Cap
		}
		for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<Regexp>(re).Sub); __rangeIndex++) {
			let sub = $.pointerValue<Regexp>(re).Sub![__rangeIndex]
			{
				let n = $.pointerValue<Regexp>(sub).MaxCap()
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
				for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Sub); i++) {
					let sub = $.pointerValue<Regexp>(re).Sub![i]
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
				return __goscript_simplify.simplify1($.pointerValue<Regexp>(re).Op, $.pointerValue<Regexp>(re).Flags, sub, re)
				break
			}
			case OpRepeat:
			{
				if (($.pointerValue<Regexp>(re).Min == 0) && ($.pointerValue<Regexp>(re).Max == 0)) {
					return new Regexp({Op: OpEmptyMatch})
				}
				// matches empty string at end of line
				// matches empty string at beginning of text
				let sub: Regexp | $.VarRef<Regexp> | null = Regexp.prototype.Simplify.call($.pointerValue<Regexp>(re).Sub![0])
				// matches word boundary `\b`
				// matches word non-boundary `\B`
				if ($.pointerValue<Regexp>(re).Max == -1) {
					// matches Sub[0] zero or more times
					if ($.pointerValue<Regexp>(re).Min == 0) {
						return __goscript_simplify.simplify1(OpStar, $.pointerValue<Regexp>(re).Flags, sub, null)
					}
					// matches concatenation of Subs
					// matches alternation of Subs
					if ($.pointerValue<Regexp>(re).Min == 1) {
						return __goscript_simplify.simplify1(OpPlus, $.pointerValue<Regexp>(re).Flags, sub, null)
					}

					// Equal reports whether x and y have identical structure.
					let nre: Regexp | $.VarRef<Regexp> | null = new Regexp({Op: OpConcat})
					$.pointerValue<Regexp>(nre).Sub = $.goSlice($.pointerValue<Regexp>(nre).Sub0, undefined, 0)
					for (let i = 0; i < ($.pointerValue<Regexp>(re).Min - 1); i++) {
						$.pointerValue<Regexp>(nre).Sub = $.append($.pointerValue<Regexp>(nre).Sub, sub)
					}
					$.pointerValue<Regexp>(nre).Sub = $.append($.pointerValue<Regexp>(nre).Sub, __goscript_simplify.simplify1(OpPlus, $.pointerValue<Regexp>(re).Flags, sub, null))
					return nre
				}

				// The parse flags remember whether this is \z or \Z.

				if (($.pointerValue<Regexp>(re).Min == 1) && ($.pointerValue<Regexp>(re).Max == 1)) {
					return sub
				}

				let prefix: Regexp | $.VarRef<Regexp> | null = null
				if ($.pointerValue<Regexp>(re).Min > 0) {
					prefix = new Regexp({Op: OpConcat})
					$.pointerValue<Regexp>(prefix).Sub = $.goSlice($.pointerValue<Regexp>(prefix).Sub0, undefined, 0)
					for (let i = 0; i < $.pointerValue<Regexp>(re).Min; i++) {
						$.pointerValue<Regexp>(prefix).Sub = $.append($.pointerValue<Regexp>(prefix).Sub, sub)
					}
				}

				if ($.pointerValue<Regexp>(re).Max > $.pointerValue<Regexp>(re).Min) {
					let suffix: Regexp | $.VarRef<Regexp> | null = __goscript_simplify.simplify1(OpQuest, $.pointerValue<Regexp>(re).Flags, sub, null)
					for (let i = $.pointerValue<Regexp>(re).Min + 1; i < $.pointerValue<Regexp>(re).Max; i++) {
						let nre2: Regexp | $.VarRef<Regexp> | null = new Regexp({Op: OpConcat})
						$.pointerValue<Regexp>(nre2).Sub = $.append($.goSlice($.pointerValue<Regexp>(nre2).Sub0, undefined, 0), sub, suffix)
						suffix = __goscript_simplify.simplify1(OpQuest, $.pointerValue<Regexp>(re).Flags, nre2, null)
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

				return new Regexp({Op: OpNoMatch})
				break
			}
		}

		return re
	}

	public String(): string {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		let flags: $.VarRef<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null> = $.varRef(null)
		let [must, cant] = calcFlags(re, flags)
		must |= (cant & ~(flagI)) << negShift
		if (must != 0) {
			must |= flagOff
		}
		writeRegexp(b, re, must, flags.value)
		return b.value.String()
	}

	public capNames(names: $.Slice<string>): void {
		let re: Regexp | $.VarRef<Regexp> | null = this
		if ($.pointerValue<Regexp>(re).Op == OpCapture) {
			names![$.pointerValue<Regexp>(re).Cap] = $.pointerValue<Regexp>(re).Name
		}
		for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<Regexp>(re).Sub); __rangeIndex++) {
			let sub = $.pointerValue<Regexp>(re).Sub![__rangeIndex]
			$.pointerValue<Regexp>(sub).capNames(names)
		}
	}

	static __typeInfo = $.registerStructType(
		"syntax.Regexp",
		() => new Regexp(),
		[{ name: "CapNames", args: [], returns: [] }, { name: "Equal", args: [], returns: [] }, { name: "MaxCap", args: [], returns: [] }, { name: "Simplify", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "capNames", args: [], returns: [] }],
		Regexp,
		{"Op": "syntax.Op", "Flags": "syntax.Flags", "Sub": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" } }, "Sub0": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Pointer, elemType: "syntax.Regexp" }, length: 1 }, "Rune": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "Rune0": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 2 }, "Min": { kind: $.TypeKind.Basic, name: "int" }, "Max": { kind: $.TypeKind.Basic, name: "int" }, "Cap": { kind: $.TypeKind.Basic, name: "int" }, "Name": { kind: $.TypeKind.Basic, name: "string" }}
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
	$.mapSet(($.pointerValue<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null>(flags)), start, f)
	$.mapGet(($.pointerValue<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null>(flags)), last, 0)[0] |= flagOff
}

export function calcFlags(re: Regexp | $.VarRef<Regexp> | null, flags: $.VarRef<Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null> | null): [printFlags, printFlags] {
	let must: printFlags = 0
	let cant: printFlags = 0
	switch ($.pointerValue<Regexp>(re).Op) {
		default:
		{
			return [0, 0]
			break
		}
		case OpLiteral:
		{
			for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<Regexp>(re).Rune); __rangeIndex++) {
				let r = $.pointerValue<Regexp>(re).Rune![__rangeIndex]
				if (((__goscript_parse.minFold <= r) && (r <= __goscript_parse.maxFold)) && (unicode.SimpleFold(r) != r)) {
					if (($.pointerValue<Regexp>(re).Flags & __goscript_parse.FoldCase) != 0) {
						return [flagI, 0]
					} else {
						return [0, flagI]
					}
				}
			}
			return [0, 0]
			break
		}
		case OpCharClass:
		{
			for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Rune); i += 2) {
				let lo = $.max(__goscript_parse.minFold, $.pointerValue<Regexp>(re).Rune![i])
				let hi = $.min(__goscript_parse.maxFold, $.pointerValue<Regexp>(re).Rune![i + 1])
				for (let r = lo; r <= hi; r++) {
					for (let f = unicode.SimpleFold(r); f != r; f = unicode.SimpleFold(f)) {
						if (!((lo <= f) && (f <= hi)) && !__goscript_parse.inCharClass(f, $.pointerValue<Regexp>(re).Rune)) {
							return [0, flagI]
						}
					}
				}
			}
			return [0, 0]
			break
		}
		case OpAnyCharNotNL:
		{
			return [0, flagS]
			break
		}
		case OpAnyChar:
		{
			return [flagS, 0]
			break
		}
		case OpBeginLine:
		case OpEndLine:
		{
			return [flagM, 0]
			break
		}
		case OpEndText:
		{
			if (($.pointerValue<Regexp>(re).Flags & __goscript_parse.WasDollar) != 0) {
				return [0, flagM]
			}
			return [0, 0]
			break
		}
		case OpCapture:
		case OpStar:
		case OpPlus:
		case OpQuest:
		case OpRepeat:
		{
			return calcFlags($.pointerValue<Regexp>(re).Sub![0], flags)
			break
		}
		case OpConcat:
		case OpAlternate:
		{
			let must: printFlags = 0
			let cant: printFlags = 0
			let allCant: printFlags = 0
			let start = 0
			let last = 0
			let did = false
			for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Sub); i++) {
				let sub = $.pointerValue<Regexp>(re).Sub![i]
				let [subMust, subCant] = calcFlags(sub, flags)
				if (((must & subCant) != 0) || ((subMust & cant) != 0)) {
					if (must != 0) {
						addSpan($.pointerValue<Regexp>(re).Sub![start], $.pointerValue<Regexp>(re).Sub![last], must, flags)
					}
					must = 0
					cant = 0
					start = i
					did = true
				}
				must |= subMust
				cant |= subCant
				allCant |= subCant
				if (subMust != 0) {
					last = i
				}
				if ((must == 0) && (start == i)) {
					start++
				}
			}
			if (!did) {
				// No conflicts: pass the accumulated must and cant upward.
				return [must, cant]
			}
			if (must != 0) {
				// Conflicts found; need to finish final span.
				addSpan($.pointerValue<Regexp>(re).Sub![start], $.pointerValue<Regexp>(re).Sub![last], must, flags)
			}
			return [0, allCant]
			break
		}
	}
}

export function writeRegexp(b: strings.Builder | $.VarRef<strings.Builder> | null, re: Regexp | $.VarRef<Regexp> | null, f: printFlags, flags: Map<Regexp | $.VarRef<Regexp> | null, printFlags> | null): void {
	using __defer = new $.DisposableStack()
	f |= $.mapGet(flags, re, 0)[0]
	if ((((f & flagPrec) != 0) && ((f & ~((flagOff | flagPrec))) != 0)) && ((f & flagOff) != 0)) {
		// flagPrec is redundant with other flags being added and terminated
		f = f & ~(flagPrec)
	}
	if ((f & ~((flagOff | flagPrec))) != 0) {
		$.pointerValue<strings.Builder>(b).WriteString("(?")
		if ((f & flagI) != 0) {
			$.pointerValue<strings.Builder>(b).WriteString("i")
		}
		if ((f & flagM) != 0) {
			$.pointerValue<strings.Builder>(b).WriteString("m")
		}
		if ((f & flagS) != 0) {
			$.pointerValue<strings.Builder>(b).WriteString("s")
		}
		if ((f & ((flagM | flagS) << negShift)) != 0) {
			$.pointerValue<strings.Builder>(b).WriteString("-")
			if ((f & (flagM << negShift)) != 0) {
				$.pointerValue<strings.Builder>(b).WriteString("m")
			}
			if ((f & (flagS << negShift)) != 0) {
				$.pointerValue<strings.Builder>(b).WriteString("s")
			}
		}
		$.pointerValue<strings.Builder>(b).WriteString(":")
	}
	if ((f & flagOff) != 0) {
		__defer.defer(() => { $.pointerValue<strings.Builder>(b).WriteString(")") })
	}
	if ((f & flagPrec) != 0) {
		$.pointerValue<strings.Builder>(b).WriteString("(?:")
		__defer.defer(() => { $.pointerValue<strings.Builder>(b).WriteString(")") })
	}

	switch ($.pointerValue<Regexp>(re).Op) {
		default:
		{
			$.pointerValue<strings.Builder>(b).WriteString(("<invalid op" + strconv.Itoa($.int($.pointerValue<Regexp>(re).Op))) + ">")
			break
		}
		case OpNoMatch:
		{
			$.pointerValue<strings.Builder>(b).WriteString("[^\\x00-\\x{10FFFF}]")
			break
		}
		case OpEmptyMatch:
		{
			$.pointerValue<strings.Builder>(b).WriteString("(?:)")
			break
		}
		case OpLiteral:
		{
			for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<Regexp>(re).Rune); __rangeIndex++) {
				let r = $.pointerValue<Regexp>(re).Rune![__rangeIndex]
				escape(b, r, false)
			}
			break
		}
		case OpCharClass:
		{
			if (($.len($.pointerValue<Regexp>(re).Rune) % 2) != 0) {
				$.pointerValue<strings.Builder>(b).WriteString("[invalid char class]")
				break
			}
			$.pointerValue<strings.Builder>(b).WriteRune(91)
			if ($.len($.pointerValue<Regexp>(re).Rune) == 0) {
				$.pointerValue<strings.Builder>(b).WriteString("^\\x00-\\x{10FFFF}")
			} else {
				if ((($.pointerValue<Regexp>(re).Rune![0] == 0) && ($.pointerValue<Regexp>(re).Rune![$.len($.pointerValue<Regexp>(re).Rune) - 1] == unicode.MaxRune)) && ($.len($.pointerValue<Regexp>(re).Rune) > 2)) {
					// Contains 0 and MaxRune. Probably a negated class.
					// Print the gaps.
					$.pointerValue<strings.Builder>(b).WriteRune(94)
					for (let i = 1; i < ($.len($.pointerValue<Regexp>(re).Rune) - 1); i += 2) {
						let lo = $.pointerValue<Regexp>(re).Rune![i] + 1
						let hi = $.pointerValue<Regexp>(re).Rune![i + 1] - 1
						escape(b, lo, lo == 45)
						if (lo != hi) {
							if (hi != (lo + 1)) {
								$.pointerValue<strings.Builder>(b).WriteRune(45)
							}
							escape(b, hi, hi == 45)
						}
					}
				} else {
					for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Rune); i += 2) {
						let lo = $.pointerValue<Regexp>(re).Rune![i]
						let hi = $.pointerValue<Regexp>(re).Rune![i + 1]
						escape(b, lo, lo == 45)
						if (lo != hi) {
							if (hi != (lo + 1)) {
								$.pointerValue<strings.Builder>(b).WriteRune(45)
							}
							escape(b, hi, hi == 45)
						}
					}
				}
			}
			$.pointerValue<strings.Builder>(b).WriteRune(93)
			break
		}
		case OpAnyCharNotNL:
		case OpAnyChar:
		{
			$.pointerValue<strings.Builder>(b).WriteString(".")
			break
		}
		case OpBeginLine:
		{
			$.pointerValue<strings.Builder>(b).WriteString("^")
			break
		}
		case OpEndLine:
		{
			$.pointerValue<strings.Builder>(b).WriteString("$")
			break
		}
		case OpBeginText:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\A")
			break
		}
		case OpEndText:
		{
			if (($.pointerValue<Regexp>(re).Flags & __goscript_parse.WasDollar) != 0) {
				$.pointerValue<strings.Builder>(b).WriteString("$")
			} else {
				$.pointerValue<strings.Builder>(b).WriteString("\\z")
			}
			break
		}
		case OpWordBoundary:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\b")
			break
		}
		case OpNoWordBoundary:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\B")
			break
		}
		case OpCapture:
		{
			if (($.pointerValue<Regexp>(re).Name as string) != "") {
				$.pointerValue<strings.Builder>(b).WriteString("(?P<")
				$.pointerValue<strings.Builder>(b).WriteString($.pointerValue<Regexp>(re).Name)
				$.pointerValue<strings.Builder>(b).WriteRune(62)
			} else {
				$.pointerValue<strings.Builder>(b).WriteRune(40)
			}
			if ($.pointerValue<Regexp>($.pointerValue<Regexp>(re).Sub![0]).Op != OpEmptyMatch) {
				writeRegexp(b, $.pointerValue<Regexp>(re).Sub![0], $.mapGet(flags, $.pointerValue<Regexp>(re).Sub![0], 0)[0], flags)
			}
			$.pointerValue<strings.Builder>(b).WriteRune(41)
			break
		}
		case OpStar:
		case OpPlus:
		case OpQuest:
		case OpRepeat:
		{
			let p = 0
			let sub: Regexp | $.VarRef<Regexp> | null = $.pointerValue<Regexp>(re).Sub![0]
			if (($.pointerValue<Regexp>(sub).Op > OpCapture) || (($.pointerValue<Regexp>(sub).Op == OpLiteral) && ($.len($.pointerValue<Regexp>(sub).Rune) > 1))) {
				p = flagPrec
			}
			writeRegexp(b, sub, p, flags)

			switch ($.pointerValue<Regexp>(re).Op) {
				case OpStar:
				{
					$.pointerValue<strings.Builder>(b).WriteRune(42)
					break
				}
				case OpPlus:
				{
					$.pointerValue<strings.Builder>(b).WriteRune(43)
					break
				}
				case OpQuest:
				{
					$.pointerValue<strings.Builder>(b).WriteRune(63)
					break
				}
				case OpRepeat:
				{
					$.pointerValue<strings.Builder>(b).WriteRune(123)
					$.pointerValue<strings.Builder>(b).WriteString(strconv.Itoa($.pointerValue<Regexp>(re).Min))
					if ($.pointerValue<Regexp>(re).Max != $.pointerValue<Regexp>(re).Min) {
						$.pointerValue<strings.Builder>(b).WriteRune(44)
						if ($.pointerValue<Regexp>(re).Max >= 0) {
							$.pointerValue<strings.Builder>(b).WriteString(strconv.Itoa($.pointerValue<Regexp>(re).Max))
						}
					}
					$.pointerValue<strings.Builder>(b).WriteRune(125)
					break
				}
			}
			if (($.pointerValue<Regexp>(re).Flags & __goscript_parse.NonGreedy) != 0) {
				$.pointerValue<strings.Builder>(b).WriteRune(63)
			}
			break
		}
		case OpConcat:
		{
			for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<Regexp>(re).Sub); __rangeIndex++) {
				let sub = $.pointerValue<Regexp>(re).Sub![__rangeIndex]
				let p = 0
				if ($.pointerValue<Regexp>(sub).Op == OpAlternate) {
					p = flagPrec
				}
				writeRegexp(b, sub, p, flags)
			}
			break
		}
		case OpAlternate:
		{
			for (let i = 0; i < $.len($.pointerValue<Regexp>(re).Sub); i++) {
				let sub = $.pointerValue<Regexp>(re).Sub![i]
				if (i > 0) {
					$.pointerValue<strings.Builder>(b).WriteRune(124)
				}
				writeRegexp(b, sub, 0, flags)
			}
			break
		}
	}
}

export function escape(b: strings.Builder | $.VarRef<strings.Builder> | null, r: number, force: boolean): void {
	if (unicode.IsPrint(r)) {
		if (strings.ContainsRune(meta, r) || force) {
			$.pointerValue<strings.Builder>(b).WriteRune(92)
		}
		$.pointerValue<strings.Builder>(b).WriteRune(r)
		return
	}

	switch (r) {
		case 7:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\a")
			break
		}
		case 12:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\f")
			break
		}
		case 10:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\n")
			break
		}
		case 13:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\r")
			break
		}
		case 9:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\t")
			break
		}
		case 11:
		{
			$.pointerValue<strings.Builder>(b).WriteString("\\v")
			break
		}
		default:
		{
			if (r < 0x100) {
				$.pointerValue<strings.Builder>(b).WriteString("\\x")
				let s = strconv.FormatInt($.int(r), 16)
				if ($.len(s) == 1) {
					$.pointerValue<strings.Builder>(b).WriteRune(48)
				}
				$.pointerValue<strings.Builder>(b).WriteString(s)
				break
			}
			$.pointerValue<strings.Builder>(b).WriteString("\\x{")
			$.pointerValue<strings.Builder>(b).WriteString(strconv.FormatInt($.int(r), 16))
			$.pointerValue<strings.Builder>(b).WriteString("}")
			break
		}
	}
}
