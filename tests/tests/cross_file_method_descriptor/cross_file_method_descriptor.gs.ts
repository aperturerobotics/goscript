// Generated file based on cross_file_method_descriptor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_method from "./method.gs.ts"
import "./method.gs.ts"

export type runner = null | {
	Run(): string
}

$.registerInterfaceType(
	"main.runner",
	null,
	[{ name: "Run", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type mode = number

export function asRunner(m: mode): runner | null {
	return $.namedValueInterfaceValue<runner | null>(m, "main.mode", {Run: __goscript_method.mode_Run})
}

export async function main(): globalThis.Promise<void> {
	$.println($.pointerValue<Exclude<runner, null>>(asRunner(1)).Run())
}

if ($.isMainScript(import.meta)) {
	await main()
}
