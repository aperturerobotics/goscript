// Generated file based on invoker.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as __goscript_stream from "./stream.gs.ts"

export type Invoker = {
	Invoke(_p0: __goscript_stream.Stream | null): $.GoError
}

$.registerInterfaceType(
	"main.Invoker",
	null,
	[{ name: "Invoke", args: [{ name: "_p0", type: "main.Stream" }], returns: [{ name: "_r0", type: "error" }] }]
);
