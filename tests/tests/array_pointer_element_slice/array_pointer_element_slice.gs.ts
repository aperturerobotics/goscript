// Generated file based on array_pointer_element_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public get sub(): $.Slice<node | $.VarRef<node> | null> {
		return this._fields.sub.value
	}
	public set sub(value: $.Slice<node | $.VarRef<node> | null>) {
		this._fields.sub.value = value
	}

	public get sub0(): (node | $.VarRef<node> | null)[] {
		return this._fields.sub0.value
	}
	public set sub0(value: (node | $.VarRef<node> | null)[]) {
		this._fields.sub0.value = value
	}

	public _fields: {
		sub: $.VarRef<$.Slice<node | $.VarRef<node> | null>>
		sub0: $.VarRef<(node | $.VarRef<node> | null)[]>
	}

	constructor(init?: Partial<{sub?: $.Slice<node | $.VarRef<node> | null>, sub0?: (node | $.VarRef<node> | null)[]}>) {
		this._fields = {
			sub: $.varRef(init?.sub ?? null),
			sub0: $.varRef(init?.sub0 ?? Array.from({ length: 1 }, () => null))
		}
	}

	public clone(): node {
		const cloned = new node()
		cloned._fields = {
			sub: $.varRef(this._fields.sub.value),
			sub0: $.varRef(this._fields.sub0.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		new node(),
		[],
		node,
		{"sub": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.node" } }, "sub0": { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Pointer, elemType: "main.node" }, length: 1 }}
	)
}

export async function main(): Promise<void> {
	let root = new node()
	let child = new node()
	$.pointerValue<node>(root).sub = $.append($.goSlice($.pointerValue<node>(root).sub0, undefined, 0), child)

	$.println($.len($.pointerValue<node>(root).sub), $.pointerValue<node>(root).sub![0] == child)
}


if ($.isMainScript(import.meta)) {
	await main()
}
