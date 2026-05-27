// Generated file based on onepass.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syntax from "@goscript/regexp/syntax/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"
import "@goscript/regexp/syntax/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/index.js"
import "@goscript/unicode/utf8/index.js"

export class onePassProg {
	public get Inst(): $.Slice<onePassInst> {
		return this._fields.Inst.value
	}
	public set Inst(value: $.Slice<onePassInst>) {
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
		Inst: $.VarRef<$.Slice<onePassInst>>
		Start: $.VarRef<number>
		NumCap: $.VarRef<number>
	}

	constructor(init?: Partial<{Inst?: $.Slice<onePassInst>, Start?: number, NumCap?: number}>) {
		this._fields = {
			Inst: $.varRef(init?.Inst ?? null),
			Start: $.varRef(init?.Start ?? 0),
			NumCap: $.varRef(init?.NumCap ?? 0)
		}
	}

	public clone(): onePassProg {
		const cloned = new onePassProg()
		cloned._fields = {
			Inst: $.varRef(this._fields.Inst.value),
			Start: $.varRef(this._fields.Start.value),
			NumCap: $.varRef(this._fields.NumCap.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.onePassProg",
		() => new onePassProg(),
		[],
		onePassProg,
		{"Inst": { kind: $.TypeKind.Slice, elemType: "regexp.onePassInst" }, "Start": { kind: $.TypeKind.Basic, name: "int" }, "NumCap": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class onePassInst {
	public get Inst(): syntax.Inst {
		return this._fields.Inst.value
	}
	public set Inst(value: syntax.Inst) {
		this._fields.Inst.value = value
	}

	public get Next(): $.Slice<number> {
		return this._fields.Next.value
	}
	public set Next(value: $.Slice<number>) {
		this._fields.Next.value = value
	}

	public _fields: {
		Inst: $.VarRef<syntax.Inst>
		Next: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Inst?: syntax.Inst, Next?: $.Slice<number>}>) {
		this._fields = {
			Inst: $.varRef(init?.Inst ? $.markAsStructValue($.cloneStructValue(init.Inst)) : $.markAsStructValue(new syntax.Inst())),
			Next: $.varRef(init?.Next ?? null)
		}
	}

	public clone(): onePassInst {
		const cloned = new onePassInst()
		cloned._fields = {
			Inst: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Inst.value))),
			Next: $.varRef(this._fields.Next.value)
		}
		return $.markAsStructValue(cloned)
	}

	public MatchEmptyWidth(before: any, after: any): any {
		return $.pointerValue<syntax.Inst>(this.Inst).MatchEmptyWidth(before, after)
	}

	public MatchRune(r: any): any {
		return $.pointerValue<syntax.Inst>(this.Inst).MatchRune(r)
	}

	public MatchRunePos(r: any): any {
		return $.pointerValue<syntax.Inst>(this.Inst).MatchRunePos(r)
	}

	public String(): any {
		return $.pointerValue<syntax.Inst>(this.Inst).String()
	}

	static __typeInfo = $.registerStructType(
		"regexp.onePassInst",
		() => new onePassInst(),
		[{ name: "MatchEmptyWidth", args: [], returns: [] }, { name: "MatchRune", args: [], returns: [] }, { name: "MatchRunePos", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		onePassInst,
		{"Inst": "syntax.Inst", "Next": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class queueOnePass {
	public get sparse(): $.Slice<number> {
		return this._fields.sparse.value
	}
	public set sparse(value: $.Slice<number>) {
		this._fields.sparse.value = value
	}

	public get dense(): $.Slice<number> {
		return this._fields.dense.value
	}
	public set dense(value: $.Slice<number>) {
		this._fields.dense.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public get nextIndex(): number {
		return this._fields.nextIndex.value
	}
	public set nextIndex(value: number) {
		this._fields.nextIndex.value = value
	}

	public _fields: {
		sparse: $.VarRef<$.Slice<number>>
		dense: $.VarRef<$.Slice<number>>
		size: $.VarRef<number>
		nextIndex: $.VarRef<number>
	}

	constructor(init?: Partial<{sparse?: $.Slice<number>, dense?: $.Slice<number>, size?: number, nextIndex?: number}>) {
		this._fields = {
			sparse: $.varRef(init?.sparse ?? null),
			dense: $.varRef(init?.dense ?? null),
			size: $.varRef(init?.size ?? 0),
			nextIndex: $.varRef(init?.nextIndex ?? 0)
		}
	}

	public clone(): queueOnePass {
		const cloned = new queueOnePass()
		cloned._fields = {
			sparse: $.varRef(this._fields.sparse.value),
			dense: $.varRef(this._fields.dense.value),
			size: $.varRef(this._fields.size.value),
			nextIndex: $.varRef(this._fields.nextIndex.value)
		}
		return $.markAsStructValue(cloned)
	}

	public clear(): void {
		let q: queueOnePass | $.VarRef<queueOnePass> | null = this
		$.pointerValue<queueOnePass>(q).size = $.uint(0, 32)
		$.pointerValue<queueOnePass>(q).nextIndex = $.uint(0, 32)
	}

	public contains(u: number): boolean {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (u >= $.uint($.len($.pointerValue<queueOnePass>(q).sparse), 32)) {
			return false
		}
		return ($.pointerValue<queueOnePass>(q).sparse![u] < $.pointerValue<queueOnePass>(q).size) && ($.uint($.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).sparse![u]], 32) == $.uint(u, 32))
	}

	public empty(): boolean {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		return $.pointerValue<queueOnePass>(q).nextIndex >= $.pointerValue<queueOnePass>(q).size
	}

	public insert(u: number): void {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (!queueOnePass.prototype.contains.call(q, $.uint(u, 32))) {
			queueOnePass.prototype.insertNew.call(q, $.uint(u, 32))
		}
	}

	public insertNew(u: number): void {
		let q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (u >= $.uint($.len($.pointerValue<queueOnePass>(q).sparse), 32)) {
			return
		}
		$.pointerValue<queueOnePass>(q).sparse![u] = $.uint($.pointerValue<queueOnePass>(q).size, 32)
		$.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).size] = $.uint(u, 32)
		$.pointerValue<queueOnePass>(q).size++
	}

	public next(): number {
		let q: queueOnePass | $.VarRef<queueOnePass> | null = this
		let n: number = 0
		n = $.uint($.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).nextIndex], 32)
		$.pointerValue<queueOnePass>(q).nextIndex++
		return n
	}

	static __typeInfo = $.registerStructType(
		"regexp.queueOnePass",
		() => new queueOnePass(),
		[{ name: "clear", args: [], returns: [] }, { name: "contains", args: [], returns: [] }, { name: "empty", args: [], returns: [] }, { name: "insert", args: [], returns: [] }, { name: "insertNew", args: [], returns: [] }, { name: "next", args: [], returns: [] }],
		queueOnePass,
		{"sparse": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "dense": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "size": { kind: $.TypeKind.Basic, name: "int" }, "nextIndex": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export const mergeFailed: number = 4294967295

export function onePassPrefix(p: syntax.Prog | $.VarRef<syntax.Prog> | null): [string, boolean, number] {
	let prefix: string = ""
	let complete: boolean = false
	let pc: number = 0
	let i: syntax.Inst | $.VarRef<syntax.Inst> | null = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, $.pointerValue<syntax.Prog>(p).Start)
	if (($.uint($.pointerValue<syntax.Inst>(i).Op, 8) != $.uint(syntax.InstEmptyWidth, 8)) || ($.uint((($.pointerValue<syntax.Inst>(i).Arg) & syntax.EmptyBeginText), 8) == $.uint(0, 8))) {
		return ["", $.uint($.pointerValue<syntax.Inst>(i).Op, 8) == $.uint(syntax.InstMatch, 8), $.uint($.uint($.pointerValue<syntax.Prog>(p).Start, 32), 32)]
	}
	pc = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
	i = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, pc)
	while ($.uint($.pointerValue<syntax.Inst>(i).Op, 8) == $.uint(syntax.InstNop, 8)) {
		pc = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
		i = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, pc)
	}
	// Avoid allocation of buffer if prefix is empty.
	if (($.uint(iop(i), 8) != $.uint(syntax.InstRune, 8)) || ($.len($.pointerValue<syntax.Inst>(i).Rune) != 1)) {
		return ["", $.uint($.pointerValue<syntax.Inst>(i).Op, 8) == $.uint(syntax.InstMatch, 8), $.uint($.uint($.pointerValue<syntax.Prog>(p).Start, 32), 32)]
	}

	// Have prefix; gather characters.
	let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	while (((($.uint(iop(i), 8) == $.uint(syntax.InstRune, 8)) && ($.len($.pointerValue<syntax.Inst>(i).Rune) == 1)) && ($.uint(($.pointerValue<syntax.Inst>(i).Arg & syntax.FoldCase), 16) == $.uint(0, 16))) && ($.int($.pointerValue<syntax.Inst>(i).Rune![0], 32) != $.int(utf8.RuneError, 32))) {
		buf.value.WriteRune($.int($.pointerValue<syntax.Inst>(i).Rune![0], 32))
		let __goscriptAssign0_0: number = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
		let __goscriptAssign0_1: syntax.Inst | $.VarRef<syntax.Inst> | null = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, $.pointerValue<syntax.Inst>(i).Out)
		pc = __goscriptAssign0_0
		i = __goscriptAssign0_1
	}
	if ((($.uint($.pointerValue<syntax.Inst>(i).Op, 8) == $.uint(syntax.InstEmptyWidth, 8)) && ($.uint(($.pointerValue<syntax.Inst>(i).Arg & syntax.EmptyEndText), 8) != $.uint(0, 8))) && ($.uint($.pointerValue<syntax.Prog>(p).Inst![$.pointerValue<syntax.Inst>(i).Out].Op, 8) == $.uint(syntax.InstMatch, 8))) {
		complete = true
	}
	return [buf.value.String(), complete, $.uint(pc, 32)]
}

export function onePassNext(i: onePassInst | $.VarRef<onePassInst> | null, r: number): number {
	let next = $.pointerValue<onePassInst>(i).Inst.MatchRunePos($.int(r, 32))
	if (next >= 0) {
		return $.uint($.pointerValue<onePassInst>(i).Next![next], 32)
	}
	if ($.uint($.pointerValue<onePassInst>(i).Inst.Op, 8) == $.uint(syntax.InstAltMatch, 8)) {
		return $.uint($.pointerValue<onePassInst>(i).Inst.Out, 32)
	}
	return $.uint(0, 32)
}

export function iop(i: syntax.Inst | $.VarRef<syntax.Inst> | null): syntax.InstOp {
	let op = $.uint($.pointerValue<syntax.Inst>(i).Op, 8)
	switch (op) {
		case syntax.InstRune1:
		case syntax.InstRuneAny:
		case syntax.InstRuneAnyNotNL:
		{
			op = $.uint(syntax.InstRune, 8)
			break
		}
	}
	return $.uint(op, 8)
}

export function newQueue(size: number): queueOnePass | $.VarRef<queueOnePass> | null {
	let q: queueOnePass | $.VarRef<queueOnePass> | null = null as queueOnePass | $.VarRef<queueOnePass> | null
	return new queueOnePass({sparse: $.makeSlice<number>(size, undefined, "number"), dense: $.makeSlice<number>(size, undefined, "number")})
}

export let noRune: $.Slice<number> = $.arrayToSlice<number>([])

export function __goscript_set_noRune(__goscriptValue: $.Slice<number>): void {
	noRune = __goscriptValue
}

export let noNext: $.Slice<number> = $.arrayToSlice<number>([$.uint(mergeFailed, 32)])

export function __goscript_set_noNext(__goscriptValue: $.Slice<number>): void {
	noNext = __goscriptValue
}

export async function mergeRuneSets(leftRunes: $.VarRef<$.Slice<number>> | null, rightRunes: $.VarRef<$.Slice<number>> | null, leftPC: number, rightPC: number): globalThis.Promise<[$.Slice<number>, $.Slice<number>]> {
	using __defer = new $.DisposableStack()
	let leftLen = $.len($.pointerValue<$.Slice<number>>(leftRunes))
	let rightLen = $.len($.pointerValue<$.Slice<number>>(rightRunes))
	if (((leftLen & 0x1) != 0) || ((rightLen & 0x1) != 0)) {
		$.panic("mergeRuneSets odd length []rune")
	}
	let lx: $.VarRef<number> = $.varRef(0)
	let rx: $.VarRef<number> = $.varRef(0)
	let merged: $.Slice<number> = $.makeSlice<number>(0, undefined, "number")
	let next: $.Slice<number> = $.makeSlice<number>(0, undefined, "number")
	let ok = true
	__defer.defer(() => { ($.functionValue((): void => {
		if (!ok) {
			merged = null
			next = null
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	let ix = -1
	let extend: ((newLow: $.VarRef<number> | null, newArray: $.VarRef<$.Slice<number>> | null, pc: number) => boolean | globalThis.Promise<boolean>) | null = $.functionValue((newLow: $.VarRef<number> | null, newArray: $.VarRef<$.Slice<number>> | null, pc: number): boolean => {
		if ((ix > 0) && (($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow)] <= merged![ix])) {
			return false
		}
		merged = $.append(merged, $.int(($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow)], 32), $.int(($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow) + 1], 32))
		newLow!.value += 2
		ix += 2
		next = $.append(next, $.uint(pc, 32))
		return true
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))

	while ((lx.value < leftLen) || (rx.value < rightLen)) {
		switch (true) {
			case rx.value >= rightLen:
			{
				ok = await extend!(lx, leftRunes, $.uint(leftPC, 32))
				break
			}
			case lx.value >= leftLen:
			{
				ok = await extend!(rx, rightRunes, $.uint(rightPC, 32))
				break
			}
			case ($.pointerValue<$.Slice<number>>(rightRunes))![rx.value] < ($.pointerValue<$.Slice<number>>(leftRunes))![lx.value]:
			{
				ok = await extend!(rx, rightRunes, $.uint(rightPC, 32))
				break
			}
			default:
			{
				ok = await extend!(lx, leftRunes, $.uint(leftPC, 32))
				break
			}
		}
		if (!ok) {
			return [noRune, noNext]
		}
	}
	return [merged, next]
}

export function cleanupOnePass(prog: onePassProg | $.VarRef<onePassProg> | null, original: syntax.Prog | $.VarRef<syntax.Prog> | null): void {
	for (let __goscriptRangeTarget0 = $.pointerValue<syntax.Prog>(original).Inst, ix = 0; ix < $.len(__goscriptRangeTarget0); ix++) {
		let instOriginal = __goscriptRangeTarget0![ix]
		switch (instOriginal.Op) {
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			case syntax.InstRune:
			{
				break
			}
			case syntax.InstCapture:
			case syntax.InstEmptyWidth:
			case syntax.InstNop:
			case syntax.InstMatch:
			case syntax.InstFail:
			{
				$.pointerValue<onePassProg>(prog).Inst![ix].Next = null
				break
			}
			case syntax.InstRune1:
			case syntax.InstRuneAny:
			case syntax.InstRuneAnyNotNL:
			{
				$.pointerValue<onePassProg>(prog).Inst![ix].Next = null
				$.pointerValue<onePassProg>(prog).Inst![ix] = $.markAsStructValue(new onePassInst({Inst: $.markAsStructValue($.cloneStructValue(instOriginal))}))
				break
			}
		}
	}
}

export function onePassCopy(prog: syntax.Prog | $.VarRef<syntax.Prog> | null): onePassProg | $.VarRef<onePassProg> | null {
	let p: onePassProg | $.VarRef<onePassProg> | null = new onePassProg({Start: $.pointerValue<syntax.Prog>(prog).Start, NumCap: $.pointerValue<syntax.Prog>(prog).NumCap, Inst: $.makeSlice<onePassInst>($.len($.pointerValue<syntax.Prog>(prog).Inst), undefined, undefined, () => $.markAsStructValue(new onePassInst()))})
	for (let __goscriptRangeTarget1 = $.pointerValue<syntax.Prog>(prog).Inst, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let inst = __goscriptRangeTarget1![i]
		$.pointerValue<onePassProg>(p).Inst![i] = $.markAsStructValue(new onePassInst({Inst: $.markAsStructValue($.cloneStructValue(inst))}))
	}

	// rewrites one or more common Prog constructs that enable some otherwise
	// non-onepass Progs to be onepass. A:BD (for example) means an InstAlt at
	// ip A, that points to ips B & C.
	// A:BC + B:DA => A:BC + B:CD
	// A:BC + B:DC => A:DC + B:DC
	for (let __goscriptRangeTarget2 = $.pointerValue<onePassProg>(p).Inst, pc = 0; pc < $.len(__goscriptRangeTarget2); pc++) {
		switch ($.pointerValue<onePassProg>(p).Inst![pc].Inst.Op) {
			default:
			{
				continue
				break
			}
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			{
				let p_A_Other = $.pointerValue<onePassProg>(p).Inst![pc].Inst._fields.Out
				let p_A_Alt = $.pointerValue<onePassProg>(p).Inst![pc].Inst._fields.Arg
				// make sure a target is another Alt
				let instAlt = $.markAsStructValue($.cloneStructValue($.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)]))
				if (!(($.uint(instAlt.Inst.Op, 8) == $.uint(syntax.InstAlt, 8)) || ($.uint(instAlt.Inst.Op, 8) == $.uint(syntax.InstAltMatch, 8)))) {
					let __goscriptAssign1_0: $.VarRef<number> | null = p_A_Other
					let __goscriptAssign1_1: $.VarRef<number> | null = p_A_Alt
					p_A_Alt = __goscriptAssign1_0
					p_A_Other = __goscriptAssign1_1
					instAlt = $.markAsStructValue($.cloneStructValue($.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)]))
					if (!(($.uint(instAlt.Inst.Op, 8) == $.uint(syntax.InstAlt, 8)) || ($.uint(instAlt.Inst.Op, 8) == $.uint(syntax.InstAltMatch, 8)))) {
						continue
					}
				}
				let instOther = $.markAsStructValue($.cloneStructValue($.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Other)]))
				// Analyzing both legs pointing to Alts is for another day
				if (($.uint(instOther.Inst.Op, 8) == $.uint(syntax.InstAlt, 8)) || ($.uint(instOther.Inst.Op, 8) == $.uint(syntax.InstAltMatch, 8))) {
					// too complicated
					continue
				}
				// simple empty transition loop
				// A:BC + B:DA => A:BC + B:DC
				let p_B_Alt = $.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)].Inst._fields.Out
				let p_B_Other = $.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)].Inst._fields.Arg
				let patch = false
				if ($.uint(instAlt.Inst.Out, 32) == $.uint($.uint(pc, 32), 32)) {
					patch = true
				} else {
					if ($.uint(instAlt.Inst.Arg, 32) == $.uint($.uint(pc, 32), 32)) {
						patch = true
						let __goscriptAssign2_0: $.VarRef<number> | null = p_B_Other
						let __goscriptAssign2_1: $.VarRef<number> | null = p_B_Alt
						p_B_Alt = __goscriptAssign2_0
						p_B_Other = __goscriptAssign2_1
					}
				}
				if (patch) {
					p_B_Alt!.value = $.uint($.pointerValue<number>(p_A_Other), 32)
				}

				// empty transition to common target
				// A:BC + B:DC => A:DC + B:DC
				if ($.uint($.pointerValue<number>(p_A_Other), 32) == $.uint($.pointerValue<number>(p_B_Alt), 32)) {
					p_A_Alt!.value = $.uint($.pointerValue<number>(p_B_Other), 32)
				}
				break
			}
		}
	}
	return p
}

export let anyRuneNotNL: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 32), $.int(10 - 1, 32), $.int(10 + 1, 32), $.int(unicode.MaxRune, 32)])

export function __goscript_set_anyRuneNotNL(__goscriptValue: $.Slice<number>): void {
	anyRuneNotNL = __goscriptValue
}

export let anyRune: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 32), $.int(unicode.MaxRune, 32)])

export function __goscript_set_anyRune(__goscriptValue: $.Slice<number>): void {
	anyRune = __goscriptValue
}

export async function makeOnePass(p: onePassProg | $.VarRef<onePassProg> | null): globalThis.Promise<onePassProg | $.VarRef<onePassProg> | null> {
	// If the machine is very long, it's not worth the time to check if we can use one pass.
	if ($.len($.pointerValue<onePassProg>(p).Inst) >= 1000) {
		return null
	}

	let instQueue: queueOnePass | $.VarRef<queueOnePass> | null = newQueue($.len($.pointerValue<onePassProg>(p).Inst))
	let visitQueue: queueOnePass | $.VarRef<queueOnePass> | null = newQueue($.len($.pointerValue<onePassProg>(p).Inst))
	let check: ((_p0: number, _p1: $.Slice<boolean>) => boolean | globalThis.Promise<boolean>) | null = null as ((_p0: number, _p1: $.Slice<boolean>) => boolean | globalThis.Promise<boolean>) | null
	let onePassRunes: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>($.len($.pointerValue<onePassProg>(p).Inst))

	// check that paths from Alt instructions are unambiguous, and rebuild the new
	// program as a onepass program
	check = $.functionValue(async (pc: number, m: $.Slice<boolean>): globalThis.Promise<boolean> => {
		let ok: boolean = false
		ok = true
		let inst: onePassInst | $.VarRef<onePassInst> | null = $.indexRef($.pointerValue<onePassProg>(p).Inst!, pc)
		if (queueOnePass.prototype.contains.call(visitQueue, $.uint(pc, 32))) {
			return ok
		}
		queueOnePass.prototype.insert.call(visitQueue, $.uint(pc, 32))
		switch ($.pointerValue<onePassInst>(inst).Inst.Op) {
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			{
				ok = await check!($.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32), m) && await check!($.uint($.pointerValue<onePassInst>(inst).Inst.Arg, 32), m)
				// check no-input paths to InstMatch
				let matchOut = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				let matchArg = m![$.pointerValue<onePassInst>(inst).Inst.Arg]
				if (matchOut && matchArg) {
					ok = false
					break
				}
				// Match on empty goes in inst.Out
				if (matchArg) {
					let __goscriptAssign3_0: number = $.uint($.pointerValue<onePassInst>(inst).Inst.Arg, 32)
					let __goscriptAssign3_1: number = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
					$.pointerValue<onePassInst>(inst).Inst.Out = __goscriptAssign3_0
					$.pointerValue<onePassInst>(inst).Inst.Arg = __goscriptAssign3_1
					let __goscriptAssign4_0: boolean = matchArg
					let __goscriptAssign4_1: boolean = matchOut
					matchOut = __goscriptAssign4_0
					matchArg = __goscriptAssign4_1
				}
				if (matchOut) {
					m![pc] = true
					$.pointerValue<onePassInst>(inst).Inst.Op = $.uint(syntax.InstAltMatch, 8)
				}

				// build a dispatch operator from the two legs of the alt.
				let __goscriptTuple0: any = await mergeRuneSets($.indexRef(onePassRunes!, $.pointerValue<onePassInst>(inst).Inst.Out), $.indexRef(onePassRunes!, $.pointerValue<onePassInst>(inst).Inst.Arg), $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32), $.uint($.pointerValue<onePassInst>(inst).Inst.Arg, 32))
				onePassRunes![pc] = __goscriptTuple0[0]
				$.pointerValue<onePassInst>(inst).Next = __goscriptTuple0[1]
				if (($.len($.pointerValue<onePassInst>(inst).Next) > 0) && ($.uint($.pointerValue<onePassInst>(inst).Next![0], 32) == $.uint(mergeFailed, 32))) {
					ok = false
					break
				}
				break
			}
			case syntax.InstCapture:
			case syntax.InstNop:
			{
				ok = await check!($.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32), m)
				m![pc] = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				// pass matching runes back through these no-ops.
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(onePassRunes![$.pointerValue<onePassInst>(inst).Inst.Out] ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let __goscriptRangeTarget3 = $.pointerValue<onePassInst>(inst).Next, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
				}
				break
			}
			case syntax.InstEmptyWidth:
			{
				ok = await check!($.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32), m)
				m![pc] = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(onePassRunes![$.pointerValue<onePassInst>(inst).Inst.Out] ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let __goscriptRangeTarget4 = $.pointerValue<onePassInst>(inst).Next, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
				}
				break
			}
			case syntax.InstMatch:
			case syntax.InstFail:
			{
				m![pc] = $.uint($.pointerValue<onePassInst>(inst).Inst.Op, 8) == $.uint(syntax.InstMatch, 8)
				break
			}
			case syntax.InstRune:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32))
				if ($.len($.pointerValue<onePassInst>(inst).Inst.Rune) == 0) {
					onePassRunes![pc] = $.arrayToSlice<number>([])
					$.pointerValue<onePassInst>(inst).Next = $.arrayToSlice<number>([$.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)])
					break
				}
				let runes: $.Slice<number> = $.makeSlice<number>(0, undefined, "number")
				if (($.len($.pointerValue<onePassInst>(inst).Inst.Rune) == 1) && ($.uint(($.pointerValue<onePassInst>(inst).Inst.Arg & syntax.FoldCase), 16) != $.uint(0, 16))) {
					let r0 = $.int($.pointerValue<onePassInst>(inst).Inst.Rune![0], 32)
					runes = $.append(runes, $.int(r0, 32), $.int(r0, 32))
					for (let r1 = $.int(unicode.SimpleFold($.int(r0, 32)), 32); $.int(r1, 32) != $.int(r0, 32); r1 = $.int(unicode.SimpleFold($.int(r1, 32)), 32)) {
						runes = $.append(runes, $.int(r1, 32), $.int(r1, 32))
					}
					slices.Sort(runes)
				} else {
					runes = $.append(runes, ...($.pointerValue<onePassInst>(inst).Inst.Rune ?? []))
				}
				onePassRunes![pc] = runes
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let __goscriptRangeTarget5 = $.pointerValue<onePassInst>(inst).Next, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
				}
				$.pointerValue<onePassInst>(inst).Inst.Op = $.uint(syntax.InstRune, 8)
				break
			}
			case syntax.InstRune1:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32))
				let runes: $.Slice<number> = $.arrayToSlice<number>([])
				// expand case-folded runes
				if ($.uint(($.pointerValue<onePassInst>(inst).Inst.Arg & syntax.FoldCase), 16) != $.uint(0, 16)) {
					let r0 = $.int($.pointerValue<onePassInst>(inst).Inst.Rune![0], 32)
					runes = $.append(runes, $.int(r0, 32), $.int(r0, 32))
					for (let r1 = $.int(unicode.SimpleFold($.int(r0, 32)), 32); $.int(r1, 32) != $.int(r0, 32); r1 = $.int(unicode.SimpleFold($.int(r1, 32)), 32)) {
						runes = $.append(runes, $.int(r1, 32), $.int(r1, 32))
					}
					slices.Sort(runes)
				} else {
					runes = $.append(runes, $.int($.pointerValue<onePassInst>(inst).Inst.Rune![0], 32), $.int($.pointerValue<onePassInst>(inst).Inst.Rune![0], 32))
				}
				onePassRunes![pc] = runes
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let __goscriptRangeTarget6 = $.pointerValue<onePassInst>(inst).Next, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
				}
				$.pointerValue<onePassInst>(inst).Inst.Op = $.uint(syntax.InstRune, 8)
				break
			}
			case syntax.InstRuneAny:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32))
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(anyRune ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.arrayToSlice<number>([$.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)])
				break
			}
			case syntax.InstRuneAnyNotNL:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32))
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(anyRuneNotNL ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let __goscriptRangeTarget7 = $.pointerValue<onePassInst>(inst).Next, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.uint($.pointerValue<onePassInst>(inst).Inst.Out, 32)
				}
				break
			}
		}
		return ok
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))

	queueOnePass.prototype.clear.call(instQueue)
	queueOnePass.prototype.insert.call(instQueue, $.uint($.uint($.pointerValue<onePassProg>(p).Start, 32), 32))
	let m: $.Slice<boolean> = $.makeSlice<boolean>($.len($.pointerValue<onePassProg>(p).Inst), undefined, "boolean")
	while (!queueOnePass.prototype.empty.call(instQueue)) {
		queueOnePass.prototype.clear.call(visitQueue)
		let pc = $.uint(queueOnePass.prototype.next.call(instQueue), 32)
		if (!await check!($.uint(pc, 32), m)) {
			p = null
			break
		}
	}
	if (p != null) {
		for (let __goscriptRangeTarget8 = $.pointerValue<onePassProg>(p).Inst, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
			$.pointerValue<onePassProg>(p).Inst![i].Inst.Rune = onePassRunes![i]
		}
	}
	return p
}

export async function compileOnePass(prog: syntax.Prog | $.VarRef<syntax.Prog> | null): globalThis.Promise<onePassProg | $.VarRef<onePassProg> | null> {
	let p: onePassProg | $.VarRef<onePassProg> | null = null as onePassProg | $.VarRef<onePassProg> | null
	if ($.pointerValue<syntax.Prog>(prog).Start == 0) {
		return null
	}
	// onepass regexp is anchored
	if (($.uint($.pointerValue<syntax.Prog>(prog).Inst![$.pointerValue<syntax.Prog>(prog).Start].Op, 8) != $.uint(syntax.InstEmptyWidth, 8)) || ($.uint(($.pointerValue<syntax.Prog>(prog).Inst![$.pointerValue<syntax.Prog>(prog).Start].Arg & syntax.EmptyBeginText), 8) != $.uint(syntax.EmptyBeginText, 8))) {
		return null
	}
	let hasAlt = false
	for (let __goscriptRangeTarget9 = $.pointerValue<syntax.Prog>(prog).Inst, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
		let inst = __goscriptRangeTarget9![__rangeIndex]
		if (($.uint(inst.Op, 8) == $.uint(syntax.InstAlt, 8)) || ($.uint(inst.Op, 8) == $.uint(syntax.InstAltMatch, 8))) {
			hasAlt = true
			break
		}
	}
	// If we have alternates, every instruction leading to InstMatch must be EmptyEndText.
	// Also, any match on empty text must be $.
	for (let __goscriptRangeTarget10 = $.pointerValue<syntax.Prog>(prog).Inst, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
		let inst = __goscriptRangeTarget10![__rangeIndex]
		let opOut = $.uint($.pointerValue<syntax.Prog>(prog).Inst![inst.Out].Op, 8)
		switch (inst.Op) {
			default:
			{
				if (($.uint(opOut, 8) == $.uint(syntax.InstMatch, 8)) && hasAlt) {
					return null
				}
				break
			}
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			{
				if (($.uint(opOut, 8) == $.uint(syntax.InstMatch, 8)) || ($.uint($.pointerValue<syntax.Prog>(prog).Inst![inst.Arg].Op, 8) == $.uint(syntax.InstMatch, 8))) {
					return null
				}
				break
			}
			case syntax.InstEmptyWidth:
			{
				if ($.uint(opOut, 8) == $.uint(syntax.InstMatch, 8)) {
					if ($.uint((inst.Arg & syntax.EmptyEndText), 8) == $.uint(syntax.EmptyEndText, 8)) {
						continue
					}
					return null
				}
				break
			}
		}
	}
	// Creates a slightly optimized copy of the original Prog
	// that cleans up some Prog idioms that block valid onepass programs
	p = onePassCopy(prog)

	// checkAmbiguity on InstAlts, build onepass Prog if possible
	p = await makeOnePass(p)

	if (p != null) {
		cleanupOnePass(p, prog)
	}
	return p
}
