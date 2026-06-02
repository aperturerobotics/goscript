// Generated file based on errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export let ErrNoServerForComponent: $.GoError = errors.New("no server for that component")

export function __goscript_set_ErrNoServerForComponent(__goscriptValue: $.GoError): void {
	ErrNoServerForComponent = __goscriptValue
}

export let ErrUnexpectedPacket: $.GoError = errors.New("unexpected rpcstream packet")

export function __goscript_set_ErrUnexpectedPacket(__goscriptValue: $.GoError): void {
	ErrUnexpectedPacket = __goscriptValue
}
