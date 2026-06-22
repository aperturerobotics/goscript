// Generated file based on dict_decoder.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class dictDecoder {
	public get hist(): $.Slice<number> {
		return this._fields.hist.value
	}
	public set hist(value: $.Slice<number>) {
		this._fields.hist.value = value
	}

	// Invariant: 0 <= rdPos <= wrPos <= len(hist)
	public get wrPos(): number {
		return this._fields.wrPos.value
	}
	public set wrPos(value: number) {
		this._fields.wrPos.value = value
	}

	public get rdPos(): number {
		return this._fields.rdPos.value
	}
	public set rdPos(value: number) {
		this._fields.rdPos.value = value
	}

	public get full(): boolean {
		return this._fields.full.value
	}
	public set full(value: boolean) {
		this._fields.full.value = value
	}

	public _fields: {
		hist: $.VarRef<$.Slice<number>>
		wrPos: $.VarRef<number>
		rdPos: $.VarRef<number>
		full: $.VarRef<boolean>
	}

	constructor(init?: Partial<{hist?: $.Slice<number>, wrPos?: number, rdPos?: number, full?: boolean}>) {
		this._fields = {
			hist: $.varRef(init?.hist ?? (null as unknown as $.Slice<number>)),
			wrPos: $.varRef(init?.wrPos ?? (0 as unknown as number)),
			rdPos: $.varRef(init?.rdPos ?? (0 as unknown as number)),
			full: $.varRef(init?.full ?? (false as unknown as boolean))
		}
	}

	public clone(): dictDecoder {
		const cloned = new dictDecoder()
		cloned._fields = {
			hist: $.varRef(this._fields.hist.value),
			wrPos: $.varRef(this._fields.wrPos.value),
			rdPos: $.varRef(this._fields.rdPos.value),
			full: $.varRef(this._fields.full.value)
		}
		return $.markAsStructValue(cloned)
	}

	public availRead(): number {
		const dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		return $.pointerValue<dictDecoder>(dd).wrPos - $.pointerValue<dictDecoder>(dd).rdPos
	}

	public availWrite(): number {
		const dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		return $.len($.pointerValue<dictDecoder>(dd).hist) - $.pointerValue<dictDecoder>(dd).wrPos
	}

	public histSize(): number {
		const dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		if ($.pointerValue<dictDecoder>(dd).full) {
			return $.len($.pointerValue<dictDecoder>(dd).hist)
		}
		return $.pointerValue<dictDecoder>(dd).wrPos
	}

	public init(size: number, dict: $.Slice<number>): void {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		$.assignStruct($.pointerValue<dictDecoder>(dd), $.markAsStructValue(new dictDecoder({hist: $.pointerValue<dictDecoder>(dd).hist})))

		if ($.cap($.pointerValue<dictDecoder>(dd).hist) < size) {
			$.pointerValue<dictDecoder>(dd).hist = $.makeSlice<number>(size, undefined, "byte")
		}
		$.pointerValue<dictDecoder>(dd).hist = $.goSlice($.pointerValue<dictDecoder>(dd).hist, undefined, size)

		if ($.len(dict) > $.len($.pointerValue<dictDecoder>(dd).hist)) {
			dict = $.goSlice(dict, $.len(dict) - $.len($.pointerValue<dictDecoder>(dd).hist), undefined)
		}
		$.pointerValue<dictDecoder>(dd).wrPos = $.copy($.pointerValue<dictDecoder>(dd).hist, dict)
		if ($.pointerValue<dictDecoder>(dd).wrPos == $.len($.pointerValue<dictDecoder>(dd).hist)) {
			$.pointerValue<dictDecoder>(dd).wrPos = 0
			$.pointerValue<dictDecoder>(dd).full = true
		}
		$.pointerValue<dictDecoder>(dd).rdPos = $.pointerValue<dictDecoder>(dd).wrPos
	}

	public readFlush(): $.Slice<number> {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		let toRead: $.Slice<number> = $.goSlice($.pointerValue<dictDecoder>(dd).hist, $.pointerValue<dictDecoder>(dd).rdPos, $.pointerValue<dictDecoder>(dd).wrPos)
		$.pointerValue<dictDecoder>(dd).rdPos = $.pointerValue<dictDecoder>(dd).wrPos
		if ($.pointerValue<dictDecoder>(dd).wrPos == $.len($.pointerValue<dictDecoder>(dd).hist)) {
			let __goscriptAssign0_0: number = 0
			let __goscriptAssign0_1: number = 0
			$.pointerValue<dictDecoder>(dd).wrPos = __goscriptAssign0_0
			$.pointerValue<dictDecoder>(dd).rdPos = __goscriptAssign0_1
			$.pointerValue<dictDecoder>(dd).full = true
		}
		return toRead
	}

	public tryWriteCopy(dist: number, length: number): number {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		let dstPos = $.pointerValue<dictDecoder>(dd).wrPos
		let endPos = dstPos + length
		if ((dstPos < dist) || (endPos > $.len($.pointerValue<dictDecoder>(dd).hist))) {
			return 0
		}
		let dstBase = dstPos
		let srcPos = dstPos - dist

		// Copy possibly overlapping section before destination position.
		while (dstPos < endPos) {
			dstPos = dstPos + ($.copy($.goSlice($.pointerValue<dictDecoder>(dd).hist, dstPos, endPos), $.goSlice($.pointerValue<dictDecoder>(dd).hist, srcPos, dstPos)))
		}

		$.pointerValue<dictDecoder>(dd).wrPos = dstPos
		return dstPos - dstBase
	}

	public writeByte(c: number): void {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		$.pointerValue<dictDecoder>(dd).hist![$.pointerValue<dictDecoder>(dd).wrPos] = $.uint(c, 8)
		$.pointerValue<dictDecoder>(dd).wrPos++
	}

	public writeCopy(dist: number, length: number): number {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		let dstBase = $.pointerValue<dictDecoder>(dd).wrPos
		let dstPos = dstBase
		let srcPos = dstPos - dist
		let endPos = dstPos + length
		if (endPos > $.len($.pointerValue<dictDecoder>(dd).hist)) {
			endPos = $.len($.pointerValue<dictDecoder>(dd).hist)
		}

		// Copy non-overlapping section after destination position.
		//
		// This section is non-overlapping in that the copy length for this section
		// is always less than or equal to the backwards distance. This can occur
		// if a distance refers to data that wraps-around in the buffer.
		// Thus, a backwards copy is performed here; that is, the exact bytes in
		// the source prior to the copy is placed in the destination.
		if (srcPos < 0) {
			srcPos = srcPos + ($.len($.pointerValue<dictDecoder>(dd).hist))
			dstPos = dstPos + ($.copy($.goSlice($.pointerValue<dictDecoder>(dd).hist, dstPos, endPos), $.goSlice($.pointerValue<dictDecoder>(dd).hist, srcPos, undefined)))
			srcPos = 0
		}

		// Copy possibly overlapping section before destination position.
		//
		// This section can overlap if the copy length for this section is larger
		// than the backwards distance. This is allowed by LZ77 so that repeated
		// strings can be succinctly represented using (dist, length) pairs.
		// Thus, a forwards copy is performed here; that is, the bytes copied is
		// possibly dependent on the resulting bytes in the destination as the copy
		// progresses along. This is functionally equivalent to the following:
		//
		//	for i := 0; i < endPos-dstPos; i++ {
		//		dd.hist[dstPos+i] = dd.hist[srcPos+i]
		//	}
		//	dstPos = endPos
		//
		while (dstPos < endPos) {
			dstPos = dstPos + ($.copy($.goSlice($.pointerValue<dictDecoder>(dd).hist, dstPos, endPos), $.goSlice($.pointerValue<dictDecoder>(dd).hist, srcPos, dstPos)))
		}

		$.pointerValue<dictDecoder>(dd).wrPos = dstPos
		return dstPos - dstBase
	}

	public writeMark(cnt: number): void {
		let dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		$.pointerValue<dictDecoder>(dd).wrPos = $.pointerValue<dictDecoder>(dd).wrPos + (cnt)
	}

	public writeSlice(): $.Slice<number> {
		const dd: dictDecoder | $.VarRef<dictDecoder> | null = this
		return $.goSlice($.pointerValue<dictDecoder>(dd).hist, $.pointerValue<dictDecoder>(dd).wrPos, undefined)
	}

	static __typeInfo = $.registerStructType(
		"flate.dictDecoder",
		() => new dictDecoder(),
		[{ name: "availRead", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "availWrite", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "histSize", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "init", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "readFlush", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "tryWriteCopy", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "writeByte", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "writeCopy", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "writeMark", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "writeSlice", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		dictDecoder,
		[{ name: "hist", key: "hist", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "wrPos", key: "wrPos", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "rdPos", key: "rdPos", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "full", key: "full", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}
