// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Box {
	public get N(): number {
		return this._fields.N.value
	}
	public set N(value: number) {
		this._fields.N.value = value
	}

	public _fields: {
		N: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? (0 as unknown as number))
		}
	}

	public clone(): Box {
		const cloned = new Box()
		cloned._fields = {
			N: $.varRef(this._fields.N.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dep.Box",
		() => new Box(),
		[],
		Box,
		[{ name: "N", key: "N", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export let Value: number = 5

export function __goscript_set_Value(__goscriptValue: number): void {
	Value = __goscriptValue
}

export function Double(v: number): number {
	return v * 2
}

export function NewBox(n: number): Box {
	return $.markAsStructValue(new Box({N: n}))
}
