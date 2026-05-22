// Generated file based on iterator.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/type_alias_cross_file/subpkg/index.js"

import * as __goscript_alias from "./alias.gs.ts"

export type Reader = null | {
	Val(): __goscript_alias.Value
}

$.registerInterfaceType(
	"main.Reader",
	null,
	[{ name: "Val", args: [], returns: [{ name: "_r0", type: "subpkg.Value" }] }]
)

export function Read(r: Reader | null): __goscript_alias.Value {
	return ($.pointerValue<Exclude<Reader, null>>(r).Val() as __goscript_alias.Value)
}
