// Generated file based on slices_sortfunc_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/slices/index.js"

export class field {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): field {
		const cloned = new field()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.field",
		() => new field(),
		[],
		field,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/slices_sortfunc_nil", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fields: $.Slice<field> = null as $.Slice<field>
	$.println("fields before:", fields)

	slices.SortFunc(fields, $.functionValue((a: field, b: field): number => {
		if ($.stringCompare(a.name, b.name) < 0) {
			return -1
		}
		if ($.stringCompare(a.name, b.name) > 0) {
			return 1
		}
		return 0
	}, ({ kind: $.TypeKind.Function, params: ["main.field", "main.field"], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))

	$.println("fields after:", fields)
}

if ($.isMainScript(import.meta)) {
	await main()
}
