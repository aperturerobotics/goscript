// Generated file based on register.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as flate from "@goscript/compress/flate/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_struct from "./struct.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/compress/flate/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "./struct.gs.ts"
import "./writer.gs.ts"

export type Compressor = ((w: io.Writer | null) => [io.WriteCloser | null, $.GoError] | globalThis.Promise<[io.WriteCloser | null, $.GoError]>) | null

export type Decompressor = ((r: io.Reader | null) => io.ReadCloser | null | globalThis.Promise<io.ReadCloser | null>) | null

export class pooledFlateWriter {
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get fw(): flate.Writer | $.VarRef<flate.Writer> | null {
		return this._fields.fw.value
	}
	public set fw(value: flate.Writer | $.VarRef<flate.Writer> | null) {
		this._fields.fw.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>
		fw: $.VarRef<flate.Writer | $.VarRef<flate.Writer> | null>
	}

	constructor(init?: Partial<{mu?: sync.Mutex, fw?: flate.Writer | $.VarRef<flate.Writer> | null}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			fw: $.varRef(init?.fw ?? null)
		}
	}

	public clone(): pooledFlateWriter {
		const cloned = new pooledFlateWriter()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			fw: $.varRef(this._fields.fw.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let w: pooledFlateWriter | $.VarRef<pooledFlateWriter> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<pooledFlateWriter>(w).mu.Lock()
		__defer.defer(() => { $.pointerValue<pooledFlateWriter>(w).mu.Unlock() })
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<pooledFlateWriter>(w).fw != null) {
			err = await flate.Writer.prototype.Close.call($.pointerValue<pooledFlateWriter>(w).fw)
			flateWriterPool.value.Put($.interfaceValue<any>($.pointerValue<pooledFlateWriter>(w).fw, "*flate.Writer"))
			$.pointerValue<pooledFlateWriter>(w).fw = null
		}
		return err
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const w: pooledFlateWriter | $.VarRef<pooledFlateWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		using __defer = new $.DisposableStack()
		await $.pointerValue<pooledFlateWriter>(w).mu.Lock()
		__defer.defer(() => { $.pointerValue<pooledFlateWriter>(w).mu.Unlock() })
		if ($.pointerValue<pooledFlateWriter>(w).fw == null) {
			const __goscriptReturn0: [number, $.GoError] = [0, errors.New("Write after Close")]
			n = __goscriptReturn0[0]
			err = __goscriptReturn0[1]
			__defer[Symbol.dispose]()
			return [n, err]
		}
		const __goscriptReturn2: [number, $.GoError] = await flate.Writer.prototype.Write.call($.pointerValue<pooledFlateWriter>(w).fw, p)
		n = __goscriptReturn2[0]
		err = __goscriptReturn2[1]
		__defer[Symbol.dispose]()
		return [n, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"zip.pooledFlateWriter",
		() => new pooledFlateWriter(),
		[{ name: "Close", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		pooledFlateWriter,
		{"mu": "sync.Mutex", "fw": { kind: $.TypeKind.Pointer, elemType: "flate.Writer" }}
	)
}

export class pooledFlateReader {
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get fr(): io.ReadCloser | null {
		return this._fields.fr.value
	}
	public set fr(value: io.ReadCloser | null) {
		this._fields.fr.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>
		fr: $.VarRef<io.ReadCloser | null>
	}

	constructor(init?: Partial<{mu?: sync.Mutex, fr?: io.ReadCloser | null}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			fr: $.varRef(init?.fr ?? null)
		}
	}

	public clone(): pooledFlateReader {
		const cloned = new pooledFlateReader()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			fr: $.varRef(this._fields.fr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let r: pooledFlateReader | $.VarRef<pooledFlateReader> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<pooledFlateReader>(r).mu.Lock()
		__defer.defer(() => { $.pointerValue<pooledFlateReader>(r).mu.Unlock() })
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<pooledFlateReader>(r).fr != null) {
			err = await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<pooledFlateReader>(r).fr).Close()
			flateReaderPool.value.Put(($.pointerValue<pooledFlateReader>(r).fr as any))
			$.pointerValue<pooledFlateReader>(r).fr = null
		}
		return err
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: pooledFlateReader | $.VarRef<pooledFlateReader> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		using __defer = new $.DisposableStack()
		await $.pointerValue<pooledFlateReader>(r).mu.Lock()
		__defer.defer(() => { $.pointerValue<pooledFlateReader>(r).mu.Unlock() })
		if ($.pointerValue<pooledFlateReader>(r).fr == null) {
			const __goscriptReturn3: [number, $.GoError] = [0, errors.New("Read after Close")]
			n = __goscriptReturn3[0]
			err = __goscriptReturn3[1]
			__defer[Symbol.dispose]()
			return [n, err]
		}
		const __goscriptReturn5: [number, $.GoError] = await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<pooledFlateReader>(r).fr).Read(p)
		n = __goscriptReturn5[0]
		err = __goscriptReturn5[1]
		__defer[Symbol.dispose]()
		return [n, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"zip.pooledFlateReader",
		() => new pooledFlateReader(),
		[{ name: "Close", args: [], returns: [] }, { name: "Read", args: [], returns: [] }],
		pooledFlateReader,
		{"mu": "sync.Mutex", "fr": "io.ReadCloser"}
	)
}

export let flateWriterPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool()))

export function __goscript_set_flateWriterPool(__goscriptValue: sync.Pool): void {
	flateWriterPool.value = __goscriptValue
}

export async function newFlateWriter(w: io.Writer | null): globalThis.Promise<io.WriteCloser | null> {
	let __goscriptTuple0: any = $.typeAssertTuple<flate.Writer | $.VarRef<flate.Writer> | null>(flateWriterPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: "flate.Writer" })
	let fw: flate.Writer | $.VarRef<flate.Writer> | null = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (ok) {
		await flate.Writer.prototype.Reset.call(fw, w)
	} else {
		let __goscriptTuple1: any = flate.NewWriter(w, 5)
		fw = __goscriptTuple1[0]
	}
	return $.interfaceValue<io.WriteCloser | null>(new pooledFlateWriter({fw: fw}), "*zip.pooledFlateWriter")
}

export let flateReaderPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool()))

export function __goscript_set_flateReaderPool(__goscriptValue: sync.Pool): void {
	flateReaderPool.value = __goscriptValue
}

export async function newFlateReader(r: io.Reader | null): globalThis.Promise<io.ReadCloser | null> {
	let [fr, ok] = $.typeAssertTuple<io.ReadCloser | null>(flateReaderPool.value.Get(), "io.ReadCloser")
	if (ok) {
		$.pointerValue<Exclude<flate.Resetter, null>>($.mustTypeAssert<flate.Resetter | null>(fr, "flate.Resetter")).Reset(r, null)
	} else {
		fr = await flate.NewReader(r)
	}
	return $.interfaceValue<io.ReadCloser | null>(new pooledFlateReader({fr: fr}), "*zip.pooledFlateReader")
}

export let compressors: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_compressors(__goscriptValue: sync.Map): void {
	compressors.value = __goscriptValue
}

export let decompressors: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_decompressors(__goscriptValue: sync.Map): void {
	decompressors.value = __goscriptValue
}

async function __goscriptInit0(): globalThis.Promise<void> {
	await compressors.value.Store(0, $.interfaceValue<any>($.namedFunction($.functionValue((w: io.Writer | null): [io.WriteCloser | null, $.GoError] => {
		return [$.interfaceValue<io.WriteCloser | null>(new __goscript_writer.nopCloser({Writer: w}), "*zip.nopCloser"), null]
	}, ({ kind: $.TypeKind.Function, params: ["io.Writer"], results: ["io.WriteCloser", "error"] } as $.FunctionTypeInfo)), "zip.Compressor"), "zip.Compressor"))
	await compressors.value.Store(8, $.interfaceValue<any>($.namedFunction($.functionValue(async (w: io.Writer | null): globalThis.Promise<[io.WriteCloser | null, $.GoError]> => {
		return [await newFlateWriter(w), null]
	}, ({ kind: $.TypeKind.Function, params: ["io.Writer"], results: ["io.WriteCloser", "error"] } as $.FunctionTypeInfo)), "zip.Compressor"), "zip.Compressor"))

	await decompressors.value.Store(0, $.interfaceValue<any>($.namedFunction(io.NopCloser, "zip.Decompressor"), "zip.Decompressor"))
	await decompressors.value.Store(8, $.interfaceValue<any>($.namedFunction(newFlateReader, "zip.Decompressor"), "zip.Decompressor"))
}

export async function RegisterDecompressor(method: number, dcomp: ((r: io.Reader | null) => io.ReadCloser | null | globalThis.Promise<io.ReadCloser | null>) | null): globalThis.Promise<void> {
	{
		let [, dup] = await decompressors.value.LoadOrStore(method, $.interfaceValue<any>(dcomp, "zip.Decompressor"))
		if (dup) {
			$.panic("decompressor already registered")
		}
	}
}

export async function RegisterCompressor(method: number, comp: ((w: io.Writer | null) => [io.WriteCloser | null, $.GoError] | globalThis.Promise<[io.WriteCloser | null, $.GoError]>) | null): globalThis.Promise<void> {
	{
		let [, dup] = await compressors.value.LoadOrStore(method, $.interfaceValue<any>(comp, "zip.Compressor"))
		if (dup) {
			$.panic("compressor already registered")
		}
	}
}

export async function compressor(method: number): globalThis.Promise<Compressor | null> {
	let [ci, ok] = await compressors.value.Load(method)
	if (!ok) {
		return (null as Compressor | null)
	}
	return $.mustTypeAssert<((w: io.Writer | null) => [io.WriteCloser | null, $.GoError] | globalThis.Promise<[io.WriteCloser | null, $.GoError]>) | null>(ci, ({ kind: $.TypeKind.Function, name: "zip.Compressor", params: ["io.Writer"], results: ["io.WriteCloser", "error"] } as $.FunctionTypeInfo))
}

export async function decompressor(method: number): globalThis.Promise<Decompressor | null> {
	let [di, ok] = await decompressors.value.Load(method)
	if (!ok) {
		return (null as Decompressor | null)
	}
	return $.mustTypeAssert<((r: io.Reader | null) => io.ReadCloser | null | globalThis.Promise<io.ReadCloser | null>) | null>(di, ({ kind: $.TypeKind.Function, name: "zip.Decompressor", params: ["io.Reader"], results: ["io.ReadCloser"] } as $.FunctionTypeInfo))
}

await __goscriptInit0()
