// Generated file based on package_import_io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

export class writerHolder {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{w?: io.Writer | null}>) {
		this._fields = {
			w: $.varRef(init?.w ?? null)
		}
	}

	public clone(): writerHolder {
		const cloned = new writerHolder()
		cloned._fields = {
			w: $.varRef(this._fields.w.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.writerHolder",
		new writerHolder(),
		[],
		writerHolder,
		{"w": "io.Writer"}
	)
}

export class asyncBuffer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): asyncBuffer {
		const cloned = new asyncBuffer()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Reset(w: io.Writer | null): void {
		const b: asyncBuffer | $.VarRef<asyncBuffer> | null = this
		if ($.interfaceValue<io.Writer | null>(b, "*main.asyncBuffer") == w) {
			$.println("Reset same writer")
			return
		}
		$.println("Reset different writer")
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const b: asyncBuffer | $.VarRef<asyncBuffer> | null = this
		await asyncWrites.value.Load("last")
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncBuffer",
		new asyncBuffer(),
		[{ name: "Reset", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		asyncBuffer,
		{}
	)
}

export let asyncWrites: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export async function main(): globalThis.Promise<void> {
	// Test basic error variables
	$.println("EOF:", $.pointerValue<Exclude<$.GoError, null>>(io.EOF).Error())
	$.println("ErrClosedPipe:", $.pointerValue<Exclude<$.GoError, null>>(io.ErrClosedPipe).Error())
	$.println("ErrShortWrite:", $.pointerValue<Exclude<$.GoError, null>>(io.ErrShortWrite).Error())
	$.println("ErrUnexpectedEOF:", $.pointerValue<Exclude<$.GoError, null>>(io.ErrUnexpectedEOF).Error())

	// Test seek constants
	$.println("SeekStart:", io.SeekStart)
	$.println("SeekCurrent:", io.SeekCurrent)
	$.println("SeekEnd:", io.SeekEnd)

	// Test Discard writer
	let [n, err] = io.WriteString($.pointerValue(io.Discard), "hello world")
	$.println("WriteString to Discard - bytes:", n, "err:", err == null)

	let holder = $.markAsStructValue(new writerHolder({w: io.Discard}))
	let __goscriptTuple0 = io.WriteString($.pointerValue(holder.w), "field writer")
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("WriteString field writer - bytes:", n, "err:", err == null)

	let buf: asyncBuffer | $.VarRef<asyncBuffer> | null = new asyncBuffer()
	$.pointerValue<asyncBuffer>(buf).Reset($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer"))
	$.pointerValue<asyncBuffer>(buf).Reset(null)

	let __goscriptTuple1 = io.Pipe()
	let reader: io.PipeReader | $.VarRef<io.PipeReader> | null = __goscriptTuple1[0]
	let writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null = __goscriptTuple1[1]
	let done = $.makeChannel<boolean>(1, false, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		let __goscriptShadow0 = $.makeSlice<number>(5, undefined, "byte")
		let [__goscriptShadow2, __goscriptShadow1] = $.pointerValue<io.PipeReader>(reader).Read(__goscriptShadow0)
		$.println("Pipe read - bytes:", __goscriptShadow2, "data:", $.bytesToString($.goSlice(__goscriptShadow0, undefined, __goscriptShadow2)), "err:", __goscriptShadow1 == null)
		let __goscriptTuple2 = $.pointerValue<io.PipeReader>(reader).Read(__goscriptShadow0)
		__goscriptShadow2 = __goscriptTuple2[0]
		__goscriptShadow1 = __goscriptTuple2[1]
		$.println("Pipe read EOF - bytes:", __goscriptShadow2, "err EOF:", __goscriptShadow1 == io.EOF)
		await $.chanSend(done, true)
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	let __goscriptTuple3 = $.pointerValue<io.PipeWriter>(writer).Write($.stringToBytes("hello"))
	n = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	$.println("Pipe write - bytes:", n, "err:", err == null)
	err = $.pointerValue<io.PipeWriter>(writer).Close()
	$.println("Pipe close err:", err == null)
	await $.chanRecv(done)
	let __goscriptTuple4 = $.pointerValue<io.PipeWriter>(writer).Write($.stringToBytes("again"))
	n = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	$.println("Pipe write after close - bytes:", n, "err closed:", err == io.ErrClosedPipe)

	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
