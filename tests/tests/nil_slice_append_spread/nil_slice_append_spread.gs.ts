// Generated file based on nil_slice_append_spread.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get value(): string {
		return this._fields.value.value
	}
	public set value(value: string) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? "")
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[],
		item,
		{"value": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function clone(items: $.Slice<item | $.VarRef<item> | null>): $.Slice<item | $.VarRef<item> | null> {
	return $.append(null, ...(items ?? []))
}

export async function main(): globalThis.Promise<void> {
	let first: item | $.VarRef<item> | null = new item({value: "first"})
	let second: item | $.VarRef<item> | null = new item({value: "second"})
	let items: $.Slice<item | $.VarRef<item> | null> = $.arrayToSlice<item | $.VarRef<item> | null>([first, second])
	let cloned: $.Slice<item | $.VarRef<item> | null> = clone(items)
	$.println($.len(cloned), $.pointerValue<item>(cloned![0]).value, $.pointerValue<item>(cloned![1]).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
