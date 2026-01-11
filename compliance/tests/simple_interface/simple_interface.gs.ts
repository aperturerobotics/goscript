// Generated file based on simple_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>;
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyStruct',
	  new MyStruct(),
	  [],
	  MyStruct,
	  {"Value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias = original

	let jAlias: null | any = pAlias

	let { ok: ok } = $.typeAssert<MyStruct | null>(jAlias, {kind: $.TypeKind.Pointer, elemType: 'main.MyStruct'})
	$.println("pointer assertion result:", ok)
}

