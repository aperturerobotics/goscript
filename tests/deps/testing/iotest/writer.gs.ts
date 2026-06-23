// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class truncateWriter {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public get n(): bigint {
		return this._fields.n.value
	}
	public set n(value: bigint) {
		this._fields.n.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
		n: $.VarRef<bigint>
	}

	constructor(init?: Partial<{w?: io.Writer | null, n?: bigint}>) {
		this._fields = {
			w: $.varRef(init?.w ?? (null as unknown as io.Writer | null)),
			n: $.varRef(init?.n ?? (0n as unknown as bigint))
		}
	}

	public clone(): truncateWriter {
		const cloned = new truncateWriter()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			n: $.varRef(this._fields.n.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let t: truncateWriter | $.VarRef<truncateWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<truncateWriter>(t).n <= 0) {
			return [$.len(p), null]
		}
		// real write
		n = $.len(p)
		if ($.int64(n) > $.pointerValue<truncateWriter>(t).n) {
			n = $.int($.pointerValue<truncateWriter>(t).n)
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<truncateWriter>(t).w).Write($.goSlice(p, 0, n))
		n = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		$.pointerValue<truncateWriter>(t).n = $.int64Sub($.pointerValue<truncateWriter>(t).n, $.int64(n))
		if (err == null) {
			n = $.len(p)
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.truncateWriter",
		() => new truncateWriter(),
		[{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		truncateWriter,
		[{ name: "w", key: "w", type: "io.Writer" }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }]
	)
}

export function TruncateWriter(w: io.Writer | null, n: bigint): io.Writer | null {
	return $.interfaceValue<io.Writer | null>(new truncateWriter({w: w, n: n}), "*iotest.truncateWriter")
}
