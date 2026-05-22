// Generated file based on package_import_io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

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
		() => new writerHolder(),
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
		() => new asyncBuffer(),
		[{ name: "Reset", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		asyncBuffer,
		{}
	)
}

export class staticReader {
	public get done(): boolean {
		return this._fields.done.value
	}
	public set done(value: boolean) {
		this._fields.done.value = value
	}

	public _fields: {
		done: $.VarRef<boolean>
	}

	constructor(init?: Partial<{done?: boolean}>) {
		this._fields = {
			done: $.varRef(init?.done ?? false)
		}
	}

	public clone(): staticReader {
		const cloned = new staticReader()
		cloned._fields = {
			done: $.varRef(this._fields.done.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: staticReader | $.VarRef<staticReader> | null = this
		if ($.pointerValue<staticReader>(r).done) {
			return [0, io.EOF]
		}
		$.copy(p, new Uint8Array([99, 111, 112, 121]))
		$.pointerValue<staticReader>(r).done = true
		return [4, null]
	}

	static __typeInfo = $.registerStructType(
		"main.staticReader",
		() => new staticReader(),
		[{ name: "Read", args: [], returns: [] }],
		staticReader,
		{"done": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class asyncReader {
	public get done(): boolean {
		return this._fields.done.value
	}
	public set done(value: boolean) {
		this._fields.done.value = value
	}

	public _fields: {
		done: $.VarRef<boolean>
	}

	constructor(init?: Partial<{done?: boolean}>) {
		this._fields = {
			done: $.varRef(init?.done ?? false)
		}
	}

	public clone(): asyncReader {
		const cloned = new asyncReader()
		cloned._fields = {
			done: $.varRef(this._fields.done.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: asyncReader | $.VarRef<asyncReader> | null = this
		await asyncWrites.value.Load("read")
		if ($.pointerValue<asyncReader>(r).done) {
			return [0, io.EOF]
		}
		$.copy(p, new Uint8Array([97, 115, 121, 110, 99]))
		$.pointerValue<asyncReader>(r).done = true
		return [5, null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReader",
		() => new asyncReader(),
		[{ name: "Read", args: [], returns: [] }],
		asyncReader,
		{"done": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export let asyncWrites: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_asyncWrites(value: sync.Map): void {
	asyncWrites.value = value
}

export async function copyInterfaces(dst: io.Writer | null, src: io.Reader | null): globalThis.Promise<[number, $.GoError]> {
	return await io.Copy($.pointerValue(dst), $.pointerValue(src))
}

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
	asyncBuffer.prototype.Reset.call(buf, $.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer"))
	asyncBuffer.prototype.Reset.call(buf, null)
	let __goscriptTuple1 = await copyInterfaces(io.Discard, $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader"))
	let n64 = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("Copy interface - bytes:", n64, "err:", err == null)
	let __goscriptTuple2 = await io.Copy($.pointerValue(io.Discard), {Reader: $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader")})
	n64 = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("Copy embedded reader - bytes:", n64, "err:", err == null)
	let __goscriptTuple3 = await io.Copy({Writer: io.Discard}, $.pointerValue($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader")))
	n64 = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	$.println("Copy embedded writer - bytes:", n64, "err:", err == null)
	let __goscriptTuple4 = await io.Copy($.pointerValue($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer")), $.pointerValue($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader")))
	n64 = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	$.println("Copy async writer - bytes:", n64, "err:", err == null)
	let __goscriptTuple5 = await io.CopyN($.pointerValue(io.Discard), $.pointerValue($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader")), 5)
	n64 = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	$.println("CopyN async reader - bytes:", n64, "err:", err == null)
	let __goscriptTuple6 = await io.Copy($.pointerValue($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer")), $.pointerValue($.interfaceValue<io.Reader | null>(bytes.NewBuffer(new Uint8Array([99, 111, 112, 121])), "*bytes.Buffer")))
	n64 = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	$.println("Copy bytes WriteTo async writer - bytes:", n64, "err:", err == null)
	let viewBacking = $.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(99, 8)])
	let __goscriptTuple7 = $.pointerValue<bytes.Buffer>(bytes.NewBuffer(new Uint8Array([118, 105, 101, 119]))).Read($.goSlice(viewBacking, undefined, 4))
	n = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	$.println("Read into byte slice view - bytes:", n, "data:", $.bytesToString(viewBacking), "err:", err == null)
	let dst: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple8 = await io.Copy($.pointerValue($.interfaceValue<io.Writer | null>(dst, "*bytes.Buffer")), $.pointerValue($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader")))
	n64 = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	$.println("Copy bytes ReadFrom async reader - bytes:", n64, "data:", dst.value.String(), "err:", err == null)

	let __goscriptTuple9 = io.Pipe()
	let reader: io.PipeReader | $.VarRef<io.PipeReader> | null = __goscriptTuple9[0]
	let writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null = __goscriptTuple9[1]
	let done = $.makeChannel<boolean>(1, false, "both")
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		let __goscriptShadow0 = $.makeSlice<number>(5, undefined, "byte")
		let [__goscriptShadow1, __goscriptShadow2] = $.pointerValue<io.PipeReader>(reader).Read(__goscriptShadow0)
		$.println("Pipe read - bytes:", __goscriptShadow1, "data:", $.bytesToString($.goSlice(__goscriptShadow0, undefined, __goscriptShadow1)), "err:", __goscriptShadow2 == null)
		let __goscriptTuple10 = $.pointerValue<io.PipeReader>(reader).Read(__goscriptShadow0)
		__goscriptShadow1 = __goscriptTuple10[0]
		__goscriptShadow2 = __goscriptTuple10[1]
		$.println("Pipe read EOF - bytes:", __goscriptShadow1, "err EOF:", __goscriptShadow2 == io.EOF)
		await $.chanSend(done, true)
	}, { kind: $.TypeKind.Function, params: [], results: [] }))() })
	let __goscriptTuple11 = $.pointerValue<io.PipeWriter>(writer).Write(new Uint8Array([104, 101, 108, 108, 111]))
	n = __goscriptTuple11[0]
	err = __goscriptTuple11[1]
	$.println("Pipe write - bytes:", n, "err:", err == null)
	err = $.pointerValue<io.PipeWriter>(writer).Close()
	$.println("Pipe close err:", err == null)
	await $.chanRecv(done)
	let __goscriptTuple12 = $.pointerValue<io.PipeWriter>(writer).Write(new Uint8Array([97, 103, 97, 105, 110]))
	n = __goscriptTuple12[0]
	err = __goscriptTuple12[1]
	$.println("Pipe write after close - bytes:", n, "err closed:", err == io.ErrClosedPipe)

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
