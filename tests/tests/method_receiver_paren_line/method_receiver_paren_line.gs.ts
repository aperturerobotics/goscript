// Generated file based on method_receiver_paren_line.go
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

	public callIt(x: number): void {
		const t = this
		getFunc()(t, x)
	}

	static __typeInfo = $.registerStructType(
		"main.Thing",
		new Thing(),
		[{ name: "callIt", args: [], returns: [] }],
		Thing,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function getFunc(): (_p0: Thing | $.VarRef<Thing> | null, _p1: number) => void {
	return (t: Thing | $.VarRef<Thing> | null, x: number): void => {
	$.pointerValue(t).value += x
}
}

export async function main(): Promise<void> {
	let thing = new Thing({value: 10})
	$.pointerValue(thing).callIt(32)
	$.println("Result:", $.pointerValue(thing).value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
