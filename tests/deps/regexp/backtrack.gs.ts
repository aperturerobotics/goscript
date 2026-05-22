// Generated file based on backtrack.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syntax from "@goscript/regexp/syntax/index.js"

import * as sync from "@goscript/sync/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_exec from "./exec.gs.ts"

import * as __goscript_onepass from "./onepass.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"

export class job {
	public get pc(): number {
		return this._fields.pc.value
	}
	public set pc(value: number) {
		this._fields.pc.value = value
	}

	public get arg(): boolean {
		return this._fields.arg.value
	}
	public set arg(value: boolean) {
		this._fields.arg.value = value
	}

	public get pos(): number {
		return this._fields.pos.value
	}
	public set pos(value: number) {
		this._fields.pos.value = value
	}

	public _fields: {
		pc: $.VarRef<number>
		arg: $.VarRef<boolean>
		pos: $.VarRef<number>
	}

	constructor(init?: Partial<{pc?: number, arg?: boolean, pos?: number}>) {
		this._fields = {
			pc: $.varRef(init?.pc ?? 0),
			arg: $.varRef(init?.arg ?? false),
			pos: $.varRef(init?.pos ?? 0)
		}
	}

	public clone(): job {
		const cloned = new job()
		cloned._fields = {
			pc: $.varRef(this._fields.pc.value),
			arg: $.varRef(this._fields.arg.value),
			pos: $.varRef(this._fields.pos.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.job",
		() => new job(),
		[],
		job,
		{"pc": { kind: $.TypeKind.Basic, name: "int" }, "arg": { kind: $.TypeKind.Basic, name: "bool" }, "pos": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class bitState {
	public get end(): number {
		return this._fields.end.value
	}
	public set end(value: number) {
		this._fields.end.value = value
	}

	public get cap(): $.Slice<number> {
		return this._fields.cap.value
	}
	public set cap(value: $.Slice<number>) {
		this._fields.cap.value = value
	}

	public get matchcap(): $.Slice<number> {
		return this._fields.matchcap.value
	}
	public set matchcap(value: $.Slice<number>) {
		this._fields.matchcap.value = value
	}

	public get jobs(): $.Slice<job> {
		return this._fields.jobs.value
	}
	public set jobs(value: $.Slice<job>) {
		this._fields.jobs.value = value
	}

	public get visited(): $.Slice<number> {
		return this._fields.visited.value
	}
	public set visited(value: $.Slice<number>) {
		this._fields.visited.value = value
	}

	public get inputs(): __goscript_exec.inputs {
		return this._fields.inputs.value
	}
	public set inputs(value: __goscript_exec.inputs) {
		this._fields.inputs.value = value
	}

	public _fields: {
		end: $.VarRef<number>
		cap: $.VarRef<$.Slice<number>>
		matchcap: $.VarRef<$.Slice<number>>
		jobs: $.VarRef<$.Slice<job>>
		visited: $.VarRef<$.Slice<number>>
		inputs: $.VarRef<__goscript_exec.inputs>
	}

	constructor(init?: Partial<{end?: number, cap?: $.Slice<number>, matchcap?: $.Slice<number>, jobs?: $.Slice<job>, visited?: $.Slice<number>, inputs?: __goscript_exec.inputs}>) {
		this._fields = {
			end: $.varRef(init?.end ?? 0),
			cap: $.varRef(init?.cap ?? null),
			matchcap: $.varRef(init?.matchcap ?? null),
			jobs: $.varRef(init?.jobs ?? null),
			visited: $.varRef(init?.visited ?? null),
			inputs: $.varRef(init?.inputs ? $.markAsStructValue(init.inputs.clone()) : $.markAsStructValue(new __goscript_exec.inputs()))
		}
	}

	public clone(): bitState {
		const cloned = new bitState()
		cloned._fields = {
			end: $.varRef(this._fields.end.value),
			cap: $.varRef(this._fields.cap.value),
			matchcap: $.varRef(this._fields.matchcap.value),
			jobs: $.varRef(this._fields.jobs.value),
			visited: $.varRef(this._fields.visited.value),
			inputs: $.varRef($.markAsStructValue(this._fields.inputs.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	public push(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, pc: number, pos: number, arg: boolean): void {
		let b: bitState | $.VarRef<bitState> | null = this
		// Only check shouldVisit when arg is false.
		// When arg is true, we are continuing a previous visit.
		if (($.uint($.pointerValue<syntax.Prog>($.pointerValue<__goscript_regexp.Regexp>(re).prog).Inst![pc].Op, 8) != $.uint(syntax.InstFail, 8)) && (arg || $.pointerValue<bitState>(b).shouldVisit($.uint(pc, 32), pos))) {
			$.pointerValue<bitState>(b).jobs = $.append($.pointerValue<bitState>(b).jobs, $.markAsStructValue(new job({pc: $.uint(pc, 32), arg: arg, pos: pos})))
		}
	}

	public reset(prog: syntax.Prog | $.VarRef<syntax.Prog> | null, end: number, ncap: number): void {
		let b: bitState | $.VarRef<bitState> | null = this
		$.pointerValue<bitState>(b).end = end

		if ($.cap($.pointerValue<bitState>(b).jobs) == 0) {
			$.pointerValue<bitState>(b).jobs = $.makeSlice<job>(0, 256, undefined, () => $.markAsStructValue(new job()))
		} else {
			$.pointerValue<bitState>(b).jobs = $.goSlice($.pointerValue<bitState>(b).jobs, undefined, 0)
		}

		let visitedSize = Math.trunc(((($.len($.pointerValue<syntax.Prog>(prog).Inst) * (end + 1)) + visitedBits) - 1) / visitedBits)
		if ($.cap($.pointerValue<bitState>(b).visited) < visitedSize) {
			$.pointerValue<bitState>(b).visited = $.makeSlice<number>(visitedSize, Math.trunc(maxBacktrackVector / visitedBits), "number")
		} else {
			$.pointerValue<bitState>(b).visited = $.goSlice($.pointerValue<bitState>(b).visited, undefined, visitedSize)
			$.clear($.pointerValue<bitState>(b).visited)
		}

		if ($.cap($.pointerValue<bitState>(b).cap) < ncap) {
			$.pointerValue<bitState>(b).cap = $.makeSlice<number>(ncap, undefined, "number")
		} else {
			$.pointerValue<bitState>(b).cap = $.goSlice($.pointerValue<bitState>(b).cap, undefined, ncap)
		}
		for (let __goscriptRangeTarget0 = $.pointerValue<bitState>(b).cap, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			$.pointerValue<bitState>(b).cap![i] = -1
		}

		if ($.cap($.pointerValue<bitState>(b).matchcap) < ncap) {
			$.pointerValue<bitState>(b).matchcap = $.makeSlice<number>(ncap, undefined, "number")
		} else {
			$.pointerValue<bitState>(b).matchcap = $.goSlice($.pointerValue<bitState>(b).matchcap, undefined, ncap)
		}
		for (let __goscriptRangeTarget1 = $.pointerValue<bitState>(b).matchcap, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			$.pointerValue<bitState>(b).matchcap![i] = -1
		}
	}

	public shouldVisit(pc: number, pos: number): boolean {
		let b: bitState | $.VarRef<bitState> | null = this
		let n = $.uint(($.int(pc) * ($.pointerValue<bitState>(b).end + 1)) + pos, 64)
		if ($.uint(($.pointerValue<bitState>(b).visited![Math.trunc(n / visitedBits)] & (1 << (n & (visitedBits - 1)))), 32) != $.uint(0, 32)) {
			return false
		}
		$.pointerValue<bitState>(b).visited![Math.trunc(n / visitedBits)] |= $.uint(1 << (n & (visitedBits - 1)), 32)
		return true
	}

	static __typeInfo = $.registerStructType(
		"regexp.bitState",
		() => new bitState(),
		[{ name: "push", args: [], returns: [] }, { name: "reset", args: [], returns: [] }, { name: "shouldVisit", args: [], returns: [] }],
		bitState,
		{"end": { kind: $.TypeKind.Basic, name: "int" }, "cap": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "matchcap": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "jobs": { kind: $.TypeKind.Slice, elemType: "regexp.job" }, "visited": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "inputs": "regexp.inputs"}
	)
}

export const visitedBits: number = 32

export const maxBacktrackProg: number = 500

export const maxBacktrackVector: number = 262144

export let bitStatePool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool()))

export function __goscript_set_bitStatePool(value: sync.Pool): void {
	bitStatePool.value = value
}

export function newBitState(): bitState | $.VarRef<bitState> | null {
	let __goscriptTuple0 = $.typeAssertTuple<bitState | $.VarRef<bitState> | null>(bitStatePool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "regexp.bitState" })
	let b: bitState | $.VarRef<bitState> | null = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (!ok) {
		b = new bitState()
	}
	return b
}

export function freeBitState(b: bitState | $.VarRef<bitState> | null): void {
	$.pointerValue<bitState>(b).inputs.clear()
	bitStatePool.value.Put($.interfaceValue<any>(b, "*regexp.bitState"))
}

export function maxBitStateLen(prog: syntax.Prog | $.VarRef<syntax.Prog> | null): number {
	if (!shouldBacktrack(prog)) {
		return 0
	}
	return Math.trunc(maxBacktrackVector / $.len($.pointerValue<syntax.Prog>(prog).Inst))
}

export function shouldBacktrack(prog: syntax.Prog | $.VarRef<syntax.Prog> | null): boolean {
	return $.len($.pointerValue<syntax.Prog>(prog).Inst) <= maxBacktrackProg
}
