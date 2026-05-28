// Generated file based on prog.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_parse from "./parse.gs.ts"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/index.js"
import "@goscript/unicode/utf8/index.js"
import "./parse.gs.ts"

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
		let i: Inst | $.VarRef<Inst> | null = Prog.prototype.skipNop.call(p, $.uint($.uint($.pointerValue<Prog>(p).Start, 32), 32))

		// Avoid allocation of buffer if prefix is empty.
		if (($.uint(Inst.prototype.op.call(i), 8) != $.uint(7, 8)) || ($.len($.pointerValue<Inst>(i).Rune) != 1)) {
			return ["", $.uint($.pointerValue<Inst>(i).Op, 8) == $.uint(4, 8)]
		}

		// Have prefix; gather characters.
		let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		while (((($.uint(Inst.prototype.op.call(i), 8) == $.uint(7, 8)) && ($.len($.pointerValue<Inst>(i).Rune) == 1)) && ($.uint(($.pointerValue<Inst>(i).Arg & 1), 16) == $.uint(0, 16))) && ($.int($.pointerValue<Inst>(i).Rune![0], 32) != $.int(utf8.RuneError, 32))) {
			buf.value.WriteRune($.int($.pointerValue<Inst>(i).Rune![0], 32))
			i = Prog.prototype.skipNop.call(p, $.uint($.pointerValue<Inst>(i).Out, 32))
		}
		return [buf.value.String(), $.uint($.pointerValue<Inst>(i).Op, 8) == $.uint(4, 8)]
	}

	public StartCond(): EmptyOp {
		const p: Prog | $.VarRef<Prog> | null = this
		let flag: EmptyOp = 0
		let pc = $.uint($.uint($.pointerValue<Prog>(p).Start, 32), 32)
		let i: Inst | $.VarRef<Inst> | null = $.indexRef($.pointerValue<Prog>(p).Inst!, pc)
		Loop: while (true) {
			switch ($.pointerValue<Inst>(i).Op) {
				case 3:
				{
					flag = flag | ($.uint($.pointerValue<Inst>(i).Arg, 8))
					break
				}
				case 5:
				{
					return $.uint($.uint(~0, 8), 8)
					break
				}
				case 2:
				case 6:
				{
					break
				}
				default:
				{
					break Loop
					break
				}
			}
			pc = $.uint($.pointerValue<Inst>(i).Out, 32)
			i = $.indexRef($.pointerValue<Prog>(p).Inst!, pc)
		}
		return $.uint(flag, 8)
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
		while (($.uint($.pointerValue<Inst>(i).Op, 8) == $.uint(6, 8)) || ($.uint($.pointerValue<Inst>(i).Op, 8) == $.uint(2, 8))) {
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
			case 1:
			{
				return ($.int(before, 32) == $.int(10, 32)) || ($.int(before, 32) == $.int(-1, 32))
				break
			}
			case 2:
			{
				return ($.int(after, 32) == $.int(10, 32)) || ($.int(after, 32) == $.int(-1, 32))
				break
			}
			case 4:
			{
				return $.int(before, 32) == $.int(-1, 32)
				break
			}
			case 8:
			{
				return $.int(after, 32) == $.int(-1, 32)
				break
			}
			case 16:
			{
				return IsWordChar($.int(before, 32)) != IsWordChar($.int(after, 32))
				break
			}
			case 32:
			{
				return IsWordChar($.int(before, 32)) == IsWordChar($.int(after, 32))
				break
			}
		}
		$.panic("unknown empty width arg")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public MatchRune(r: number): boolean {
		const i: Inst | $.VarRef<Inst> | null = this
		return Inst.prototype.MatchRunePos.call(i, $.int(r, 32)) != -1
	}

	public MatchRunePos(r: number): number {
		const i: Inst | $.VarRef<Inst> | null = this
		let rune: $.Slice<number> = $.pointerValue<Inst>(i).Rune

		switch ($.len(rune)) {
			case 0:
			{
				return -1
				break
			}
			case 1:
			{
				let r0 = $.int(rune![0], 32)
				if ($.int(r, 32) == $.int(r0, 32)) {
					return 0
				}
				if ($.uint(($.pointerValue<Inst>(i).Arg & 1), 16) != $.uint(0, 16)) {
					for (let r1 = $.int(unicode.SimpleFold($.int(r0, 32)), 32); $.int(r1, 32) != $.int(r0, 32); r1 = $.int(unicode.SimpleFold($.int(r1, 32)), 32)) {
						if ($.int(r, 32) == $.int(r1, 32)) {
							return 0
						}
					}
				}
				return -1
				break
			}
			case 2:
			{
				if ((r >= rune![0]) && (r <= rune![1])) {
					return 0
				}
				return -1
				break
			}
			case 4:
			case 6:
			case 8:
			{
				for (let j = 0; j < $.len(rune); j = j + (2)) {
					if (r < rune![j]) {
						return -1
					}
					if (r <= rune![j + 1]) {
						return Math.trunc(j / 2)
					}
				}
				return -1
				break
			}
		}

		// Otherwise binary search.
		let lo = 0
		let hi = Math.trunc($.len(rune) / 2)
		while (lo < hi) {
			let m = $.int($.uint64Shr($.uint(lo + hi, 64), 1))
			{
				let c = $.int(rune![2 * m], 32)
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
		return -1
	}

	public String(): string {
		const i: Inst | $.VarRef<Inst> | null = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		dumpInst(b, i)
		return b.value.String()
	}

	public op(): InstOp {
		const i: Inst | $.VarRef<Inst> | null = this
		let op = $.uint($.pointerValue<Inst>(i).Op, 8)
		switch (op) {
			case 8:
			case 9:
			case 10:
			{
				op = $.uint(7, 8)
				break
			}
		}
		return $.uint(op, 8)
	}

	static __typeInfo = $.registerStructType(
		"syntax.Inst",
		() => new Inst(),
		[{ name: "MatchEmptyWidth", args: [], returns: [] }, { name: "MatchRune", args: [], returns: [] }, { name: "MatchRunePos", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "op", args: [], returns: [] }],
		Inst,
		{"Op": { kind: $.TypeKind.Basic, name: "uint8", typeName: "syntax.InstOp" }, "Out": { kind: $.TypeKind.Basic, name: "uint32" }, "Arg": { kind: $.TypeKind.Basic, name: "uint32" }, "Rune": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int32" } }}
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

export function __goscript_set_instOpNames(__goscriptValue: $.Slice<string>): void {
	instOpNames = __goscriptValue
}

export function InstOp_String(i: InstOp): string {
	if ($.uint(i, 64) >= $.uint($.len(instOpNames), 64)) {
		return ""
	}
	return instOpNames![i]
}

export function EmptyOpContext(r1: number, r2: number): EmptyOp {
	let op: EmptyOp = $.uint(32, 8)
	let boundary: number = 0
	switch (true) {
		case IsWordChar($.int(r1, 32)):
		{
			boundary = $.uint(1, 8)
			break
		}
		case $.int(r1, 32) == $.int(10, 32):
		{
			op = op | ($.uint(1, 8))
			break
		}
		case r1 < 0:
		{
			op = op | ($.uint(4 | 1, 8))
			break
		}
	}
	switch (true) {
		case IsWordChar($.int(r2, 32)):
		{
			boundary = boundary ^ ($.uint(1, 8))
			break
		}
		case $.int(r2, 32) == $.int(10, 32):
		{
			op = op | ($.uint(2, 8))
			break
		}
		case r2 < 0:
		{
			op = op | ($.uint(8 | 2, 8))
			break
		}
	}
	if ($.uint(boundary, 8) != $.uint(0, 8)) {
		op = op ^ ($.uint((16 | 32), 8))
	}
	return $.uint(op, 8)
}

export function IsWordChar(r: number): boolean {
	// Test for lowercase letters first, as these occur more
	// frequently than uppercase letters in common cases.
	return ((((97 <= r) && (r <= 122)) || ((65 <= r) && (r <= 90))) || ((48 <= r) && (r <= 57))) || ($.int(r, 32) == $.int(95, 32))
}

export function bw(b: strings.Builder | $.VarRef<strings.Builder> | null, args: $.Slice<string>): void {
	for (let __goscriptRangeTarget0 = args, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let s = __goscriptRangeTarget0![__rangeIndex]
		strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), s)
	}
}

export function dumpProg(b: strings.Builder | $.VarRef<strings.Builder> | null, p: Prog | $.VarRef<Prog> | null): void {
	for (let __goscriptRangeTarget1 = $.pointerValue<Prog>(p).Inst, j = 0; j < $.len(__goscriptRangeTarget1); j++) {
		let i: Inst | $.VarRef<Inst> | null = $.indexRef($.pointerValue<Prog>(p).Inst!, j)
		let pc = strconv.Itoa(j)
		if ($.len(pc) < 3) {
			strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(b), $.sliceStringOrBytes("   ", $.len(pc), undefined))
		}
		if (j == $.pointerValue<Prog>(p).Start) {
			pc = pc + ("*")
		}
		bw(b, $.arrayToSlice<string>([pc, "\t"]))
		dumpInst(b, i)
		bw(b, $.arrayToSlice<string>(["\n"]))
	}
}

export function u32(i: number): string {
	return strconv.FormatUint($.uint($.uint(i, 64), 64), 10)
}

export function dumpInst(b: strings.Builder | $.VarRef<strings.Builder> | null, i: Inst | $.VarRef<Inst> | null): void {
	switch ($.pointerValue<Inst>(i).Op) {
		case 0:
		{
			bw(b, $.arrayToSlice<string>(["alt -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32)), ", ", u32($.uint($.pointerValue<Inst>(i).Arg, 32))]))
			break
		}
		case 1:
		{
			bw(b, $.arrayToSlice<string>(["altmatch -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32)), ", ", u32($.uint($.pointerValue<Inst>(i).Arg, 32))]))
			break
		}
		case 2:
		{
			bw(b, $.arrayToSlice<string>(["cap ", u32($.uint($.pointerValue<Inst>(i).Arg, 32)), " -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 3:
		{
			bw(b, $.arrayToSlice<string>(["empty ", u32($.uint($.pointerValue<Inst>(i).Arg, 32)), " -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 4:
		{
			bw(b, $.arrayToSlice<string>(["match"]))
			break
		}
		case 5:
		{
			bw(b, $.arrayToSlice<string>(["fail"]))
			break
		}
		case 6:
		{
			bw(b, $.arrayToSlice<string>(["nop -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 7:
		{
			if ($.pointerValue<Inst>(i).Rune == null) {
				// shouldn't happen
				bw(b, $.arrayToSlice<string>(["rune <nil>"]))
			}
			bw(b, $.arrayToSlice<string>(["rune ", strconv.QuoteToASCII($.runesToString($.pointerValue<Inst>(i).Rune))]))
			if ($.uint(($.pointerValue<Inst>(i).Arg & 1), 16) != $.uint(0, 16)) {
				bw(b, $.arrayToSlice<string>(["/i"]))
			}
			bw(b, $.arrayToSlice<string>([" -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 8:
		{
			bw(b, $.arrayToSlice<string>(["rune1 ", strconv.QuoteToASCII($.runesToString($.pointerValue<Inst>(i).Rune)), " -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 9:
		{
			bw(b, $.arrayToSlice<string>(["any -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
		case 10:
		{
			bw(b, $.arrayToSlice<string>(["anynotnl -> ", u32($.uint($.pointerValue<Inst>(i).Out, 32))]))
			break
		}
	}
}
