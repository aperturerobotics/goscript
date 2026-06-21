// Generated file based on tuple_return_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Block = {
	Size(): number
}

$.registerInterfaceType(
	"main.Block",
	null,
	[{ name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

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
			size: $.varRef(init?.size ?? (0 as unknown as number))
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
		() => new blockImpl(),
		[{ name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		blockImpl,
		[{ name: "size", key: "size", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/s4wave/goscript/tests/tests/tuple_return_interface", index: [0], offset: 0, exported: false }]
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
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let [block, err] = newInterface(16)
	$.println("err nil:", err == null)
	$.println("size:", await $.pointerValue<Exclude<Block, null>>(block).Size())
}

if ($.isMainScript(import.meta)) {
	await main()
}
