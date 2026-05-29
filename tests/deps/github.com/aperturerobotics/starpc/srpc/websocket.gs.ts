// Generated file based on websocket.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as websocket from "@goscript/github.com/aperturerobotics/go-websocket/index.js"

import * as yamux from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import type * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import type * as time from "@goscript/time/index.js"

import type * as __goscript_muxed from "./muxed.gs.ts"

import * as __goscript_muxed_conn from "./muxed-conn.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/go-websocket/index.js"
import "@goscript/github.com/libp2p/go-yamux/v4/index.js"
import "@goscript/net/index.js"
import "./muxed-conn.gs.ts"

export async function NewWebSocketConn(ctx: context.Context | null, conn: websocket.Conn | $.VarRef<websocket.Conn> | null, isServer: boolean, yamuxConf: yamux.Config | $.VarRef<yamux.Config> | null): globalThis.Promise<[__goscript_muxed.MuxedConn | null, $.GoError]> {
	let nc = await websocket.NetConn(ctx, conn, websocket.MessageBinary)
	return await __goscript_muxed_conn.NewMuxedConn(nc, !isServer, yamuxConf)
}
