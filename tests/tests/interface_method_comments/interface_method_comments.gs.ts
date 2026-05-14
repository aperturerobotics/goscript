// Generated file based on interface_method_comments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type MyInterface = null | {
	MyMethod(): void
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "MyMethod", args: [], returns: [] }]
)

export async function main(): Promise<void> {
	$.println("Test started")
	$.println("Test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
