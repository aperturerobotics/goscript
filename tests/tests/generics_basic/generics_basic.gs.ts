// Generated file based on generics_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export function printVal(__typeArgs: $.GenericTypeArgs | undefined, val: any): void {
	$.println(val)
}

export async function main(): Promise<void> {
	printVal({T: { zero: () => 0 }}, 10)
	printVal({T: { zero: () => "" }}, "hello")
	printVal({T: { zero: () => false }}, true)
}


if ($.isMainScript(import.meta)) {
	await main()
}
