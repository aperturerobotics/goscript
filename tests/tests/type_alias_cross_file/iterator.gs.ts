// Generated file based on iterator.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as subpkg from "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_cross_file/subpkg/index.js"

import type * as __goscript_alias from "./alias.gs.ts"

export type Reader = {
	Val(): __goscript_alias.Value
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Val", args: [], returns: [{ name: "_r0", type: "subpkg.Value" }] }]
);

export async function Read(r: Reader | null): globalThis.Promise<__goscript_alias.Value> {
	return (await $.pointerValue<Exclude<Reader, null>>(r).Val() as __goscript_alias.Value)
}
