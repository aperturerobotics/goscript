// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep1 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/method_result_imports_cross_file/dep1/index.js"

import * as dep2 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/method_result_imports_cross_file/dep2/index.js"

import * as __goscript_method from "./method.gs.ts"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/method_result_imports_cross_file/dep1/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/method_result_imports_cross_file/dep2/index.js"
import "./method.gs.ts"

export class Holder {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Holder {
		const cloned = new Holder()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Run(): void {
		let v = dep1.Make()
		$.println($.pointerValue<Exclude<dep2.Value, null>>(v).Value())
	}

	static __typeInfo = $.registerStructType(
		"main.Holder",
		() => new Holder(),
		[{ name: "Run", args: [], returns: [] }],
		Holder,
		{}
	)
}

export async function main(): globalThis.Promise<void> {
	$.markAsStructValue($.cloneStructValue($.markAsStructValue(new Holder()))).Run()
}

if ($.isMainScript(import.meta)) {
	await main()
}
