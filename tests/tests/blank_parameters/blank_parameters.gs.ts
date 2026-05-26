// Generated file based on blank_parameters.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class blankImpl {
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
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): blankImpl {
		const cloned = new blankImpl()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(): number {
		const b: blankImpl | $.VarRef<blankImpl> | null = this
		return $.pointerValue<blankImpl>(b).value
	}

	static __typeInfo = $.registerStructType(
		"main.blankImpl",
		() => new blankImpl(),
		[{ name: "Value", args: [], returns: [] }],
		blankImpl,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class Packer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Packer {
		const cloned = new Packer()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public pack(msg: $.Slice<number>, _p1: Map<string, number> | null, _p2: number): $.Slice<number> {
		return $.append(msg, 1)
	}

	static __typeInfo = $.registerStructType(
		"main.Packer",
		() => new Packer(),
		[{ name: "pack", args: [], returns: [] }],
		Packer,
		{}
	)
}

export type blankInterface = {
	Value(): number
}

$.registerInterfaceType(
	"main.blankInterface",
	null,
	[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export function blanks(_p0: number, _p1: string): number {
	return 7
}

export function unicodeNames(_u3c6: number, _u3b2: number): [number, number] {
	let _u3c8: number = 0
	let _u3b4: number = 0
	_u3c8 = _u3c6 + 1
	_u3b4 = _u3b2 + 2
	return [_u3c8, _u3b4]
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Packer())
	$.println(blanks(1, "x"))
	$.println($.len($.markAsStructValue($.cloneStructValue(p)).pack(null, null, 0)))

	let f: ((_p0: number, _p1: number) => number | globalThis.Promise<number>) | null = $.functionValue((_p0: number, _p1: number): number => {
		return 9
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))
	$.println(await f!(1, 2))

	let [left, right] = unicodeNames(3, 4)
	$.println(left, right)
}

if ($.isMainScript(import.meta)) {
	await main()
}
