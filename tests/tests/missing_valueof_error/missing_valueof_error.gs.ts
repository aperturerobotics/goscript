// Generated file based on missing_valueof_error.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class buffer {
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

	public clone(): buffer {
		const cloned = new buffer()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.buffer",
		new buffer(),
		[],
		buffer,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class printer {
	public get buf(): buffer | $.VarRef<buffer> | null {
		return this._fields.buf.value
	}
	public set buf(value: buffer | $.VarRef<buffer> | null) {
		this._fields.buf.value = value
	}

	public _fields: {
		buf: $.VarRef<buffer | $.VarRef<buffer> | null>
	}

	constructor(init?: Partial<{buf?: buffer | $.VarRef<buffer> | null}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? null)
		}
	}

	public clone(): printer {
		const cloned = new printer()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value)
		}
		return $.markAsStructValue(cloned)
	}

	public checkCapacity(): number {
		const p = this
		return $.cap($.pointerValue($.pointerValue(p).buf).data)
	}

	public free(): void {
		const p = this
		if ($.cap($.pointerValue($.pointerValue(p).buf).data) > 64 * 1024) {
			$.pointerValue(p).buf = null
		} else {
			$.pointerValue($.pointerValue(p).buf).data = $.goSlice($.pointerValue($.pointerValue(p).buf).data, undefined, 0)
		}
	}

	public getLength(): number {
		const p = this
		return $.len($.pointerValue($.pointerValue(p).buf).data)
	}

	static __typeInfo = $.registerStructType(
		"main.printer",
		new printer(),
		[{ name: "checkCapacity", args: [], returns: [] }, { name: "free", args: [], returns: [] }, { name: "getLength", args: [], returns: [] }],
		printer,
		{"buf": { kind: $.TypeKind.Pointer, elemType: "main.buffer" }}
	)
}

export async function main(): Promise<void> {
	let buf = new buffer({data: $.makeSlice<number>(0, 100000, "byte")})
	let p = new printer({buf: buf})
	$.println("Initial capacity:", $.pointerValue(p).checkCapacity())
	$.println("Initial length:", $.pointerValue(p).getLength())
	$.pointerValue($.pointerValue(p).buf).data = $.append($.pointerValue($.pointerValue(p).buf).data, "hello world")
	$.println("After append length:", $.pointerValue(p).getLength())
	$.pointerValue(p).free()
	if ($.pointerValue(p).buf != null) {
		$.println("Buffer not freed, capacity:", $.pointerValue(p).checkCapacity())
	} else {
		$.println("Buffer was freed")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
