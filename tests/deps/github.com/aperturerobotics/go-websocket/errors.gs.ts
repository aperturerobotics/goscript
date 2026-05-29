// Generated file based on errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export let ErrMessageTooBig: $.GoError = errors.New("websocket: message too big")

export function __goscript_set_ErrMessageTooBig(__goscriptValue: $.GoError): void {
	ErrMessageTooBig = __goscriptValue
}
