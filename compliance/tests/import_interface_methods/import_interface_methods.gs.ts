// Generated file based on import_interface_methods.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

import * as errlist from "@goscript/github.com/aperturerobotics/goscript/compliance/tests/import_interface_methods/errlist/index.js"

export class parser {
	public get errors(): errlist.ErrorList {
		return this._fields.errors.value
	}
	public set errors(value: errlist.ErrorList) {
		this._fields.errors.value = value
	}

	public _fields: {
		errors: $.VarRef<errlist.ErrorList>;
	}

	constructor(init?: Partial<{errors?: errlist.ErrorList}>) {
		this._fields = {
			errors: $.varRef(init?.errors ?? null as errlist.ErrorList)
		}
	}

	public clone(): parser {
		const cloned = new parser()
		cloned._fields = {
			errors: $.varRef(this._fields.errors.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'parser',
	  new parser(),
	  [],
	  parser,
	  {"errors": "ErrorList"}
	);
}

export async function main(): Promise<void> {
	let p: parser = new parser()
	errlist.ErrorList_Add(p.errors, "error")
	console.log(p.errors![0])
}

