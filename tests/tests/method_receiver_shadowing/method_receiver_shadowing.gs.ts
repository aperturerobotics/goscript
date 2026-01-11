// Generated file based on method_receiver_shadowing.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Thing {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>;
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): Thing {
		const cloned = new Thing()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return cloned
	}

	public callFunc(): number {
		const t = this
		return getValue()!(t)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Thing',
	  new Thing(),
	  [{ name: "callFunc", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
	  Thing,
	  {"value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export function getValue(): ((p0: Thing | null) => number) | null {
	return (t: Thing | null): number => {
		return t!.value
	}
}

export async function main(): Promise<void> {
	let t = new Thing({value: 42})
	let result = t!.callFunc()
	$.println("Result:", result)
}

