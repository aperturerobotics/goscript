// Generated file based on tuple_reassignment_pointer_method_cycle.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class box {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (0 as unknown as number))
		}
	}

	public clone(): box {
		const cloned = new box()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		[],
		box,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/tuple_reassignment_pointer_method_cycle", index: [0], offset: 0, exported: false }]
	)
}

export class cursor {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): cursor {
		const cloned = new cursor()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public rotate(a: box | $.VarRef<box> | null, b: box | $.VarRef<box> | null, c: box | $.VarRef<box> | null): [box | $.VarRef<box> | null, box | $.VarRef<box> | null, box | $.VarRef<box> | null] {
		return [b, c, a]
	}

	static __typeInfo = $.registerStructType(
		"main.cursor",
		() => new cursor(),
		[{ name: "rotate", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }, { name: "c", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }, { name: "_r2", type: { kind: $.TypeKind.Pointer, elemType: "main.box" } }] }],
		cursor,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptShadow0 = cursor
	let __goscriptShadow1: cursor | $.VarRef<cursor> | null = new cursor()
	let x: box | $.VarRef<box> | null = new box({value: 1})
	let y: box | $.VarRef<box> | null = new box({value: 2})
	let z: box | $.VarRef<box> | null = new box({value: 3})

	for (let __rangeIndex = 0; __rangeIndex < 1; __rangeIndex++) {
		let __goscriptTuple0: any = cursor.prototype.rotate.call(__goscriptShadow1, x, y, z)
		x = __goscriptTuple0[0]
		y = __goscriptTuple0[1]
		z = __goscriptTuple0[2]
	}

	$.println($.pointerValue<box>(x).value, $.pointerValue<box>(y).value, $.pointerValue<box>(z).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}
