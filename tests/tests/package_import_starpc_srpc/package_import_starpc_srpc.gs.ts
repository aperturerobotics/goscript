// Generated file based on package_import_starpc_srpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

export class handler {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): handler {
		const cloned = new handler()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public GetMethodIDs(): $.Slice<string> {
		return $.arrayToSlice<string>(["method", "stream"])
	}

	public GetServiceID(): string {
		return "svc"
	}

	public async InvokeMethod(serviceID: string, methodID: string, strm: srpc.Stream | null): globalThis.Promise<[boolean, $.GoError]> {
		if ($.stringEqual(methodID, "stream")) {
			let total = 0
			while (true) {
				let msg: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
				let err = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(msg, "*srpc.RawMessage"))
				if ($.comparableEqual(err, io.EOF)) {
					break
				}
				if (err != null) {
					return [true, err]
				}
				total = total + ($.len(srpc.RawMessage.prototype.GetData.call(msg)))
			}
			return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint($.uint(total, 8), 8)]), false), "*srpc.RawMessage"))]
		}
		if (strm == null) {
			return [true, null]
		}
		return [true, await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage(new Uint8Array([111, 107]), false), "*srpc.RawMessage"))]
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		[{ name: "GetMethodIDs", args: [], returns: [] }, { name: "GetServiceID", args: [], returns: [] }, { name: "InvokeMethod", args: [], returns: [] }],
		handler,
		[]
	)
}

export class embeddedStream {
	public get Stream(): srpc.Stream | null {
		return this._fields.Stream.value
	}
	public set Stream(value: srpc.Stream | null) {
		this._fields.Stream.value = value
	}

	public _fields: {
		Stream: $.VarRef<srpc.Stream | null>
	}

	constructor(init?: Partial<{Stream?: srpc.Stream | null}>) {
		this._fields = {
			Stream: $.varRef(init?.Stream ?? null)
		}
	}

	public clone(): embeddedStream {
		const cloned = new embeddedStream()
		cloned._fields = {
			Stream: $.varRef(this._fields.Stream.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Close()
	}

	public async CloseSend(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).CloseSend()
	}

	public Context(): any {
		return $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).Context()
	}

	public async MsgRecv(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgRecv(msg)
	}

	public async MsgSend(msg: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<srpc.Stream | null, null>>(this.Stream).MsgSend(msg)
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedStream",
		() => new embeddedStream(),
		[{ name: "Close", args: [], returns: [] }, { name: "CloseSend", args: [], returns: [] }, { name: "Context", args: [], returns: [] }, { name: "MsgRecv", args: [], returns: [] }, { name: "MsgSend", args: [], returns: [] }],
		embeddedStream,
		[{ name: "Stream", key: "Stream", type: "srpc.Stream", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export async function closeEmbedded(strm: embeddedStream): globalThis.Promise<$.GoError> {
	return await $.pointerValue<Exclude<srpc.Stream, null>>(strm.Stream).CloseSend()
}

export function recvOne(__typeArgs: $.GenericTypeArgs | undefined, strm: srpc.StreamRecv | null): $.GoError {
	let [, err] = $.pointerValue<Exclude<srpc.StreamRecv, null>>(strm).Recv()
	return err
}

export async function main(): globalThis.Promise<void> {
	let mux = srpc.NewMux(null)
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler"))
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).InvokeMethod("svc", "method", null)
	closeEmbedded
	$.functionValue((strm: srpc.StreamRecv | null): $.GoError => recvOne({T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, strm), ({ kind: $.TypeKind.Function, params: ["srpc.StreamRecv"], results: ["error"] } as $.FunctionTypeInfo))
	srpc.NewRawMessage($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), true)
	let server: srpc.Server | $.VarRef<srpc.Server> | null = srpc.NewServer((mux as srpc.Invoker | null))
	let client = srpc.NewClient(srpc.NewServerPipe(server))
	let unaryResp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	let err = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall(context.Background(), "svc", "method", $.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage"), $.interfaceValue<srpc.Message>(unaryResp, "*srpc.RawMessage"))
	if (err != null) {
		$.println("exec error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("exec bytes:", $.len(srpc.RawMessage.prototype.GetData.call(unaryResp)))
	let __goscriptTuple0: any = await $.pointerValue<Exclude<srpc.Client, null>>(client).NewStream(context.Background(), "svc", "stream", null)
	let strm = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		$.println("stream open error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), false), "*srpc.RawMessage"))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgSend($.interfaceValue<srpc.Message>(srpc.NewRawMessage($.arrayToSlice<number>([$.uint(4, 8), $.uint(5, 8)]), false), "*srpc.RawMessage"))
	await $.pointerValue<Exclude<srpc.Stream, null>>(strm).CloseSend()
	let resp: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, false)
	{
		let __goscriptShadow0 = await $.pointerValue<Exclude<srpc.Stream, null>>(strm).MsgRecv($.interfaceValue<srpc.Message>(resp, "*srpc.RawMessage"))
		if (__goscriptShadow0 != null) {
			$.println("stream recv error:", await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
			return
		}
	}
	let data: $.Slice<number> = srpc.RawMessage.prototype.GetData.call(resp)
	if ($.len(data) != 1) {
		$.println("stream response length:", $.len(data))
		return
	}
	$.println("stream bytes:", $.uint(data![0], 8))
	$.println("success: native starpc srpc")
}

if ($.isMainScript(import.meta)) {
	await main()
}
