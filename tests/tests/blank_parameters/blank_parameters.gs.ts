// Generated file based on blank_parameters.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
		new Packer(),
		[{ name: "pack", args: [], returns: [] }],
		Packer,
		{}
	)
}

export function blanks(_p0: number, _p1: string): number {
	return 7
}

export async function main(): Promise<void> {
	let p = $.markAsStructValue(new Packer())
	$.println(blanks(1, "x"))
	$.println($.len($.markAsStructValue((p).clone()).pack(null, null, 0)))

	let f = $.functionValue((_p0: number, _p1: number): number => {
		return 9
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] })
	$.println(await f!(1, 2))
}


if ($.isMainScript(import.meta)) {
	await main()
}
