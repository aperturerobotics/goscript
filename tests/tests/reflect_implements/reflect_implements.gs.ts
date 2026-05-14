// Generated file based on reflect_implements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class MyType {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyType {
		const cloned = new MyType()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public String(): string {
		const m = this
		return "MyType"
	}

	static __typeInfo = $.registerStructType(
		"main.MyType",
		new MyType(),
		[{ name: "String", args: [], returns: [] }],
		MyType,
		{}
	)
}

export async function main(): Promise<void> {
	let t = reflect.TypeFor({T: { zero: () => new MyType(), methods: {String: (receiver: any, ...args: any[]) => receiver.String(...args)} }})
	let ptr = reflect.PointerTo(t)
	let iface = reflect.TypeFor({T: { zero: () => null, methods: {String: Stringer_String} }})
	$.println("MyType implements Stringer:", t.Implements(iface))
	$.println("*MyType implements Stringer:", ptr.Implements(iface))
}


if ($.isMainScript(import.meta)) {
	await main()
}
