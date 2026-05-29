// Generated file based on server-pipe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as net from "@goscript/net/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as time from "@goscript/time/index.js"

import type * as __goscript_client from "./client.gs.ts"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import type * as __goscript_muxed from "./muxed.gs.ts"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_packet_rw from "./packet-rw.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import * as __goscript_server from "./server.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import type * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/net/index.js"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "./invoker.gs.ts"
import "./packet-rw.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./server.gs.ts"

export function NewServerPipe(server: __goscript_server.Server | $.VarRef<__goscript_server.Server> | null): ((ctx: context.Context | null, msgHandler: __goscript_packet.PacketDataHandler, closeHandler: __goscript_packet.CloseHandler) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null {
	return $.functionValue(async (ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null): globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]> => {
		let [srvPipe, clientPipe] = net.Pipe()
		queueMicrotask(async () => { await __goscript_server.Server.prototype.HandleStream.call(server, ctx, (srvPipe as io.ReadWriteCloser | null)) })
		let clientPrw: __goscript_packet_rw.PacketReadWriter | $.VarRef<__goscript_packet_rw.PacketReadWriter> | null = __goscript_packet_rw.NewPacketReadWriter((clientPipe as io.ReadWriteCloser | null))
		queueMicrotask(async () => { await __goscript_packet_rw.PacketReadWriter.prototype.ReadPump.call(clientPrw, msgHandler, closeHandler) })
		return [$.interfaceValue<__goscript_writer.PacketWriter | null>(clientPrw, "*srpc.PacketReadWriter"), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: ["error"], results: [] } as $.FunctionTypeInfo)], results: ["srpc.PacketWriter", "error"] } as $.FunctionTypeInfo))
}
