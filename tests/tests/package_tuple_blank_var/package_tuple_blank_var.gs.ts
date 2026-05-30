// Generated file based on package_tuple_blank_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
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
			value: $.varRef(init?.value ?? 0)
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
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_tuple_blank_var", index: [0], offset: 0, exported: false }]
	)
}

export function newItem(value: number): [item | $.VarRef<item> | null, $.GoError] {
	return [new item({value: value}), null]
}

const __goscriptTuple0 = newItem(11)

export let first: item | $.VarRef<item> | null = __goscriptTuple0[0]

const __goscriptTuple1 = newItem(13)

export let second: item | $.VarRef<item> | null = __goscriptTuple1[0]

export async function main(): globalThis.Promise<void> {
	$.println($.pointerValue<item>(first).value + $.pointerValue<item>(second).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
