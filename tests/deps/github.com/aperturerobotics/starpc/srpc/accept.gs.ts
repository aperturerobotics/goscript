// Generated file based on accept.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as net from "@goscript/net/index.js"

import * as yamux from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as io from "@goscript/io/index.js"

import type * as time from "@goscript/time/index.js"

import * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import * as __goscript_muxed from "./muxed.gs.ts"

import * as __goscript_muxed_conn from "./muxed-conn.gs.ts"

import * as __goscript_server from "./server.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/context/index.js"
import "@goscript/net/index.js"
import "@goscript/github.com/libp2p/go-yamux/v4/index.js"
import "./invoker.gs.ts"
import "./muxed.gs.ts"
import "./muxed-conn.gs.ts"
import "./server.gs.ts"

export async function AcceptMuxedListener(ctx: context.Context | null, lis: net.Listener | null, srv: __goscript_server.Server | $.VarRef<__goscript_server.Server> | null, yamuxConf: yamux.Config | $.VarRef<yamux.Config> | null): globalThis.Promise<$.GoError> {
	while (true) {
		let [nc, err] = await $.pointerValue<Exclude<net.Listener, null>>(lis).Accept()
		if (err != null) {
			return err
		}

		let __goscriptTuple0: any = await __goscript_muxed_conn.NewMuxedConn(nc, false, yamuxConf)
		let mc = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		if (err != null) {
			await $.pointerValue<Exclude<net.Conn, null>>(nc).Close()
			continue
		}

		{
			let __goscriptShadow0 = await __goscript_server.Server.prototype.AcceptMuxedConn.call(srv, ctx, mc)
			if (__goscriptShadow0 != null) {
				await $.pointerValue<Exclude<net.Conn, null>>(nc).Close()
				continue
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
