// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/bufio/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"

export class Writer {
	public get W(): io.Writer | null {
		return this._fields.W.value
	}
	public set W(value: io.Writer | null) {
		this._fields.W.value = value
	}

	public get bufw(): bufio.Writer | $.VarRef<bufio.Writer> | null {
		return this._fields.bufw.value
	}
	public set bufw(value: bufio.Writer | $.VarRef<bufio.Writer> | null) {
		this._fields.bufw.value = value
	}

	public _fields: {
		W: $.VarRef<io.Writer | null>
		bufw: $.VarRef<bufio.Writer | $.VarRef<bufio.Writer> | null>
	}

	constructor(init?: Partial<{W?: io.Writer | null, bufw?: bufio.Writer | $.VarRef<bufio.Writer> | null}>) {
		this._fields = {
			W: $.varRef(init?.W ?? null),
			bufw: $.varRef(init?.bufw ?? null)
		}
	}

	public clone(): Writer {
		const cloned = new Writer()
		cloned._fields = {
			W: $.varRef(this._fields.W.value),
			bufw: $.varRef(this._fields.bufw.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Available(): number {
		const w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).bufw != null) {
			return bufio.Writer.prototype.Available.call($.pointerValue<Writer>(w).bufw)
		}
		return 4096
	}

	public Buffered(): number {
		const w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).bufw != null) {
			return bufio.Writer.prototype.Buffered.call($.pointerValue<Writer>(w).bufw)
		}
		return 0
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		let ferr: $.GoError = null as $.GoError
		let cerr: $.GoError = null as $.GoError
		ferr = await Writer.prototype.Flush.call(w)

		// always close even if flush fails.
		{
			let [closer, ok] = $.typeAssertTuple<io.Closer | null>($.pointerValue<Writer>(w).W, "io.Closer")
			if (ok) {
				cerr = await $.pointerValue<Exclude<io.Closer, null>>(closer).Close()
			}
		}

		if (ferr != null) {
			return ferr
		}
		return cerr
	}

	public async Flush(): globalThis.Promise<$.GoError> {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).bufw == null) {
			return null
		}
		{
			let err = await bufio.Writer.prototype.Flush.call($.pointerValue<Writer>(w).bufw)
			if (err != null) {
				return err
			}
		}
		bufio.Writer.prototype.Reset.call($.pointerValue<Writer>(w).bufw, null)
		bufioWriterPool.value.Put($.interfaceValue<any>($.pointerValue<Writer>(w).bufw, "*bufio.Writer"))
		$.pointerValue<Writer>(w).bufw = null
		return null
	}

	public Size(): number {
		const w: Writer | $.VarRef<Writer> | null = this
		return 4096
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).bufw == null) {
			if ($.len(b) >= 4096) {
				return await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<Writer>(w).W).Write(b)
			}
			$.pointerValue<Writer>(w).bufw = $.mustTypeAssert<bufio.Writer | $.VarRef<bufio.Writer> | null>(await bufioWriterPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" })
			bufio.Writer.prototype.Reset.call($.pointerValue<Writer>(w).bufw, $.pointerValue<Writer>(w).W)
		}
		return await bufio.Writer.prototype.Write.call($.pointerValue<Writer>(w).bufw, b)
	}

	public async WriteByte(b: number): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		await Writer.prototype.ensureBuffer.call(w)
		return await bufio.Writer.prototype.WriteByte.call($.pointerValue<Writer>(w).bufw, $.uint(b, 8))
	}

	public async WriteRune(r: number): globalThis.Promise<[number, $.GoError]> {
		const w: Writer | $.VarRef<Writer> | null = this
		await Writer.prototype.ensureBuffer.call(w)
		return await bufio.Writer.prototype.WriteRune.call($.pointerValue<Writer>(w).bufw, $.int(r, 32))
	}

	public async WriteString(s: string): globalThis.Promise<[number, $.GoError]> {
		const w: Writer | $.VarRef<Writer> | null = this
		await Writer.prototype.ensureBuffer.call(w)
		return await bufio.Writer.prototype.WriteString.call($.pointerValue<Writer>(w).bufw, s)
	}

	public async ensureBuffer(): globalThis.Promise<void> {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).bufw == null) {
			$.pointerValue<Writer>(w).bufw = $.mustTypeAssert<bufio.Writer | $.VarRef<bufio.Writer> | null>(await bufioWriterPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" })
			bufio.Writer.prototype.Reset.call($.pointerValue<Writer>(w).bufw, $.pointerValue<Writer>(w).W)
		}
	}

	static __typeInfo = $.registerStructType(
		"pool.Writer",
		() => new Writer(),
		[{ name: "Available", args: [], returns: [] }, { name: "Buffered", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "Flush", args: [], returns: [] }, { name: "Size", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "WriteByte", args: [], returns: [] }, { name: "WriteRune", args: [], returns: [] }, { name: "WriteString", args: [], returns: [] }, { name: "ensureBuffer", args: [], returns: [] }],
		Writer,
		{"W": "io.Writer", "bufw": { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" }}
	)
}

export const WriterBufferSize: number = 4096

export let bufioWriterPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>(bufio.NewWriterSize(null, 4096), "*bufio.Writer")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_bufioWriterPool(__goscriptValue: sync.Pool): void {
	bufioWriterPool.value = __goscriptValue
}
