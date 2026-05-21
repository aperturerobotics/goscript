// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Box {
	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? null)
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
		"helper.Box",
		new Box(),
		[],
		Box,
		{"Value": { kind: $.TypeKind.Interface, methods: [] }}
	)
}

export function Wrap(__typeArgs: $.GenericTypeArgs | undefined, value: any): Box {
	return $.markAsStructValue(new Box({Value: value}))
}
