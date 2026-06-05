// Generated file based on raw-stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as bytes from "@goscript/bytes/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as srpc from "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_read_writer from "./read-writer.gs.ts"

import * as __goscript_rpcstream from "./rpcstream.gs.ts"

import * as __goscript_rpcstream_pb from "./rpcstream.pb.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/github.com/aperturerobotics/starpc/srpc/index.js"
import "./errors.gs.ts"
import "./read-writer.gs.ts"
import "./rpcstream.gs.ts"
import "./rpcstream.pb.gs.ts"

export type RpcRawGetter = ((ctx: context.Context | null, componentID: string) => [io.ReadWriteCloser | null, (() => void) | null, $.GoError] | globalThis.Promise<[io.ReadWriteCloser | null, (() => void) | null, $.GoError]>) | null

export async function HandleRawRpcStream(stream: __goscript_rpcstream.RpcStream | null, getter: ((ctx: context.Context | null, componentID: string) => [io.ReadWriteCloser | null, (() => void) | null, $.GoError] | globalThis.Promise<[io.ReadWriteCloser | null, (() => void) | null, $.GoError]>) | null): globalThis.Promise<$.GoError> {
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

	// lookup the server for this component id
	let ctx = $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(stream).Context()
	let componentID = __goscript_rpcstream_pb.RpcStreamInit.prototype.GetComponentId.call($.pointerValue<__goscript_rpcstream_pb.RpcStreamPacket_Init>(initInner).Init)
	let __goscriptTuple2: any = await getter!(ctx, componentID)
	let remoteRwc = __goscriptTuple2[0]
	let remoteRwcRel: (() => void) | null = __goscriptTuple2[1]
	err = __goscriptTuple2[2]
	if ((err == null) && (remoteRwc == null)) {
		err = __goscript_errors.ErrNoServerForComponent
	}
	if (remoteRwcRel != null) {
		__defer.defer(async () => { await remoteRwcRel!() })
	}
	if (remoteRwc != null) {
		__defer.defer(async () => { await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(remoteRwc).Close() })
	}

	// send ack
	let errStr: string = ""
	if (err != null) {
		errStr = await $.pointerValue<Exclude<$.GoError, null>>(err).Error()
	}
	let sendErr = await $.pointerValue<Exclude<__goscript_rpcstream.RpcStream, null>>(stream).Send(new __goscript_rpcstream_pb.RpcStreamPacket({Body: $.interfaceValue<__goscript_rpcstream_pb.isRpcStreamPacket_Body | null>(new __goscript_rpcstream_pb.RpcStreamPacket_Ack({Ack: new __goscript_rpcstream_pb.RpcAck({Error: errStr})}), "*rpcstream.RpcStreamPacket_Ack")}))
	if (err != null) {
		return err
	}
	if (sendErr != null) {
		return sendErr
	}

	// proxy the stream
	// we re-use the rpcstream message framing here.
	// 1 incoming message = 1 outgoing message
	let srw: __goscript_read_writer.RpcStreamReadWriter | $.VarRef<__goscript_read_writer.RpcStreamReadWriter> | null = __goscript_read_writer.NewRpcStreamReadWriter(stream)
	let errCh: $.Channel<$.GoError> | null = $.makeChannel<$.GoError>(2, null, "both")
	queueMicrotask(async () => { await copyRwcTo(remoteRwc, $.interfaceValue<io.ReadWriteCloser | null>(srw, "*rpcstream.RpcStreamReadWriter"), errCh) })
	queueMicrotask(async () => { await copyRwcTo($.interfaceValue<io.ReadWriteCloser | null>(srw, "*rpcstream.RpcStreamReadWriter"), remoteRwc, errCh) })

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

export async function copyRwcTo(s1: io.ReadWriteCloser | null, s2: io.ReadWriteCloser | null, errCh: $.Channel<$.GoError> | null): globalThis.Promise<void> {
	let buf: $.Slice<number> = $.makeSlice<number>(8192, undefined, "byte")
	let [, err] = await io.CopyBuffer($.pointerValueOrNil((s2 as io.Writer | null))!, $.pointerValueOrNil((s1 as io.Reader | null))!, buf)
	await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(s1).Close()
	await $.pointerValue<Exclude<io.ReadWriteCloser, null>>(s2).Close()
	if (errCh != null) {
		await $.chanSend(errCh, err)
	}
}
