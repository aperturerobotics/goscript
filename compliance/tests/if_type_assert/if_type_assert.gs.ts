// Generated file based on if_type_assert.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

export async function main(): Promise<void> {
	let a: null | any = null
	a = "this is a string"
	{
		let { ok: ok } = $.typeAssert<string>(a, {kind: $.TypeKind.Basic, name: 'string'})
		if (ok) {
			console.log("Expected: string")
		}
		 else {
			console.log("Not Expected: should be a string")
		}
	}
}

