// Generated file based on other.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class OtherStruct {
	public get Label(): string {
		return this._fields.Label.value
	}
	public set Label(value: string) {
		this._fields.Label.value = value
	}

	public _fields: {
		Label: $.VarRef<string>
	}

	constructor(init?: Partial<{Label?: string}>) {
		this._fields = {
			Label: $.varRef(init?.Label ?? ("" as unknown as string))
		}
	}

	public clone(): OtherStruct {
		const cloned = new OtherStruct()
		cloned._fields = {
			Label: $.varRef(this._fields.Label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.OtherStruct",
		() => new OtherStruct(),
		[],
		OtherStruct,
		[{ name: "Label", key: "Label", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }]
	)
}
