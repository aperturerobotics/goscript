// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as drbg2 from "@goscript/github.com/s4wave/goscript/tests/tests/import_alias_shadowed_by_local/drbg/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/import_alias_shadowed_by_local/drbg/index.js"

export class local {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (0 as unknown as number))
		}
	}

	public clone(): local {
		const cloned = new local()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.local",
		() => new local(),
		[],
		local,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/import_alias_shadowed_by_local", index: [0], offset: 0, exported: false }]
	)
}

export function newLocal(value: number): local | $.VarRef<local> | null {
	return new local({value: value})
}

export async function main(): globalThis.Promise<void> {
	{
		let err = drbg2.Read()
		if (err != null) {
			$.println("error")
			return
		}
	}

	let __goscriptShadow0: local | $.VarRef<local> | null = newLocal(7)
	$.println($.pointerValue<local>(__goscriptShadow0).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
