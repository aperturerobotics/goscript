// Generated file based on generics_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function printVal(__typeArgs: $.GenericTypeArgs | undefined, val: any): void {
	$.println(val)
}

export async function main(): Promise<void> {
	printVal({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 10)
	printVal({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, "hello")
	printVal({T: { type: { kind: $.TypeKind.Basic, name: "bool" }, zero: () => false }}, true)
}


if ($.isMainScript(import.meta)) {
	await main()
}
