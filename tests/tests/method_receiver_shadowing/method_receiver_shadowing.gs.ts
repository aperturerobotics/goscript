// Generated file based on method_receiver_shadowing.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class Thing {
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

	public clone(): Thing {
		const cloned = new Thing()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public callFunc(): number {
		const t = this
		return getValue()(t)
	}

	static __typeInfo = $.registerStructType(
		"main.Thing",
		new Thing(),
		[{ name: "callFunc", args: [], returns: [] }],
		Thing,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function getValue(): (_p0: Thing | $.VarRef<Thing> | null) => number {
	return (t: Thing | $.VarRef<Thing> | null): number => {
	return $.pointerValue(t).value
}
}

export async function main(): Promise<void> {
	let t = new Thing({value: 42})
	let result = $.pointerValue(t).callFunc()
	$.println("Result:", result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
