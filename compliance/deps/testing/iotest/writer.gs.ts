import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

export class truncateWriter {
	public get w(): io.Writer {
		return this._fields.w.value
	}
	public set w(value: io.Writer) {
		this._fields.w.value = value
	}

	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer>;
		n: $.VarRef<number>;
	}

	constructor(init?: Partial<{n?: number, w?: io.Writer}>) {
		this._fields = {
			w: $.varRef(init?.w ?? null),
			n: $.varRef(init?.n ?? 0)
		}
	}

	public clone(): truncateWriter {
		const cloned = new truncateWriter()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			n: $.varRef(this._fields.n.value)
		}
		return cloned
	}

	public Write(p: $.Bytes): [number, $.GoError] {
		const t = this
		let n: number = 0
		let err: $.GoError = null
		if (t.n <= 0) {
			return [$.len(p), null]
		}
		n = $.len(p)
		if ((n as number) > t.n) {
			n = $.int(t.n)
		}
		;[n, err] = t.w!.Write($.goSlice(p, 0, n))
		t.n -= (n as number)
		if (err == null) {
			n = $.len(p)
		}
		return [n, err]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'truncateWriter',
	  new truncateWriter(),
	  [{ name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  truncateWriter,
	  {"w": "Writer", "n": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

// TruncateWriter returns a Writer that writes to w
// but stops silently after n bytes.
export function TruncateWriter(w: io.Writer, n: number): io.Writer {
	return new truncateWriter({})
}

