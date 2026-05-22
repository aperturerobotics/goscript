// Generated file based on compile.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as __goscript_op_string from "./op_string.gs.ts"

import * as __goscript_parse from "./parse.gs.ts"

import * as __goscript_prog from "./prog.gs.ts"

import * as __goscript_regexp from "./regexp.gs.ts"

import * as __goscript_simplify from "./simplify.gs.ts"

export class patchList {
	public get head(): number {
		return this._fields.head.value
	}
	public set head(value: number) {
		this._fields.head.value = value
	}

	public get tail(): number {
		return this._fields.tail.value
	}
	public set tail(value: number) {
		this._fields.tail.value = value
	}

	public _fields: {
		head: $.VarRef<number>
		tail: $.VarRef<number>
	}

	constructor(init?: Partial<{head?: number, tail?: number}>) {
		this._fields = {
			head: $.varRef(init?.head ?? 0),
			tail: $.varRef(init?.tail ?? 0)
		}
	}

	public clone(): patchList {
		const cloned = new patchList()
		cloned._fields = {
			head: $.varRef(this._fields.head.value),
			tail: $.varRef(this._fields.tail.value)
		}
		return $.markAsStructValue(cloned)
	}

	public append(p: __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null, l2: patchList): patchList {
		const l1 = this
		if (l1.head == 0) {
			return $.markAsStructValue($.cloneStructValue(l2))
		}
		if (l2.head == 0) {
			return $.markAsStructValue($.cloneStructValue(l1))
		}

		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>(p).Inst!, l1.tail >> 1)
		if ((l1.tail & 1) == 0) {
			$.pointerValue<__goscript_prog.Inst>(i).Out = l2.head
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = l2.head
		}
		return $.markAsStructValue(new patchList({head: l1.head, tail: l2.tail}))
	}

	public patch(p: __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null, val: number): void {
		const l = this
		let head = l.head
		while (head != 0) {
			let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>(p).Inst!, head >> 1)
			if ((head & 1) == 0) {
				head = $.pointerValue<__goscript_prog.Inst>(i).Out
				$.pointerValue<__goscript_prog.Inst>(i).Out = val
			} else {
				head = $.pointerValue<__goscript_prog.Inst>(i).Arg
				$.pointerValue<__goscript_prog.Inst>(i).Arg = val
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"syntax.patchList",
		() => new patchList(),
		[{ name: "append", args: [], returns: [] }, { name: "patch", args: [], returns: [] }],
		patchList,
		{"head": { kind: $.TypeKind.Basic, name: "int" }, "tail": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class frag {
	public get i(): number {
		return this._fields.i.value
	}
	public set i(value: number) {
		this._fields.i.value = value
	}

	public get out(): patchList {
		return this._fields.out.value
	}
	public set out(value: patchList) {
		this._fields.out.value = value
	}

	public get nullable(): boolean {
		return this._fields.nullable.value
	}
	public set nullable(value: boolean) {
		this._fields.nullable.value = value
	}

	public _fields: {
		i: $.VarRef<number>
		out: $.VarRef<patchList>
		nullable: $.VarRef<boolean>
	}

	constructor(init?: Partial<{i?: number, out?: patchList, nullable?: boolean}>) {
		this._fields = {
			i: $.varRef(init?.i ?? 0),
			out: $.varRef(init?.out ? $.markAsStructValue(init.out.clone()) : $.markAsStructValue(new patchList())),
			nullable: $.varRef(init?.nullable ?? false)
		}
	}

	public clone(): frag {
		const cloned = new frag()
		cloned._fields = {
			i: $.varRef(this._fields.i.value),
			out: $.varRef($.markAsStructValue(this._fields.out.value.clone())),
			nullable: $.varRef(this._fields.nullable.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"syntax.frag",
		() => new frag(),
		[],
		frag,
		{"i": { kind: $.TypeKind.Basic, name: "int" }, "out": "syntax.patchList", "nullable": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class compiler {
	public get p(): __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null {
		return this._fields.p.value
	}
	public set p(value: __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null) {
		this._fields.p.value = value
	}

	public _fields: {
		p: $.VarRef<__goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null>
	}

	constructor(init?: Partial<{p?: __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null}>) {
		this._fields = {
			p: $.varRef(init?.p ?? null)
		}
	}

	public clone(): compiler {
		const cloned = new compiler()
		cloned._fields = {
			p: $.varRef(this._fields.p.value)
		}
		return $.markAsStructValue(cloned)
	}

	public alt(f1: frag, f2: frag): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		// alt of failure is other
		if (f1.i == 0) {
			return $.markAsStructValue($.cloneStructValue(f2))
		}
		if (f2.i == 0) {
			return $.markAsStructValue($.cloneStructValue(f1))
		}

		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstAlt)))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		$.pointerValue<__goscript_prog.Inst>(i).Out = f1.i
		$.pointerValue<__goscript_prog.Inst>(i).Arg = f2.i
		f.out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(f1.out)).append($.pointerValue<compiler>(c).p, $.markAsStructValue($.cloneStructValue(f2.out)))))
		f.nullable = f1.nullable || f2.nullable
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public cap(arg: number): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstCapture)))
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst![f.i].Arg = arg

		if ($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).NumCap < ($.int(arg) + 1)) {
			$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).NumCap = $.int(arg) + 1
		}
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public cat(f1: frag, f2: frag): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		// concat of failure is failure
		if ((f1.i == 0) || (f2.i == 0)) {
			return $.markAsStructValue(new frag())
		}

		// TODO: elide nop

		$.markAsStructValue($.cloneStructValue(f1.out)).patch($.pointerValue<compiler>(c).p, f2.i)
		return $.markAsStructValue(new frag({i: f1.i, out: $.markAsStructValue($.cloneStructValue(f2.out)), nullable: f1.nullable && f2.nullable}))
	}

	public compile(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
			case __goscript_regexp.OpNoMatch:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.fail.call(c)))
				break
			}
			case __goscript_regexp.OpEmptyMatch:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				break
			}
			case __goscript_regexp.OpLiteral:
			{
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 0) {
					return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				}
				let f: frag = $.markAsStructValue(new frag())
				for (let j = 0; j < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune); j++) {
					let f1 = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).rune($.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, j, j + 1), $.pointerValue<__goscript_regexp.Regexp>(re).Flags)))
					if (j == 0) {
						f = $.markAsStructValue($.cloneStructValue(f1))
					} else {
						f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cat($.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(f1)))))
					}
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
			case __goscript_regexp.OpCharClass:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).rune($.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.pointerValue<__goscript_regexp.Regexp>(re).Flags)))
				break
			}
			case __goscript_regexp.OpAnyCharNotNL:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).rune(anyRuneNotNL, 0)))
				break
			}
			case __goscript_regexp.OpAnyChar:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).rune(anyRune, 0)))
				break
			}
			case __goscript_regexp.OpBeginLine:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyBeginLine)))
				break
			}
			case __goscript_regexp.OpEndLine:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyEndLine)))
				break
			}
			case __goscript_regexp.OpBeginText:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyBeginText)))
				break
			}
			case __goscript_regexp.OpEndText:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyEndText)))
				break
			}
			case __goscript_regexp.OpWordBoundary:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyWordBoundary)))
				break
			}
			case __goscript_regexp.OpNoWordBoundary:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).empty(__goscript_prog.EmptyNoWordBoundary)))
				break
			}
			case __goscript_regexp.OpCapture:
			{
				let bra = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cap($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Cap << 1, 32))))
				let sub = $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0])))
				let ket = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cap($.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Cap << 1) | 1, 32))))
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cat($.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cat($.markAsStructValue($.cloneStructValue(bra)), $.markAsStructValue($.cloneStructValue(sub))))), $.markAsStructValue($.cloneStructValue(ket)))))
				break
			}
			case __goscript_regexp.OpStar:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.star.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), ($.pointerValue<__goscript_regexp.Regexp>(re).Flags & __goscript_parse.NonGreedy) != 0)))
				break
			}
			case __goscript_regexp.OpPlus:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.plus.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), ($.pointerValue<__goscript_regexp.Regexp>(re).Flags & __goscript_parse.NonGreedy) != 0)))
				break
			}
			case __goscript_regexp.OpQuest:
			{
				return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).quest($.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), ($.pointerValue<__goscript_regexp.Regexp>(re).Flags & __goscript_parse.NonGreedy) != 0)))
				break
			}
			case __goscript_regexp.OpConcat:
			{
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) == 0) {
					return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				}
				let f: frag = $.markAsStructValue(new frag())
				for (let i = 0; i < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); i++) {
					let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![i]
					if (i == 0) {
						f = $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub)))
					} else {
						f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).cat($.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub))))))
					}
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
			case __goscript_regexp.OpAlternate:
			{
				let f: frag = $.markAsStructValue(new frag())
				for (let __rangeIndex = 0; __rangeIndex < $.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub); __rangeIndex++) {
					let sub = $.pointerValue<__goscript_regexp.Regexp>(re).Sub![__rangeIndex]
					f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).alt($.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub))))))
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
		}
		$.panic("regexp: unhandled case in compile")
	}

	public empty(op: __goscript_prog.EmptyOp): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstEmptyWidth)))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst![f.i].Arg = $.uint(op, 32)
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public fail(): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		return $.markAsStructValue(new frag())
	}

	public init(): void {
		let c: compiler | $.VarRef<compiler> | null = this
		$.pointerValue<compiler>(c).p = new __goscript_prog.Prog()
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).NumCap = 2
		$.pointerValue<compiler>(c).inst(__goscript_prog.InstFail)
	}

	public inst(op: __goscript_prog.InstOp): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		// TODO: impose length limit
		let f = $.markAsStructValue(new frag({i: $.uint($.len($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst), 32), nullable: true}))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst = $.append($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst, $.markAsStructValue(new __goscript_prog.Inst({Op: op})))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public loop(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstAlt)))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		if (nongreedy) {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = f1.i
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Out = f1.i
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList((f.i << 1) | 1)))
		}
		$.markAsStructValue($.cloneStructValue(f1.out)).patch($.pointerValue<compiler>(c).p, f.i)
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public nop(): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstNop)))
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public plus(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		return $.markAsStructValue(new frag({i: f1.i, out: $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).loop($.markAsStructValue($.cloneStructValue(f1)), nongreedy).out)), nullable: f1.nullable}))
	}

	public quest(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstAlt)))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		if (nongreedy) {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = f1.i
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Out = f1.i
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList((f.i << 1) | 1)))
		}
		f.out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(f.out)).append($.pointerValue<compiler>(c).p, $.markAsStructValue($.cloneStructValue(f1.out)))))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public rune(r: $.Slice<number>, flags: __goscript_parse.Flags): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).inst(__goscript_prog.InstRune)))
		f.nullable = false
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		$.pointerValue<__goscript_prog.Inst>(i).Rune = r
		flags &= __goscript_parse.FoldCase
		if (($.len(r) != 1) || (unicode.SimpleFold(r![0]) == r![0])) {
			// and sometimes not even that
			flags = flags & ~(__goscript_parse.FoldCase)
		}
		$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(flags, 32)
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList(f.i << 1)))

		// Special cases for exec machine.
		switch (true) {
			case ((flags & __goscript_parse.FoldCase) == 0) && (($.len(r) == 1) || (($.len(r) == 2) && (r![0] == r![1]))):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = __goscript_prog.InstRune1
				break
			}
			case (($.len(r) == 2) && (r![0] == 0)) && (r![1] == unicode.MaxRune):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = __goscript_prog.InstRuneAny
				break
			}
			case (((($.len(r) == 4) && (r![0] == 0)) && (r![1] == (10 - 1))) && (r![2] == (10 + 1))) && (r![3] == unicode.MaxRune):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = __goscript_prog.InstRuneAnyNotNL
				break
			}
		}

		return $.markAsStructValue($.cloneStructValue(f))
	}

	public star(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		if (f1.nullable) {
			// Use (f1+)? to get priority match order correct.
			// See golang.org/issue/46123.
			return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).quest($.markAsStructValue($.cloneStructValue(compiler.prototype.plus.call(c, $.markAsStructValue($.cloneStructValue(f1)), nongreedy))), nongreedy)))
		}
		return $.markAsStructValue($.cloneStructValue($.pointerValue<compiler>(c).loop($.markAsStructValue($.cloneStructValue(f1)), nongreedy)))
	}

	static __typeInfo = $.registerStructType(
		"syntax.compiler",
		() => new compiler(),
		[{ name: "alt", args: [], returns: [] }, { name: "cap", args: [], returns: [] }, { name: "cat", args: [], returns: [] }, { name: "compile", args: [], returns: [] }, { name: "empty", args: [], returns: [] }, { name: "fail", args: [], returns: [] }, { name: "init", args: [], returns: [] }, { name: "inst", args: [], returns: [] }, { name: "loop", args: [], returns: [] }, { name: "nop", args: [], returns: [] }, { name: "plus", args: [], returns: [] }, { name: "quest", args: [], returns: [] }, { name: "rune", args: [], returns: [] }, { name: "star", args: [], returns: [] }],
		compiler,
		{"p": { kind: $.TypeKind.Pointer, elemType: "syntax.Prog" }}
	)
}

export function makePatchList(n: number): patchList {
	return $.markAsStructValue(new patchList({head: n, tail: n}))
}

export function Compile(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): [__goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null, $.GoError] {
	let c: $.VarRef<compiler> = $.varRef($.markAsStructValue(new compiler()))
	c.value.init()
	let f = $.markAsStructValue($.cloneStructValue(c.value.compile(re)))
	$.markAsStructValue($.cloneStructValue(f.out)).patch(c.value.p, c.value.inst(__goscript_prog.InstMatch).i)
	$.pointerValue<__goscript_prog.Prog>(c.value.p).Start = $.int(f.i)
	return [c.value.p, null]
}

export let anyRuneNotNL: $.Slice<number> = $.arrayToSlice<number>([0, 10 - 1, 10 + 1, unicode.MaxRune])

export function __goscript_set_anyRuneNotNL(value: $.Slice<number>): void {
	anyRuneNotNL = value
}

export let anyRune: $.Slice<number> = $.arrayToSlice<number>([0, unicode.MaxRune])

export function __goscript_set_anyRune(value: $.Slice<number>): void {
	anyRune = value
}
