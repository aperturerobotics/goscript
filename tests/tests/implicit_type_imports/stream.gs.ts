// Generated file based on stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Stream = {
	Send(): $.GoError
}

$.registerInterfaceType(
	"main.Stream",
	null,
	[{ name: "Send", args: [], returns: [{ name: "_r0", type: "error" }] }]
);
