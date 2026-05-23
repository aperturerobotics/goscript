// Generated file based on package_import_starpc_srpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as io from "@goscript/io/index.js"

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
		return $.arrayToSlice<string>(["method"])
	}

	public GetServiceID(): string {
		return "svc"
	}

	public InvokeMethod(serviceID: string, methodID: string, strm: srpc.Stream | null): [boolean, $.GoError] {
		return [true, null]
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		[{ name: "GetMethodIDs", args: [], returns: [] }, { name: "GetServiceID", args: [], returns: [] }, { name: "InvokeMethod", args: [], returns: [] }],
		handler,
		{}
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

	static __typeInfo = $.registerStructType(
		"main.embeddedStream",
		() => new embeddedStream(),
		[],
		embeddedStream,
		{"Stream": "srpc.Stream"}
	)
}

export async function closeEmbedded(strm: embeddedStream): globalThis.Promise<$.GoError> {
	return await $.pointerValue<Exclude<srpc.Stream, null>>(strm.Stream).CloseSend()
}

export async function recvOne(__typeArgs: $.GenericTypeArgs | undefined, strm: srpc.StreamRecv<any> | null): globalThis.Promise<$.GoError> {
	let [, err] = await $.pointerValue<Exclude<srpc.StreamRecv<any>, null>>(strm).Recv()
	return err
}

export async function main(): globalThis.Promise<void> {
	let mux = srpc.NewMux()
	$.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler"))
	await $.pointerValue<Exclude<srpc.Mux, null>>(mux).InvokeMethod("svc", "method", null)
	closeEmbedded
	$.functionValue(async (strm: srpc.StreamRecv<any> | null): globalThis.Promise<$.GoError> => await recvOne({T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, strm), { kind: $.TypeKind.Function, params: ["srpc.StreamRecv"], results: ["error"] })
	srpc.NewRawMessage($.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), true)
	let server: srpc.Server | $.VarRef<srpc.Server> | null = srpc.NewServer($.pointerValue((mux as srpc.Invoker | null)))
	let client = srpc.NewClient(srpc.NewServerPipe(server))
	let err = await $.pointerValue<Exclude<srpc.Client, null>>(client).ExecCall($.pointerValue(context.Background()), "svc", "method", $.pointerValue($.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage")), $.pointerValue($.interfaceValue<srpc.Message>(srpc.NewRawMessage(null, false), "*srpc.RawMessage")))
	if (err != null) {
		$.println("exec error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let prw: srpc.PacketReadWriter | $.VarRef<srpc.PacketReadWriter> | null = srpc.NewPacketReadWriter(null)
	$.pointerValue<srpc.PacketReadWriter>(prw).ReadPump((null as srpc.PacketDataHandler), (null as srpc.CloseHandler))
	$.pointerValue<srpc.PacketReadWriter>(prw).ReadToHandler((null as srpc.PacketDataHandler))
	$.println("success: starpc srpc override")
}

if ($.isMainScript(import.meta)) {
	await main()
}
