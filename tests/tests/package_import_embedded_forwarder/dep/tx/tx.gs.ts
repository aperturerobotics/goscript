// Generated file based on tx.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Tx {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
	}

	constructor(init?: Partial<{Name?: string}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as unknown as string))
		}
	}

	public clone(): Tx {
		const cloned = new Tx()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tx.Tx",
		() => new Tx(),
		[],
		Tx,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}
