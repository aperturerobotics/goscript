// Generated file based on session.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as net from "@goscript/net/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as log from "@goscript/log/index.js"

import * as math from "@goscript/math/index.js"

import * as os from "@goscript/os/index.js"

import * as debug from "@goscript/runtime/debug/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as pool from "@goscript/github.com/libp2p/go-buffer-pool/index.js"

import * as __goscript__const from "./const.gs.ts"

import * as __goscript_addr from "./addr.gs.ts"

import * as __goscript_deadline from "./deadline.gs.ts"

import * as __goscript_mux from "./mux.gs.ts"

import * as __goscript_ping from "./ping.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_util from "./util.gs.ts"
import "@goscript/fmt/index.js"
import "@goscript/net/index.js"
import "@goscript/bufio/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/log/index.js"
import "@goscript/math/index.js"
import "@goscript/os/index.js"
import "@goscript/runtime/debug/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/libp2p/go-buffer-pool/index.js"
import "./const.gs.ts"
import "./addr.gs.ts"
import "./deadline.gs.ts"
import "./mux.gs.ts"
import "./ping.gs.ts"
import "./stream.gs.ts"
import "./util.gs.ts"

export type MemoryManager = {
	Done(): void
	ReleaseMemory(size: number): void
	ReserveMemory(size: number, prio: number): $.GoError
}

$.registerInterfaceType(
	"yamux.MemoryManager",
	null,
	[{ name: "Done", args: [], returns: [] }, { name: "ReleaseMemory", args: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "ReserveMemory", args: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "prio", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: "error" }] }]
);

export class nullMemoryManagerImpl {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): nullMemoryManagerImpl {
		const cloned = new nullMemoryManagerImpl()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Done(): void {
		const n = this
	}

	public ReleaseMemory(size: number): void {
		const n = this
	}

	public ReserveMemory(size: number, prio: number): $.GoError {
		const n = this
		return null
	}

	static __typeInfo = $.registerStructType(
		"yamux.nullMemoryManagerImpl",
		() => new nullMemoryManagerImpl(),
		[{ name: "Done", args: [], returns: [] }, { name: "ReleaseMemory", args: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "ReserveMemory", args: [{ name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "prio", type: { kind: $.TypeKind.Basic, name: "uint8" } }], returns: [{ name: "_r0", type: "error" }] }],
		nullMemoryManagerImpl,
		[]
	)
}

export class Session {
	public get rtt(): bigint {
		return this._fields.rtt.value
	}
	public set rtt(value: bigint) {
		this._fields.rtt.value = value
	}

	// remoteGoAway indicates the remote side does
	// not want futher connections. Must be first for alignment.
	public get remoteGoAway(): number {
		return this._fields.remoteGoAway.value
	}
	public set remoteGoAway(value: number) {
		this._fields.remoteGoAway.value = value
	}

	// localGoAway indicates that we should stop
	// accepting futher connections. Must be first for alignment.
	public get localGoAway(): number {
		return this._fields.localGoAway.value
	}
	public set localGoAway(value: number) {
		this._fields.localGoAway.value = value
	}

	// nextStreamID is the next stream we should
	// send. This depends if we are a client/server.
	public get nextStreamID(): number {
		return this._fields.nextStreamID.value
	}
	public set nextStreamID(value: number) {
		this._fields.nextStreamID.value = value
	}

	// config holds our configuration
	public get config(): __goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null {
		return this._fields.config.value
	}
	public set config(value: __goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null) {
		this._fields.config.value = value
	}

	// logger is used for our logs
	public get logger(): log.Logger | $.VarRef<log.Logger> | null {
		return this._fields.logger.value
	}
	public set logger(value: log.Logger | $.VarRef<log.Logger> | null) {
		this._fields.logger.value = value
	}

	// conn is the underlying connection
	public get conn(): net.Conn | null {
		return this._fields.conn.value
	}
	public set conn(value: net.Conn | null) {
		this._fields.conn.value = value
	}

	// reader is a buffered reader
	public get reader(): io.Reader | null {
		return this._fields.reader.value
	}
	public set reader(value: io.Reader | null) {
		this._fields.reader.value = value
	}

	public get newMemoryManager(): (() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null {
		return this._fields.newMemoryManager.value
	}
	public set newMemoryManager(value: (() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null) {
		this._fields.newMemoryManager.value = value
	}

	// pings is used to track inflight pings
	public get pingLock(): sync.Mutex {
		return this._fields.pingLock.value
	}
	public set pingLock(value: sync.Mutex) {
		this._fields.pingLock.value = value
	}

	public get pingID(): number {
		return this._fields.pingID.value
	}
	public set pingID(value: number) {
		this._fields.pingID.value = value
	}

	public get activePing(): __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null {
		return this._fields.activePing.value
	}
	public set activePing(value: __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null) {
		this._fields.activePing.value = value
	}

	// streams maps a stream id to a stream, and inflight has an entry
	// for any outgoing stream that has not yet been established. Both are
	// protected by streamLock.
	public get numIncomingStreams(): number {
		return this._fields.numIncomingStreams.value
	}
	public set numIncomingStreams(value: number) {
		this._fields.numIncomingStreams.value = value
	}

	public get streams(): globalThis.Map<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null {
		return this._fields.streams.value
	}
	public set streams(value: globalThis.Map<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null) {
		this._fields.streams.value = value
	}

	public get inflight(): globalThis.Map<number, {}> | null {
		return this._fields.inflight.value
	}
	public set inflight(value: globalThis.Map<number, {}> | null) {
		this._fields.inflight.value = value
	}

	public get streamLock(): sync.Mutex {
		return this._fields.streamLock.value
	}
	public set streamLock(value: sync.Mutex) {
		this._fields.streamLock.value = value
	}

	// synCh acts like a semaphore. It is sized to the AcceptBacklog which
	// is assumed to be symmetric between the client and server. This allows
	// the client to avoid exceeding the backlog and instead blocks the open.
	public get synCh(): $.Channel<{}> | null {
		return this._fields.synCh.value
	}
	public set synCh(value: $.Channel<{}> | null) {
		this._fields.synCh.value = value
	}

	// acceptCh is used to pass ready streams to the client
	public get acceptCh(): $.Channel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null {
		return this._fields.acceptCh.value
	}
	public set acceptCh(value: $.Channel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null) {
		this._fields.acceptCh.value = value
	}

	// sendCh is used to send messages
	public get sendCh(): $.Channel<$.Slice<number>> | null {
		return this._fields.sendCh.value
	}
	public set sendCh(value: $.Channel<$.Slice<number>> | null) {
		this._fields.sendCh.value = value
	}

	// pingCh and pingCh are used to send pings and pongs
	public get pongCh(): $.Channel<number> | null {
		return this._fields.pongCh.value
	}
	public set pongCh(value: $.Channel<number> | null) {
		this._fields.pongCh.value = value
	}

	// pingCh and pingCh are used to send pings and pongs
	public get pingCh(): $.Channel<number> | null {
		return this._fields.pingCh.value
	}
	public set pingCh(value: $.Channel<number> | null) {
		this._fields.pingCh.value = value
	}

	// recvDoneCh is closed when recv() exits to avoid a race
	// between stream registration and stream shutdown
	public get recvDoneCh(): $.Channel<{}> | null {
		return this._fields.recvDoneCh.value
	}
	public set recvDoneCh(value: $.Channel<{}> | null) {
		this._fields.recvDoneCh.value = value
	}

	// sendDoneCh is closed when send() exits to avoid a race
	// between returning from a Stream.Write and exiting from the send loop
	// (which may be reading a buffer on-load-from Stream.Write).
	public get sendDoneCh(): $.Channel<{}> | null {
		return this._fields.sendDoneCh.value
	}
	public set sendDoneCh(value: $.Channel<{}> | null) {
		this._fields.sendDoneCh.value = value
	}

	// client is true if we're the client and our stream IDs should be odd.
	public get client(): boolean {
		return this._fields.client.value
	}
	public set client(value: boolean) {
		this._fields.client.value = value
	}

	// shutdown is used to safely close a session
	public get shutdown(): boolean {
		return this._fields.shutdown.value
	}
	public set shutdown(value: boolean) {
		this._fields.shutdown.value = value
	}

	public get shutdownErr(): $.GoError {
		return this._fields.shutdownErr.value
	}
	public set shutdownErr(value: $.GoError) {
		this._fields.shutdownErr.value = value
	}

	public get shutdownCh(): $.Channel<{}> | null {
		return this._fields.shutdownCh.value
	}
	public set shutdownCh(value: $.Channel<{}> | null) {
		this._fields.shutdownCh.value = value
	}

	public get shutdownLock(): sync.Mutex {
		return this._fields.shutdownLock.value
	}
	public set shutdownLock(value: sync.Mutex) {
		this._fields.shutdownLock.value = value
	}

	// keepaliveTimer is a periodic timer for keepalive messages. It's nil
	// when keepalives are disabled.
	public get keepaliveLock(): sync.Mutex {
		return this._fields.keepaliveLock.value
	}
	public set keepaliveLock(value: sync.Mutex) {
		this._fields.keepaliveLock.value = value
	}

	public get keepaliveTimer(): time.Timer | $.VarRef<time.Timer> | null {
		return this._fields.keepaliveTimer.value
	}
	public set keepaliveTimer(value: time.Timer | $.VarRef<time.Timer> | null) {
		this._fields.keepaliveTimer.value = value
	}

	public get keepaliveActive(): boolean {
		return this._fields.keepaliveActive.value
	}
	public set keepaliveActive(value: boolean) {
		this._fields.keepaliveActive.value = value
	}

	public _fields: {
		rtt: $.VarRef<bigint>
		remoteGoAway: $.VarRef<number>
		localGoAway: $.VarRef<number>
		nextStreamID: $.VarRef<number>
		config: $.VarRef<__goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null>
		logger: $.VarRef<log.Logger | $.VarRef<log.Logger> | null>
		conn: $.VarRef<net.Conn | null>
		reader: $.VarRef<io.Reader | null>
		newMemoryManager: $.VarRef<(() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null>
		pingLock: $.VarRef<sync.Mutex>
		pingID: $.VarRef<number>
		activePing: $.VarRef<__goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null>
		numIncomingStreams: $.VarRef<number>
		streams: $.VarRef<globalThis.Map<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null>
		inflight: $.VarRef<globalThis.Map<number, {}> | null>
		streamLock: $.VarRef<sync.Mutex>
		synCh: $.VarRef<$.Channel<{}> | null>
		acceptCh: $.VarRef<$.Channel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null>
		sendCh: $.VarRef<$.Channel<$.Slice<number>> | null>
		pongCh: $.VarRef<$.Channel<number> | null>
		pingCh: $.VarRef<$.Channel<number> | null>
		recvDoneCh: $.VarRef<$.Channel<{}> | null>
		sendDoneCh: $.VarRef<$.Channel<{}> | null>
		client: $.VarRef<boolean>
		shutdown: $.VarRef<boolean>
		shutdownErr: $.VarRef<$.GoError>
		shutdownCh: $.VarRef<$.Channel<{}> | null>
		shutdownLock: $.VarRef<sync.Mutex>
		keepaliveLock: $.VarRef<sync.Mutex>
		keepaliveTimer: $.VarRef<time.Timer | $.VarRef<time.Timer> | null>
		keepaliveActive: $.VarRef<boolean>
	}

	constructor(init?: Partial<{rtt?: bigint, remoteGoAway?: number, localGoAway?: number, nextStreamID?: number, config?: __goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null, logger?: log.Logger | $.VarRef<log.Logger> | null, conn?: net.Conn | null, reader?: io.Reader | null, newMemoryManager?: (() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null, pingLock?: sync.Mutex, pingID?: number, activePing?: __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null, numIncomingStreams?: number, streams?: globalThis.Map<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null, inflight?: globalThis.Map<number, {}> | null, streamLock?: sync.Mutex, synCh?: $.Channel<{}> | null, acceptCh?: $.Channel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null, sendCh?: $.Channel<$.Slice<number>> | null, pongCh?: $.Channel<number> | null, pingCh?: $.Channel<number> | null, recvDoneCh?: $.Channel<{}> | null, sendDoneCh?: $.Channel<{}> | null, client?: boolean, shutdown?: boolean, shutdownErr?: $.GoError, shutdownCh?: $.Channel<{}> | null, shutdownLock?: sync.Mutex, keepaliveLock?: sync.Mutex, keepaliveTimer?: time.Timer | $.VarRef<time.Timer> | null, keepaliveActive?: boolean}>) {
		this._fields = {
			rtt: $.varRef(init?.rtt ?? (0n as bigint)),
			remoteGoAway: $.varRef(init?.remoteGoAway ?? (0 as number)),
			localGoAway: $.varRef(init?.localGoAway ?? (0 as number)),
			nextStreamID: $.varRef(init?.nextStreamID ?? (0 as number)),
			config: $.varRef(init?.config ?? (null as __goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null)),
			logger: $.varRef(init?.logger ?? (null as log.Logger | $.VarRef<log.Logger> | null)),
			conn: $.varRef(init?.conn ?? (null as net.Conn | null)),
			reader: $.varRef(init?.reader ?? (null as io.Reader | null)),
			newMemoryManager: $.varRef(init?.newMemoryManager ?? (null as (() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null)),
			pingLock: $.varRef(init?.pingLock ? $.markAsStructValue($.cloneStructValue(init.pingLock)) : $.markAsStructValue(new sync.Mutex())),
			pingID: $.varRef(init?.pingID ?? (0 as number)),
			activePing: $.varRef(init?.activePing ?? (null as __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null)),
			numIncomingStreams: $.varRef(init?.numIncomingStreams ?? (0 as number)),
			streams: $.varRef(init?.streams ?? (null as globalThis.Map<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null)),
			inflight: $.varRef(init?.inflight ?? (null as globalThis.Map<number, {}> | null)),
			streamLock: $.varRef(init?.streamLock ? $.markAsStructValue($.cloneStructValue(init.streamLock)) : $.markAsStructValue(new sync.Mutex())),
			synCh: $.varRef(init?.synCh ?? (null as $.Channel<{}> | null)),
			acceptCh: $.varRef(init?.acceptCh ?? (null as $.Channel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null> | null)),
			sendCh: $.varRef(init?.sendCh ?? (null as $.Channel<$.Slice<number>> | null)),
			pongCh: $.varRef(init?.pongCh ?? (null as $.Channel<number> | null)),
			pingCh: $.varRef(init?.pingCh ?? (null as $.Channel<number> | null)),
			recvDoneCh: $.varRef(init?.recvDoneCh ?? (null as $.Channel<{}> | null)),
			sendDoneCh: $.varRef(init?.sendDoneCh ?? (null as $.Channel<{}> | null)),
			client: $.varRef(init?.client ?? (false as boolean)),
			shutdown: $.varRef(init?.shutdown ?? (false as boolean)),
			shutdownErr: $.varRef(init?.shutdownErr ?? (null as $.GoError)),
			shutdownCh: $.varRef(init?.shutdownCh ?? (null as $.Channel<{}> | null)),
			shutdownLock: $.varRef(init?.shutdownLock ? $.markAsStructValue($.cloneStructValue(init.shutdownLock)) : $.markAsStructValue(new sync.Mutex())),
			keepaliveLock: $.varRef(init?.keepaliveLock ? $.markAsStructValue($.cloneStructValue(init.keepaliveLock)) : $.markAsStructValue(new sync.Mutex())),
			keepaliveTimer: $.varRef(init?.keepaliveTimer ?? (null as time.Timer | $.VarRef<time.Timer> | null)),
			keepaliveActive: $.varRef(init?.keepaliveActive ?? (false as boolean))
		}
	}

	public clone(): Session {
		const cloned = new Session()
		cloned._fields = {
			rtt: $.varRef(this._fields.rtt.value),
			remoteGoAway: $.varRef(this._fields.remoteGoAway.value),
			localGoAway: $.varRef(this._fields.localGoAway.value),
			nextStreamID: $.varRef(this._fields.nextStreamID.value),
			config: $.varRef(this._fields.config.value),
			logger: $.varRef(this._fields.logger.value),
			conn: $.varRef(this._fields.conn.value),
			reader: $.varRef(this._fields.reader.value),
			newMemoryManager: $.varRef(this._fields.newMemoryManager.value),
			pingLock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pingLock.value))),
			pingID: $.varRef(this._fields.pingID.value),
			activePing: $.varRef(this._fields.activePing.value),
			numIncomingStreams: $.varRef(this._fields.numIncomingStreams.value),
			streams: $.varRef(this._fields.streams.value),
			inflight: $.varRef(this._fields.inflight.value),
			streamLock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.streamLock.value))),
			synCh: $.varRef(this._fields.synCh.value),
			acceptCh: $.varRef(this._fields.acceptCh.value),
			sendCh: $.varRef(this._fields.sendCh.value),
			pongCh: $.varRef(this._fields.pongCh.value),
			pingCh: $.varRef(this._fields.pingCh.value),
			recvDoneCh: $.varRef(this._fields.recvDoneCh.value),
			sendDoneCh: $.varRef(this._fields.sendDoneCh.value),
			client: $.varRef(this._fields.client.value),
			shutdown: $.varRef(this._fields.shutdown.value),
			shutdownErr: $.varRef(this._fields.shutdownErr.value),
			shutdownCh: $.varRef(this._fields.shutdownCh.value),
			shutdownLock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.shutdownLock.value))),
			keepaliveLock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.keepaliveLock.value))),
			keepaliveTimer: $.varRef(this._fields.keepaliveTimer.value),
			keepaliveActive: $.varRef(this._fields.keepaliveActive.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Accept(): globalThis.Promise<[net.Conn | null, $.GoError]> {
		const s: Session | $.VarRef<Session> | null = this
		let __goscriptTuple0: any = await Session.prototype.AcceptStream.call(s)
		let conn: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return [$.interfaceValue<net.Conn | null>(conn, "*yamux.Stream"), err]
	}

	public async AcceptStream(): globalThis.Promise<[__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, $.GoError]> {
		const s: Session | $.VarRef<Session> | null = this
		while (true) {
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, any>([
				{
					id: 0,
					isSend: false,
					channel: $.pointerValue<Session>(s).acceptCh,
					onSelected: async (__goscriptSelect0Result) => {
						return __goscriptSelect0Result
					}
				},
				{
					id: 1,
					isSend: false,
					channel: $.pointerValue<Session>(s).shutdownCh,
					onSelected: async (__goscriptSelect0Result) => {
						return __goscriptSelect0Result
					}
				}
			], false)
			switch (__goscriptSelect0Value?.id) {
				case 0:
					{
						const __goscriptSelect0Result = __goscriptSelect0Value
						let stream = __goscriptSelect0Result.value
						{
							let err = await __goscript_stream.Stream.prototype.sendWindowUpdate.call(stream, null)
							if (err != null) {
								// don't return accept errors.
								await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] error sending window update before accepting: %s", $.arrayToSlice<any>([(err as any)]))
								continue
							}
						}
						return [stream, null]
						break
					}
				case 1:
					{
						const __goscriptSelect0Result = __goscriptSelect0Value
						return [null, $.pointerValue<Session>(s).shutdownErr]
						break
					}
			}
			throw new Error("unreachable select")
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Addr(): globalThis.Promise<net.Addr | null> {
		const s: Session | $.VarRef<Session> | null = this
		return await Session.prototype.LocalAddr.call(s)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let s: Session | $.VarRef<Session> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Session>(s).shutdownLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).shutdownLock.Unlock() })

		if ($.pointerValue<Session>(s).shutdown) {
			return null
		}
		$.pointerValue<Session>(s).shutdown = true
		if ($.pointerValue<Session>(s).shutdownErr == null) {
			$.pointerValue<Session>(s).shutdownErr = $.interfaceValue<$.GoError>(__goscript__const.ErrSessionShutdown, "*yamux.Error")
		}
		$.pointerValue<Session>(s).shutdownCh!.close()
		await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Session>(s).conn).Close()
		await Session.prototype.stopKeepalive.call(s)
		await $.chanRecv($.pointerValue<Session>(s).recvDoneCh)
		await $.chanRecv($.pointerValue<Session>(s).sendDoneCh)

		await $.pointerValue<Session>(s).streamLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).streamLock.Unlock() })
		for (const [id, stream] of $.pointerValue<Session>(s).streams?.entries() ?? []) {
			await __goscript_stream.Stream.prototype.forceClose.call(stream)
			$.deleteMapEntry($.pointerValue<Session>(s).streams, $.uint(id, 32))
			await $.pointerValue<Exclude<MemoryManager, null>>($.pointerValue<__goscript_stream.Stream>(stream).memorySpan).Done()
		}
		return null
	}

	public CloseChan(): $.Channel<{}> | null {
		const s: Session | $.VarRef<Session> | null = this
		return $.pointerValue<Session>(s).shutdownCh
	}

	public async GoAway(): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		return await Session.prototype.sendMsg.call(s, Session.prototype.goAway.call(s, $.uint(0, 32)), null, null)
	}

	public async IsClosed(): globalThis.Promise<boolean> {
		const s: Session | $.VarRef<Session> | null = this
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, boolean>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
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

	public async LocalAddr(): globalThis.Promise<net.Addr | null> {
		const s: Session | $.VarRef<Session> | null = this
		let [addr, ok] = $.typeAssertTuple<__goscript_addr.hasAddr | null>($.pointerValue<Session>(s).conn, "yamux.hasAddr")
		if (!ok) {
			return $.interfaceValue<net.Addr | null>(new __goscript_addr.yamuxAddr({Addr: "local"}), "*yamux.yamuxAddr")
		}
		return await $.pointerValue<Exclude<__goscript_addr.hasAddr, null>>(addr).LocalAddr()
	}

	public async NumStreams(): globalThis.Promise<number> {
		const s: Session | $.VarRef<Session> | null = this
		await $.pointerValue<Session>(s).streamLock.Lock()
		let num = $.len($.pointerValue<Session>(s).streams)
		$.pointerValue<Session>(s).streamLock.Unlock()
		return num
	}

	public async Open(ctx: context.Context | null): globalThis.Promise<[net.Conn | null, $.GoError]> {
		const s: Session | $.VarRef<Session> | null = this
		let __goscriptTuple1: any = await Session.prototype.OpenStream.call(s, ctx)
		let conn: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [$.interfaceValue<net.Conn | null>(conn, "*yamux.Stream"), null]
	}

	public async OpenStream(ctx: context.Context | null): globalThis.Promise<[__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, $.GoError]> {
		let s: Session | $.VarRef<Session> | null = this
		await using __defer = new $.AsyncDisposableStack()
		if (await Session.prototype.IsClosed.call(s)) {
			return [null, $.pointerValue<Session>(s).shutdownErr]
		}
		if ($.int(atomic.LoadInt32($.pointerValue<Session>(s)._fields.remoteGoAway), 32) == $.int(1, 32)) {
			return [null, $.interfaceValue<$.GoError>(__goscript__const.ErrRemoteGoAway, "*yamux.Error")]
		}

		// Block if we have too many inflight SYNs
		const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, $.GoError]>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<Session>(s).synCh,
				value: {},
				onSelected: async (__goscriptSelect2Result) => {
				}
			},
			{
				id: 1,
				isSend: false,
				channel: await $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect2Result) => {
					return [null, await $.pointerValue<Exclude<context.Context, null>>(ctx).Err()]
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
				onSelected: async (__goscriptSelect2Result) => {
					return [null, $.pointerValue<Session>(s).shutdownErr]
				}
			}
		], false)
		if (__goscriptSelect2HasReturn) {
			return __goscriptSelect2Value
		}

		let [span, err] = await $.pointerValue<Session>(s).newMemoryManager!()
		if (err != null) {
			return [null, fmt.Errorf("failed to create resource scope span: %w", (err as any))]
		}
		{
			let __goscriptShadow0 = await $.pointerValue<Exclude<MemoryManager, null>>(span).ReserveMemory(262144, $.uint(255, 8))
			if (__goscriptShadow0 != null) {
				return [null, __goscriptShadow0]
			}
		}

		GET_ID: while (true) {
			var id = $.uint(atomic.LoadUint32($.pointerValue<Session>(s)._fields.nextStreamID), 32)
			// Get an ID, and check for stream exhaustion

			if (id >= (math.MaxUint32 - 1)) {
				await $.pointerValue<Exclude<MemoryManager, null>>(span).Done()
				return [null, $.interfaceValue<$.GoError>(__goscript__const.ErrStreamsExhausted, "*yamux.Error")]
			}
			if (!atomic.CompareAndSwapUint32($.pointerValue<Session>(s)._fields.nextStreamID, $.uint(id, 32), $.uint(id + 2, 32))) {
				continue GET_ID
			}
			break
		}

		// Register the stream
		let stream: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = __goscript_stream.newStream(s, $.uint(id, 32), 0, $.uint(262144, 32), span)
		await $.pointerValue<Session>(s).streamLock.Lock()
		$.mapSet($.pointerValue<Session>(s).streams, $.uint(id, 32), stream)
		$.mapSet($.pointerValue<Session>(s).inflight, $.uint(id, 32), {})
		$.pointerValue<Session>(s).streamLock.Unlock()

		// Send the window update to create
		{
			let __goscriptShadow1 = await __goscript_stream.Stream.prototype.sendWindowUpdate.call(stream, await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
			if (__goscriptShadow1 != null) {
				__defer.defer(async () => { await $.pointerValue<Exclude<MemoryManager, null>>(span).Done() })
				const [__goscriptSelect3HasReturn, __goscriptSelect3Value] = await $.selectStatement<any, [__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, $.GoError]>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Session>(s).synCh,
						onSelected: async (__goscriptSelect3Result) => {
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect3Result) => {
							await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: aborted stream open without inflight syn semaphore", null)
						}
					}
				], true)
				if (__goscriptSelect3HasReturn) {
					return __goscriptSelect3Value
				}
				return [null, __goscriptShadow1]
			}
		}
		return [stream, null]
	}

	public async Ping(): globalThis.Promise<[time.Duration, $.GoError]> {
		let s: Session | $.VarRef<Session> | null = this
		let dur: time.Duration = 0n
		let err: $.GoError = null as $.GoError
		await using __defer = new $.AsyncDisposableStack()
		// Prepare a ping.
		await $.pointerValue<Session>(s).pingLock.Lock()
		// If there's an active ping, jump on the bandwagon.
		{
			let activePing: __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null = $.pointerValue<Session>(s).activePing
			if (activePing != null) {
				$.pointerValue<Session>(s).pingLock.Unlock()
				return await __goscript_ping.ping.prototype.wait.call(activePing)
			}
		}

		// Ok, our job to send the ping.
		let activePing: __goscript_ping.ping | $.VarRef<__goscript_ping.ping> | null = __goscript_ping.newPing($.uint($.pointerValue<Session>(s).pingID, 32))
		$.pointerValue<Session>(s).pingID++
		$.pointerValue<Session>(s).activePing = activePing
		$.pointerValue<Session>(s).pingLock.Unlock()

		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			// complete ping promise
			__goscript_ping.ping.prototype.finish.call(activePing, dur, err)

			// Unset it.
			await $.pointerValue<Session>(s).pingLock.Lock()
			$.pointerValue<Session>(s).activePing = null
			$.pointerValue<Session>(s).pingLock.Unlock()
		})() })

		// Send the ping request, waiting at most one connection write timeout
		// to flush it.
		let timer: time.Timer | $.VarRef<time.Timer> | null = time.NewTimer($.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).ConnectionWriteTimeout)
		__defer.defer(() => { time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer)) })
		const [__goscriptSelect4HasReturn, __goscriptSelect4Value] = await $.selectStatement<any, [time.Duration, $.GoError]>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<Session>(s).pingCh,
				value: $.pointerValue<__goscript_ping.ping>(activePing).id,
				onSelected: async (__goscriptSelect4Result) => {
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<time.Timer>(timer).C,
				onSelected: async (__goscriptSelect4Result) => {
					const __goscriptReturn1: [time.Duration, $.GoError] = [0n, $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")]
					dur = __goscriptReturn1[0]
					err = __goscriptReturn1[1]
					await __defer[Symbol.asyncDispose]()
					return [dur, err]
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
				onSelected: async (__goscriptSelect4Result) => {
					const __goscriptReturn2: [time.Duration, $.GoError] = [0n, $.pointerValue<Session>(s).shutdownErr]
					dur = __goscriptReturn2[0]
					err = __goscriptReturn2[1]
					await __defer[Symbol.asyncDispose]()
					return [dur, err]
				}
			}
		], false)
		if (__goscriptSelect4HasReturn) {
			return __goscriptSelect4Value
		}

		// The "time" starts once we've actually sent the ping. Otherwise, we'll
		// measure the time it takes to flush the queue as well.
		let start = $.markAsStructValue($.cloneStructValue(time.Now()))

		// Wait for a response, again waiting at most one write timeout.
		if (!time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(timer))) {
			await $.chanRecv($.pointerValue<time.Timer>(timer).C)
		}
		time.Timer.prototype.Reset.call($.pointerValue<time.Timer>(timer), $.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).ConnectionWriteTimeout)
		const [__goscriptSelect5HasReturn, __goscriptSelect5Value] = await $.selectStatement<any, [time.Duration, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<__goscript_ping.ping>(activePing).pingResponse,
				onSelected: async (__goscriptSelect5Result) => {
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<time.Timer>(timer).C,
				onSelected: async (__goscriptSelect5Result) => {
					const __goscriptReturn3: [time.Duration, $.GoError] = [0n, $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")]
					dur = __goscriptReturn3[0]
					err = __goscriptReturn3[1]
					await __defer[Symbol.asyncDispose]()
					return [dur, err]
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
				onSelected: async (__goscriptSelect5Result) => {
					const __goscriptReturn4: [time.Duration, $.GoError] = [0n, $.pointerValue<Session>(s).shutdownErr]
					dur = __goscriptReturn4[0]
					err = __goscriptReturn4[1]
					await __defer[Symbol.asyncDispose]()
					return [dur, err]
				}
			}
		], false)
		if (__goscriptSelect5HasReturn) {
			return __goscriptSelect5Value
		}

		// Compute the RTT
		const __goscriptReturn5: [time.Duration, $.GoError] = [time.Since($.markAsStructValue($.cloneStructValue(start))), null]
		dur = __goscriptReturn5[0]
		err = __goscriptReturn5[1]
		await __defer[Symbol.asyncDispose]()
		return [dur, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async RemoteAddr(): globalThis.Promise<net.Addr | null> {
		const s: Session | $.VarRef<Session> | null = this
		let [addr, ok] = $.typeAssertTuple<__goscript_addr.hasAddr | null>($.pointerValue<Session>(s).conn, "yamux.hasAddr")
		if (!ok) {
			return $.interfaceValue<net.Addr | null>(new __goscript_addr.yamuxAddr({Addr: "remote"}), "*yamux.yamuxAddr")
		}
		return await $.pointerValue<Exclude<__goscript_addr.hasAddr, null>>(addr).RemoteAddr()
	}

	public async closeStream(id: number): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Session>(s).streamLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).streamLock.Unlock() })
		{
			let [, ok] = $.mapGet<number, {}, {}>($.pointerValue<Session>(s).inflight, $.uint(id, 32), {})
			if (ok) {
				const [__goscriptSelect6HasReturn, __goscriptSelect6Value] = await $.selectStatement<any, void>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Session>(s).synCh,
						onSelected: async (__goscriptSelect6Result) => {
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect6Result) => {
							await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: SYN tracking out of sync", null)
						}
					}
				], true)
				if (__goscriptSelect6HasReturn) {
					return __goscriptSelect6Value
				}
				$.deleteMapEntry($.pointerValue<Session>(s).inflight, $.uint(id, 32))
			}
		}
		await Session.prototype.deleteStream.call(s, $.uint(id, 32))
	}

	public async deleteStream(id: number): globalThis.Promise<void> {
		let s: Session | $.VarRef<Session> | null = this
		let __goscriptTuple2: any = $.mapGet<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null>($.pointerValue<Session>(s).streams, $.uint(id, 32), null)
		let str: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = __goscriptTuple2[0]
		let ok = __goscriptTuple2[1]
		if (!ok) {
			return
		}
		if ($.pointerValue<Session>(s).client == ($.uint((id % 2), 32) == $.uint(0, 32))) {
			if ($.uint($.pointerValue<Session>(s).numIncomingStreams, 32) == $.uint(0, 32)) {
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: numIncomingStreams underflow", null)
				// prevent the creation of any new streams
				$.pointerValue<Session>(s).numIncomingStreams = $.uint(math.MaxUint32, 32)
			} else {
				$.pointerValue<Session>(s).numIncomingStreams--
			}
		}
		$.deleteMapEntry($.pointerValue<Session>(s).streams, $.uint(id, 32))
		await $.pointerValue<Exclude<MemoryManager, null>>($.pointerValue<__goscript_stream.Stream>(str).memorySpan).Done()
	}

	public async establishStream(id: number): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		await $.pointerValue<Session>(s).streamLock.Lock()
		{
			let [, ok] = $.mapGet<number, {}, {}>($.pointerValue<Session>(s).inflight, $.uint(id, 32), {})
			if (ok) {
				$.deleteMapEntry($.pointerValue<Session>(s).inflight, $.uint(id, 32))
			} else {
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: established stream without inflight SYN (no tracking entry)", null)
			}
		}
		const [__goscriptSelect7HasReturn, __goscriptSelect7Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Session>(s).synCh,
				onSelected: async (__goscriptSelect7Result) => {
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect7Result) => {
					await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: established stream without inflight SYN (didn't have semaphore)", null)
				}
			}
		], true)
		if (__goscriptSelect7HasReturn) {
			return __goscriptSelect7Value
		}
		$.pointerValue<Session>(s).streamLock.Unlock()
	}

	public async exitErr(err: $.GoError): globalThis.Promise<void> {
		let s: Session | $.VarRef<Session> | null = this
		await $.pointerValue<Session>(s).shutdownLock.Lock()
		if ($.pointerValue<Session>(s).shutdownErr == null) {
			$.pointerValue<Session>(s).shutdownErr = err
		}
		$.pointerValue<Session>(s).shutdownLock.Unlock()
		await Session.prototype.Close.call(s)
	}

	public async extendKeepalive(): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		await $.pointerValue<Session>(s).keepaliveLock.Lock()
		if (($.pointerValue<Session>(s).keepaliveTimer != null) && !$.pointerValue<Session>(s).keepaliveActive) {
			// Don't stop the timer and drain the channel. This is an
			// AfterFunc, not a normal timer, and any attempts to drain the
			// channel will block forever.
			//
			// Go will stop the timer for us internally anyways. The docs
			// say one must stop the timer before calling reset but that's
			// to ensure that the timer doesn't end up firing immediately
			// after calling Reset.
			time.Timer.prototype.Reset.call($.pointerValue<time.Timer>($.pointerValue<Session>(s).keepaliveTimer), $.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).KeepAliveInterval)
		}
		$.pointerValue<Session>(s).keepaliveLock.Unlock()
	}

	public getRTT(): time.Duration {
		const s: Session | $.VarRef<Session> | null = this
		return $.int64(atomic.LoadInt64($.pointerValue<Session>(s)._fields.rtt))
	}

	public goAway(reason: number): __goscript__const.header {
		const s: Session | $.VarRef<Session> | null = this
		atomic.SwapInt32($.pointerValue<Session>(s)._fields.localGoAway, $.int(1, 32))
		let hdr = __goscript__const.encode($.uint(3, 8), $.uint(0, 16), $.uint(0, 32), $.uint(reason, 32))
		return hdr
	}

	public async handleGoAway(hdr: __goscript__const.header): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		let code = $.uint(__goscript__const.header_Length(hdr), 32)
		switch (code) {
			case 0:
			{
				atomic.SwapInt32($.pointerValue<Session>(s)._fields.remoteGoAway, $.int(1, 32))
				break
			}
			case 1:
			{
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: received protocol error go away", null)
				return fmt.Errorf("yamux protocol error")
				break
			}
			case 2:
			{
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: received internal error go away", null)
				return fmt.Errorf("remote yamux internal error")
				break
			}
			default:
			{
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: received unexpected go away", null)
				return fmt.Errorf("unexpected go away received")
				break
			}
		}
		return null
	}

	public async handlePing(hdr: __goscript__const.header): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		let flags = $.uint(__goscript__const.header_Flags(hdr), 16)
		let pingID = $.uint(__goscript__const.header_Length(hdr), 32)

		// Check if this is a query, respond back in a separate context so we
		// don't interfere with the receiving thread blocking for the write.
		if ($.uint((flags & 1), 16) == $.uint(1, 16)) {
			const [__goscriptSelect8HasReturn, __goscriptSelect8Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: true,
					channel: $.pointerValue<Session>(s).pongCh,
					value: pingID,
					onSelected: async (__goscriptSelect8Result) => {
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect8Result) => {
						await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] yamux: dropped ping reply", null)
					}
				}
			], true)
			if (__goscriptSelect8HasReturn) {
				return __goscriptSelect8Value
			}
			return null
		}

		// Handle a response
		await $.pointerValue<Session>(s).pingLock.Lock()
		// If we have an active ping, and this is a response to that active
		// ping, complete the ping.
		if (($.pointerValue<Session>(s).activePing != null) && ($.uint($.pointerValue<__goscript_ping.ping>($.pointerValue<Session>(s).activePing).id, 32) == $.uint(pingID, 32))) {
			// Don't assume that the peer won't send multiple responses for
			// the same ping.
			const [__goscriptSelect9HasReturn, __goscriptSelect9Value] = await $.selectStatement<any, $.GoError>([
				{
					id: 0,
					isSend: true,
					channel: $.pointerValue<__goscript_ping.ping>($.pointerValue<Session>(s).activePing).pingResponse,
					value: {},
					onSelected: async (__goscriptSelect9Result) => {
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect9Result) => {
					}
				}
			], true)
			if (__goscriptSelect9HasReturn) {
				return __goscriptSelect9Value
			}
		}
		$.pointerValue<Session>(s).pingLock.Unlock()
		return null
	}

	public async handleStreamMessage(hdr: __goscript__const.header): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		// Check for a new stream creation
		let id = $.uint(__goscript__const.header_StreamID(hdr), 32)
		let flags = $.uint(__goscript__const.header_Flags(hdr), 16)
		if ($.uint((flags & 1), 16) == $.uint(1, 16)) {
			{
				let err = await Session.prototype.incomingStream.call(s, $.uint(id, 32))
				if (err != null) {
					return err
				}
			}
		}

		// Get the stream
		await $.pointerValue<Session>(s).streamLock.Lock()
		let stream: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = $.mapGet<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null>($.pointerValue<Session>(s).streams, $.uint(id, 32), null)[0]
		$.pointerValue<Session>(s).streamLock.Unlock()

		// If we do not have a stream, likely we sent a RST and/or closed the stream for reading.
		if (stream == null) {
			// Drain any data on the wire
			if (($.uint(__goscript__const.header_MsgType(hdr), 8) == $.uint(0, 8)) && (__goscript__const.header_Length(hdr) > 0)) {
				{
					let [, err] = await io.CopyN($.pointerValueOrNil(io.Discard)!, $.pointerValueOrNil($.pointerValue<Session>(s).reader)!, $.int64(__goscript__const.header_Length(hdr)))
					if (err != null) {
						return null
					}
				}
			}
			return null
		}

		// Check if this is a window update
		if ($.uint(__goscript__const.header_MsgType(hdr), 8) == $.uint(1, 8)) {
			await __goscript_stream.Stream.prototype.incrSendWindow.call(stream, hdr, $.uint(flags, 16))
			return null
		}

		// Read the new data
		{
			let err = await __goscript_stream.Stream.prototype.readData.call(stream, hdr, $.uint(flags, 16), $.pointerValue<Session>(s).reader)
			if (err != null) {
				{
					let sendErr = await Session.prototype.sendMsg.call(s, Session.prototype.goAway.call(s, $.uint(1, 32)), null, null)
					if (sendErr != null) {
						await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] yamux: failed to send go away: %v", $.arrayToSlice<any>([(sendErr as any)]))
					}
				}
				return err
			}
		}
		return null
	}

	public async incomingStream(id: number): globalThis.Promise<$.GoError> {
		let s: Session | $.VarRef<Session> | null = this
		await using __defer = new $.AsyncDisposableStack()
		if ($.pointerValue<Session>(s).client != ($.uint((id % 2), 32) == $.uint(0, 32))) {
			await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: both endpoints are clients", null)
			return fmt.Errorf("both yamux endpoints are clients")
		}
		// Reject immediately if we are doing a go away
		if ($.int(atomic.LoadInt32($.pointerValue<Session>(s)._fields.localGoAway), 32) == $.int(1, 32)) {
			let hdr = __goscript__const.encode($.uint(1, 8), $.uint(8, 16), $.uint(id, 32), $.uint(0, 32))
			return await Session.prototype.sendMsg.call(s, hdr, null, null)
		}

		// Allocate a new stream
		let [span, err] = await $.pointerValue<Session>(s).newMemoryManager!()
		if (err != null) {
			return fmt.Errorf("failed to create resource span: %w", (err as any))
		}
		{
			let __goscriptShadow2 = await $.pointerValue<Exclude<MemoryManager, null>>(span).ReserveMemory(262144, $.uint(255, 8))
			if (__goscriptShadow2 != null) {
				return __goscriptShadow2
			}
		}
		let stream: __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null = __goscript_stream.newStream(s, $.uint(id, 32), 2, $.uint(262144, 32), span)

		await $.pointerValue<Session>(s).streamLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).streamLock.Unlock() })

		// Check if stream already exists
		{
			let [, ok] = $.mapGet<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null>($.pointerValue<Session>(s).streams, $.uint(id, 32), null)
			if (ok) {
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: duplicate stream declared", null)
				{
					let sendErr = await Session.prototype.sendMsg.call(s, Session.prototype.goAway.call(s, $.uint(1, 32)), null, null)
					if (sendErr != null) {
						await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] yamux: failed to send go away: %v", $.arrayToSlice<any>([(sendErr as any)]))
					}
				}
				await $.pointerValue<Exclude<MemoryManager, null>>(span).Done()
				return $.interfaceValue<$.GoError>(__goscript__const.ErrDuplicateStream, "*yamux.Error")
			}
		}

		if ($.pointerValue<Session>(s).numIncomingStreams >= $.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).MaxIncomingStreams) {
			// too many active streams at the same time
			await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] yamux: MaxIncomingStreams exceeded, forcing stream reset", null)
			__defer.defer(async () => { await $.pointerValue<Exclude<MemoryManager, null>>(span).Done() })
			let hdr = __goscript__const.encode($.uint(1, 8), $.uint(8, 16), $.uint(id, 32), $.uint(0, 32))
			return await Session.prototype.sendMsg.call(s, hdr, null, null)
		}

		$.pointerValue<Session>(s).numIncomingStreams++
		// Register the stream
		$.mapSet($.pointerValue<Session>(s).streams, $.uint(id, 32), stream)

		// Check if we've exceeded the backlog
		const [__goscriptSelect10HasReturn, __goscriptSelect10Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: true,
				channel: $.pointerValue<Session>(s).acceptCh,
				value: stream,
				onSelected: async (__goscriptSelect10Result) => {
					return null
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect10Result) => {
					__defer.defer(async () => { await $.pointerValue<Exclude<MemoryManager, null>>(span).Done() })
					await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[WARN] yamux: backlog exceeded, forcing stream reset", null)
					await Session.prototype.deleteStream.call(s, $.uint(id, 32))
					let hdr = __goscript__const.encode($.uint(1, 8), $.uint(8, 16), $.uint(id, 32), $.uint(0, 32))
					return await Session.prototype.sendMsg.call(s, hdr, null, null)
				}
			}
		], true)
		if (__goscriptSelect10HasReturn) {
			return __goscriptSelect10Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async measureRTT(): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		let [rtt, err] = await Session.prototype.Ping.call(s)
		if (err != null) {
			return
		}
		if (!atomic.CompareAndSwapInt64($.pointerValue<Session>(s)._fields.rtt, 0n, time.Duration_Nanoseconds(rtt))) {
			let prev = atomic.LoadInt64($.pointerValue<Session>(s)._fields.rtt)
			let smoothedRTT = $.int64Add(($.int64Div(prev, 2)), ($.int64Div(time.Duration_Nanoseconds(rtt), 2)))
			atomic.StoreInt64($.pointerValue<Session>(s)._fields.rtt, smoothedRTT)
		}
	}

	public async recv(): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		{
			let err = await Session.prototype.recvLoop.call(s)
			if (err != null) {
				await Session.prototype.exitErr.call(s, err)
			}
		}
	}

	public async recvLoop(): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		let err: $.GoError = null as $.GoError
		try {
			await using __defer = new $.AsyncDisposableStack()
			__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
				{
					let rerr = $.recover()
					if (rerr != null) {
						await fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "caught panic: %s\n%s\n", rerr, $.interfaceValue<any>(debug.Stack(), "[]byte"))
						err = fmt.Errorf("panic in yamux receive loop: %s", rerr)
					}
				}
			})() })
			__defer.defer(() => { $.pointerValue<Session>(s).recvDoneCh!.close() })
			let hdr: __goscript__const.header = new Uint8Array(12)
			while (true) {
				// fmt.Printf("ReadFull from %#v\n", s.reader)
				// Read the header
				{
					let [, __goscriptShadow3] = await io.ReadFull($.pointerValueOrNil($.pointerValue<Session>(s).reader)!, $.goSlice(hdr, undefined, undefined))
					if (__goscriptShadow3 != null) {
						if (((!$.comparableEqual(__goscriptShadow3, io.EOF)) && !strings.Contains($.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow3).Error(), "closed")) && !strings.Contains($.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow3).Error(), "reset by peer")) {
							await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: Failed to read header: %v", $.arrayToSlice<any>([(__goscriptShadow3 as any)]))
						}
						const __goscriptReturn6: $.GoError = __goscriptShadow3
						err = __goscriptReturn6
						await __defer[Symbol.asyncDispose]()
						return err
					}
				}

				// Reset the keepalive timer every time we receive data.
				// There's no reason to keepalive if we're active. Worse, if the
				// peer is busy sending us stuff, the pong might get stuck
				// behind a bunch of data.
				await Session.prototype.extendKeepalive.call(s)

				// Verify the version
				if ($.uint(__goscript__const.header_Version(hdr), 8) != $.uint(0, 8)) {
					await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: Invalid protocol version: %d", $.arrayToSlice<any>([$.namedValueInterfaceValue<any>(__goscript__const.header_Version(hdr), "uint8", {}, { kind: $.TypeKind.Basic, name: "uint8" })]))
					const __goscriptReturn7: $.GoError = $.interfaceValue<$.GoError>(__goscript__const.ErrInvalidVersion, "*yamux.Error")
					err = __goscriptReturn7
					await __defer[Symbol.asyncDispose]()
					return err
				}

				let mt = $.uint(__goscript__const.header_MsgType(hdr), 8)
				if ((mt < 0) || (mt > 3)) {
					const __goscriptReturn8: $.GoError = $.interfaceValue<$.GoError>(__goscript__const.ErrInvalidMsgType, "*yamux.Error")
					err = __goscriptReturn8
					await __defer[Symbol.asyncDispose]()
					return err
				}

				{
					let __goscriptShadow4 = await $.arrayIndex(__goscript_get_handlers()!, mt)!(s, hdr)
					if (__goscriptShadow4 != null) {
						const __goscriptReturn9: $.GoError = __goscriptShadow4
						err = __goscriptReturn9
						await __defer[Symbol.asyncDispose]()
						return err
					}
				}
			}
		} catch (e) {
			if (!$.recovered(e)) {
				throw e
			}
		}
		return err
	}

	public async send(): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		{
			let err = await Session.prototype.sendLoop.call(s)
			if (err != null) {
				await Session.prototype.exitErr.call(s, err)
			}
		}
	}

	public async sendLoop(): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		let err: $.GoError = null as $.GoError
		try {
			await using __defer = new $.AsyncDisposableStack()
			__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
				{
					let rerr = $.recover()
					if (rerr != null) {
						await fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "caught panic: %s\n%s\n", rerr, $.interfaceValue<any>(debug.Stack(), "[]byte"))
						err = fmt.Errorf("panic in yamux send loop: %s", rerr)
					}
				}
			})() })

			__defer.defer(() => { $.pointerValue<Session>(s).sendDoneCh!.close() })

			// Extend the write deadline if we've passed the halfway point. This can
			// be expensive so this ensures we only have to do this once every
			// ConnectionWriteTimeout/2 (usually 5s).
			let lastWriteDeadline: time.Time = $.markAsStructValue(new time.Time())
			let extendWriteDeadline: (() => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue(async (): globalThis.Promise<$.GoError> => {
				let now = $.markAsStructValue($.cloneStructValue(time.Now()))
				// If over half of the deadline has elapsed, extend it.
				if ($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add($.int64Div($.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).ConnectionWriteTimeout, 2)))).After($.markAsStructValue($.cloneStructValue(lastWriteDeadline)))) {
					lastWriteDeadline = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add($.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).ConnectionWriteTimeout)))
					return await $.pointerValue<Exclude<net.Conn, null>>($.pointerValue<Session>(s).conn).SetWriteDeadline($.markAsStructValue($.cloneStructValue(lastWriteDeadline)))
				}
				return null
			}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo))

			let writer = $.pointerValue<Session>(s).conn

			// FIXME: https://github.com/libp2p/go-libp2p/issues/644
			// Write coalescing is disabled for now.

			// writer := pool.Writer{W: s.conn}

			// var writeTimeout *time.Timer
			// var writeTimeoutCh <-chan time.Time
			// if s.config.WriteCoalesceDelay > 0 {
			//	writeTimeout = time.NewTimer(s.config.WriteCoalesceDelay)
			//	defer writeTimeout.Stop()

			//	writeTimeoutCh = writeTimeout.C
			// } else {
			//	ch := make(chan time.Time)
			//	close(ch)
			//	writeTimeoutCh = ch
			// }

			while (true) {
				// yield after processing the last message, if we've shutdown.
				// s.sendCh is a buffered channel and Go doesn't guarantee select order.
				const [__goscriptSelect11HasReturn, __goscriptSelect11Value] = await $.selectStatement<any, $.GoError>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Session>(s).shutdownCh,
						onSelected: async (__goscriptSelect11Result) => {
							const __goscriptReturn10: $.GoError = null
							err = __goscriptReturn10
							await __defer[Symbol.asyncDispose]()
							return err
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect11Result) => {
						}
					}
				], true)
				if (__goscriptSelect11HasReturn) {
					return __goscriptSelect11Value
				}

				let buf: $.Slice<number> = null as $.Slice<number>
				// Make sure to send any pings & pongs first so they don't get stuck behind writes.
				const [__goscriptSelect12HasReturn, __goscriptSelect12Value] = await $.selectStatement<any, $.GoError>([
					{
						id: 0,
						isSend: false,
						channel: $.pointerValue<Session>(s).pingCh,
						onSelected: async (__goscriptSelect12Result) => {
							let pingID = __goscriptSelect12Result.value
							buf = await pool.Get(12)
							let hdr = __goscript__const.encode($.uint(2, 8), $.uint(1, 16), $.uint(0, 32), $.uint(pingID, 32))
							$.copy(buf, $.goSlice(hdr, undefined, undefined))
						}
					},
					{
						id: 1,
						isSend: false,
						channel: $.pointerValue<Session>(s).pongCh,
						onSelected: async (__goscriptSelect12Result) => {
							let pingID = __goscriptSelect12Result.value
							buf = await pool.Get(12)
							let hdr = __goscript__const.encode($.uint(2, 8), $.uint(2, 16), $.uint(0, 32), $.uint(pingID, 32))
							$.copy(buf, $.goSlice(hdr, undefined, undefined))
						}
					},
					{
						id: -1,
						isSend: false,
						channel: null,
						onSelected: async (__goscriptSelect12Result) => {
							const [__goscriptSelect13HasReturn, __goscriptSelect13Value] = await $.selectStatement<any, $.GoError>([
								{
									id: 0,
									isSend: false,
									channel: $.pointerValue<Session>(s).sendCh,
									onSelected: async (__goscriptSelect13Result) => {
										buf = __goscriptSelect13Result.value
									}
								},
								{
									id: 1,
									isSend: false,
									channel: $.pointerValue<Session>(s).pingCh,
									onSelected: async (__goscriptSelect13Result) => {
										let pingID = __goscriptSelect13Result.value
										buf = await pool.Get(12)
										let hdr = __goscript__const.encode($.uint(2, 8), $.uint(1, 16), $.uint(0, 32), $.uint(pingID, 32))
										$.copy(buf, $.goSlice(hdr, undefined, undefined))
									}
								},
								{
									id: 2,
									isSend: false,
									channel: $.pointerValue<Session>(s).pongCh,
									onSelected: async (__goscriptSelect13Result) => {
										let pingID = __goscriptSelect13Result.value
										buf = await pool.Get(12)
										let hdr = __goscript__const.encode($.uint(2, 8), $.uint(2, 16), $.uint(0, 32), $.uint(pingID, 32))
										$.copy(buf, $.goSlice(hdr, undefined, undefined))
									}
								},
								{
									id: 3,
									isSend: false,
									channel: $.pointerValue<Session>(s).shutdownCh,
									onSelected: async (__goscriptSelect13Result) => {
										const __goscriptReturn11: $.GoError = null
										err = __goscriptReturn11
										await __defer[Symbol.asyncDispose]()
										return err
									}
								}
							], false)
							if (__goscriptSelect13HasReturn) {
								return __goscriptSelect13Value
							}
						}
					}
				], true)
				if (__goscriptSelect12HasReturn) {
					return __goscriptSelect12Value
				}

				{
					let __goscriptShadow5 = await extendWriteDeadline!()
					if (__goscriptShadow5 != null) {
						await pool.Put(buf)
						const __goscriptReturn12: $.GoError = __goscriptShadow5
						err = __goscriptReturn12
						await __defer[Symbol.asyncDispose]()
						return err
					}
				}

				let [, __goscriptShadow6] = await $.pointerValue<Exclude<net.Conn, null>>(writer).Write(buf)
				await pool.Put(buf)

				if (__goscriptShadow6 != null) {
					if (os.IsTimeout($.pointerValueOrNil(__goscriptShadow6)!)) {
						__goscriptShadow6 = $.interfaceValue<$.GoError>(__goscript__const.ErrConnectionWriteTimeout, "*yamux.Error")
					}
					const __goscriptReturn13: $.GoError = __goscriptShadow6
					err = __goscriptReturn13
					await __defer[Symbol.asyncDispose]()
					return err
				}
			}
		} catch (e) {
			if (!$.recovered(e)) {
				throw e
			}
		}
		return err
	}

	public async sendMsg(hdr: __goscript__const.header, body: $.Slice<number>, deadline: $.Channel<{}> | null): globalThis.Promise<$.GoError> {
		const s: Session | $.VarRef<Session> | null = this
		const [__goscriptSelect14HasReturn, __goscriptSelect14Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
				onSelected: async (__goscriptSelect14Result) => {
					return $.pointerValue<Session>(s).shutdownErr
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect14Result) => {
				}
			}
		], true)
		if (__goscriptSelect14HasReturn) {
			return __goscriptSelect14Value
		}

		const [__goscriptSelect15HasReturn, __goscriptSelect15Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: deadline,
				onSelected: async (__goscriptSelect15Result) => {
					return $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect15Result) => {
				}
			}
		], true)
		if (__goscriptSelect15HasReturn) {
			return __goscriptSelect15Value
		}

		// duplicate as we're sending this async.
		let buf: $.Slice<number> = await pool.Get(12 + $.len(body))
		$.copy($.goSlice(buf, undefined, 12), $.goSlice(hdr, undefined, undefined))
		$.copy($.goSlice(buf, 12, undefined), body)

		const [__goscriptSelect16HasReturn, __goscriptSelect16Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Session>(s).shutdownCh,
				onSelected: async (__goscriptSelect16Result) => {
					await pool.Put(buf)
					return $.pointerValue<Session>(s).shutdownErr
				}
			},
			{
				id: 1,
				isSend: true,
				channel: $.pointerValue<Session>(s).sendCh,
				value: buf,
				onSelected: async (__goscriptSelect16Result) => {
					return null
				}
			},
			{
				id: 2,
				isSend: false,
				channel: deadline,
				onSelected: async (__goscriptSelect16Result) => {
					await pool.Put(buf)
					return $.interfaceValue<$.GoError>(__goscript__const.ErrTimeout, "*yamux.Error")
				}
			}
		], false)
		if (__goscriptSelect16HasReturn) {
			return __goscriptSelect16Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async startKeepalive(): globalThis.Promise<void> {
		let s: Session | $.VarRef<Session> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Session>(s).keepaliveLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).keepaliveLock.Unlock() })
		$.pointerValue<Session>(s).keepaliveTimer = time.AfterFunc($.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).KeepAliveInterval, $.functionValue(async (): globalThis.Promise<void> => {
			await $.pointerValue<Session>(s).keepaliveLock.Lock()
			if (($.pointerValue<Session>(s).keepaliveTimer == null) || $.pointerValue<Session>(s).keepaliveActive) {
				// keepalives have been stopped or a keepalive is active.
				$.pointerValue<Session>(s).keepaliveLock.Unlock()
				return
			}
			$.pointerValue<Session>(s).keepaliveActive = true
			$.pointerValue<Session>(s).keepaliveLock.Unlock()

			let [, err] = await Session.prototype.Ping.call(s)

			await $.pointerValue<Session>(s).keepaliveLock.Lock()
			$.pointerValue<Session>(s).keepaliveActive = false
			if ($.pointerValue<Session>(s).keepaliveTimer != null) {
				time.Timer.prototype.Reset.call($.pointerValue<time.Timer>($.pointerValue<Session>(s).keepaliveTimer), $.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).KeepAliveInterval)
			}
			$.pointerValue<Session>(s).keepaliveLock.Unlock()

			if (err != null) {
				await log.Logger.prototype.Printf.call($.pointerValue<Session>(s).logger, "[ERR] yamux: keepalive failed: %v", $.arrayToSlice<any>([(err as any)]))
				await Session.prototype.exitErr.call(s, $.interfaceValue<$.GoError>(__goscript__const.ErrKeepAliveTimeout, "*yamux.Error"))
			}
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	public async startMeasureRTT(): globalThis.Promise<void> {
		const s: Session | $.VarRef<Session> | null = this
		using __defer = new $.DisposableStack()
		await Session.prototype.measureRTT.call(s)
		let t: time.Ticker | $.VarRef<time.Ticker> | null = time.NewTicker($.pointerValue<__goscript_mux.Config>($.pointerValue<Session>(s).config).MeasureRTTInterval)
		__defer.defer(() => { time.Ticker.prototype.Stop.call($.pointerValue<time.Ticker>(t)) })
		while (true) {
			const [__goscriptSelect17HasReturn, __goscriptSelect17Value] = await $.selectStatement<any, void>([
				{
					id: 0,
					isSend: false,
					channel: Session.prototype.CloseChan.call(s),
					onSelected: async (__goscriptSelect17Result) => {
						return $.selectVoidReturn()
					}
				},
				{
					id: 1,
					isSend: false,
					channel: $.pointerValue<time.Ticker>(t).C,
					onSelected: async (__goscriptSelect17Result) => {
						await Session.prototype.measureRTT.call(s)
					}
				}
			], false)
			if (__goscriptSelect17HasReturn) {
				return __goscriptSelect17Value
			}
		}
	}

	public async stopKeepalive(): globalThis.Promise<void> {
		let s: Session | $.VarRef<Session> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Session>(s).keepaliveLock.Lock()
		__defer.defer(() => { $.pointerValue<Session>(s).keepaliveLock.Unlock() })
		if ($.pointerValue<Session>(s).keepaliveTimer != null) {
			time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<Session>(s).keepaliveTimer))
			$.pointerValue<Session>(s).keepaliveTimer = null
		}
	}

	static __typeInfo = $.registerStructType(
		"yamux.Session",
		() => new Session(),
		[{ name: "Accept", args: [], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "AcceptStream", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, { name: "_r1", type: "error" }] }, { name: "Addr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseChan", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }] }, { name: "GoAway", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "IsClosed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "LocalAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "NumStreams", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "net.Conn" }, { name: "_r1", type: "error" }] }, { name: "OpenStream", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, { name: "_r1", type: "error" }] }, { name: "Ping", args: [], returns: [{ name: "dur", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }, { name: "err", type: "error" }] }, { name: "RemoteAddr", args: [], returns: [{ name: "_r0", type: "net.Addr" }] }, { name: "closeStream", args: [{ name: "id", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "deleteStream", args: [{ name: "id", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "establishStream", args: [{ name: "id", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [] }, { name: "exitErr", args: [{ name: "err", type: "error" }], returns: [] }, { name: "extendKeepalive", args: [], returns: [] }, { name: "getRTT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }] }, { name: "goAway", args: [{ name: "reason", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: "yamux.header" }] }, { name: "handleGoAway", args: [{ name: "hdr", type: "yamux.header" }], returns: [{ name: "_r0", type: "error" }] }, { name: "handlePing", args: [{ name: "hdr", type: "yamux.header" }], returns: [{ name: "_r0", type: "error" }] }, { name: "handleStreamMessage", args: [{ name: "hdr", type: "yamux.header" }], returns: [{ name: "_r0", type: "error" }] }, { name: "incomingStream", args: [{ name: "id", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "measureRTT", args: [], returns: [] }, { name: "recv", args: [], returns: [] }, { name: "recvLoop", args: [], returns: [{ name: "err", type: "error" }] }, { name: "send", args: [], returns: [] }, { name: "sendLoop", args: [], returns: [{ name: "err", type: "error" }] }, { name: "sendMsg", args: [{ name: "hdr", type: "yamux.header" }, { name: "body", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "deadline", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "startKeepalive", args: [], returns: [] }, { name: "startMeasureRTT", args: [], returns: [] }, { name: "stopKeepalive", args: [], returns: [] }],
		Session,
		[{ name: "rtt", key: "rtt", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "remoteGoAway", key: "remoteGoAway", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "localGoAway", key: "localGoAway", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 12, exported: false }, { name: "nextStreamID", key: "nextStreamID", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 16, exported: false }, { name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Config" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 24, exported: false }, { name: "logger", key: "logger", type: { kind: $.TypeKind.Pointer, elemType: "log.Logger" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [5], offset: 32, exported: false }, { name: "conn", key: "conn", type: "net.Conn", pkgPath: "github.com/libp2p/go-yamux/v4", index: [6], offset: 40, exported: false }, { name: "reader", key: "reader", type: "io.Reader", pkgPath: "github.com/libp2p/go-yamux/v4", index: [7], offset: 56, exported: false }, { name: "newMemoryManager", key: "newMemoryManager", type: ({ kind: $.TypeKind.Function, params: [], results: ["yamux.MemoryManager", "error"] } as $.FunctionTypeInfo), pkgPath: "github.com/libp2p/go-yamux/v4", index: [8], offset: 72, exported: false }, { name: "pingLock", key: "pingLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [9], offset: 80, exported: false }, { name: "pingID", key: "pingID", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [10], offset: 88, exported: false }, { name: "activePing", key: "activePing", type: { kind: $.TypeKind.Pointer, elemType: "yamux.ping" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [11], offset: 96, exported: false }, { name: "numIncomingStreams", key: "numIncomingStreams", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [12], offset: 104, exported: false }, { name: "streams", key: "streams", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint32" }, elemType: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [13], offset: 112, exported: false }, { name: "inflight", key: "inflight", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint32" }, elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [14], offset: 120, exported: false }, { name: "streamLock", key: "streamLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [15], offset: 128, exported: false }, { name: "synCh", key: "synCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [16], offset: 136, exported: false }, { name: "acceptCh", key: "acceptCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [17], offset: 144, exported: false }, { name: "sendCh", key: "sendCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [18], offset: 152, exported: false }, { name: "pongCh", key: "pongCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "uint32" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [19], offset: 160, exported: false }, { name: "pingCh", key: "pingCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "uint32" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [20], offset: 168, exported: false }, { name: "recvDoneCh", key: "recvDoneCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [21], offset: 176, exported: false }, { name: "sendDoneCh", key: "sendDoneCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [22], offset: 184, exported: false }, { name: "client", key: "client", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [23], offset: 192, exported: false }, { name: "shutdown", key: "shutdown", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [24], offset: 193, exported: false }, { name: "shutdownErr", key: "shutdownErr", type: "error", pkgPath: "github.com/libp2p/go-yamux/v4", index: [25], offset: 200, exported: false }, { name: "shutdownCh", key: "shutdownCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [26], offset: 216, exported: false }, { name: "shutdownLock", key: "shutdownLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [27], offset: 224, exported: false }, { name: "keepaliveLock", key: "keepaliveLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [28], offset: 232, exported: false }, { name: "keepaliveTimer", key: "keepaliveTimer", type: { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [29], offset: 240, exported: false }, { name: "keepaliveActive", key: "keepaliveActive", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [30], offset: 248, exported: false }]
	)
}

export let nullMemoryManager: nullMemoryManagerImpl | $.VarRef<nullMemoryManagerImpl> | null = new nullMemoryManagerImpl()

export function __goscript_set_nullMemoryManager(__goscriptValue: nullMemoryManagerImpl | $.VarRef<nullMemoryManagerImpl> | null): void {
	nullMemoryManager = __goscriptValue
}

export async function newSession(config: __goscript_mux.Config | $.VarRef<__goscript_mux.Config> | null, conn: net.Conn | null, client: boolean, readBuf: number, newMemoryManager: (() => [MemoryManager | null, $.GoError] | globalThis.Promise<[MemoryManager | null, $.GoError]>) | null): globalThis.Promise<Session | $.VarRef<Session> | null> {
	let reader: io.Reader | null = (conn as io.Reader | null)
	if (readBuf > 0) {
		reader = $.interfaceValue<io.Reader | null>(bufio.NewReaderSize(reader, readBuf), "*bufio.Reader")
	}
	if (newMemoryManager == null) {
		newMemoryManager = $.functionValue((): [MemoryManager | null, $.GoError] => {
			return [$.interfaceValue<MemoryManager | null>(nullMemoryManager, "*yamux.nullMemoryManagerImpl"), null]
		}, ({ kind: $.TypeKind.Function, params: [], results: ["yamux.MemoryManager", "error"] } as $.FunctionTypeInfo))
	}
	let s: Session | $.VarRef<Session> | null = (await (async () => { const __goscriptLiteralField0 = await log.New($.pointerValue<__goscript_mux.Config>(config).LogOutput, "", log.LstdFlags); return new Session({config: config, client: client, logger: __goscriptLiteralField0, conn: conn, reader: reader, streams: $.makeMap<number, __goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null>(), inflight: $.makeMap<number, {}>(), synCh: $.makeChannel<{}>($.pointerValue<__goscript_mux.Config>(config).AcceptBacklog, {}, "both"), acceptCh: $.makeChannel<__goscript_stream.Stream | $.VarRef<__goscript_stream.Stream> | null>($.pointerValue<__goscript_mux.Config>(config).AcceptBacklog, null, "both"), sendCh: $.makeChannel<$.Slice<number>>(64, null, "both"), pongCh: $.makeChannel<number>($.pointerValue<__goscript_mux.Config>(config).PingBacklog, 0, "both"), pingCh: $.makeChannel<number>(0, 0, "both"), recvDoneCh: $.makeChannel<{}>(0, {}, "both"), sendDoneCh: $.makeChannel<{}>(0, {}, "both"), shutdownCh: $.makeChannel<{}>(0, {}, "both"), newMemoryManager: newMemoryManager}) })())
	if (client) {
		$.pointerValue<Session>(s).nextStreamID = $.uint(1, 32)
	} else {
		$.pointerValue<Session>(s).nextStreamID = $.uint(2, 32)
	}
	if ($.pointerValue<__goscript_mux.Config>(config).EnableKeepAlive) {
		await Session.prototype.startKeepalive.call(s)
	}
	queueMicrotask(async () => { await Session.prototype.recv.call(s) })
	queueMicrotask(async () => { await Session.prototype.send.call(s) })
	queueMicrotask(async () => { await Session.prototype.startMeasureRTT.call(s) })
	return s
}

export var handlers: $.Slice<((_p0: Session | $.VarRef<Session> | null, _p1: __goscript__const.header) => $.GoError | globalThis.Promise<$.GoError>) | null>

export async function __goscript_init_handlers(): globalThis.Promise<void> {
	if (((handlers) as any) === undefined) {
		handlers = $.arrayToSlice<((_p0: Session | $.VarRef<Session> | null, _p1: __goscript__const.header) => $.GoError | globalThis.Promise<$.GoError>) | null>([$.functionValue(async (s: Session | $.VarRef<Session> | null, hdr: __goscript__const.header): globalThis.Promise<$.GoError> => await $.pointerValue<Session>(s).handleStreamMessage(hdr), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, "yamux.header"], results: ["error"] } as $.FunctionTypeInfo)), $.functionValue(async (s: Session | $.VarRef<Session> | null, hdr: __goscript__const.header): globalThis.Promise<$.GoError> => await $.pointerValue<Session>(s).handleStreamMessage(hdr), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, "yamux.header"], results: ["error"] } as $.FunctionTypeInfo)), $.functionValue(async (s: Session | $.VarRef<Session> | null, hdr: __goscript__const.header): globalThis.Promise<$.GoError> => await $.pointerValue<Session>(s).handlePing(hdr), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, "yamux.header"], results: ["error"] } as $.FunctionTypeInfo)), $.functionValue(async (s: Session | $.VarRef<Session> | null, hdr: __goscript__const.header): globalThis.Promise<$.GoError> => await $.pointerValue<Session>(s).handleGoAway(hdr), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, "yamux.header"], results: ["error"] } as $.FunctionTypeInfo))])
	}
}

export function __goscript_get_handlers(): $.Slice<((_p0: Session | $.VarRef<Session> | null, _p1: __goscript__const.header) => $.GoError | globalThis.Promise<$.GoError>) | null> {
	if (((handlers) as any) === undefined) {
		throw new Error("goscript package variable handlers read before initialization")
	}
	return handlers
}

export function __goscript_set_handlers(__goscriptValue: $.Slice<((_p0: Session | $.VarRef<Session> | null, _p1: __goscript__const.header) => $.GoError | globalThis.Promise<$.GoError>) | null>): void {
	handlers = __goscriptValue
}

await __goscript_init_handlers()
