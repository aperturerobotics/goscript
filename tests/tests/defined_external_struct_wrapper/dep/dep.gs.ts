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
		[{ name: "label", key: "label", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/defined_external_struct_wrapper/dep", index: [0], offset: 0, exported: false }]
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
			Hidden: $.varRef(init?.Hidden ? $.markAsStructValue($.cloneStructValue(init.Hidden)) : $.markAsStructValue(new hidden()))
		}
	}

	public clone(): Public {
		const cloned = new Public()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			Hidden: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Hidden.value)))
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
		[{ name: "Label", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Public,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Hidden", key: "Hidden", type: "dep.hidden", index: [1], offset: 16, exported: true }]
	)
}
