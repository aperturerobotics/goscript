// Generated file based on package_import_io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"

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
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [0], offset: 0, exported: false }]
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
		if ($.comparableEqual(b, w)) {
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
		[{ name: "Reset", args: [{ name: "w", type: "io.Writer" }], returns: [] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		asyncBuffer,
		[]
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
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		staticReader,
		[{ name: "done", key: "done", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [0], offset: 0, exported: false }]
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
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		asyncReader,
		[{ name: "done", key: "done", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [0], offset: 0, exported: false }]
	)
}

export class asyncReaderAt {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? null)
		}
	}

	public clone(): asyncReaderAt {
		const cloned = new asyncReaderAt()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ReadAt(p: $.Slice<number>, off: number): globalThis.Promise<[number, $.GoError]> {
		const r: asyncReaderAt | $.VarRef<asyncReaderAt> | null = this
		await asyncWrites.value.Load("readat")
		if (off >= $.int($.len($.pointerValue<asyncReaderAt>(r).data))) {
			return [0, io.EOF]
		}
		let n = $.copy(p, $.goSlice($.pointerValue<asyncReaderAt>(r).data, off, undefined))
		if (n < $.len(p)) {
			return [n, io.EOF]
		}
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReaderAt",
		() => new asyncReaderAt(),
		[{ name: "ReadAt", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "off", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		asyncReaderAt,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [0], offset: 0, exported: false }]
	)
}

export class pipeReadResult {
	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public get data(): string {
		return this._fields.data.value
	}
	public set data(value: string) {
		this._fields.data.value = value
	}

	public get errNil(): boolean {
		return this._fields.errNil.value
	}
	public set errNil(value: boolean) {
		this._fields.errNil.value = value
	}

	public get errEOF(): boolean {
		return this._fields.errEOF.value
	}
	public set errEOF(value: boolean) {
		this._fields.errEOF.value = value
	}

	public _fields: {
		n: $.VarRef<number>
		data: $.VarRef<string>
		errNil: $.VarRef<boolean>
		errEOF: $.VarRef<boolean>
	}

	constructor(init?: Partial<{n?: number, data?: string, errNil?: boolean, errEOF?: boolean}>) {
		this._fields = {
			n: $.varRef(init?.n ?? 0),
			data: $.varRef(init?.data ?? ""),
			errNil: $.varRef(init?.errNil ?? false),
			errEOF: $.varRef(init?.errEOF ?? false)
		}
	}

	public clone(): pipeReadResult {
		const cloned = new pipeReadResult()
		cloned._fields = {
			n: $.varRef(this._fields.n.value),
			data: $.varRef(this._fields.data.value),
			errNil: $.varRef(this._fields.errNil.value),
			errEOF: $.varRef(this._fields.errEOF.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.pipeReadResult",
		() => new pipeReadResult(),
		[],
		pipeReadResult,
		[{ name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [0], offset: 0, exported: false }, { name: "data", key: "data", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [1], offset: 8, exported: false }, { name: "errNil", key: "errNil", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [2], offset: 24, exported: false }, { name: "errEOF", key: "errEOF", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io", index: [3], offset: 25, exported: false }]
	)
}

export let asyncWrites: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_asyncWrites(__goscriptValue: sync.Map): void {
	asyncWrites.value = __goscriptValue
}

export async function copyInterfaces(dst: io.Writer | null, src: io.Reader | null): globalThis.Promise<[number, $.GoError]> {
	const __goscriptReturn0 = await io.Copy($.pointerValueOrNil(dst)!, $.pointerValueOrNil(src)!)
	return [$.int(__goscriptReturn0[0]), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
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
	let [n, err] = await io.WriteString($.pointerValueOrNil(io.Discard)!, "hello world")
	$.println("WriteString to Discard - bytes:", n, "err:", err == null)

	let holder = $.markAsStructValue(new writerHolder({w: io.Discard}))
	let __goscriptTuple0: any = await io.WriteString($.pointerValueOrNil(holder.w)!, "field writer")
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("WriteString field writer - bytes:", n, "err:", err == null)

	let buf: asyncBuffer | $.VarRef<asyncBuffer> | null = new asyncBuffer()
	asyncBuffer.prototype.Reset.call(buf, $.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer"))
	asyncBuffer.prototype.Reset.call(buf, null)
	let __goscriptTuple1: any = await copyInterfaces(io.Discard, $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader"))
	let n64 = $.int(__goscriptTuple1[0])
	err = __goscriptTuple1[1]
	$.println("Copy interface - bytes:", $.int(n64), "err:", err == null)
	let __goscriptTuple2: any = await io.Copy($.pointerValueOrNil(io.Discard)!, {Reader: $.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader")})
	n64 = $.int(__goscriptTuple2[0])
	err = __goscriptTuple2[1]
	$.println("Copy embedded reader - bytes:", $.int(n64), "err:", err == null)
	let __goscriptTuple3: any = await io.Copy({Writer: io.Discard}, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader"))!)
	n64 = $.int(__goscriptTuple3[0])
	err = __goscriptTuple3[1]
	$.println("Copy embedded writer - bytes:", $.int(n64), "err:", err == null)
	let __goscriptTuple4: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer"))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new staticReader(), "*main.staticReader"))!)
	n64 = $.int(__goscriptTuple4[0])
	err = __goscriptTuple4[1]
	$.println("Copy async writer - bytes:", $.int(n64), "err:", err == null)
	let __goscriptTuple5: any = await io.CopyN($.pointerValueOrNil(io.Discard)!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader"))!, $.int(5))
	n64 = $.int(__goscriptTuple5[0])
	err = __goscriptTuple5[1]
	$.println("CopyN async reader - bytes:", $.int(n64), "err:", err == null)
	let __goscriptTuple6: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*main.asyncBuffer"))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewBuffer(new Uint8Array([99, 111, 112, 121])), "*bytes.Buffer"))!)
	n64 = $.int(__goscriptTuple6[0])
	err = __goscriptTuple6[1]
	$.println("Copy bytes WriteTo async writer - bytes:", $.int(n64), "err:", err == null)
	let viewBacking: $.Slice<number> = $.arrayToSlice<number>([$.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(0, 8), $.uint(99, 8)])
	let __goscriptTuple7: any = bytes.Buffer.prototype.Read.call($.pointerValue<bytes.Buffer>(bytes.NewBuffer(new Uint8Array([118, 105, 101, 119]))), $.goSlice(viewBacking, undefined, 4))
	n = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	$.println("Read into byte slice view - bytes:", n, "data:", $.bytesToString(viewBacking), "err:", err == null)
	let dst: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple8: any = await io.Copy($.pointerValueOrNil($.interfaceValue<io.Writer | null>(dst, "*bytes.Buffer"))!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(new asyncReader(), "*main.asyncReader"))!)
	n64 = $.int(__goscriptTuple8[0])
	err = __goscriptTuple8[1]
	$.println("Copy bytes ReadFrom async reader - bytes:", $.int(n64), "data:", dst.value.String(), "err:", err == null)
	let sectionReader: io.SectionReader | $.VarRef<io.SectionReader> | null = io.NewSectionReader($.pointerValueOrNil($.interfaceValue<io.ReaderAt | null>(new asyncReaderAt({data: new Uint8Array([97, 98, 99, 100, 101, 102])}), "*main.asyncReaderAt"))!, $.int(1), $.int(3))
	let __goscriptTuple9: any = await io.CopyBuffer($.pointerValueOrNil(io.Discard)!, $.pointerValueOrNil($.interfaceValue<io.Reader | null>(sectionReader, "*io.SectionReader"))!, $.makeSlice<number>(2, undefined, "byte"))
	n64 = $.int(__goscriptTuple9[0])
	err = __goscriptTuple9[1]
	$.println("Copy section async readerat - bytes:", $.int(n64), "err:", err == null)

	let __goscriptTuple10: any = io.Pipe()
	let reader: io.PipeReader | $.VarRef<io.PipeReader> | null = __goscriptTuple10[0]
	let writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null = __goscriptTuple10[1]
	let done = $.makeChannel<boolean>(1, false, "both")
	let pipeReads = $.makeChannel<pipeReadResult>(2, $.markAsStructValue(new pipeReadResult()), "both")
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		let __goscriptShadow0: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
		let [__goscriptShadow1, __goscriptShadow2] = await io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow0)
		await $.chanSend(pipeReads, $.markAsStructValue(new pipeReadResult({n: __goscriptShadow1, data: $.bytesToString($.goSlice(__goscriptShadow0, undefined, __goscriptShadow1)), errNil: __goscriptShadow2 == null, errEOF: $.comparableEqual(__goscriptShadow2, io.EOF)})))
		let __goscriptTuple11: any = await io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow0)
		__goscriptShadow1 = __goscriptTuple11[0]
		__goscriptShadow2 = __goscriptTuple11[1]
		await $.chanSend(pipeReads, $.markAsStructValue(new pipeReadResult({n: __goscriptShadow1, errNil: __goscriptShadow2 == null, errEOF: $.comparableEqual(__goscriptShadow2, io.EOF)})))
		await $.chanSend(done, true)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
	let __goscriptTuple12: any = await io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([104, 101, 108, 108, 111]))
	n = __goscriptTuple12[0]
	err = __goscriptTuple12[1]
	$.println("Pipe write - bytes:", n, "err:", err == null)
	err = io.PipeWriter.prototype.Close.call($.pointerValue<io.PipeWriter>(writer))
	$.println("Pipe close err:", err == null)
	await $.chanRecv(done)
	let firstRead = await $.chanRecv(pipeReads)
	let eofRead = await $.chanRecv(pipeReads)
	$.println("Pipe read - bytes:", firstRead.n, "data:", firstRead.data, "err:", firstRead.errNil)
	$.println("Pipe read EOF - bytes:", eofRead.n, "err EOF:", eofRead.errEOF)
	let __goscriptTuple13: any = await io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([97, 103, 97, 105, 110]))
	n = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	$.println("Pipe write after close - bytes:", n, "err closed:", $.comparableEqual(err, io.ErrClosedPipe))

	let __goscriptTuple14: any = io.Pipe()
	reader = __goscriptTuple14[0]
	writer = __goscriptTuple14[1]
	let ready = $.makeChannel<boolean>(1, false, "both")
	let readResult = $.makeChannel<pipeReadResult>(1, $.markAsStructValue(new pipeReadResult()), "both")
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		let __goscriptShadow3: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
		await $.chanSend(ready, true)
		let [__goscriptShadow4, __goscriptShadow5] = await io.PipeReader.prototype.Read.call($.pointerValue<io.PipeReader>(reader), __goscriptShadow3)
		await $.chanSend(readResult, $.markAsStructValue(new pipeReadResult({n: __goscriptShadow4, data: $.bytesToString($.goSlice(__goscriptShadow3, undefined, __goscriptShadow4)), errNil: __goscriptShadow5 == null, errEOF: $.comparableEqual(__goscriptShadow5, io.EOF)})))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
	await $.chanRecv(ready)
	let __goscriptTuple15: any = await io.PipeWriter.prototype.Write.call($.pointerValue<io.PipeWriter>(writer), new Uint8Array([108, 97, 116, 101, 114]))
	n = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	let delayed = await $.chanRecv(readResult)
	$.println("Pipe delayed write - bytes:", n, "err:", err == null)
	$.println("Pipe delayed read - bytes:", delayed.n, "data:", delayed.data, "err:", delayed.errNil, "err EOF:", delayed.errEOF)
	err = io.PipeWriter.prototype.Close.call($.pointerValue<io.PipeWriter>(writer))
	$.println("Pipe delayed close err:", err == null)

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
