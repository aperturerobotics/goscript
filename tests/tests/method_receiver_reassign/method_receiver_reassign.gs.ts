// Generated file based on method_receiver_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public _fields: {
		n: $.VarRef<number>
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: $.varRef(init?.n ?? 0)
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			n: $.varRef(this._fields.n.value)
		}
		return $.markAsStructValue(cloned)
	}

	public dec(): item {
		let s: item = this
		if (s.n > 0) {
			s = $.markAsStructValue(new item({n: s.n - 1}))
		}
		return $.markAsStructValue($.cloneStructValue(s))
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[{ name: "dec", args: [], returns: [] }],
		item,
		{"n": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.markAsStructValue(new item({n: 2}))
	let out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(original)).dec()))
	$.println("original:", original.n)
	$.println("out:", out.n)
}

if ($.isMainScript(import.meta)) {
	await main()
}
