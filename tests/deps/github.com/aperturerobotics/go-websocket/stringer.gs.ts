// Generated file based on stringer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_ws_js from "./ws_js.gs.ts"
import "@goscript/strconv/index.js"
import "./ws_js.gs.ts"

export const _opcode_name_0: string = "opContinuationopTextopBinary"

export const _opcode_name_1: string = "opCloseopPingopPong"

export const _MessageType_name: string = "MessageTextMessageBinary"

export const _StatusCode_name: string = "StatusNormalClosureStatusGoingAwayStatusProtocolErrorStatusUnsupportedDatastatusReservedStatusNoStatusRcvdStatusAbnormalClosureStatusInvalidFramePayloadDataStatusPolicyViolationStatusMessageTooBigStatusMandatoryExtensionStatusInternalErrorStatusServiceRestartStatusTryAgainLaterStatusBadGatewayStatusTLSHandshake"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 0 - 0)
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 8 - 8)
	$.arrayIndex(x, 9 - 9)
	$.arrayIndex(x, 10 - 10)
}

export let _opcode_index_0: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(14, 8), $.uint(20, 8), $.uint(28, 8)])

export function __goscript_set__opcode_index_0(__goscriptValue: Uint8Array): void {
	_opcode_index_0 = __goscriptValue
}

export let _opcode_index_1: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(7, 8), $.uint(13, 8), $.uint(19, 8)])

export function __goscript_set__opcode_index_1(__goscriptValue: Uint8Array): void {
	_opcode_index_1 = __goscriptValue
}

export function opcode_String(i: __goscript_ws_js.opcode): string {
	switch (true) {
		case (0 <= i) && (i <= 2):
		{
			return $.sliceStringOrBytes("opContinuationopTextopBinary", $.arrayIndex(_opcode_index_0, i), $.arrayIndex(_opcode_index_0, i + 1))
			break
		}
		case (8 <= i) && (i <= 10):
		{
			i = i - (8)
			return $.sliceStringOrBytes("opCloseopPingopPong", $.arrayIndex(_opcode_index_1, i), $.arrayIndex(_opcode_index_1, i + 1))
			break
		}
		default:
		{
			return ("opcode(" + strconv.FormatInt($.int64(i), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

function __goscriptBlankFunc1(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
}

export let _MessageType_index: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(11, 8), $.uint(24, 8)])

export function __goscript_set__MessageType_index(__goscriptValue: Uint8Array): void {
	_MessageType_index = __goscriptValue
}

export function MessageType_String(i: __goscript_ws_js.MessageType): string {
	i = i - (1)
	if ((i < 0) || (i >= $.len(_MessageType_index) - 1)) {
		return ("MessageType(" + strconv.FormatInt($.int64(i + 1), 10)) + ")"
	}
	return $.sliceStringOrBytes("MessageTextMessageBinary", $.arrayIndex(_MessageType_index, i), $.arrayIndex(_MessageType_index, i + 1))
}

function __goscriptBlankFunc2(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 1000 - 1000)
	$.arrayIndex(x, 1001 - 1001)
	$.arrayIndex(x, 1002 - 1002)
	$.arrayIndex(x, 1003 - 1003)
	$.arrayIndex(x, 1004 - 1004)
	$.arrayIndex(x, 1005 - 1005)
	$.arrayIndex(x, 1006 - 1006)
	$.arrayIndex(x, 1007 - 1007)
	$.arrayIndex(x, 1008 - 1008)
	$.arrayIndex(x, 1009 - 1009)
	$.arrayIndex(x, 1010 - 1010)
	$.arrayIndex(x, 1011 - 1011)
	$.arrayIndex(x, 1012 - 1012)
	$.arrayIndex(x, 1013 - 1013)
	$.arrayIndex(x, 1014 - 1014)
	$.arrayIndex(x, 1015 - 1015)
}

export let _StatusCode_index: number[] = [$.uint(0, 16), $.uint(19, 16), $.uint(34, 16), $.uint(53, 16), $.uint(74, 16), $.uint(88, 16), $.uint(106, 16), $.uint(127, 16), $.uint(156, 16), $.uint(177, 16), $.uint(196, 16), $.uint(220, 16), $.uint(239, 16), $.uint(259, 16), $.uint(278, 16), $.uint(294, 16), $.uint(312, 16)]

export function __goscript_set__StatusCode_index(__goscriptValue: number[]): void {
	_StatusCode_index = __goscriptValue
}

export function StatusCode_String(i: __goscript_ws_js.StatusCode): string {
	i = i - (1000)
	if ((i < 0) || (i >= $.len(_StatusCode_index) - 1)) {
		return ("StatusCode(" + strconv.FormatInt($.int64(i + 1000), 10)) + ")"
	}
	return $.sliceStringOrBytes("StatusNormalClosureStatusGoingAwayStatusProtocolErrorStatusUnsupportedDatastatusReservedStatusNoStatusRcvdStatusAbnormalClosureStatusInvalidFramePayloadDataStatusPolicyViolationStatusMessageTooBigStatusMandatoryExtensionStatusInternalErrorStatusServiceRestartStatusTryAgainLaterStatusBadGatewayStatusTLSHandshake", $.arrayIndex(_StatusCode_index, i), $.arrayIndex(_StatusCode_index, i + 1))
}
