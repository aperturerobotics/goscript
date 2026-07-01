// Generated file based on regexp.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as syntax from "@goscript/regexp/syntax/index.js"

import * as sync from "@goscript/sync/index.js"

import * as io from "@goscript/io/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings2 from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_backtrack from "./backtrack.gs.ts"

import * as __goscript_exec from "./exec.gs.ts"

import * as __goscript_onepass from "./onepass.gs.ts"
import "@goscript/regexp/syntax/index.js"
import "@goscript/sync/index.js"
import "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/index.js"
import "@goscript/unicode/utf8/index.js"
import "./backtrack.gs.ts"
import "./exec.gs.ts"
import "./onepass.gs.ts"

export class Regexp {
	public get expr(): string {
		return this._fields.expr.value
	}
	public set expr(value: string) {
		this._fields.expr.value = value
	}

	public get prog(): syntax.Prog | $.VarRef<syntax.Prog> | null {
		return this._fields.prog.value
	}
	public set prog(value: syntax.Prog | $.VarRef<syntax.Prog> | null) {
		this._fields.prog.value = value
	}

	public get onepass(): __goscript_onepass.onePassProg | $.VarRef<__goscript_onepass.onePassProg> | null {
		return this._fields.onepass.value
	}
	public set onepass(value: __goscript_onepass.onePassProg | $.VarRef<__goscript_onepass.onePassProg> | null) {
		this._fields.onepass.value = value
	}

	public get numSubexp(): number {
		return this._fields.numSubexp.value
	}
	public set numSubexp(value: number) {
		this._fields.numSubexp.value = value
	}

	public get maxBitStateLen(): number {
		return this._fields.maxBitStateLen.value
	}
	public set maxBitStateLen(value: number) {
		this._fields.maxBitStateLen.value = value
	}

	public get subexpNames(): $.Slice<string> {
		return this._fields.subexpNames.value
	}
	public set subexpNames(value: $.Slice<string>) {
		this._fields.subexpNames.value = value
	}

	public get prefix(): string {
		return this._fields.prefix.value
	}
	public set prefix(value: string) {
		this._fields.prefix.value = value
	}

	public get prefixBytes(): $.Slice<number> {
		return this._fields.prefixBytes.value
	}
	public set prefixBytes(value: $.Slice<number>) {
		this._fields.prefixBytes.value = value
	}

	public get prefixRune(): number {
		return this._fields.prefixRune.value
	}
	public set prefixRune(value: number) {
		this._fields.prefixRune.value = value
	}

	public get prefixEnd(): number {
		return this._fields.prefixEnd.value
	}
	public set prefixEnd(value: number) {
		this._fields.prefixEnd.value = value
	}

	public get mpool(): number {
		return this._fields.mpool.value
	}
	public set mpool(value: number) {
		this._fields.mpool.value = value
	}

	public get matchcap(): number {
		return this._fields.matchcap.value
	}
	public set matchcap(value: number) {
		this._fields.matchcap.value = value
	}

	public get prefixComplete(): boolean {
		return this._fields.prefixComplete.value
	}
	public set prefixComplete(value: boolean) {
		this._fields.prefixComplete.value = value
	}

	public get cond(): syntax.EmptyOp {
		return this._fields.cond.value
	}
	public set cond(value: syntax.EmptyOp) {
		this._fields.cond.value = value
	}

	public get minInputLen(): number {
		return this._fields.minInputLen.value
	}
	public set minInputLen(value: number) {
		this._fields.minInputLen.value = value
	}

	// This field can be modified by the Longest method,
	// but it is otherwise read-only.
	public get longest(): boolean {
		return this._fields.longest.value
	}
	public set longest(value: boolean) {
		this._fields.longest.value = value
	}

	public _fields: {
		expr: $.VarRef<string>
		prog: $.VarRef<syntax.Prog | $.VarRef<syntax.Prog> | null>
		onepass: $.VarRef<__goscript_onepass.onePassProg | $.VarRef<__goscript_onepass.onePassProg> | null>
		numSubexp: $.VarRef<number>
		maxBitStateLen: $.VarRef<number>
		subexpNames: $.VarRef<$.Slice<string>>
		prefix: $.VarRef<string>
		prefixBytes: $.VarRef<$.Slice<number>>
		prefixRune: $.VarRef<number>
		prefixEnd: $.VarRef<number>
		mpool: $.VarRef<number>
		matchcap: $.VarRef<number>
		prefixComplete: $.VarRef<boolean>
		cond: $.VarRef<syntax.EmptyOp>
		minInputLen: $.VarRef<number>
		longest: $.VarRef<boolean>
	}

	constructor(init?: Partial<{expr?: string, prog?: syntax.Prog | $.VarRef<syntax.Prog> | null, onepass?: __goscript_onepass.onePassProg | $.VarRef<__goscript_onepass.onePassProg> | null, numSubexp?: number, maxBitStateLen?: number, subexpNames?: $.Slice<string>, prefix?: string, prefixBytes?: $.Slice<number>, prefixRune?: number, prefixEnd?: number, mpool?: number, matchcap?: number, prefixComplete?: boolean, cond?: syntax.EmptyOp, minInputLen?: number, longest?: boolean}>) {
		this._fields = {
			expr: $.varRef(init?.expr ?? ("" as string)),
			prog: $.varRef(init?.prog ?? (null as syntax.Prog | $.VarRef<syntax.Prog> | null)),
			onepass: $.varRef(init?.onepass ?? (null as __goscript_onepass.onePassProg | $.VarRef<__goscript_onepass.onePassProg> | null)),
			numSubexp: $.varRef(init?.numSubexp ?? (0 as number)),
			maxBitStateLen: $.varRef(init?.maxBitStateLen ?? (0 as number)),
			subexpNames: $.varRef(init?.subexpNames ?? (null as $.Slice<string>)),
			prefix: $.varRef(init?.prefix ?? ("" as string)),
			prefixBytes: $.varRef(init?.prefixBytes ?? (null as $.Slice<number>)),
			prefixRune: $.varRef(init?.prefixRune ?? (0 as number)),
			prefixEnd: $.varRef(init?.prefixEnd ?? (0 as number)),
			mpool: $.varRef(init?.mpool ?? (0 as number)),
			matchcap: $.varRef(init?.matchcap ?? (0 as number)),
			prefixComplete: $.varRef(init?.prefixComplete ?? (false as boolean)),
			cond: $.varRef(init?.cond ?? (0 as syntax.EmptyOp)),
			minInputLen: $.varRef(init?.minInputLen ?? (0 as number)),
			longest: $.varRef(init?.longest ?? (false as boolean))
		}
	}

	public clone(): Regexp {
		const cloned = new Regexp()
		cloned._fields = {
			expr: $.varRef(this._fields.expr.value),
			prog: $.varRef(this._fields.prog.value),
			onepass: $.varRef(this._fields.onepass.value),
			numSubexp: $.varRef(this._fields.numSubexp.value),
			maxBitStateLen: $.varRef(this._fields.maxBitStateLen.value),
			subexpNames: $.varRef(this._fields.subexpNames.value),
			prefix: $.varRef(this._fields.prefix.value),
			prefixBytes: $.varRef(this._fields.prefixBytes.value),
			prefixRune: $.varRef(this._fields.prefixRune.value),
			prefixEnd: $.varRef(this._fields.prefixEnd.value),
			mpool: $.varRef(this._fields.mpool.value),
			matchcap: $.varRef(this._fields.matchcap.value),
			prefixComplete: $.varRef(this._fields.prefixComplete.value),
			cond: $.varRef(this._fields.cond.value),
			minInputLen: $.varRef(this._fields.minInputLen.value),
			longest: $.varRef(this._fields.longest.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return [$.appendSlice(b, $.stringToBytes(Regexp.prototype.String.call(re))), null]
	}

	public Copy(): Regexp | $.VarRef<Regexp> | null {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let re2 = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Regexp>(re))))
		return re2
	}

	public Expand(dst: $.Slice<number>, template: $.Slice<number>, src: $.Slice<number>, match: $.Slice<number>): $.Slice<number> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.expand.call(re, dst, $.bytesToString(template), src, "", match)
	}

	public ExpandString(dst: $.Slice<number>, template: string, src: string, match: $.Slice<number>): $.Slice<number> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.expand.call(re, dst, template, null, src, match)
	}

	public async Find(b: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let dstCap: number[] = Array.from({ length: 2 }, () => 0)
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, b, "", 0, 2, $.goSlice(dstCap, undefined, 0))
		if (a == null) {
			return null
		}
		return $.goSlice(b, $.arrayIndex(a!, 0), $.arrayIndex(a!, 1), $.arrayIndex(a!, 1))
	}

	public async FindAll(b: $.Slice<number>, n: number): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(b) + 1
		}
		let result: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		await Regexp.prototype.allMatches.call(re, "", b, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<number>>(0, 10)
			}
			result = $.append(result, $.goSlice(b, $.arrayIndex(match!, 0), $.arrayIndex(match!, 1), $.arrayIndex(match!, 1)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllIndex(b: $.Slice<number>, n: number): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(b) + 1
		}
		let result: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		await Regexp.prototype.allMatches.call(re, "", b, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<number>>(0, 10)
			}
			result = $.append(result, $.goSlice(match, 0, 2))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllString(s: string, n: number): globalThis.Promise<$.Slice<string>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(s) + 1
		}
		let result: $.Slice<string> = null as $.Slice<string>
		await Regexp.prototype.allMatches.call(re, s, null, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<string>(0, 10, "string")
			}
			result = $.append(result, $.sliceStringOrBytes(s, $.arrayIndex(match!, 0), $.arrayIndex(match!, 1)))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllStringIndex(s: string, n: number): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(s) + 1
		}
		let result: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		await Regexp.prototype.allMatches.call(re, s, null, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<number>>(0, 10)
			}
			result = $.append(result, $.goSlice(match, 0, 2))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllStringSubmatch(s: string, n: number): globalThis.Promise<$.Slice<$.Slice<string>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(s) + 1
		}
		let result: $.Slice<$.Slice<string>> = null as $.Slice<$.Slice<string>>
		await Regexp.prototype.allMatches.call(re, s, null, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<string>>(0, 10)
			}
			let slice: $.Slice<string> = $.makeSlice<string>(Math.trunc($.len(match) / 2), undefined, "string")
			for (let __goscriptRangeTarget0 = slice, j = 0; j < $.len(__goscriptRangeTarget0); j++) {
				if ($.arrayIndex(match!, 2 * j) >= 0) {
					slice![j] = $.sliceStringOrBytes(s, $.arrayIndex(match!, 2 * j), $.arrayIndex(match!, (2 * j) + 1))
				}
			}
			result = $.append(result, slice)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllStringSubmatchIndex(s: string, n: number): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(s) + 1
		}
		let result: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		await Regexp.prototype.allMatches.call(re, s, null, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<number>>(0, 10)
			}
			result = $.append(result, match)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllSubmatch(b: $.Slice<number>, n: number): globalThis.Promise<$.Slice<$.Slice<$.Slice<number>>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(b) + 1
		}
		let result: $.Slice<$.Slice<$.Slice<number>>> = null as $.Slice<$.Slice<$.Slice<number>>>
		await Regexp.prototype.allMatches.call(re, "", b, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<$.Slice<number>>>(0, 10)
			}
			let slice: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(Math.trunc($.len(match) / 2))
			for (let __goscriptRangeTarget1 = slice, j = 0; j < $.len(__goscriptRangeTarget1); j++) {
				if ($.arrayIndex(match!, 2 * j) >= 0) {
					slice![j] = $.goSlice(b, $.arrayIndex(match!, 2 * j), $.arrayIndex(match!, (2 * j) + 1), $.arrayIndex(match!, (2 * j) + 1))
				}
			}
			result = $.append(result, slice)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindAllSubmatchIndex(b: $.Slice<number>, n: number): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (n < 0) {
			n = $.len(b) + 1
		}
		let result: $.Slice<$.Slice<number>> = null as $.Slice<$.Slice<number>>
		await Regexp.prototype.allMatches.call(re, "", b, n, $.functionValue((match: $.Slice<number>): void => {
			if (result == null) {
				result = $.makeSlice<$.Slice<number>>(0, 10)
			}
			result = $.append(result, match)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [] } as $.FunctionTypeInfo)))
		return result
	}

	public async FindIndex(b: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let loc: $.Slice<number> = null as $.Slice<number>
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, b, "", 0, 2, null)
		if (a == null) {
			return null
		}
		return $.goSlice(a, 0, 2)
	}

	public async FindReaderIndex(r: io.RuneReader | null): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let loc: $.Slice<number> = null as $.Slice<number>
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, r, null, "", 0, 2, null)
		if (a == null) {
			return null
		}
		return $.goSlice(a, 0, 2)
	}

	public async FindReaderSubmatchIndex(r: io.RuneReader | null): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.pad.call(re, await Regexp.prototype.doExecute.call(re, r, null, "", 0, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, null))
	}

	public async FindString(s: string): globalThis.Promise<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let dstCap: number[] = Array.from({ length: 2 }, () => 0)
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, null, s, 0, 2, $.goSlice(dstCap, undefined, 0))
		if (a == null) {
			return ""
		}
		return $.sliceStringOrBytes(s, $.arrayIndex(a!, 0), $.arrayIndex(a!, 1))
	}

	public async FindStringIndex(s: string): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let loc: $.Slice<number> = null as $.Slice<number>
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, null, s, 0, 2, null)
		if (a == null) {
			return null
		}
		return $.goSlice(a, 0, 2)
	}

	public async FindStringSubmatch(s: string): globalThis.Promise<$.Slice<string>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let dstCap: number[] = Array.from({ length: 4 }, () => 0)
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, null, s, 0, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, $.goSlice(dstCap, undefined, 0))
		if (a == null) {
			return null
		}
		let ret: $.Slice<string> = $.makeSlice<string>(1 + $.pointerValue<Regexp>(re).numSubexp, undefined, "string")
		for (let __goscriptRangeTarget2 = ret, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			if (((2 * i) < $.len(a)) && ($.arrayIndex(a!, 2 * i) >= 0)) {
				ret![i] = $.sliceStringOrBytes(s, $.arrayIndex(a!, 2 * i), $.arrayIndex(a!, (2 * i) + 1))
			}
		}
		return ret
	}

	public async FindStringSubmatchIndex(s: string): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.pad.call(re, await Regexp.prototype.doExecute.call(re, null, null, s, 0, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, null))
	}

	public async FindSubmatch(b: $.Slice<number>): globalThis.Promise<$.Slice<$.Slice<number>>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let dstCap: number[] = Array.from({ length: 4 }, () => 0)
		let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, b, "", 0, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, $.goSlice(dstCap, undefined, 0))
		if (a == null) {
			return null
		}
		let ret: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>(1 + $.pointerValue<Regexp>(re).numSubexp)
		for (let __goscriptRangeTarget3 = ret, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
			if (((2 * i) < $.len(a)) && ($.arrayIndex(a!, 2 * i) >= 0)) {
				ret![i] = $.goSlice(b, $.arrayIndex(a!, 2 * i), $.arrayIndex(a!, (2 * i) + 1), $.arrayIndex(a!, (2 * i) + 1))
			}
		}
		return ret
	}

	public async FindSubmatchIndex(b: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.pad.call(re, await Regexp.prototype.doExecute.call(re, null, b, "", 0, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, null))
	}

	public LiteralPrefix(): [string, boolean] {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let prefix: string = ""
		let complete: boolean = false
		return [$.pointerValue<Regexp>(re).prefix, $.pointerValue<Regexp>(re).prefixComplete]
	}

	public Longest(): void {
		let re: Regexp | $.VarRef<Regexp> | null = this
		$.pointerValue<Regexp>(re).longest = true
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.AppendText.call(re, null)
	}

	public async Match(b: $.Slice<number>): globalThis.Promise<boolean> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.doMatch.call(re, null, b, "")
	}

	public async MatchReader(r: io.RuneReader | null): globalThis.Promise<boolean> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.doMatch.call(re, r, null, "")
	}

	public async MatchString(s: string): globalThis.Promise<boolean> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.doMatch.call(re, null, null, s)
	}

	public NumSubexp(): number {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return $.pointerValue<Regexp>(re).numSubexp
	}

	public async ReplaceAll(src: $.Slice<number>, repl: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let n = 2
		if (bytes.IndexByte(repl, $.uint(36, 8)) >= 0) {
			n = 2 * ($.pointerValue<Regexp>(re).numSubexp + 1)
		}
		let srepl = ""
		let b: $.Slice<number> = await Regexp.prototype.replaceAll.call(re, src, "", n, $.functionValue((dst: $.Slice<number>, match: $.Slice<number>): $.Slice<number> => {
			if ($.len(srepl) != $.len(repl)) {
				srepl = $.bytesToString(repl)
			}
			return Regexp.prototype.expand.call(re, dst, srepl, src, "", match)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
		return b
	}

	public async ReplaceAllFunc(src: $.Slice<number>, repl: ((_p0: $.Slice<number>) => $.Slice<number> | globalThis.Promise<$.Slice<number>>) | null): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.replaceAll.call(re, src, "", 2, $.functionValue(async (dst: $.Slice<number>, match: $.Slice<number>): globalThis.Promise<$.Slice<number>> => {
			return $.appendSlice(dst, await repl!($.goSlice(src, $.arrayIndex(match!, 0), $.arrayIndex(match!, 1))))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
	}

	public async ReplaceAllLiteral(src: $.Slice<number>, repl: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return Regexp.prototype.replaceAll.call(re, src, "", 2, $.functionValue((dst: $.Slice<number>, match: $.Slice<number>): $.Slice<number> => {
			return $.appendSlice(dst, repl)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
	}

	public async ReplaceAllLiteralString(src: string, repl: string): globalThis.Promise<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return $.bytesToString(await Regexp.prototype.replaceAll.call(re, null, src, 2, $.functionValue((dst: $.Slice<number>, match: $.Slice<number>): $.Slice<number> => {
			return $.appendSlice(dst, $.stringToBytes(repl))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo))))
	}

	public async ReplaceAllString(src: string, repl: string): globalThis.Promise<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let n = 2
		if (strings2.Contains(repl, "$")) {
			n = 2 * ($.pointerValue<Regexp>(re).numSubexp + 1)
		}
		let b: $.Slice<number> = await Regexp.prototype.replaceAll.call(re, null, src, n, $.functionValue((dst: $.Slice<number>, match: $.Slice<number>): $.Slice<number> => {
			return Regexp.prototype.expand.call(re, dst, repl, null, src, match)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
		return $.bytesToString(b)
	}

	public async ReplaceAllStringFunc(src: string, repl: ((_p0: string) => string | globalThis.Promise<string>) | null): globalThis.Promise<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let b: $.Slice<number> = await Regexp.prototype.replaceAll.call(re, null, src, 2, $.functionValue(async (dst: $.Slice<number>, match: $.Slice<number>): globalThis.Promise<$.Slice<number>> => {
			return $.appendSlice(dst, $.stringToBytes(await repl!($.sliceStringOrBytes(src, $.arrayIndex(match!, 0), $.arrayIndex(match!, 1)))))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo)))
		return $.bytesToString(b)
	}

	public async Split(s: string, n: number): globalThis.Promise<$.Slice<string>> {
		const re: Regexp | $.VarRef<Regexp> | null = this

		if (n == 0) {
			return null
		}

		if (($.len($.pointerValue<Regexp>(re).expr) > 0) && ($.len(s) == 0)) {
			return $.arrayToSlice<string>([""])
		}

		let matches: $.Slice<$.Slice<number>> = await Regexp.prototype.FindAllStringIndex.call(re, s, n)
		let __goscriptShadow0: $.Slice<string> = $.makeSlice<string>(0, $.len(matches), "string")

		let beg = 0
		let end = 0
		for (let __goscriptRangeTarget4 = matches, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
			let match = __goscriptRangeTarget4![__rangeIndex]
			if ((n > 0) && ($.len(__goscriptShadow0) >= (n - 1))) {
				break
			}

			end = $.arrayIndex(match!, 0)
			if ($.arrayIndex(match!, 1) != 0) {
				__goscriptShadow0 = $.append(__goscriptShadow0, $.sliceStringOrBytes(s, beg, end))
			}
			beg = $.arrayIndex(match!, 1)
		}

		if (end != $.len(s)) {
			__goscriptShadow0 = $.append(__goscriptShadow0, $.sliceStringOrBytes(s, beg, undefined))
		}

		return __goscriptShadow0
	}

	public String(): string {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return $.pointerValue<Regexp>(re).expr
	}

	public SubexpIndex(name: string): number {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (!$.stringEqual(name, "")) {
			for (let __goscriptRangeTarget5 = $.pointerValue<Regexp>(re).subexpNames, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
				let s = __goscriptRangeTarget5![i]
				if ($.stringEqual(name, s)) {
					return i
				}
			}
		}
		return -1
	}

	public SubexpNames(): $.Slice<string> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return $.pointerValue<Regexp>(re).subexpNames
	}

	public async UnmarshalText(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		let re: Regexp | $.VarRef<Regexp> | null = this
		let __goscriptTuple0: any = await Compile($.bytesToString(text))
		let newRE: Regexp | $.VarRef<Regexp> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<Regexp>(re), $.markAsStructValue($.cloneStructValue($.pointerValue<Regexp>(newRE))))
		return null
	}

	public async allMatches(s: string, b: $.Slice<number>, n: number, deliver: ((_p0: $.Slice<number>) => void) | null): globalThis.Promise<void> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let end: number = 0
		if (b == null) {
			end = $.len(s)
		} else {
			end = $.len(b)
		}

		for (let pos = 0, i = 0, prevMatchEnd = -1; (i < n) && (pos <= end); ) {
			let matches: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, b, s, pos, $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap, null)
			if ($.len(matches) == 0) {
				break
			}

			let accept = true
			if ($.arrayIndex(matches!, 1) == pos) {
				// We've found an empty match.
				if ($.arrayIndex(matches!, 0) == prevMatchEnd) {
					// We don't allow an empty match right
					// after a previous match, so ignore it.
					accept = false
				}
				let width: number = 0
				if (b == null) {
					let _is = $.varRef($.markAsStructValue(new inputString({str: s})))
					let __goscriptTuple1: any = _is.value.step(pos)
					width = __goscriptTuple1[1]
				} else {
					let ib = $.varRef($.markAsStructValue(new inputBytes({str: b})))
					let __goscriptTuple2: any = ib.value.step(pos)
					width = __goscriptTuple2[1]
				}
				if (width > 0) {
					pos = pos + (width)
				} else {
					pos = end + 1
				}
			} else {
				pos = $.arrayIndex(matches!, 1)
			}
			prevMatchEnd = $.arrayIndex(matches!, 1)

			if (accept) {
				await deliver!(Regexp.prototype.pad.call(re, matches))
				i++
			}
		}
	}

	public async backtrack(ib: $.Slice<number>, _is: string, pos: number, ncap: number, dstCap: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let startCond = $.uint($.pointerValue<Regexp>(re).cond, 8)
		if ($.uint(startCond, 8) == $.uint($.uint(~0, 8), 8)) {
			return null
		}
		if (($.uint((startCond & syntax.EmptyBeginText), 8) != $.uint(0, 8)) && (pos != 0)) {

			return null
		}

		let b: __goscript_backtrack.bitState | $.VarRef<__goscript_backtrack.bitState> | null = await __goscript_backtrack.newBitState()
		let [i, end] = $.pointerValue<__goscript_backtrack.bitState>(b).inputs.init(null, ib, _is)
		__goscript_backtrack.bitState.prototype.reset.call(b, $.pointerValue<Regexp>(re).prog, end, ncap)

		Match: {

			if ($.uint((startCond & syntax.EmptyBeginText), 8) != $.uint(0, 8)) {
				if ($.len($.pointerValue<__goscript_backtrack.bitState>(b).cap) > 0) {
					$.pointerValue<__goscript_backtrack.bitState>(b).cap![0] = pos
				}
				if (!await Regexp.prototype.tryBacktrack.call(re, b, i, $.uint($.uint($.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).Start, 32), 32), pos)) {
					__goscript_backtrack.freeBitState(b)
					return null
				}
			} else {

				let width = -1
				for (; (pos <= end) && (width != 0); pos = pos + (width)) {
					if ($.len($.pointerValue<Regexp>(re).prefix) > 0) {

						let advance = await $.pointerValue<Exclude<input, null>>(i).index(re, pos)
						if (advance < 0) {
							__goscript_backtrack.freeBitState(b)
							return null
						}
						pos = pos + (advance)
					}

					if ($.len($.pointerValue<__goscript_backtrack.bitState>(b).cap) > 0) {
						$.pointerValue<__goscript_backtrack.bitState>(b).cap![0] = pos
					}
					if (await Regexp.prototype.tryBacktrack.call(re, b, i, $.uint($.uint($.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).Start, 32), 32), pos)) {

						break Match
					}
					let __goscriptTuple3: any = await $.pointerValue<Exclude<input, null>>(i).step(pos)
					width = __goscriptTuple3[1]
				}
				__goscript_backtrack.freeBitState(b)
				return null
			}
		}
		dstCap = $.appendSlice(dstCap, $.pointerValue<__goscript_backtrack.bitState>(b).matchcap)
		__goscript_backtrack.freeBitState(b)
		return dstCap
	}

	public async doExecute(r: io.RuneReader | null, b: $.Slice<number>, s: string, pos: number, ncap: number, dstCap: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (dstCap == null) {

			dstCap = $.goSlice(__goscript_exec.arrayNoInts, undefined, 0, 0)
		}

		if ((r == null) && (($.len(b) + $.len(s)) < $.pointerValue<Regexp>(re).minInputLen)) {
			return null
		}

		if ($.pointerValue<Regexp>(re).onepass != null) {
			return Regexp.prototype.doOnePass.call(re, r, b, s, pos, ncap, dstCap)
		}
		if ((r == null) && (($.len(b) + $.len(s)) < $.pointerValue<Regexp>(re).maxBitStateLen)) {
			return Regexp.prototype.backtrack.call(re, b, s, pos, ncap, dstCap)
		}

		let m: __goscript_exec.machine | $.VarRef<__goscript_exec.machine> | null = await Regexp.prototype.get.call(re)
		let [i, ] = $.pointerValue<__goscript_exec.machine>(m).inputs.init(r, b, s)

		__goscript_exec.machine.prototype.init.call(m, ncap)
		if (!await __goscript_exec.machine.prototype.match.call(m, i, pos)) {
			Regexp.prototype.put.call(re, m)
			return null
		}

		dstCap = $.appendSlice(dstCap, $.pointerValue<__goscript_exec.machine>(m).matchcap)
		Regexp.prototype.put.call(re, m)
		return dstCap
	}

	public async doMatch(r: io.RuneReader | null, b: $.Slice<number>, s: string): globalThis.Promise<boolean> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		return await Regexp.prototype.doExecute.call(re, r, b, s, 0, 0, null) != null
	}

	public async doOnePass(ir: io.RuneReader | null, ib: $.Slice<number>, _is: string, pos: number, ncap: number, dstCap: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let startCond = $.uint($.pointerValue<Regexp>(re).cond, 8)
		if ($.uint(startCond, 8) == $.uint($.uint(~0, 8), 8)) {
			return null
		}

		let m: __goscript_exec.onePassMachine | $.VarRef<__goscript_exec.onePassMachine> | null = await __goscript_exec.newOnePassMachine()
		if ($.cap($.pointerValue<__goscript_exec.onePassMachine>(m).matchcap) < ncap) {
			$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap = $.makeSlice<number>(ncap, undefined, "number")
		} else {
			$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap = $.goSlice($.pointerValue<__goscript_exec.onePassMachine>(m).matchcap, undefined, ncap)
		}

		let matched = false
		for (let __goscriptRangeTarget6 = $.pointerValue<__goscript_exec.onePassMachine>(m).matchcap, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
			$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap![i] = -1
		}

		let [i, ] = $.pointerValue<__goscript_exec.onePassMachine>(m).inputs.init(ir, ib, _is)

		let r = $.int(-1, 32)
		let r1 = $.int(-1, 32)
		let width = 0
		let width1 = 0
		let __goscriptTuple4: any = await $.pointerValue<Exclude<input, null>>(i).step(pos)
		r = $.int(__goscriptTuple4[0], 32)
		width = __goscriptTuple4[1]
		if ($.int(r, 32) != $.int(-1, 32)) {
			let __goscriptTuple5: any = await $.pointerValue<Exclude<input, null>>(i).step(pos + width)
			r1 = $.int(__goscriptTuple5[0], 32)
			width1 = __goscriptTuple5[1]
		}
		let flag: __goscript_exec.lazyFlag = 0n
		if (pos == 0) {
			flag = __goscript_exec.newLazyFlag($.int(-1, 32), $.int(r, 32))
		} else {
			flag = await $.pointerValue<Exclude<input, null>>(i).context(pos)
		}
		let pc = $.pointerValue<__goscript_onepass.onePassProg>($.pointerValue<Regexp>(re).onepass).Start
		let inst: __goscript_onepass.onePassInst | $.VarRef<__goscript_onepass.onePassInst> | null = $.indexRef($.pointerValue<__goscript_onepass.onePassProg>($.pointerValue<Regexp>(re).onepass).Inst!, pc)

		Return: {

			if ((((pos == 0) && __goscript_exec.lazyFlag_match(flag, $.uint($.uint($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Arg, 8), 8))) && ($.len($.pointerValue<Regexp>(re).prefix) > 0)) && await $.pointerValue<Exclude<input, null>>(i).canCheckPrefix()) {

				if (!await $.pointerValue<Exclude<input, null>>(i).hasPrefix(re)) {
					break Return
				}
				pos = pos + ($.len($.pointerValue<Regexp>(re).prefix))
				let __goscriptTuple6: any = await $.pointerValue<Exclude<input, null>>(i).step(pos)
				r = $.int(__goscriptTuple6[0], 32)
				width = __goscriptTuple6[1]
				let __goscriptTuple7: any = await $.pointerValue<Exclude<input, null>>(i).step(pos + width)
				r1 = $.int(__goscriptTuple7[0], 32)
				width1 = __goscriptTuple7[1]
				flag = await $.pointerValue<Exclude<input, null>>(i).context(pos)
				pc = $.int($.pointerValue<Regexp>(re).prefixEnd)
			}
			while (true) {
				inst = $.indexRef($.pointerValue<__goscript_onepass.onePassProg>($.pointerValue<Regexp>(re).onepass).Inst!, pc)
				pc = $.int($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Out)
				switch ($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Op) {
					default:
					{
						$.panic("bad inst")
						break
					}
					case syntax.InstMatch:
					{
						matched = true
						if ($.len($.pointerValue<__goscript_exec.onePassMachine>(m).matchcap) > 0) {
							$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap![0] = 0
							$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap![1] = pos
						}
						break Return
						break
					}
					case syntax.InstRune:
					{
						if (!$.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.MatchRune($.int(r, 32))) {
							break Return
						}
						break
					}
					case syntax.InstRune1:
					{
						if ($.int(r, 32) != $.int($.arrayIndex($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Rune!, 0), 32)) {
							break Return
						}
						break
					}
					case syntax.InstRuneAny:
					{
						break
					}
					case syntax.InstRuneAnyNotNL:
					{
						if ($.int(r, 32) == $.int(10, 32)) {
							break Return
						}
						break
					}
					case syntax.InstAlt:
					case syntax.InstAltMatch:
					{
						pc = $.int(__goscript_onepass.onePassNext(inst, $.int(r, 32)))
						continue
						break
					}
					case syntax.InstFail:
					{
						break Return
						break
					}
					case syntax.InstNop:
					{
						continue
						break
					}
					case syntax.InstEmptyWidth:
					{
						if (!__goscript_exec.lazyFlag_match(flag, $.uint($.uint($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Arg, 8), 8))) {
							break Return
						}
						continue
						break
					}
					case syntax.InstCapture:
					{
						if ($.int($.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Arg) < $.len($.pointerValue<__goscript_exec.onePassMachine>(m).matchcap)) {
							$.pointerValue<__goscript_exec.onePassMachine>(m).matchcap![$.pointerValue<__goscript_onepass.onePassInst>(inst).Inst.Arg] = pos
						}
						continue
						break
					}
				}
				if (width == 0) {
					break
				}
				flag = __goscript_exec.newLazyFlag($.int(r, 32), $.int(r1, 32))
				pos = pos + (width)
				let __goscriptAssign0_0: number = $.int(r1, 32)
				let __goscriptAssign0_1: number = width1
				r = __goscriptAssign0_0
				width = __goscriptAssign0_1
				if ($.int(r, 32) != $.int(-1, 32)) {
					let __goscriptTuple8: any = await $.pointerValue<Exclude<input, null>>(i).step(pos + width)
					r1 = $.int(__goscriptTuple8[0], 32)
					width1 = __goscriptTuple8[1]
				}
			}
		}
		if (!matched) {
			__goscript_exec.freeOnePassMachine(m)
			return null
		}

		dstCap = $.appendSlice(dstCap, $.pointerValue<__goscript_exec.onePassMachine>(m).matchcap)
		__goscript_exec.freeOnePassMachine(m)
		return dstCap
	}

	public expand(dst: $.Slice<number>, template: string, bsrc: $.Slice<number>, src: string, match: $.Slice<number>): $.Slice<number> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		while ($.len(template) > 0) {
			let [before, after, ok] = strings2.Cut(template, "$")
			if (!ok) {
				break
			}
			dst = $.appendSlice(dst, $.stringToBytes(before))
			template = after
			if ((!$.stringEqual(template, "")) && ($.uint($.indexStringOrBytes(template, 0), 8) == $.uint(36, 8))) {
				// Treat $$ as $.
				dst = $.append(dst, $.uint(36, 8))
				template = $.sliceStringOrBytes(template, 1, undefined)
				continue
			}
			let __goscriptTuple9: any = extract(template)
			let name = __goscriptTuple9[0]
			let num = __goscriptTuple9[1]
			let rest = __goscriptTuple9[2]
			ok = __goscriptTuple9[3]
			if (!ok) {
				// Malformed; treat $ as raw text.
				dst = $.append(dst, $.uint(36, 8))
				continue
			}
			template = rest
			if (num >= 0) {
				if ((((2 * num) + 1) < $.len(match)) && ($.arrayIndex(match!, 2 * num) >= 0)) {
					if (bsrc != null) {
						dst = $.appendSlice(dst, $.goSlice(bsrc, $.arrayIndex(match!, 2 * num), $.arrayIndex(match!, (2 * num) + 1)))
					} else {
						dst = $.appendSlice(dst, $.stringToBytes($.sliceStringOrBytes(src, $.arrayIndex(match!, 2 * num), $.arrayIndex(match!, (2 * num) + 1))))
					}
				}
			} else {
				for (let __goscriptRangeTarget7 = $.pointerValue<Regexp>(re).subexpNames, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
					let namei = __goscriptRangeTarget7![i]
					if ((($.stringEqual(name, namei)) && (((2 * i) + 1) < $.len(match))) && ($.arrayIndex(match!, 2 * i) >= 0)) {
						if (bsrc != null) {
							dst = $.appendSlice(dst, $.goSlice(bsrc, $.arrayIndex(match!, 2 * i), $.arrayIndex(match!, (2 * i) + 1)))
						} else {
							dst = $.appendSlice(dst, $.stringToBytes($.sliceStringOrBytes(src, $.arrayIndex(match!, 2 * i), $.arrayIndex(match!, (2 * i) + 1))))
						}
						break
					}
				}
			}
		}
		dst = $.appendSlice(dst, $.stringToBytes(template))
		return dst
	}

	public async ["get"](): globalThis.Promise<__goscript_exec.machine | $.VarRef<__goscript_exec.machine> | null> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let __goscriptTuple10: any = $.typeAssertTuple<__goscript_exec.machine | $.VarRef<__goscript_exec.machine> | null>(await $.arrayIndex(matchPool, $.pointerValue<Regexp>(re).mpool).Get(), { kind: $.TypeKind.Pointer, elemType: "regexp.machine" })
		let m: __goscript_exec.machine | $.VarRef<__goscript_exec.machine> | null = __goscriptTuple10[0]
		let ok = __goscriptTuple10[1]
		if (!ok) {
			m = new __goscript_exec.machine()
		}
		$.pointerValue<__goscript_exec.machine>(m).re = re
		$.pointerValue<__goscript_exec.machine>(m).p = $.pointerValue<Regexp>(re).prog
		if ($.cap($.pointerValue<__goscript_exec.machine>(m).matchcap) < $.pointerValue<Regexp>(re).matchcap) {
			$.pointerValue<__goscript_exec.machine>(m).matchcap = $.makeSlice<number>($.pointerValue<Regexp>(re).matchcap, undefined, "number")
			for (let __goscriptRangeTarget8 = $.pointerValue<__goscript_exec.machine>(m).pool, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
				let t = __goscriptRangeTarget8![__rangeIndex]
				$.pointerValue<__goscript_exec.thread>(t).cap = $.makeSlice<number>($.pointerValue<Regexp>(re).matchcap, undefined, "number")
			}
		}

		// Allocate queues if needed.
		// Or reallocate, for "large" match pool.
		let n = $.arrayIndex(matchSize, $.pointerValue<Regexp>(re).mpool)
		if (n == 0) {
			n = $.len($.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).Inst)
		}
		if ($.len($.pointerValue<__goscript_exec.machine>(m).q0.sparse) < n) {
			$.pointerValue<__goscript_exec.machine>(m).q0 = $.markAsStructValue(new __goscript_exec.queue({sparse: $.makeSlice<number>(n, undefined, "number"), dense: $.makeSlice<__goscript_exec.entry>(0, n, undefined, () => $.markAsStructValue(new __goscript_exec.entry()))}))
			$.pointerValue<__goscript_exec.machine>(m).q1 = $.markAsStructValue(new __goscript_exec.queue({sparse: $.makeSlice<number>(n, undefined, "number"), dense: $.makeSlice<__goscript_exec.entry>(0, n, undefined, () => $.markAsStructValue(new __goscript_exec.entry()))}))
		}
		return m
	}

	public pad(a: $.Slice<number>): $.Slice<number> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		if (a == null) {
			// No match.
			return null
		}
		let n = (1 + $.pointerValue<Regexp>(re).numSubexp) * 2
		while ($.len(a) < n) {
			a = $.append(a, -1)
		}
		return a
	}

	public put(m: __goscript_exec.machine | $.VarRef<__goscript_exec.machine> | null): void {
		const re: Regexp | $.VarRef<Regexp> | null = this
		$.pointerValue<__goscript_exec.machine>(m).re = null
		$.pointerValue<__goscript_exec.machine>(m).p = null
		$.pointerValue<__goscript_exec.machine>(m).inputs.clear()
		$.arrayIndex(matchPool, $.pointerValue<Regexp>(re).mpool).Put($.interfaceValue<any>(m, "*regexp.machine"))
	}

	public async replaceAll(bsrc: $.Slice<number>, src: string, nmatch: number, repl: ((dst: $.Slice<number>, m: $.Slice<number>) => $.Slice<number> | globalThis.Promise<$.Slice<number>>) | null): globalThis.Promise<$.Slice<number>> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let lastMatchEnd = 0
		let searchPos = 0
		let buf: $.Slice<number> = null as $.Slice<number>
		let endPos: number = 0
		if (bsrc != null) {
			endPos = $.len(bsrc)
		} else {
			endPos = $.len(src)
		}
		if (nmatch > $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap) {
			nmatch = $.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).NumCap
		}

		let dstCap: number[] = Array.from({ length: 2 }, () => 0)
		while (searchPos <= endPos) {
			let a: $.Slice<number> = await Regexp.prototype.doExecute.call(re, null, bsrc, src, searchPos, nmatch, $.goSlice(dstCap, undefined, 0))
			if ($.len(a) == 0) {
				break
			}

			// Copy the unmatched characters before this match.
			if (bsrc != null) {
				buf = $.appendSlice(buf, $.goSlice(bsrc, lastMatchEnd, $.arrayIndex(a!, 0)))
			} else {
				buf = $.appendSlice(buf, $.stringToBytes($.sliceStringOrBytes(src, lastMatchEnd, $.arrayIndex(a!, 0))))
			}

			// Now insert a copy of the replacement string, but not for a
			// match of the empty string immediately after another match.
			// (Otherwise, we get double replacement for patterns that
			// match both empty and nonempty strings.)
			if (($.arrayIndex(a!, 1) > lastMatchEnd) || ($.arrayIndex(a!, 0) == 0)) {
				buf = await repl!(buf, a)
			}
			lastMatchEnd = $.arrayIndex(a!, 1)

			// Advance past this match; always advance at least one character.
			let width: number = 0
			if (bsrc != null) {
				let __goscriptTuple11: any = utf8.DecodeRune($.goSlice(bsrc, searchPos, undefined))
				width = __goscriptTuple11[1]
			} else {
				let __goscriptTuple12: any = utf8.DecodeRuneInString($.sliceStringOrBytes(src, searchPos, undefined))
				width = __goscriptTuple12[1]
			}
			if ((searchPos + width) > $.arrayIndex(a!, 1)) {
				searchPos = searchPos + (width)
			} else {
				if ((searchPos + 1) > $.arrayIndex(a!, 1)) {
					// This clause is only needed at the end of the input
					// string. In that case, DecodeRuneInString returns width=0.
					searchPos++
				} else {
					searchPos = $.arrayIndex(a!, 1)
				}
			}
		}

		// Copy the unmatched characters after the last match.
		if (bsrc != null) {
			buf = $.appendSlice(buf, $.goSlice(bsrc, lastMatchEnd, undefined))
		} else {
			buf = $.appendSlice(buf, $.stringToBytes($.sliceStringOrBytes(src, lastMatchEnd, undefined)))
		}

		return buf
	}

	public async tryBacktrack(b: __goscript_backtrack.bitState | $.VarRef<__goscript_backtrack.bitState> | null, i: input | null, pc: number, pos: number): globalThis.Promise<boolean> {
		const re: Regexp | $.VarRef<Regexp> | null = this
		let longest = $.pointerValue<Regexp>(re).longest

		__goscript_backtrack.bitState.prototype.push.call(b, re, $.uint(pc, 32), pos, false)
		__goscriptLoop0: while ($.len($.pointerValue<__goscript_backtrack.bitState>(b).jobs) > 0) {
			let l = $.len($.pointerValue<__goscript_backtrack.bitState>(b).jobs) - 1

			let __goscriptShadow1 = $.uint($.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).jobs!, l).pc, 32)
			let __goscriptShadow2 = $.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).jobs!, l).pos
			let arg = $.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).jobs!, l).arg
			$.pointerValue<__goscript_backtrack.bitState>(b).jobs = $.goSlice($.pointerValue<__goscript_backtrack.bitState>(b).jobs, undefined, l)

			let __goscriptGotoState0 = "__entry"
			__goscriptGotoLoop0: while (true) {
				switch (__goscriptGotoState0) {
					case "__entry":
					{
						__goscriptGotoState0 = "Skip"
						continue __goscriptGotoLoop0
						__goscriptGotoState0 = "CheckAndLoop"
						continue __goscriptGotoLoop0
						break
					}
					case "CheckAndLoop":
					{
						if (!__goscript_backtrack.bitState.prototype.shouldVisit.call(b, $.uint(__goscriptShadow1, 32), __goscriptShadow2)) {
							continue __goscriptLoop0
						}
						__goscriptGotoState0 = "Skip"
						continue __goscriptGotoLoop0
						break
					}
					case "Skip":
					{

						var inst: syntax.Inst | $.VarRef<syntax.Inst> | null = $.indexRef($.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).Inst!, __goscriptShadow1)

						switch ($.pointerValue<syntax.Inst>(inst).Op) {
							default:
							{
								$.panic("bad inst")
								break
							}
							case syntax.InstFail:
							{
								$.panic("unexpected InstFail")
								break
							}
							case syntax.InstAlt:
							{
								if (arg) {

									arg = false
									__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Arg, 32)
									__goscriptGotoState0 = "CheckAndLoop"
									continue __goscriptGotoLoop0
								} else {
									__goscript_backtrack.bitState.prototype.push.call(b, re, $.uint(__goscriptShadow1, 32), __goscriptShadow2, true)
									__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
									__goscriptGotoState0 = "CheckAndLoop"
									continue __goscriptGotoLoop0
								}
								break
							}
							case syntax.InstAltMatch:
							{
								switch ($.arrayIndex($.pointerValue<syntax.Prog>($.pointerValue<Regexp>(re).prog).Inst!, $.pointerValue<syntax.Inst>(inst).Out).Op) {
									case syntax.InstRune:
									case syntax.InstRune1:
									case syntax.InstRuneAny:
									case syntax.InstRuneAnyNotNL:
									{
										__goscript_backtrack.bitState.prototype.push.call(b, re, $.uint($.pointerValue<syntax.Inst>(inst).Arg, 32), __goscriptShadow2, false)
										__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Arg, 32)
										__goscriptShadow2 = $.pointerValue<__goscript_backtrack.bitState>(b).end
										__goscriptGotoState0 = "CheckAndLoop"
										continue __goscriptGotoLoop0
										break
									}
								}

								__goscript_backtrack.bitState.prototype.push.call(b, re, $.uint($.pointerValue<syntax.Inst>(inst).Out, 32), $.pointerValue<__goscript_backtrack.bitState>(b).end, false)
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstRune:
							{
								let __goscriptTuple13: any = await $.pointerValue<Exclude<input, null>>(i).step(__goscriptShadow2)
								let r = $.int(__goscriptTuple13[0], 32)
								let width = __goscriptTuple13[1]
								if (!syntax.Inst.prototype.MatchRune.call(inst, $.int(r, 32))) {
									continue __goscriptLoop0
								}
								__goscriptShadow2 = __goscriptShadow2 + (width)
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstRune1:
							{
								let __goscriptTuple14: any = await $.pointerValue<Exclude<input, null>>(i).step(__goscriptShadow2)
								let r = $.int(__goscriptTuple14[0], 32)
								let width = __goscriptTuple14[1]
								if ($.int(r, 32) != $.int($.arrayIndex($.pointerValue<syntax.Inst>(inst).Rune!, 0), 32)) {
									continue __goscriptLoop0
								}
								__goscriptShadow2 = __goscriptShadow2 + (width)
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstRuneAnyNotNL:
							{
								let __goscriptTuple15: any = await $.pointerValue<Exclude<input, null>>(i).step(__goscriptShadow2)
								let r = $.int(__goscriptTuple15[0], 32)
								let width = __goscriptTuple15[1]
								if (($.int(r, 32) == $.int(10, 32)) || ($.int(r, 32) == $.int(-1, 32))) {
									continue __goscriptLoop0
								}
								__goscriptShadow2 = __goscriptShadow2 + (width)
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstRuneAny:
							{
								let __goscriptTuple16: any = await $.pointerValue<Exclude<input, null>>(i).step(__goscriptShadow2)
								let r = $.int(__goscriptTuple16[0], 32)
								let width = __goscriptTuple16[1]
								if ($.int(r, 32) == $.int(-1, 32)) {
									continue __goscriptLoop0
								}
								__goscriptShadow2 = __goscriptShadow2 + (width)
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstCapture:
							{
								if (arg) {

									$.pointerValue<__goscript_backtrack.bitState>(b).cap![$.pointerValue<syntax.Inst>(inst).Arg] = __goscriptShadow2
									continue __goscriptLoop0
								} else {
									if ($.uint($.pointerValue<syntax.Inst>(inst).Arg, 32) < $.uint($.uint($.len($.pointerValue<__goscript_backtrack.bitState>(b).cap), 32), 32)) {
										// large pool
										__goscript_backtrack.bitState.prototype.push.call(b, re, $.uint(__goscriptShadow1, 32), $.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).cap!, $.pointerValue<syntax.Inst>(inst).Arg), true)
										$.pointerValue<__goscript_backtrack.bitState>(b).cap![$.pointerValue<syntax.Inst>(inst).Arg] = __goscriptShadow2
									}
									__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
									__goscriptGotoState0 = "CheckAndLoop"
									continue __goscriptGotoLoop0
								}
								break
							}
							case syntax.InstEmptyWidth:
							{
								let flag = await $.pointerValue<Exclude<input, null>>(i).context(__goscriptShadow2)
								if (!__goscript_exec.lazyFlag_match(flag, $.uint($.uint($.pointerValue<syntax.Inst>(inst).Arg, 8), 8))) {
									continue __goscriptLoop0
								}
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstNop:
							{
								__goscriptShadow1 = $.uint($.pointerValue<syntax.Inst>(inst).Out, 32)
								__goscriptGotoState0 = "CheckAndLoop"
								continue __goscriptGotoLoop0
								break
							}
							case syntax.InstMatch:
							{
								if ($.len($.pointerValue<__goscript_backtrack.bitState>(b).cap) == 0) {
									return true
								}

								if ($.len($.pointerValue<__goscript_backtrack.bitState>(b).cap) > 1) {
									$.pointerValue<__goscript_backtrack.bitState>(b).cap![1] = __goscriptShadow2
								}
								{
									let old = $.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).matchcap!, 1)
									if ((old == -1) || ((longest && (__goscriptShadow2 > 0)) && (__goscriptShadow2 > old))) {
										$.copy($.pointerValue<__goscript_backtrack.bitState>(b).matchcap, $.pointerValue<__goscript_backtrack.bitState>(b).cap)
									}
								}

								if (!longest) {
									return true
								}

								if (__goscriptShadow2 == $.pointerValue<__goscript_backtrack.bitState>(b).end) {
									return true
								}

								continue __goscriptLoop0
								break
							}
						}
						break __goscriptGotoLoop0
						break
					}
				}
				break
			}
		}

		return (longest && ($.len($.pointerValue<__goscript_backtrack.bitState>(b).matchcap) > 1)) && ($.arrayIndex($.pointerValue<__goscript_backtrack.bitState>(b).matchcap!, 1) >= 0)
	}

	static __typeInfo = $.registerStructType(
		"regexp.Regexp",
		() => new Regexp(),
		[{ name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Copy", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "regexp.Regexp" } }] }, { name: "Expand", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ExpandString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Find", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "FindAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }] }, { name: "FindAllIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } } }] }, { name: "FindAllString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "FindAllStringIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } } }] }, { name: "FindAllStringSubmatch", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } } }] }, { name: "FindAllStringSubmatchIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } } }] }, { name: "FindAllSubmatch", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } } }] }, { name: "FindAllSubmatchIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } } }] }, { name: "FindIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "FindReaderIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "FindReaderSubmatchIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "FindString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "FindStringIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "FindStringSubmatch", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "FindStringSubmatchIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "FindSubmatch", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } } }] }, { name: "FindSubmatchIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "LiteralPrefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Longest", args: [], returns: [] }, { name: "MarshalText", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Match", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MatchReader", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MatchString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "NumSubexp", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "ReplaceAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ReplaceAllFunc", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ReplaceAllLiteral", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ReplaceAllLiteralString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "ReplaceAllString", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "ReplaceAllStringFunc", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Split", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "SubexpIndex", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "SubexpNames", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "allMatches", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "backtrack", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "doExecute", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "doMatch", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "doOnePass", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "expand", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "get", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "regexp.machine" } }] }, { name: "pad", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "replaceAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "tryBacktrack", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		Regexp,
		[{ name: "expr", key: "expr", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "prog", key: "prog", type: { kind: $.TypeKind.Pointer, elemType: "syntax.Prog" } }, { name: "onepass", key: "onepass", type: { kind: $.TypeKind.Pointer, elemType: "regexp.onePassProg" } }, { name: "numSubexp", key: "numSubexp", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "maxBitStateLen", key: "maxBitStateLen", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "subexpNames", key: "subexpNames", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "prefix", key: "prefix", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "prefixBytes", key: "prefixBytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "prefixRune", key: "prefixRune", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "prefixEnd", key: "prefixEnd", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "mpool", key: "mpool", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "matchcap", key: "matchcap", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "prefixComplete", key: "prefixComplete", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "cond", key: "cond", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "syntax.EmptyOp" } }, { name: "minInputLen", key: "minInputLen", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "longest", key: "longest", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export class inputString {
	public get str(): string {
		return this._fields.str.value
	}
	public set str(value: string) {
		this._fields.str.value = value
	}

	public _fields: {
		str: $.VarRef<string>
	}

	constructor(init?: Partial<{str?: string}>) {
		this._fields = {
			str: $.varRef(init?.str ?? ("" as string))
		}
	}

	public clone(): inputString {
		const cloned = new inputString()
		cloned._fields = {
			str: $.varRef(this._fields.str.value)
		}
		return $.markAsStructValue(cloned)
	}

	public canCheckPrefix(): boolean {
		const i: inputString | $.VarRef<inputString> | null = this
		return true
	}

	public context(pos: number): __goscript_exec.lazyFlag {
		const i: inputString | $.VarRef<inputString> | null = this
		let r1 = $.int(-1, 32)
		let r2 = $.int(-1, 32)
		// 0 < pos && pos <= len(i.str)
		if ($.uint(pos - 1, 64) < $.uint($.len($.pointerValue<inputString>(i).str), 64)) {
			let __goscriptTuple24: any = utf8.DecodeLastRuneInString($.sliceStringOrBytes($.pointerValue<inputString>(i).str, undefined, pos))
			r1 = $.int(__goscriptTuple24[0], 32)
		}
		// 0 <= pos && pos < len(i.str)
		if ($.uint(pos, 64) < $.uint($.len($.pointerValue<inputString>(i).str), 64)) {
			let __goscriptTuple25: any = utf8.DecodeRuneInString($.sliceStringOrBytes($.pointerValue<inputString>(i).str, pos, undefined))
			r2 = $.int(__goscriptTuple25[0], 32)
		}
		return __goscript_exec.newLazyFlag($.int(r1, 32), $.int(r2, 32))
	}

	public hasPrefix(re: Regexp | $.VarRef<Regexp> | null): boolean {
		const i: inputString | $.VarRef<inputString> | null = this
		return strings2.HasPrefix($.pointerValue<inputString>(i).str, $.pointerValue<Regexp>(re).prefix)
	}

	public index(re: Regexp | $.VarRef<Regexp> | null, pos: number): number {
		const i: inputString | $.VarRef<inputString> | null = this
		return strings2.Index($.sliceStringOrBytes($.pointerValue<inputString>(i).str, pos, undefined), $.pointerValue<Regexp>(re).prefix)
	}

	public step(pos: number): [number, number] {
		const i: inputString | $.VarRef<inputString> | null = this
		if (pos < $.len($.pointerValue<inputString>(i).str)) {
			const __goscriptReturn3 = utf8.DecodeRuneInString($.sliceStringOrBytes($.pointerValue<inputString>(i).str, pos, undefined))
			return [$.int(__goscriptReturn3[0], 32), __goscriptReturn3[1]]
		}
		return [$.int(-1, 32), 0]
	}

	static __typeInfo = $.registerStructType(
		"regexp.inputString",
		() => new inputString(),
		[{ name: "canCheckPrefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "context", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64", typeName: "regexp.lazyFlag" } }] }, { name: "hasPrefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "index", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		inputString,
		[{ name: "str", key: "str", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class inputBytes {
	public get str(): $.Slice<number> {
		return this._fields.str.value
	}
	public set str(value: $.Slice<number>) {
		this._fields.str.value = value
	}

	public _fields: {
		str: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{str?: $.Slice<number>}>) {
		this._fields = {
			str: $.varRef(init?.str ?? (null as $.Slice<number>))
		}
	}

	public clone(): inputBytes {
		const cloned = new inputBytes()
		cloned._fields = {
			str: $.varRef(this._fields.str.value)
		}
		return $.markAsStructValue(cloned)
	}

	public canCheckPrefix(): boolean {
		const i: inputBytes | $.VarRef<inputBytes> | null = this
		return true
	}

	public context(pos: number): __goscript_exec.lazyFlag {
		const i: inputBytes | $.VarRef<inputBytes> | null = this
		let r1 = $.int(-1, 32)
		let r2 = $.int(-1, 32)
		// 0 < pos && pos <= len(i.str)
		if ($.uint(pos - 1, 64) < $.uint($.len($.pointerValue<inputBytes>(i).str), 64)) {
			let __goscriptTuple26: any = utf8.DecodeLastRune($.goSlice($.pointerValue<inputBytes>(i).str, undefined, pos))
			r1 = $.int(__goscriptTuple26[0], 32)
		}
		// 0 <= pos && pos < len(i.str)
		if ($.uint(pos, 64) < $.uint($.len($.pointerValue<inputBytes>(i).str), 64)) {
			let __goscriptTuple27: any = utf8.DecodeRune($.goSlice($.pointerValue<inputBytes>(i).str, pos, undefined))
			r2 = $.int(__goscriptTuple27[0], 32)
		}
		return __goscript_exec.newLazyFlag($.int(r1, 32), $.int(r2, 32))
	}

	public hasPrefix(re: Regexp | $.VarRef<Regexp> | null): boolean {
		const i: inputBytes | $.VarRef<inputBytes> | null = this
		return bytes.HasPrefix($.pointerValue<inputBytes>(i).str, $.pointerValue<Regexp>(re).prefixBytes)
	}

	public index(re: Regexp | $.VarRef<Regexp> | null, pos: number): number {
		const i: inputBytes | $.VarRef<inputBytes> | null = this
		return bytes.Index($.goSlice($.pointerValue<inputBytes>(i).str, pos, undefined), $.pointerValue<Regexp>(re).prefixBytes)
	}

	public step(pos: number): [number, number] {
		const i: inputBytes | $.VarRef<inputBytes> | null = this
		if (pos < $.len($.pointerValue<inputBytes>(i).str)) {
			const __goscriptReturn4 = utf8.DecodeRune($.goSlice($.pointerValue<inputBytes>(i).str, pos, undefined))
			return [$.int(__goscriptReturn4[0], 32), __goscriptReturn4[1]]
		}
		return [$.int(-1, 32), 0]
	}

	static __typeInfo = $.registerStructType(
		"regexp.inputBytes",
		() => new inputBytes(),
		[{ name: "canCheckPrefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "context", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64", typeName: "regexp.lazyFlag" } }] }, { name: "hasPrefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "index", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		inputBytes,
		[{ name: "str", key: "str", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export class inputReader {
	public get r(): io.RuneReader | null {
		return this._fields.r.value
	}
	public set r(value: io.RuneReader | null) {
		this._fields.r.value = value
	}

	public get atEOT(): boolean {
		return this._fields.atEOT.value
	}
	public set atEOT(value: boolean) {
		this._fields.atEOT.value = value
	}

	public get pos(): number {
		return this._fields.pos.value
	}
	public set pos(value: number) {
		this._fields.pos.value = value
	}

	public _fields: {
		r: $.VarRef<io.RuneReader | null>
		atEOT: $.VarRef<boolean>
		pos: $.VarRef<number>
	}

	constructor(init?: Partial<{r?: io.RuneReader | null, atEOT?: boolean, pos?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.RuneReader | null)),
			atEOT: $.varRef(init?.atEOT ?? (false as boolean)),
			pos: $.varRef(init?.pos ?? (0 as number))
		}
	}

	public clone(): inputReader {
		const cloned = new inputReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			atEOT: $.varRef(this._fields.atEOT.value),
			pos: $.varRef(this._fields.pos.value)
		}
		return $.markAsStructValue(cloned)
	}

	public canCheckPrefix(): boolean {
		const i: inputReader | $.VarRef<inputReader> | null = this
		return false
	}

	public context(pos: number): __goscript_exec.lazyFlag {
		const i: inputReader | $.VarRef<inputReader> | null = this
		return 0n
	}

	public hasPrefix(re: Regexp | $.VarRef<Regexp> | null): boolean {
		const i: inputReader | $.VarRef<inputReader> | null = this
		return false
	}

	public index(re: Regexp | $.VarRef<Regexp> | null, pos: number): number {
		const i: inputReader | $.VarRef<inputReader> | null = this
		return -1
	}

	public async step(pos: number): globalThis.Promise<[number, number]> {
		let i: inputReader | $.VarRef<inputReader> | null = this
		if (!$.pointerValue<inputReader>(i).atEOT && (pos != $.pointerValue<inputReader>(i).pos)) {
			return [$.int(-1, 32), 0]
		}
		let __goscriptTuple28: any = await $.pointerValue<Exclude<io.RuneReader, null>>($.pointerValue<inputReader>(i).r).ReadRune()
		let r = $.int(__goscriptTuple28[0], 32)
		let w = __goscriptTuple28[1]
		let err = __goscriptTuple28[2]
		if (err != null) {
			$.pointerValue<inputReader>(i).atEOT = true
			return [$.int(-1, 32), 0]
		}
		$.pointerValue<inputReader>(i).pos = $.pointerValue<inputReader>(i).pos + (w)
		return [$.int(r, 32), w]
	}

	static __typeInfo = $.registerStructType(
		"regexp.inputReader",
		() => new inputReader(),
		[{ name: "canCheckPrefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "context", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64", typeName: "regexp.lazyFlag" } }] }, { name: "hasPrefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "index", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		inputReader,
		[{ name: "r", key: "r", type: "io.RuneReader" }, { name: "atEOT", key: "atEOT", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "pos", key: "pos", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export const endOfText: number = -1

export const startSize: number = 10

export async function Compile(expr: string): globalThis.Promise<[Regexp | $.VarRef<Regexp> | null, $.GoError]> {
	return compile(expr, $.uint(syntax.Perl, 16), false)
}

export async function CompilePOSIX(expr: string): globalThis.Promise<[Regexp | $.VarRef<Regexp> | null, $.GoError]> {
	return compile(expr, $.uint(syntax.POSIX, 16), true)
}

export async function compile(expr: string, mode: syntax.Flags, longest: boolean): globalThis.Promise<[Regexp | $.VarRef<Regexp> | null, $.GoError]> {
	let __goscriptTuple17: any = await syntax.Parse(expr, $.uint(mode, 16))
	let re: syntax.Regexp | $.VarRef<syntax.Regexp> | null = __goscriptTuple17[0]
	let err = __goscriptTuple17[1]
	if (err != null) {
		return [null, err]
	}
	let maxCap = syntax.Regexp.prototype.MaxCap.call(re)
	let capNames: $.Slice<string> = syntax.Regexp.prototype.CapNames.call(re)

	re = syntax.Regexp.prototype.Simplify.call(re)
	let __goscriptTuple18: any = syntax.Compile(re)
	let prog: syntax.Prog | $.VarRef<syntax.Prog> | null = __goscriptTuple18[0]
	err = __goscriptTuple18[1]
	if (err != null) {
		return [null, err]
	}
	let matchcap = $.pointerValue<syntax.Prog>(prog).NumCap
	if (matchcap < 2) {
		matchcap = 2
	}
	let regexp: Regexp | $.VarRef<Regexp> | null = (await (async () => { const __goscriptLiteralField0 = await __goscript_onepass.compileOnePass(prog); const __goscriptLiteralField1 = $.uint(syntax.Prog.prototype.StartCond.call(prog), 8); const __goscriptLiteralField2 = minInputLen(re); return new Regexp({expr: expr, prog: prog, onepass: __goscriptLiteralField0, numSubexp: maxCap, subexpNames: capNames, cond: __goscriptLiteralField1, longest: longest, matchcap: matchcap, minInputLen: __goscriptLiteralField2}) })())
	if ($.pointerValue<Regexp>(regexp).onepass == null) {
		let __goscriptTuple19: any = syntax.Prog.prototype.Prefix.call(prog)
		$.pointerValue<Regexp>(regexp).prefix = __goscriptTuple19[0]
		$.pointerValue<Regexp>(regexp).prefixComplete = __goscriptTuple19[1]
		$.pointerValue<Regexp>(regexp).maxBitStateLen = __goscript_backtrack.maxBitStateLen(prog)
	} else {
		let __goscriptTuple20: any = __goscript_onepass.onePassPrefix(prog)
		$.pointerValue<Regexp>(regexp).prefix = __goscriptTuple20[0]
		$.pointerValue<Regexp>(regexp).prefixComplete = __goscriptTuple20[1]
		$.pointerValue<Regexp>(regexp).prefixEnd = $.uint(__goscriptTuple20[2], 32)
	}
	if (!$.stringEqual($.pointerValue<Regexp>(regexp).prefix, "")) {
		// TODO(rsc): Remove this allocation by adding
		// IndexString to package bytes.
		$.pointerValue<Regexp>(regexp).prefixBytes = $.stringToBytes($.pointerValue<Regexp>(regexp).prefix)
		let __goscriptTuple21: any = utf8.DecodeRuneInString($.pointerValue<Regexp>(regexp).prefix)
		$.pointerValue<Regexp>(regexp).prefixRune = $.int(__goscriptTuple21[0], 32)
	}

	let n = $.len($.pointerValue<syntax.Prog>(prog).Inst)
	let i = 0
	while (($.arrayIndex(matchSize, i) != 0) && ($.arrayIndex(matchSize, i) < n)) {
		i++
	}
	$.pointerValue<Regexp>(regexp).mpool = i

	return [regexp, null]
}

export let matchSize: number[] = [128, 512, 2048, 16384, 0]

export function __goscript_set_matchSize(__goscriptValue: number[]): void {
	matchSize = __goscriptValue
}

export let matchPool: sync.Pool[] = Array.from({ length: 5 }, () => $.markAsStructValue(new sync.Pool()))

export function __goscript_set_matchPool(__goscriptValue: sync.Pool[]): void {
	matchPool = __goscriptValue
}

export function minInputLen(re: syntax.Regexp | $.VarRef<syntax.Regexp> | null): number {
	switch ($.pointerValue<syntax.Regexp>(re).Op) {
		default:
		{
			return 0
			break
		}
		case syntax.OpAnyChar:
		case syntax.OpAnyCharNotNL:
		case syntax.OpCharClass:
		{
			return 1
			break
		}
		case syntax.OpLiteral:
		{
			let l = 0
			for (let __goscriptRangeTarget9 = $.pointerValue<syntax.Regexp>(re).Rune, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
				let r = __goscriptRangeTarget9![__rangeIndex]
				if ($.int(r, 32) == $.int(utf8.RuneError, 32)) {
					l++
				} else {
					l = l + (utf8.RuneLen($.int(r, 32)))
				}
			}
			return l
			break
		}
		case syntax.OpCapture:
		case syntax.OpPlus:
		{
			return minInputLen($.arrayIndex($.pointerValue<syntax.Regexp>(re).Sub!, 0))
			break
		}
		case syntax.OpRepeat:
		{
			return $.pointerValue<syntax.Regexp>(re).Min * minInputLen($.arrayIndex($.pointerValue<syntax.Regexp>(re).Sub!, 0))
			break
		}
		case syntax.OpConcat:
		{
			let l = 0
			for (let __goscriptRangeTarget10 = $.pointerValue<syntax.Regexp>(re).Sub, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
				let sub = __goscriptRangeTarget10![__rangeIndex]
				l = l + (minInputLen(sub))
			}
			return l
			break
		}
		case syntax.OpAlternate:
		{
			let l = minInputLen($.arrayIndex($.pointerValue<syntax.Regexp>(re).Sub!, 0))
			let lnext: number = 0
			for (let __goscriptRangeTarget11 = $.goSlice($.pointerValue<syntax.Regexp>(re).Sub, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
				let sub = __goscriptRangeTarget11![__rangeIndex]
				lnext = minInputLen(sub)
				if (lnext < l) {
					l = lnext
				}
			}
			return l
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function MustCompile(str: string): globalThis.Promise<Regexp | $.VarRef<Regexp> | null> {
	let __goscriptTuple22: any = await Compile(str)
	let regexp: Regexp | $.VarRef<Regexp> | null = __goscriptTuple22[0]
	let err = __goscriptTuple22[1]
	if (err != null) {
		$.panic((("regexp: Compile(" + quote(str)) + "): ") + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
	return regexp
}

export async function MustCompilePOSIX(str: string): globalThis.Promise<Regexp | $.VarRef<Regexp> | null> {
	let __goscriptTuple23: any = await CompilePOSIX(str)
	let regexp: Regexp | $.VarRef<Regexp> | null = __goscriptTuple23[0]
	let err = __goscriptTuple23[1]
	if (err != null) {
		$.panic((("regexp: CompilePOSIX(" + quote(str)) + "): ") + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
	return regexp
}

export function quote(s: string): string {
	if (strconv.CanBackquote(s)) {
		return ("`" + s) + "`"
	}
	return strconv.Quote(s)
}

export type input = {
	canCheckPrefix(): boolean
	context(pos: number): __goscript_exec.lazyFlag
	hasPrefix(re: Regexp | $.VarRef<Regexp> | null): boolean
	index(re: Regexp | $.VarRef<Regexp> | null, pos: number): number
	step(pos: number): [number, number] | globalThis.Promise<[number, number]>
}

$.registerInterfaceType(
	"regexp.input",
	null,
	[{ name: "canCheckPrefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "context", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64", typeName: "regexp.lazyFlag" } }] }, { name: "hasPrefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "index", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "step", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int32" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export async function MatchReader(pattern: string, r: io.RuneReader | null): globalThis.Promise<[boolean, $.GoError]> {
	let matched: boolean = false
	let err: $.GoError = null as $.GoError
	let __goscriptTuple29: any = await Compile(pattern)
	let re: Regexp | $.VarRef<Regexp> | null = __goscriptTuple29[0]
	err = __goscriptTuple29[1]
	if (err != null) {
		return [false, err]
	}
	return [await Regexp.prototype.MatchReader.call(re, r), null]
}

export async function MatchString(pattern: string, s: string): globalThis.Promise<[boolean, $.GoError]> {
	let matched: boolean = false
	let err: $.GoError = null as $.GoError
	let __goscriptTuple30: any = await Compile(pattern)
	let re: Regexp | $.VarRef<Regexp> | null = __goscriptTuple30[0]
	err = __goscriptTuple30[1]
	if (err != null) {
		return [false, err]
	}
	return [await Regexp.prototype.MatchString.call(re, s), null]
}

export async function Match(pattern: string, b: $.Slice<number>): globalThis.Promise<[boolean, $.GoError]> {
	let matched: boolean = false
	let err: $.GoError = null as $.GoError
	let __goscriptTuple31: any = await Compile(pattern)
	let re: Regexp | $.VarRef<Regexp> | null = __goscriptTuple31[0]
	err = __goscriptTuple31[1]
	if (err != null) {
		return [false, err]
	}
	return [await Regexp.prototype.Match.call(re, b), null]
}

export let specialBytes: Uint8Array = new Uint8Array(16)

export function __goscript_set_specialBytes(__goscriptValue: Uint8Array): void {
	specialBytes = __goscriptValue
}

export function special(b: number): boolean {
	return ($.uint(b, 8) < $.uint(utf8.RuneSelf, 8)) && ($.uint(($.arrayIndex(specialBytes, b % 16) & (1 << (Math.trunc(b / 16)))), 8) != $.uint(0, 8))
}

function __goscriptInit0(): void {
	for (let __goscriptRangeTarget12 = new Uint8Array([92, 46, 43, 42, 63, 40, 41, 124, 91, 93, 123, 125, 94, 36]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
		let b = __goscriptRangeTarget12![__rangeIndex]
		specialBytes[b % 16] = specialBytes[b % 16] | ($.uint(1 << (Math.trunc(b / 16)), 8))
	}
}

export function QuoteMeta(s: string): string {
	// A byte loop is correct because all metacharacters are ASCII.
	let i: number = 0
	for (i = 0; i < $.len(s); i++) {
		if (special($.uint($.indexStringOrBytes(s, i), 8))) {
			break
		}
	}
	// No meta characters found, so return original string.
	if (i >= $.len(s)) {
		return s
	}

	let b: $.Slice<number> = $.makeSlice<number>((2 * $.len(s)) - i, undefined, "byte")
	$.copy(b, $.sliceStringOrBytes(s, undefined, i))
	let j = i
	for (; i < $.len(s); i++) {
		if (special($.uint($.indexStringOrBytes(s, i), 8))) {
			b![j] = $.uint(92, 8)
			j++
		}
		b![j] = $.uint($.indexStringOrBytes(s, i), 8)
		j++
	}
	return $.bytesToString($.goSlice(b, undefined, j))
}

export function extract(str: string): [string, number, string, boolean] {
	let name: string = ""
	let num: number = 0
	let rest: string = ""
	let ok: boolean = false
	if ($.stringEqual(str, "")) {
		return [name, num, rest, ok]
	}
	let brace = false
	if ($.uint($.indexStringOrBytes(str, 0), 8) == $.uint(123, 8)) {
		brace = true
		str = $.sliceStringOrBytes(str, 1, undefined)
	}
	let i = 0
	while (i < $.len(str)) {
		let __goscriptTuple32: any = utf8.DecodeRuneInString($.sliceStringOrBytes(str, i, undefined))
		let rune = $.int(__goscriptTuple32[0], 32)
		let size = __goscriptTuple32[1]
		if ((!unicode.IsLetter($.int(rune, 32)) && !unicode.IsDigit($.int(rune, 32))) && ($.int(rune, 32) != $.int(95, 32))) {
			break
		}
		i = i + (size)
	}
	if (i == 0) {
		// empty name is not okay
		return [name, num, rest, ok]
	}
	name = $.sliceStringOrBytes(str, undefined, i)
	if (brace) {
		if ((i >= $.len(str)) || ($.uint($.indexStringOrBytes(str, i), 8) != $.uint(125, 8))) {
			// missing closing brace
			return [name, num, rest, ok]
		}
		i++
	}

	// Parse number.
	num = 0
	for (let __goscriptShadow3 = 0; __goscriptShadow3 < $.len(name); __goscriptShadow3++) {
		if ((($.uint($.indexStringOrBytes(name, __goscriptShadow3), 8) < $.uint(48, 8)) || ($.uint(57, 8) < $.uint($.indexStringOrBytes(name, __goscriptShadow3), 8))) || (num >= 1e8)) {
			num = -1
			break
		}
		num = ((num * 10) + $.int($.indexStringOrBytes(name, __goscriptShadow3))) - 48
	}
	// Disallow leading zeros.
	if (($.uint($.indexStringOrBytes(name, 0), 8) == $.uint(48, 8)) && ($.len(name) > 1)) {
		num = -1
	}

	rest = $.sliceStringOrBytes(str, i, undefined)
	ok = true
	return [name, num, rest, ok]
}

__goscriptInit0()
