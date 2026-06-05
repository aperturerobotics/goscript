// Generated file based on proxy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_rpcstream from "./rpcstream.gs.ts"

import * as __goscript_rpcstream_pb from "./rpcstream.pb.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "./errors.gs.ts"
import "./rpcstream.gs.ts"
import "./rpcstream.pb.gs.ts"

export type RpcProxyGetter = ((ctx: context.Context | null, componentID: string) => [__goscript_rpcstream.RpcStreamCaller | null, string, (() => void) | null, $.GoError] | globalThis.Promise<[__goscript_rpcstream.RpcStreamCaller | null, string, (() => void) | null, $.GoError]>) | null

export async function HandleProxyRpcStream(__typeArgs: $.GenericTypeArgs | undefined, stream: __goscript_rpcstream.RpcStream | null, getter: ((ctx: context.Context | null, componentID: string) => [__goscript_rpcstream.RpcStreamCaller | null, string, (() => void) | null, $.GoError] | globalThis.Promise<[__goscript_rpcstream.RpcStreamCaller | null, string, (() => void) | null, $.GoError]>) | null): globalThis.Promise<$.GoError> {
	await using __defer = new $.AsyncDisposableStack()
	// Read the "init" packet.
	let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(stream).Recv()
	let initPkt: __goscript_rpcstream_pb.RpcStreamPacket | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return err
	}
	let __goscriptTuple1: any = $.typeAssertTuple<__goscript_rpcstream_pb.RpcStreamPacket_Init | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Init> | null>(__goscript_rpcstream_pb.RpcStreamPacket.prototype.GetBody.call(initPkt), { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" })
	let initInner: __goscript_rpcstream_pb.RpcStreamPacket_Init | $.VarRef<__goscript_rpcstream_pb.RpcStreamPacket_Init> | null = __goscriptTuple1[0]
	let ok = __goscriptTuple1[1]
	if (!ok || ($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Init>(initInner).Init == null)) {
		return __goscript_errors.ErrUnexpectedPacket
	}

	// lookup the caller for this component id
	let ctx = $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(stream).Context()
	let componentID = __goscript_rpcstream_pb.RpcStreamInit.prototype.GetComponentId.call($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Init>(initInner).Init)
	let __goscriptTuple2: any = await getter!(ctx, componentID)
	let remoteCaller = __goscriptTuple2[0]
	let remoteComponentID = __goscriptTuple2[1]
	let remoteCallerRel: (() => void) | null = __goscriptTuple2[2]
	err = __goscriptTuple2[3]
	if (remoteCallerRel != null) {
		__defer.defer(async () => { await remoteCallerRel!() })
	} else {
		if (err == null) {
			err = __goscript_errors.ErrNoServerForComponent
		}
	}

	// call the remote caller
	let remoteStrm: __goscript_rpcstream.RpcStream | null = null as __goscript_rpcstream.RpcStream | null
	if (err == null) {
		let __goscriptTuple3: any = await remoteCaller!(ctx)
		remoteStrm = (__goscriptTuple3[0] as __goscript_rpcstream.RpcStream | null)
		err = __goscriptTuple3[1]
		if (remoteStrm != null) {
			__defer.defer(async () => { await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(remoteStrm).Close() })
		} else {
			if (err == null) {
				err = __goscript_errors.ErrNoServerForComponent
			}
		}
	}

	// send the init message
	if (err == null) {
		err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(remoteStrm).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Init({Init: new __goscript_rpcstream_pb.RpcStreamInit({ComponentId: remoteComponentID})}), "*rpcstream.RpcStreamPacket_Init")}))
	}

	// send ack, but only if we have an error
	// otherwise: we will proxy the ack from the remote stream.
	if (err != null) {
		let errStr = await $.pointerValue<Exclude<$.GoError, null>>(err).Error()
		await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(stream).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Ack({Ack: new __goscript_rpcstream_pb.RpcAck({Error: errStr})}), "*rpcstream.RpcStreamPacket_Ack")}))
		return err
	}

	let errCh: $.Channel<$.GoError> | null = $.makeChannel<$.GoError>(2, null, "both")
	queueMicrotask(async () => { await copyRpcStreamTo(remoteStrm, stream, errCh) })
	queueMicrotask(async () => { await copyRpcStreamTo(stream, remoteStrm, errCh) })

	// wait for both errors
	let outErr: $.GoError = null as $.GoError
	for (let __rangeIndex = 0; __rangeIndex < 2; __rangeIndex++) {
		{
			let __goscriptShadow0 = await $.chanRecv(errCh)
			if (((__goscriptShadow0 != null) && (outErr == null)) && (!$.comparableEqual(__goscriptShadow0, io.EOF))) {
				outErr = __goscriptShadow0
			}
		}
	}
	return outErr
}

export async function copyRpcStreamTo(s1: __goscript_rpcstream.RpcStream | null, s2: __goscript_rpcstream.RpcStream | null, errCh: $.Channel<$.GoError> | null): globalThis.Promise<void> {
	let rerr = await ($.functionValue(async (): globalThis.Promise<$.GoError> => {
		let pkt: srpc.RawMessage | $.VarRef<srpc.RawMessage> | null = srpc.NewRawMessage(null, true)
		while (true) {
			let err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(s1).MsgRecv($.interfaceValue<srpc.Message>(pkt, "*srpc.RawMessage"))
			if (err != null) {
				return err
			}
			if ($.len(srpc.RawMessage.prototype.GetData.call(pkt)) == 0) {
				continue
			}
			err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(s2).MsgSend($.interfaceValue<srpc.Message>(pkt, "*srpc.RawMessage"))
			srpc.RawMessage.prototype.Clear.call(pkt)
			if (err != null) {
				return err
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))()

	let s1Err = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(s1).Close()
	if ((rerr == null) && (s1Err != null)) {
		rerr = s1Err
	}
	if (rerr != null) {
		if (errCh != null) {
			await $.chanSend(errCh, rerr)
		}
		await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(s2).Close()
		return
	}

	rerr = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(s2).CloseSend()
	if (errCh != null) {
		await $.chanSend(errCh, rerr)
	}
}
