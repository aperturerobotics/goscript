// Generated file based on package_import_starpc_srpc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

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
		$.println("invoked:", serviceID, methodID, strm == null)
		return [true, null]
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		new handler(),
		[{ name: "GetMethodIDs", args: [], returns: [] }, { name: "GetServiceID", args: [], returns: [] }, { name: "InvokeMethod", args: [], returns: [] }],
		handler,
		{}
	)
}

export async function main(): Promise<void> {
	let mux = srpc.NewMux()
	let err = $.pointerValue<Exclude<srpc.Mux, null>>(mux).Register($.interfaceValue<srpc.Handler | null>($.markAsStructValue(new handler()), "main.handler"))
	$.println("registered:", err == null)

	let __goscriptTuple0 = await $.pointerValue<Exclude<srpc.Mux, null>>(mux).InvokeMethod("svc", "method", null)
	let handled = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("handled:", handled, err == null)

	let msg: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage($.arrayToSlice<number>([1, 2, 3]), true)
	let __goscriptTuple1 = $.pointerValue<srpc.RawMessage>(msg).MarshalVT()
	let data = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("raw:", $.len(data), err == null)

	let server: srpc.Server | $.VarRef<srpc.Server> | null = srpc.NewServer($.pointerValue((mux as srpc.Invoker | null)))
	$.println("server:", $.pointerValue<srpc.Server>(server).GetInvoker() != null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
