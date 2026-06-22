// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"

export type Value = dep.Value

export type Tx = {
	Put(v: Value): void
}

$.registerInterfaceType(
	"main.Tx",
	null,
	[{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);
