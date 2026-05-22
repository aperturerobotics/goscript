// Generated file based on struct_method_clone_collision.go
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

	public __goscriptClone(): Box {
		const cloned = new Box()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public clone(): Box | $.VarRef<Box> | null {
		const b: Box | $.VarRef<Box> | null = this
		return new Box({Value: $.pointerValue<Box>(b).Value + 1})
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		new Box(),
		[{ name: "clone", args: [], returns: [] }],
		Box,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function copyBox(b: Box): Box {
	return $.markAsStructValue($.cloneStructValue(b))
}

export async function main(): globalThis.Promise<void> {
	let original = $.varRef($.markAsStructValue(new Box({Value: 1})))
	let copied = $.markAsStructValue($.cloneStructValue(copyBox($.markAsStructValue($.cloneStructValue(original.value)))))
	original.value.Value = 3
	let methodCopy: Box | $.VarRef<Box> | null = $.pointerValue<Box>((original)).clone()
	$.println("copied:", copied.Value)
	$.println("method:", $.pointerValue<Box>(methodCopy).Value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
