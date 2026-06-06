// Generated file based on struct_value_init_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Point {
	public get X(): number {
		return this._fields.X.value
	}
	public set X(value: number) {
		this._fields.X.value = value
	}

	public get Y(): number {
		return this._fields.Y.value
	}
	public set Y(value: number) {
		this._fields.Y.value = value
	}

	public _fields: {
		X: $.VarRef<number>
		Y: $.VarRef<number>
	}

	constructor(init?: Partial<{X?: number, Y?: number}>) {
		this._fields = {
			X: $.varRef(init?.X ?? (0 as unknown as number)),
			Y: $.varRef(init?.Y ?? (0 as unknown as number))
		}
	}

	public clone(): Point {
		const cloned = new Point()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Y: $.varRef(this._fields.Y.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Point",
		() => new Point(),
		[],
		Point,
		[{ name: "X", key: "X", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "Y", key: "Y", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Initialize directly
	let p1 = $.markAsStructValue(new Point({X: 1, Y: 2}))
	$.println("p1:", p1.X, p1.Y)

	// Assign to another variable (should trigger clone)
	let p2 = $.markAsStructValue($.cloneStructValue(p1))
	p2.X = 10

	// Print both to show they are independent
	$.println("p1 after p2 mod:", p1.X, p1.Y)
	$.println("p2:", p2.X, p2.Y)

	// Initialize via variable assignment
	let v = $.markAsStructValue(new Point({X: 3, Y: 4}))
	let p3 = $.markAsStructValue($.cloneStructValue(v))
	p3.Y = 40

	$.println("v after p3 mod:", v.X, v.Y)
	$.println("p3:", p3.X, p3.Y)
}

if ($.isMainScript(import.meta)) {
	await main()
}
