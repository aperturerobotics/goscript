// Generated file based on indirect_circular_deps.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class A {
	public get BB(): $.Slice<B> {
		return this._fields.BB.value
	}
	public set BB(value: $.Slice<B>) {
		this._fields.BB.value = value
	}

	public _fields: {
		BB: $.VarRef<$.Slice<B>>;
	}

	constructor(init?: Partial<{BB?: $.Slice<B>}>) {
		this._fields = {
			BB: $.varRef(init?.BB ?? null)
		}
	}

	public clone(): A {
		const cloned = new A()
		cloned._fields = {
			BB: $.varRef(this._fields.BB.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.A',
	  new A(),
	  [],
	  A,
	  {"BB": { kind: $.TypeKind.Slice, elemType: "B" }}
	);
}

export class B {
	public get AA(): $.Slice<A> {
		return this._fields.AA.value
	}
	public set AA(value: $.Slice<A>) {
		this._fields.AA.value = value
	}

	public _fields: {
		AA: $.VarRef<$.Slice<A>>;
	}

	constructor(init?: Partial<{AA?: $.Slice<A>}>) {
		this._fields = {
			AA: $.varRef(init?.AA ?? null)
		}
	}

	public clone(): B {
		const cloned = new B()
		cloned._fields = {
			AA: $.varRef(this._fields.AA.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.B',
	  new B(),
	  [],
	  B,
	  {"AA": { kind: $.TypeKind.Slice, elemType: "A" }}
	);
}

export async function main(): Promise<void> {
	let a1 = $.markAsStructValue(new A({}))
	let b1 = $.markAsStructValue(new B({}))

	let a2 = $.markAsStructValue(new A({BB: $.arrayToSlice<B>([b1])}))
	let b2 = $.markAsStructValue(new B({AA: $.arrayToSlice<A>([a1])}))

	$.println("a1:", a1.BB == null)
	$.println("b1:", b1.AA == null)
	$.println("a2 has", $.len(a2.BB), "B items")
	$.println("b2 has", $.len(b2.AA), "A items")
}

