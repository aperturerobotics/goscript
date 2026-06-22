// Generated file based on embedded_interface_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Reader = {
	Read(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }]
);

export type Closer = {
	Close(): $.GoError
}

$.registerInterfaceType(
	"main.Closer",
	null,
	[{ name: "Close", args: [], returns: [{ type: "error" }] }]
);

export type ReadCloser = {
	Close(): $.GoError
	Read(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.ReadCloser",
	null,
	[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }]
);

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
		() => new MyStruct(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		MyStruct,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let rwc: ReadCloser | null = null as ReadCloser | null
	let s = $.markAsStructValue(new MyStruct())
	rwc = $.interfaceValue<ReadCloser | null>($.markAsStructValue($.cloneStructValue(s)), "main.MyStruct")

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
