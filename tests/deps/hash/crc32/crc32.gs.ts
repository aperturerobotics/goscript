// Generated file based on crc32.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as __goscript_crc32_generic from "./crc32_generic.gs.ts"

import * as __goscript_crc32_otherarch from "./crc32_otherarch.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./crc32_generic.gs.ts"
import "./crc32_otherarch.gs.ts"

export type Table = number[]

export class digest {
	public get crc(): number {
		return this._fields.crc.value
	}
	public set crc(value: number) {
		this._fields.crc.value = value
	}

	public get tab(): $.VarRef<Table> | null {
		return this._fields.tab.value
	}
	public set tab(value: $.VarRef<Table> | null) {
		this._fields.tab.value = value
	}

	public _fields: {
		crc: $.VarRef<number>
		tab: $.VarRef<$.VarRef<Table> | null>
	}

	constructor(init?: Partial<{crc?: number, tab?: $.VarRef<Table> | null}>) {
		this._fields = {
			crc: $.varRef(init?.crc ?? 0),
			tab: $.varRef(init?.tab ?? null)
		}
	}

	public clone(): digest {
		const cloned = new digest()
		cloned._fields = {
			crc: $.varRef(this._fields.crc.value),
			tab: $.varRef(this._fields.tab.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AppendBinary(b: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const d: digest | $.VarRef<digest> | null = this
		b = $.append(b, ...($.stringToBytes("crc\x01") ?? []))
		b = byteorder.BEAppendUint32(b, $.uint(await tableSum($.pointerValue<digest>(d).tab), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.pointerValue<digest>(d).crc, 32))
		return [b, null]
	}

	public BlockSize(): number {
		const d: digest | $.VarRef<digest> | null = this
		return 1
	}

	public Clone(): [hash.Cloner | null, $.GoError] {
		const d: digest | $.VarRef<digest> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<digest>(d))))
		return [$.interfaceValue<hash.Cloner | null>(r, "*crc32.digest"), null]
	}

	public async MarshalBinary(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const d: digest | $.VarRef<digest> | null = this
		return await digest.prototype.AppendBinary.call(d, $.makeSlice<number>(0, 12, "byte"))
	}

	public Reset(): void {
		let d: digest | $.VarRef<digest> | null = this
		$.pointerValue<digest>(d).crc = $.uint(0, 32)
	}

	public Size(): number {
		const d: digest | $.VarRef<digest> | null = this
		return 4
	}

	public Sum(_in: $.Slice<number>): $.Slice<number> {
		const d: digest | $.VarRef<digest> | null = this
		let s = $.uint(digest.prototype.Sum32.call(d), 32)
		return $.append(_in, $.uint($.uint($.uintShr(s, 24, 32), 8), 8), $.uint($.uint($.uintShr(s, 16, 32), 8), 8), $.uint($.uint($.uintShr(s, 8, 32), 8), 8), $.uint($.uint(s, 8), 8))
	}

	public Sum32(): number {
		const d: digest | $.VarRef<digest> | null = this
		return $.uint($.pointerValue<digest>(d).crc, 32)
	}

	public async UnmarshalBinary(b: $.Slice<number>): globalThis.Promise<$.GoError> {
		let d: digest | $.VarRef<digest> | null = this
		if (($.len(b) < 4) || (!$.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "crc\x01"))) {
			return errors.New("hash/crc32: invalid hash state identifier")
		}
		if ($.len(b) != 12) {
			return errors.New("hash/crc32: invalid hash state size")
		}
		if ($.uint(await tableSum($.pointerValue<digest>(d).tab), 32) != $.uint(byteorder.BEUint32($.goSlice(b, 4, undefined)), 32)) {
			return errors.New("hash/crc32: tables do not match")
		}
		$.pointerValue<digest>(d).crc = $.uint(byteorder.BEUint32($.goSlice(b, 8, undefined)), 32)
		return null
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let d: digest | $.VarRef<digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		// We only create digest objects through New() which takes care of
		// initialization in this case.
		$.pointerValue<digest>(d).crc = $.uint(await update($.uint($.pointerValue<digest>(d).crc, 32), $.pointerValue<digest>(d).tab, p, false), 32)
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"crc32.digest",
		() => new digest(),
		[{ name: "AppendBinary", args: [], returns: [] }, { name: "BlockSize", args: [], returns: [] }, { name: "Clone", args: [], returns: [] }, { name: "MarshalBinary", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [] }, { name: "Sum", args: [], returns: [] }, { name: "Sum32", args: [], returns: [] }, { name: "UnmarshalBinary", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		digest,
		[{ name: "crc", key: "crc", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "hash/crc32", index: [0], offset: 0, exported: false }, { name: "tab", key: "tab", type: { kind: $.TypeKind.Pointer, elemType: "crc32.Table" }, pkgPath: "hash/crc32", index: [1], offset: 8, exported: false }]
	)
}

export const Size: number = 4

export const IEEE: number = 3988292384

export const Castagnoli: number = 2197175160

export const Koopman: number = 3945912366

export const magic: string = "crc\x01"

export const marshaledSize: number = 12

export let castagnoliTable: $.VarRef<Table> | null = null as $.VarRef<Table> | null

export function __goscript_set_castagnoliTable(__goscriptValue: $.VarRef<Table> | null): void {
	castagnoliTable = __goscriptValue
}

export let castagnoliTable8: $.VarRef<__goscript_crc32_generic.slicing8Table> | null = null as $.VarRef<__goscript_crc32_generic.slicing8Table> | null

export function __goscript_set_castagnoliTable8(__goscriptValue: $.VarRef<__goscript_crc32_generic.slicing8Table> | null): void {
	castagnoliTable8 = __goscriptValue
}

export let updateCastagnoli: $.VarRef<((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null> = $.varRef(null as unknown as ((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null)

export function __goscript_set_updateCastagnoli(__goscriptValue: ((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null): void {
	updateCastagnoli.value = __goscriptValue
}

export let haveCastagnoli: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))

export function __goscript_set_haveCastagnoli(__goscriptValue: atomic.Bool): void {
	haveCastagnoli.value = __goscriptValue
}

export var castagnoliInitOnce: (() => void) | null

export function __goscript_init_castagnoliInitOnce(): void {
	if (((castagnoliInitOnce) as any) === undefined) {
		castagnoliInitOnce = sync.OnceFunc($.functionValue((): void => {
	castagnoliTable = __goscript_crc32_generic.simpleMakeTable($.uint(2197175160, 32))

	if (__goscript_crc32_otherarch.archAvailableCastagnoli()) {
		__goscript_crc32_otherarch.archInitCastagnoli()
		updateCastagnoli.value = __goscript_crc32_otherarch.archUpdateCastagnoli
	} else {
		// Initialize the slicing-by-8 table.
		castagnoliTable8 = __goscript_crc32_generic.slicingMakeTable($.uint(2197175160, 32))
		updateCastagnoli.value = $.functionValue((crc: number, p: $.Slice<number>): number => {
			return $.uint(__goscript_crc32_generic.slicingUpdate($.uint(crc, 32), castagnoliTable8, p), 32)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint32" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "uint32" }] } as $.FunctionTypeInfo))
	}

	haveCastagnoli.value.Store(true)
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_castagnoliInitOnce(): (() => void) | null {
	if (((castagnoliInitOnce) as any) === undefined) {
		__goscript_init_castagnoliInitOnce()
	}
	return castagnoliInitOnce
}

export function __goscript_set_castagnoliInitOnce(__goscriptValue: (() => void) | null): void {
	castagnoliInitOnce = __goscriptValue
}

export var IEEETable: $.VarRef<Table> | null

export function __goscript_init_IEEETable(): void {
	if (((IEEETable) as any) === undefined) {
		IEEETable = __goscript_crc32_generic.simpleMakeTable($.uint(3988292384, 32))
	}
}

export function __goscript_get_IEEETable(): $.VarRef<Table> | null {
	if (((IEEETable) as any) === undefined) {
		__goscript_init_IEEETable()
	}
	return IEEETable
}

export function __goscript_set_IEEETable(__goscriptValue: $.VarRef<Table> | null): void {
	IEEETable = __goscriptValue
}

export let ieeeTable8: $.VarRef<__goscript_crc32_generic.slicing8Table> | null = null as $.VarRef<__goscript_crc32_generic.slicing8Table> | null

export function __goscript_set_ieeeTable8(__goscriptValue: $.VarRef<__goscript_crc32_generic.slicing8Table> | null): void {
	ieeeTable8 = __goscriptValue
}

export let updateIEEE: $.VarRef<((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null> = $.varRef(null as unknown as ((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null)

export function __goscript_set_updateIEEE(__goscriptValue: ((crc: number, p: $.Slice<number>) => number | globalThis.Promise<number>) | null): void {
	updateIEEE.value = __goscriptValue
}

export var ieeeInitOnce: (() => void) | null

export function __goscript_init_ieeeInitOnce(): void {
	if (((ieeeInitOnce) as any) === undefined) {
		ieeeInitOnce = sync.OnceFunc($.functionValue((): void => {
	if (__goscript_crc32_otherarch.archAvailableIEEE()) {
		__goscript_crc32_otherarch.archInitIEEE()
		updateIEEE.value = __goscript_crc32_otherarch.archUpdateIEEE
	} else {
		// Initialize the slicing-by-8 table.
		ieeeTable8 = __goscript_crc32_generic.slicingMakeTable($.uint(3988292384, 32))
		updateIEEE.value = $.functionValue((crc: number, p: $.Slice<number>): number => {
			return $.uint(__goscript_crc32_generic.slicingUpdate($.uint(crc, 32), ieeeTable8, p), 32)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint32" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Basic, name: "uint32" }] } as $.FunctionTypeInfo))
	}
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_ieeeInitOnce(): (() => void) | null {
	if (((ieeeInitOnce) as any) === undefined) {
		__goscript_init_ieeeInitOnce()
	}
	return ieeeInitOnce
}

export function __goscript_set_ieeeInitOnce(__goscriptValue: (() => void) | null): void {
	ieeeInitOnce = __goscriptValue
}

export async function MakeTable(poly: number): globalThis.Promise<$.VarRef<Table> | null> {
	switch (poly) {
		case 3988292384:
		{
			await __goscript_get_ieeeInitOnce()!()
			return __goscript_get_IEEETable()
			break
		}
		case 2197175160:
		{
			await __goscript_get_castagnoliInitOnce()!()
			return castagnoliTable
			break
		}
		default:
		{
			return __goscript_crc32_generic.simpleMakeTable($.uint(poly, 32))
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function New(tab: $.VarRef<Table> | null): globalThis.Promise<hash.Hash32 | null> {
	if (tab == __goscript_get_IEEETable()) {
		await __goscript_get_ieeeInitOnce()!()
	}
	return $.interfaceValue<hash.Hash32 | null>(new digest({crc: $.uint(0, 32), tab: tab}), "*crc32.digest")
}

export async function NewIEEE(): globalThis.Promise<hash.Hash32 | null> {
	return await New(__goscript_get_IEEETable())
}

export async function update(crc: number, tab: $.VarRef<Table> | null, p: $.Slice<number>, checkInitIEEE: boolean): globalThis.Promise<number> {
	switch (true) {
		case haveCastagnoli.value.Load() && (tab == castagnoliTable):
		{
			return $.uint(await updateCastagnoli.value!($.uint(crc, 32), p), 32)
			break
		}
		case tab == __goscript_get_IEEETable():
		{
			if (checkInitIEEE) {
				await __goscript_get_ieeeInitOnce()!()
			}
			return $.uint(await updateIEEE.value!($.uint(crc, 32), p), 32)
			break
		}
		default:
		{
			return $.uint(__goscript_crc32_generic.simpleUpdate($.uint(crc, 32), tab, p), 32)
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function Update(crc: number, tab: $.VarRef<Table> | null, p: $.Slice<number>): globalThis.Promise<number> {
	// Unfortunately, because IEEETable is exported, IEEE may be used without a
	// call to MakeTable. We have to make sure it gets initialized in that case.
	return $.uint(await update($.uint(crc, 32), tab, p, true), 32)
}

export async function Checksum(data: $.Slice<number>, tab: $.VarRef<Table> | null): globalThis.Promise<number> {
	return $.uint(await Update($.uint(0, 32), tab, data), 32)
}

export async function ChecksumIEEE(data: $.Slice<number>): globalThis.Promise<number> {
	await __goscript_get_ieeeInitOnce()!()
	return $.uint(await updateIEEE.value!($.uint(0, 32), data), 32)
}

export async function tableSum(t: $.VarRef<Table> | null): globalThis.Promise<number> {
	let a: Uint8Array = new Uint8Array(1024)
	let b: $.Slice<number> = $.goSlice(a, undefined, 0)
	if (t != null) {
		for (let __goscriptRangeTarget0 = $.pointerValue<number[]>(t), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let x = __goscriptRangeTarget0![__rangeIndex]
			b = byteorder.BEAppendUint32(b, $.uint(x, 32))
		}
	}
	return $.uint(await ChecksumIEEE(b), 32)
}
