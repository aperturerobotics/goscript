import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as log from "@goscript/log/index.js"

export class readLogger {
	public get prefix(): string {
		return this._fields.prefix.value
	}
	public set prefix(value: string) {
		this._fields.prefix.value = value
	}

	public get r(): io.Reader {
		return this._fields.r.value
	}
	public set r(value: io.Reader) {
		this._fields.r.value = value
	}

	public _fields: {
		prefix: $.VarRef<string>;
		r: $.VarRef<io.Reader>;
	}

	constructor(init?: Partial<{prefix?: string, r?: io.Reader}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? ""),
			r: $.varRef(init?.r ?? null)
		}
	}

	public clone(): readLogger {
		const cloned = new readLogger()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value),
			r: $.varRef(this._fields.r.value)
		}
		return cloned
	}

	public async Read(p: $.Bytes): Promise<[number, $.GoError]> {
		const l = this
		let n: number = 0
		let err: $.GoError = null
		;[n, err] = l.r!.Read(p)
		if (err != null) {
			await log.Printf("%s %x: %v", l.prefix, $.goSlice(p, 0, n), err)
		}
		 else {
			await log.Printf("%s %x", l.prefix, $.goSlice(p, 0, n))
		}
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'readLogger',
	  new readLogger(),
	  [{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  readLogger,
	  {"prefix": { kind: $.TypeKind.Basic, name: "string" }, "r": "Reader"}
	);
}

export class writeLogger {
	public get prefix(): string {
		return this._fields.prefix.value
	}
	public set prefix(value: string) {
		this._fields.prefix.value = value
	}

	public get w(): io.Writer {
		return this._fields.w.value
	}
	public set w(value: io.Writer) {
		this._fields.w.value = value
	}

	public _fields: {
		prefix: $.VarRef<string>;
		w: $.VarRef<io.Writer>;
	}

	constructor(init?: Partial<{prefix?: string, w?: io.Writer}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? ""),
			w: $.varRef(init?.w ?? null)
		}
	}

	public clone(): writeLogger {
		const cloned = new writeLogger()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value),
			w: $.varRef(this._fields.w.value)
		}
		return cloned
	}

	public async Write(p: $.Bytes): Promise<[number, $.GoError]> {
		const l = this
		let n: number = 0
		let err: $.GoError = null
		;[n, err] = l.w!.Write(p)
		if (err != null) {
			await log.Printf("%s %x: %v", l.prefix, $.goSlice(p, 0, n), err)
		}
		 else {
			await log.Printf("%s %x", l.prefix, $.goSlice(p, 0, n))
		}
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'writeLogger',
	  new writeLogger(),
	  [{ name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  writeLogger,
	  {"prefix": { kind: $.TypeKind.Basic, name: "string" }, "w": "Writer"}
	);
}

// NewWriteLogger returns a writer that behaves like w except
// that it logs (using [log.Printf]) each write to standard error,
// printing the prefix and the hexadecimal data written.
export function NewWriteLogger(prefix: string, w: io.Writer): io.Writer {
	return new writeLogger({})
}

// NewReadLogger returns a reader that behaves like r except
// that it logs (using [log.Printf]) each read to standard error,
// printing the prefix and the hexadecimal data read.
export function NewReadLogger(prefix: string, r: io.Reader): io.Reader {
	return new readLogger({})
}

