// Generated file based on stream-rwc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"
import "./message.gs.ts"
import "./stream.gs.ts"

export class StreamRwc {
	public get Stream(): __goscript_stream.Stream | null {
		return this._fields.Stream.value
	}
	public set Stream(value: __goscript_stream.Stream | null) {
		this._fields.Stream.value = value
	}

	// buf is the incoming data buffer
	public get buf(): bytes.Buffer {
		return this._fields.buf.value
	}
	public set buf(value: bytes.Buffer) {
		this._fields.buf.value = value
	}

	// readMsg is the raw read message
	public get readMsg(): __goscript_message.RawMessage {
		return this._fields.readMsg.value
	}
	public set readMsg(value: __goscript_message.RawMessage) {
		this._fields.readMsg.value = value
	}

	// writeMsg is the raw write message
	public get writeMsg(): __goscript_message.RawMessage {
		return this._fields.writeMsg.value
	}
	public set writeMsg(value: __goscript_message.RawMessage) {
		this._fields.writeMsg.value = value
	}

	public _fields: {
		Stream: $.VarRef<__goscript_stream.Stream | null>
		buf: $.VarRef<bytes.Buffer>
		readMsg: $.VarRef<__goscript_message.RawMessage>
		writeMsg: $.VarRef<__goscript_message.RawMessage>
	}

	constructor(init?: Partial<{Stream?: __goscript_stream.Stream | null, buf?: bytes.Buffer, readMsg?: __goscript_message.RawMessage, writeMsg?: __goscript_message.RawMessage}>) {
		this._fields = {
			Stream: $.varRef(init?.Stream ?? null),
			buf: $.varRef(init?.buf ? $.markAsStructValue($.cloneStructValue(init.buf)) : $.markAsStructValue(new bytes.Buffer())),
			readMsg: $.varRef(init?.readMsg ? $.markAsStructValue($.cloneStructValue(init.readMsg)) : $.markAsStructValue(new __goscript_message.RawMessage())),
			writeMsg: $.varRef(init?.writeMsg ? $.markAsStructValue($.cloneStructValue(init.writeMsg)) : $.markAsStructValue(new __goscript_message.RawMessage()))
		}
	}

	public clone(): StreamRwc {
		const cloned = new StreamRwc()
		cloned._fields = {
			Stream: $.varRef(this._fields.Stream.value),
			buf: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.buf.value))),
			readMsg: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readMsg.value))),
			writeMsg: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeMsg.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: StreamRwc | $.VarRef<StreamRwc> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let readBuf: $.Slice<number> = p
		while (($.len(readBuf) != 0) && (err == null)) {
			let rn: number = 0

			// if the buffer has data, read from it.
			if ($.pointerValue<StreamRwc>(s).buf.Len() != 0) {
				let __goscriptTuple0: any = $.pointerValue<StreamRwc>(s).buf.Read(readBuf)
				rn = __goscriptTuple0[0]
				err = __goscriptTuple0[1]
			} else {
				if (n != 0) {
					// if we read data to p already, return now.
					break
				}

				$.pointerValue<StreamRwc>(s).readMsg.Clear()
				{
					let __goscriptShadow0 = await $.pointerValue<Exclude<__goscript_stream.Stream, null>>($.pointerValue<StreamRwc>(s).Stream).MsgRecv($.interfaceValue<__goscript_message.Message>($.pointerValue<StreamRwc>(s)._fields.readMsg, "*srpc.RawMessage"))
					if (__goscriptShadow0 != null) {
						return [n, __goscriptShadow0]
					}
				}
				let data: $.Slice<number> = $.pointerValue<StreamRwc>(s).readMsg.GetData()
				if ($.len(data) == 0) {
					continue
				}

				// read as much as possible directly to the output
				$.copy(readBuf, data)
				if ($.len(data) > $.len(readBuf)) {
					// we read some of the data, buffer the rest.
					rn = $.len(readBuf)
					$.pointerValue<StreamRwc>(s).buf.Write($.goSlice(data, rn, undefined))
				} else {
					// we read all of data
					rn = $.len(data)
				}
			}

			// advance readBuf by rn
			n = n + (rn)
			readBuf = $.goSlice(readBuf, rn, undefined)
		}
		return [n, err]
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: StreamRwc | $.VarRef<StreamRwc> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		$.pointerValue<StreamRwc>(s).writeMsg.SetData(p)
		err = await $.pointerValue<Exclude<__goscript_stream.Stream, null>>($.pointerValue<StreamRwc>(s).Stream).MsgSend($.interfaceValue<__goscript_message.Message>($.pointerValue<StreamRwc>(s)._fields.writeMsg, "*srpc.RawMessage"))
		$.pointerValue<StreamRwc>(s).writeMsg.Clear()
		if (err != null) {
			return [0, err]
		}
		return [$.len(p), null]
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_stream.Stream | null, null>>(this.Stream).Close()
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_stream.Stream | null, null>>(this.Stream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<__goscript_stream.Stream | null, null>>(this.Stream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_stream.Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_stream.Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static __typeInfo = $.registerStructType(
		"srpc.StreamRwc",
		() => new StreamRwc(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }],
		StreamRwc,
		[{ name: "Stream", key: "Stream", type: "srpc.Stream", anonymous: true, index: [0], offset: 0, exported: true }, { name: "buf", key: "buf", type: "bytes.Buffer", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "readMsg", key: "readMsg", type: "srpc.RawMessage", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 56, exported: false }, { name: "writeMsg", key: "writeMsg", type: "srpc.RawMessage", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [3], offset: 88, exported: false }]
	)
}

export function NewStreamRwc(strm: __goscript_stream.Stream | null): StreamRwc | $.VarRef<StreamRwc> | null {
	let rwc: StreamRwc | $.VarRef<StreamRwc> | null = new StreamRwc({Stream: strm})
	$.pointerValue<StreamRwc>(rwc).readMsg.copy = true
	$.pointerValue<StreamRwc>(rwc).writeMsg.copy = true
	return rwc
}
