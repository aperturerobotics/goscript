// Generated file based on server-http_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import type * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as __goscript_handler from "./handler.gs.ts"

import type * as __goscript_invoker from "./invoker.gs.ts"

import type * as __goscript_message from "./message.gs.ts"

import type * as __goscript_mux from "./mux.gs.ts"

import type * as __goscript_stream from "./stream.gs.ts"
import "@goscript/errors/index.js"

export class HTTPServer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): HTTPServer {
		const cloned = new HTTPServer()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public ServeHTTP(w: any, r: any): void {
		const s: HTTPServer | $.VarRef<HTTPServer> | null = this
	}

	static __typeInfo = $.registerStructType(
		"srpc.HTTPServer",
		() => new HTTPServer(),
		[{ name: "ServeHTTP", args: [], returns: [] }],
		HTTPServer,
		{}
	)
}

export function NewHTTPServer(mux: __goscript_mux.Mux | null, path: string, websocketOpts: any): [HTTPServer | $.VarRef<HTTPServer> | null, $.GoError] {
	return [null, errors.New("srpc: http server not implemented on js")]
}
