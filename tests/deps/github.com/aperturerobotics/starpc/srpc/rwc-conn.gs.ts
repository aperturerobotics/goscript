// Generated file based on rwc-conn.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as contextutil from "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/starpc/internal/contextutil/index.js"

export class bufPool {
	public get ch(): $.Channel<$.Slice<number>> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<$.Slice<number>> | null) {
		this._fields.ch.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		ch: $.VarRef<$.Channel<$.Slice<number>> | null>
		size: $.VarRef<number>
	}

	constructor(init?: Partial<{ch?: $.Channel<$.Slice<number>> | null, size?: number}>) {
		this._fields = {
			ch: $.varRef(init?.ch ?? (null as unknown as $.Channel<$.Slice<number>> | null)),
			size: $.varRef(init?.size ?? (0 as unknown as number))
		}
	}

	public clone(): bufPool {
		const cloned = new bufPool()
		cloned._fields = {
			ch: $.varRef(this._fields.ch.value),
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ["get"](): globalThis.Promise<$.Slice<number>> {
		const p: bufPool | $.VarRef<bufPool> | null = this
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.Slice<number>>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<bufPool>(p).ch,
				onSelected: async (__goscriptSelect0Result) => {
					let b = __goscriptSelect0Result.value
					return $.goSlice(b, undefined, $.pointerValue<bufPool>(p).size)
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect0Result) => {
					return $.makeSlice<number>($.pointerValue<bufPool>(p).size, undefined, "byte")
				}
			}
		], true)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async put(b: $.Slice<number>): globalThis.Promise<void> {
		const p: bufPool | $.VarRef<bufPool> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<bufPool>(p).ch,
				value: b,
				onSelected: async (__goscriptSelect1Result) => {
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect1Result) => {
				}
			}
		], true)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
	}

	static __typeInfo = $.registerStructType(
		"srpc.bufPool",
		() => new bufPool(),
		[{ name: "get", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "put", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		bufPool,
		[{ name: "ch", key: "ch", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "size", key: "size", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 8, exported: false }]
	)
}

export class RwcConn {
	public get ctx(): context.Context | null {
		return this._fields.ctx.value
	}
	public set ctx(value: context.Context | null) {
		this._fields.ctx.value = value
	}

	public get ctxCancel(): (() => void) | null {
		return this._fields.ctxCancel.value
	}
	public set ctxCancel(value: (() => void) | null) {
		this._fields.ctxCancel.value = value
	}

	public get rwc(): io.ReadWriteCloser | null {
		return this._fields.rwc.value
	}
	public set rwc(value: io.ReadWriteCloser | null) {
		this._fields.rwc.value = value
	}

	public get laddr(): net.Addr | null {
		return this._fields.laddr.value
	}
	public set laddr(value: net.Addr | null) {
		this._fields.laddr.value = value
	}

	public get raddr(): net.Addr | null {
		return this._fields.raddr.value
	}
	public set raddr(value: net.Addr | null) {
		this._fields.raddr.value = value
	}

	public get pool(): bufPool | $.VarRef<bufPool> | null {
		return this._fields.pool.value
	}
	public set pool(value: bufPool | $.VarRef<bufPool> | null) {
		this._fields.pool.value = value
	}

	public get packetCh(): $.Channel<$.Slice<number>> | null {
		return this._fields.packetCh.value
	}
	public set packetCh(value: $.Channel<$.Slice<number>> | null) {
		this._fields.packetCh.value = value
	}

	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get rd(): time.Time {
		return this._fields.rd.value
	}
	public set rd(value: time.Time) {
		this._fields.rd.value = value
	}

	public get wd(): time.Time {
		return this._fields.wd.value
	}
	public set wd(value: time.Time) {
		this._fields.wd.value = value
	}

	public get closeErr(): $.GoError {
		return this._fields.closeErr.value
	}
	public set closeErr(value: $.GoError) {
		this._fields.closeErr.value = value
	}

	public get pendingMu(): sync.Mutex {
		return this._fields.pendingMu.value
	}
	public set pendingMu(value: sync.Mutex) {
		this._fields.pendingMu.value = value
	}

	public get pending(): $.Slice<number> {
		return this._fields.pending.value
	}
	public set pending(value: $.Slice<number>) {
		this._fields.pending.value = value
	}

	public _fields: {
		ctx: $.VarRef<context.Context | null>
		ctxCancel: $.VarRef<(() => void) | null>
		rwc: $.VarRef<io.ReadWriteCloser | null>
		laddr: $.VarRef<net.Addr | null>
		raddr: $.VarRef<net.Addr | null>
		pool: $.VarRef<bufPool | $.VarRef<bufPool> | null>
		packetCh: $.VarRef<$.Channel<$.Slice<number>> | null>
		mu: $.VarRef<sync.Mutex>
		rd: $.VarRef<time.Time>
		wd: $.VarRef<time.Time>
		closeErr: $.VarRef<$.GoError>
		pendingMu: $.VarRef<sync.Mutex>
		pending: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{ctx?: context.Context | null, ctxCancel?: (() => void) | null, rwc?: io.ReadWriteCloser | null, laddr?: net.Addr | null, raddr?: net.Addr | null, pool?: bufPool | $.VarRef<bufPool> | null, packetCh?: $.Channel<$.Slice<number>> | null, mu?: sync.Mutex, rd?: time.Time, wd?: time.Time, closeErr?: $.GoError, pendingMu?: sync.Mutex, pending?: $.Slice<number>}>) {
		this._fields = {
			ctx: $.varRef(init?.ctx ?? (null as unknown as context.Context | null)),
			ctxCancel: $.varRef(init?.ctxCancel ?? (null as unknown as (() => void) | null)),
			rwc: $.varRef(init?.rwc ?? (null as unknown as io.ReadWriteCloser | null)),
			laddr: $.varRef(init?.laddr ?? (null as unknown as net.Addr | null)),
			raddr: $.varRef(init?.raddr ?? (null as unknown as net.Addr | null)),
			pool: $.varRef(init?.pool ?? (null as unknown as bufPool | $.VarRef<bufPool> | null)),
			packetCh: $.varRef(init?.packetCh ?? (null as unknown as $.Channel<$.Slice<number>> | null)),
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			rd: $.varRef(init?.rd ? $.markAsStructValue($.cloneStructValue(init.rd)) : $.markAsStructValue(new time.Time())),
			wd: $.varRef(init?.wd ? $.markAsStructValue($.cloneStructValue(init.wd)) : $.markAsStructValue(new time.Time())),
			closeErr: $.varRef(init?.closeErr ?? (null as unknown as $.GoError)),
			pendingMu: $.varRef(init?.pendingMu ? $.markAsStructValue($.cloneStructValue(init.pendingMu)) : $.markAsStructValue(new sync.Mutex())),
			pending: $.varRef(init?.pending ?? (null as unknown as $.Slice<number>))
		}
	}

	public clone(): RwcConn {
		const cloned = new RwcConn()
		cloned._fields = {
			ctx: $.varRef(this._fields.ctx.value),
			ctxCancel: $.varRef(this._fields.ctxCancel.value),
			rwc: $.varRef(this._fields.rwc.value),
			laddr: $.varRef(this._fields.laddr.value),
			raddr: $.varRef(this._fields.raddr.value),
			pool: $.varRef(this._fields.pool.value),
			packetCh: $.varRef(this._fields.packetCh.value),
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			rd: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rd.value))),
			wd: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.wd.value))),
			closeErr: $.varRef(this._fields.closeErr.value),
			pendingMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pendingMu.value))),
			pending: $.varRef(this._fields.pending.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		await $.pointerValue<RwcConn>(p).ctxCancel!()
		return await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<RwcConn>(p).rwc).Close()
	}

	public LocalAddr(): net.Addr | null {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		return $.pointerValue<RwcConn>(p).laddr
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let p: RwcConn | $.VarRef<RwcConn> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// Drain pending data from a previous partial read first.
		await $.pointerValue<RwcConn>(p).pendingMu.Lock()
		if ($.len($.pointerValue<RwcConn>(p).pending) > 0) {
			let n = $.copy(b, $.pointerValue<RwcConn>(p).pending)
			if (n < $.len($.pointerValue<RwcConn>(p).pending)) {
				$.pointerValue<RwcConn>(p).pending = $.goSlice($.pointerValue<RwcConn>(p).pending, n, undefined)
			} else {
				$.pointerValue<RwcConn>(p).pending = null
			}
			$.pointerValue<RwcConn>(p).pendingMu.Unlock()
			return [n, null]
		}
		$.pointerValue<RwcConn>(p).pendingMu.Unlock()

		// Build a context with the read deadline if one is set.
		let ctx = $.pointerValue<RwcConn>(p).ctx
		let deadline = $.markAsStructValue($.cloneStructValue(await RwcConn.prototype.readDeadline.call(p)))
		if (!$.markAsStructValue($.cloneStructValue(deadline)).IsZero()) {
			let cancel: context.CancelFunc | null = null as unknown as context.CancelFunc | null
			let __goscriptTuple0: any = context.WithDeadline($.pointerValueOrNil(ctx)!, $.markAsStructValue($.cloneStructValue(deadline)))
			ctx = __goscriptTuple0[0]
			cancel = __goscriptTuple0[1]
			__defer.defer(async () => { await cancel!() })
		}

		const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [number, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect2Result) => {
					if (!$.markAsStructValue($.cloneStructValue(deadline)).IsZero()) {
						return [0, os.ErrDeadlineExceeded]
					}
					return [0, context.Canceled]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<RwcConn>(p).packetCh,
				onSelected: async (__goscriptSelect2Result) => {
					let pkt = __goscriptSelect2Result.value
					let ok = __goscriptSelect2Result.ok
					if (!ok) {
						let err = await RwcConn.prototype.getCloseErr.call(p)
						if (err == null) {
							err = io.EOF
						}
						return [0, err]
					}

					let n = $.copy(b, pkt)
					if (n < $.len(pkt)) {
						// Buffer the remaining bytes for the next Read call.
						// Explicitly copy so the pool buffer is not aliased.
						await $.pointerValue<RwcConn>(p).pendingMu.Lock()
						$.pointerValue<RwcConn>(p).pending = $.appendSlice($.goSlice($.pointerValue<RwcConn>(p).pending, undefined, 0), $.goSlice(pkt, n, undefined))
						$.pointerValue<RwcConn>(p).pendingMu.Unlock()
					}
					await bufPool.prototype.put.call($.pointerValue<RwcConn>(p).pool, pkt)
					return [n, null]
				}
			}
		], false)
		if (__goscriptSelect2HasReturn) {
			return __goscriptSelect2Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public RemoteAddr(): net.Addr | null {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		return $.pointerValue<RwcConn>(p).raddr
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		let p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		$.pointerValue<RwcConn>(p).rd = $.markAsStructValue($.cloneStructValue(t))
		$.pointerValue<RwcConn>(p).wd = $.markAsStructValue($.cloneStructValue(t))
		return null
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		let p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		$.pointerValue<RwcConn>(p).rd = $.markAsStructValue($.cloneStructValue(t))
		return null
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		let p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		$.pointerValue<RwcConn>(p).wd = $.markAsStructValue($.cloneStructValue(t))
		return null
	}

	public async Write(pkt: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		if ($.len(pkt) == 0) {
			return [0, null]
		}

		let written = 0
		while (written < $.len(pkt)) {
			let [n, err] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<RwcConn>(p).rwc).Write($.goSlice(pkt, written, undefined))
			written = written + (n)
			if (err != null) {
				return [written, err]
			}
		}
		return [written, null]
	}

	public async getCloseErr(): globalThis.Promise<$.GoError> {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		return $.pointerValue<RwcConn>(p).closeErr
	}

	public async readDeadline(): globalThis.Promise<time.Time> {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		return $.markAsStructValue($.cloneStructValue($.pointerValue<RwcConn>(p).rd))
	}

	public async rxPump(): globalThis.Promise<void> {
		const p: RwcConn | $.VarRef<RwcConn> | null = this
		await using __defer = new $.AsyncDisposableStack()
		let rerr: $.GoError = null as $.GoError
		__defer.defer(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
			await RwcConn.prototype.setCloseErr.call(p, rerr)
			$.pointerValue<RwcConn>(p).packetCh!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

		while (true) {
			let buf: $.Slice<number> = await bufPool.prototype.get.call($.pointerValue<RwcConn>(p).pool)
			let [n, err] = await $.pointerValue<Exclude<io.ReadWriteCloser, null>>($.pointerValue<RwcConn>(p).rwc).Read(buf)
			if (n == 0) {
				await bufPool.prototype.put.call($.pointerValue<RwcConn>(p).pool, buf)
			} else {
				const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, void>([
					{
						id: 0,
						isSend: false,
						channel: await $.pointerValue<Exclude<context.Context, null>>($.pointerValue<RwcConn>(p).ctx).Done(),
						onSelected: async (__goscriptSelect3Result) => {
							await bufPool.prototype.put.call($.pointerValue<RwcConn>(p).pool, buf)
							rerr = context.Canceled
							return $.selectVoidReturn()
						}
					},
					{
						id: 1,
						isSend: true,
						channel: $.pointerValue<RwcConn>(p).packetCh,
						value: $.goSlice(buf, undefined, n),
						onSelected: async (__goscriptSelect3Result) => {
						}
					}
				], false)
				if (__goscriptSelect3HasReturn) {
					return __goscriptSelect3Value
				}
			}
			if (err != null) {
				rerr = err
				return
			}
		}
	}

	public async setCloseErr(err: $.GoError): globalThis.Promise<void> {
		let p: RwcConn | $.VarRef<RwcConn> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<RwcConn>(p).mu.Lock()
		__defer.defer(() => { $.pointerValue<RwcConn>(p).mu.Unlock() })
		$.pointerValue<RwcConn>(p).closeErr = err
	}

	static __typeInfo = $.registerStructType(
		"srpc.RwcConn",
		() => new RwcConn(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "pkt", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "getCloseErr", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "readDeadline", args: [], returns: [{ name: "_r0", type: "time.Time" }] }, { name: "rxPump", args: [], returns: [] }, { name: "setCloseErr", args: [{ name: "err", type: "error" }], returns: [] }],
		RwcConn,
		[{ name: "ctx", key: "ctx", type: "context.Context", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "ctxCancel", key: "ctxCancel", type: ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [1], offset: 16, exported: false }, { name: "rwc", key: "rwc", type: "io.ReadWriteCloser", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [2], offset: 24, exported: false }, { name: "laddr", key: "laddr", type: "net.Addr", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [3], offset: 40, exported: false }, { name: "raddr", key: "raddr", type: "net.Addr", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [4], offset: 56, exported: false }, { name: "pool", key: "pool", type: { kind: $.TypeKind.Pointer, elemType: "srpc.bufPool" }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [5], offset: 72, exported: false }, { name: "packetCh", key: "packetCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [6], offset: 80, exported: false }, { name: "mu", key: "mu", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [7], offset: 88, exported: false }, { name: "rd", key: "rd", type: "time.Time", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [8], offset: 96, exported: false }, { name: "wd", key: "wd", type: "time.Time", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [9], offset: 120, exported: false }, { name: "closeErr", key: "closeErr", type: "error", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [10], offset: 144, exported: false }, { name: "pendingMu", key: "pendingMu", type: "sync.Mutex", pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [11], offset: 160, exported: false }, { name: "pending", key: "pending", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [12], offset: 168, exported: false }]
	)
}

export const connPktSize: number = 2048

export function newBufPool(poolSize: number, bufSize: number): bufPool | $.VarRef<bufPool> | null {
	return new bufPool({ch: $.makeChannel<$.Slice<number>>(poolSize, null, "both"), size: bufSize})
}

export async function NewRwcConn(ctx: context.Context | null, rwc: io.ReadWriteCloser | null, laddr: net.Addr | null, raddr: net.Addr | null, bufferPacketN: number): globalThis.Promise<RwcConn | $.VarRef<RwcConn> | null> {
	let __goscriptTuple1: any = contextutil.WithCancel(ctx)
	ctx = __goscriptTuple1[0]
	let ctxCancel = __goscriptTuple1[1]
	if (bufferPacketN <= 0) {
		bufferPacketN = 10
	}

	let c: RwcConn | $.VarRef<RwcConn> | null = (() => { const __goscriptLiteralField0 = newBufPool(bufferPacketN, 2048); return new RwcConn({ctx: ctx, ctxCancel: ctxCancel, rwc: rwc, laddr: laddr, raddr: raddr, pool: __goscriptLiteralField0, packetCh: $.makeChannel<$.Slice<number>>(bufferPacketN, null, "both")}) })()
	queueMicrotask(async () => { await RwcConn.prototype.rxPump.call(c) })
	return c
}
