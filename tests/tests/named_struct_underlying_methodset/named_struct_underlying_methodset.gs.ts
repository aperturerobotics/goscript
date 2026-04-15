// Generated file based on named_struct_underlying_methodset.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Base {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): Base {
		const cloned = new Base()
		cloned._fields = {
		}
		return cloned
	}

	public String(): string {
		return "base"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Base',
	  new Base(),
	  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Base,
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

export class Derived {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		const base = new Base(init)
		this._fields = base._fields
	}

	public clone(): Derived {
		const cloned = new Derived()
		cloned._fields = {
		}
		return cloned
	}

	public Own(): string {
		return "derived"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  "main.Derived",
	  new Derived(),
	  [{ name: "Own", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Derived,
	  {}
	);
}

export async function main(): Promise<void> {
	let base: null | any = $.markAsStructValue(new Base({}))
	let { ok: baseOK } = $.typeAssert<Stringer>(base, 'main.Stringer')
	$.println("base implements Stringer:", baseOK)

	let derived: null | any = $.markAsStructValue(new Derived({}))
	let { ok: derivedOK } = $.typeAssert<Stringer>(derived, 'main.Stringer')
	$.println("derived implements Stringer:", derivedOK)
}

