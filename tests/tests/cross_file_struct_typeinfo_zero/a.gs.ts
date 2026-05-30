// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_b from "./b.gs.ts"
import "./b.gs.ts"

export class aValue {
	public get next(): __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null {
		return this._fields.next.value
	}
	public set next(value: __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null) {
		this._fields.next.value = value
	}

	public _fields: {
		next: $.VarRef<__goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null>
	}

	constructor(init?: Partial<{next?: __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null}>) {
		this._fields = {
			next: $.varRef(init?.next ?? null)
		}
	}

	public clone(): aValue {
		const cloned = new aValue()
		cloned._fields = {
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.aValue",
		() => new aValue(),
		[],
		aValue,
		[{ name: "next", key: "next", type: { kind: $.TypeKind.Pointer, elemType: "main.bValue" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/cross_file_struct_typeinfo_zero", index: [0], offset: 0, exported: false }]
	)
}

export function makeA(): aValue {
	return $.markAsStructValue(new aValue())
}
