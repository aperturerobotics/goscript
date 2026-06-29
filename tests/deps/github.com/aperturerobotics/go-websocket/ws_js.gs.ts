// Generated file based on ws_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as js from "@goscript/syscall/js/index.js"

import * as bpool from "@goscript/github.com/aperturerobotics/go-websocket/internal/bpool/index.js"

import * as wsjs from "@goscript/github.com/aperturerobotics/go-websocket/internal/wsjs/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_stringer from "./stringer.gs.ts"
import "@goscript/strconv/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/reflect/index.js"
import "@goscript/runtime/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/syscall/js/index.js"
import "@goscript/github.com/aperturerobotics/go-websocket/internal/bpool/index.js"
import "@goscript/github.com/aperturerobotics/go-websocket/internal/wsjs/index.js"
import "./errors.gs.ts"
import "./stringer.gs.ts"

export type StatusCode = number

export type CompressionMode = number

export type MessageType = number

export class noCopy {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): noCopy {
		const cloned = new noCopy()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Lock(): void {
	}

	static __typeInfo = $.registerStructType(
		"websocket.noCopy",
		() => new noCopy(),
		[{ name: "Lock", args: [], returns: [] }],
		noCopy,
		[]
	)
}

export class Conn {
	public get noCopy(): noCopy {
		return this._fields.noCopy.value
	}
	public set noCopy(value: noCopy) {
		this._fields.noCopy.value = value
	}

	public get ws(): wsjs.WebSocket {
		return this._fields.ws.value
	}
	public set ws(value: wsjs.WebSocket) {
		this._fields.ws.value = value
	}

	// read limit for a message in bytes.
	public get msgReadLimit(): atomic.Int64 {
		return this._fields.msgReadLimit.value
	}
	public set msgReadLimit(value: atomic.Int64) {
		this._fields.msgReadLimit.value = value
	}

	public get closeReadMu(): sync.Mutex {
		return this._fields.closeReadMu.value
	}
	public set closeReadMu(value: sync.Mutex) {
		this._fields.closeReadMu.value = value
	}

	public get closeReadCtx(): context.Context | null {
		return this._fields.closeReadCtx.value
	}
	public set closeReadCtx(value: context.Context | null) {
		this._fields.closeReadCtx.value = value
	}

	public get closingMu(): sync.Mutex {
		return this._fields.closingMu.value
	}
	public set closingMu(value: sync.Mutex) {
		this._fields.closingMu.value = value
	}

	public get closeOnce(): sync.Once {
		return this._fields.closeOnce.value
	}
	public set closeOnce(value: sync.Once) {
		this._fields.closeOnce.value = value
	}

	public get closed(): $.Channel<{}> | null {
		return this._fields.closed.value
	}
	public set closed(value: $.Channel<{}> | null) {
		this._fields.closed.value = value
	}

	public get closeErrOnce(): sync.Once {
		return this._fields.closeErrOnce.value
	}
	public set closeErrOnce(value: sync.Once) {
		this._fields.closeErrOnce.value = value
	}

	public get closeErr(): $.GoError {
		return this._fields.closeErr.value
	}
	public set closeErr(value: $.GoError) {
		this._fields.closeErr.value = value
	}

	public get closeWasClean(): boolean {
		return this._fields.closeWasClean.value
	}
	public set closeWasClean(value: boolean) {
		this._fields.closeWasClean.value = value
	}

	public get releaseOnClose(): (() => void) | null {
		return this._fields.releaseOnClose.value
	}
	public set releaseOnClose(value: (() => void) | null) {
		this._fields.releaseOnClose.value = value
	}

	public get releaseOnError(): (() => void) | null {
		return this._fields.releaseOnError.value
	}
	public set releaseOnError(value: (() => void) | null) {
		this._fields.releaseOnError.value = value
	}

	public get releaseOnMessage(): (() => void) | null {
		return this._fields.releaseOnMessage.value
	}
	public set releaseOnMessage(value: (() => void) | null) {
		this._fields.releaseOnMessage.value = value
	}

	public get readSignal(): $.Channel<{}> | null {
		return this._fields.readSignal.value
	}
	public set readSignal(value: $.Channel<{}> | null) {
		this._fields.readSignal.value = value
	}

	public get readBufMu(): sync.Mutex {
		return this._fields.readBufMu.value
	}
	public set readBufMu(value: sync.Mutex) {
		this._fields.readBufMu.value = value
	}

	public get readBuf(): $.Slice<wsjs.MessageEvent> {
		return this._fields.readBuf.value
	}
	public set readBuf(value: $.Slice<wsjs.MessageEvent>) {
		this._fields.readBuf.value = value
	}

	public _fields: {
		noCopy: $.VarRef<noCopy>
		ws: $.VarRef<wsjs.WebSocket>
		msgReadLimit: $.VarRef<atomic.Int64>
		closeReadMu: $.VarRef<sync.Mutex>
		closeReadCtx: $.VarRef<context.Context | null>
		closingMu: $.VarRef<sync.Mutex>
		closeOnce: $.VarRef<sync.Once>
		closed: $.VarRef<$.Channel<{}> | null>
		closeErrOnce: $.VarRef<sync.Once>
		closeErr: $.VarRef<$.GoError>
		closeWasClean: $.VarRef<boolean>
		releaseOnClose: $.VarRef<(() => void) | null>
		releaseOnError: $.VarRef<(() => void) | null>
		releaseOnMessage: $.VarRef<(() => void) | null>
		readSignal: $.VarRef<$.Channel<{}> | null>
		readBufMu: $.VarRef<sync.Mutex>
		readBuf: $.VarRef<$.Slice<wsjs.MessageEvent>>
	}

	constructor(init?: Partial<{noCopy?: noCopy, ws?: wsjs.WebSocket, msgReadLimit?: atomic.Int64, closeReadMu?: sync.Mutex, closeReadCtx?: context.Context | null, closingMu?: sync.Mutex, closeOnce?: sync.Once, closed?: $.Channel<{}> | null, closeErrOnce?: sync.Once, closeErr?: $.GoError, closeWasClean?: boolean, releaseOnClose?: (() => void) | null, releaseOnError?: (() => void) | null, releaseOnMessage?: (() => void) | null, readSignal?: $.Channel<{}> | null, readBufMu?: sync.Mutex, readBuf?: $.Slice<wsjs.MessageEvent>}>) {
		this._fields = {
			noCopy: $.varRef(init?.noCopy ? $.markAsStructValue($.cloneStructValue(init.noCopy)) : $.markAsStructValue(new noCopy())),
			ws: $.varRef(init?.ws ? $.markAsStructValue($.cloneStructValue(init.ws)) : $.markAsStructValue(new wsjs.WebSocket())),
			msgReadLimit: $.varRef(init?.msgReadLimit ? $.markAsStructValue($.cloneStructValue(init.msgReadLimit)) : $.markAsStructValue(new atomic.Int64())),
			closeReadMu: $.varRef(init?.closeReadMu ? $.markAsStructValue($.cloneStructValue(init.closeReadMu)) : $.markAsStructValue(new sync.Mutex())),
			closeReadCtx: $.varRef(init?.closeReadCtx ?? (null as context.Context | null)),
			closingMu: $.varRef(init?.closingMu ? $.markAsStructValue($.cloneStructValue(init.closingMu)) : $.markAsStructValue(new sync.Mutex())),
			closeOnce: $.varRef(init?.closeOnce ? $.markAsStructValue($.cloneStructValue(init.closeOnce)) : $.markAsStructValue(new sync.Once())),
			closed: $.varRef(init?.closed ?? (null as $.Channel<{}> | null)),
			closeErrOnce: $.varRef(init?.closeErrOnce ? $.markAsStructValue($.cloneStructValue(init.closeErrOnce)) : $.markAsStructValue(new sync.Once())),
			closeErr: $.varRef(init?.closeErr ?? (null as $.GoError)),
			closeWasClean: $.varRef(init?.closeWasClean ?? (false as boolean)),
			releaseOnClose: $.varRef(init?.releaseOnClose ?? (null as (() => void) | null)),
			releaseOnError: $.varRef(init?.releaseOnError ?? (null as (() => void) | null)),
			releaseOnMessage: $.varRef(init?.releaseOnMessage ?? (null as (() => void) | null)),
			readSignal: $.varRef(init?.readSignal ?? (null as $.Channel<{}> | null)),
			readBufMu: $.varRef(init?.readBufMu ? $.markAsStructValue($.cloneStructValue(init.readBufMu)) : $.markAsStructValue(new sync.Mutex())),
			readBuf: $.varRef(init?.readBuf ?? (null as $.Slice<wsjs.MessageEvent>))
		}
	}

	public clone(): Conn {
		const cloned = new Conn()
		cloned._fields = {
			noCopy: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.noCopy.value))),
			ws: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ws.value))),
			msgReadLimit: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.msgReadLimit.value))),
			closeReadMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closeReadMu.value))),
			closeReadCtx: $.varRef(this._fields.closeReadCtx.value),
			closingMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closingMu.value))),
			closeOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closeOnce.value))),
			closed: $.varRef(this._fields.closed.value),
			closeErrOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.closeErrOnce.value))),
			closeErr: $.varRef(this._fields.closeErr.value),
			closeWasClean: $.varRef(this._fields.closeWasClean.value),
			releaseOnClose: $.varRef(this._fields.releaseOnClose.value),
			releaseOnError: $.varRef(this._fields.releaseOnError.value),
			releaseOnMessage: $.varRef(this._fields.releaseOnMessage.value),
			readSignal: $.varRef(this._fields.readSignal.value),
			readBufMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readBufMu.value))),
			readBuf: $.varRef(this._fields.readBuf.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(code: StatusCode, reason: string): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		let err = await Conn.prototype.exportedClose.call(c, code, reason)
		if (err != null) {
			return fmt.Errorf("failed to close WebSocket: %w", (err as any))
		}
		return null
	}

	public async CloseNow(): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		return await Conn.prototype.Close.call(c, 1001, "")
	}

	public async CloseRead(ctx: context.Context | null): globalThis.Promise<context.Context | null> {
		let c: Conn | $.VarRef<Conn> | null = this
		await $.pointerValue<Conn>(c).closeReadMu.Lock()
		let ctx2 = $.pointerValue<Conn>(c).closeReadCtx
		if (ctx2 != null) {
			$.pointerValue<Conn>(c).closeReadMu.Unlock()
			return ctx2
		}
		let __goscriptTuple0: any = context.WithCancel($.pointerValueOrNil(ctx)!)
		ctx = __goscriptTuple0[0]
		let cancel = __goscriptTuple0[1]
		$.pointerValue<Conn>(c).closeReadCtx = ctx
		$.pointerValue<Conn>(c).closeReadMu.Unlock()

		queueMicrotask(async () => { await (async (): globalThis.Promise<void> => {
			await using __defer = new $.AsyncDisposableStack()
			__defer.defer(async () => { await cancel!() })
			__defer.defer(async () => { await Conn.prototype.CloseNow.call(c) })
			let [, , err] = await Conn.prototype.read.call(c, ctx)
			if (err != null) {
				await Conn.prototype.Close.call(c, 1008, "unexpected data message")
			}
		})() })
		return ctx
	}

	public Ping(ctx: context.Context | null): $.GoError {
		const c: Conn | $.VarRef<Conn> | null = this
		return null
	}

	public async Read(ctx: context.Context | null): globalThis.Promise<[MessageType, $.Slice<number>, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		await $.pointerValue<Conn>(c).closeReadMu.Lock()
		let closedRead = $.pointerValue<Conn>(c).closeReadCtx != null
		$.pointerValue<Conn>(c).closeReadMu.Unlock()
		if (closedRead) {
			return [0, null, errors.New("WebSocket connection read closed")]
		}

		let __goscriptTuple1: any = await Conn.prototype.read.call(c, ctx)
		let typ = __goscriptTuple1[0]
		let p: $.Slice<number> = __goscriptTuple1[1]
		let err = __goscriptTuple1[2]
		if (err != null) {
			return [0, null, fmt.Errorf("failed to read: %w", (err as any))]
		}
		let readLimit = $.pointerValue<Conn>(c).msgReadLimit.Load()
		if ((readLimit >= 0) && ($.int64($.len(p)) > readLimit)) {
			let reason = fmt.Errorf("read limited at %d bytes", $.namedValueInterfaceValue<any>($.pointerValue<Conn>(c).msgReadLimit.Load(), "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }))
			await Conn.prototype.Close.call(c, 1009, $.pointerValue<Exclude<$.GoError, null>>(reason).Error())
			return [0, null, fmt.Errorf("%w: %v", (__goscript_errors.ErrMessageTooBig as any), (reason as any))]
		}
		return [typ, p, null]
	}

	public async Reader(ctx: context.Context | null): globalThis.Promise<[MessageType, io.Reader | null, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		let __goscriptTuple2: any = await Conn.prototype.Read.call(c, ctx)
		let typ = __goscriptTuple2[0]
		let p: $.Slice<number> = __goscriptTuple2[1]
		let err = __goscriptTuple2[2]
		if (err != null) {
			return [0, null, err]
		}
		return [typ, $.interfaceValue<io.Reader | null>(bytes.NewReader(p), "*bytes.Reader"), null]
	}

	public SetReadLimit(n: bigint): void {
		const c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<Conn>(c).msgReadLimit.Store(n)
	}

	public Subprotocol(): string {
		const c: Conn | $.VarRef<Conn> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).Subprotocol()
	}

	public async Write(ctx: context.Context | null, typ: MessageType, p: $.Slice<number>): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		let err = await Conn.prototype.write.call(c, typ, p)
		if (err != null) {
			// Have to ensure the WebSocket is closed after a write error
			// to match the Go API. It can only error if the message type
			// is unexpected or the passed bytes contain invalid UTF-8 for
			// MessageText.
			let __goscriptShadow0 = err
			let __goscriptShadow1 = fmt.Errorf("failed to write: %w", (__goscriptShadow0 as any))
			await Conn.prototype.setCloseErr.call(c, __goscriptShadow1)
			await Conn.prototype.closeWithInternal.call(c)
			return __goscriptShadow1
		}
		return null
	}

	public async Writer(ctx: context.Context | null, typ: MessageType): globalThis.Promise<[io.WriteCloser | null, $.GoError]> {
		const c: Conn | $.VarRef<Conn> | null = this
		return [$.interfaceValue<io.WriteCloser | null>((await (async () => { const __goscriptLiteralField0 = await bpool.Get(); return new writer({c: c, ctx: ctx, typ: typ, b: __goscriptLiteralField0}) })()), "*websocket.writer"), null]
	}

	public async close(err: $.GoError, wasClean: boolean): globalThis.Promise<void> {
		const c: Conn | $.VarRef<Conn> | null = this
		await $.pointerValue<Conn>(c).closeOnce.Do($.functionValue(async (): globalThis.Promise<void> => {
			runtime.SetFinalizer($.interfaceValue<any>(c, "*websocket.Conn"), null)

			if (!wasClean) {
				err = fmt.Errorf("unclean connection close: %w", (err as any))
			}
			await Conn.prototype.setCloseErr.call(c, err)
			$.pointerValue<Conn>(c).closeWasClean = wasClean
			$.pointerValue<Conn>(c).closed!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	public async closeWithInternal(): globalThis.Promise<void> {
		const c: Conn | $.VarRef<Conn> | null = this
		await Conn.prototype.Close.call(c, 1011, "something went wrong")
	}

	public async exportedClose(code: StatusCode, reason: string): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Conn>(c).closingMu.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).closingMu.Unlock() })

		if (await Conn.prototype.isClosed.call(c)) {
			return net.ErrClosed
		}

		let ce = fmt.Errorf("sent close: %w", $.interfaceValue<any>($.markAsStructValue(new CloseError({Code: code, Reason: reason})), "websocket.CloseError"))

		await Conn.prototype.setCloseErr.call(c, ce)
		let err = await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).Close($.int(code), reason)
		if (err != null) {
			return err
		}

		await $.chanRecv($.pointerValue<Conn>(c).closed)
		if (!$.pointerValue<Conn>(c).closeWasClean) {
			return $.pointerValue<Conn>(c).closeErr
		}
		return null
	}

	public async init(): globalThis.Promise<void> {
		let c: Conn | $.VarRef<Conn> | null = this
		$.pointerValue<Conn>(c).closed = $.makeChannel<{}>(0, {}, "both")
		$.pointerValue<Conn>(c).readSignal = $.makeChannel<{}>(1, {}, "both")

		$.pointerValue<Conn>(c).msgReadLimit.Store(32768n)

		$.pointerValue<Conn>(c).releaseOnClose = await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).OnClose($.functionValue(async (e: wsjs.CloseEvent): globalThis.Promise<void> => {
			let err = $.markAsStructValue(new CloseError({Code: e.Code, Reason: e.Reason}))
			// We do not know if we sent or received this close as
			// its possible the browser triggered it without us
			// explicitly sending it.
			await Conn.prototype.close.call(c, $.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(err)), "websocket.CloseError"), e.WasClean)

			await $.pointerValue<Conn>(c).releaseOnClose!()
			await $.pointerValue<Conn>(c).releaseOnError!()
			await $.pointerValue<Conn>(c).releaseOnMessage!()
		}, ({ kind: $.TypeKind.Function, params: ["wsjs.CloseEvent"], results: [] } as $.FunctionTypeInfo)))

		$.pointerValue<Conn>(c).releaseOnError = await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).OnError($.functionValue(async (v: js.Value): globalThis.Promise<void> => {
			await Conn.prototype.setCloseErr.call(c, errors.New($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Get("message"))).String()))
			await Conn.prototype.closeWithInternal.call(c)
		}, ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo)))

		$.pointerValue<Conn>(c).releaseOnMessage = await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).OnMessage($.functionValue(async (e: wsjs.MessageEvent): globalThis.Promise<void> => {
			using __defer = new $.DisposableStack()
			await $.pointerValue<Conn>(c).readBufMu.Lock()
			__defer.defer(() => { $.pointerValue<Conn>(c).readBufMu.Unlock() })

			$.pointerValue<Conn>(c).readBuf = $.append($.pointerValue<Conn>(c).readBuf, e)

			// Lets the read goroutine know there is definitely something in readBuf.
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: true,
					channel: $.pointerValue<Conn>(c).readSignal,
					value: {},
					onSelected: async (__goscriptSelect0Result) => {
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect0Result) => {
					}
				}
			], true)
			if (__goscriptSelect0HasReturn) {
				return __goscriptSelect0Value
			}
		}, ({ kind: $.TypeKind.Function, params: ["wsjs.MessageEvent"], results: [] } as $.FunctionTypeInfo)))

		runtime.SetFinalizer($.interfaceValue<any>(c, "*websocket.Conn"), $.interfaceValue<any>($.functionValue(async (c: Conn | $.VarRef<Conn> | null): globalThis.Promise<void> => {
			await Conn.prototype.setCloseErr.call(c, errors.New("connection garbage collected"))
			await Conn.prototype.closeWithInternal.call(c)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "websocket.Conn" }], results: [] } as $.FunctionTypeInfo)), "func(c *websocket.Conn)"))
	}

	public async isClosed(): globalThis.Promise<boolean> {
		const c: Conn | $.VarRef<Conn> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Conn>(c).closed,
				onSelected: async (__goscriptSelect1Result) => {
					return true
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect1Result) => {
					return false
				}
			}
		], true)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async read(ctx: context.Context | null): globalThis.Promise<[MessageType, $.Slice<number>, $.GoError]> {
		let c: Conn | $.VarRef<Conn> | null = this
		using __defer = new $.DisposableStack()
		const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [MessageType, $.Slice<number>, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect2Result) => {
					await Conn.prototype.Close.call(c, 1008, "read timed out")
					return [0, null, await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<Conn>(c).readSignal,
				onSelected: async (__goscriptSelect2Result) => {
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<Conn>(c).closed,
				onSelected: async (__goscriptSelect2Result) => {
					return [0, null, net.ErrClosed]
				}
			}
		], false)
		if (__goscriptSelect2HasReturn) {
			return __goscriptSelect2Value
		}

		await $.pointerValue<Conn>(c).readBufMu.Lock()
		__defer.defer(() => { $.pointerValue<Conn>(c).readBufMu.Unlock() })

		let me = $.markAsStructValue($.cloneStructValue($.arrayIndex($.pointerValue<Conn>(c).readBuf!, 0)))
		// We copy the messages forward and decrease the size
		// of the slice to avoid reallocating.
		$.copy($.pointerValue<Conn>(c).readBuf, $.goSlice($.pointerValue<Conn>(c).readBuf, 1, undefined))
		$.pointerValue<Conn>(c).readBuf = $.goSlice($.pointerValue<Conn>(c).readBuf, undefined, $.len($.pointerValue<Conn>(c).readBuf) - 1)

		if ($.len($.pointerValue<Conn>(c).readBuf) > 0) {
			// Next time we read, we'll grab the message.
			const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [MessageType, $.Slice<number>, $.GoError]>([
				{
					id: 0,
					isSend: true,
					channel: $.pointerValue<Conn>(c).readSignal,
					value: {},
					onSelected: async (__goscriptSelect3Result) => {
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect3Result) => {
					}
				}
			], true)
			if (__goscriptSelect3HasReturn) {
				return __goscriptSelect3Value
			}
		}

		{
			const __goscriptTypeSwitchValue = me.Data
			switch (true) {
				case $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
					{
						let p: string = $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
						return [1, $.stringToBytes(p), null]
					}
					break
				case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
					{
						let p: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
						return [2, p, null]
					}
					break
				default:
					{
						let p: any = __goscriptTypeSwitchValue
						$.panic("websocket: unexpected data type from wsjs OnMessage: " + await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(me.Data)).String())
					}
					break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async setCloseErr(err: $.GoError): globalThis.Promise<void> {
		const c: Conn | $.VarRef<Conn> | null = this
		await $.pointerValue<Conn>(c).closeErrOnce.Do($.functionValue((): void => {
			$.pointerValue<Conn>(c).closeErr = fmt.Errorf("WebSocket closed: %w", (err as any))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	public async write(typ: MessageType, p: $.Slice<number>): globalThis.Promise<$.GoError> {
		const c: Conn | $.VarRef<Conn> | null = this
		if (await Conn.prototype.isClosed.call(c)) {
			return net.ErrClosed
		}
		switch (typ) {
			case 2:
			{
				return await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).SendBytes(p)
				break
			}
			case 1:
			{
				return await $.markAsStructValue($.cloneStructValue($.pointerValue<Conn>(c).ws)).SendText($.bytesToString(p))
				break
			}
			default:
			{
				return fmt.Errorf("unexpected message type: %v", $.namedValueInterfaceValue<any>(typ, "websocket.MessageType", {String: (receiver: any, ...args: any[]) => (__goscript_stringer.MessageType_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" }))
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"websocket.Conn",
		() => new Conn(),
		[{ name: "Close", args: [{ name: "code", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.StatusCode" } }, { name: "reason", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseNow", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "context.Context" }] }, { name: "Ping", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r2", type: "error" }] }, { name: "Reader", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }, { name: "_r1", type: "io.Reader" }, { name: "_r2", type: "error" }] }, { name: "SetReadLimit", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "Subprotocol", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Write", args: [{ name: "ctx", type: "context.Context" }, { name: "typ", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }, { name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Writer", args: [{ name: "ctx", type: "context.Context" }, { name: "typ", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }], returns: [{ name: "_r0", type: "io.WriteCloser" }, { name: "_r1", type: "error" }] }, { name: "close", args: [{ name: "err", type: "error" }, { name: "wasClean", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [] }, { name: "closeWithInternal", args: [], returns: [] }, { name: "exportedClose", args: [{ name: "code", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.StatusCode" } }, { name: "reason", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "init", args: [], returns: [] }, { name: "isClosed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "read", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r2", type: "error" }] }, { name: "setCloseErr", args: [{ name: "err", type: "error" }], returns: [] }, { name: "write", args: [{ name: "typ", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" } }, { name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		Conn,
		[{ name: "noCopy", key: "noCopy", type: "websocket.noCopy", pkgPath: "github.com/aperturerobotics/go-websocket", index: [0], offset: 0, exported: false }, { name: "ws", key: "ws", type: "wsjs.WebSocket", pkgPath: "github.com/aperturerobotics/go-websocket", index: [1], offset: 0, exported: false }, { name: "msgReadLimit", key: "msgReadLimit", type: "atomic.Int64", pkgPath: "github.com/aperturerobotics/go-websocket", index: [2], offset: 16, exported: false }, { name: "closeReadMu", key: "closeReadMu", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/go-websocket", index: [3], offset: 24, exported: false }, { name: "closeReadCtx", key: "closeReadCtx", type: "context.Context", pkgPath: "github.com/aperturerobotics/go-websocket", index: [4], offset: 32, exported: false }, { name: "closingMu", key: "closingMu", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/go-websocket", index: [5], offset: 48, exported: false }, { name: "closeOnce", key: "closeOnce", type: "sync.Once", pkgPath: "github.com/aperturerobotics/go-websocket", index: [6], offset: 56, exported: false }, { name: "closed", key: "closed", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [7], offset: 72, exported: false }, { name: "closeErrOnce", key: "closeErrOnce", type: "sync.Once", pkgPath: "github.com/aperturerobotics/go-websocket", index: [8], offset: 80, exported: false }, { name: "closeErr", key: "closeErr", type: "error", pkgPath: "github.com/aperturerobotics/go-websocket", index: [9], offset: 96, exported: false }, { name: "closeWasClean", key: "closeWasClean", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [10], offset: 112, exported: false }, { name: "releaseOnClose", key: "releaseOnClose", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/go-websocket", index: [11], offset: 120, exported: false }, { name: "releaseOnError", key: "releaseOnError", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/go-websocket", index: [12], offset: 128, exported: false }, { name: "releaseOnMessage", key: "releaseOnMessage", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/go-websocket", index: [13], offset: 136, exported: false }, { name: "readSignal", key: "readSignal", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [14], offset: 144, exported: false }, { name: "readBufMu", key: "readBufMu", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/go-websocket", index: [15], offset: 152, exported: false }, { name: "readBuf", key: "readBuf", type: { kind: $.TypeKind.Slice, elemType: "wsjs.MessageEvent" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [16], offset: 160, exported: false }]
	)
}

export class DialOptions {
	// Subprotocols lists the subprotocols to negotiate with the server.
	public get Subprotocols(): $.Slice<string> {
		return this._fields.Subprotocols.value
	}
	public set Subprotocols(value: $.Slice<string>) {
		this._fields.Subprotocols.value = value
	}

	public _fields: {
		Subprotocols: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{Subprotocols?: $.Slice<string>}>) {
		this._fields = {
			Subprotocols: $.varRef(init?.Subprotocols ?? (null as $.Slice<string>))
		}
	}

	public clone(): DialOptions {
		const cloned = new DialOptions()
		cloned._fields = {
			Subprotocols: $.varRef(this._fields.Subprotocols.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"websocket.DialOptions",
		() => new DialOptions(),
		[],
		DialOptions,
		[{ name: "Subprotocols", key: "Subprotocols", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [0], offset: 0, exported: true }]
	)
}

export class writer {
	public get closed(): boolean {
		return this._fields.closed.value
	}
	public set closed(value: boolean) {
		this._fields.closed.value = value
	}

	public get c(): Conn | $.VarRef<Conn> | null {
		return this._fields.c.value
	}
	public set c(value: Conn | $.VarRef<Conn> | null) {
		this._fields.c.value = value
	}

	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get typ(): MessageType {
		return this._fields.typ.value
	}
	public set typ(value: MessageType) {
		this._fields.typ.value = value
	}

	public get b(): bytes.Buffer | $.VarRef<bytes.Buffer> | null {
		return this._fields.b.value
	}
	public set b(value: bytes.Buffer | $.VarRef<bytes.Buffer> | null) {
		this._fields.b.value = value
	}

	public _fields: {
		closed: $.VarRef<boolean>
		c: $.VarRef<Conn | $.VarRef<Conn> | null>
		ctx: $.VarRef<context.Context | null>
		typ: $.VarRef<MessageType>
		b: $.VarRef<bytes.Buffer | $.VarRef<bytes.Buffer> | null>
	}

	constructor(init?: Partial<{closed?: boolean, c?: Conn | $.VarRef<Conn> | null, ctx?: context.Context | null, typ?: MessageType, b?: bytes.Buffer | $.VarRef<bytes.Buffer> | null}>) {
		this._fields = {
			closed: $.varRef(init?.closed ?? (false as boolean)),
			c: $.varRef(init?.c ?? (null as Conn | $.VarRef<Conn> | null)),
			ctx: $.varRef(init?.ctx ?? (null as context.Context | null)),
			typ: $.varRef(init?.typ ?? (0 as MessageType)),
			b: $.varRef(init?.b ?? (null as bytes.Buffer | $.VarRef<bytes.Buffer> | null))
		}
	}

	public clone(): writer {
		const cloned = new writer()
		cloned._fields = {
			closed: $.varRef(this._fields.closed.value),
			c: $.varRef(this._fields.c.value),
			ctx: $.varRef(this._fields.ctx.value),
			typ: $.varRef(this._fields.typ.value),
			b: $.varRef(this._fields.b.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let w: writer | $.VarRef<writer> | null = this
		using __defer = new $.DisposableStack()
		if ($.pointerValue<writer>(w).closed) {
			return errors.New("cannot close closed writer")
		}
		$.pointerValue<writer>(w).closed = true
		__defer.defer(() => { bpool.Put($.pointerValue<writer>(w).b) })

		let err = await Conn.prototype.Write.call($.pointerValue<writer>(w).c, $.pointerValue<writer>(w).ctx, $.pointerValue<writer>(w).typ, bytes.Buffer.prototype.Bytes.call($.pointerValue<bytes.Buffer>($.pointerValue<writer>(w).b)))
		if (err != null) {
			return fmt.Errorf("failed to close writer: %w", (err as any))
		}
		return null
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const w: writer | $.VarRef<writer> | null = this
		if ($.pointerValue<writer>(w).closed) {
			return [0, errors.New("cannot write to closed writer")]
		}
		let [n, err] = bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>($.pointerValue<writer>(w).b), p)
		if (err != null) {
			return [n, fmt.Errorf("failed to write message: %w", (err as any))]
		}
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"websocket.writer",
		() => new writer(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		writer,
		[{ name: "closed", key: "closed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [0], offset: 0, exported: false }, { name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "websocket.Conn" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [1], offset: 8, exported: false }, { name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/go-websocket", index: [2], offset: 16, exported: false }, { name: "typ", key: "typ", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [3], offset: 32, exported: false }, { name: "b", key: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [4], offset: 40, exported: false }]
	)
}

export class AcceptOptions {
	public get Subprotocols(): $.Slice<string> {
		return this._fields.Subprotocols.value
	}
	public set Subprotocols(value: $.Slice<string>) {
		this._fields.Subprotocols.value = value
	}

	public get InsecureSkipVerify(): boolean {
		return this._fields.InsecureSkipVerify.value
	}
	public set InsecureSkipVerify(value: boolean) {
		this._fields.InsecureSkipVerify.value = value
	}

	public get OriginPatterns(): $.Slice<string> {
		return this._fields.OriginPatterns.value
	}
	public set OriginPatterns(value: $.Slice<string>) {
		this._fields.OriginPatterns.value = value
	}

	public get CompressionMode(): CompressionMode {
		return this._fields.CompressionMode.value
	}
	public set CompressionMode(value: CompressionMode) {
		this._fields.CompressionMode.value = value
	}

	public get CompressionThreshold(): number {
		return this._fields.CompressionThreshold.value
	}
	public set CompressionThreshold(value: number) {
		this._fields.CompressionThreshold.value = value
	}

	public _fields: {
		Subprotocols: $.VarRef<$.Slice<string>>
		InsecureSkipVerify: $.VarRef<boolean>
		OriginPatterns: $.VarRef<$.Slice<string>>
		CompressionMode: $.VarRef<CompressionMode>
		CompressionThreshold: $.VarRef<number>
	}

	constructor(init?: Partial<{Subprotocols?: $.Slice<string>, InsecureSkipVerify?: boolean, OriginPatterns?: $.Slice<string>, CompressionMode?: CompressionMode, CompressionThreshold?: number}>) {
		this._fields = {
			Subprotocols: $.varRef(init?.Subprotocols ?? (null as $.Slice<string>)),
			InsecureSkipVerify: $.varRef(init?.InsecureSkipVerify ?? (false as boolean)),
			OriginPatterns: $.varRef(init?.OriginPatterns ?? (null as $.Slice<string>)),
			CompressionMode: $.varRef(init?.CompressionMode ?? (0 as CompressionMode)),
			CompressionThreshold: $.varRef(init?.CompressionThreshold ?? (0 as number))
		}
	}

	public clone(): AcceptOptions {
		const cloned = new AcceptOptions()
		cloned._fields = {
			Subprotocols: $.varRef(this._fields.Subprotocols.value),
			InsecureSkipVerify: $.varRef(this._fields.InsecureSkipVerify.value),
			OriginPatterns: $.varRef(this._fields.OriginPatterns.value),
			CompressionMode: $.varRef(this._fields.CompressionMode.value),
			CompressionThreshold: $.varRef(this._fields.CompressionThreshold.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"websocket.AcceptOptions",
		() => new AcceptOptions(),
		[],
		AcceptOptions,
		[{ name: "Subprotocols", key: "Subprotocols", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [0], offset: 0, exported: true }, { name: "InsecureSkipVerify", key: "InsecureSkipVerify", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 24, exported: true }, { name: "OriginPatterns", key: "OriginPatterns", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [2], offset: 32, exported: true }, { name: "CompressionMode", key: "CompressionMode", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.CompressionMode" }, index: [3], offset: 56, exported: true }, { name: "CompressionThreshold", key: "CompressionThreshold", type: { kind: $.TypeKind.Basic, name: "int" }, index: [4], offset: 64, exported: true }]
	)
}

export class CloseError {
	public get Code(): StatusCode {
		return this._fields.Code.value
	}
	public set Code(value: StatusCode) {
		this._fields.Code.value = value
	}

	public get Reason(): string {
		return this._fields.Reason.value
	}
	public set Reason(value: string) {
		this._fields.Reason.value = value
	}

	public _fields: {
		Code: $.VarRef<StatusCode>
		Reason: $.VarRef<string>
	}

	constructor(init?: Partial<{Code?: StatusCode, Reason?: string}>) {
		this._fields = {
			Code: $.varRef(init?.Code ?? (0 as StatusCode)),
			Reason: $.varRef(init?.Reason ?? ("" as string))
		}
	}

	public clone(): CloseError {
		const cloned = new CloseError()
		cloned._fields = {
			Code: $.varRef(this._fields.Code.value),
			Reason: $.varRef(this._fields.Reason.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const ce = this
		return await fmt.Sprintf("status = %v and reason = %q", $.namedValueInterfaceValue<any>(ce.Code, "websocket.StatusCode", {String: (receiver: any, ...args: any[]) => (__goscript_stringer.StatusCode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.StatusCode" }), ce.Reason)
	}

	static __typeInfo = $.registerStructType(
		"websocket.CloseError",
		() => new CloseError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		CloseError,
		[{ name: "Code", key: "Code", type: { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.StatusCode" }, index: [0], offset: 0, exported: true }, { name: "Reason", key: "Reason", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }]
	)
}

export class mu {
	public get c(): Conn | $.VarRef<Conn> | null {
		return this._fields.c.value
	}
	public set c(value: Conn | $.VarRef<Conn> | null) {
		this._fields.c.value = value
	}

	public get ch(): $.Channel<{}> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<{}> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		c: $.VarRef<Conn | $.VarRef<Conn> | null>
		ch: $.VarRef<$.Channel<{}> | null>
	}

	constructor(init?: Partial<{c?: Conn | $.VarRef<Conn> | null, ch?: $.Channel<{}> | null}>) {
		this._fields = {
			c: $.varRef(init?.c ?? (null as Conn | $.VarRef<Conn> | null)),
			ch: $.varRef(init?.ch ?? (null as $.Channel<{}> | null))
		}
	}

	public clone(): mu {
		const cloned = new mu()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async forceLock(): globalThis.Promise<void> {
		const m: mu | $.VarRef<mu> | null = this
		await $.chanSend($.pointerValue<mu>(m).ch, {})
	}

	public async tryLock(): globalThis.Promise<boolean> {
		const m: mu | $.VarRef<mu> | null = this
		const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<mu>(m).ch,
				value: {},
				onSelected: async (__goscriptSelect5Result) => {
					return true
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect5Result) => {
					return false
				}
			}
		], true)
		if (__goscriptSelect5HasReturn) {
			return __goscriptSelect5Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async unlock(): globalThis.Promise<void> {
		const m: mu | $.VarRef<mu> | null = this
		const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<mu>(m).ch,
				onSelected: async (__goscriptSelect6Result) => {
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect6Result) => {
				}
			}
		], true)
		if (__goscriptSelect6HasReturn) {
			return __goscriptSelect6Value
		}
	}

	static __typeInfo = $.registerStructType(
		"websocket.mu",
		() => new mu(),
		[{ name: "forceLock", args: [], returns: [] }, { name: "tryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "unlock", args: [], returns: [] }],
		mu,
		[{ name: "c", key: "c", type: { kind: $.TypeKind.Pointer, elemType: "websocket.Conn" }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [0], offset: 0, exported: false }, { name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/aperturerobotics/go-websocket", index: [1], offset: 8, exported: false }]
	)
}

export const opContinuation: opcode = 0

export const opText: opcode = 1

export const opBinary: opcode = 2

const __goscriptBlank0: opcode = 3

const __goscriptBlank1: opcode = 4

const __goscriptBlank2: opcode = 5

const __goscriptBlank3: opcode = 6

const __goscriptBlank4: opcode = 7

export const opClose: opcode = 8

export const opPing: opcode = 9

export const opPong: opcode = 10

export const StatusNormalClosure: StatusCode = 1000

export const StatusGoingAway: StatusCode = 1001

export const StatusProtocolError: StatusCode = 1002

export const StatusUnsupportedData: StatusCode = 1003

export const statusReserved: StatusCode = 1004

export const StatusNoStatusRcvd: StatusCode = 1005

export const StatusAbnormalClosure: StatusCode = 1006

export const StatusInvalidFramePayloadData: StatusCode = 1007

export const StatusPolicyViolation: StatusCode = 1008

export const StatusMessageTooBig: StatusCode = 1009

export const StatusMandatoryExtension: StatusCode = 1010

export const StatusInternalError: StatusCode = 1011

export const StatusServiceRestart: StatusCode = 1012

export const StatusTryAgainLater: StatusCode = 1013

export const StatusBadGateway: StatusCode = 1014

export const StatusTLSHandshake: StatusCode = 1015

export const CompressionNoContextTakeover: CompressionMode = 0

export const CompressionContextTakeover: CompressionMode = 1

export const CompressionDisabled: CompressionMode = 2

export const MessageText: MessageType = 1

export const MessageBinary: MessageType = 2

export type opcode = number

export async function Dial(ctx: context.Context | null, url: string, opts: DialOptions | $.VarRef<DialOptions> | null): globalThis.Promise<[Conn | $.VarRef<Conn> | null, $.VarRef<{}> | null, $.GoError]> {
	let __goscriptTuple3: any = await dial(ctx, url, opts)
	let c: Conn | $.VarRef<Conn> | null = __goscriptTuple3[0]
	let resp = __goscriptTuple3[1]
	let err = __goscriptTuple3[2]
	if (err != null) {
		return [null, null, fmt.Errorf("failed to WebSocket dial %q: %w", url, (err as any))]
	}
	return [c, resp, null]
}

export async function dial(ctx: context.Context | null, url: string, opts: DialOptions | $.VarRef<DialOptions> | null): globalThis.Promise<[Conn | $.VarRef<Conn> | null, $.VarRef<{}> | null, $.GoError]> {
	await using __defer = new $.AsyncDisposableStack()
	if (opts == null) {
		opts = new DialOptions()
	}

	url = strings.Replace(url, "http://", "ws://", 1)
	url = strings.Replace(url, "https://", "wss://", 1)

	let [ws, err] = await wsjs.New(url, $.pointerValue<DialOptions>(opts).Subprotocols)
	if (err != null) {
		return [null, null, err]
	}

	let c: Conn | $.VarRef<Conn> | null = new Conn({ws: $.markAsStructValue($.cloneStructValue(ws))})
	await Conn.prototype.init.call(c)

	let opench: $.Channel<{}> | null = $.makeChannel<{}>(0, {}, "both")
	let releaseOpen: (() => void) | null = await $.markAsStructValue($.cloneStructValue(ws)).OnOpen($.functionValue((e: js.Value): void => {
		opench!.close()
	}, ({ kind: $.TypeKind.Function, params: ["js.Value"], results: [] } as $.FunctionTypeInfo)))
	__defer.defer(async () => { await releaseOpen!() })

	const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, [Conn | $.VarRef<Conn> | null, $.VarRef<{}> | null, $.GoError]>([
		{
			id: 0,
			isSend: false,
			channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
			onSelected: async (__goscriptSelect4Result) => {
				await Conn.prototype.Close.call(c, 1008, "dial timed out")
				return [null, null, await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()]
			}
		},
		{
			id: 1,
			isSend: false,
			channel: opench,
			onSelected: async (__goscriptSelect4Result) => {
				return [c, null, null]
			}
		},
		{
			id: 2,
			isSend: false,
			channel: $.pointerValue<Conn>(c).closed,
			onSelected: async (__goscriptSelect4Result) => {
				return [null, null, net.ErrClosed]
			}
		}
	], false)
	if (__goscriptSelect4HasReturn) {
		return __goscriptSelect4Value
	}
	throw new Error("unreachable select")
	throw new globalThis.Error("goscript: unreachable return")
}

export function Accept(w: any, r: any, opts: AcceptOptions | $.VarRef<AcceptOptions> | null): [Conn | $.VarRef<Conn> | null, $.GoError] {
	return [null, errors.New("unimplemented")]
}

export function CloseStatus(err: $.GoError): StatusCode {
	let ce: $.VarRef<CloseError> = $.varRef($.markAsStructValue(new CloseError()))
	if (errors.As($.pointerValueOrNil(err)!, $.interfaceValue<any>(ce, "*websocket.CloseError"))) {
		return ce.value.Code
	}
	return -1
}

export function newMu(c: Conn | $.VarRef<Conn> | null): mu | $.VarRef<mu> | null {
	return new mu({c: c, ch: $.makeChannel<{}>(1, {}, "both")})
}
