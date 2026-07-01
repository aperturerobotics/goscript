// Generated file based on stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as net from "@goscript/net/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import type * as context from "@goscript/context/index.js"

import * as log from "@goscript/log/index.js"

import * as __goscript__const from "./const.gs.ts"

import * as __goscript_addr from "./addr.gs.ts"

import * as __goscript_deadline from "./deadline.gs.ts"

import * as __goscript_mux from "./mux.gs.ts"

import * as __goscript_ping from "./ping.gs.ts"

import * as __goscript_session from "./session.gs.ts"

import * as __goscript_util from "./util.gs.ts"
import "@goscript/fmt/index.js"
import "@goscript/net/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/log/index.js"
import "./const.gs.ts"
import "./addr.gs.ts"
import "./deadline.gs.ts"
import "./mux.gs.ts"
import "./ping.gs.ts"
import "./session.gs.ts"
import "./util.gs.ts"

export class Stream {
	public get sendWindow(): number {
		return this._fields.sendWindow.value
	}
	public set sendWindow(value: number) {
		this._fields.sendWindow.value = value
	}

	public get memorySpan(): __goscript_session.MemoryManager | null {
		return this._fields.memorySpan.value
	}
	public set memorySpan(value: __goscript_session.MemoryManager | null) {
		this._fields.memorySpan.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get session(): __goscript_session.Session | $.VarRef<__goscript_session.Session> | null {
		return this._fields.session.value
	}
	public set session(value: __goscript_session.Session | $.VarRef<__goscript_session.Session> | null) {
		this._fields.session.value = value
	}

	public get recvWindow(): number {
		return this._fields.recvWindow.value
	}
	public set recvWindow(value: number) {
		this._fields.recvWindow.value = value
	}

	public get epochStart(): time.Time {
		return this._fields.epochStart.value
	}
	public set epochStart(value: time.Time) {
		this._fields.epochStart.value = value
	}

	public get state(): streamState {
		return this._fields.state.value
	}
	public set state(value: streamState) {
		this._fields.state.value = value
	}

	public get writeState(): halfStreamState {
		return this._fields.writeState.value
	}
	public set writeState(value: halfStreamState) {
		this._fields.writeState.value = value
	}

	public get readState(): halfStreamState {
		return this._fields.readState.value
	}
	public set readState(value: halfStreamState) {
		this._fields.readState.value = value
	}

	public get stateLock(): sync.Mutex {
		return this._fields.stateLock.value
	}
	public set stateLock(value: sync.Mutex) {
		this._fields.stateLock.value = value
	}

	public get recvBuf(): __goscript_util.segmentedBuffer {
		return this._fields.recvBuf.value
	}
	public set recvBuf(value: __goscript_util.segmentedBuffer) {
		this._fields.recvBuf.value = value
	}

	public get recvNotifyCh(): $.Channel<{}> | null {
		return this._fields.recvNotifyCh.value
	}
	public set recvNotifyCh(value: $.Channel<{}> | null) {
		this._fields.recvNotifyCh.value = value
	}

	public get sendNotifyCh(): $.Channel<{}> | null {
		return this._fields.sendNotifyCh.value
	}
	public set sendNotifyCh(value: $.Channel<{}> | null) {
		this._fields.sendNotifyCh.value = value
	}

	public get readDeadline(): __goscript_deadline.pipeDeadline {
		return this._fields.readDeadline.value
	}
	public set readDeadline(value: __goscript_deadline.pipeDeadline) {
		this._fields.readDeadline.value = value
	}

	public get writeDeadline(): __goscript_deadline.pipeDeadline {
		return this._fields.writeDeadline.value
	}
	public set writeDeadline(value: __goscript_deadline.pipeDeadline) {
		this._fields.writeDeadline.value = value
	}

	public _fields: {
		sendWindow: $.VarRef<number>
		memorySpan: $.VarRef<__goscript_session.MemoryManager | null>
		id: $.VarRef<number>
		session: $.VarRef<__goscript_session.Session | $.VarRef<__goscript_session.Session> | null>
		recvWindow: $.VarRef<number>
		epochStart: $.VarRef<time.Time>
		state: $.VarRef<streamState>
		writeState: $.VarRef<halfStreamState>
		readState: $.VarRef<halfStreamState>
		stateLock: $.VarRef<sync.Mutex>
		recvBuf: $.VarRef<__goscript_util.segmentedBuffer>
		recvNotifyCh: $.VarRef<$.Channel<{}> | null>
		sendNotifyCh: $.VarRef<$.Channel<{}> | null>
		readDeadline: $.VarRef<__goscript_deadline.pipeDeadline>
		writeDeadline: $.VarRef<__goscript_deadline.pipeDeadline>
	}

	constructor(init?: Partial<{sendWindow?: number, memorySpan?: __goscript_session.MemoryManager | null, id?: number, session?: __goscript_session.Session | $.VarRef<__goscript_session.Session> | null, recvWindow?: number, epochStart?: time.Time, state?: streamState, writeState?: halfStreamState, readState?: halfStreamState, stateLock?: sync.Mutex, recvBuf?: __goscript_util.segmentedBuffer, recvNotifyCh?: $.Channel<{}> | null, sendNotifyCh?: $.Channel<{}> | null, readDeadline?: __goscript_deadline.pipeDeadline, writeDeadline?: __goscript_deadline.pipeDeadline}>) {
		this._fields = {
			sendWindow: $.varRef(init?.sendWindow ?? (0 as number)),
			memorySpan: $.varRef(init?.memorySpan ?? (null as __goscript_session.MemoryManager | null)),
			id: $.varRef(init?.id ?? (0 as number)),
			session: $.varRef(init?.session ?? (null as __goscript_session.Session | $.VarRef<__goscript_session.Session> | null)),
			recvWindow: $.varRef(init?.recvWindow ?? (0 as number)),
			epochStart: $.varRef(init?.epochStart ? $.markAsStructValue($.cloneStructValue(init.epochStart)) : $.markAsStructValue(new time.Time())),
			state: $.varRef(init?.state ?? (0 as streamState)),
			writeState: $.varRef(init?.writeState ?? (0 as halfStreamState)),
			readState: $.varRef(init?.readState ?? (0 as halfStreamState)),
			stateLock: $.varRef(init?.stateLock ? $.markAsStructValue($.cloneStructValue(init.stateLock)) : $.markAsStructValue(new sync.Mutex())),
			recvBuf: $.varRef(init?.recvBuf ? $.markAsStructValue($.cloneStructValue(init.recvBuf)) : $.markAsStructValue(new __goscript_util.segmentedBuffer())),
			recvNotifyCh: $.varRef(init?.recvNotifyCh ?? (null as $.Channel<{}> | null)),
			sendNotifyCh: $.varRef(init?.sendNotifyCh ?? (null as $.Channel<{}> | null)),
			readDeadline: $.varRef(init?.readDeadline ? $.markAsStructValue($.cloneStructValue(init.readDeadline)) : $.markAsStructValue(new __goscript_deadline.pipeDeadline())),
			writeDeadline: $.varRef(init?.writeDeadline ? $.markAsStructValue($.cloneStructValue(init.writeDeadline)) : $.markAsStructValue(new __goscript_deadline.pipeDeadline()))
		}
	}

	public clone(): Stream {
		const cloned = new Stream()
		cloned._fields = {
			sendWindow: $.varRef(this._fields.sendWindow.value),
			memorySpan: $.varRef(this._fields.memorySpan.value),
			id: $.varRef(this._fields.id.value),
			session: $.varRef(this._fields.session.value),
			recvWindow: $.varRef(this._fields.recvWindow.value),
			epochStart: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.epochStart.value))),
			state: $.varRef(this._fields.state.value),
			writeState: $.varRef(this._fields.writeState.value),
			readState: $.varRef(this._fields.readState.value),
			stateLock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.stateLock.value))),
			recvBuf: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.recvBuf.value))),
			recvNotifyCh: $.varRef(this._fields.recvNotifyCh.value),
			sendNotifyCh: $.varRef(this._fields.sendNotifyCh.value),
			readDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readDeadline.value))),
			writeDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeDeadline.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		await Stream.prototype.CloseRead.call(s)
		return Stream.prototype.CloseWrite.call(s)
	}

	public async CloseRead(): globalThis.Promise<$.GoError> {
		let s: Stream | $.VarRef<Stream> | null = this
		let cleanup = false
		await $.pointerValue<Stream>(s).stateLock.Lock()
		switch ($.pointerValue<Stream>(s).readState) {
			case 0:
			{
				break
			}
			case 1:
			case 2:
			{
				$.pointerValue<Stream>(s).stateLock.Unlock()
				return null
				break
			}
			default:
			{
				$.panic("invalid state")
				break
			}
		}
		$.pointerValue<Stream>(s).readState = 2
		cleanup = $.pointerValue<Stream>(s).writeState != 0
		if (cleanup) {
			$.pointerValue<Stream>(s).state = 4
		}
		$.pointerValue<Stream>(s).stateLock.Unlock()
		await Stream.prototype.notifyWaiting.call(s)
		if (cleanup) {
			// we're fully closed, might as well be nice to the user and
			// free everything early.
			await Stream.prototype.cleanup.call(s)
		}
		return null
	}

	public async CloseWrite(): globalThis.Promise<$.GoError> {
		let s: Stream | $.VarRef<Stream> | null = this
		await $.pointerValue<Stream>(s).stateLock.Lock()
		switch ($.pointerValue<Stream>(s).writeState) {
			case 0:
			{
				break
			}
			case 1:
			{
				$.pointerValue<Stream>(s).stateLock.Unlock()
				return null
				break
			}
			case 2:
			{
				$.pointerValue<Stream>(s).stateLock.Unlock()
				return $.interfaceValue<$.GoError>(__goscript__const.ErrStreamReset, "*yamux.Error")
				break
			}
			default:
			{
				$.panic("invalid state")
				break
			}
		}
		$.pointerValue<Stream>(s).writeState = 1
		let cleanup = $.pointerValue<Stream>(s).readState != 0
		if (cleanup) {
			$.pointerValue<Stream>(s).state = 4
		}
		$.pointerValue<Stream>(s).stateLock.Unlock()
		await Stream.prototype.notifyWaiting.call(s)

		let err = await Stream.prototype.sendClose.call(s)
		if (cleanup) {
			// we're fully closed, might as well be nice to the user and
			// free everything early.
			await Stream.prototype.cleanup.call(s)
		}
		return err
	}

	public async LocalAddr(): globalThis.Promise<net.Addr | null> {
		const s: Stream | $.VarRef<Stream> | null = this
		return __goscript_session.Session.prototype.LocalAddr.call($.pointerValue<Stream>(s).session)
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: Stream | $.VarRef<Stream> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		START: while (true) {
			await $.pointerValue<Stream>(s).stateLock.Lock()

			var state = $.pointerValue<Stream>(s).readState
			$.pointerValue<Stream>(s).stateLock.Unlock()

			switch (state) {
				case 0:
				{
					break
				}
				case 1:
				{
					let empty = $.uint(await $.pointerValue<Stream>(s).recvBuf.Len(), 32) == $.uint(0, 32)
					if (empty) {
						return [0, io.EOF]
					}
					break
				}
				case 2:
				{
					return [0, $.interfaceValue<$.GoError>(__goscript__const.ErrStreamReset, "*yamux.Error")]
					break
				}
				default:
				{
					$.panic("unknown state")
					break
				}
			}

			// If there is no data available, block
			if ($.uint(await $.pointerValue<Stream>(s).recvBuf.Len(), 32) == $.uint(0, 32)) {
				const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, any>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Stream>(s).recvNotifyCh,
						onSelected: async (__goscriptSelect0Result) => {
							return __goscriptSelect0Result
						}
					},
					{
						id: 1,
						isSend: false,
						channel: await $.pointerValue<Stream>(s).readDeadline.wait(),
						onSelected: async (__goscriptSelect0Result) => {
							return __goscriptSelect0Result
						}
					}
				], false)
				switch (__goscriptSelect0Value?.id) {
					case 0:
						{
							const __goscriptSelect0Result = __goscriptSelect0Value
							continue START
							break
						}
					case 1:
						{
							const __goscriptSelect0Result = __goscriptSelect0Value
							return [0, $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")]
							break
						}
				}
			}
			break
		}

		// Read any bytes
		let __goscriptTuple0: any = await $.pointerValue<Stream>(s).recvBuf.Read(b)
		n = __goscriptTuple0[0]

		// Send a window update potentially
		err = await Stream.prototype.sendWindowUpdate.call(s, await $.pointerValue<Stream>(s).readDeadline.wait())
		return [n, err]
	}

	public async RemoteAddr(): globalThis.Promise<net.Addr | null> {
		const s: Stream | $.VarRef<Stream> | null = this
		return __goscript_session.Session.prototype.RemoteAddr.call($.pointerValue<Stream>(s).session)
	}

	public async Reset(): globalThis.Promise<$.GoError> {
		let s: Stream | $.VarRef<Stream> | null = this
		let sendReset = false
		await $.pointerValue<Stream>(s).stateLock.Lock()
		switch ($.pointerValue<Stream>(s).state) {
			case 4:
			{
				$.pointerValue<Stream>(s).stateLock.Unlock()
				return null
				break
			}
			case 0:
			{
				break
			}
			case 1:
			case 2:
			case 3:
			{
				sendReset = true
				break
			}
			default:
			{
				$.panic("unhandled state")
				break
			}
		}

		// at least one direction is open, we need to reset.

		// If we've already sent/received an EOF, no need to reset that side.
		if ($.pointerValue<Stream>(s).writeState == 0) {
			$.pointerValue<Stream>(s).writeState = 2
		}
		if ($.pointerValue<Stream>(s).readState == 0) {
			$.pointerValue<Stream>(s).readState = 2
		}
		$.pointerValue<Stream>(s).state = 4
		await Stream.prototype.notifyWaiting.call(s)
		$.pointerValue<Stream>(s).stateLock.Unlock()
		if (sendReset) {
			await Stream.prototype.sendReset.call(s)
		}
		await Stream.prototype.cleanup.call(s)
		return null
	}

	public Session(): __goscript_session.Session | $.VarRef<__goscript_session.Session> | null {
		const s: Stream | $.VarRef<Stream> | null = this
		return $.pointerValue<Stream>(s).session
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		{
			let err = await Stream.prototype.SetReadDeadline.call(s, $.markAsStructValue($.cloneStructValue(t)))
			if (err != null) {
				return err
			}
		}
		{
			let err = await Stream.prototype.SetWriteDeadline.call(s, $.markAsStructValue($.cloneStructValue(t)))
			if (err != null) {
				return err
			}
		}
		return null
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Stream>(s).stateLock.Lock()
		__defer.defer(() => { $.pointerValue<Stream>(s).stateLock.Unlock() })
		if ($.pointerValue<Stream>(s).readState == 0) {
			await $.pointerValue<Stream>(s).readDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		}
		return null
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Stream>(s).stateLock.Lock()
		__defer.defer(() => { $.pointerValue<Stream>(s).stateLock.Unlock() })
		if ($.pointerValue<Stream>(s).writeState == 0) {
			await $.pointerValue<Stream>(s).writeDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		}
		return null
	}

	public StreamID(): number {
		const s: Stream | $.VarRef<Stream> | null = this
		return $.uint($.pointerValue<Stream>(s).id, 32)
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: Stream | $.VarRef<Stream> | null = this
		let total: number = 0
		while (total < $.len(b)) {
			let [n, err] = await Stream.prototype.write.call(s, $.goSlice(b, total, undefined))
			total = total + (n)
			if (err != null) {
				return [total, err]
			}
		}
		return [total, null]
	}

	public async cleanup(): globalThis.Promise<void> {
		const s: Stream | $.VarRef<Stream> | null = this
		await __goscript_session.Session.prototype.closeStream.call($.pointerValue<Stream>(s).session, $.uint($.pointerValue<Stream>(s).id, 32))
		await $.pointerValue<Stream>(s).readDeadline.set($.markAsStructValue(new time.Time()))
		await $.pointerValue<Stream>(s).writeDeadline.set($.markAsStructValue(new time.Time()))
	}

	public async forceClose(): globalThis.Promise<void> {
		let s: Stream | $.VarRef<Stream> | null = this
		await $.pointerValue<Stream>(s).stateLock.Lock()
		if ($.pointerValue<Stream>(s).readState == 0) {
			$.pointerValue<Stream>(s).readState = 2
		}
		if ($.pointerValue<Stream>(s).writeState == 0) {
			$.pointerValue<Stream>(s).writeState = 2
		}
		$.pointerValue<Stream>(s).state = 4
		await Stream.prototype.notifyWaiting.call(s)
		$.pointerValue<Stream>(s).stateLock.Unlock()

		await $.pointerValue<Stream>(s).readDeadline.set($.markAsStructValue(new time.Time()))
		await $.pointerValue<Stream>(s).writeDeadline.set($.markAsStructValue(new time.Time()))
	}

	public async incrSendWindow(hdr: __goscript__const.header, flags: number): globalThis.Promise<void> {
		const s: Stream | $.VarRef<Stream> | null = this
		await Stream.prototype.processFlags.call(s, $.uint(flags, 16))
		// Increase window, unblock a sender
		atomic.AddUint32($.pointerValue<Stream>(s)._fields.sendWindow, $.uint(__goscript__const.header_Length(hdr), 32))
		await __goscript_util.asyncNotify($.pointerValue<Stream>(s).sendNotifyCh)
	}

	public async notifyWaiting(): globalThis.Promise<void> {
		const s: Stream | $.VarRef<Stream> | null = this
		await __goscript_util.asyncNotify($.pointerValue<Stream>(s).recvNotifyCh)
		await __goscript_util.asyncNotify($.pointerValue<Stream>(s).sendNotifyCh)
	}

	public async processFlags(flags: number): globalThis.Promise<void> {
		let s: Stream | $.VarRef<Stream> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// Close the stream without holding the state lock
		let closeStream: boolean = false
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			if (closeStream) {
				await Stream.prototype.cleanup.call(s)
			}
		})() })

		if ($.uint((flags & 2), 16) == $.uint(2, 16)) {
			await $.pointerValue<Stream>(s).stateLock.Lock()
			if ($.pointerValue<Stream>(s).state == 1) {
				$.pointerValue<Stream>(s).state = 3
			}
			$.pointerValue<Stream>(s).stateLock.Unlock()
			await __goscript_session.Session.prototype.establishStream.call($.pointerValue<Stream>(s).session, $.uint($.pointerValue<Stream>(s).id, 32))
		}
		if ($.uint((flags & 4), 16) == $.uint(4, 16)) {
			let notify: boolean = false
			await $.pointerValue<Stream>(s).stateLock.Lock()
			if ($.pointerValue<Stream>(s).readState == 0) {
				$.pointerValue<Stream>(s).readState = 1
				if ($.pointerValue<Stream>(s).writeState != 0) {
					// We're now fully closed.
					closeStream = true
					$.pointerValue<Stream>(s).state = 4
				}
				notify = true
			}
			$.pointerValue<Stream>(s).stateLock.Unlock()
			if (notify) {
				await Stream.prototype.notifyWaiting.call(s)
			}
		}
		if ($.uint((flags & 8), 16) == $.uint(8, 16)) {
			await $.pointerValue<Stream>(s).stateLock.Lock()
			if ($.pointerValue<Stream>(s).readState == 0) {
				$.pointerValue<Stream>(s).readState = 2
			}
			if ($.pointerValue<Stream>(s).writeState == 0) {
				$.pointerValue<Stream>(s).writeState = 2
			}
			$.pointerValue<Stream>(s).state = 4
			$.pointerValue<Stream>(s).stateLock.Unlock()
			closeStream = true
			await Stream.prototype.notifyWaiting.call(s)
		}
	}

	public async readData(hdr: __goscript__const.header, flags: number, conn: io.Reader | null): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		await Stream.prototype.processFlags.call(s, $.uint(flags, 16))

		// Check that our recv window is not exceeded
		let length = $.uint(__goscript__const.header_Length(hdr), 32)
		if ($.uint(length, 32) == $.uint(0, 32)) {
			return null
		}

		// Copy into buffer
		{
			let err = await $.pointerValue<Stream>(s).recvBuf.Append(conn, $.uint(length, 32))
			if (err != null) {
				await log.Logger.prototype.Printf.call($.pointerValue<__goscript_session.Session>($.pointerValue<Stream>(s).session).logger, "[ERR] yamux: Failed to read stream data on stream %d: %v", $.arrayToSlice<any>([$.namedValueInterfaceValue<any>($.pointerValue<Stream>(s).id, "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }), (err as any)]))
				return err
			}
		}
		// Unblock the reader
		await __goscript_util.asyncNotify($.pointerValue<Stream>(s).recvNotifyCh)
		return null
	}

	public async sendClose(): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		let flags = $.uint(await Stream.prototype.sendFlags.call(s), 16)
		flags = flags | ($.uint(4, 16))
		let hdr = __goscript__const.encode($.uint(1, 8), $.uint(flags, 16), $.uint($.pointerValue<Stream>(s).id, 32), $.uint(0, 32))
		return __goscript_session.Session.prototype.sendMsg.call($.pointerValue<Stream>(s).session, hdr, null, null)
	}

	public async sendFlags(): globalThis.Promise<number> {
		let s: Stream | $.VarRef<Stream> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Stream>(s).stateLock.Lock()
		__defer.defer(() => { $.pointerValue<Stream>(s).stateLock.Unlock() })
		let flags: number = 0
		switch ($.pointerValue<Stream>(s).state) {
			case 0:
			{
				flags = flags | ($.uint(1, 16))
				$.pointerValue<Stream>(s).state = 1
				break
			}
			case 2:
			{
				flags = flags | ($.uint(2, 16))
				$.pointerValue<Stream>(s).state = 3
				break
			}
		}
		return $.uint(flags, 16)
	}

	public async sendReset(): globalThis.Promise<$.GoError> {
		const s: Stream | $.VarRef<Stream> | null = this
		let hdr = __goscript__const.encode($.uint(1, 8), $.uint(8, 16), $.uint($.pointerValue<Stream>(s).id, 32), $.uint(0, 32))
		return __goscript_session.Session.prototype.sendMsg.call($.pointerValue<Stream>(s).session, hdr, null, null)
	}

	public async sendWindowUpdate(deadline: $.Channel<{}> | null): globalThis.Promise<$.GoError> {
		let s: Stream | $.VarRef<Stream> | null = this
		// Determine the flags if any
		let flags = $.uint(await Stream.prototype.sendFlags.call(s), 16)

		// Update the receive window.
		let __goscriptTuple1: any = await $.pointerValue<Stream>(s).recvBuf.GrowTo($.uint($.pointerValue<Stream>(s).recvWindow, 32), $.uint(flags, 16) != $.uint(0, 16))
		let needed = __goscriptTuple1[0]
		let delta = $.uint(__goscriptTuple1[1], 32)
		if (!needed) {
			return null
		}

		let now = $.markAsStructValue($.cloneStructValue(time.Now()))
		{
			let rtt = __goscript_session.Session.prototype.getRTT.call($.pointerValue<Stream>(s).session)
			if ((($.uint(flags, 16) == $.uint(0, 16)) && (rtt > 0n)) && ($.markAsStructValue($.cloneStructValue(now)).Sub($.markAsStructValue($.cloneStructValue($.pointerValue<Stream>(s).epochStart))) < ($.int64Mul(rtt, 4)))) {
				let recvWindow: number = 0
				if ($.uint($.pointerValue<Stream>(s).recvWindow, 32) > $.uint((Math.trunc(math.MaxUint32 / 2)), 32)) {
					recvWindow = $.uint(__goscript_util.min($.arrayToSlice<number>([$.uint(math.MaxUint32, 32), $.uint($.pointerValue<__goscript_mux.Config>($.pointerValue<__goscript_session.Session>($.pointerValue<Stream>(s).session).config).MaxStreamWindowSize, 32)])), 32)
				} else {
					recvWindow = $.uint(__goscript_util.min($.arrayToSlice<number>([$.uint($.pointerValue<Stream>(s).recvWindow * 2, 32), $.uint($.pointerValue<__goscript_mux.Config>($.pointerValue<__goscript_session.Session>($.pointerValue<Stream>(s).session).config).MaxStreamWindowSize, 32)])), 32)
				}
				if ($.uint(recvWindow, 32) > $.uint($.pointerValue<Stream>(s).recvWindow, 32)) {
					let grow = $.uint(recvWindow - $.pointerValue<Stream>(s).recvWindow, 32)
					{
						let err = await $.pointerValue<Exclude<__goscript_session.MemoryManager, null>>($.pointerValue<Stream>(s).memorySpan).ReserveMemory($.int(grow), $.uint(128, 8))
						if (err == null) {
							$.pointerValue<Stream>(s).recvWindow = $.uint(recvWindow, 32)
							let __goscriptTuple2: any = await $.pointerValue<Stream>(s).recvBuf.GrowTo($.uint($.pointerValue<Stream>(s).recvWindow, 32), true)
							delta = $.uint(__goscriptTuple2[1], 32)
						}
					}
				}
			}
		}

		$.pointerValue<Stream>(s).epochStart = $.markAsStructValue($.cloneStructValue(now))
		let hdr = __goscript__const.encode($.uint(1, 8), $.uint(flags, 16), $.uint($.pointerValue<Stream>(s).id, 32), $.uint(delta, 32))
		return __goscript_session.Session.prototype.sendMsg.call($.pointerValue<Stream>(s).session, hdr, null, deadline)
	}

	public async write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: Stream | $.VarRef<Stream> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let flags: number = 0
		let max: number = 0
		let hdr: __goscript__const.header = new Uint8Array(12)

		START: while (true) {
			await $.pointerValue<Stream>(s).stateLock.Lock()

			var state = $.pointerValue<Stream>(s).writeState
			$.pointerValue<Stream>(s).stateLock.Unlock()

			switch (state) {
				case 0:
				{
					break
				}
				case 1:
				{
					return [0, $.interfaceValue<$.GoError>(__goscript__const.ErrStreamClosed, "*yamux.Error")]
					break
				}
				case 2:
				{
					return [0, $.interfaceValue<$.GoError>(__goscript__const.ErrStreamReset, "*yamux.Error")]
					break
				}
				default:
				{
					$.panic("unknown state")
					break
				}
			}

			// If there is no data available, block
			var window = $.uint(atomic.LoadUint32($.pointerValue<Stream>(s)._fields.sendWindow), 32)
			if ($.uint(window, 32) == $.uint(0, 32)) {
				const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, any>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Stream>(s).sendNotifyCh,
						onSelected: async (__goscriptSelect1Result) => {
							return __goscriptSelect1Result
						}
					},
					{
						id: 1,
						isSend: false,
						channel: await $.pointerValue<Stream>(s).writeDeadline.wait(),
						onSelected: async (__goscriptSelect1Result) => {
							return __goscriptSelect1Result
						}
					}
				], false)
				switch (__goscriptSelect1Value?.id) {
					case 0:
						{
							const __goscriptSelect1Result = __goscriptSelect1Value
							continue START
							break
						}
					case 1:
						{
							const __goscriptSelect1Result = __goscriptSelect1Value
							return [0, $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")]
							break
						}
				}
			}
			break
		}

		// Determine the flags if any
		flags = $.uint(await Stream.prototype.sendFlags.call(s), 16)

		// Send up to min(message, window
		max = $.uint(__goscript_util.min($.arrayToSlice<number>([$.uint(window, 32), $.uint($.pointerValue<__goscript_mux.Config>($.pointerValue<__goscript_session.Session>($.pointerValue<Stream>(s).session).config).MaxMessageSize - 12, 32), $.uint($.uint($.len(b), 32), 32)])), 32)

		// Send the header
		hdr = __goscript__const.encode($.uint(0, 8), $.uint(flags, 16), $.uint($.pointerValue<Stream>(s).id, 32), $.uint(max, 32))
		{
			err = await __goscript_session.Session.prototype.sendMsg.call($.pointerValue<Stream>(s).session, hdr, $.goSlice(b, undefined, max), await $.pointerValue<Stream>(s).writeDeadline.wait())
			if (err != null) {
				return [0, err]
			}
		}

		// Reduce our send window
		atomic.AddUint32($.pointerValue<Stream>(s)._fields.sendWindow, $.uint($.uint(~$.uint(max - 1, 32), 32), 32))

		// Unlock
		return [$.int(max), err]
	}

	static __typeInfo = $.registerStructType(
		"yamux.Stream",
		() => new Stream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Reset", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Session", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Session" } }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "StreamID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "cleanup", args: [], returns: [] }, { name: "forceClose", args: [], returns: [] }, { name: "incrSendWindow", args: [{ name: "hdr", type: "yamux.header" }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "notifyWaiting", args: [], returns: [] }, { name: "processFlags", args: [{ name: "flags", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [] }, { name: "readData", args: [{ name: "hdr", type: "yamux.header" }, { name: "flags", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "conn", type: "io.Reader" }], returns: [{ name: "_r0", type: "error" }] }, { name: "sendClose", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendFlags", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "sendReset", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "sendWindowUpdate", args: [{ name: "deadline", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		Stream,
		[{ name: "sendWindow", key: "sendWindow", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "memorySpan", key: "memorySpan", type: "yamux.MemoryManager", pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 24, exported: false }, { name: "session", key: "session", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 32, exported: false }, { name: "recvWindow", key: "recvWindow", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 40, exported: false }, { name: "epochStart", key: "epochStart", type: "time.Time", pkgPath: "github.com/libp2p/go-yamux/v4", index: [5], offset: 48, exported: false }, { name: "state", key: "state", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.streamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [6], offset: 72, exported: false }, { name: "writeState", key: "writeState", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.halfStreamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [7], offset: 80, exported: false }, { name: "readState", key: "readState", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.halfStreamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [8], offset: 88, exported: false }, { name: "stateLock", key: "stateLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [9], offset: 96, exported: false }, { name: "recvBuf", key: "recvBuf", type: "yamux.segmentedBuffer", pkgPath: "github.com/libp2p/go-yamux/v4", index: [10], offset: 104, exported: false }, { name: "recvNotifyCh", key: "recvNotifyCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [11], offset: 160, exported: false }, { name: "sendNotifyCh", key: "sendNotifyCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [12], offset: 168, exported: false }, { name: "readDeadline", key: "readDeadline", type: "yamux.pipeDeadline", pkgPath: "github.com/libp2p/go-yamux/v4", index: [13], offset: 176, exported: false }, { name: "writeDeadline", key: "writeDeadline", type: "yamux.pipeDeadline", pkgPath: "github.com/libp2p/go-yamux/v4", index: [14], offset: 200, exported: false }]
	)
}

export const streamInit: streamState = 0

export const streamSYNSent: streamState = 1

export const streamSYNReceived: streamState = 2

export const streamEstablished: streamState = 3

export const streamFinished: streamState = 4

export const halfOpen: halfStreamState = 0

export const halfClosed: halfStreamState = 1

export const halfReset: halfStreamState = 2

export type streamState = number

export type halfStreamState = number

export function newStream(session: __goscript_session.Session | $.VarRef<__goscript_session.Session> | null, id: number, state: streamState, initialWindow: number, memorySpan: __goscript_session.MemoryManager | null): Stream | $.VarRef<Stream> | null {
	let s: Stream | $.VarRef<Stream> | null = (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(__goscript_deadline.makePipeDeadline())); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(__goscript_deadline.makePipeDeadline())); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(__goscript_util.newSegmentedBuffer($.uint(initialWindow, 32)))); const __goscriptLiteralField3 = $.markAsStructValue($.cloneStructValue(time.Now())); return new Stream({id: $.uint(id, 32), session: session, state: state, sendWindow: $.uint(262144, 32), readDeadline: __goscriptLiteralField0, writeDeadline: __goscriptLiteralField1, memorySpan: memorySpan, recvBuf: __goscriptLiteralField2, recvWindow: $.uint($.pointerValue<__goscript_mux.Config>($.pointerValue<__goscript_session.Session>(session).config).InitialStreamWindowSize, 32), epochStart: __goscriptLiteralField3, recvNotifyCh: $.makeChannel<{}>(1, {}, "both"), sendNotifyCh: $.makeChannel<{}>(1, {}, "both")}) })()
	return s
}
