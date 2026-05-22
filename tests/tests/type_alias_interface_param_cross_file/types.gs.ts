// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"

export type Value = dep.Value

export type Tx = null | {
	Put(v: Value): void
}

$.registerInterfaceType(
	"main.Tx",
	null,
	[{ name: "Put", args: [{ name: "v", type: "dep.Value" }], returns: [] }]
)
