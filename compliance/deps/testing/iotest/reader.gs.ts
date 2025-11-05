import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

export class dataErrReader {
	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
		this._fields.r.value = value
	}

	public get unread(): $.Bytes {
		return this._fields.unread.value
	}
	public set unread(value: $.Bytes) {
		this._fields.unread.value = value
	}

	public get data(): $.Bytes {
		return this._fields.data.value
	}
	public set data(value: $.Bytes) {
		this._fields.data.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader>;
		unread: $.VarRef<$.Bytes>;
		data: $.VarRef<$.Bytes>;
	}

	constructor(init?: Partial<{data?: $.Bytes, r?: io.Reader, unread?: $.Bytes}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null),
			unread: $.varRef(init?.unread ?? new Uint8Array(0)),
			data: $.varRef(init?.data ?? new Uint8Array(0))
		}
	}

	public clone(): dataErrReader {
		const cloned = new dataErrReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			unread: $.varRef(this._fields.unread.value),
			data: $.varRef(this._fields.data.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		let n: number = 0
		let err: $.GoError = null
		for (; ; ) {
			if ($.len(r.unread) == 0) {
				let [n1, err1] = r.r!.Read(r.data)
				r.unread = $.goSlice(r.data, 0, n1)
				err = err1
			}
			if (n > 0 || err != null) {
				break
			}
			n = $.copy(p, r.unread)
			r.unread = $.goSlice(r.unread, n, undefined)
		}
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'dataErrReader',
	  new dataErrReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  dataErrReader,
	  {"r": "Reader", "unread": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } }, "data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } }}
	);
}

export class errReader {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>;
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null)
		}
	}

	public clone(): errReader {
		const cloned = new errReader()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		return [0, r.err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'errReader',
	  new errReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  errReader,
	  {"err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }}
	);
}

export class halfReader {
	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
		this._fields.r.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader>;
	}

	constructor(init?: Partial<{r?: io.Reader}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null)
		}
	}

	public clone(): halfReader {
		const cloned = new halfReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		return r.r!.Read($.goSlice(p, 0, ($.len(p) + 1) / 2))
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'halfReader',
	  new halfReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  halfReader,
	  {"r": "Reader"}
	);
}

export class oneByteReader {
	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
		this._fields.r.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader>;
	}

	constructor(init?: Partial<{r?: io.Reader}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null)
		}
	}

	public clone(): oneByteReader {
		const cloned = new oneByteReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		if ($.len(p) == 0) {
			return [0, null]
		}
		return r.r!.Read($.goSlice(p, 0, 1))
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'oneByteReader',
	  new oneByteReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  oneByteReader,
	  {"r": "Reader"}
	);
}

export class smallByteReader {
	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
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
		r: $.VarRef<io.Reader>;
		off: $.VarRef<number>;
		n: $.VarRef<number>;
	}

	constructor(init?: Partial<{n?: number, off?: number, r?: io.Reader}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null),
			off: $.varRef(init?.off ?? 0),
			n: $.varRef(init?.n ?? 0)
		}
	}

	public clone(): smallByteReader {
		const cloned = new smallByteReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			off: $.varRef(this._fields.off.value),
			n: $.varRef(this._fields.n.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		if ($.len(p) == 0) {
			return [0, null]
		}
		r.n = r.n % 3 + 1
		let n = r.n
		if (n > $.len(p)) {
			n = $.len(p)
		}
		let err: $.GoError
		[n, err] = r.r!.Read($.goSlice(p, 0, n))
		if (err != null && err != io.EOF) {
			err = fmt.Errorf("Read(%d bytes at offset %d): %v", n, r.off, err)
		}
		r.off += n
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'smallByteReader',
	  new smallByteReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  smallByteReader,
	  {"r": "Reader", "off": { kind: $.TypeKind.Basic, name: "number" }, "n": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

export class timeoutReader {
	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
		this._fields.r.value = value
	}

	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader>;
		count: $.VarRef<number>;
	}

	constructor(init?: Partial<{count?: number, r?: io.Reader}>) {
		this._fields = {
			r: $.varRef(init?.r ?? null),
			count: $.varRef(init?.count ?? 0)
		}
	}

	public clone(): timeoutReader {
		const cloned = new timeoutReader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			count: $.varRef(this._fields.count.value)
		}
		return cloned
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		const r = this
		r.count++
		if (r.count == 2) {
			return [0, ErrTimeout]
		}
		return r.r!.Read(p)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'timeoutReader',
	  new timeoutReader(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  timeoutReader,
	  {"r": "Reader", "count": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

export let ErrTimeout: $.GoError = errors.New("timeout")

// OneByteReader returns a Reader that implements
// each non-empty Read by reading one byte from r.
export function OneByteReader(r: io.Reader): io.Reader {
	return new oneByteReader({})
}

// HalfReader returns a Reader that implements Read
// by reading half as many requested bytes from r.
export function HalfReader(r: io.Reader): io.Reader {
	return new halfReader({})
}

// DataErrReader changes the way errors are handled by a Reader. Normally, a
// Reader returns an error (typically EOF) from the first Read call after the
// last piece of data is read. DataErrReader wraps a Reader and changes its
// behavior so the final error is returned along with the final data, instead
// of in the first call after the final data.
export function DataErrReader(r: io.Reader): io.Reader {
	return new dataErrReader({})
}

// TimeoutReader returns [ErrTimeout] on the second read
// with no data. Subsequent calls to read succeed.
export function TimeoutReader(r: io.Reader): io.Reader {
	return new timeoutReader({})
}

// ErrReader returns an [io.Reader] that returns 0, err from all Read calls.
export function ErrReader(err: $.GoError): io.Reader {
	return new errReader({err: err})
}

// TestReader tests that reading from r returns the expected file content.
// It does reads of different sizes, until EOF.
// If r implements [io.ReaderAt] or [io.Seeker], TestReader also checks
// that those operations behave as they should.
//
// If TestReader finds any misbehaviors, it returns an error reporting them.
// The error text may span multiple lines.
export function TestReader(r: io.Reader, content: $.Bytes): $.GoError {
	if ($.len(content) > 0) {
		let [n, err] = null
		if (n != 0 || err != null) {
			return fmt.Errorf("Read(0) = %d, %v, want 0, nil", n, err)
		}
	}

	let [data, err] = io.ReadAll(new smallByteReader({r: r}))
	if (err != null) {
		return err
	}
	if (!bytes.Equal(data, content)) {
		return fmt.Errorf("ReadAll(small amounts) = %q\n\twant %q", data, content)
	}
	let n: number
	[n, err] = r!.Read(new Uint8Array(10))
	if (n != 0 || err != io.EOF) {
		return fmt.Errorf("Read(10) at EOF = %v, %v, want 0, EOF", n, err)
	}

	// Seek(0, 1) should report the current file position (EOF).

	// Seek backward partway through file, in two steps.
	// If middle == 0, len(content) == 0, can't use the -1 and +1 seeks.

	// Seek(0, 1) should report the current file position (middle).

	// Reading forward should return the last part of the file.

	// Seek relative to end of file, but start elsewhere.

	// Reading forward should return the last part of the file (again).

	// Absolute seek & read forward.
	const _temp_r = r
	{
		let { value: r, ok: ok } = $.typeAssert<io.ReadSeeker>(_temp_r, 'io.ReadSeeker')
		if (ok) {
			// Seek(0, 1) should report the current file position (EOF).
			{
				let [off, err] = r!.Seek(0, 1)
				if (off != ($.len(content) as number) || err != null) {
					return fmt.Errorf("Seek(0, 1) from EOF = %d, %v, want %d, nil", off, err, $.len(content))
				}
			}

			// Seek backward partway through file, in two steps.
			// If middle == 0, len(content) == 0, can't use the -1 and +1 seeks.
			let middle = $.len(content) - $.len(content) / 3
			if (middle > 0) {
				{
					let [off, err] = r!.Seek(-1, 1)
					if (off != ($.len(content) - 1 as number) || err != null) {
						return fmt.Errorf("Seek(-1, 1) from EOF = %d, %v, want %d, nil", -off, err, $.len(content) - 1)
					}
				}
				{
					let [off, err] = r!.Seek((-$.len(content) / 3 as number), 1)
					if (off != (middle - 1 as number) || err != null) {
						return fmt.Errorf("Seek(%d, 1) from %d = %d, %v, want %d, nil", -$.len(content) / 3, $.len(content) - 1, off, err, middle - 1)
					}
				}
				{
					let [off, err] = r!.Seek(+1, 1)
					if (off != (middle as number) || err != null) {
						return fmt.Errorf("Seek(+1, 1) from %d = %d, %v, want %d, nil", middle - 1, off, err, middle)
					}
				}
			}

			// Seek(0, 1) should report the current file position (middle).
			{
				let [off, err] = r!.Seek(0, 1)
				if (off != (middle as number) || err != null) {
					return fmt.Errorf("Seek(0, 1) from %d = %d, %v, want %d, nil", middle, off, err, middle)
				}
			}

			// Reading forward should return the last part of the file.
			let [data, err] = io.ReadAll(new smallByteReader({r: r}))
			if (err != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", middle, err)
			}
			if (!bytes.Equal(data, $.goSlice(content, middle, undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", middle, data, $.goSlice(content, middle, undefined))
			}

			// Seek relative to end of file, but start elsewhere.
			{
				let [off, err] = r!.Seek((middle / 2 as number), 0)
				if (off != (middle / 2 as number) || err != null) {
					return fmt.Errorf("Seek(%d, 0) from EOF = %d, %v, want %d, nil", middle / 2, off, err, middle / 2)
				}
			}
			{
				let [off, err] = r!.Seek((-$.len(content) / 3 as number), 2)
				if (off != (middle as number) || err != null) {
					return fmt.Errorf("Seek(%d, 2) from %d = %d, %v, want %d, nil", -$.len(content) / 3, middle / 2, off, err, middle)
				}
			}

			// Reading forward should return the last part of the file (again).
			;[data, err] = io.ReadAll(new smallByteReader({r: r}))
			if (err != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", middle, err)
			}
			if (!bytes.Equal(data, $.goSlice(content, middle, undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", middle, data, $.goSlice(content, middle, undefined))
			}

			// Absolute seek & read forward.
			{
				let [off, err] = r!.Seek((middle / 2 as number), 0)
				if (off != (middle / 2 as number) || err != null) {
					return fmt.Errorf("Seek(%d, 0) from EOF = %d, %v, want %d, nil", middle / 2, off, err, middle / 2)
				}
			}
			;[data, err] = io.ReadAll(r)
			if (err != null) {
				return fmt.Errorf("ReadAll from offset %d: %v", middle / 2, err)
			}
			if (!bytes.Equal(data, $.goSlice(content, middle / 2, undefined))) {
				return fmt.Errorf("ReadAll from offset %d = %q\n\twant %q", middle / 2, data, $.goSlice(content, middle / 2, undefined))
			}
		}
	}

	const _temp_r = r
	{
		let { value: r, ok: ok } = $.typeAssert<io.ReaderAt>(_temp_r, 'io.ReaderAt')
		if (ok) {
			let data = $.makeSlice<number>($.len(content), $.len(content) + 1, 'byte')
			for (let i = 0; i < $.len(data); i++) {
				{
					data![i] = 0xfe
				}
			}
			let [n, err] = r!.ReadAt(data, 0)
			if (n != $.len(data) || err != null && err != io.EOF) {
				return fmt.Errorf("ReadAt(%d, 0) = %v, %v, want %d, nil or EOF", $.len(data), n, err, $.len(data))
			}
			if (!bytes.Equal(data, content)) {
				return fmt.Errorf("ReadAt(%d, 0) = %q\n\twant %q", $.len(data), data, content)
			}

			;[n, err] = r!.ReadAt($.goSlice(data, undefined, 1), ($.len(data) as number))
			if (n != 0 || err != io.EOF) {
				return fmt.Errorf("ReadAt(1, %d) = %v, %v, want 0, EOF", $.len(data), n, err)
			}

			for (let i = 0; i < $.len(data); i++) {
				{
					data![i] = 0xfe
				}
			}
			;[n, err] = r!.ReadAt($.goSlice(data, undefined, $.cap(data)), 0)
			if (n != $.len(data) || err != io.EOF) {
				return fmt.Errorf("ReadAt(%d, 0) = %v, %v, want %d, EOF", $.cap(data), n, err, $.len(data))
			}
			if (!bytes.Equal(data, content)) {
				return fmt.Errorf("ReadAt(%d, 0) = %q\n\twant %q", $.len(data), data, content)
			}

			for (let i = 0; i < $.len(data); i++) {
				{
					data![i] = 0xfe
				}
			}
			for (let i = 0; i < $.len(data); i++) {
				{
					;[n, err] = r!.ReadAt($.goSlice(data, i, i + 1), (i as number))
					if (n != 1 || err != null && (i != $.len(data) - 1 || err != io.EOF)) {
						let want = "nil"
						if (i == $.len(data) - 1) {
							want = "nil or EOF"
						}
						return fmt.Errorf("ReadAt(1, %d) = %v, %v, want 1, %s", i, n, err, want)
					}
					if (data![i] != content![i]) {
						return fmt.Errorf("ReadAt(1, %d) = %q want %q", i, $.goSlice(data, i, i + 1), $.goSlice(content, i, i + 1))
					}
				}
			}
		}
	}
	return null
}

