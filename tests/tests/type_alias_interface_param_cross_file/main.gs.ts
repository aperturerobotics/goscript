// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"

import * as __goscript_types from "./types.gs.ts"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"
import "./types.gs.ts"

export class sink {
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

	public clone(): sink {
		const cloned = new sink()
		cloned._fields = {
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Put(v: __goscript_types.Value): void {
		let s: sink | $.VarRef<sink> | null = this
		$.pointerValue<sink>(s).size = $.len((v as __goscript_types.Value))
	}

	static __typeInfo = $.registerStructType(
		"main.sink",
		() => new sink(),
		[{ name: "Put", args: [], returns: [] }],
		sink,
		[{ name: "size", key: "size", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_alias_interface_param_cross_file", index: [0], offset: 0, exported: false }]
	)
}

export function write(tx: __goscript_types.Tx | null, v: dep.Value): void {
	$.pointerValue<Exclude<__goscript_types.Tx, null>>(tx).Put((v as __goscript_types.Value))
}

export async function main(): globalThis.Promise<void> {
	let s: sink | $.VarRef<sink> | null = new sink()
	write($.interfaceValue<__goscript_types.Tx | null>(s, "*main.sink"), ($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]) as dep.Value))
	$.println("size:", $.pointerValue<sink>(s).size)
}

if ($.isMainScript(import.meta)) {
	await main()
}
