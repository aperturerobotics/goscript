// Generated file based on onepass.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syntax from "@goscript/regexp/syntax/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

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
			Inst: $.varRef(init?.Inst ? $.markAsStructValue(init.Inst.clone()) : $.markAsStructValue(new syntax.Inst())),
			Next: $.varRef(init?.Next ?? null)
		}
	}

	public clone(): onePassInst {
		const cloned = new onePassInst()
		cloned._fields = {
			Inst: $.varRef($.markAsStructValue(this._fields.Inst.value.clone())),
			Next: $.varRef(this._fields.Next.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.onePassInst",
		() => new onePassInst(),
		[],
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
		$.pointerValue<queueOnePass>(q).size = 0
		$.pointerValue<queueOnePass>(q).nextIndex = 0
	}

	public contains(u: number): boolean {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (u >= $.uint($.len($.pointerValue<queueOnePass>(q).sparse), 32)) {
			return false
		}
		return ($.pointerValue<queueOnePass>(q).sparse![u] < $.pointerValue<queueOnePass>(q).size) && ($.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).sparse![u]] == u)
	}

	public empty(): boolean {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		return $.pointerValue<queueOnePass>(q).nextIndex >= $.pointerValue<queueOnePass>(q).size
	}

	public insert(u: number): void {
		const q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (!$.pointerValue<queueOnePass>(q).contains(u)) {
			$.pointerValue<queueOnePass>(q).insertNew(u)
		}
	}

	public insertNew(u: number): void {
		let q: queueOnePass | $.VarRef<queueOnePass> | null = this
		if (u >= $.uint($.len($.pointerValue<queueOnePass>(q).sparse), 32)) {
			return
		}
		$.pointerValue<queueOnePass>(q).sparse![u] = $.pointerValue<queueOnePass>(q).size
		$.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).size] = u
		$.pointerValue<queueOnePass>(q).size++
	}

	public next(): number {
		let q: queueOnePass | $.VarRef<queueOnePass> | null = this
		let n: number = 0
		n = $.pointerValue<queueOnePass>(q).dense![$.pointerValue<queueOnePass>(q).nextIndex]
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
	if (($.pointerValue<syntax.Inst>(i).Op != syntax.InstEmptyWidth) || ((($.pointerValue<syntax.Inst>(i).Arg) & syntax.EmptyBeginText) == 0)) {
		return ["", $.pointerValue<syntax.Inst>(i).Op == syntax.InstMatch, $.uint($.pointerValue<syntax.Prog>(p).Start, 32)]
	}
	pc = $.pointerValue<syntax.Inst>(i).Out
	i = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, pc)
	while ($.pointerValue<syntax.Inst>(i).Op == syntax.InstNop) {
		pc = $.pointerValue<syntax.Inst>(i).Out
		i = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, pc)
	}
	// Avoid allocation of buffer if prefix is empty.
	if ((iop(i) != syntax.InstRune) || ($.len($.pointerValue<syntax.Inst>(i).Rune) != 1)) {
		return ["", $.pointerValue<syntax.Inst>(i).Op == syntax.InstMatch, $.uint($.pointerValue<syntax.Prog>(p).Start, 32)]
	}

	// Have prefix; gather characters.
	let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	while ((((iop(i) == syntax.InstRune) && ($.len($.pointerValue<syntax.Inst>(i).Rune) == 1)) && (($.pointerValue<syntax.Inst>(i).Arg & syntax.FoldCase) == 0)) && ($.pointerValue<syntax.Inst>(i).Rune![0] != utf8.RuneError)) {
		buf.value.WriteRune($.pointerValue<syntax.Inst>(i).Rune![0])
		let __goscriptAssign0_0: number = $.pointerValue<syntax.Inst>(i).Out
		let __goscriptAssign0_1: syntax.Inst | $.VarRef<syntax.Inst> | null = $.indexRef($.pointerValue<syntax.Prog>(p).Inst!, $.pointerValue<syntax.Inst>(i).Out)
		pc = __goscriptAssign0_0
		i = __goscriptAssign0_1
	}
	if ((($.pointerValue<syntax.Inst>(i).Op == syntax.InstEmptyWidth) && (($.pointerValue<syntax.Inst>(i).Arg & syntax.EmptyEndText) != 0)) && ($.pointerValue<syntax.Prog>(p).Inst![$.pointerValue<syntax.Inst>(i).Out].Op == syntax.InstMatch)) {
		complete = true
	}
	return [buf.value.String(), complete, pc]
}

export function onePassNext(i: onePassInst | $.VarRef<onePassInst> | null, r: number): number {
	let next = $.pointerValue<onePassInst>(i).Inst.MatchRunePos(r)
	if (next >= 0) {
		return $.pointerValue<onePassInst>(i).Next![next]
	}
	if ($.pointerValue<onePassInst>(i).Inst.Op == syntax.InstAltMatch) {
		return $.pointerValue<onePassInst>(i).Inst.Out
	}
	return 0
}

export function iop(i: syntax.Inst | $.VarRef<syntax.Inst> | null): syntax.InstOp {
	let op = $.pointerValue<syntax.Inst>(i).Op
	switch (op) {
		case syntax.InstRune1:
		case syntax.InstRuneAny:
		case syntax.InstRuneAnyNotNL:
		{
			op = syntax.InstRune
			break
		}
	}
	return op
}

export function newQueue(size: number): queueOnePass | $.VarRef<queueOnePass> | null {
	let q: queueOnePass | $.VarRef<queueOnePass> | null = null
	return new queueOnePass({sparse: $.makeSlice<number>(size, undefined, "number"), dense: $.makeSlice<number>(size, undefined, "number")})
}

export let noRune: $.Slice<number> = $.arrayToSlice<number>([])

export function __goscript_set_noRune(value: $.Slice<number>): void {
	noRune = value
}

export let noNext: $.Slice<number> = $.arrayToSlice<number>([mergeFailed])

export function __goscript_set_noNext(value: $.Slice<number>): void {
	noNext = value
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
	let merged = $.makeSlice<number>(0, undefined, "number")
	let next = $.makeSlice<number>(0, undefined, "number")
	let ok = true
	__defer.defer(() => { ($.functionValue((): void => {
		if (!ok) {
			merged = null
			next = null
		}
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })

	let ix = -1
	let extend = $.functionValue((newLow: $.VarRef<number> | null, newArray: $.VarRef<$.Slice<number>> | null, pc: number): boolean => {
		if ((ix > 0) && (($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow)] <= merged![ix])) {
			return false
		}
		merged = $.append(merged, ($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow)], ($.pointerValue<$.Slice<number>>(newArray))![$.pointerValue<number>(newLow) + 1])
		newLow!.value += 2
		ix += 2
		next = $.append(next, pc)
		return true
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })

	while ((lx.value < leftLen) || (rx.value < rightLen)) {
		switch (true) {
			case rx.value >= rightLen:
			{
				ok = await extend!(lx, leftRunes, leftPC)
				break
			}
			case lx.value >= leftLen:
			{
				ok = await extend!(rx, rightRunes, rightPC)
				break
			}
			case ($.pointerValue<$.Slice<number>>(rightRunes))![rx.value] < ($.pointerValue<$.Slice<number>>(leftRunes))![lx.value]:
			{
				ok = await extend!(rx, rightRunes, rightPC)
				break
			}
			default:
			{
				ok = await extend!(lx, leftRunes, leftPC)
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
	for (let ix = 0; ix < $.len($.pointerValue<syntax.Prog>(original).Inst); ix++) {
		let instOriginal = $.pointerValue<syntax.Prog>(original).Inst![ix]
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
	let p: onePassProg | $.VarRef<onePassProg> | null = new onePassProg({Start: $.pointerValue<syntax.Prog>(prog).Start, NumCap: $.pointerValue<syntax.Prog>(prog).NumCap, Inst: $.makeSlice<onePassInst>($.len($.pointerValue<syntax.Prog>(prog).Inst))})
	for (let i = 0; i < $.len($.pointerValue<syntax.Prog>(prog).Inst); i++) {
		let inst = $.pointerValue<syntax.Prog>(prog).Inst![i]
		$.pointerValue<onePassProg>(p).Inst![i] = $.markAsStructValue(new onePassInst({Inst: $.markAsStructValue($.cloneStructValue(inst))}))
	}

	// rewrites one or more common Prog constructs that enable some otherwise
	// non-onepass Progs to be onepass. A:BD (for example) means an InstAlt at
	// ip A, that points to ips B & C.
	// A:BC + B:DA => A:BC + B:CD
	// A:BC + B:DC => A:DC + B:DC
	for (let pc = 0; pc < $.len($.pointerValue<onePassProg>(p).Inst); pc++) {
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
				if (!((instAlt.Inst.Op == syntax.InstAlt) || (instAlt.Inst.Op == syntax.InstAltMatch))) {
					let __goscriptAssign1_0: $.VarRef<number> | null = p_A_Other
					let __goscriptAssign1_1: $.VarRef<number> | null = p_A_Alt
					p_A_Alt = __goscriptAssign1_0
					p_A_Other = __goscriptAssign1_1
					instAlt = $.markAsStructValue($.cloneStructValue($.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)]))
					if (!((instAlt.Inst.Op == syntax.InstAlt) || (instAlt.Inst.Op == syntax.InstAltMatch))) {
						continue
					}
				}
				let instOther = $.markAsStructValue($.cloneStructValue($.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Other)]))
				// Analyzing both legs pointing to Alts is for another day
				if ((instOther.Inst.Op == syntax.InstAlt) || (instOther.Inst.Op == syntax.InstAltMatch)) {
					// too complicated
					continue
				}
				// simple empty transition loop
				// A:BC + B:DA => A:BC + B:DC
				let p_B_Alt = $.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)].Inst._fields.Out
				let p_B_Other = $.pointerValue<onePassProg>(p).Inst![$.pointerValue<number>(p_A_Alt)].Inst._fields.Arg
				let patch = false
				if (instAlt.Inst.Out == $.uint(pc, 32)) {
					patch = true
				} else {
					if (instAlt.Inst.Arg == $.uint(pc, 32)) {
						patch = true
						let __goscriptAssign2_0: $.VarRef<number> | null = p_B_Other
						let __goscriptAssign2_1: $.VarRef<number> | null = p_B_Alt
						p_B_Alt = __goscriptAssign2_0
						p_B_Other = __goscriptAssign2_1
					}
				}
				if (patch) {
					p_B_Alt!.value = $.pointerValue<number>(p_A_Other)
				}

				// empty transition to common target
				// A:BC + B:DC => A:DC + B:DC
				if ($.pointerValue<number>(p_A_Other) == $.pointerValue<number>(p_B_Alt)) {
					p_A_Alt!.value = $.pointerValue<number>(p_B_Other)
				}
				break
			}
		}
	}
	return p
}

export let anyRuneNotNL: $.Slice<number> = $.arrayToSlice<number>([0, 10 - 1, 10 + 1, unicode.MaxRune])

export function __goscript_set_anyRuneNotNL(value: $.Slice<number>): void {
	anyRuneNotNL = value
}

export let anyRune: $.Slice<number> = $.arrayToSlice<number>([0, unicode.MaxRune])

export function __goscript_set_anyRune(value: $.Slice<number>): void {
	anyRune = value
}

export async function makeOnePass(p: onePassProg | $.VarRef<onePassProg> | null): globalThis.Promise<onePassProg | $.VarRef<onePassProg> | null> {
	// If the machine is very long, it's not worth the time to check if we can use one pass.
	if ($.len($.pointerValue<onePassProg>(p).Inst) >= 1000) {
		return null
	}

	let instQueue: queueOnePass | $.VarRef<queueOnePass> | null = newQueue($.len($.pointerValue<onePassProg>(p).Inst))
	let visitQueue: queueOnePass | $.VarRef<queueOnePass> | null = newQueue($.len($.pointerValue<onePassProg>(p).Inst))
	let check: ((_p0: number, _p1: $.Slice<boolean>) => boolean | globalThis.Promise<boolean>) | null = null as ((_p0: number, _p1: $.Slice<boolean>) => boolean) | null
	let onePassRunes: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>($.len($.pointerValue<onePassProg>(p).Inst))

	// check that paths from Alt instructions are unambiguous, and rebuild the new
	// program as a onepass program
	check = $.functionValue(async (pc: number, m: $.Slice<boolean>): globalThis.Promise<boolean> => {
		let ok: boolean = false
		ok = true
		let inst: onePassInst | $.VarRef<onePassInst> | null = $.indexRef($.pointerValue<onePassProg>(p).Inst!, pc)
		if ($.pointerValue<queueOnePass>(visitQueue).contains(pc)) {
			return ok
		}
		queueOnePass.prototype.insert.call(visitQueue, pc)
		switch ($.pointerValue<onePassInst>(inst).Inst.Op) {
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			{
				ok = await check!($.pointerValue<onePassInst>(inst).Inst.Out, m) && await check!($.pointerValue<onePassInst>(inst).Inst.Arg, m)
				// check no-input paths to InstMatch
				let matchOut = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				let matchArg = m![$.pointerValue<onePassInst>(inst).Inst.Arg]
				if (matchOut && matchArg) {
					ok = false
					break
				}
				// Match on empty goes in inst.Out
				if (matchArg) {
					let __goscriptAssign3_0: number = $.pointerValue<onePassInst>(inst).Inst.Arg
					let __goscriptAssign3_1: number = $.pointerValue<onePassInst>(inst).Inst.Out
					$.pointerValue<onePassInst>(inst).Inst.Out = __goscriptAssign3_0
					$.pointerValue<onePassInst>(inst).Inst.Arg = __goscriptAssign3_1
					let __goscriptAssign4_0: boolean = matchArg
					let __goscriptAssign4_1: boolean = matchOut
					matchOut = __goscriptAssign4_0
					matchArg = __goscriptAssign4_1
				}
				if (matchOut) {
					m![pc] = true
					$.pointerValue<onePassInst>(inst).Inst.Op = syntax.InstAltMatch
				}

				// build a dispatch operator from the two legs of the alt.
				let __goscriptTuple0 = await mergeRuneSets($.indexRef(onePassRunes!, $.pointerValue<onePassInst>(inst).Inst.Out), $.indexRef(onePassRunes!, $.pointerValue<onePassInst>(inst).Inst.Arg), $.pointerValue<onePassInst>(inst).Inst.Out, $.pointerValue<onePassInst>(inst).Inst.Arg)
				onePassRunes![pc] = __goscriptTuple0[0]
				$.pointerValue<onePassInst>(inst).Next = __goscriptTuple0[1]
				if (($.len($.pointerValue<onePassInst>(inst).Next) > 0) && ($.pointerValue<onePassInst>(inst).Next![0] == mergeFailed)) {
					ok = false
					break
				}
				break
			}
			case syntax.InstCapture:
			case syntax.InstNop:
			{
				ok = await check!($.pointerValue<onePassInst>(inst).Inst.Out, m)
				m![pc] = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				// pass matching runes back through these no-ops.
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(onePassRunes![$.pointerValue<onePassInst>(inst).Inst.Out] ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let i = 0; i < $.len($.pointerValue<onePassInst>(inst).Next); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.pointerValue<onePassInst>(inst).Inst.Out
				}
				break
			}
			case syntax.InstEmptyWidth:
			{
				ok = await check!($.pointerValue<onePassInst>(inst).Inst.Out, m)
				m![pc] = m![$.pointerValue<onePassInst>(inst).Inst.Out]
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(onePassRunes![$.pointerValue<onePassInst>(inst).Inst.Out] ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let i = 0; i < $.len($.pointerValue<onePassInst>(inst).Next); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.pointerValue<onePassInst>(inst).Inst.Out
				}
				break
			}
			case syntax.InstMatch:
			case syntax.InstFail:
			{
				m![pc] = $.pointerValue<onePassInst>(inst).Inst.Op == syntax.InstMatch
				break
			}
			case syntax.InstRune:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.pointerValue<onePassInst>(inst).Inst.Out)
				if ($.len($.pointerValue<onePassInst>(inst).Inst.Rune) == 0) {
					onePassRunes![pc] = $.arrayToSlice<number>([])
					$.pointerValue<onePassInst>(inst).Next = $.arrayToSlice<number>([$.pointerValue<onePassInst>(inst).Inst.Out])
					break
				}
				let runes = $.makeSlice<number>(0, undefined, "number")
				if (($.len($.pointerValue<onePassInst>(inst).Inst.Rune) == 1) && (($.pointerValue<onePassInst>(inst).Inst.Arg & syntax.FoldCase) != 0)) {
					let r0 = $.pointerValue<onePassInst>(inst).Inst.Rune![0]
					runes = $.append(runes, r0, r0)
					for (let r1 = unicode.SimpleFold(r0); r1 != r0; r1 = unicode.SimpleFold(r1)) {
						runes = $.append(runes, r1, r1)
					}
					slices.Sort(runes)
				} else {
					runes = $.append(runes, ...($.pointerValue<onePassInst>(inst).Inst.Rune ?? []))
				}
				onePassRunes![pc] = runes
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let i = 0; i < $.len($.pointerValue<onePassInst>(inst).Next); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.pointerValue<onePassInst>(inst).Inst.Out
				}
				$.pointerValue<onePassInst>(inst).Inst.Op = syntax.InstRune
				break
			}
			case syntax.InstRune1:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.pointerValue<onePassInst>(inst).Inst.Out)
				let runes = $.arrayToSlice<number>([])
				// expand case-folded runes
				if (($.pointerValue<onePassInst>(inst).Inst.Arg & syntax.FoldCase) != 0) {
					let r0 = $.pointerValue<onePassInst>(inst).Inst.Rune![0]
					runes = $.append(runes, r0, r0)
					for (let r1 = unicode.SimpleFold(r0); r1 != r0; r1 = unicode.SimpleFold(r1)) {
						runes = $.append(runes, r1, r1)
					}
					slices.Sort(runes)
				} else {
					runes = $.append(runes, $.pointerValue<onePassInst>(inst).Inst.Rune![0], $.pointerValue<onePassInst>(inst).Inst.Rune![0])
				}
				onePassRunes![pc] = runes
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let i = 0; i < $.len($.pointerValue<onePassInst>(inst).Next); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.pointerValue<onePassInst>(inst).Inst.Out
				}
				$.pointerValue<onePassInst>(inst).Inst.Op = syntax.InstRune
				break
			}
			case syntax.InstRuneAny:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.pointerValue<onePassInst>(inst).Inst.Out)
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(anyRune ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.arrayToSlice<number>([$.pointerValue<onePassInst>(inst).Inst.Out])
				break
			}
			case syntax.InstRuneAnyNotNL:
			{
				m![pc] = false
				if ($.len($.pointerValue<onePassInst>(inst).Next) > 0) {
					break
				}
				queueOnePass.prototype.insert.call(instQueue, $.pointerValue<onePassInst>(inst).Inst.Out)
				onePassRunes![pc] = $.append($.arrayToSlice<number>([]), ...(anyRuneNotNL ?? []))
				$.pointerValue<onePassInst>(inst).Next = $.makeSlice<number>((Math.trunc($.len(onePassRunes![pc]) / 2)) + 1, undefined, "number")
				for (let i = 0; i < $.len($.pointerValue<onePassInst>(inst).Next); i++) {
					$.pointerValue<onePassInst>(inst).Next![i] = $.pointerValue<onePassInst>(inst).Inst.Out
				}
				break
			}
		}
		return ok
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "bool" } }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })

	$.pointerValue<queueOnePass>(instQueue).clear()
	queueOnePass.prototype.insert.call(instQueue, $.uint($.pointerValue<onePassProg>(p).Start, 32))
	let m = $.makeSlice<boolean>($.len($.pointerValue<onePassProg>(p).Inst))
	while (!$.pointerValue<queueOnePass>(instQueue).empty()) {
		$.pointerValue<queueOnePass>(visitQueue).clear()
		let pc = $.pointerValue<queueOnePass>(instQueue).next()
		if (!await check!(pc, m)) {
			p = null
			break
		}
	}
	if (p != null) {
		for (let i = 0; i < $.len($.pointerValue<onePassProg>(p).Inst); i++) {
			$.pointerValue<onePassProg>(p).Inst![i].Inst.Rune = onePassRunes![i]
		}
	}
	return p
}

export async function compileOnePass(prog: syntax.Prog | $.VarRef<syntax.Prog> | null): globalThis.Promise<onePassProg | $.VarRef<onePassProg> | null> {
	let p: onePassProg | $.VarRef<onePassProg> | null = null
	if ($.pointerValue<syntax.Prog>(prog).Start == 0) {
		return null
	}
	// onepass regexp is anchored
	if (($.pointerValue<syntax.Prog>(prog).Inst![$.pointerValue<syntax.Prog>(prog).Start].Op != syntax.InstEmptyWidth) || (($.pointerValue<syntax.Prog>(prog).Inst![$.pointerValue<syntax.Prog>(prog).Start].Arg & syntax.EmptyBeginText) != syntax.EmptyBeginText)) {
		return null
	}
	let hasAlt = false
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<syntax.Prog>(prog).Inst); __rangeIndex++) {
		let inst = $.pointerValue<syntax.Prog>(prog).Inst![__rangeIndex]
		if ((inst.Op == syntax.InstAlt) || (inst.Op == syntax.InstAltMatch)) {
			hasAlt = true
			break
		}
	}
	// If we have alternates, every instruction leading to InstMatch must be EmptyEndText.
	// Also, any match on empty text must be $.
	for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<syntax.Prog>(prog).Inst); __rangeIndex++) {
		let inst = $.pointerValue<syntax.Prog>(prog).Inst![__rangeIndex]
		let opOut = $.pointerValue<syntax.Prog>(prog).Inst![inst.Out].Op
		switch (inst.Op) {
			default:
			{
				if ((opOut == syntax.InstMatch) && hasAlt) {
					return null
				}
				break
			}
			case syntax.InstAlt:
			case syntax.InstAltMatch:
			{
				if ((opOut == syntax.InstMatch) || ($.pointerValue<syntax.Prog>(prog).Inst![inst.Arg].Op == syntax.InstMatch)) {
					return null
				}
				break
			}
			case syntax.InstEmptyWidth:
			{
				if (opOut == syntax.InstMatch) {
					if ((inst.Arg & syntax.EmptyEndText) == syntax.EmptyEndText) {
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
