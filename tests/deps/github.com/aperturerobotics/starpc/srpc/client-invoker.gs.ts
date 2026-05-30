// Generated file based on client-invoker.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as context from "@goscript/context/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_client from "./client.gs.ts"

import type * as __goscript_invoker from "./invoker.gs.ts"

import * as __goscript_message from "./message.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"
import "@goscript/io/index.js"
import "@goscript/context/index.js"
import "./client.gs.ts"
import "./message.gs.ts"
import "./stream.gs.ts"

export class ClientInvoker {
	// client is the client to proxy calls to
	public get client(): __goscript_client.Client | null {
		return this._fields.client.value
	}
	public set client(value: __goscript_client.Client | null) {
		this._fields.client.value = value
	}

	public _fields: {
		client: $.VarRef<__goscript_client.Client | null>
	}

	constructor(init?: Partial<{client?: __goscript_client.Client | null}>) {
		this._fields = {
			client: $.varRef(init?.client ?? null)
		}
	}

	public clone(): ClientInvoker {
		const cloned = new ClientInvoker()
		cloned._fields = {
			client: $.varRef(this._fields.client.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: __goscript_stream.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		const c: ClientInvoker | $.VarRef<ClientInvoker> | null = this
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<ClientInvoker>(c).client == null) {
			return [false, null]
		}

		let ctx = $.pointerValue<Exclude<__goscript_stream.Stream, null>>(strm).Context()

		// Open a stream to the remote
		let [remoteStrm, err] = await $.pointerValue<Exclude<__goscript_client.Client, null>>($.pointerValue<ClientInvoker>(c).client).NewStream(ctx, serviceID, methodID, null)
		if (err != null) {
			return [true, err]
		}
		__defer.defer(async () => { await $.pointerValue<Exclude<__goscript_stream.Stream, null>>(remoteStrm).Close() })

		// Proxy data between the streams
		let errCh = $.makeChannel<$.GoError>(2, null, "both")
		queueMicrotask(async () => { await proxyStreamTo(strm, remoteStrm, errCh) })
		queueMicrotask(async () => { await proxyStreamTo(remoteStrm, strm, errCh) })

		// Wait for both directions to complete
		let outErr: $.GoError = null as $.GoError
		for (let __rangeIndex = 0; __rangeIndex < 2; __rangeIndex++) {
			{
				let __goscriptShadow0 = await $.chanRecv(errCh)
				if (((__goscriptShadow0 != null) && (outErr == null)) && (!$.comparableEqual(__goscriptShadow0, io.EOF))) {
					outErr = __goscriptShadow0
				}
			}
		}
		return [true, outErr]
	}

	static __typeInfo = $.registerStructType(
		"srpc.ClientInvoker",
		() => new ClientInvoker(),
		[{ name: "InvokeMethod", args: [], returns: [] }],
		ClientInvoker,
		[{ name: "client", key: "client", type: "srpc.Client", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }]
	)
}

export function NewClientInvoker(client: __goscript_client.Client | null): ClientInvoker | $.VarRef<ClientInvoker> | null {
	return new ClientInvoker({client: client})
}

export async function proxyStreamTo(src: __goscript_stream.Stream | null, dst: __goscript_stream.Stream | null, errCh: $.Channel<$.GoError> | null): globalThis.Promise<void> {
	let rerr = await ($.functionValue(async (): globalThis.Promise<$.GoError> => {
		let pkt: __goscript_message.RawMessage | $.VarRef<__goscript_message.RawMessage> | null = __goscript_message.NewRawMessage(null, true)
		while (true) {
			let err = await $.pointerValue<Exclude<__goscript_stream.Stream, null>>(src).MsgRecv($.interfaceValue<__goscript_message.Message>(pkt, "*srpc.RawMessage"))
			if (err != null) {
				return err
			}
			// Forward all messages including empty ones (valid for empty proto messages)
			err = await $.pointerValue<Exclude<__goscript_stream.Stream, null>>(dst).MsgSend($.interfaceValue<__goscript_message.Message>(pkt, "*srpc.RawMessage"))
			__goscript_message.RawMessage.prototype.Clear.call(pkt)
			if (err != null) {
				return err
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))()

	if ((rerr != null) && (!$.comparableEqual(rerr, io.EOF))) {
		if (errCh != null) {
			await $.chanSend(errCh, rerr)
		}
		await $.pointerValue<Exclude<__goscript_stream.Stream, null>>(dst).Close()
		return
	}

	rerr = await $.pointerValue<Exclude<__goscript_stream.Stream, null>>(dst).CloseSend()
	if (errCh != null) {
		await $.chanSend(errCh, rerr)
	}
}
