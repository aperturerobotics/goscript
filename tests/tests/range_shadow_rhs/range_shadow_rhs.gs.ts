// Generated file based on range_shadow_rhs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public get values(): Map<string, number> | null {
		return this._fields.values.value
	}
	public set values(value: Map<string, number> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<Map<string, number> | null>
	}

	constructor(init?: Partial<{values?: Map<string, number> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null as unknown as Map<string, number> | null))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[],
		holder,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/range_shadow_rhs", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let k = $.markAsStructValue(new holder({values: new Map<string, number>([["a", 1], ["b", 2]])}))
	let sum = 0
	for (const [__goscriptRangeShadow0, v] of k.values?.entries() ?? []) {
		sum = sum + ($.len(__goscriptRangeShadow0) + v)
	}
	$.println(sum)
}

if ($.isMainScript(import.meta)) {
	await main()
}
