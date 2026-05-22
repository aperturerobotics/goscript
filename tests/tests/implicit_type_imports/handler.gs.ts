// Generated file based on handler.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_invoker from "./invoker.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"

export type Handler = null | {
	Handle(): void
	Invoke(_p0: __goscript_stream.Stream | null): $.GoError
}

$.registerInterfaceType(
	"main.Handler",
	null,
	[{ name: "Handle", args: [], returns: [] }, { name: "Invoke", args: [{ name: "_p0", type: "main.Stream" }], returns: [{ name: "_r0", type: "error" }] }]
)
