// Generated file based on net.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as net from "@goscript/net/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as yamux from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import type * as io from "@goscript/io/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_accept from "./accept.gs.ts"

import type * as __goscript_client from "./client.gs.ts"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_muxed from "./muxed.gs.ts"

import * as __goscript_muxed_conn from "./muxed-conn.gs.ts"

import type * as __goscript_server from "./server.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/net/index.js"
import "./accept.gs.ts"
import "./invoker.gs.ts"
import "./muxed.gs.ts"
import "./muxed-conn.gs.ts"

export async function Dial(addr: string): globalThis.Promise<[__goscript_client.Client | null, $.GoError]> {
	let [nconn, err] = await net.Dial("tcp", addr)
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple0: any = await __goscript_muxed_conn.NewMuxedConn(nconn, false, null)
	let muxedConn = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [__goscript_muxed_conn.NewClientWithMuxedConn(muxedConn), null]
}

export async function Listen(ctx: context.Context | null, addr: string, srv: __goscript_server.Server | $.VarRef<__goscript_server.Server> | null, errCh: $.Channel<$.GoError> | null): globalThis.Promise<$.GoError> {
	let [lis, err] = await net.Listen("tcp", addr)
	if (err != null) {
		return err
	}

	let listenErrCh: $.Channel<$.GoError> | null = $.makeChannel<$.GoError>(1, null, "both")
	queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
		await $.chanSend(listenErrCh, await __goscript_accept.AcceptMuxedListener(ctx, lis, srv, null))
		await $.pointerValue<Exclude<net.Listener, null>>(lis).Close()
	})() })

	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
		{
			id: 0,
			isSend: false,
			channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect0Result) => {
				return context.Canceled
			}
		},
		{
			id: 1,
			isSend: false,
			channel: errCh,
			onSelected: async (__goscriptSelect0Result) => {
				let err = __goscriptSelect0Result.value
				return err
			}
		},
		{
			id: 2,
			isSend: false,
			channel: listenErrCh,
			onSelected: async (__goscriptSelect0Result) => {
				let err = __goscriptSelect0Result.value
				return err
			}
		}
	], false)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
	throw new Error("unreachable select")
	throw new globalThis.Error("goscript: unreachable return")
}
