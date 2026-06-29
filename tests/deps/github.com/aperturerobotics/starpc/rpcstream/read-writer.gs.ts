// Generated file based on read-writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_rpcstream from "./rpcstream.gs.ts"

import * as __goscript_rpcstream_pb from "./rpcstream.pb.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "./rpcstream.gs.ts"
import "./rpcstream.pb.gs.ts"

export class RpcStreamReadWriter {
	// stream is the RpcStream
	public get stream(): __goscript_rpcstream.RpcStream | null {
		return this._fields.stream.value
	}
	public set stream(value: __goscript_rpcstream.RpcStream | null) {
		this._fields.stream.value = value
	}

	// buf is the incoming data buffer
	public get buf(): bytes.Buffer {
		return this._fields.buf.value
	}
	public set buf(value: bytes.Buffer) {
		this._fields.buf.value = value
	}

	public _fields: {
		stream: $.VarRef<__goscript_rpcstream.RpcStream | null>
		buf: $.VarRef<bytes.Buffer>
	}

	constructor(init?: Partial<{stream?: __goscript_rpcstream.RpcStream | null, buf?: bytes.Buffer}>) {
		this._fields = {
			stream: $.varRef(init?.stream ?? (null as __goscript_rpcstream.RpcStream | null)),
			buf: $.varRef(init?.buf ? $.markAsStructValue($.cloneStructValue(init.buf)) : $.markAsStructValue(new bytes.Buffer()))
		}
	}

	public clone(): RpcStreamReadWriter {
		const cloned = new RpcStreamReadWriter()
		cloned._fields = {
			stream: $.varRef(this._fields.stream.value),
			buf: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.buf.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const r: RpcStreamReadWriter | $.VarRef<RpcStreamReadWriter> | null = this
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>($.pointerValue<RpcStreamReadWriter>(r).stream).Close()
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: RpcStreamReadWriter | $.VarRef<RpcStreamReadWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let readBuf: $.Slice<number> = p
		while (($.len(readBuf) != 0) && (err == null)) {
			let rn: number = 0

			// if the buffer has data, read from it.
			if ($.pointerValue<RpcStreamReadWriter>(r).buf.Len() != 0) {
				let __goscriptTuple0: any = $.pointerValue<RpcStreamReadWriter>(r).buf.Read(readBuf)
				rn = __goscriptTuple0[0]
				err = __goscriptTuple0[1]
			} else {
				if (n != 0) {
					// if we read data to p already, return now.
					break
				}

				let pkt: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null = null as __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null
				let __goscriptTuple1: any = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>($.pointerValue<RpcStreamReadWriter>(r).stream).Recv()
				pkt = __goscriptTuple1[0]
				err = __goscriptTuple1[1]
				if (err != null) {
					break
				}

				{
					let errStr = __goscript_rpcstream_pb.RpcAck.prototype.GetError.call(__goscript_rpcstream_pb.RpcStreamPacket.prototype.GetAck.call(pkt))
					if (!$.stringEqual(errStr, "")) {
						return [n, errors.New(errStr)]
					}
				}

				let data: $.Slice<number> = __goscript_rpcstream_pb.RpcStreamPacket.prototype.GetData.call(pkt)
				if ($.len(data) == 0) {
					continue
				}

				// read as much as possible directly to the output
				rn = $.copy(readBuf, data)
				if (rn < $.len(data)) {
					// we read some of the data, buffer the rest.
					$.pointerValue<RpcStreamReadWriter>(r).buf.Write($.goSlice(data, rn, undefined))
				}
			}

			// advance readBuf by rn
			n = n + (rn)
			readBuf = $.goSlice(readBuf, rn, undefined)
		}
		return [n, err]
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: RpcStreamReadWriter | $.VarRef<RpcStreamReadWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.len(p) == 0) {
			return [0, null]
		}
		err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>($.pointerValue<RpcStreamReadWriter>(r).stream).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Data({Data: p}), "*rpcstream.RpcStreamPacket_Data")}))
		if (err != null) {
			return [0, err]
		}
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamReadWriter",
		() => new RpcStreamReadWriter(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		RpcStreamReadWriter,
		[{ name: "stream", key: "stream", type: "rpcstream.RpcStream", pkgPath: "github.com/aperturerobotics/starpc/rpcstream", index: [0], offset: 0, exported: false }, { name: "buf", key: "buf", type: "bytes.Buffer", pkgPath: "github.com/aperturerobotics/starpc/rpcstream", index: [1], offset: 16, exported: false }]
	)
}

export function NewRpcStreamReadWriter(stream: __goscript_rpcstream.RpcStream | null): RpcStreamReadWriter | $.VarRef<RpcStreamReadWriter> | null {
	return new RpcStreamReadWriter({stream: stream})
}

export async function ReadPump(strm: __goscript_rpcstream.RpcStream | null, cb: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closed: ((closeErr: $.GoError) => void) | null): globalThis.Promise<void> {
	let err = await ReadToHandler(strm, cb)
	// signal that the stream is now closed.
	if (closed != null) {
		await closed!(err)
	}
}

export async function ReadToHandler(strm: __goscript_rpcstream.RpcStream | null, cb: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	while (true) {
		// read packet
		let __goscriptTuple2: any = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(strm).Recv()
		let pkt: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			return err
		}

		let data: $.Slice<number> = __goscript_rpcstream_pb.RpcStreamPacket.prototype.GetData.call(pkt)
		if ($.len(data) == 0) {
			continue
		}

		// call handler
		{
			let __goscriptShadow0 = await cb!(data)
			if (__goscriptShadow0 != null) {
				return __goscriptShadow0
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
