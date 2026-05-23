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
		if ($.uint(l1.head, 32) == $.uint(0, 32)) {
			return $.markAsStructValue($.cloneStructValue(l2))
		}
		if ($.uint(l2.head, 32) == $.uint(0, 32)) {
			return $.markAsStructValue($.cloneStructValue(l1))
		}

		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>(p).Inst!, $.uintShr(l1.tail, 1, 32))
		if ($.uint((l1.tail & 1), 32) == $.uint(0, 32)) {
			$.pointerValue<__goscript_prog.Inst>(i).Out = $.uint(l2.head, 32)
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(l2.head, 32)
		}
		return $.markAsStructValue(new patchList({head: $.uint(l1.head, 32), tail: $.uint(l2.tail, 32)}))
	}

	public patch(p: __goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null, val: number): void {
		const l = this
		let head = $.uint(l.head, 32)
		while ($.uint(head, 32) != $.uint(0, 32)) {
			let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>(p).Inst!, $.uintShr(head, 1, 32))
			if ($.uint((head & 1), 32) == $.uint(0, 32)) {
				head = $.uint($.pointerValue<__goscript_prog.Inst>(i).Out, 32)
				$.pointerValue<__goscript_prog.Inst>(i).Out = $.uint(val, 32)
			} else {
				head = $.uint($.pointerValue<__goscript_prog.Inst>(i).Arg, 32)
				$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(val, 32)
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
		if ($.uint(f1.i, 32) == $.uint(0, 32)) {
			return $.markAsStructValue($.cloneStructValue(f2))
		}
		if ($.uint(f2.i, 32) == $.uint(0, 32)) {
			return $.markAsStructValue($.cloneStructValue(f1))
		}

		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(0, 8))))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		$.pointerValue<__goscript_prog.Inst>(i).Out = $.uint(f1.i, 32)
		$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(f2.i, 32)
		f.out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(f1.out)).append($.pointerValue<compiler>(c).p, $.markAsStructValue($.cloneStructValue(f2.out)))))
		f.nullable = f1.nullable || f2.nullable
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public cap(arg: number): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(2, 8))))
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst![f.i].Arg = $.uint(arg, 32)

		if ($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).NumCap < ($.int(arg) + 1)) {
			$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).NumCap = $.int(arg) + 1
		}
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public cat(f1: frag, f2: frag): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		// concat of failure is failure
		if (($.uint(f1.i, 32) == $.uint(0, 32)) || ($.uint(f2.i, 32) == $.uint(0, 32))) {
			return $.markAsStructValue(new frag())
		}

		// TODO: elide nop

		$.markAsStructValue($.cloneStructValue(f1.out)).patch($.pointerValue<compiler>(c).p, $.uint(f2.i, 32))
		return $.markAsStructValue(new frag({i: $.uint(f1.i, 32), out: $.markAsStructValue($.cloneStructValue(f2.out)), nullable: f1.nullable && f2.nullable}))
	}

	public compile(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		switch ($.pointerValue<__goscript_regexp.Regexp>(re).Op) {
			case 1:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.fail.call(c)))
				break
			}
			case 2:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				break
			}
			case 3:
			{
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Rune) == 0) {
					return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				}
				let f: frag = $.markAsStructValue(new frag())
				for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_regexp.Regexp>(re).Rune, j = 0; j < $.len(__goscriptRangeTarget0); j++) {
					let f1 = $.markAsStructValue($.cloneStructValue(compiler.prototype.rune.call(c, $.goSlice($.pointerValue<__goscript_regexp.Regexp>(re).Rune, j, j + 1), $.uint($.pointerValue<__goscript_regexp.Regexp>(re).Flags, 16))))
					if (j == 0) {
						f = $.markAsStructValue($.cloneStructValue(f1))
					} else {
						f = $.markAsStructValue($.cloneStructValue(compiler.prototype.cat.call(c, $.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(f1)))))
					}
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
			case 4:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.rune.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Rune, $.uint($.pointerValue<__goscript_regexp.Regexp>(re).Flags, 16))))
				break
			}
			case 5:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.rune.call(c, anyRuneNotNL, $.uint(0, 16))))
				break
			}
			case 6:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.rune.call(c, anyRune, $.uint(0, 16))))
				break
			}
			case 7:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(1, 8))))
				break
			}
			case 8:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(2, 8))))
				break
			}
			case 9:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(4, 8))))
				break
			}
			case 10:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(8, 8))))
				break
			}
			case 11:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(16, 8))))
				break
			}
			case 12:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.empty.call(c, $.uint(32, 8))))
				break
			}
			case 13:
			{
				let bra = $.markAsStructValue($.cloneStructValue(compiler.prototype.cap.call(c, $.uint($.uint($.pointerValue<__goscript_regexp.Regexp>(re).Cap << 1, 32), 32))))
				let sub = $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0])))
				let ket = $.markAsStructValue($.cloneStructValue(compiler.prototype.cap.call(c, $.uint($.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Cap << 1) | 1, 32), 32))))
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.cat.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.cat.call(c, $.markAsStructValue($.cloneStructValue(bra)), $.markAsStructValue($.cloneStructValue(sub))))), $.markAsStructValue($.cloneStructValue(ket)))))
				break
			}
			case 14:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.star.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), $.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Flags & 32), 16) != $.uint(0, 16))))
				break
			}
			case 15:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.plus.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), $.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Flags & 32), 16) != $.uint(0, 16))))
				break
			}
			case 16:
			{
				return $.markAsStructValue($.cloneStructValue(compiler.prototype.quest.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, $.pointerValue<__goscript_regexp.Regexp>(re).Sub![0]))), $.uint(($.pointerValue<__goscript_regexp.Regexp>(re).Flags & 32), 16) != $.uint(0, 16))))
				break
			}
			case 18:
			{
				if ($.len($.pointerValue<__goscript_regexp.Regexp>(re).Sub) == 0) {
					return $.markAsStructValue($.cloneStructValue(compiler.prototype.nop.call(c)))
				}
				let f: frag = $.markAsStructValue(new frag())
				for (let __goscriptRangeTarget1 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
					let sub = __goscriptRangeTarget1![i]
					if (i == 0) {
						f = $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub)))
					} else {
						f = $.markAsStructValue($.cloneStructValue(compiler.prototype.cat.call(c, $.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub))))))
					}
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
			case 19:
			{
				let f: frag = $.markAsStructValue(new frag())
				for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_regexp.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
					let sub = __goscriptRangeTarget2![__rangeIndex]
					f = $.markAsStructValue($.cloneStructValue(compiler.prototype.alt.call(c, $.markAsStructValue($.cloneStructValue(f)), $.markAsStructValue($.cloneStructValue(compiler.prototype.compile.call(c, sub))))))
				}
				return $.markAsStructValue($.cloneStructValue(f))
				break
			}
		}
		$.panic("regexp: unhandled case in compile")
	}

	public empty(op: __goscript_prog.EmptyOp): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(3, 8))))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst![f.i].Arg = $.uint($.uint(op, 32), 32)
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))
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
		compiler.prototype.inst.call(c, $.uint(5, 8))
	}

	public inst(op: __goscript_prog.InstOp): frag {
		let c: compiler | $.VarRef<compiler> | null = this
		// TODO: impose length limit
		let f = $.markAsStructValue(new frag({i: $.uint($.uint($.len($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst), 32), 32), nullable: true}))
		$.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst = $.append($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst, $.markAsStructValue(new __goscript_prog.Inst({Op: $.uint(op, 8)})))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public loop(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(0, 8))))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		if (nongreedy) {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(f1.i, 32)
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Out = $.uint(f1.i, 32)
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint((f.i << 1) | 1, 32))))
		}
		$.markAsStructValue($.cloneStructValue(f1.out)).patch($.pointerValue<compiler>(c).p, $.uint(f.i, 32))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public nop(): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(6, 8))))
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public plus(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		return $.markAsStructValue(new frag({i: $.uint(f1.i, 32), out: $.markAsStructValue($.cloneStructValue(compiler.prototype.loop.call(c, $.markAsStructValue($.cloneStructValue(f1)), nongreedy).out)), nullable: f1.nullable}))
	}

	public quest(f1: frag, nongreedy: boolean): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(0, 8))))
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		if (nongreedy) {
			$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint(f1.i, 32)
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))
		} else {
			$.pointerValue<__goscript_prog.Inst>(i).Out = $.uint(f1.i, 32)
			f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint((f.i << 1) | 1, 32))))
		}
		f.out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(f.out)).append($.pointerValue<compiler>(c).p, $.markAsStructValue($.cloneStructValue(f1.out)))))
		return $.markAsStructValue($.cloneStructValue(f))
	}

	public rune(r: $.Slice<number>, flags: __goscript_parse.Flags): frag {
		const c: compiler | $.VarRef<compiler> | null = this
		let f = $.markAsStructValue($.cloneStructValue(compiler.prototype.inst.call(c, $.uint(7, 8))))
		f.nullable = false
		let i: __goscript_prog.Inst | $.VarRef<__goscript_prog.Inst> | null = $.indexRef($.pointerValue<__goscript_prog.Prog>($.pointerValue<compiler>(c).p).Inst!, f.i)
		$.pointerValue<__goscript_prog.Inst>(i).Rune = r
		flags &= $.uint(1, 16)
		if (($.len(r) != 1) || ($.int(unicode.SimpleFold($.int(r![0], 32)), 32) == $.int(r![0], 32))) {
			// and sometimes not even that
			flags = flags & ~($.uint(1, 16))
		}
		$.pointerValue<__goscript_prog.Inst>(i).Arg = $.uint($.uint(flags, 32), 32)
		f.out = $.markAsStructValue($.cloneStructValue(makePatchList($.uint(f.i << 1, 32))))

		// Special cases for exec machine.
		switch (true) {
			case ($.uint((flags & 1), 16) == $.uint(0, 16)) && (($.len(r) == 1) || (($.len(r) == 2) && ($.int(r![0], 32) == $.int(r![1], 32)))):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = $.uint(8, 8)
				break
			}
			case (($.len(r) == 2) && ($.int(r![0], 32) == $.int(0, 32))) && ($.int(r![1], 32) == $.int(unicode.MaxRune, 32)):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = $.uint(9, 8)
				break
			}
			case (((($.len(r) == 4) && ($.int(r![0], 32) == $.int(0, 32))) && ($.int(r![1], 32) == $.int((10 - 1), 32))) && ($.int(r![2], 32) == $.int((10 + 1), 32))) && ($.int(r![3], 32) == $.int(unicode.MaxRune, 32)):
			{
				$.pointerValue<__goscript_prog.Inst>(i).Op = $.uint(10, 8)
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
			return $.markAsStructValue($.cloneStructValue(compiler.prototype.quest.call(c, $.markAsStructValue($.cloneStructValue(compiler.prototype.plus.call(c, $.markAsStructValue($.cloneStructValue(f1)), nongreedy))), nongreedy)))
		}
		return $.markAsStructValue($.cloneStructValue(compiler.prototype.loop.call(c, $.markAsStructValue($.cloneStructValue(f1)), nongreedy)))
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
	return $.markAsStructValue(new patchList({head: $.uint(n, 32), tail: $.uint(n, 32)}))
}

export function Compile(re: __goscript_regexp.Regexp | $.VarRef<__goscript_regexp.Regexp> | null): [__goscript_prog.Prog | $.VarRef<__goscript_prog.Prog> | null, $.GoError] {
	let c: $.VarRef<compiler> = $.varRef($.markAsStructValue(new compiler()))
	c.value.init()
	let f = $.markAsStructValue($.cloneStructValue(c.value.compile(re)))
	$.markAsStructValue($.cloneStructValue(f.out)).patch(c.value.p, $.uint(c.value.inst($.uint(4, 8)).i, 32))
	$.pointerValue<__goscript_prog.Prog>(c.value.p).Start = $.int(f.i)
	return [c.value.p, null]
}

export let anyRuneNotNL: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 32), $.int(10 - 1, 32), $.int(10 + 1, 32), $.int(unicode.MaxRune, 32)])

export function __goscript_set_anyRuneNotNL(value: $.Slice<number>): void {
	anyRuneNotNL = value
}

export let anyRune: $.Slice<number> = $.arrayToSlice<number>([$.int(0, 32), $.int(unicode.MaxRune, 32)])

export function __goscript_set_anyRune(value: $.Slice<number>): void {
	anyRune = value
}
