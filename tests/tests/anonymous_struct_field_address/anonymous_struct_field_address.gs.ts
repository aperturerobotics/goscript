// Generated file based on anonymous_struct_field_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class entry {
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

	public clone(): entry {
		const cloned = new entry()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public add(value: number): void {
		let e: entry | $.VarRef<entry> | null = this
		$.pointerValue<entry>(e).value = $.pointerValue<entry>(e).value + (value)
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		[{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		entry,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export let box: {"table": entry[]} = {"table": Array.from({ length: 2 }, () => $.markAsStructValue(new entry()))}

export function __goscript_set_box(__goscriptValue: {"table": entry[]}): void {
	box = __goscriptValue
}

export function entries(): $.VarRef<entry[]> | null {
	return $.fieldRef(box, "table")
}

export async function main(): globalThis.Promise<void> {
	let table: $.VarRef<entry[]> | null = entries()
	$.pointerValue<entry[]>(table)[0].add(5)
	$.println($.pointerValue<entry[]>(table)[0].value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
