// Generated file based on typed_nil_pointer_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public get next(): node | $.VarRef<node> | null {
		return this._fields.next.value
	}
	public set next(value: node | $.VarRef<node> | null) {
		this._fields.next.value = value
	}

	public _fields: {
		next: $.VarRef<node | $.VarRef<node> | null>
	}

	constructor(init?: Partial<{next?: node | $.VarRef<node> | null}>) {
		this._fields = {
			next: $.varRef(init?.next ?? null)
		}
	}

	public clone(): node {
		const cloned = new node()
		cloned._fields = {
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		[],
		node,
		{"next": { kind: $.TypeKind.Pointer, elemType: "main.node" }}
	)
}

export function clone(n: node | $.VarRef<node> | null): node | $.VarRef<node> | null {
	if (n == null) {
		return null
	}
	return new node({next: $.pointerValue<node>(n).next})
}

export async function main(): globalThis.Promise<void> {
	let n: node | $.VarRef<node> | null = null as node | $.VarRef<node> | null
	let cloned: node | $.VarRef<node> | null = clone(n)
	$.println(cloned == null)

	let boxed: any = $.interfaceValue<any>(null, "*main.node")
	let [, ok] = $.typeAssertTuple<node | $.VarRef<node> | null>(boxed, { kind: $.TypeKind.Pointer, elemType: "main.node" })
	$.println(boxed == null, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}
