// Generated file based on reader.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"

export class oneByteReader {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
	}

	constructor(init?: Partial<{r?: io.Reader | null}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.Reader | null))
		}
	}

	public clone(): oneByteReader {
		const cloned = new oneByteReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: oneByteReader | $.VarRef<oneByteReader> | null = this
		if ($.len(p) == 0) {
			return [0, null]
		}
		return $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<oneByteReader>(r).r).Read($.goSlice(p, 0, 1))
	}

	static __typeInfo = $.registerStructType(
		"iotest.oneByteReader",
		() => new oneByteReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		oneByteReader,
		[{ name: "r", key: "r", type: "io.Reader" }]
	)
}

export class halfReader {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
	}

	constructor(init?: Partial<{r?: io.Reader | null}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.Reader | null))
		}
	}

	public clone(): halfReader {
		const cloned = new halfReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: halfReader | $.VarRef<halfReader> | null = this
		return $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<halfReader>(r).r).Read($.goSlice(p, 0, Math.trunc(($.len(p) + 1) / 2)))
	}

	static __typeInfo = $.registerStructType(
		"iotest.halfReader",
		() => new halfReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		halfReader,
		[{ name: "r", key: "r", type: "io.Reader" }]
	)
}

export class dataErrReader {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get unread(): $.Slice<number> {
		return this._fields.unread.value
	}
	public set unread(value: $.Slice<number>) {
		this._fields.unread.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
		unread: $.VarRef<$.Slice<number>>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{r?: io.Reader | null, unread?: $.Slice<number>, data?: $.Slice<number>}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.Reader | null)),
			unread: $.varRef(init?.unread ?? (null as $.Slice<number>)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): dataErrReader {
		const cloned = new dataErrReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			unread: $.varRef(this._fields.unread.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: dataErrReader | $.VarRef<dataErrReader> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		// loop because first call needs two reads:
		// one to get data and a second to look for an error.
		while (true) {
			if ($.len($.pointerValue<dataErrReader>(r).unread) == 0) {
				let [n1, err1] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<dataErrReader>(r).r).Read($.pointerValue<dataErrReader>(r).data)
				$.pointerValue<dataErrReader>(r).unread = $.goSlice($.pointerValue<dataErrReader>(r).data, 0, n1)
				err = err1
			}
			if ((n > 0) || (err != null)) {
				break
			}
			n = $.copy(p, $.pointerValue<dataErrReader>(r).unread)
			$.pointerValue<dataErrReader>(r).unread = $.goSlice($.pointerValue<dataErrReader>(r).unread, n, undefined)
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.dataErrReader",
		() => new dataErrReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		dataErrReader,
		[{ name: "r", key: "r", type: "io.Reader" }, { name: "unread", key: "unread", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export class timeoutReader {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
		count: $.VarRef<number>
	}

	constructor(init?: Partial<{r?: io.Reader | null, count?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.Reader | null)),
			count: $.varRef(init?.count ?? (0 as number))
		}
	}

	public clone(): timeoutReader {
		const cloned = new timeoutReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			count: $.varRef(this._fields.count.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: timeoutReader | $.VarRef<timeoutReader> | null = this
		$.pointerValue<timeoutReader>(r).count++
		if ($.pointerValue<timeoutReader>(r).count == 2) {
			return [0, ErrTimeout]
		}
		return $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<timeoutReader>(r).r).Read(p)
	}

	static __typeInfo = $.registerStructType(
		"iotest.timeoutReader",
		() => new timeoutReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		timeoutReader,
		[{ name: "r", key: "r", type: "io.Reader" }, { name: "count", key: "count", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class errReader {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? (null as $.GoError))
		}
	}

	public clone(): errReader {
		const cloned = new errReader()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const r: errReader | $.VarRef<errReader> | null = this
		return [0, $.pointerValue<errReader>(r).err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.errReader",
		() => new errReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		errReader,
		[{ name: "err", key: "err", type: "error" }]
	)
}

export class smallByteReader {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get off(): number {
		return this._fields.off.value
	}
	public set off(value: number) {
		this._fields.off.value = value
	}

	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
		off: $.VarRef<number>
		n: $.VarRef<number>
	}

	constructor(init?: Partial<{r?: io.Reader | null, off?: number, n?: number}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as io.Reader | null)),
			off: $.varRef(init?.off ?? (0 as number)),
			n: $.varRef(init?.n ?? (0 as number))
		}
	}

	public clone(): smallByteReader {
		const cloned = new smallByteReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			off: $.varRef(this._fields.off.value),
			n: $.varRef(this._fields.n.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: smallByteReader | $.VarRef<smallByteReader> | null = this
		if ($.len(p) == 0) {
			return [0, null]
		}
		$.pointerValue<smallByteReader>(r).n = ($.pointerValue<smallByteReader>(r).n % 3) + 1
		let n = $.pointerValue<smallByteReader>(r).n
		if (n > $.len(p)) {
			n = $.len(p)
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<smallByteReader>(r).r).Read($.goSlice(p, 0, n))
		n = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if ((err != null) && (!$.comparableEqual(err, io.EOF))) {
			err = fmt.Errorf("Read(%d bytes at offset %d): %v", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.pointerValue<smallByteReader>(r).off, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any))
		}
		$.pointerValue<smallByteReader>(r).off = $.pointerValue<smallByteReader>(r).off + (n)
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.smallByteReader",
		() => new smallByteReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		smallByteReader,
		[{ name: "r", key: "r", type: "io.Reader" }, { name: "off", key: "off", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export function OneByteReader(r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new oneByteReader({r: r}), "*iotest.oneByteReader")
}

export function HalfReader(r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new halfReader({r: r}), "*iotest.halfReader")
}

export function DataErrReader(r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new dataErrReader({r: r, unread: null, data: $.makeSlice<number>(1024, undefined, "byte")}), "*iotest.dataErrReader")
}

export let ErrTimeout: $.GoError = errors.New("timeout")

export function __goscript_set_ErrTimeout(__goscriptValue: $.GoError): void {
	ErrTimeout = __goscriptValue
}

export function TimeoutReader(r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new timeoutReader({r: r, count: 0}), "*iotest.timeoutReader")
}

export function ErrReader(err: $.GoError): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new errReader({err: err}), "*iotest.errReader")
}

export async function TestReader(r: io.Reader | null, content: $.Slice<number>): globalThis.Promise<$.GoError> {
	if ($.len(content) > 0) {
		let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>(r).Read(null)
		if ((n != 0) || (err != null)) {
			return fmt.Errorf("Read(0) = %d, %v, want 0, nil", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any))
		}
	}

	let __goscriptTuple1: any = await io.ReadAll($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new smallByteReader({r: r}), "*iotest.smallByteReader"))!)
	let data: $.Slice<number> = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return err
	}
	if (!bytes.Equal(data, content)) {
		return fmt.Errorf("ReadAll(small amounts) = %q\n\twant %q", $.interfaceValue<any>(data, "[]byte"), $.interfaceValue<any>(content, "[]byte"))
	}
	let __goscriptTuple2: any = await $.pointerValue<Exclude<io.Reader, null>>(r).Read($.makeSlice<number>(10, undefined, "byte"))
	let n = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if ((n != 0) || (!$.comparableEqual(err, io.EOF))) {
		return fmt.Errorf("Read(10) at EOF = %v, %v, want 0, EOF", $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any))
	}

	let __goscriptShadow0 = r
	{
		let __goscriptTuple3: any = $.typeAssertTuple<io.ReadSeeker | null>(__goscriptShadow0, "io.ReadSeeker")
		let __goscriptShadow1 = __goscriptTuple3[0]
		let ok = __goscriptTuple3[1]
		if (ok) {
			// Seek(0, 1) should report the current file position (EOF).
			{
				let [off, __goscriptShadow2] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek(0n, 1)
				if ((off != $.int64($.len(content))) || (__goscriptShadow2 != null)) {
					return fmt.Errorf("Seek(0, 1) from EOF = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow2 as any), $.namedValueInterfaceValue<any>($.len(content), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}

			// Seek backward partway through file, in two steps.
			// If middle == 0, len(content) == 0, can't use the -1 and +1 seeks.
			let middle = $.len(content) - (Math.trunc($.len(content) / 3))
			if (middle > 0) {
				{
					let [off, __goscriptShadow3] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek(-1n, 1)
					if ((off != $.int64($.len(content) - 1)) || (__goscriptShadow3 != null)) {
						return fmt.Errorf("Seek(-1, 1) from EOF = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(-off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow3 as any), $.namedValueInterfaceValue<any>($.len(content) - 1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}
				{
					let [off, __goscriptShadow4] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek($.int64(Math.trunc(-$.len(content) / 3)), 1)
					if ((off != $.int64(middle - 1)) || (__goscriptShadow4 != null)) {
						return fmt.Errorf("Seek(%d, 1) from %d = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(Math.trunc(-$.len(content) / 3), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(content) - 1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow4 as any), $.namedValueInterfaceValue<any>(middle - 1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}
				{
					let [off, __goscriptShadow5] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek(1n, 1)
					if ((off != $.int64(middle)) || (__goscriptShadow5 != null)) {
						return fmt.Errorf("Seek(+1, 1) from %d = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(middle - 1, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow5 as any), $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
				}
			}

			// Seek(0, 1) should report the current file position (middle).
			{
				let [off, __goscriptShadow6] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek(0n, 1)
				if ((off != $.int64(middle)) || (__goscriptShadow6 != null)) {
					return fmt.Errorf("Seek(0, 1) from %d = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow6 as any), $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}

			// Reading forward should return the last part of the file.
			let __goscriptTuple4: any = await io.ReadAll($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new smallByteReader({r: (__goscriptShadow1 as io.Reader | null)}), "*iotest.smallByteReader"))!)
			let __goscriptShadow7: $.Slice<number> = __goscriptTuple4[0]
			let __goscriptShadow8 = __goscriptTuple4[1]
			if (__goscriptShadow8 != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow8 as any))
			}
			if (!bytes.Equal(__goscriptShadow7, $.goSlice(content, middle, undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>(__goscriptShadow7, "[]byte"), $.interfaceValue<any>($.goSlice(content, middle, undefined), "[]byte"))
			}

			// Seek relative to end of file, but start elsewhere.
			{
				let [off, __goscriptShadow9] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek($.int64(Math.trunc(middle / 2)), 0)
				if ((off != $.int64(Math.trunc(middle / 2))) || (__goscriptShadow9 != null)) {
					return fmt.Errorf("Seek(%d, 0) from EOF = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow9 as any), $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}
			{
				let [off, __goscriptShadow10] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek($.int64(Math.trunc(-$.len(content) / 3)), 2)
				if ((off != $.int64(middle)) || (__goscriptShadow10 != null)) {
					return fmt.Errorf("Seek(%d, 2) from %d = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(Math.trunc(-$.len(content) / 3), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow10 as any), $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}

			// Reading forward should return the last part of the file (again).
			let __goscriptTuple5: any = await io.ReadAll($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new smallByteReader({r: (__goscriptShadow1 as io.Reader | null)}), "*iotest.smallByteReader"))!)
			__goscriptShadow7 = __goscriptTuple5[0]
			__goscriptShadow8 = __goscriptTuple5[1]
			if (__goscriptShadow8 != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow8 as any))
			}
			if (!bytes.Equal(__goscriptShadow7, $.goSlice(content, middle, undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", $.namedValueInterfaceValue<any>(middle, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>(__goscriptShadow7, "[]byte"), $.interfaceValue<any>($.goSlice(content, middle, undefined), "[]byte"))
			}

			// Absolute seek & read forward.
			{
				let [off, __goscriptShadow11] = await $.pointerValue<Exclude<io.ReadSeeker, null>>(__goscriptShadow1).Seek($.int64(Math.trunc(middle / 2)), 0)
				if ((off != $.int64(Math.trunc(middle / 2))) || (__goscriptShadow11 != null)) {
					return fmt.Errorf("Seek(%d, 0) from EOF = %d, %v, want %d, nil", $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(off, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), (__goscriptShadow11 as any), $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
				}
			}
			let __goscriptTuple6: any = await io.ReadAll($.pointerValueOrNil((__goscriptShadow1 as io.Reader | null))!)
			__goscriptShadow7 = __goscriptTuple6[0]
			__goscriptShadow8 = __goscriptTuple6[1]
			if (__goscriptShadow8 != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow8 as any))
			}
			if (!bytes.Equal(__goscriptShadow7, $.goSlice(content, Math.trunc(middle / 2), undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", $.namedValueInterfaceValue<any>(Math.trunc(middle / 2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>(__goscriptShadow7, "[]byte"), $.interfaceValue<any>($.goSlice(content, Math.trunc(middle / 2), undefined), "[]byte"))
			}
		}
	}

	let __goscriptShadow12 = r
	{
		let __goscriptTuple7: any = $.typeAssertTuple<io.ReaderAt | null>(__goscriptShadow12, "io.ReaderAt")
		let __goscriptShadow13 = __goscriptTuple7[0]
		let ok = __goscriptTuple7[1]
		if (ok) {
			let __goscriptShadow14: $.Slice<number> = $.makeSlice<number>($.len(content), $.len(content) + 1, "byte")
			for (let __goscriptRangeTarget0 = __goscriptShadow14, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
				__goscriptShadow14![i] = $.uint(0xfe, 8)
			}
			let [__goscriptShadow15, __goscriptShadow16] = await $.pointerValue<Exclude<io.ReaderAt, null>>(__goscriptShadow13).ReadAt(__goscriptShadow14, 0n)
			if ((__goscriptShadow15 != $.len(__goscriptShadow14)) || ((__goscriptShadow16 != null) && (!$.comparableEqual(__goscriptShadow16, io.EOF)))) {
				return fmt.Errorf("ReadAt(%d, 0) = %v, %v, want %d, nil or EOF", $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(__goscriptShadow15, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow16 as any), $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
			}
			if (!bytes.Equal(__goscriptShadow14, content)) {
				return fmt.Errorf("ReadAt(%d, 0) = %q\n\twant %q", $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>(__goscriptShadow14, "[]byte"), $.interfaceValue<any>(content, "[]byte"))
			}

			let __goscriptTuple8: any = await $.pointerValue<Exclude<io.ReaderAt, null>>(__goscriptShadow13).ReadAt($.goSlice(__goscriptShadow14, undefined, 1), $.int64($.len(__goscriptShadow14)))
			__goscriptShadow15 = __goscriptTuple8[0]
			__goscriptShadow16 = __goscriptTuple8[1]
			if ((__goscriptShadow15 != 0) || (!$.comparableEqual(__goscriptShadow16, io.EOF))) {
				return fmt.Errorf("ReadAt(1, %d) = %v, %v, want 0, EOF", $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(__goscriptShadow15, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow16 as any))
			}

			for (let __goscriptRangeTarget1 = __goscriptShadow14, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
				__goscriptShadow14![i] = $.uint(0xfe, 8)
			}
			let __goscriptTuple9: any = await $.pointerValue<Exclude<io.ReaderAt, null>>(__goscriptShadow13).ReadAt($.goSlice(__goscriptShadow14, undefined, $.cap(__goscriptShadow14)), 0n)
			__goscriptShadow15 = __goscriptTuple9[0]
			__goscriptShadow16 = __goscriptTuple9[1]
			if ((__goscriptShadow15 != $.len(__goscriptShadow14)) || (!$.comparableEqual(__goscriptShadow16, io.EOF))) {
				return fmt.Errorf("ReadAt(%d, 0) = %v, %v, want %d, EOF", $.namedValueInterfaceValue<any>($.cap(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(__goscriptShadow15, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow16 as any), $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
			}
			if (!bytes.Equal(__goscriptShadow14, content)) {
				return fmt.Errorf("ReadAt(%d, 0) = %q\n\twant %q", $.namedValueInterfaceValue<any>($.len(__goscriptShadow14), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>(__goscriptShadow14, "[]byte"), $.interfaceValue<any>(content, "[]byte"))
			}

			for (let __goscriptRangeTarget2 = __goscriptShadow14, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
				__goscriptShadow14![i] = $.uint(0xfe, 8)
			}
			for (let __goscriptRangeTarget3 = __goscriptShadow14, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
				let __goscriptTuple10: any = await $.pointerValue<Exclude<io.ReaderAt, null>>(__goscriptShadow13).ReadAt($.goSlice(__goscriptShadow14, i, i + 1), $.int64(i))
				__goscriptShadow15 = __goscriptTuple10[0]
				__goscriptShadow16 = __goscriptTuple10[1]
				if ((__goscriptShadow15 != 1) || ((__goscriptShadow16 != null) && ((i != ($.len(__goscriptShadow14) - 1)) || (!$.comparableEqual(__goscriptShadow16, io.EOF))))) {
					let want = "nil"
					if (i == ($.len(__goscriptShadow14) - 1)) {
						want = "nil or EOF"
					}
					return fmt.Errorf("ReadAt(1, %d) = %v, %v, want 1, %s", $.namedValueInterfaceValue<any>(i, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(__goscriptShadow15, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow16 as any), want)
				}
				if ($.uint($.arrayIndex(__goscriptShadow14!, i), 8) != $.uint($.arrayIndex(content!, i), 8)) {
					return fmt.Errorf("ReadAt(1, %d) = %q want %q", $.namedValueInterfaceValue<any>(i, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>($.goSlice(__goscriptShadow14, i, i + 1), "[]byte"), $.interfaceValue<any>($.goSlice(content, i, i + 1), "[]byte"))
				}
			}
		}
	}
	return null
}
