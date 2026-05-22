// Generated file based on map_index_type_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get values(): $.Slice<number> {
		return this._fields.values.value
	}
	public set values(value: $.Slice<number>) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{values?: $.Slice<number>}>) {
		this._fields = {
			values: $.varRef(init?.values ?? null)
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		new item(),
		[],
		item,
		{"values": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): globalThis.Promise<void> {
	let items: Map<string, item> | null = new Map<string, item>([["one", $.markAsStructValue(new item({values: $.arrayToSlice<number>([1, 2, 3])}))]])
	{
		let [__goscriptShadow0, ok] = $.mapGet(items, "one", $.markAsStructValue(new item()))
		if (ok) {
			$.println("values:", $.len(__goscriptShadow0.values))
		}
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
