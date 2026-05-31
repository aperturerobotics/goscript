// Generated file based on reflect_implements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

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
		() => new MyType(),
		[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		MyType,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let t = reflect.TypeFor({T: { type: "main.MyType", zero: () => $.markAsStructValue(new MyType()), methods: {String: (receiver: any, ...args: any[]) => receiver.String(...args)} }})
	let ptr = reflect.PointerTo($.pointerValueOrNil(t)!)
	let iface = reflect.TypeFor({T: { type: "main.Stringer", zero: () => null, methods: {String: (receiver: any, ...args: any[]) => receiver.String(...args)} }})

	$.println("MyType implements Stringer:", $.pointerValue<Exclude<reflect.Type, null>>(t).Implements($.pointerValueOrNil(iface)!))
	$.println("*MyType implements Stringer:", $.pointerValue<Exclude<reflect.Type, null>>(ptr).Implements($.pointerValueOrNil(iface)!))
}

if ($.isMainScript(import.meta)) {
	await main()
}
