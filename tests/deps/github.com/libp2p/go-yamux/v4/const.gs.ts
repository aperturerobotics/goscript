// Generated file based on const.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as fmt from "@goscript/fmt/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/fmt/index.js"

export class Error {
	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public get timeout(): boolean {
		return this._fields.timeout.value
	}
	public set timeout(value: boolean) {
		this._fields.timeout.value = value
	}

	public get temporary(): boolean {
		return this._fields.temporary.value
	}
	public set temporary(value: boolean) {
		this._fields.temporary.value = value
	}

	public _fields: {
		msg: $.VarRef<string>
		timeout: $.VarRef<boolean>
		temporary: $.VarRef<boolean>
	}

	constructor(init?: Partial<{msg?: string, timeout?: boolean, temporary?: boolean}>) {
		this._fields = {
			msg: $.varRef(init?.msg ?? ("" as unknown as string)),
			timeout: $.varRef(init?.timeout ?? (false as unknown as boolean)),
			temporary: $.varRef(init?.temporary ?? (false as unknown as boolean))
		}
	}

	public clone(): Error {
		const cloned = new Error()
		cloned._fields = {
			msg: $.varRef(this._fields.msg.value),
			timeout: $.varRef(this._fields.timeout.value),
			temporary: $.varRef(this._fields.temporary.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const ye: Error | $.VarRef<Error> | null = this
		return $.pointerValue<Error>(ye).msg
	}

	public Temporary(): boolean {
		const ye: Error | $.VarRef<Error> | null = this
		return $.pointerValue<Error>(ye).temporary
	}

	public Timeout(): boolean {
		const ye: Error | $.VarRef<Error> | null = this
		return $.pointerValue<Error>(ye).timeout
	}

	static __typeInfo = $.registerStructType(
		"yamux.Error",
		() => new Error(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		Error,
		[{ name: "msg", key: "msg", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "timeout", key: "timeout", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 16, exported: false }, { name: "temporary", key: "temporary", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 17, exported: false }]
	)
}

export const protoVersion: number = 0

export const typeData: number = 0

export const typeWindowUpdate: number = 1

export const typePing: number = 2

export const typeGoAway: number = 3

export const flagSYN: number = 1

export const flagACK: number = 2

export const flagFIN: number = 4

export const flagRST: number = 8

export const initialStreamWindow: number = 262144

export const maxStreamWindow: number = 16777216

export const goAwayNormal: number = 0

export const goAwayProtoErr: number = 1

export const goAwayInternalErr: number = 2

export const sizeOfVersion: number = 1

export const sizeOfType: number = 1

export const sizeOfFlags: number = 2

export const sizeOfStreamID: number = 4

export const sizeOfLength: number = 4

export const headerSize: number = 12

export let ErrInvalidVersion: Error | $.VarRef<Error> | null = new Error({msg: "invalid protocol version"})

export function __goscript_set_ErrInvalidVersion(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrInvalidVersion = __goscriptValue
}

export let ErrInvalidMsgType: Error | $.VarRef<Error> | null = new Error({msg: "invalid msg type"})

export function __goscript_set_ErrInvalidMsgType(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrInvalidMsgType = __goscriptValue
}

export let ErrSessionShutdown: Error | $.VarRef<Error> | null = new Error({msg: "session shutdown"})

export function __goscript_set_ErrSessionShutdown(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrSessionShutdown = __goscriptValue
}

export let ErrStreamsExhausted: Error | $.VarRef<Error> | null = new Error({msg: "streams exhausted"})

export function __goscript_set_ErrStreamsExhausted(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrStreamsExhausted = __goscriptValue
}

export let ErrDuplicateStream: Error | $.VarRef<Error> | null = new Error({msg: "duplicate stream initiated"})

export function __goscript_set_ErrDuplicateStream(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrDuplicateStream = __goscriptValue
}

export let ErrRecvWindowExceeded: Error | $.VarRef<Error> | null = new Error({msg: "recv window exceeded"})

export function __goscript_set_ErrRecvWindowExceeded(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrRecvWindowExceeded = __goscriptValue
}

export let ErrTimeout: Error | $.VarRef<Error> | null = new Error({msg: "i/o deadline reached", timeout: true, temporary: true})

export function __goscript_set_ErrTimeout(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrTimeout = __goscriptValue
}

export let ErrStreamClosed: Error | $.VarRef<Error> | null = new Error({msg: "stream closed"})

export function __goscript_set_ErrStreamClosed(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrStreamClosed = __goscriptValue
}

export let ErrUnexpectedFlag: Error | $.VarRef<Error> | null = new Error({msg: "unexpected flag"})

export function __goscript_set_ErrUnexpectedFlag(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrUnexpectedFlag = __goscriptValue
}

export let ErrRemoteGoAway: Error | $.VarRef<Error> | null = new Error({msg: "remote end is not accepting connections"})

export function __goscript_set_ErrRemoteGoAway(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrRemoteGoAway = __goscriptValue
}

export let ErrStreamReset: Error | $.VarRef<Error> | null = new Error({msg: "stream reset"})

export function __goscript_set_ErrStreamReset(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrStreamReset = __goscriptValue
}

export let ErrConnectionWriteTimeout: Error | $.VarRef<Error> | null = new Error({msg: "connection write timeout", timeout: true})

export function __goscript_set_ErrConnectionWriteTimeout(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrConnectionWriteTimeout = __goscriptValue
}

export let ErrKeepAliveTimeout: Error | $.VarRef<Error> | null = new Error({msg: "keepalive timeout", timeout: true})

export function __goscript_set_ErrKeepAliveTimeout(__goscriptValue: Error | $.VarRef<Error> | null): void {
	ErrKeepAliveTimeout = __goscriptValue
}

export type header = Uint8Array

export function header_Version(h: header): number {
	return $.uint($.arrayIndex(h, 0), 8)
}

export function header_MsgType(h: header): number {
	return $.uint($.arrayIndex(h, 1), 8)
}

export function header_Flags(h: header): number {
	return $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).Uint16($.goSlice(h, 2, 4)), 16)
}

export function header_StreamID(h: header): number {
	return $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).Uint32($.goSlice(h, 4, 8)), 32)
}

export function header_Length(h: header): number {
	return $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).Uint32($.goSlice(h, 8, 12)), 32)
}

export async function header_String(h: header): globalThis.Promise<string> {
	return await fmt.Sprintf("Vsn:%d Type:%d Flags:%d StreamID:%d Length:%d", $.namedValueInterfaceValue<any>(header_Version(h), "uint8", {}, { kind: $.TypeKind.Basic, name: "uint8" }), $.namedValueInterfaceValue<any>(header_MsgType(h), "uint8", {}, { kind: $.TypeKind.Basic, name: "uint8" }), $.namedValueInterfaceValue<any>(header_Flags(h), "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }), $.namedValueInterfaceValue<any>(header_StreamID(h), "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }), $.namedValueInterfaceValue<any>(header_Length(h), "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }))
}

export function encode(msgType: number, flags: number, streamID: number, length: number): header {
	let h: header = new Uint8Array(12)
	h[0] = $.uint(0, 8)
	h[1] = $.uint(msgType, 8)
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).PutUint16($.goSlice(h, 2, 4), $.uint(flags, 16))
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).PutUint32($.goSlice(h, 4, 8), $.uint(streamID, 32))
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))).PutUint32($.goSlice(h, 8, 12), $.uint(length, 32))
	return h
}
