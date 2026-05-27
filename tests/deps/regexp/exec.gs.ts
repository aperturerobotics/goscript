// Generated file based on exec.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as syntax from "@goscript/regexp/syntax/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_backtrack from "./backtrack.gs.ts"

import * as __goscript_onepass from "./onepass.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"
import "@goscript/io/index.js"
import "@goscript/regexp/syntax/index.js"
import "@goscript/sync/index.js"
import "./backtrack.gs.ts"
import "./onepass.gs.ts"
import "./regexp.gs.ts"

export class queue {
	public get sparse(): $.Slice<number> {
		return this._fields.sparse.value
	}
	public set sparse(value: $.Slice<number>) {
		this._fields.sparse.value = value
	}

	public get dense(): $.Slice<entry> {
		return this._fields.dense.value
	}
	public set dense(value: $.Slice<entry>) {
		this._fields.dense.value = value
	}

	public _fields: {
		sparse: $.VarRef<$.Slice<number>>
		dense: $.VarRef<$.Slice<entry>>
	}

	constructor(init?: Partial<{sparse?: $.Slice<number>, dense?: $.Slice<entry>}>) {
		this._fields = {
			sparse: $.varRef(init?.sparse ?? null),
			dense: $.varRef(init?.dense ?? null)
		}
	}

	public clone(): queue {
		const cloned = new queue()
		cloned._fields = {
			sparse: $.varRef(this._fields.sparse.value),
			dense: $.varRef(this._fields.dense.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.queue",
		() => new queue(),
		[],
		queue,
		{"sparse": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "dense": { kind: $.TypeKind.Slice, elemType: "regexp.entry" }}
	)
}

export class entry {
	public get pc(): number {
		return this._fields.pc.value
	}
	public set pc(value: number) {
		this._fields.pc.value = value
	}

	public get t(): thread | $.VarRef<thread> | null {
		return this._fields.t.value
	}
	public set t(value: thread | $.VarRef<thread> | null) {
		this._fields.t.value = value
	}

	public _fields: {
		pc: $.VarRef<number>
		t: $.VarRef<thread | $.VarRef<thread> | null>
	}

	constructor(init?: Partial<{pc?: number, t?: thread | $.VarRef<thread> | null}>) {
		this._fields = {
			pc: $.varRef(init?.pc ?? 0),
			t: $.varRef(init?.t ?? null)
		}
	}

	public clone(): entry {
		const cloned = new entry()
		cloned._fields = {
			pc: $.varRef(this._fields.pc.value),
			t: $.varRef(this._fields.t.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.entry",
		() => new entry(),
		[],
		entry,
		{"pc": { kind: $.TypeKind.Basic, name: "int" }, "t": { kind: $.TypeKind.Pointer, elemType: "regexp.thread" }}
	)
}

export class thread {
	public get inst(): syntax.Inst | $.VarRef<syntax.Inst> | null {
		return this._fields.inst.value
	}
	public set inst(value: syntax.Inst | $.VarRef<syntax.Inst> | null) {
		this._fields.inst.value = value
	}

	public get cap(): $.Slice<number> {
		return this._fields.cap.value
	}
	public set cap(value: $.Slice<number>) {
		this._fields.cap.value = value
	}

	public _fields: {
		inst: $.VarRef<syntax.Inst | $.VarRef<syntax.Inst> | null>
		cap: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{inst?: syntax.Inst | $.VarRef<syntax.Inst> | null, cap?: $.Slice<number>}>) {
		this._fields = {
			inst: $.varRef(init?.inst ?? null),
			cap: $.varRef(init?.cap ?? null)
		}
	}

	public clone(): thread {
		const cloned = new thread()
		cloned._fields = {
			inst: $.varRef(this._fields.inst.value),
			cap: $.varRef(this._fields.cap.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.thread",
		() => new thread(),
		[],
		thread,
		{"inst": { kind: $.TypeKind.Pointer, elemType: "syntax.Inst" }, "cap": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class inputs {
	// cached inputs, to avoid allocation
	public get bytes(): __goscript_regexp.inputBytes {
		return this._fields.bytes.value
	}
	public set bytes(value: __goscript_regexp.inputBytes) {
		this._fields.bytes.value = value
	}

	public get _string(): __goscript_regexp.inputString {
		return this._fields._string.value
	}
	public set _string(value: __goscript_regexp.inputString) {
		this._fields._string.value = value
	}

	public get reader(): __goscript_regexp.inputReader {
		return this._fields.reader.value
	}
	public set reader(value: __goscript_regexp.inputReader) {
		this._fields.reader.value = value
	}

	public _fields: {
		bytes: $.VarRef<__goscript_regexp.inputBytes>
		_string: $.VarRef<__goscript_regexp.inputString>
		reader: $.VarRef<__goscript_regexp.inputReader>
	}

	constructor(init?: Partial<{bytes?: __goscript_regexp.inputBytes, _string?: __goscript_regexp.inputString, reader?: __goscript_regexp.inputReader}>) {
		this._fields = {
			bytes: $.varRef(init?.bytes ? $.markAsStructValue($.cloneStructValue(init.bytes)) : $.markAsStructValue(new __goscript_regexp.inputBytes())),
			_string: $.varRef(init?._string ? $.markAsStructValue($.cloneStructValue(init._string)) : $.markAsStructValue(new __goscript_regexp.inputString())),
			reader: $.varRef(init?.reader ? $.markAsStructValue($.cloneStructValue(init.reader)) : $.markAsStructValue(new __goscript_regexp.inputReader()))
		}
	}

	public clone(): inputs {
		const cloned = new inputs()
		cloned._fields = {
			bytes: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bytes.value))),
			_string: $.varRef($.markAsStructValue($.cloneStructValue(this._fields._string.value))),
			reader: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.reader.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public clear(): void {
		let i: inputs | $.VarRef<inputs> | null = this
		// We need to clear 1 of these.
		// Avoid the expense of clearing the others (pointer write barrier).
		if ($.pointerValue<inputs>(i).bytes.str != null) {
			$.pointerValue<inputs>(i).bytes.str = null
		} else {
			if ($.pointerValue<inputs>(i).reader.r != null) {
				$.pointerValue<inputs>(i).reader.r = null
			} else {
				$.pointerValue<inputs>(i)._string.str = ""
			}
		}
	}

	public init(r: io.RuneReader | null, b: $.Slice<number>, s: string): [__goscript_regexp.input | null, number] {
		const i: inputs | $.VarRef<inputs> | null = this
		if (r != null) {
			return [inputs.prototype.newReader.call(i, r), 0]
		}
		if (b != null) {
			return [inputs.prototype.newBytes.call(i, b), $.len(b)]
		}
		return [inputs.prototype.newString.call(i, s), $.len(s)]
	}

	public newBytes(b: $.Slice<number>): __goscript_regexp.input | null {
		let i: inputs | $.VarRef<inputs> | null = this
		$.pointerValue<inputs>(i).bytes.str = b
		return $.interfaceValue<__goscript_regexp.input | null>($.pointerValue<inputs>(i)._fields.bytes, "*regexp.inputBytes")
	}

	public newReader(r: io.RuneReader | null): __goscript_regexp.input | null {
		let i: inputs | $.VarRef<inputs> | null = this
		$.pointerValue<inputs>(i).reader.r = r
		$.pointerValue<inputs>(i).reader.atEOT = false
		$.pointerValue<inputs>(i).reader.pos = 0
		return $.interfaceValue<__goscript_regexp.input | null>($.pointerValue<inputs>(i)._fields.reader, "*regexp.inputReader")
	}

	public newString(s: string): __goscript_regexp.input | null {
		let i: inputs | $.VarRef<inputs> | null = this
		$.pointerValue<inputs>(i)._string.str = s
		return $.interfaceValue<__goscript_regexp.input | null>($.pointerValue<inputs>(i)._fields._string, "*regexp.inputString")
	}

	static __typeInfo = $.registerStructType(
		"regexp.inputs",
		() => new inputs(),
		[{ name: "clear", args: [], returns: [] }, { name: "init", args: [], returns: [] }, { name: "newBytes", args: [], returns: [] }, { name: "newReader", args: [], returns: [] }, { name: "newString", args: [], returns: [] }],
		inputs,
		{"bytes": "regexp.inputBytes", "_string": { type: "regexp.inputString", name: "string" }, "reader": "regexp.inputReader"}
	)
}

export class machine {
	public get re(): __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null {
		return this._fields.re.value
	}
	public set re(value: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null) {
		this._fields.re.value = value
	}

	public get p(): syntax.Prog | $.VarRef<syntax.Prog> | null {
		return this._fields.p.value
	}
	public set p(value: syntax.Prog | $.VarRef<syntax.Prog> | null) {
		this._fields.p.value = value
	}

	public get q0(): queue {
		return this._fields.q0.value
	}
	public set q0(value: queue) {
		this._fields.q0.value = value
	}

	public get q1(): queue {
		return this._fields.q1.value
	}
	public set q1(value: queue) {
		this._fields.q1.value = value
	}

	public get pool(): $.Slice<thread | $.VarRef<thread> | null> {
		return this._fields.pool.value
	}
	public set pool(value: $.Slice<thread | $.VarRef<thread> | null>) {
		this._fields.pool.value = value
	}

	public get matched(): boolean {
		return this._fields.matched.value
	}
	public set matched(value: boolean) {
		this._fields.matched.value = value
	}

	public get matchcap(): $.Slice<number> {
		return this._fields.matchcap.value
	}
	public set matchcap(value: $.Slice<number>) {
		this._fields.matchcap.value = value
	}

	public get inputs(): inputs {
		return this._fields.inputs.value
	}
	public set inputs(value: inputs) {
		this._fields.inputs.value = value
	}

	public _fields: {
		re: $.VarRef<__goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null>
		p: $.VarRef<syntax.Prog | $.VarRef<syntax.Prog> | null>
		q0: $.VarRef<queue>
		q1: $.VarRef<queue>
		pool: $.VarRef<$.Slice<thread | $.VarRef<thread> | null>>
		matched: $.VarRef<boolean>
		matchcap: $.VarRef<$.Slice<number>>
		inputs: $.VarRef<inputs>
	}

	constructor(init?: Partial<{re?: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null, p?: syntax.Prog | $.VarRef<syntax.Prog> | null, q0?: queue, q1?: queue, pool?: $.Slice<thread | $.VarRef<thread> | null>, matched?: boolean, matchcap?: $.Slice<number>, inputs?: inputs}>) {
		this._fields = {
			re: $.varRef(init?.re ?? null),
			p: $.varRef(init?.p ?? null),
			q0: $.varRef(init?.q0 ? $.markAsStructValue($.cloneStructValue(init.q0)) : $.markAsStructValue(new queue())),
			q1: $.varRef(init?.q1 ? $.markAsStructValue($.cloneStructValue(init.q1)) : $.markAsStructValue(new queue())),
			pool: $.varRef(init?.pool ?? null),
			matched: $.varRef(init?.matched ?? false),
			matchcap: $.varRef(init?.matchcap ?? null),
			inputs: $.varRef(init?.inputs ? $.markAsStructValue($.cloneStructValue(init.inputs)) : $.markAsStructValue(new inputs()))
		}
	}

	public clone(): machine {
		const cloned = new machine()
		cloned._fields = {
			re: $.varRef(this._fields.re.value),
			p: $.varRef(this._fields.p.value),
			q0: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.q0.value))),
			q1: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.q1.value))),
			pool: $.varRef(this._fields.pool.value),
			matched: $.varRef(this._fields.matched.value),
			matchcap: $.varRef(this._fields.matchcap.value),
			inputs: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.inputs.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public add(q: queue | $.VarRef<queue> | null, pc: number, pos: number, cap: $.Slice<number>, cond: $.VarRef<lazyFlag> | null, t: thread | $.VarRef<thread> | null): thread | $.VarRef<thread> | null {
		const m: machine | $.VarRef<machine> | null = this
		Again: while (true) {
			if ($.uint(pc, 32) == $.uint(0, 32)) {
				return t
			}

			{
				let j = $.uint($.pointerValue<queue>(q).sparse![pc], 32)
				if ((j < $.uint($.len($.pointerValue<queue>(q).dense), 32)) && ($.uint($.pointerValue<queue>(q).dense![j].pc, 32) == $.uint(pc, 32))) {
					return t
				}
			}

			let j = $.len($.pointerValue<queue>(q).dense)
			$.pointerValue<queue>(q).dense = $.goSlice($.pointerValue<queue>(q).dense, undefined, j + 1)
			let d: entry | $.VarRef<entry> | null = $.indexRef($.pointerValue<queue>(q).dense!, j)
			$.pointerValue<entry>(d).t = null
			$.pointerValue<entry>(d).pc = $.uint(pc, 32)
			$.pointerValue<queue>(q).sparse![pc] = $.uint($.uint(j, 32), 32)

			let i: syntax.Inst | $.VarRef<syntax.Inst> | null = $.indexRef($.pointerValue<syntax.Prog>($.pointerValue<machine>(m).p).Inst!, pc)
			switch ($.pointerValue<syntax.Inst>(i).Op) {
				default:
				{
					$.panic("unhandled")
					break
				}
				case syntax.InstFail:
				{
					break
				}
				case syntax.InstAlt:
				case syntax.InstAltMatch:
				{
					t = machine.prototype.add.call(m, q, $.uint($.pointerValue<syntax.Inst>(i).Out, 32), pos, cap, cond, t)
					pc = $.uint($.pointerValue<syntax.Inst>(i).Arg, 32)
					continue Again
					break
				}
				case syntax.InstEmptyWidth:
				{
					if (lazyFlag_match($.pointerValue<lazyFlag>(cond), $.uint($.pointerValue<syntax.Inst>(i).Arg, 8))) {
						pc = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
						continue Again
					}
					break
				}
				case syntax.InstNop:
				{
					pc = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
					continue Again
					break
				}
				case syntax.InstCapture:
				{
					if ($.int($.pointerValue<syntax.Inst>(i).Arg) < $.len(cap)) {
						let opos = cap![$.pointerValue<syntax.Inst>(i).Arg]
						cap![$.pointerValue<syntax.Inst>(i).Arg] = pos
						machine.prototype.add.call(m, q, $.uint($.pointerValue<syntax.Inst>(i).Out, 32), pos, cap, cond, null)
						cap![$.pointerValue<syntax.Inst>(i).Arg] = opos
					} else {
						pc = $.uint($.pointerValue<syntax.Inst>(i).Out, 32)
						continue Again
					}
					break
				}
				case syntax.InstMatch:
				case syntax.InstRune:
				case syntax.InstRune1:
				case syntax.InstRuneAny:
				case syntax.InstRuneAnyNotNL:
				{
					if (t == null) {
						t = machine.prototype.alloc.call(m, i)
					} else {
						$.pointerValue<thread>(t).inst = i
					}
					if (($.len(cap) > 0) && ($.indexAddress($.pointerValue<thread>(t).cap!, 0) != $.indexAddress(cap!, 0))) {
						$.copy($.pointerValue<thread>(t).cap, cap)
					}
					$.pointerValue<entry>(d).t = t
					t = null
					break
				}
			}
			return t
			break
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public alloc(i: syntax.Inst | $.VarRef<syntax.Inst> | null): thread | $.VarRef<thread> | null {
		let m: machine | $.VarRef<machine> | null = this
		let t: thread | $.VarRef<thread> | null = null as thread | $.VarRef<thread> | null
		{
			let n = $.len($.pointerValue<machine>(m).pool)
			if (n > 0) {
				t = $.pointerValue<machine>(m).pool![n - 1]
				$.pointerValue<machine>(m).pool = $.goSlice($.pointerValue<machine>(m).pool, undefined, n - 1)
			} else {
				t = new thread()
				$.pointerValue<thread>(t).cap = $.makeSlice<number>($.len($.pointerValue<machine>(m).matchcap), $.cap($.pointerValue<machine>(m).matchcap), "number")
			}
		}
		$.pointerValue<thread>(t).inst = i
		return t
	}

	public clear(q: queue | $.VarRef<queue> | null): void {
		let m: machine | $.VarRef<machine> | null = this
		for (let __goscriptRangeTarget0 = $.pointerValue<queue>(q).dense, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let d = __goscriptRangeTarget0![__rangeIndex]
			if (d.t != null) {
				$.pointerValue<machine>(m).pool = $.append($.pointerValue<machine>(m).pool, d.t)
			}
		}
		$.pointerValue<queue>(q).dense = $.goSlice($.pointerValue<queue>(q).dense, undefined, 0)
	}

	public init(ncap: number): void {
		let m: machine | $.VarRef<machine> | null = this
		for (let __goscriptRangeTarget1 = $.pointerValue<machine>(m).pool, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let t = __goscriptRangeTarget1![__rangeIndex]
			$.pointerValue<thread>(t).cap = $.goSlice($.pointerValue<thread>(t).cap, undefined, ncap)
		}
		$.pointerValue<machine>(m).matchcap = $.goSlice($.pointerValue<machine>(m).matchcap, undefined, ncap)
	}

	public match(i: __goscript_regexp.input | null, pos: number): boolean {
		let m: machine | $.VarRef<machine> | null = this
		let startCond = $.uint($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<machine>(m).re).cond, 8)
		if ($.uint(startCond, 8) == $.uint(~0, 8)) {
			return false
		}
		$.pointerValue<machine>(m).matched = false
		for (let __goscriptRangeTarget2 = $.pointerValue<machine>(m).matchcap, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			$.pointerValue<machine>(m).matchcap![i] = -1
		}
		let runq: queue | $.VarRef<queue> | null = $.pointerValue<machine>(m)._fields.q0
		let nextq: queue | $.VarRef<queue> | null = $.pointerValue<machine>(m)._fields.q1
		let r = $.int(-1, 32)
		let r1 = $.int(-1, 32)
		let width = 0
		let width1 = 0
		let __goscriptTuple0: any = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).step(pos)
		r = $.int(__goscriptTuple0[0], 32)
		width = __goscriptTuple0[1]
		if ($.int(r, 32) != $.int(-1, 32)) {
			let __goscriptTuple1: any = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).step(pos + width)
			r1 = $.int(__goscriptTuple1[0], 32)
			width1 = __goscriptTuple1[1]
		}
		let flag: $.VarRef<lazyFlag> = $.varRef(0)
		if (pos == 0) {
			flag.value = newLazyFlag($.int(-1, 32), $.int(r, 32))
		} else {
			flag.value = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).context(pos)
		}
		while (true) {
			if ($.len($.pointerValue<queue>(runq).dense) == 0) {
				if (($.uint((startCond & syntax.EmptyBeginText), 8) != $.uint(0, 8)) && (pos != 0)) {
					// Anchored match, past beginning of text.
					break
				}
				if ($.pointerValue<machine>(m).matched) {
					// Have match; finished exploring alternatives.
					break
				}
				if ((($.len($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<machine>(m).re).prefix) > 0) && ($.int(r1, 32) != $.int($.pointerValue<__goscript_regexp.Regexp>($.pointerValue<machine>(m).re).prefixRune, 32))) && $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).canCheckPrefix()) {
					// Match requires literal prefix; fast search for it.
					let advance = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).index($.pointerValue<machine>(m).re, pos)
					if (advance < 0) {
						break
					}
					pos += advance
					let __goscriptTuple2: any = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).step(pos)
					r = $.int(__goscriptTuple2[0], 32)
					width = __goscriptTuple2[1]
					let __goscriptTuple3: any = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).step(pos + width)
					r1 = $.int(__goscriptTuple3[0], 32)
					width1 = __goscriptTuple3[1]
				}
			}
			if (!$.pointerValue<machine>(m).matched) {
				if ($.len($.pointerValue<machine>(m).matchcap) > 0) {
					$.pointerValue<machine>(m).matchcap![0] = pos
				}
				machine.prototype.add.call(m, runq, $.uint($.uint($.pointerValue<syntax.Prog>($.pointerValue<machine>(m).p).Start, 32), 32), pos, $.pointerValue<machine>(m).matchcap, flag, null)
			}
			flag.value = newLazyFlag($.int(r, 32), $.int(r1, 32))
			machine.prototype.step.call(m, runq, nextq, pos, pos + width, $.int(r, 32), flag)
			if (width == 0) {
				break
			}
			if (($.len($.pointerValue<machine>(m).matchcap) == 0) && $.pointerValue<machine>(m).matched) {
				// Found a match and not paying attention
				// to where it is, so any match will do.
				break
			}
			pos += width
			let __goscriptAssign0_0: number = $.int(r1, 32)
			let __goscriptAssign0_1: number = width1
			r = __goscriptAssign0_0
			width = __goscriptAssign0_1
			if ($.int(r, 32) != $.int(-1, 32)) {
				let __goscriptTuple4: any = $.pointerValue<Exclude<__goscript_regexp.input, null>>(i).step(pos + width)
				r1 = $.int(__goscriptTuple4[0], 32)
				width1 = __goscriptTuple4[1]
			}
			let __goscriptAssign1_0: queue | $.VarRef<queue> | null = nextq
			let __goscriptAssign1_1: queue | $.VarRef<queue> | null = runq
			runq = __goscriptAssign1_0
			nextq = __goscriptAssign1_1
		}
		machine.prototype.clear.call(m, nextq)
		return $.pointerValue<machine>(m).matched
	}

	public step(runq: queue | $.VarRef<queue> | null, nextq: queue | $.VarRef<queue> | null, pos: number, nextPos: number, c: number, nextCond: $.VarRef<lazyFlag> | null): void {
		let m: machine | $.VarRef<machine> | null = this
		let longest = $.pointerValue<__goscript_regexp.Regexp>($.pointerValue<machine>(m).re).longest
		for (let j = 0; j < $.len($.pointerValue<queue>(runq).dense); j++) {
			let d: entry | $.VarRef<entry> | null = $.indexRef($.pointerValue<queue>(runq).dense!, j)
			let t: thread | $.VarRef<thread> | null = $.pointerValue<entry>(d).t
			if (t == null) {
				continue
			}
			if (((longest && $.pointerValue<machine>(m).matched) && ($.len($.pointerValue<thread>(t).cap) > 0)) && ($.pointerValue<machine>(m).matchcap![0] < $.pointerValue<thread>(t).cap![0])) {
				$.pointerValue<machine>(m).pool = $.append($.pointerValue<machine>(m).pool, t)
				continue
			}
			let i: syntax.Inst | $.VarRef<syntax.Inst> | null = $.pointerValue<thread>(t).inst
			let add = false
			switch ($.pointerValue<syntax.Inst>(i).Op) {
				default:
				{
					$.panic("bad inst")
					break
				}
				case syntax.InstMatch:
				{
					if (($.len($.pointerValue<thread>(t).cap) > 0) && ((!longest || !$.pointerValue<machine>(m).matched) || ($.pointerValue<machine>(m).matchcap![1] < pos))) {
						$.pointerValue<thread>(t).cap![1] = pos
						$.copy($.pointerValue<machine>(m).matchcap, $.pointerValue<thread>(t).cap)
					}
					if (!longest) {
						// First-match mode: cut off all lower-priority threads.
						for (let __goscriptRangeTarget3 = $.goSlice($.pointerValue<queue>(runq).dense, j + 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
							let d = __goscriptRangeTarget3![__rangeIndex]
							if (d.t != null) {
								$.pointerValue<machine>(m).pool = $.append($.pointerValue<machine>(m).pool, d.t)
							}
						}
						$.pointerValue<queue>(runq).dense = $.goSlice($.pointerValue<queue>(runq).dense, undefined, 0)
					}
					$.pointerValue<machine>(m).matched = true
					break
				}
				case syntax.InstRune:
				{
					add = syntax.Inst.prototype.MatchRune.call(i, $.int(c, 32))
					break
				}
				case syntax.InstRune1:
				{
					add = $.int(c, 32) == $.int($.pointerValue<syntax.Inst>(i).Rune![0], 32)
					break
				}
				case syntax.InstRuneAny:
				{
					add = true
					break
				}
				case syntax.InstRuneAnyNotNL:
				{
					add = $.int(c, 32) != $.int(10, 32)
					break
				}
			}
			if (add) {
				t = machine.prototype.add.call(m, nextq, $.uint($.pointerValue<syntax.Inst>(i).Out, 32), nextPos, $.pointerValue<thread>(t).cap, nextCond, t)
			}
			if (t != null) {
				$.pointerValue<machine>(m).pool = $.append($.pointerValue<machine>(m).pool, t)
			}
		}
		$.pointerValue<queue>(runq).dense = $.goSlice($.pointerValue<queue>(runq).dense, undefined, 0)
	}

	static __typeInfo = $.registerStructType(
		"regexp.machine",
		() => new machine(),
		[{ name: "add", args: [], returns: [] }, { name: "alloc", args: [], returns: [] }, { name: "clear", args: [], returns: [] }, { name: "init", args: [], returns: [] }, { name: "match", args: [], returns: [] }, { name: "step", args: [], returns: [] }],
		machine,
		{"re": { kind: $.TypeKind.Pointer, elemType: "regexp.Regexp" }, "p": { kind: $.TypeKind.Pointer, elemType: "syntax.Prog" }, "q0": "regexp.queue", "q1": "regexp.queue", "pool": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "regexp.thread" } }, "matched": { kind: $.TypeKind.Basic, name: "bool" }, "matchcap": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "inputs": "regexp.inputs"}
	)
}

export class onePassMachine {
	public get inputs(): inputs {
		return this._fields.inputs.value
	}
	public set inputs(value: inputs) {
		this._fields.inputs.value = value
	}

	public get matchcap(): $.Slice<number> {
		return this._fields.matchcap.value
	}
	public set matchcap(value: $.Slice<number>) {
		this._fields.matchcap.value = value
	}

	public _fields: {
		inputs: $.VarRef<inputs>
		matchcap: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{inputs?: inputs, matchcap?: $.Slice<number>}>) {
		this._fields = {
			inputs: $.varRef(init?.inputs ? $.markAsStructValue($.cloneStructValue(init.inputs)) : $.markAsStructValue(new inputs())),
			matchcap: $.varRef(init?.matchcap ?? null)
		}
	}

	public clone(): onePassMachine {
		const cloned = new onePassMachine()
		cloned._fields = {
			inputs: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.inputs.value))),
			matchcap: $.varRef(this._fields.matchcap.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"regexp.onePassMachine",
		() => new onePassMachine(),
		[],
		onePassMachine,
		{"inputs": "regexp.inputs", "matchcap": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export type lazyFlag = number

export function newLazyFlag(r1: number, r2: number): lazyFlag {
	return $.uint64Add(($.uint64Mul(r1, (2 ** 32))), $.uint($.uint(r2, 32), 64))
}

export function lazyFlag_match(f: lazyFlag, op: syntax.EmptyOp): boolean {
	if ($.uint(op, 8) == $.uint(0, 8)) {
		return true
	}
	let r1 = $.int($.int($.uint64Shr(f, 32), 32), 32)
	if ($.uint((op & syntax.EmptyBeginLine), 8) != $.uint(0, 8)) {
		if (($.int(r1, 32) != $.int(10, 32)) && (r1 >= 0)) {
			return false
		}
		op = op & ~($.uint(syntax.EmptyBeginLine, 8))
	}
	if ($.uint((op & syntax.EmptyBeginText), 8) != $.uint(0, 8)) {
		if (r1 >= 0) {
			return false
		}
		op = op & ~($.uint(syntax.EmptyBeginText, 8))
	}
	if ($.uint(op, 8) == $.uint(0, 8)) {
		return true
	}
	let r2 = $.int($.int(f, 32), 32)
	if ($.uint((op & syntax.EmptyEndLine), 8) != $.uint(0, 8)) {
		if (($.int(r2, 32) != $.int(10, 32)) && (r2 >= 0)) {
			return false
		}
		op = op & ~($.uint(syntax.EmptyEndLine, 8))
	}
	if ($.uint((op & syntax.EmptyEndText), 8) != $.uint(0, 8)) {
		if (r2 >= 0) {
			return false
		}
		op = op & ~($.uint(syntax.EmptyEndText, 8))
	}
	if ($.uint(op, 8) == $.uint(0, 8)) {
		return true
	}
	if (syntax.IsWordChar($.int(r1, 32)) != syntax.IsWordChar($.int(r2, 32))) {
		op = op & ~($.uint(syntax.EmptyWordBoundary, 8))
	} else {
		op = op & ~($.uint(syntax.EmptyNoWordBoundary, 8))
	}
	return $.uint(op, 8) == $.uint(0, 8)
}

export let onePassPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool()))

export function __goscript_set_onePassPool(__goscriptValue: sync.Pool): void {
	onePassPool.value = __goscriptValue
}

export function newOnePassMachine(): onePassMachine | $.VarRef<onePassMachine> | null {
	let __goscriptTuple5: any = $.typeAssertTuple<onePassMachine | $.VarRef<onePassMachine> | null>(onePassPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "regexp.onePassMachine" })
	let m: onePassMachine | $.VarRef<onePassMachine> | null = __goscriptTuple5[0]
	let ok = __goscriptTuple5[1]
	if (!ok) {
		m = new onePassMachine()
	}
	return m
}

export function freeOnePassMachine(m: onePassMachine | $.VarRef<onePassMachine> | null): void {
	$.pointerValue<onePassMachine>(m).inputs.clear()
	onePassPool.value.Put($.interfaceValue<any>(m, "*regexp.onePassMachine"))
}

export let arrayNoInts: number[] = Array.from({ length: 0 }, () => 0)

export function __goscript_set_arrayNoInts(__goscriptValue: number[]): void {
	arrayNoInts = __goscriptValue
}
