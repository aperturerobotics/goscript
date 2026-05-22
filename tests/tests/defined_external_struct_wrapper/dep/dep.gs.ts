// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class hidden {
	public get label(): string {
		return this._fields.label.value
	}
	public set label(value: string) {
		this._fields.label.value = value
	}

	public _fields: {
		label: $.VarRef<string>
	}

	constructor(init?: Partial<{label?: string}>) {
		this._fields = {
			label: $.varRef(init?.label ?? "")
		}
	}

	public clone(): hidden {
		const cloned = new hidden()
		cloned._fields = {
			label: $.varRef(this._fields.label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dep.hidden",
		() => new hidden(),
		[],
		hidden,
		{"label": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class Public {
	public get Value(): string {
		return this._fields.Value.value
	}
	public set Value(value: string) {
		this._fields.Value.value = value
	}

	public get Hidden(): hidden {
		return this._fields.Hidden.value
	}
	public set Hidden(value: hidden) {
		this._fields.Hidden.value = value
	}

	public _fields: {
		Value: $.VarRef<string>
		Hidden: $.VarRef<hidden>
	}

	constructor(init?: Partial<{Value?: string, Hidden?: hidden}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? ""),
			Hidden: $.varRef(init?.Hidden ? $.markAsStructValue(init.Hidden.clone()) : $.markAsStructValue(new hidden()))
		}
	}

	public clone(): Public {
		const cloned = new Public()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			Hidden: $.varRef($.markAsStructValue(this._fields.Hidden.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	public Label(): string {
		const p: Public | $.VarRef<Public> | null = this
		return $.pointerValue<Public>(p).Value
	}

	static __typeInfo = $.registerStructType(
		"dep.Public",
		() => new Public(),
		[{ name: "Label", args: [], returns: [] }],
		Public,
		{"Value": { kind: $.TypeKind.Basic, name: "string" }, "Hidden": "dep.hidden"}
	)
}
