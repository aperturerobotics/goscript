// Generated file based on selector_expr_lhs_multi_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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
			X: $.varRef(init?.X ?? 0),
			Y: $.varRef(init?.Y ?? 0)
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
		new Point(),
		[],
		Point,
		{"X": { kind: $.TypeKind.Basic, name: "int" }, "Y": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function getCoords(): void {
	return [10, 20]
}

export async function main(): Promise<void> {
	let p: Point = $.markAsStructValue(new Point())
	let __goscriptTuple222 = getCoords()
	p.X = __goscriptTuple222[0]
	p.Y = __goscriptTuple222[1]
	$.println(p.X, p.Y)
}


if ($.isMainScript(import.meta)) {
	await main()
}
