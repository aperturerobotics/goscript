// Generated file based on server.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as broadcast from "@goscript/github.com/aperturerobotics/util/broadcast/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_common_rpc from "./common-rpc.gs.ts"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_muxed from "./muxed.gs.ts"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_packet_rw from "./packet-rw.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import * as __goscript_server_rpc from "./server-rpc.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/github.com/aperturerobotics/util/broadcast/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./common-rpc.gs.ts"
import "./invoker.gs.ts"
import "./muxed.gs.ts"
import "./packet-rw.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./server-rpc.gs.ts"
import "./writer.gs.ts"

export class Server {
	// invoker is the method invoker
	public get invoker(): __goscript_invoker.Invoker | null {
		return this._fields.invoker.value
	}
	public set invoker(value: __goscript_invoker.Invoker | null) {
		this._fields.invoker.value = value
	}

	public _fields: {
		invoker: $.VarRef<__goscript_invoker.Invoker | null>
	}

	constructor(init?: Partial<{invoker?: __goscript_invoker.Invoker | null}>) {
		this._fields = {
			invoker: $.varRef(init?.invoker ?? null)
		}
	}

	public clone(): Server {
		const cloned = new Server()
		cloned._fields = {
			invoker: $.varRef(this._fields.invoker.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AcceptMuxedConn(ctx: context.Context | null, mc: __goscript_muxed.MuxedConn | null): globalThis.Promise<$.GoError> {
		const s: Server | $.VarRef<Server> | null = this
		while (true) {
			{
				let err = $.pointerValue<Exclude<context.Context, null>>(ctx).Err()
				if (err != null) {
					return context.Canceled
				}
			}

			if (await $.pointerValue<Exclude<__goscript_muxed.MuxedConn, null>>(mc).IsClosed()) {
				return io.EOF
			}

			let [muxedStream, err] = await $.pointerValue<Exclude<__goscript_muxed.MuxedConn, null>>(mc).AcceptStream()
			if (err != null) {
				return err
			}
			queueMicrotask(async () => { await Server.prototype.HandleStream.call(s, ctx, (muxedStream as io.ReadWriteCloser | null)) })
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public GetInvoker(): __goscript_invoker.Invoker | null {
		const s: Server | $.VarRef<Server> | null = this
		return $.pointerValue<Server>(s).invoker
	}

	public async HandleStream(ctx: context.Context | null, rwc: io.ReadWriteCloser | null): globalThis.Promise<void> {
		const s: Server | $.VarRef<Server> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let [subCtx, subCtxCancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
		__defer.defer(async () => { await subCtxCancel!() })
		let prw: __goscript_packet_rw.PacketReadWriter | $.VarRef<__goscript_packet_rw.PacketReadWriter> | null = __goscript_packet_rw.NewPacketReadWriter(rwc)
		let serverRPC: __goscript_server_rpc.ServerRPC | $.VarRef<__goscript_server_rpc.ServerRPC> | null = __goscript_server_rpc.NewServerRPC(subCtx, $.pointerValue<Server>(s).invoker, $.interfaceValue<__goscript_writer.PacketWriter | null>(prw, "*srpc.PacketReadWriter"))
		await __goscript_packet_rw.PacketReadWriter.prototype.ReadPump.call(prw, ((__receiver) => (data: $.Slice<number>) => __receiver.HandlePacketData(data))($.pointerValue<__goscript_server_rpc.ServerRPC>(serverRPC)), ((__receiver) => (closeErr: $.GoError) => __receiver.HandleStreamClose(closeErr))($.pointerValue<__goscript_server_rpc.ServerRPC>(serverRPC).commonRPC))
	}

	static __typeInfo = $.registerStructType(
		"srpc.Server",
		() => new Server(),
		[{ name: "AcceptMuxedConn", args: [], returns: [] }, { name: "GetInvoker", args: [], returns: [] }, { name: "HandleStream", args: [], returns: [] }],
		Server,
		{"invoker": "srpc.Invoker"}
	)
}

export function NewServer(invoker: __goscript_invoker.Invoker | null): Server | $.VarRef<Server> | null {
	return new Server({invoker: invoker})
}
