// Generated file based on dep1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep2 from "@goscript/github.com/s4wave/goscript/tests/tests/interface_embedded_import_methods/dep2/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/interface_embedded_import_methods/dep2/index.js"

export type Base = {
	Use(_p0: dep2.Value | null): dep2.Result | null
}

$.registerInterfaceType(
	"dep1.Base",
	null,
	[{ name: "Use", args: [{ name: "_p0", type: "dep2.Value" }], returns: [{ name: "_r0", type: "dep2.Result" }] }]
);
