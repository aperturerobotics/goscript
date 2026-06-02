// Generated file based on with-cancel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"
import "@goscript/context/index.js"

export function WithCancel(parent: context.Context | null): [context.Context | null, context.CancelFunc | null] {
	return context.WithCancel($.pointerValueOrNil(parent)!)
}
