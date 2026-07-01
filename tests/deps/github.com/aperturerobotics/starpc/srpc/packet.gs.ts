// Generated file based on packet.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"
import "./errors.gs.ts"
import "./rpcproto.pb.gs.ts"

export type CloseHandler = ((closeErr: $.GoError) => void) | null

export type PacketHandler = ((pkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null) => $.GoError | globalThis.Promise<$.GoError>) | null

export type PacketDataHandler = ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null

export function NewPacketDataHandler(handler: PacketHandler): ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null {
	return $.functionValue(async (data: $.Slice<number>): globalThis.Promise<$.GoError> => {
		let pkt: __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null = new __goscript_rpcproto_pb.Packet()
		{
			let err = __goscript_rpcproto_pb.Packet.prototype.UnmarshalVT.call(pkt, data)
			if (err != null) {
				return err
			}
		}
		return handler!(pkt)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo))
}

export function NewCallStartPacket(service: string, method: string, data: $.Slice<number>, dataIsZero: boolean): __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null {
	return new __goscript_rpcproto_pb.Packet({Body: $.interfaceValue<__goscript_rpcproto_pb.isPacket_Body | null>(new __goscript_rpcproto_pb.Packet_CallStart({CallStart: new __goscript_rpcproto_pb.CallStart({RpcService: service, RpcMethod: method, Data: data, DataIsZero: dataIsZero})}), "*srpc.Packet_CallStart")})
}

export function NewCallDataPacket(data: $.Slice<number>, dataIsZero: boolean, complete: boolean, err: $.GoError): __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null {
	let errStr: string = ""
	if (err != null) {
		errStr = $.pointerValue<Exclude<$.GoError, null>>(err).Error()
	}
	return new __goscript_rpcproto_pb.Packet({Body: $.interfaceValue<__goscript_rpcproto_pb.isPacket_Body | null>(new __goscript_rpcproto_pb.Packet_CallData({CallData: new __goscript_rpcproto_pb.CallData({Data: data, DataIsZero: dataIsZero, Complete: (err != null) || complete, Error: errStr})}), "*srpc.Packet_CallData")})
}

export function NewCallCancelPacket(): __goscript_rpcproto_pb.Packet | $.VarRef<__goscript_rpcproto_pb.Packet> | null {
	return new __goscript_rpcproto_pb.Packet({Body: $.interfaceValue<__goscript_rpcproto_pb.isPacket_Body | null>(new __goscript_rpcproto_pb.Packet_CallCancel({CallCancel: true}), "*srpc.Packet_CallCancel")})
}
