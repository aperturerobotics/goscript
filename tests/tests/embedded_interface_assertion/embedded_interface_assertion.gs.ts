// Generated file based on embedded_interface_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Reader = null | {
	Read(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Read", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
)

export type Closer = null | {
	Close(): $.GoError
}

$.registerInterfaceType(
	"main.Closer",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }]
)

export type ReadCloser = null | {
	Close(): $.GoError
	Read(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.ReadCloser",
	null,
	[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
)

export class MyStruct {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const m = this
		// Dummy implementation
		return null
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const m = this
		// Dummy implementation
		return [0, null]
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "Close", args: [], returns: [] }, { name: "Read", args: [], returns: [] }],
		MyStruct,
		{}
	)
}

export async function main(): Promise<void> {
	let rwc: ReadCloser | null = null
	let s = $.markAsStructValue(new MyStruct())
	rwc = $.interfaceValue<ReadCloser | null>($.markAsStructValue((s).clone()), "main.MyStruct")

	let [, ok] = $.typeAssertTuple<ReadCloser | null>(rwc, "main.ReadCloser")
	if (ok) {
		$.println("Embedded interface assertion successful")
	} else {
		$.println("Embedded interface assertion failed")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
