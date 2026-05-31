// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep1 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_embedded_import_methods/dep1/index.js"

import type * as dep2 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_embedded_import_methods/dep2/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_embedded_import_methods/dep1/index.js"

export type Combined = {
	Extra(): void
	Use(_p0: dep2.Value | null): dep2.Result | null
}

$.registerInterfaceType(
	"main.Combined",
	null,
	[{ name: "Extra", args: [], returns: [] }, { name: "Use", args: [{ name: "_p0", type: "dep2.Value" }], returns: [{ name: "_r0", type: "dep2.Result" }] }]
);

export async function main(): globalThis.Promise<void> {
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}
