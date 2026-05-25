// Generated file based on dep2.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = {
	Value(): string
}

$.registerInterfaceType(
	"dep2.Value",
	null,
	[{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type Result = {
	Result(): string
}

$.registerInterfaceType(
	"dep2.Result",
	null,
	[{ name: "Result", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)
