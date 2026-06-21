// Generated file based on b.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_a from "./a.gs.ts"
import "./a.gs.ts"

export class bValue {
	public get inner(): __goscript_a.aValue {
		return this._fields.inner.value
	}
	public set inner(value: __goscript_a.aValue) {
		this._fields.inner.value = value
	}

	public _fields: {
		inner: $.VarRef<__goscript_a.aValue>
	}

	constructor(init?: Partial<{inner?: __goscript_a.aValue}>) {
		this._fields = {
			inner: $.varRef(init?.inner ? $.markAsStructValue($.cloneStructValue(init.inner)) : $.markAsStructValue(new __goscript_a.aValue()))
		}
	}

	public clone(): bValue {
		const cloned = new bValue()
		cloned._fields = {
			inner: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.inner.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.bValue",
		() => new bValue(),
		[],
		bValue,
		[{ name: "inner", key: "inner", type: "main.aValue", pkgPath: "github.com/s4wave/goscript/tests/tests/cross_file_struct_typeinfo_zero", index: [0], offset: 0, exported: false }]
	)
}

export function makeB(): bValue {
	return $.markAsStructValue(new bValue())
}
