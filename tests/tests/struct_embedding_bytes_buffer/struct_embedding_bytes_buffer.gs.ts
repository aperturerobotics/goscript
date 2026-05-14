// Generated file based on struct_embedding_bytes_buffer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as bytes from "@goscript/bytes/index.ts"

export class MyWriter {
	public get Buffer(): Buffer {
		return this._fields.Buffer.value
	}
	public set Buffer(value: Buffer) {
		this._fields.Buffer.value = value
	}

	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public _fields: {
		Buffer: $.VarRef<Buffer>
		count: $.VarRef<number>
	}

	constructor(init?: Partial<{Buffer?: Buffer, count?: number}>) {
		this._fields = {
			Buffer: $.varRef(init?.Buffer ? $.markAsStructValue(init.Buffer.clone()) : $.markAsStructValue(new Buffer())),
			count: $.varRef(init?.count ?? 0)
		}
	}

	public clone(): MyWriter {
		const cloned = new MyWriter()
		cloned._fields = {
			Buffer: $.varRef($.markAsStructValue(this._fields.Buffer.value.clone())),
			count: $.varRef(this._fields.count.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyWriter",
		new MyWriter(),
		[],
		MyWriter,
		{"Buffer": "bytes.Buffer", "count": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let w: $.VarRef<MyWriter> = $.varRef($.markAsStructValue(new MyWriter()))
	w.value.WriteString("Hello ")
	w.value.WriteString("World")
	$.println("Content:", w.value.String())
	$.println("Length:", w.value.Len())
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
