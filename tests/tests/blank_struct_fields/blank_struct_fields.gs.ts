// Generated file based on blank_struct_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class padded {
	public get _blank0(): number[] {
		return this._fields._blank0.value
	}
	public set _blank0(value: number[]) {
		this._fields._blank0.value = value
	}

	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public get _blank2(): number[] {
		return this._fields._blank2.value
	}
	public set _blank2(value: number[]) {
		this._fields._blank2.value = value
	}

	public _fields: {
		_blank0: $.VarRef<number[]>
		Value: $.VarRef<number>
		_blank2: $.VarRef<number[]>
	}

	constructor(init?: Partial<{_blank0?: number[], Value?: number, _blank2?: number[]}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ?? Array.from({ length: 2 }, () => 0)),
			Value: $.varRef(init?.Value ?? 0),
			_blank2: $.varRef(init?._blank2 ?? Array.from({ length: 3 }, () => 0))
		}
	}

	public clone(): padded {
		const cloned = new padded()
		cloned._fields = {
			_blank0: $.varRef(this._fields._blank0.value),
			Value: $.varRef(this._fields.Value.value),
			_blank2: $.varRef(this._fields._blank2.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.padded",
		new padded(),
		[],
		padded,
		{"_blank0": { type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 2 }, name: "_" }, "Value": { kind: $.TypeKind.Basic, name: "int" }, "_blank2": { type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 3 }, name: "_" }}
	)
}

export let featureBlock: {"_blank0": padded, "Enabled": boolean, "_blank2": padded} = {"_blank0": $.markAsStructValue(new padded()), "Enabled": false, "_blank2": $.markAsStructValue(new padded())}

export async function main(): Promise<void> {
	featureBlock.Enabled = true
	$.println(featureBlock.Enabled)

	let original = $.markAsStructValue(new padded({Value: 7}))
	let copy = $.markAsStructValue($.cloneStructValue(original))
	copy.Value = 8
	$.println(original.Value, copy.Value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
