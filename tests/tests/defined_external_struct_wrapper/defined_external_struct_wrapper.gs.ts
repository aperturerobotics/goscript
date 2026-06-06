// Generated file based on defined_external_struct_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"

export class Wrapped {
	public get Value(): string {
		return this._fields.Value.value
	}
	public set Value(value: string) {
		this._fields.Value.value = value
	}

	public get Hidden(): any {
		return this._fields.Hidden.value
	}
	public set Hidden(value: any) {
		this._fields.Hidden.value = value
	}

	public _fields: {
		Value: $.VarRef<string>
		Hidden: $.VarRef<any>
	}

	constructor(init?: Partial<{Value?: string, Hidden?: any}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? ("" as unknown as string)),
			Hidden: $.varRef(init?.Hidden ?? (undefined as any as unknown as any))
		}
	}

	public clone(): Wrapped {
		const cloned = new Wrapped()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			Hidden: $.varRef(this._fields.Hidden.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ["public"](): dep.Public | $.VarRef<dep.Public> | null {
		const w: Wrapped | $.VarRef<Wrapped> | null = this
		return (w as unknown as dep.Public | $.VarRef<dep.Public> | null)
	}

	static __typeInfo = $.registerStructType(
		"main.Wrapped",
		() => new Wrapped(),
		[{ name: "public", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "dep.Public" } }] }],
		Wrapped,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Hidden", key: "Hidden", type: "dep.hidden", index: [1], offset: 16, exported: true }]
	)
}

export function wrap(p: dep.Public | $.VarRef<dep.Public> | null): Wrapped | $.VarRef<Wrapped> | null {
	return (p as unknown as Wrapped | $.VarRef<Wrapped> | null)
}

export async function main(): globalThis.Promise<void> {
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}
