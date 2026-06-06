// Generated file based on muxed-yamux.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as yamux2 from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import * as io from "@goscript/io/index.js"

import * as log from "@goscript/log/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import type * as __goscript_muxed from "./muxed.gs.ts"

import * as __goscript_stream_yamux from "./stream-yamux.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/libp2p/go-yamux/v4/index.js"
import "@goscript/io/index.js"
import "@goscript/log/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./stream-yamux.gs.ts"

export class yamuxConn {
	public get rtt(): number {
		return this._fields.rtt.value
	}
	public set rtt(value: number) {
		this._fields.rtt.value = value
	}

	public get remoteGoAway(): number {
		return this._fields.remoteGoAway.value
	}
	public set remoteGoAway(value: number) {
		this._fields.remoteGoAway.value = value
	}

	public get localGoAway(): number {
		return this._fields.localGoAway.value
	}
	public set localGoAway(value: number) {
		this._fields.localGoAway.value = value
	}

	public get nextStreamID(): number {
		return this._fields.nextStreamID.value
	}
	public set nextStreamID(value: number) {
		this._fields.nextStreamID.value = value
	}

	public get config(): yamux2.Config | $.VarRef<yamux2.Config> | null {
		return this._fields.config.value
	}
	public set config(value: yamux2.Config | $.VarRef<yamux2.Config> | null) {
		this._fields.config.value = value
	}

	public get logger(): log.Logger | $.VarRef<log.Logger> | null {
		return this._fields.logger.value
	}
	public set logger(value: log.Logger | $.VarRef<log.Logger> | null) {
		this._fields.logger.value = value
	}

	public get conn(): net.Conn | null {
		return this._fields.conn.value
	}
	public set conn(value: net.Conn | null) {
		this._fields.conn.value = value
	}

	public get reader(): io.Reader | null {
		return this._fields.reader.value
	}
	public set reader(value: io.Reader | null) {
		this._fields.reader.value = value
	}

	public get newMemoryManager(): (() => [yamux2.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux2.MemoryManager | null, $.GoError]>) | null {
		return this._fields.newMemoryManager.value
	}
	public set newMemoryManager(value: (() => [yamux2.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux2.MemoryManager | null, $.GoError]>) | null) {
		this._fields.newMemoryManager.value = value
	}

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

	public get activePing(): any {
		return this._fields.activePing.value
	}
	public set activePing(value: any) {
		this._fields.activePing.value = value
	}

	public get numIncomingStreams(): number {
		return this._fields.numIncomingStreams.value
	}
	public set numIncomingStreams(value: number) {
		this._fields.numIncomingStreams.value = value
	}

	public get streams(): Map<number, yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null {
		return this._fields.streams.value
	}
	public set streams(value: Map<number, yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null) {
		this._fields.streams.value = value
	}

	public get inflight(): Map<number, {}> | null {
		return this._fields.inflight.value
	}
	public set inflight(value: Map<number, {}> | null) {
		this._fields.inflight.value = value
	}

	public get streamLock(): sync.Mutex {
		return this._fields.streamLock.value
	}
	public set streamLock(value: sync.Mutex) {
		this._fields.streamLock.value = value
	}

	public get synCh(): $.Channel<{}> | null {
		return this._fields.synCh.value
	}
	public set synCh(value: $.Channel<{}> | null) {
		this._fields.synCh.value = value
	}

	public get acceptCh(): $.Channel<yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null {
		return this._fields.acceptCh.value
	}
	public set acceptCh(value: $.Channel<yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null) {
		this._fields.acceptCh.value = value
	}

	public get sendCh(): $.Channel<$.Slice<number>> | null {
		return this._fields.sendCh.value
	}
	public set sendCh(value: $.Channel<$.Slice<number>> | null) {
		this._fields.sendCh.value = value
	}

	public get pongCh(): $.Channel<number> | null {
		return this._fields.pongCh.value
	}
	public set pongCh(value: $.Channel<number> | null) {
		this._fields.pongCh.value = value
	}

	public get pingCh(): $.Channel<number> | null {
		return this._fields.pingCh.value
	}
	public set pingCh(value: $.Channel<number> | null) {
		this._fields.pingCh.value = value
	}

	public get recvDoneCh(): $.Channel<{}> | null {
		return this._fields.recvDoneCh.value
	}
	public set recvDoneCh(value: $.Channel<{}> | null) {
		this._fields.recvDoneCh.value = value
	}

	public get sendDoneCh(): $.Channel<{}> | null {
		return this._fields.sendDoneCh.value
	}
	public set sendDoneCh(value: $.Channel<{}> | null) {
		this._fields.sendDoneCh.value = value
	}

	public get client(): boolean {
		return this._fields.client.value
	}
	public set client(value: boolean) {
		this._fields.client.value = value
	}

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
		rtt: $.VarRef<number>
		remoteGoAway: $.VarRef<number>
		localGoAway: $.VarRef<number>
		nextStreamID: $.VarRef<number>
		config: $.VarRef<yamux2.Config | $.VarRef<yamux2.Config> | null>
		logger: $.VarRef<log.Logger | $.VarRef<log.Logger> | null>
		conn: $.VarRef<net.Conn | null>
		reader: $.VarRef<io.Reader | null>
		newMemoryManager: $.VarRef<(() => [yamux2.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux2.MemoryManager | null, $.GoError]>) | null>
		pingLock: $.VarRef<sync.Mutex>
		pingID: $.VarRef<number>
		activePing: $.VarRef<any>
		numIncomingStreams: $.VarRef<number>
		streams: $.VarRef<Map<number, yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null>
		inflight: $.VarRef<Map<number, {}> | null>
		streamLock: $.VarRef<sync.Mutex>
		synCh: $.VarRef<$.Channel<{}> | null>
		acceptCh: $.VarRef<$.Channel<yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null>
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

	constructor(init?: Partial<{rtt?: number, remoteGoAway?: number, localGoAway?: number, nextStreamID?: number, config?: yamux2.Config | $.VarRef<yamux2.Config> | null, logger?: log.Logger | $.VarRef<log.Logger> | null, conn?: net.Conn | null, reader?: io.Reader | null, newMemoryManager?: (() => [yamux2.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux2.MemoryManager | null, $.GoError]>) | null, pingLock?: sync.Mutex, pingID?: number, activePing?: any, numIncomingStreams?: number, streams?: Map<number, yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null, inflight?: Map<number, {}> | null, streamLock?: sync.Mutex, synCh?: $.Channel<{}> | null, acceptCh?: $.Channel<yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null, sendCh?: $.Channel<$.Slice<number>> | null, pongCh?: $.Channel<number> | null, pingCh?: $.Channel<number> | null, recvDoneCh?: $.Channel<{}> | null, sendDoneCh?: $.Channel<{}> | null, client?: boolean, shutdown?: boolean, shutdownErr?: $.GoError, shutdownCh?: $.Channel<{}> | null, shutdownLock?: sync.Mutex, keepaliveLock?: sync.Mutex, keepaliveTimer?: time.Timer | $.VarRef<time.Timer> | null, keepaliveActive?: boolean}>) {
		this._fields = {
			rtt: $.varRef(init?.rtt ?? (0 as unknown as number)),
			remoteGoAway: $.varRef(init?.remoteGoAway ?? (0 as unknown as number)),
			localGoAway: $.varRef(init?.localGoAway ?? (0 as unknown as number)),
			nextStreamID: $.varRef(init?.nextStreamID ?? (0 as unknown as number)),
			config: $.varRef(init?.config ?? (null as unknown as yamux2.Config | $.VarRef<yamux2.Config> | null)),
			logger: $.varRef(init?.logger ?? (null as unknown as log.Logger | $.VarRef<log.Logger> | null)),
			conn: $.varRef(init?.conn ?? (null as unknown as net.Conn | null)),
			reader: $.varRef(init?.reader ?? (null as unknown as io.Reader | null)),
			newMemoryManager: $.varRef(init?.newMemoryManager ?? (null as unknown as (() => [yamux2.MemoryManager | null, $.GoError] | globalThis.Promise<[yamux2.MemoryManager | null, $.GoError]>) | null)),
			pingLock: $.varRef(init?.pingLock ? $.markAsStructValue($.cloneStructValue(init.pingLock)) : $.markAsStructValue(new sync.Mutex())),
			pingID: $.varRef(init?.pingID ?? (0 as unknown as number)),
			activePing: $.varRef(init?.activePing ?? (null as unknown as any)),
			numIncomingStreams: $.varRef(init?.numIncomingStreams ?? (0 as unknown as number)),
			streams: $.varRef(init?.streams ?? (null as unknown as Map<number, yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null)),
			inflight: $.varRef(init?.inflight ?? (null as unknown as Map<number, {}> | null)),
			streamLock: $.varRef(init?.streamLock ? $.markAsStructValue($.cloneStructValue(init.streamLock)) : $.markAsStructValue(new sync.Mutex())),
			synCh: $.varRef(init?.synCh ?? (null as unknown as $.Channel<{}> | null)),
			acceptCh: $.varRef(init?.acceptCh ?? (null as unknown as $.Channel<yamux2.Stream | $.VarRef<yamux2.Stream> | null> | null)),
			sendCh: $.varRef(init?.sendCh ?? (null as unknown as $.Channel<$.Slice<number>> | null)),
			pongCh: $.varRef(init?.pongCh ?? (null as unknown as $.Channel<number> | null)),
			pingCh: $.varRef(init?.pingCh ?? (null as unknown as $.Channel<number> | null)),
			recvDoneCh: $.varRef(init?.recvDoneCh ?? (null as unknown as $.Channel<{}> | null)),
			sendDoneCh: $.varRef(init?.sendDoneCh ?? (null as unknown as $.Channel<{}> | null)),
			client: $.varRef(init?.client ?? (false as unknown as boolean)),
			shutdown: $.varRef(init?.shutdown ?? (false as unknown as boolean)),
			shutdownErr: $.varRef(init?.shutdownErr ?? (null as unknown as $.GoError)),
			shutdownCh: $.varRef(init?.shutdownCh ?? (null as unknown as $.Channel<{}> | null)),
			shutdownLock: $.varRef(init?.shutdownLock ? $.markAsStructValue($.cloneStructValue(init.shutdownLock)) : $.markAsStructValue(new sync.Mutex())),
			keepaliveLock: $.varRef(init?.keepaliveLock ? $.markAsStructValue($.cloneStructValue(init.keepaliveLock)) : $.markAsStructValue(new sync.Mutex())),
			keepaliveTimer: $.varRef(init?.keepaliveTimer ?? (null as unknown as time.Timer | $.VarRef<time.Timer> | null)),
			keepaliveActive: $.varRef(init?.keepaliveActive ?? (false as unknown as boolean))
		}
	}

	public clone(): yamuxConn {
		const cloned = new yamuxConn()
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

	public async AcceptStream(): globalThis.Promise<[__goscript_muxed.MuxedStream | null, $.GoError]> {
		const c: yamuxConn | $.VarRef<yamuxConn> | null = this
		let __goscriptTuple0: any = await yamux2.Session.prototype.AcceptStream.call(yamuxConn.prototype.yamux.call(c))
		let s: yamux2.Stream | $.VarRef<yamux2.Stream> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return [$.interfaceValue<__goscript_muxed.MuxedStream | null>((s as unknown as __goscript_stream_yamux.yamuxStream | $.VarRef<__goscript_stream_yamux.yamuxStream> | null), "*srpc.yamuxStream"), null]
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const c: yamuxConn | $.VarRef<yamuxConn> | null = this
		return await yamux2.Session.prototype.Close.call(yamuxConn.prototype.yamux.call(c))
	}

	public async IsClosed(): globalThis.Promise<boolean> {
		const c: yamuxConn | $.VarRef<yamuxConn> | null = this
		return await yamux2.Session.prototype.IsClosed.call(yamuxConn.prototype.yamux.call(c))
	}

	public async OpenStream(ctx: context.Context | null): globalThis.Promise<[__goscript_muxed.MuxedStream | null, $.GoError]> {
		const c: yamuxConn | $.VarRef<yamuxConn> | null = this
		let __goscriptTuple1: any = await yamux2.Session.prototype.OpenStream.call(yamuxConn.prototype.yamux.call(c), ctx)
		let s: yamux2.Stream | $.VarRef<yamux2.Stream> | null = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [$.interfaceValue<__goscript_muxed.MuxedStream | null>((s as unknown as __goscript_stream_yamux.yamuxStream | $.VarRef<__goscript_stream_yamux.yamuxStream> | null), "*srpc.yamuxStream"), null]
	}

	public yamux(): yamux2.Session | $.VarRef<yamux2.Session> | null {
		const c: yamuxConn | $.VarRef<yamuxConn> | null = this
		return (c as unknown as yamux2.Session | $.VarRef<yamux2.Session> | null)
	}

	static __typeInfo = $.registerStructType(
		"srpc.yamuxConn",
		() => new yamuxConn(),
		[{ name: "AcceptStream", args: [], returns: [{ name: "_r0", type: "srpc.MuxedStream" }, { name: "_r1", type: "error" }] }, { name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "IsClosed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "OpenStream", args: [{ name: "ctx", type: "context.Context" }], returns: [{ name: "_r0", type: "srpc.MuxedStream" }, { name: "_r1", type: "error" }] }, { name: "yamux", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Session" } }] }],
		yamuxConn,
		[{ name: "rtt", key: "rtt", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "remoteGoAway", key: "remoteGoAway", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "localGoAway", key: "localGoAway", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 12, exported: false }, { name: "nextStreamID", key: "nextStreamID", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 16, exported: false }, { name: "config", key: "config", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Config" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 24, exported: false }, { name: "logger", key: "logger", type: { kind: $.TypeKind.Pointer, elemType: "log.Logger" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [5], offset: 32, exported: false }, { name: "conn", key: "conn", type: "net.Conn", pkgPath: "github.com/libp2p/go-yamux/v4", index: [6], offset: 40, exported: false }, { name: "reader", key: "reader", type: "io.Reader", pkgPath: "github.com/libp2p/go-yamux/v4", index: [7], offset: 56, exported: false }, { name: "newMemoryManager", key: "newMemoryManager", type: ({ kind: $.TypeKind.Function, params: [], results: ["yamux.MemoryManager", "error"] } as $.FunctionTypeInfo), pkgPath: "github.com/libp2p/go-yamux/v4", index: [8], offset: 72, exported: false }, { name: "pingLock", key: "pingLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [9], offset: 80, exported: false }, { name: "pingID", key: "pingID", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [10], offset: 88, exported: false }, { name: "activePing", key: "activePing", type: { kind: $.TypeKind.Pointer, elemType: "yamux.ping" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [11], offset: 96, exported: false }, { name: "numIncomingStreams", key: "numIncomingStreams", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [12], offset: 104, exported: false }, { name: "streams", key: "streams", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint32" }, elemType: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [13], offset: 112, exported: false }, { name: "inflight", key: "inflight", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint32" }, elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [14], offset: 120, exported: false }, { name: "streamLock", key: "streamLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [15], offset: 128, exported: false }, { name: "synCh", key: "synCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [16], offset: 136, exported: false }, { name: "acceptCh", key: "acceptCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [17], offset: 144, exported: false }, { name: "sendCh", key: "sendCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [18], offset: 152, exported: false }, { name: "pongCh", key: "pongCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "uint32" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [19], offset: 160, exported: false }, { name: "pingCh", key: "pingCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "uint32" } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [20], offset: 168, exported: false }, { name: "recvDoneCh", key: "recvDoneCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [21], offset: 176, exported: false }, { name: "sendDoneCh", key: "sendDoneCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [22], offset: 184, exported: false }, { name: "client", key: "client", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [23], offset: 192, exported: false }, { name: "shutdown", key: "shutdown", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [24], offset: 193, exported: false }, { name: "shutdownErr", key: "shutdownErr", type: "error", pkgPath: "github.com/libp2p/go-yamux/v4", index: [25], offset: 200, exported: false }, { name: "shutdownCh", key: "shutdownCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [26], offset: 216, exported: false }, { name: "shutdownLock", key: "shutdownLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [27], offset: 224, exported: false }, { name: "keepaliveLock", key: "keepaliveLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [28], offset: 232, exported: false }, { name: "keepaliveTimer", key: "keepaliveTimer", type: { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [29], offset: 240, exported: false }, { name: "keepaliveActive", key: "keepaliveActive", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [30], offset: 248, exported: false }]
	)
}

export function newYamuxConn(sess: yamux2.Session | $.VarRef<yamux2.Session> | null): __goscript_muxed.MuxedConn | null {
	return $.interfaceValue<__goscript_muxed.MuxedConn | null>((sess as unknown as yamuxConn | $.VarRef<yamuxConn> | null), "*srpc.yamuxConn")
}
