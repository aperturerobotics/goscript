import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as internal from "@goscript/log/internal/index.js"

import * as os from "@goscript/os/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

// the date in the local time zone: 2009/01/23
export let Ldate: number = (1 << 0)

// the time in the local time zone: 01:23:23
export let Ltime: number = 0

// microsecond resolution: 01:23:23.123123.  assumes Ltime.
export let Lmicroseconds: number = 0

// full file name and line number: /a/b/c/d.go:23
export let Llongfile: number = 0

// final file name element and line number: d.go:23. overrides Llongfile
export let Lshortfile: number = 0

// if Ldate or Ltime is set, use UTC rather than the local time zone
export let LUTC: number = 0

// move the "prefix" from the beginning of the line to before the message
export let Lmsgprefix: number = 0

// initial values for the standard logger
export let LstdFlags: number = (1 | 2)

export class Logger {
	public get outMu(): sync.Mutex {
		return this._fields.outMu.value
	}
	public set outMu(value: sync.Mutex) {
		this._fields.outMu.value = value
	}

	// destination for output
	public get out(): io.Writer {
		return this._fields.out.value
	}
	public set out(value: io.Writer) {
		this._fields.out.value = value
	}

	// prefix on each line to identify the logger (but see Lmsgprefix)
	public get prefix(): atomic.Pointer<string> {
		return this._fields.prefix.value
	}
	public set prefix(value: atomic.Pointer<string>) {
		this._fields.prefix.value = value
	}

	// properties
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
		outMu: $.VarRef<sync.Mutex>;
		out: $.VarRef<io.Writer>;
		prefix: $.VarRef<atomic.Pointer<string>>;
		flag: $.VarRef<atomic.Int32>;
		isDiscard: $.VarRef<atomic.Bool>;
	}

	constructor(init?: Partial<{flag?: atomic.Int32, isDiscard?: atomic.Bool, out?: io.Writer, outMu?: sync.Mutex, prefix?: atomic.Pointer<string>}>) {
		this._fields = {
			outMu: $.varRef(init?.outMu ? $.markAsStructValue(init.outMu.clone()) : new sync.Mutex()),
			out: $.varRef(init?.out ?? null),
			prefix: $.varRef(init?.prefix ? $.markAsStructValue(init.prefix.clone()) : new atomic.Pointer<string>()),
			flag: $.varRef(init?.flag ? $.markAsStructValue(init.flag.clone()) : new atomic.Int32()),
			isDiscard: $.varRef(init?.isDiscard ? $.markAsStructValue(init.isDiscard.clone()) : new atomic.Bool())
		}
	}

	public clone(): Logger {
		const cloned = new Logger()
		cloned._fields = {
			outMu: $.varRef($.markAsStructValue(this._fields.outMu.value.clone())),
			out: $.varRef(this._fields.out.value),
			prefix: $.varRef($.markAsStructValue(this._fields.prefix.value.clone())),
			flag: $.varRef($.markAsStructValue(this._fields.flag.value.clone())),
			isDiscard: $.varRef($.markAsStructValue(this._fields.isDiscard.value.clone()))
		}
		return cloned
	}

	// SetOutput sets the output destination for the logger.
	public async SetOutput(w: io.Writer): Promise<void> {
		const l = this
		using __defer = new $.DisposableStack();
		await l.outMu.Lock()
		__defer.defer(() => {
			l.outMu.Unlock()
		});
		l.out = w
		l.isDiscard.Store(w == io.Discard)
	}

	// Output writes the output for a logging event. The string s contains
	// the text to print after the prefix specified by the flags of the
	// Logger. A newline is appended if the last character of s is not
	// already a newline. Calldepth is used to recover the PC and is
	// provided for generality, although at the moment on all pre-defined
	// paths it will be 2.
	public async Output(calldepth: number, s: string): Promise<$.GoError> {
		const l = this
		return await l.output(0, calldepth + 1, (b: $.Bytes): $.Bytes => {
			// +1 for this frame.
			return $.append(b, ...$.stringToBytes(s))
		})
	}

	// output can take either a calldepth or a pc to get source line information.
	// It uses the pc if it is non-zero.
	public async output(pc: uintptr, calldepth: number, appendOutput: ((p0: $.Bytes) => $.Bytes) | null): Promise<$.GoError> {
		const l = this
		using __defer = new $.DisposableStack();
		if (l.isDiscard.Load()) {
			return null
		}
		let now = $.markAsStructValue(time.Now().clone()) // get this early.
		let prefix = l.Prefix()
		let flag = l.Flags()
		let file: string = ""
		let line: number = 0
		if ((flag & ((16 | 8))) != 0) {
			if (pc == 0) {
				let ok: boolean = false
				;[, file, line, ok] = await runtime.Caller(calldepth)
				if (!ok) {
					file = "???"
					line = 0
				}
			}
			 else {
				let fs = runtime.CallersFrames($.arrayToSlice<uintptr>([pc]))
				let [f, ] = await fs!.Next()
				file = f.File
				if (file == "") {
					file = "???"
				}
				line = f.Line
			}
		}
		let buf = getBuffer()
		__defer.defer(() => {
			putBuffer(buf)
		});
		formatHeader(buf, now, prefix, flag, file, line)
		buf!.value = appendOutput!(buf!.value)
		if ($.len(buf!.value) == 0 || (buf!.value)![$.len(buf!.value) - 1] != 10) {
			buf!.value = $.append(buf!.value, 10)
		}
		await l.outMu.Lock()
		__defer.defer(() => {
			l.outMu.Unlock()
		});
		let [, err] = l.out!.Write(buf!.value)
		return err
	}

	// Print calls l.Output to print to the logger.
	// Arguments are handled in the manner of [fmt.Print].
	public async Print(...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Append(b, ...(v ?? []))
		})
	}

	// Printf calls l.Output to print to the logger.
	// Arguments are handled in the manner of [fmt.Printf].
	public async Printf(format: string, ...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Appendf(b, format, ...(v ?? []))
		})
	}

	// Println calls l.Output to print to the logger.
	// Arguments are handled in the manner of [fmt.Println].
	public async Println(...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Appendln(b, ...(v ?? []))
		})
	}

	// Fatal is equivalent to l.Print() followed by a call to [os.Exit](1).
	public async Fatal(...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Append(b, ...(v ?? []))
		})
		os.Exit(1)
	}

	// Fatalf is equivalent to l.Printf() followed by a call to [os.Exit](1).
	public async Fatalf(format: string, ...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Appendf(b, format, ...(v ?? []))
		})
		os.Exit(1)
	}

	// Fatalln is equivalent to l.Println() followed by a call to [os.Exit](1).
	public async Fatalln(...v: any[]): Promise<void> {
		const l = this
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return fmt.Appendln(b, ...(v ?? []))
		})
		os.Exit(1)
	}

	// Panic is equivalent to l.Print() followed by a call to panic().
	public async Panic(...v: any[]): Promise<void> {
		const l = this
		let s = fmt.Sprint(...(v ?? []))
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return $.append(b, ...$.stringToBytes(s))
		})
		$.panic(s)
	}

	// Panicf is equivalent to l.Printf() followed by a call to panic().
	public async Panicf(format: string, ...v: any[]): Promise<void> {
		const l = this
		let s = fmt.Sprintf(format, ...(v ?? []))
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return $.append(b, ...$.stringToBytes(s))
		})
		$.panic(s)
	}

	// Panicln is equivalent to l.Println() followed by a call to panic().
	public async Panicln(...v: any[]): Promise<void> {
		const l = this
		let s = fmt.Sprintln(...(v ?? []))
		await l.output(0, 2, (b: $.Bytes): $.Bytes => {
			return $.append(b, ...$.stringToBytes(s))
		})
		$.panic(s)
	}

	// Flags returns the output flags for the logger.
	// The flag bits are [Ldate], [Ltime], and so on.
	public Flags(): number {
		const l = this
		return $.int(l.flag.Load())
	}

	// SetFlags sets the output flags for the logger.
	// The flag bits are [Ldate], [Ltime], and so on.
	public SetFlags(flag: number): void {
		const l = this
		l.flag.Store((flag as number))
	}

	// Prefix returns the output prefix for the logger.
	public Prefix(): string {
		const l = this
		{
			let p = l.prefix.Load()
			if (p != null) {
				return p!.value
			}
		}
		return ""
	}

	// SetPrefix sets the output prefix for the logger.
	public SetPrefix(prefix: string): void {
		const l = this
		l.prefix.Store(prefix)
	}

	// Writer returns the output destination for the logger.
	public async Writer(): Promise<io.Writer> {
		const l = this
		using __defer = new $.DisposableStack();
		await l.outMu.Lock()
		__defer.defer(() => {
			l.outMu.Unlock()
		});
		return l.out
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Logger',
	  new Logger(),
	  [{ name: "SetOutput", args: [{ name: "w", type: "Writer" }], returns: [] }, { name: "Output", args: [{ name: "calldepth", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "output", args: [{ name: "pc", type: { kind: $.TypeKind.Basic, name: "uintptr" } }, { name: "calldepth", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "appendOutput", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } }] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Print", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Printf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Println", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatal", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalln", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panic", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicln", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Flags", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "SetFlags", args: [{ name: "flag", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [] }, { name: "Prefix", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "SetPrefix", args: [{ name: "prefix", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "Writer", args: [], returns: [{ type: "Writer" }] }],
	  Logger,
	  {"outMu": "Mutex", "out": "Writer", "prefix": "Pointer", "flag": "Int32", "isDiscard": "Bool"}
	);
}

let bufferPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: (): null | any => {
	return new $.Bytes()
}})))

let std: Logger | null = await New(os.Stderr, "", 3)

// New creates a new [Logger]. The out variable sets the
// destination to which log data will be written.
// The prefix appears at the beginning of each generated log line, or
// after the log header if the [Lmsgprefix] flag is provided.
// The flag argument defines the logging properties.
export async function New(out: io.Writer, prefix: string, flag: number): Promise<Logger | null> {
	let l = new Logger()
	await l!.SetOutput(out)
	l!.SetPrefix(prefix)
	l!.SetFlags(flag)
	return l
}

// Default returns the standard logger used by the package-level output functions.
export function Default(): Logger | null {
	return std
}

// Cheap integer to fixed-width decimal ASCII. Give a negative width to avoid zero-padding.
export function itoa(buf: $.VarRef<$.Bytes> | null, i: number, wid: number): void {
	// Assemble decimal in reverse order.
	let b: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let bp = $.len(b) - 1
	for (; i >= 10 || wid > 1; ) {
		wid--
		let q = i / 10
		b![bp] = $.byte(48 + i - q * 10)
		bp--
		i = q
	}
	// i < 10
	b![bp] = $.byte(48 + i)
	buf!.value = $.append(buf!.value, $.goSlice(b, bp, undefined))
}

// formatHeader writes log header to buf in following order:
//   - l.prefix (if it's not blank and Lmsgprefix is unset),
//   - date and/or time (if corresponding flags are provided),
//   - file and line number (if corresponding flags are provided),
//   - l.prefix (if it's not blank and Lmsgprefix is set).
export function formatHeader(buf: $.VarRef<$.Bytes> | null, t: time.Time, prefix: string, flag: number, file: string, line: number): void {
	if ((flag & 64) == 0) {
		buf!.value = $.append(buf!.value, ...$.stringToBytes(prefix))
	}
	if ((flag & (((1 | 2) | 4))) != 0) {
		if ((flag & 32) != 0) {
			t = $.markAsStructValue(t.UTC().clone())
		}
		if ((flag & 1) != 0) {
			let [year, month, day] = t.Date()
			itoa(buf, year, 4)
			buf!.value = $.append(buf!.value, 47)
			itoa(buf, month, 2)
			buf!.value = $.append(buf!.value, 47)
			itoa(buf, day, 2)
			buf!.value = $.append(buf!.value, 32)
		}
		if ((flag & ((2 | 4))) != 0) {
			let [hour, min, sec] = t.Clock()
			itoa(buf, hour, 2)
			buf!.value = $.append(buf!.value, 58)
			itoa(buf, min, 2)
			buf!.value = $.append(buf!.value, 58)
			itoa(buf, sec, 2)
			if ((flag & 4) != 0) {
				buf!.value = $.append(buf!.value, 46)
				itoa(buf, t.Nanosecond() / 1e3, 6)
			}
			buf!.value = $.append(buf!.value, 32)
		}
	}
	if ((flag & ((16 | 8))) != 0) {
		if ((flag & 16) != 0) {
			let short = file
			for (let i = $.len(file) - 1; i > 0; i--) {
				if ($.indexString(file, i) == 47) {
					short = $.sliceString(file, i + 1, undefined)
					break
				}
			}
			file = short
		}
		buf!.value = $.append(buf!.value, ...$.stringToBytes(file))
		buf!.value = $.append(buf!.value, 58)
		itoa(buf, line, -1)
		buf!.value = $.append(buf!.value, ...$.stringToBytes(": "))
	}
	if ((flag & 64) != 0) {
		buf!.value = $.append(buf!.value, ...$.stringToBytes(prefix))
	}
}

export function getBuffer(): $.VarRef<$.Bytes> | null {
	let p = $.mustTypeAssert<$.VarRef<$.Bytes> | null>(bufferPool!.value.Get(), {kind: $.TypeKind.Pointer, elemType: {kind: $.TypeKind.Slice, elemType: {kind: $.TypeKind.Basic, name: 'number'}}})
	p!.value = $.goSlice((p!.value), undefined, 0)
	return p
}

export function putBuffer(p: $.VarRef<$.Bytes> | null): void {
	// Proper usage of a sync.Pool requires each entry to have approximately
	// the same memory cost. To obtain this property when the stored type
	// contains a variably-sized buffer, we add a hard limit on the maximum buffer
	// to place back in the pool.
	//
	// See https://go.dev/issue/23199
	if ($.cap(p!.value) > (64 << 10)) {
		p!.value = null
	}
	bufferPool!.value.Put(p)
}

export async function init(): Promise<void> {
	internal.DefaultOutput = async (pc: uintptr, data: $.Bytes): Promise<$.GoError> => {
		return await std!.output(pc, 0, (buf: $.Bytes): $.Bytes => {
			return $.append(buf, data)
		})
	}
}

// SetOutput sets the output destination for the standard logger.
export async function SetOutput(w: io.Writer): Promise<void> {
	await std!.SetOutput(w)
}

// Flags returns the output flags for the standard logger.
// The flag bits are [Ldate], [Ltime], and so on.
export function Flags(): number {
	return std!.Flags()
}

// SetFlags sets the output flags for the standard logger.
// The flag bits are [Ldate], [Ltime], and so on.
export function SetFlags(flag: number): void {
	std!.SetFlags(flag)
}

// Prefix returns the output prefix for the standard logger.
export function Prefix(): string {
	return std!.Prefix()
}

// SetPrefix sets the output prefix for the standard logger.
export function SetPrefix(prefix: string): void {
	std!.SetPrefix(prefix)
}

// Writer returns the output destination for the standard logger.
export async function Writer(): Promise<io.Writer> {
	return await std!.Writer()
}

// Print calls Output to print to the standard logger.
// Arguments are handled in the manner of [fmt.Print].
export async function Print(...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Append(b, ...(v ?? []))
	})
}

// Printf calls Output to print to the standard logger.
// Arguments are handled in the manner of [fmt.Printf].
export async function Printf(format: string, ...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Appendf(b, format, ...(v ?? []))
	})
}

// Println calls Output to print to the standard logger.
// Arguments are handled in the manner of [fmt.Println].
export async function Println(...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Appendln(b, ...(v ?? []))
	})
}

// Fatal is equivalent to [Print] followed by a call to [os.Exit](1).
export async function Fatal(...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Append(b, ...(v ?? []))
	})
	os.Exit(1)
}

// Fatalf is equivalent to [Printf] followed by a call to [os.Exit](1).
export async function Fatalf(format: string, ...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Appendf(b, format, ...(v ?? []))
	})
	os.Exit(1)
}

// Fatalln is equivalent to [Println] followed by a call to [os.Exit](1).
export async function Fatalln(...v: any[]): Promise<void> {
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return fmt.Appendln(b, ...(v ?? []))
	})
	os.Exit(1)
}

// Panic is equivalent to [Print] followed by a call to panic().
export async function Panic(...v: any[]): Promise<void> {
	let s = fmt.Sprint(...(v ?? []))
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return $.append(b, ...$.stringToBytes(s))
	})
	$.panic(s)
}

// Panicf is equivalent to [Printf] followed by a call to panic().
export async function Panicf(format: string, ...v: any[]): Promise<void> {
	let s = fmt.Sprintf(format, ...(v ?? []))
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return $.append(b, ...$.stringToBytes(s))
	})
	$.panic(s)
}

// Panicln is equivalent to [Println] followed by a call to panic().
export async function Panicln(...v: any[]): Promise<void> {
	let s = fmt.Sprintln(...(v ?? []))
	await std!.output(0, 2, (b: $.Bytes): $.Bytes => {
		return $.append(b, ...$.stringToBytes(s))
	})
	$.panic(s)
}

// Output writes the output for a logging event. The string s contains
// the text to print after the prefix specified by the flags of the
// Logger. A newline is appended if the last character of s is not
// already a newline. Calldepth is the count of the number of
// frames to skip when computing the file name and line number
// if [Llongfile] or [Lshortfile] is set; a value of 1 will print the details
// for the caller of Output.
export async function Output(calldepth: number, s: string): Promise<$.GoError> {
	// +1 for this frame.
	return await std!.output(0, calldepth + 1, (b: $.Bytes): $.Bytes => {
		// +1 for this frame.
		return $.append(b, ...$.stringToBytes(s))
	})
}

