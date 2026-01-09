// Generated file based on slices_sortfunc_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

export class field {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.field',
	  new field(),
	  [],
	  field,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export async function main(): Promise<void> {
	let fields: $.Slice<field> = null
	$.println("fields before:", fields)

	slices.SortFunc(fields, (a: field, b: field): number => {
		if (a.name < b.name) {
			return -1
		}
		if (a.name > b.name) {
			return 1
		}
		return 0
	})

	$.println("fields after:", fields)
}

