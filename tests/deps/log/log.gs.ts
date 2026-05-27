// Generated file based on log.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as internal from "@goscript/log/internal/index.js"

import * as os from "@goscript/os/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/log/internal/index.js"
import "@goscript/os/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"

export class Logger {
	public get outMu(): sync.Mutex {
		return this._fields.outMu.value
	}
	public set outMu(value: sync.Mutex) {
		this._fields.outMu.value = value
	}

	public get out(): io.Writer | null {
		return this._fields.out.value
	}
	public set out(value: io.Writer | null) {
		this._fields.out.value = value
	}

	public get prefix(): atomic.Pointer<string> {
		return this._fields.prefix.value
	}
	public set prefix(value: atomic.Pointer<string>) {
		this._fields.prefix.value = value
	}

	public get flag(): atomic.Int32 {
		return this._fields.flag.value
	}
	public set flag(value: atomic.Int32) {
		this._fields.flag.value = value
	}

	public get isDiscard(): atomic.Bool {
		return this._fields.isDiscard.value
	}
	public set isDiscard(value: atomic.Bool) {
		this._fields.isDiscard.value = value
	}

	public _fields: {
		outMu: $.VarRef<sync.Mutex>
		out: $.VarRef<io.Writer | null>
		prefix: $.VarRef<atomic.Pointer<string>>
		flag: $.VarRef<atomic.Int32>
		isDiscard: $.VarRef<atomic.Bool>
	}

	constructor(init?: Partial<{outMu?: sync.Mutex, out?: io.Writer | null, prefix?: atomic.Pointer<string>, flag?: atomic.Int32, isDiscard?: atomic.Bool}>) {
		this._fields = {
			outMu: $.varRef(init?.outMu ? $.markAsStructValue($.cloneStructValue(init.outMu)) : $.markAsStructValue(new sync.Mutex())),
			out: $.varRef(init?.out ?? null),
			prefix: $.varRef(init?.prefix ? $.markAsStructValue($.cloneStructValue(init.prefix)) : $.markAsStructValue(new atomic.Pointer<string>())),
			flag: $.varRef(init?.flag ? $.markAsStructValue($.cloneStructValue(init.flag)) : $.markAsStructValue(new atomic.Int32())),
			isDiscard: $.varRef(init?.isDiscard ? $.markAsStructValue($.cloneStructValue(init.isDiscard)) : $.markAsStructValue(new atomic.Bool()))
		}
	}

	public clone(): Logger {
		const cloned = new Logger()
		cloned._fields = {
			outMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.outMu.value))),
			out: $.varRef(this._fields.out.value),
			prefix: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.prefix.value))),
			flag: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.flag.value))),
			isDiscard: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.isDiscard.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Fatal(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Append(b, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		os.Exit(1)
	}

	public async Fatalf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Appendf(b, format, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		os.Exit(1)
	}

	public async Fatalln(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Appendln(b, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		os.Exit(1)
	}

	public Flags(): number {
		const l: Logger | $.VarRef<Logger> | null = this
		return $.int($.pointerValue<Logger>(l).flag.Load())
	}

	public async Output(calldepth: number, s: string): globalThis.Promise<$.GoError> {
		const l: Logger | $.VarRef<Logger> | null = this
		return await Logger.prototype.output.call(l, $.uint(0, 64), calldepth + 1, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return $.append(b, ...($.stringToBytes(s) ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	}

	public async Panic(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		let s = fmt.Sprint(...(v ?? []))
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return $.append(b, ...($.stringToBytes(s) ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		$.panic(s)
	}

	public async Panicf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		let s = fmt.Sprintf(format, ...(v ?? []))
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return $.append(b, ...($.stringToBytes(s) ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		$.panic(s)
	}

	public async Panicln(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		let s = fmt.Sprintln(...(v ?? []))
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return $.append(b, ...($.stringToBytes(s) ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
		$.panic(s)
	}

	public Prefix(): string {
		const l: Logger | $.VarRef<Logger> | null = this
		{
			let p = ($.pointerValue<Logger>(l).prefix.Load() as $.VarRef<string> | null)
			if (p != null) {
				return $.pointerValue<string>(p)
			}
		}
		return ""
	}

	public async Print(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Append(b, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	}

	public async Printf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Appendf(b, format, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	}

	public async Println(v: $.Slice<any>): globalThis.Promise<void> {
		const l: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.output.call(l, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
			return fmt.Appendln(b, ...(v ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	}

	public SetFlags(flag: number): void {
		const l: Logger | $.VarRef<Logger> | null = this
		$.pointerValue<Logger>(l).flag.Store($.int($.int(flag, 32), 32))
	}

	public async SetOutput(w: io.Writer | null): globalThis.Promise<void> {
		let l: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(l).outMu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(l).outMu.Unlock() })
		$.pointerValue<Logger>(l).out = w
		$.pointerValue<Logger>(l).isDiscard.Store($.comparableEqual(w, io.Discard))
	}

	public SetPrefix(__goscriptParam0: string): void {
		const l: Logger | $.VarRef<Logger> | null = this
		let prefix: $.VarRef<string> = $.varRef(__goscriptParam0)
		$.pointerValue<Logger>(l).prefix.Store(prefix)
	}

	public async Writer(): globalThis.Promise<io.Writer | null> {
		const l: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(l).outMu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(l).outMu.Unlock() })
		return $.pointerValue<Logger>(l).out
	}

	public async output(pc: number, calldepth: number, appendOutput: ((_p0: $.Slice<number>) => $.Slice<number> | globalThis.Promise<$.Slice<number>>) | null): globalThis.Promise<$.GoError> {
		const l: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		if ($.pointerValue<Logger>(l).isDiscard.Load()) {
			return null
		}

		let now = $.markAsStructValue($.cloneStructValue(time.Now()))

		// Load prefix and flag once so that their value is consistent within
		// this call regardless of any concurrent changes to their value.
		let prefix = Logger.prototype.Prefix.call(l)
		let flag = Logger.prototype.Flags.call(l)

		let file: string = ""
		let line: number = 0
		if ((flag & (Lshortfile | Llongfile)) != 0) {
			if ($.uint(pc, 64) == $.uint(0, 64)) {
				let ok: boolean = false
				let __goscriptTuple0: any = runtime.Caller(calldepth)
				file = __goscriptTuple0[1]
				line = __goscriptTuple0[2]
				ok = __goscriptTuple0[3]
				if (!ok) {
					file = "???"
					line = 0
				}
			} else {
				let fs: runtime.Frames | $.VarRef<runtime.Frames> | null = runtime.CallersFrames($.arrayToSlice<number>([$.uint(pc, 64)]))
				let [f, ] = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(fs))
				file = f.File
				if ($.stringEqual(file, "")) {
					file = "???"
				}
				line = f.Line
			}
		}

		let buf = getBuffer()
		__defer.defer(() => { putBuffer(buf) })
		formatHeader(buf, $.markAsStructValue($.cloneStructValue(now)), prefix, flag, file, line)
		buf!.value = await appendOutput!($.pointerValue<$.Slice<number>>(buf))
		if (($.len($.pointerValue<$.Slice<number>>(buf)) == 0) || ($.uint(($.pointerValue<$.Slice<number>>(buf))![$.len($.pointerValue<$.Slice<number>>(buf)) - 1], 8) != $.uint(10, 8))) {
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(10, 8))
		}

		await $.pointerValue<Logger>(l).outMu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(l).outMu.Unlock() })
		let [, err] = $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<Logger>(l).out).Write($.pointerValue<$.Slice<number>>(buf))
		return err
	}

	static __typeInfo = $.registerStructType(
		"log.Logger",
		() => new Logger(),
		[{ name: "Fatal", args: [], returns: [] }, { name: "Fatalf", args: [], returns: [] }, { name: "Fatalln", args: [], returns: [] }, { name: "Flags", args: [], returns: [] }, { name: "Output", args: [], returns: [] }, { name: "Panic", args: [], returns: [] }, { name: "Panicf", args: [], returns: [] }, { name: "Panicln", args: [], returns: [] }, { name: "Prefix", args: [], returns: [] }, { name: "Print", args: [], returns: [] }, { name: "Printf", args: [], returns: [] }, { name: "Println", args: [], returns: [] }, { name: "SetFlags", args: [], returns: [] }, { name: "SetOutput", args: [], returns: [] }, { name: "SetPrefix", args: [], returns: [] }, { name: "Writer", args: [], returns: [] }, { name: "output", args: [], returns: [] }],
		Logger,
		{"outMu": "sync.Mutex", "out": "io.Writer", "prefix": "atomic.Pointer", "flag": "atomic.Int32", "isDiscard": "atomic.Bool"}
	)
}

export const Ldate: number = 1

export const Ltime: number = 2

export const Lmicroseconds: number = 4

export const Llongfile: number = 8

export const Lshortfile: number = 16

export const LUTC: number = 32

export const Lmsgprefix: number = 64

export const LstdFlags: number = 3

export async function New(out: io.Writer | null, prefix: string, flag: number): globalThis.Promise<Logger | $.VarRef<Logger> | null> {
	let l: Logger | $.VarRef<Logger> | null = new Logger()
	await Logger.prototype.SetOutput.call(l, out)
	Logger.prototype.SetPrefix.call(l, prefix)
	Logger.prototype.SetFlags.call(l, flag)
	return l
}

export let std: Logger | $.VarRef<Logger> | null = await New($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"), "", LstdFlags)

export function __goscript_set_std(__goscriptValue: Logger | $.VarRef<Logger> | null): void {
	std = __goscriptValue
}

export function Default(): Logger | $.VarRef<Logger> | null {
	return std
}

export function itoa(buf: $.VarRef<$.Slice<number>> | null, i: number, wid: number): void {
	// Assemble decimal in reverse order.
	let b: Uint8Array = new Uint8Array(20)
	let bp = $.len(b) - 1
	while ((i >= 10) || (wid > 1)) {
		wid--
		let q = Math.trunc(i / 10)
		b[bp] = $.uint($.uint((48 + i) - (q * 10), 8), 8)
		bp--
		i = q
	}
	// i < 10
	b[bp] = $.uint($.uint(48 + i, 8), 8)
	buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), ...($.goSlice(b, bp, undefined) ?? []))
}

export function formatHeader(buf: $.VarRef<$.Slice<number>> | null, t: time.Time, prefix: string, flag: number, file: string, line: number): void {
	if ((flag & Lmsgprefix) == 0) {
		buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), ...($.stringToBytes(prefix) ?? []))
	}
	if ((flag & ((Ldate | Ltime) | Lmicroseconds)) != 0) {
		if ((flag & LUTC) != 0) {
			t = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t)).UTC()))
		}
		if ((flag & Ldate) != 0) {
			let [year, month, day] = $.markAsStructValue($.cloneStructValue(t)).Date()
			itoa(buf, year, 4)
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(47, 8))
			itoa(buf, $.int(month), 2)
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(47, 8))
			itoa(buf, day, 2)
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(32, 8))
		}
		if ((flag & (Ltime | Lmicroseconds)) != 0) {
			let [hour, min, sec] = $.markAsStructValue($.cloneStructValue(t)).Clock()
			itoa(buf, hour, 2)
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(58, 8))
			itoa(buf, min, 2)
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(58, 8))
			itoa(buf, sec, 2)
			if ((flag & Lmicroseconds) != 0) {
				buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(46, 8))
				itoa(buf, Math.trunc($.markAsStructValue($.cloneStructValue(t)).Nanosecond() / 1e3), 6)
			}
			buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(32, 8))
		}
	}
	if ((flag & (Lshortfile | Llongfile)) != 0) {
		if ((flag & Lshortfile) != 0) {
			let short = file
			for (let i = $.len(file) - 1; i > 0; i--) {
				if ($.uint($.indexStringOrBytes(file, i), 8) == $.uint(47, 8)) {
					short = $.sliceStringOrBytes(file, i + 1, undefined)
					break
				}
			}
			file = short
		}
		buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), ...($.stringToBytes(file) ?? []))
		buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), $.uint(58, 8))
		itoa(buf, line, -1)
		buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), ...($.stringToBytes(": ") ?? []))
	}
	if ((flag & Lmsgprefix) != 0) {
		buf!.value = $.append($.pointerValue<$.Slice<number>>(buf), ...($.stringToBytes(prefix) ?? []))
	}
}

export let bufferPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: $.functionValue((): any => {
	return $.interfaceValue<any>($.varRef<$.Slice<number>>(null as $.Slice<number>), "*[]byte")
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})))

export function __goscript_set_bufferPool(__goscriptValue: sync.Pool): void {
	bufferPool.value = __goscriptValue
}

export function getBuffer(): $.VarRef<$.Slice<number>> | null {
	let p = $.mustTypeAssert<$.VarRef<$.Slice<number>> | null>(bufferPool.value.Get(), { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } })
	p!.value = $.goSlice(($.pointerValue<$.Slice<number>>(p)), undefined, 0)
	return p
}

export function putBuffer(p: $.VarRef<$.Slice<number>> | null): void {
	// Proper usage of a sync.Pool requires each entry to have approximately
	// the same memory cost. To obtain this property when the stored type
	// contains a variably-sized buffer, we add a hard limit on the maximum buffer
	// to place back in the pool.
	//
	// See https://go.dev/issue/23199
	if ($.cap($.pointerValue<$.Slice<number>>(p)) > (65536)) {
		p!.value = null
	}
	bufferPool.value.Put($.interfaceValue<any>(p, "*[]byte"))
}

function __goscriptInit0(): void {
	internal.__goscript_set_DefaultOutput($.functionValue(async (pc: number, data: $.Slice<number>): globalThis.Promise<$.GoError> => {
		return await Logger.prototype.output.call(std, $.uint(pc, 64), 0, $.functionValue((buf: $.Slice<number>): $.Slice<number> => {
			return $.append(buf, ...(data ?? []))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: ["error"] } as $.FunctionTypeInfo)))
}

export async function SetOutput(w: io.Writer | null): globalThis.Promise<void> {
	await Logger.prototype.SetOutput.call(std, w)
}

export function Flags(): number {
	return Logger.prototype.Flags.call(std)
}

export function SetFlags(flag: number): void {
	Logger.prototype.SetFlags.call(std, flag)
}

export function Prefix(): string {
	return Logger.prototype.Prefix.call(std)
}

export function SetPrefix(prefix: string): void {
	Logger.prototype.SetPrefix.call(std, prefix)
}

export async function Writer(): globalThis.Promise<io.Writer | null> {
	return await Logger.prototype.Writer.call(std)
}

export async function Print(v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Append(b, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
}

export async function Printf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Appendf(b, format, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
}

export async function Println(v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Appendln(b, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
}

export async function Fatal(v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Append(b, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	os.Exit(1)
}

export async function Fatalf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Appendf(b, format, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	os.Exit(1)
}

export async function Fatalln(v: $.Slice<any>): globalThis.Promise<void> {
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return fmt.Appendln(b, ...(v ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	os.Exit(1)
}

export async function Panic(v: $.Slice<any>): globalThis.Promise<void> {
	let s = fmt.Sprint(...(v ?? []))
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return $.append(b, ...($.stringToBytes(s) ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	$.panic(s)
}

export async function Panicf(format: string, v: $.Slice<any>): globalThis.Promise<void> {
	let s = fmt.Sprintf(format, ...(v ?? []))
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return $.append(b, ...($.stringToBytes(s) ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	$.panic(s)
}

export async function Panicln(v: $.Slice<any>): globalThis.Promise<void> {
	let s = fmt.Sprintln(...(v ?? []))
	await Logger.prototype.output.call(std, $.uint(0, 64), 2, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return $.append(b, ...($.stringToBytes(s) ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
	$.panic(s)
}

export async function Output(calldepth: number, s: string): globalThis.Promise<$.GoError> {
	return await Logger.prototype.output.call(std, $.uint(0, 64), calldepth + 1, $.functionValue((b: $.Slice<number>): $.Slice<number> => {
		return $.append(b, ...($.stringToBytes(s) ?? []))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }] } as $.FunctionTypeInfo)))
}

__goscriptInit0()
