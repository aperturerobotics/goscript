// Generated file based on method_receiver_call_return.go
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

	public callIt(x: number): number {
		const t = this
		return getFunc()(t, x)
	}

	static __typeInfo = $.registerStructType(
		"main.Thing",
		new Thing(),
		[{ name: "callIt", args: [], returns: [] }],
		Thing,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function getFunc(): (_p0: Thing | $.VarRef<Thing> | null, _p1: number) => number {
	return (t: Thing | $.VarRef<Thing> | null, x: number): number => {
	return $.pointerValue(t).value + x
}
}

export async function main(): Promise<void> {
	let thing = new Thing({value: 10})
	let result = $.pointerValue(thing).callIt(32)
	$.println("Result:", result)
}


if ($.isMainScript(import.meta)) {
	await main()
}
