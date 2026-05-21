// Generated file based on tuple_return_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Block = null | {
	Size(): number
}

$.registerInterfaceType(
	"main.Block",
	null,
	[{ name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export class blockImpl {
	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		size: $.VarRef<number>
	}

	constructor(init?: Partial<{size?: number}>) {
		this._fields = {
			size: $.varRef(init?.size ?? 0)
		}
	}

	public clone(): blockImpl {
		const cloned = new blockImpl()
		cloned._fields = {
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Size(): number {
		const b: blockImpl | $.VarRef<blockImpl> | null = this
		return $.pointerValue<blockImpl>(b).size
	}

	static __typeInfo = $.registerStructType(
		"main.blockImpl",
		new blockImpl(),
		[{ name: "Size", args: [], returns: [] }],
		blockImpl,
		{"size": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function newBlock(size: number): [blockImpl | $.VarRef<blockImpl> | null, $.GoError] {
	return [new blockImpl({size: size}), null]
}

export function newInterface(size: number): [Block | null, $.GoError] {
	if (size == 0) {
		return [null, null]
	}
	const __goscriptReturn0 = newBlock(size)
	return [$.interfaceValue<Block | null>(__goscriptReturn0[0], "*main.blockImpl"), __goscriptReturn0[1]]
}

export async function main(): Promise<void> {
	let [block, err] = newInterface(16)
	$.println("err nil:", err == null)
	$.println("size:", $.pointerValue(block).Size())
}


if ($.isMainScript(import.meta)) {
	await main()
}
