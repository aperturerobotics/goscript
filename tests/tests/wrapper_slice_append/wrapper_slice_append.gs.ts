// Generated file based on wrapper_slice_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errlist from "@goscript/github.com/aperturerobotics/goscript/tests/tests/wrapper_slice_append/errlist/index.js"

export class parser {
	public get errors(): errlist.ErrorList {
		return this._fields.errors.value
	}
	public set errors(value: errlist.ErrorList) {
		this._fields.errors.value = value
	}

	public get astruct(): errlist.AStruct {
		return this._fields.astruct.value
	}
	public set astruct(value: errlist.AStruct) {
		this._fields.astruct.value = value
	}

	public _fields: {
		errors: $.VarRef<errlist.ErrorList>;
		astruct: $.VarRef<errlist.AStruct>;
	}

	constructor(init?: Partial<{astruct?: errlist.AStruct, errors?: errlist.ErrorList}>) {
		this._fields = {
			errors: $.varRef(init?.errors ?? null as errlist.ErrorList),
			astruct: $.varRef(init?.astruct ? $.markAsStructValue(init.astruct.clone()) : new errlist.AStruct())
		}
	}

	public clone(): parser {
		const cloned = new parser()
		cloned._fields = {
			errors: $.varRef(this._fields.errors.value),
			astruct: $.varRef($.markAsStructValue(this._fields.astruct.value.clone()))
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.parser',
	  new parser(),
	  [],
	  parser,
	  {"errors": "ErrorList", "astruct": "AStruct"}
	);
}

export async function main(): Promise<void> {
	let p: parser = new parser()
	// this Add method does not work:
	errlist.ErrorList_Add(p._fields.errors, "error")
	$.println(p.errors![0])

	// but it does work for a struct type:
	p.astruct.Set("astruct")
	$.println(p.astruct.Msg)
}

