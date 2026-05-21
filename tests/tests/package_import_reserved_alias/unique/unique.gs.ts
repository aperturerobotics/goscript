// Generated file based on unique.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Box {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): Box {
		const cloned = new Box()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"unique.Box",
		new Box(),
		[],
		Box,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function NewBox(value: number): Box | $.VarRef<Box> | null {
	return new Box({Value: value})
}
