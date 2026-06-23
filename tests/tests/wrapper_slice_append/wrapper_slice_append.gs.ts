// Generated file based on wrapper_slice_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errlist from "@goscript/github.com/s4wave/goscript/tests/tests/wrapper_slice_append/errlist/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/wrapper_slice_append/errlist/index.js"

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
		errors: $.VarRef<errlist.ErrorList>
		astruct: $.VarRef<errlist.AStruct>
	}

	constructor(init?: Partial<{errors?: errlist.ErrorList, astruct?: errlist.AStruct}>) {
		this._fields = {
			errors: $.varRef(init?.errors ?? (null as unknown as errlist.ErrorList)),
			astruct: $.varRef(init?.astruct ? $.markAsStructValue($.cloneStructValue(init.astruct)) : $.markAsStructValue(new errlist.AStruct()))
		}
	}

	public clone(): parser {
		const cloned = new parser()
		cloned._fields = {
			errors: $.varRef(this._fields.errors.value),
			astruct: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.astruct.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.parser",
		() => new parser(),
		[],
		parser,
		[{ name: "errors", key: "errors", type: "errlist.ErrorList" }, { name: "astruct", key: "astruct", type: "errlist.AStruct" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: parser = $.markAsStructValue(new parser())
	// this Add method does not work:
	errlist.ErrorList_Add(p._fields.errors, "error")
	$.println($.arrayIndex(p.errors!, 0))

	// but it does work for a struct type:
	p.astruct.Set("astruct")
	$.println(p.astruct.Msg)
}

if ($.isMainScript(import.meta)) {
	await main()
}
