// Generated file based on addr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as net from "@goscript/net/index.js"

import type * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as log from "@goscript/log/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import type * as __goscript__const from "./const.gs.ts"

import * as __goscript_deadline from "./deadline.gs.ts"

import * as __goscript_mux from "./mux.gs.ts"

import * as __goscript_ping from "./ping.gs.ts"

import * as __goscript_session from "./session.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_util from "./util.gs.ts"
import "@goscript/fmt/index.js"
import "@goscript/net/index.js"
import "@goscript/io/index.js"
import "@goscript/log/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./deadline.gs.ts"
import "./mux.gs.ts"
import "./ping.gs.ts"
import "./session.gs.ts"
import "./stream.gs.ts"
import "./util.gs.ts"

export class yamuxAddr {
	public get Addr(): string {
		return this._fields.Addr.value
	}
	public set Addr(value: string) {
		this._fields.Addr.value = value
	}

	public _fields: {
		Addr: $.VarRef<string>
	}

	constructor(init?: Partial<{Addr?: string}>) {
		this._fields = {
			Addr: $.varRef(init?.Addr ?? "")
		}
	}

	public clone(): yamuxAddr {
		const cloned = new yamuxAddr()
		cloned._fields = {
			Addr: $.varRef(this._fields.Addr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		return "yamux"
	}

	public String(): string {
		const y: yamuxAddr | $.VarRef<yamuxAddr> | null = this
		return fmt.Sprintf("yamux:%s", $.pointerValue<yamuxAddr>(y).Addr)
	}

	static __typeInfo = $.registerStructType(
		"yamux.yamuxAddr",
		() => new yamuxAddr(),
		[{ name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		yamuxAddr,
		{"Addr": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export type hasAddr = {
	LocalAddr(): net.Addr | null
	RemoteAddr(): net.Addr | null
}

$.registerInterfaceType(
	"yamux.hasAddr",
	null,
	[{ name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }]
)
