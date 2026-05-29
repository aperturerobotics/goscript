// Generated file based on errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export let ErrReset: $.GoError = errors.New("stream reset")

export function __goscript_set_ErrReset(__goscriptValue: $.GoError): void {
	ErrReset = __goscriptValue
}

export let ErrUnimplemented: $.GoError = errors.New("unimplemented")

export function __goscript_set_ErrUnimplemented(__goscriptValue: $.GoError): void {
	ErrUnimplemented = __goscriptValue
}

export let ErrCompleted: $.GoError = errors.New("unexpected packet after rpc was completed")

export function __goscript_set_ErrCompleted(__goscriptValue: $.GoError): void {
	ErrCompleted = __goscriptValue
}

export let ErrUnrecognizedPacket: $.GoError = errors.New("unrecognized packet type")

export function __goscript_set_ErrUnrecognizedPacket(__goscriptValue: $.GoError): void {
	ErrUnrecognizedPacket = __goscriptValue
}

export let ErrEmptyPacket: $.GoError = errors.New("invalid empty packet")

export function __goscript_set_ErrEmptyPacket(__goscriptValue: $.GoError): void {
	ErrEmptyPacket = __goscriptValue
}

export let ErrInvalidMessage: $.GoError = errors.New("invalid message")

export function __goscript_set_ErrInvalidMessage(__goscriptValue: $.GoError): void {
	ErrInvalidMessage = __goscriptValue
}

export let ErrEmptyMethodID: $.GoError = errors.New("method id empty")

export function __goscript_set_ErrEmptyMethodID(__goscriptValue: $.GoError): void {
	ErrEmptyMethodID = __goscriptValue
}

export let ErrEmptyServiceID: $.GoError = errors.New("service id empty")

export function __goscript_set_ErrEmptyServiceID(__goscriptValue: $.GoError): void {
	ErrEmptyServiceID = __goscriptValue
}

export let ErrNoAvailableClients: $.GoError = errors.New("no available rpc clients")

export function __goscript_set_ErrNoAvailableClients(__goscriptValue: $.GoError): void {
	ErrNoAvailableClients = __goscriptValue
}

export let ErrNilWriter: $.GoError = errors.New("writer cannot be nil")

export function __goscript_set_ErrNilWriter(__goscriptValue: $.GoError): void {
	ErrNilWriter = __goscriptValue
}
