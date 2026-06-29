// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_rpcstream from "./rpcstream.gs.ts"

import * as __goscript_rpcstream_pb from "./rpcstream.pb.gs.ts"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "./rpcstream.gs.ts"
import "./rpcstream.pb.gs.ts"

export class RpcStreamWriter {
	public get RpcStream(): __goscript_rpcstream.RpcStream | null {
		return this._fields.RpcStream.value
	}
	public set RpcStream(value: __goscript_rpcstream.RpcStream | null) {
		this._fields.RpcStream.value = value
	}

	public _fields: {
		RpcStream: $.VarRef<__goscript_rpcstream.RpcStream | null>
	}

	constructor(init?: Partial<{RpcStream?: __goscript_rpcstream.RpcStream | null}>) {
		this._fields = {
			RpcStream: $.varRef(init?.RpcStream ?? (null as __goscript_rpcstream.RpcStream | null))
		}
	}

	public clone(): RpcStreamWriter {
		const cloned = new RpcStreamWriter()
		cloned._fields = {
			RpcStream: $.varRef(this._fields.RpcStream.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const r: RpcStreamWriter | $.VarRef<RpcStreamWriter> | null = this
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>($.pointerValue<RpcStreamWriter>(r).RpcStream).CloseSend()
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: RpcStreamWriter | $.VarRef<RpcStreamWriter> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.len(p) == 0) {
			return [0, null]
		}
		err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>($.pointerValue<RpcStreamWriter>(r).RpcStream).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Data({Data: p}), "*rpcstream.RpcStreamPacket_Data")}))
		if (err != null) {
			return [0, err]
		}
		return [$.len(p), null]
	}

	public async WritePacket(p: srpc.Packet | $.VarRef<srpc.Packet> | null): globalThis.Promise<$.GoError> {
		const r: RpcStreamWriter | $.VarRef<RpcStreamWriter> | null = this
		let __goscriptTuple0: any = await srpc.Packet.prototype.MarshalVT.call(p)
		let pktData: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		let __goscriptTuple1: any = await RpcStreamWriter.prototype.Write.call(r, pktData)
		err = __goscriptTuple1[1]
		return err
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).MsgSend(msg)
	}

	public async Recv(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).Recv()
	}

	public async Send(_p0: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream | null, null>>(this.RpcStream).Send(_p0)
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamWriter",
		() => new RpcStreamWriter(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "WritePacket", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseSend", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Context", args: [], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "MsgRecv", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "MsgSend", args: [{ name: "msg", type: "protobuf_go_lite.Message" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Recv", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }, { name: "_r1", type: "error" }] }, { name: "Send", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: "error" }] }],
		RpcStreamWriter,
		[{ name: "RpcStream", key: "RpcStream", type: "rpcstream.RpcStream", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export function NewRpcStreamWriter(rpcStream: __goscript_rpcstream.RpcStream | null): RpcStreamWriter | $.VarRef<RpcStreamWriter> | null {
	return new RpcStreamWriter({RpcStream: rpcStream})
}
