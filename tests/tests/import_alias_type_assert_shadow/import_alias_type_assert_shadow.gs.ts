// Generated file based on import_alias_type_assert_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep2 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_alias_type_assert_shadow/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/import_alias_type_assert_shadow/dep/index.js"

export function unwrap(v: any): number {
	{
		let __goscriptTuple0: any = $.typeAssertTuple<dep2.Thing | $.VarRef<dep2.Thing> | null>(v, { kind: $.TypeKind.Pointer, elemType: "dep.Thing" })
		let __goscriptShadow0: dep2.Thing | $.VarRef<dep2.Thing> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			return $.pointerValue<dep2.Thing>(__goscriptShadow0).Value
		}
	}
	return 0
}

export async function main(): globalThis.Promise<void> {
	$.println(unwrap($.interfaceValue<any>(new dep2.Thing({Value: 7}), "*dep.Thing")))
}

if ($.isMainScript(import.meta)) {
	await main()
}
