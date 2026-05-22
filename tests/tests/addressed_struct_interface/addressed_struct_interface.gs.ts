// Generated file based on addressed_struct_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Writer = null | {
	Write(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Writer",
	null,
	[{ name: "Write", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
)

export class Buffer {
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

	public clone(): Buffer {
		const cloned = new Buffer()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let b: Buffer | $.VarRef<Buffer> | null = this
		$.pointerValue<Buffer>(b).data = $.append($.pointerValue<Buffer>(b).data, ...(p ?? []))
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.Buffer",
		() => new Buffer(),
		[{ name: "Write", args: [], returns: [] }],
		Buffer,
		{"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export function use(w: Writer | null): void {
	$.pointerValue<Exclude<Writer, null>>(w).Write(new Uint8Array([120]))
}

export async function main(): globalThis.Promise<void> {
	let b: $.VarRef<Buffer> = $.varRef($.markAsStructValue(new Buffer()))
	use($.interfaceValue<Writer | null>(b, "*main.Buffer"))
	$.println($.bytesToString(b.value.data))
}

if ($.isMainScript(import.meta)) {
	await main()
}
