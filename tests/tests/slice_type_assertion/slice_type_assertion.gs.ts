// Generated file based on slice_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let v: any = $.interfaceValue<any>($.arrayToSlice<number>([$.uint(7, 8), $.uint(8, 8), $.uint(9, 8)]), "[]byte")
	let b: $.Slice<number> = $.mustTypeAssert<$.Slice<number>>(v, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	$.println("byte slice:", $.len(b), $.uint(b![0], 8), $.uint(b![2], 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}
