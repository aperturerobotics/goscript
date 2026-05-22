// Generated file based on prog.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_parse from "./parse.gs.ts"

export type InstOp = number

export type EmptyOp = number

export class Prog {
	public get Inst(): $.Slice<Inst> {
		return this._fields.Inst.value
	}
	public set Inst(value: $.Slice<Inst>) {
		this._fields.Inst.value = value
	}

	public get Start(): number {
		return this._fields.Start.value
	}
	public set Start(value: number) {
		this._fields.Start.value = value
	}

	public get NumCap(): number {
		return this._fields.NumCap.value
	}
	public set NumCap(value: number) {
		this._fields.NumCap.value = value
	}

	public _fields: {
		Inst: $.VarRef<$.Slice<Inst>>
		Start: $.VarRef<number>
		NumCap: $.VarRef<number>
	}

	constructor(init?: Partial<{Inst?: $.Slice<Inst>, Start?: number, NumCap?: number}>) {
		this._fields = {
			Inst: $.varRef(init?.Inst ?? null),
			Start: $.varRef(init?.Start ?? 0),
			NumCap: $.varRef(init?.NumCap ?? 0)
		}
	}

	public clone(): Prog {
		const cloned = new Prog()
		cloned._fields = {
			Inst: $.varRef(this._fields.Inst.value),
			Start: $.varRef(this._fields.Start.value),
			NumCap: $.varRef(this._fields.NumCap.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Prefix(): [string, boolean] {
		const p: Prog | $.VarRef<Prog> | null = this
		let prefix: string = ""
		let complete: boolean = false
		let i: Inst | $.VarRef<Inst> | null = $.pointerValue<Prog>(p).skipNop($.uint($.pointerValue<Prog>(p).Start, 32))

		// Avoid allocation of buffer if prefix is empty.
		if (($.pointerValue<Inst>(i).op() != InstRune) || ($.len($.pointerValue<Inst>(i).Rune) != 1)) {
			return ["", $.pointerValue<Inst>(i).Op == InstMatch]
		}

		// Have prefix; gather characters.
		let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		while (((($.pointerValue<Inst>(i).op() == InstRune) && ($.len($.pointerValue<Inst>(i).Rune) == 1)) && (($.pointerValue<Inst>(i).Arg & __goscript_parse.FoldCase) == 0)) && ($.pointerValue<Inst>(i).Rune![0] != utf8.RuneError)) {
			buf.value.WriteRune($.pointerValue<Inst>(i).Rune![0])
			i = $.pointerValue<Prog>(p).skipNop($.pointerValue<Inst>(i).Out)
		}
		return [buf.value.String(), $.pointerValue<Inst>(i).Op == InstMatch]
	}

	public StartCond(): EmptyOp {
		const p: Prog | $.VarRef<Prog> | null = this
		let flag: EmptyOp = 0
		let pc = $.uint($.pointerValue<Prog>(p).Start, 32)
		let i: Inst | $.VarRef<Inst> | null = $.indexRef($.pointerValue<Prog>(p).Inst!, pc)
		Loop: while (true) {
			switch ($.pointerValue<Inst>(i).Op) {
				case InstEmptyWidth:
				{
					flag |= $.pointerValue<Inst>(i).Arg
					break
				}
				case InstFail:
				{
					return ~0
					break
				}
				case InstCapture:
				case InstNop:
				{
					break
				}
				default:
				{
					break Loop
					break
				}
			}
			pc = $.pointerValue<Inst>(i).Out
			i = $.indexRef($.pointerValue<Prog>(p).Inst!, pc)
		}
		return flag
	}

	public String(): string {
		const p: Prog | $.VarRef<Prog> | null = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		dumpProg(b, p)
		return b.value.String()
	}

	public skipNop(pc: number): Inst | $.VarRef<Inst> | null {
		const p: Prog | $.VarRef<Prog> | null = this
		let i: Inst | $.VarRef<Inst> | null = $.indexRef($.pointerValue<Prog>(p).Inst!, pc)
		while (($.pointerValue<Inst>(i).Op == InstNop) || ($.pointerValue<Inst>(i).Op == InstCapture)) {
			i = $.indexRef($.pointerValue<Prog>(p).Inst!, $.pointerValue<Inst>(i).Out)
		}
		return i
	}

	static __typeInfo = $.registerStructType(
		"syntax.Prog",
		() => new Prog(),
		[{ name: "Prefix", args: [], returns: [] }, { name: "StartCond", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "skipNop", args: [], returns: [] }],
		Prog,
		{"Inst": { kind: $.TypeKind.Slice, elemType: "syntax.Inst" }, "Start": { kind: $.TypeKind.Basic, name: "int" }, "NumCap": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class Inst {
	public get Op(): InstOp {
		return this._fields.Op.value
	}
	public set Op(value: InstOp) {
		this._fields.Op.value = value
	}

	public get Out(): number {
		return this._fields.Out.value
	}
	public set Out(value: number) {
		this._fields.Out.value = value
	}

	public get Arg(): number {
		return this._fields.Arg.value
	}
	public set Arg(value: number) {
		this._fields.Arg.value = value
	}

	public get Rune(): $.Slice<number> {
		return this._fields.Rune.value
	}
	public set Rune(value: $.Slice<number>) {
		this._fields.Rune.value = value
	}

	public _fields: {
		Op: $.VarRef<InstOp>
		Out: $.VarRef<number>
		Arg: $.VarRef<number>
		Rune: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Op?: InstOp, Out?: number, Arg?: number, Rune?: $.Slice<number>}>) {
		this._fields = {
			Op: $.varRef(init?.Op ?? 0),
			Out: $.varRef(init?.Out ?? 0),
			Arg: $.varRef(init?.Arg ?? 0),
			Rune: $.varRef(init?.Rune ?? null)
		}
	}

	public clone(): Inst {
		const cloned = new Inst()
		cloned._fields = {
			Op: $.varRef(this._fields.Op.value),
			Out: $.varRef(this._fields.Out.value),
			Arg: $.varRef(this._fields.Arg.value),
			Rune: $.varRef(this._fields.Rune.value)
		}
		return $.markAsStructValue(cloned)
	}

	public MatchEmptyWidth(before: number, after: number): boolean {
		const i: Inst | $.VarRef<Inst> | null = this
		switch ($.pointerValue<Inst>(i).Arg) {
			case EmptyBeginLine:
			{
				return (before == 10) || (before == -1)
				break
			}
			case EmptyEndLine:
			{
				return (after == 10) || (after == -1)
				break
			}
			case EmptyBeginText:
			{
				return before == -1
				break
			}
			case EmptyEndText:
			{
				return after == -1
				break
			}
			case EmptyWordBoundary:
			{
				return IsWordChar(before) != IsWordChar(after)
				break
			}
			case EmptyNoWordBoundary:
			{
				return IsWordChar(before) == IsWordChar(after)
				break
			}
		}
		$.panic("unknown empty width arg")
	}

	public MatchRune(r: number): boolean {
		const i: Inst | $.VarRef<Inst> | null = this
		return $.pointerValue<Inst>(i).MatchRunePos(r) != noMatch
	}

	public MatchRunePos(r: number): number {
		const i: Inst | $.VarRef<Inst> | null = this
		let rune = $.pointerValue<Inst>(i).Rune

		switch ($.len(rune)) {
			case 0:
			{
				return noMatch
				break
			}
			case 1:
			{
				let r0 = rune![0]
				if (r == r0) {
					return 0
				}
				if (($.pointerValue<Inst>(i).Arg & __goscript_parse.FoldCase) != 0) {
					for (let r1 = unicode.SimpleFold(r0); r1 != r0; r1 = unicode.SimpleFold(r1)) {
						if (r == r1) {
							return 0
						}
					}
				}
				return noMatch
				break
			}
			case 2:
			{
				if ((r >= rune![0]) && (r <= rune![1])) {
					return 0
				}
				return noMatch
				break
			}
			case 4:
			case 6:
			case 8:
			{
				for (let j = 0; j < $.len(rune); j += 2) {
					if (r < rune![j]) {
						return noMatch
					}
					if (r <= rune![j + 1]) {
						return Math.trunc(j / 2)
					}
				}
				return noMatch
				break
			}
		}

		// Otherwise binary search.
		let lo = 0
		let hi = Math.trunc($.len(rune) / 2)
		while (lo < hi) {
			let m = $.int($.uint(lo + hi, 64) >> 1)
			{
				let c = rune![2 * m]
				if (c <= r) {
					if (r <= rune![(2 * m) + 1]) {
						return m
					}
					lo = m + 1
				} else {
					hi = m
				}
			}
		}
		return noMatch
	}

	public String(): string {
		const i: Inst | $.VarRef<Inst> | null = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		dumpInst(b, i)
		return b.value.String()
	}

	public op(): InstOp {
		const i: Inst | $.VarRef<Inst> | null = this
		let op = $.pointerValue<Inst>(i).Op
		switch (op) {
			case InstRune1:
			case InstRuneAny:
			case InstRuneAnyNotNL:
			{
				op = InstRune
				break
			}
		}
		return op
	}

	static __typeInfo = $.registerStructType(
		"syntax.Inst",
		() => new Inst(),
		[{ name: "MatchEmptyWidth", args: [], returns: [] }, { name: "MatchRune", args: [], returns: [] }, { name: "MatchRunePos", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "op", args: [], returns: [] }],
		Inst,
		{"Op": "syntax.InstOp", "Out": { kind: $.TypeKind.Basic, name: "int" }, "Arg": { kind: $.TypeKind.Basic, name: "int" }, "Rune": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export const InstAlt: InstOp = 0

export const InstAltMatch: InstOp = 1

export const InstCapture: InstOp = 2

export const InstEmptyWidth: InstOp = 3

export const InstMatch: InstOp = 4

export const InstFail: InstOp = 5

export const InstNop: InstOp = 6

export const InstRune: InstOp = 7

export const InstRune1: InstOp = 8

export const InstRuneAny: InstOp = 9

export const InstRuneAnyNotNL: InstOp = 10

export const EmptyBeginLine: EmptyOp = 1

export const EmptyEndLine: EmptyOp = 2

export const EmptyBeginText: EmptyOp = 4

export const EmptyEndText: EmptyOp = 8

export const EmptyWordBoundary: EmptyOp = 16

export const EmptyNoWordBoundary: EmptyOp = 32

export const noMatch: number = -1

export let instOpNames: $.Slice<string> = $.arrayToSlice<string>(["InstAlt", "InstAltMatch", "InstCapture", "InstEmptyWidth", "InstMatch", "InstFail", "InstNop", "InstRune", "InstRune1", "InstRuneAny", "InstRuneAnyNotNL"])

export function __goscript_set_instOpNames(value: $.Slice<string>): void {
	instOpNames = value
}

export function InstOp_String(i: InstOp): string {
	if ($.uint(i, 64) >= $.uint($.len(instOpNames), 64)) {
		return ""
	}
	return instOpNames![i]
}

export function EmptyOpContext(r1: number, r2: number): EmptyOp {
	let op: EmptyOp = EmptyNoWordBoundary
	let boundary: number = 0
	switch (true) {
		case IsWordChar(r1):
		{
			boundary = 1
			break
		}
		case r1 == 10:
		{
			op |= EmptyBeginLine
			break
		}
		case r1 < 0:
		{
			op |= EmptyBeginText | EmptyBeginLine
			break
		}
	}
	switch (true) {
		case IsWordChar(r2):
		{
			boundary ^= 1
			break
		}
		case r2 == 10:
		{
			op |= EmptyEndLine
			break
		}
		case r2 < 0:
		{
			op |= EmptyEndText | EmptyEndLine
			break
		}
	}
	if (boundary != 0) {
		op ^= (EmptyWordBoundary | EmptyNoWordBoundary)
	}
	return op
}

export function IsWordChar(r: number): boolean {
	// Test for lowercase letters first, as these occur more
	// frequently than uppercase letters in common cases.
	return ((((97 <= r) && (r <= 122)) || ((65 <= r) && (r <= 90))) || ((48 <= r) && (r <= 57))) || (r == 95)
}

export function bw(b: strings.Builder | $.VarRef<strings.Builder> | null, args: $.Slice<string>): void {
	for (let __rangeIndex = 0; __rangeIndex < $.len(args); __rangeIndex++) {
		let s = args![__rangeIndex]
		$.pointerValue<strings.Builder>(b).WriteString(s)
	}
}

export function dumpProg(b: strings.Builder | $.VarRef<strings.Builder> | null, p: Prog | $.VarRef<Prog> | null): void {
	for (let j = 0; j < $.len($.pointerValue<Prog>(p).Inst); j++) {
		let i: Inst | $.VarRef<Inst> | null = $.indexRef($.pointerValue<Prog>(p).Inst!, j)
		let pc = strconv.Itoa(j)
		if ($.len(pc) < 3) {
			$.pointerValue<strings.Builder>(b).WriteString($.sliceStringOrBytes("   ", $.len(pc), undefined))
		}
		if (j == $.pointerValue<Prog>(p).Start) {
			pc += "*"
		}
		bw(b, $.arrayToSlice<string>([pc, "\t"]))
		dumpInst(b, i)
		bw(b, $.arrayToSlice<string>(["\n"]))
	}
}

export function u32(i: number): string {
	return strconv.FormatUint($.uint(i, 64), 10)
}

export function dumpInst(b: strings.Builder | $.VarRef<strings.Builder> | null, i: Inst | $.VarRef<Inst> | null): void {
	switch ($.pointerValue<Inst>(i).Op) {
		case InstAlt:
		{
			bw(b, $.arrayToSlice<string>(["alt -> ", u32($.pointerValue<Inst>(i).Out), ", ", u32($.pointerValue<Inst>(i).Arg)]))
			break
		}
		case InstAltMatch:
		{
			bw(b, $.arrayToSlice<string>(["altmatch -> ", u32($.pointerValue<Inst>(i).Out), ", ", u32($.pointerValue<Inst>(i).Arg)]))
			break
		}
		case InstCapture:
		{
			bw(b, $.arrayToSlice<string>(["cap ", u32($.pointerValue<Inst>(i).Arg), " -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstEmptyWidth:
		{
			bw(b, $.arrayToSlice<string>(["empty ", u32($.pointerValue<Inst>(i).Arg), " -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstMatch:
		{
			bw(b, $.arrayToSlice<string>(["match"]))
			break
		}
		case InstFail:
		{
			bw(b, $.arrayToSlice<string>(["fail"]))
			break
		}
		case InstNop:
		{
			bw(b, $.arrayToSlice<string>(["nop -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstRune:
		{
			if ($.pointerValue<Inst>(i).Rune == null) {
				// shouldn't happen
				bw(b, $.arrayToSlice<string>(["rune <nil>"]))
			}
			bw(b, $.arrayToSlice<string>(["rune ", strconv.QuoteToASCII($.runesToString($.pointerValue<Inst>(i).Rune))]))
			if (($.pointerValue<Inst>(i).Arg & __goscript_parse.FoldCase) != 0) {
				bw(b, $.arrayToSlice<string>(["/i"]))
			}
			bw(b, $.arrayToSlice<string>([" -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstRune1:
		{
			bw(b, $.arrayToSlice<string>(["rune1 ", strconv.QuoteToASCII($.runesToString($.pointerValue<Inst>(i).Rune)), " -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstRuneAny:
		{
			bw(b, $.arrayToSlice<string>(["any -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
		case InstRuneAnyNotNL:
		{
			bw(b, $.arrayToSlice<string>(["anynotnl -> ", u32($.pointerValue<Inst>(i).Out)]))
			break
		}
	}
}
