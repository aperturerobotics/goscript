// Generated file based on range_value_pointer_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Name(): string {
		const i: item | $.VarRef<item> | null = this
		if (i == null) {
			return ""
		}
		return $.pointerValue<item>(i).name
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[{ name: "Name", args: [], returns: [] }],
		item,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let items = $.arrayToSlice<item>([$.markAsStructValue(new item({name: "alpha"})), $.markAsStructValue(new item({name: "beta"}))])
	for (let __rangeIndex = 0; __rangeIndex < $.len(items); __rangeIndex++) {
		let item = $.varRef(items![__rangeIndex])
		$.println(item.value.Name())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
