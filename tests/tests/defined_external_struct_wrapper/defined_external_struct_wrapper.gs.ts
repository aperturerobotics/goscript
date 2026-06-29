// Generated file based on defined_external_struct_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"

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
			Value: $.varRef(init?.Value ?? ("" as string)),
			Hidden: $.varRef(init?.Hidden ?? (undefined as any as any))
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
		return $.unsafePointerCast<dep.Public | $.VarRef<dep.Public> | null>(w)
	}

	static __typeInfo = $.registerStructType(
		"main.Wrapped",
		() => new Wrapped(),
		[{ name: "public", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "dep.Public" } }] }],
		Wrapped,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Hidden", key: "Hidden", type: "dep.hidden" }]
	)
}

export function wrap(p: dep.Public | $.VarRef<dep.Public> | null): Wrapped | $.VarRef<Wrapped> | null {
	return $.unsafePointerCast<Wrapped | $.VarRef<Wrapped> | null>(p)
}

export async function main(): globalThis.Promise<void> {
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}
