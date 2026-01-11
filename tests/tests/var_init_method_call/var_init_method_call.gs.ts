// Generated file based on var_init_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class T {
	public get val(): number {
		return this._fields.val.value
	}
	public set val(value: number) {
		this._fields.val.value = value
	}

	public _fields: {
		val: $.VarRef<number>;
	}

	constructor(init?: Partial<{val?: number}>) {
		this._fields = {
			val: $.varRef(init?.val ?? 0)
		}
	}

	public clone(): T {
		const cloned = new T()
		cloned._fields = {
			val: $.varRef(this._fields.val.value)
		}
		return cloned
	}

	public WithDelta(delta: number): T | null {
		const t = this
		return new T({val: t.val + delta})
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.T',
	  new T(),
	  [{ name: "WithDelta", args: [{ name: "delta", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "T" } }] }],
	  T,
	  {"val": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export let Base: T | null = NewT(10)

export let Derived: T | null = Base!.WithDelta(5)

export function NewT(v: number): T | null {
	return new T({val: v})
}

export async function main(): Promise<void> {
	$.println("Base:", Base!.val)
	$.println("Derived:", Derived!.val)
}

