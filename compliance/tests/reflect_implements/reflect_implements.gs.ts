// Generated file based on reflect_implements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export class MyType {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): MyType {
		const cloned = new MyType()
		cloned._fields = {
		}
		return cloned
	}

	public String(): string {
		return "MyType"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyType',
	  new MyType(),
	  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  MyType,
	  {}
	);
}

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
  'main.Stringer',
  null, // Zero value for interface is null
  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): Promise<void> {
	let t = reflect.TypeOf($.markAsStructValue(new MyType({})))
	let ptr = reflect.PointerTo(t)
	let iface = reflect.TypeOf($.typedNil("*main.Stringer"))!.Elem()

	$.println("MyType implements Stringer:", t!.Implements(iface))
	$.println("*MyType implements Stringer:", ptr!.Implements(iface))
}

