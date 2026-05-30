// Generated file based on util.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as pool from "@goscript/github.com/libp2p/go-buffer-pool/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/github.com/libp2p/go-buffer-pool/index.js"

export class segmentedBuffer {
	public get cap(): number {
		return this._fields.cap.value
	}
	public set cap(value: number) {
		this._fields.cap.value = value
	}

	public get len(): number {
		return this._fields.len.value
	}
	public set len(value: number) {
		this._fields.len.value = value
	}

	public get bm(): sync.Mutex {
		return this._fields.bm.value
	}
	public set bm(value: sync.Mutex) {
		this._fields.bm.value = value
	}

	// read position in b[bPos].
	// We must not reslice any of the buffers in b, as we need to put them back into the pool.
	public get readPos(): number {
		return this._fields.readPos.value
	}
	public set readPos(value: number) {
		this._fields.readPos.value = value
	}

	// bPos is an index in b slice. If bPos == len(b), it means that buffer is empty.
	public get bPos(): number {
		return this._fields.bPos.value
	}
	public set bPos(value: number) {
		this._fields.bPos.value = value
	}

	// b is used as a growable buffer. Each Append adds []byte to the end of b.
	// If there is no space available at the end of the buffer (len(b) == cap(b)), but it has space
	// at the beginning (bPos > 0 and at least 1/4 of the buffer is empty), data inside b is shifted to the beginning.
	// Each Read reads from b[bPos] and increments bPos if b[bPos] was fully read.
	public get b(): $.Slice<$.Slice<number>> {
		return this._fields.b.value
	}
	public set b(value: $.Slice<$.Slice<number>>) {
		this._fields.b.value = value
	}

	public _fields: {
		cap: $.VarRef<number>
		len: $.VarRef<number>
		bm: $.VarRef<sync.Mutex>
		readPos: $.VarRef<number>
		bPos: $.VarRef<number>
		b: $.VarRef<$.Slice<$.Slice<number>>>
	}

	constructor(init?: Partial<{cap?: number, len?: number, bm?: sync.Mutex, readPos?: number, bPos?: number, b?: $.Slice<$.Slice<number>>}>) {
		this._fields = {
			cap: $.varRef(init?.cap ?? 0),
			len: $.varRef(init?.len ?? 0),
			bm: $.varRef(init?.bm ? $.markAsStructValue($.cloneStructValue(init.bm)) : $.markAsStructValue(new sync.Mutex())),
			readPos: $.varRef(init?.readPos ?? 0),
			bPos: $.varRef(init?.bPos ?? 0),
			b: $.varRef(init?.b ?? null)
		}
	}

	public clone(): segmentedBuffer {
		const cloned = new segmentedBuffer()
		cloned._fields = {
			cap: $.varRef(this._fields.cap.value),
			len: $.varRef(this._fields.len.value),
			bm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.bm.value))),
			readPos: $.varRef(this._fields.readPos.value),
			bPos: $.varRef(this._fields.bPos.value),
			b: $.varRef(this._fields.b.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Append(input: io.Reader | null, length: number): globalThis.Promise<$.GoError> {
		let s: segmentedBuffer | $.VarRef<segmentedBuffer> | null = this
		using __defer = new $.DisposableStack()
		{
			let err = await segmentedBuffer.prototype.checkOverflow.call(s, $.uint(length, 32))
			if (err != null) {
				return err
			}
		}

		let dst: $.Slice<number> = await pool.Get($.int(length))
		let [n, err] = await io.ReadFull($.pointerValueOrNil(input)!, dst)
		if ($.comparableEqual(err, io.EOF)) {
			err = io.ErrUnexpectedEOF
		}
		await $.pointerValue<segmentedBuffer>(s).bm.Lock()
		__defer.defer(() => { $.pointerValue<segmentedBuffer>(s).bm.Unlock() })
		if (n > 0) {
			$.pointerValue<segmentedBuffer>(s).len = $.pointerValue<segmentedBuffer>(s).len + ($.uint($.uint(n, 32), 32))
			$.pointerValue<segmentedBuffer>(s).cap = $.pointerValue<segmentedBuffer>(s).cap - ($.uint($.uint(n, 32), 32))
			// s.b has no available space at the end, but has space at the beginning
			if (($.len($.pointerValue<segmentedBuffer>(s).b) == $.cap($.pointerValue<segmentedBuffer>(s).b)) && ($.pointerValue<segmentedBuffer>(s).bPos > 0)) {
				if ($.pointerValue<segmentedBuffer>(s).bPos == $.len($.pointerValue<segmentedBuffer>(s).b)) {
					// the buffer is empty, so just move pos
					$.pointerValue<segmentedBuffer>(s).bPos = 0
					$.pointerValue<segmentedBuffer>(s).b = $.goSlice($.pointerValue<segmentedBuffer>(s).b, undefined, 0)
				} else {
					if ($.pointerValue<segmentedBuffer>(s).bPos > (Math.trunc($.cap($.pointerValue<segmentedBuffer>(s).b) / 4))) {
						// at least 1/4 of buffer is empty, so shift data to the left to free space at the end
						let copied = $.copy($.pointerValue<segmentedBuffer>(s).b, $.goSlice($.pointerValue<segmentedBuffer>(s).b, $.pointerValue<segmentedBuffer>(s).bPos, undefined))
						// clear references to copied data
						for (let i = copied; i < $.len($.pointerValue<segmentedBuffer>(s).b); i++) {
							$.pointerValue<segmentedBuffer>(s).b![i] = null
						}
						$.pointerValue<segmentedBuffer>(s).b = $.goSlice($.pointerValue<segmentedBuffer>(s).b, undefined, copied)
						$.pointerValue<segmentedBuffer>(s).bPos = 0
					}
				}
			}
			$.pointerValue<segmentedBuffer>(s).b = $.append($.pointerValue<segmentedBuffer>(s).b, $.goSlice(dst, 0, n))
		}
		return err
	}

	public async GrowTo(max: number, force: boolean): globalThis.Promise<[boolean, number]> {
		let s: segmentedBuffer | $.VarRef<segmentedBuffer> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<segmentedBuffer>(s).bm.Lock()
		__defer.defer(() => { $.pointerValue<segmentedBuffer>(s).bm.Unlock() })

		let currentWindow = $.uint($.pointerValue<segmentedBuffer>(s).cap + $.pointerValue<segmentedBuffer>(s).len, 32)
		if (currentWindow >= max) {
			return [force, $.uint(0, 32)]
		}
		let delta = $.uint(max - currentWindow, 32)

		if ((delta < (Math.trunc(max / 2))) && !force) {
			return [false, $.uint(0, 32)]
		}

		$.pointerValue<segmentedBuffer>(s).cap = $.pointerValue<segmentedBuffer>(s).cap + ($.uint(delta, 32))
		return [true, $.uint(delta, 32)]
	}

	public async Len(): globalThis.Promise<number> {
		const s: segmentedBuffer | $.VarRef<segmentedBuffer> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<segmentedBuffer>(s).bm.Lock()
		__defer.defer(() => { $.pointerValue<segmentedBuffer>(s).bm.Unlock() })
		return $.uint($.pointerValue<segmentedBuffer>(s).len, 32)
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let s: segmentedBuffer | $.VarRef<segmentedBuffer> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<segmentedBuffer>(s).bm.Lock()
		__defer.defer(() => { $.pointerValue<segmentedBuffer>(s).bm.Unlock() })
		if ($.pointerValue<segmentedBuffer>(s).bPos == $.len($.pointerValue<segmentedBuffer>(s).b)) {
			return [0, io.EOF]
		}
		let data: $.Slice<number> = $.goSlice($.pointerValue<segmentedBuffer>(s).b![$.pointerValue<segmentedBuffer>(s).bPos], $.pointerValue<segmentedBuffer>(s).readPos, undefined)
		let n = $.copy(b, data)
		if (n == $.len(data)) {
			await pool.Put($.pointerValue<segmentedBuffer>(s).b![$.pointerValue<segmentedBuffer>(s).bPos])
			$.pointerValue<segmentedBuffer>(s).b![$.pointerValue<segmentedBuffer>(s).bPos] = null
			$.pointerValue<segmentedBuffer>(s).bPos++
			$.pointerValue<segmentedBuffer>(s).readPos = 0
		} else {
			$.pointerValue<segmentedBuffer>(s).readPos = $.pointerValue<segmentedBuffer>(s).readPos + (n)
		}
		if (n > 0) {
			$.pointerValue<segmentedBuffer>(s).len = $.pointerValue<segmentedBuffer>(s).len - ($.uint($.uint(n, 32), 32))
		}
		return [n, null]
	}

	public async checkOverflow(l: number): globalThis.Promise<$.GoError> {
		const s: segmentedBuffer | $.VarRef<segmentedBuffer> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<segmentedBuffer>(s).bm.Lock()
		__defer.defer(() => { $.pointerValue<segmentedBuffer>(s).bm.Unlock() })
		if ($.pointerValue<segmentedBuffer>(s).cap < l) {
			return fmt.Errorf("receive window exceeded (remain: %d, recv: %d)", $.namedValueInterfaceValue<any>($.pointerValue<segmentedBuffer>(s).cap, "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }), $.namedValueInterfaceValue<any>(l, "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }))
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"yamux.segmentedBuffer",
		() => new segmentedBuffer(),
		[{ name: "Append", args: [{ name: "input", type: "io.Reader" }, { name: "length", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "GrowTo", args: [{ name: "max", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "force", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "checkOverflow", args: [{ name: "l", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: "error" }] }],
		segmentedBuffer,
		[{ name: "cap", key: "cap", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 4, exported: false }, { name: "bm", key: "bm", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 8, exported: false }, { name: "readPos", key: "readPos", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 16, exported: false }, { name: "bPos", key: "bPos", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 24, exported: false }, { name: "b", key: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [5], offset: 32, exported: false }]
	)
}

export async function asyncSendErr(ch: $.Channel<$.GoError> | null, err: $.GoError): globalThis.Promise<void> {
	if (ch == null) {
		return
	}
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch,
			value: err,
			onSelected: async (__goscriptSelect0Result) => {
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
}

export async function asyncNotify(ch: $.Channel<{}> | null): globalThis.Promise<void> {
	const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: true,
			channel: ch,
			value: {},
			onSelected: async (__goscriptSelect1Result) => {
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect1Result) => {
			}
		}
	], true)
	if (__goscriptSelect1HasReturn) {
		return __goscriptSelect1Value
	}
}

export function min(values: $.Slice<number>): number {
	let m = $.uint(values![0], 32)
	for (let __goscriptRangeTarget0 = $.goSlice(values, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		if (v < m) {
			m = $.uint(v, 32)
		}
	}
	return $.uint(m, 32)
}

export function newSegmentedBuffer(initialCapacity: number): segmentedBuffer {
	return $.markAsStructValue(new segmentedBuffer({cap: $.uint(initialCapacity, 32), b: $.makeSlice<$.Slice<number>>(0, 16)}))
}
