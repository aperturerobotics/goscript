// Generated file based on muxed-conn.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as net from "@goscript/net/index.js"

import * as yamux from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_client from "./client.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_muxed from "./muxed.gs.ts"

import * as __goscript_muxed_yamux from "./muxed-yamux.gs.ts"

import type * as __goscript_packet from "./packet.gs.ts"

import * as __goscript_packet_rw from "./packet-rw.gs.ts"

import * as __goscript_rpcproto_pb from "./rpcproto.pb.gs.ts"

import * as __goscript_rwc_conn from "./rwc-conn.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"

import type * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/net/index.js"
import "@goscript/github.com/libp2p/go-yamux/v4/index.js"
import "@goscript/bytes/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./client.gs.ts"
import "./muxed.gs.ts"
import "./muxed-yamux.gs.ts"
import "./packet-rw.gs.ts"
import "./rpcproto.pb.gs.ts"
import "./rwc-conn.gs.ts"

export function NewYamuxConfig(): yamux.Config | $.VarRef<yamux.Config> | null {
	let config: yamux.Config | $.VarRef<yamux.Config> | null = yamux.DefaultConfig()
	$.pointerValue<yamux.Config>(config).MaxStreamWindowSize = $.uint((16 * 1024) * 1024, 32)
	$.pointerValue<yamux.Config>(config).LogOutput = io.Discard
	$.pointerValue<yamux.Config>(config).ReadBufSize = 0
	$.pointerValue<yamux.Config>(config).MaxIncomingStreams = $.uint(math.MaxUint32, 32)
	$.pointerValue<yamux.Config>(config).AcceptBacklog = 512
	$.pointerValue<yamux.Config>(config).EnableKeepAlive = false
	return config
}

export async function NewMuxedConn(conn: net.Conn | null, outbound: boolean, yamuxConf: yamux.Config | $.VarRef<yamux.Config> | null): globalThis.Promise<[__goscript_muxed.MuxedConn | null, $.GoError]> {
	if (yamuxConf == null) {
		yamuxConf = NewYamuxConfig()
	}

	let sess: yamux.Session | $.VarRef<yamux.Session> | null = null as yamux.Session | $.VarRef<yamux.Session> | null
	let err: $.GoError = null as $.GoError
	if (outbound) {
		let __goscriptTuple0: any = await yamux.Client(conn, yamuxConf, (null as (() => [yamux.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux.MemoryManager | null, $.GoError]>) | null))
		sess = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
	} else {
		let __goscriptTuple1: any = await yamux.Server(conn, yamuxConf, (null as (() => [yamux.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux.MemoryManager | null, $.GoError]>) | null))
		sess = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
	}
	if (err != null) {
		return [null, err]
	}

	return [__goscript_muxed_yamux.newYamuxConn(sess), null]
}

export async function NewMuxedConnWithRwc(ctx: context.Context | null, rwc: io.ReadWriteCloser | null, outbound: boolean, yamuxConf: yamux.Config | $.VarRef<yamux.Config> | null): globalThis.Promise<[__goscript_muxed.MuxedConn | null, $.GoError]> {
	return await NewMuxedConn($.interfaceValue<net.Conn | null>(await __goscript_rwc_conn.NewRwcConn(ctx, rwc, null, null, 10), "*srpc.RwcConn"), outbound, yamuxConf)
}

export async function NewClientWithConn(conn: net.Conn | null, outbound: boolean, yamuxConf: yamux.Config | $.VarRef<yamux.Config> | null): globalThis.Promise<[__goscript_client.Client | null, $.GoError]> {
	let [mconn, err] = await NewMuxedConn(conn, outbound, yamuxConf)
	if (err != null) {
		return [null, err]
	}
	return [NewClientWithMuxedConn(mconn), null]
}

export function NewClientWithMuxedConn(conn: __goscript_muxed.MuxedConn | null): __goscript_client.Client | null {
	let openStreamFn: ((ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null = NewOpenStreamWithMuxedConn(conn)
	return __goscript_client.NewClient(openStreamFn)
}

export function NewOpenStreamWithMuxedConn(conn: __goscript_muxed.MuxedConn | null): ((ctx: context.Context | null, msgHandler: __goscript_packet.PacketDataHandler, closeHandler: __goscript_packet.CloseHandler) => [__goscript_writer.PacketWriter | null, $.GoError] | globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]>) | null {
	return $.functionValue(async (ctx: context.Context | null, msgHandler: ((data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null, closeHandler: ((closeErr: $.GoError) => void) | null): globalThis.Promise<[__goscript_writer.PacketWriter | null, $.GoError]> => {
		let [mstrm, err] = await $.pointerValue<Exclude<__goscript_muxed.MuxedConn, null>>(conn).OpenStream(ctx)
		if (err != null) {
			// If the error is a timeout, context may be canceled.
			// Prefer the context canceled error (yamux returns timeout for context cancel.)
			let [timeoutErr, ok] = $.typeAssertTuple<any>(err, { kind: $.TypeKind.Interface, methods: [{ name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })
			if ((ok && $.pointerValue<any>(timeoutErr).Timeout()) && (await $.pointerValue<Exclude<context.Context, null>>(ctx).Err() != null)) {
				return [null, context.Canceled]
			}
			return [null, err]
		}
		let rw: __goscript_packet_rw.PacketReadWriter | $.VarRef<__goscript_packet_rw.PacketReadWriter> | null = __goscript_packet_rw.NewPacketReadWriter((mstrm as io.ReadWriteCloser | null))
		queueMicrotask(async () => { await __goscript_packet_rw.PacketReadWriter.prototype.ReadPump.call(rw, msgHandler, closeHandler) })
		return [$.interfaceValue<__goscript_writer.PacketWriter | null>(rw, "*srpc.PacketReadWriter"), null]
	}, ({ kind: $.TypeKind.Function, params: ["context.Context", ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo), ({ kind: $.TypeKind.Function, params: ["error"], results: [] } as $.FunctionTypeInfo)], results: ["srpc.PacketWriter", "error"] } as $.FunctionTypeInfo))
}
