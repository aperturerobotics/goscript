// Generated file based on tuple_call_forwarding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class point {
	public get x(): number {
		return this._fields.x.value
	}
	public set x(value: number) {
		this._fields.x.value = value
	}

	public get y(): number {
		return this._fields.y.value
	}
	public set y(value: number) {
		this._fields.y.value = value
	}

	public _fields: {
		x: $.VarRef<number>
		y: $.VarRef<number>
	}

	constructor(init?: Partial<{x?: number, y?: number}>) {
		this._fields = {
			x: $.varRef(init?.x ?? 0),
			y: $.varRef(init?.y ?? 0)
		}
	}

	public clone(): point {
		const cloned = new point()
		cloned._fields = {
			x: $.varRef(this._fields.x.value),
			y: $.varRef(this._fields.y.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		new point(),
		[],
		point,
		{"x": { kind: $.TypeKind.Basic, name: "int" }, "y": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function pair(a: number, b: number): [number, number] {
	return [a, b]
}

export function sum(a: number, b: number): number {
	return a + b
}

export function triple(a: number, b: number, c: number): [number, number, number] {
	return [a, b, c]
}

export function makePoint(x: number, y: number, z: number): point | $.VarRef<point> | null {
	return new point({x: x + z, y: y})
}

export async function main(): Promise<void> {
	$.println("sum:", sum(...(pair(2, 3))))
	let p = makePoint(...(triple(4, 5, 6)))
	$.println("point:", $.pointerValue<point>(p).x, $.pointerValue<point>(p).y)
}


if ($.isMainScript(import.meta)) {
	await main()
}
