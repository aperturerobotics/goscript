// Generated file based on generic_receiver_type_param_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class nistCurve {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): nistCurve {
		const cloned = new nistCurve()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Add(p1: any, p2: any): any {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this
		return (p1.Add(p1, p2) as any)
	}

	public Zero(): any {
		const curve: nistCurve | $.VarRef<nistCurve> | null = this
		let p: any = null
		return p
	}

	static __typeInfo = $.registerStructType(
		"main.nistCurve",
		() => new nistCurve(),
		[{ name: "Add", args: [], returns: [] }, { name: "Zero", args: [], returns: [] }],
		nistCurve,
		{}
	)
}

export class point {
	public get N(): number {
		return this._fields.N.value
	}
	public set N(value: number) {
		this._fields.N.value = value
	}

	public _fields: {
		N: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? 0)
		}
	}

	public clone(): point {
		const cloned = new point()
		cloned._fields = {
			N: $.varRef(this._fields.N.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(a: point | $.VarRef<point> | null, b: point | $.VarRef<point> | null): point | $.VarRef<point> | null {
		const p: point | $.VarRef<point> | null = this
		return new point({N: $.pointerValue<point>(a).N + $.pointerValue<point>(b).N})
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		[{ name: "Add", args: [], returns: [] }],
		point,
		{"N": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export type nistPoint = null | {
	Add(_p0: any, _p1: any): any
}

$.registerInterfaceType(
	"main.nistPoint",
	null,
	[{ name: "Add", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
)

export let curve: nistCurve | $.VarRef<nistCurve> | null = new nistCurve()

export function __goscript_set_curve(value: nistCurve | $.VarRef<nistCurve> | null): void {
	curve = value
}

export async function main(): globalThis.Promise<void> {
	let p: point | $.VarRef<point> | null = (nistCurve.prototype.Add.call(curve, new point({N: 2}), new point({N: 3})) as point | $.VarRef<point> | null)
	$.println("sum:", $.pointerValue<point>(p).N)
	if (nistCurve.prototype.Zero.call(curve) == null) {
		$.println("zero")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
