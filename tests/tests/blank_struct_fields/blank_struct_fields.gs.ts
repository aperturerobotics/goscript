// Generated file based on blank_struct_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class padded {
	public get _blank0(): Uint8Array {
		return this._fields._blank0.value
	}
	public set _blank0(value: Uint8Array) {
		this._fields._blank0.value = value
	}

	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public get _blank2(): Uint8Array {
		return this._fields._blank2.value
	}
	public set _blank2(value: Uint8Array) {
		this._fields._blank2.value = value
	}

	public _fields: {
		_blank0: $.VarRef<Uint8Array>
		Value: $.VarRef<number>
		_blank2: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{_blank0?: Uint8Array, Value?: number, _blank2?: Uint8Array}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 !== undefined ? $.cloneArrayValue(init._blank0) : new Uint8Array(2)),
			Value: $.varRef(init?.Value ?? 0),
			_blank2: $.varRef(init?._blank2 !== undefined ? $.cloneArrayValue(init._blank2) : new Uint8Array(3))
		}
	}

	public clone(): padded {
		const cloned = new padded()
		cloned._fields = {
			_blank0: $.varRef($.cloneArrayValue(this._fields._blank0.value)),
			Value: $.varRef(this._fields.Value.value),
			_blank2: $.varRef($.cloneArrayValue(this._fields._blank2.value))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.padded",
		() => new padded(),
		[],
		padded,
		{"_blank0": { type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 2 }, name: "_" }, "Value": { kind: $.TypeKind.Basic, name: "int" }, "_blank2": { type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "int" }, length: 3 }, name: "_" }}
	)
}

export let featureBlock: {"_blank0": padded, "Enabled": boolean, "_blank2": padded} = {"_blank0": $.markAsStructValue(new padded()), "Enabled": false, "_blank2": $.markAsStructValue(new padded())}

export function __goscript_set_featureBlock(value: {"_blank0": padded, "Enabled": boolean, "_blank2": padded}): void {
	featureBlock = value
}

export async function main(): globalThis.Promise<void> {
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
