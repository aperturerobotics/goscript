// Generated file based on recursive_type_definition.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type A = null | {
	MethodA(a: A): void
}

$.registerInterfaceType(
  'main.A',
  null, // Zero value for interface is null
  [{ name: "MethodA", args: [{ name: "a", type: "main.A" }], returns: [] }]
);

export class B {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): B {
		const cloned = new B()
		cloned._fields = {
		}
		return cloned
	}

	public MethodB(valB: B | null): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.B',
	  new B(),
	  [{ name: "MethodB", args: [{ name: "valB", type: { kind: $.TypeKind.Pointer, elemType: "main.B" } }], returns: [] }],
	  B,
	  {}
	);
}

export type C = null | {
	MethodC(d: D): void
}

$.registerInterfaceType(
  'main.C',
  null, // Zero value for interface is null
  [{ name: "MethodC", args: [{ name: "d", type: "main.D" }], returns: [] }]
);

export type D = null | {
	MethodD(c: C): void
}

$.registerInterfaceType(
  'main.D',
  null, // Zero value for interface is null
  [{ name: "MethodD", args: [{ name: "c", type: "main.C" }], returns: [] }]
);

export async function main(): Promise<void> {
	$.println("recursive type definition test")
}

