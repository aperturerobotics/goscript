// Generated file based on index_expr_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let slice: $.Slice<any> = ["hello", 42, true]
	let results: any[] = Array.from({ length: 2 }, () => null)
	let ok: boolean = false
	let __goscriptTuple184 = $.typeAssertTuple<number>(slice[1], { kind: $.TypeKind.Basic, name: "int" })
	results[0] = __goscriptTuple184[0]
	ok = __goscriptTuple184[1]
	if (ok) {
		$.println("slice[1] as int:", $.mustTypeAssert<number>(results[0], { kind: $.TypeKind.Basic, name: "int" }))
	}
	let m: Map<string, any> | null = $.makeMap<string, any>()
	$.mapSet(m, "key2", 123)
	let mapResults: Map<string, any> | null = $.makeMap<string, any>()
	let ok2: boolean = false
	let __goscriptTuple489 = $.typeAssertTuple<number>($.mapGet(m, "key2", null)[0], { kind: $.TypeKind.Basic, name: "int" })
	$.mapGet(mapResults, "result", null)[0] = __goscriptTuple489[0]
	ok2 = __goscriptTuple489[1]
	if (ok2) {
		$.println("m[key2] as int:", $.mustTypeAssert<number>($.mapGet(mapResults, "result", null)[0], { kind: $.TypeKind.Basic, name: "int" }))
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
