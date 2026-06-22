// Generated file based on map_builtin_name_collision.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Map {
	public get values(): globalThis.Map<string, number> | null {
		return this._fields.values.value
	}
	public set values(value: globalThis.Map<string, number> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<globalThis.Map<string, number> | null>
	}

	constructor(init?: Partial<{values?: globalThis.Map<string, number> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null as unknown as globalThis.Map<string, number> | null))
		}
	}

	public clone(): Map {
		const cloned = new Map()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Map",
		() => new Map(),
		[],
		Map,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let m = $.markAsStructValue(new Map({values: new globalThis.Map<string, number>([["one", 1]])}))
	let [got, ok] = $.mapGet<string, number, number>(m.values, "one", 0)
	$.println(got, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}
