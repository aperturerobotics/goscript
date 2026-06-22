// Generated file based on selector_expr_lhs_multi_assign.go
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
		[{ name: "X", key: "X", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "Y", key: "Y", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export function getCoords(): [number, number] {
	return [10, 20]
}

export async function main(): globalThis.Promise<void> {
	let p: Point = $.markAsStructValue(new Point())
	// p.X and p.Y are *ast.SelectorExpr
	// test writeMultiVarAssignFromCall in WriteStmtAssign
	let __goscriptTuple0: any = getCoords()
	p.X = __goscriptTuple0[0]
	p.Y = __goscriptTuple0[1]
	$.println(p.X, p.Y)
}

if ($.isMainScript(import.meta)) {
	await main()
}
