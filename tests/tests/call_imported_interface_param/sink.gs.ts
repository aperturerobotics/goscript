// Generated file based on sink.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/aperturerobotics/goscript/tests/tests/call_imported_interface_param/subpkg/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/call_imported_interface_param/subpkg/index.js"

export async function Use(w: subpkg.Writer | null): globalThis.Promise<void> {
	await $.pointerValue<Exclude<subpkg.Writer, null>>(w).Write(new Uint8Array([120]))
}
