// Generated file based on type_assertion_duplicate_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class ConcreteA {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): ConcreteA {
		const cloned = new ConcreteA()
		cloned._fields = {
		}
		return cloned
	}

	public Method(): string {
		return "A"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.ConcreteA',
	  new ConcreteA(),
	  [{ name: "Method", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  ConcreteA,
	  {}
	);
}

export class ConcreteB {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): ConcreteB {
		const cloned = new ConcreteB()
		cloned._fields = {
		}
		return cloned
	}

	public Method(): string {
		return "B"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.ConcreteB',
	  new ConcreteB(),
	  [{ name: "Method", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  ConcreteB,
	  {}
	);
}

export class Container {
	public get hasA(): boolean {
		return this._fields.hasA.value
	}
	public set hasA(value: boolean) {
		this._fields.hasA.value = value
	}

	public get hasB(): boolean {
		return this._fields.hasB.value
	}
	public set hasB(value: boolean) {
		this._fields.hasB.value = value
	}

	public _fields: {
		hasA: $.VarRef<boolean>;
		hasB: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{hasA?: boolean, hasB?: boolean}>) {
		this._fields = {
			hasA: $.varRef(init?.hasA ?? false),
			hasB: $.varRef(init?.hasB ?? false)
		}
	}

	public clone(): Container {
		const cloned = new Container()
		cloned._fields = {
			hasA: $.varRef(this._fields.hasA.value),
			hasB: $.varRef(this._fields.hasB.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Container',
	  new Container(),
	  [],
	  Container,
	  {"hasA": { kind: $.TypeKind.Basic, name: "bool" }, "hasB": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export type Interface = null | {
	Method(): string
}

$.registerInterfaceType(
  'main.Interface',
  null, // Zero value for interface is null
  [{ name: "Method", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): Promise<void> {
	let iface: Interface = $.markAsStructValue(new ConcreteA({}))

	let c = new Container({})

	// Multiple type assertions that should generate unique variable names
	let _gs_ta_val_66a6: ConcreteA
	let _gs_ta_ok_66a6: boolean
	({ value: _gs_ta_val_66a6, ok: _gs_ta_ok_66a6 } = $.typeAssert<ConcreteA>(iface, 'main.ConcreteA'))
	c!.hasA = _gs_ta_ok_66a6
	let _gs_ta_val_a813: ConcreteB
	let _gs_ta_ok_a813: boolean
	({ value: _gs_ta_val_a813, ok: _gs_ta_ok_a813 } = $.typeAssert<ConcreteB>(iface, 'main.ConcreteB'))
	c!.hasB = _gs_ta_ok_a813

	$.println("hasA:", c!.hasA)
	$.println("hasB:", c!.hasB)
}

