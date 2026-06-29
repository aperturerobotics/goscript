// Generated file based on stream-yamux.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as time from "@goscript/time/index.js"

import * as yamux2 from "@goscript/github.com/libp2p/go-yamux/v4/index.js"

import type * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_errors from "./errors.gs.ts"

import type * as __goscript_muxed from "./muxed.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/libp2p/go-yamux/v4/index.js"
import "@goscript/sync/index.js"
import "./errors.gs.ts"

export class yamuxStream {
	public get sendWindow(): number {
		return this._fields.sendWindow.value
	}
	public set sendWindow(value: number) {
		this._fields.sendWindow.value = value
	}

	public get memorySpan(): yamux2.MemoryManager | null {
		return this._fields.memorySpan.value
	}
	public set memorySpan(value: yamux2.MemoryManager | null) {
		this._fields.memorySpan.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get session(): yamux2.Session | $.VarRef<yamux2.Session> | null {
		return this._fields.session.value
	}
	public set session(value: yamux2.Session | $.VarRef<yamux2.Session> | null) {
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

	public get state(): any {
		return this._fields.state.value
	}
	public set state(value: any) {
		this._fields.state.value = value
	}

	public get writeState(): any {
		return this._fields.writeState.value
	}
	public set writeState(value: any) {
		this._fields.writeState.value = value
	}

	public get readState(): any {
		return this._fields.readState.value
	}
	public set readState(value: any) {
		this._fields.readState.value = value
	}

	public get stateLock(): sync.Mutex {
		return this._fields.stateLock.value
	}
	public set stateLock(value: sync.Mutex) {
		this._fields.stateLock.value = value
	}

	public get recvBuf(): any {
		return this._fields.recvBuf.value
	}
	public set recvBuf(value: any) {
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

	public get readDeadline(): any {
		return this._fields.readDeadline.value
	}
	public set readDeadline(value: any) {
		this._fields.readDeadline.value = value
	}

	public get writeDeadline(): any {
		return this._fields.writeDeadline.value
	}
	public set writeDeadline(value: any) {
		this._fields.writeDeadline.value = value
	}

	public _fields: {
		sendWindow: $.VarRef<number>
		memorySpan: $.VarRef<yamux2.MemoryManager | null>
		id: $.VarRef<number>
		session: $.VarRef<yamux2.Session | $.VarRef<yamux2.Session> | null>
		recvWindow: $.VarRef<number>
		epochStart: $.VarRef<time.Time>
		state: $.VarRef<any>
		writeState: $.VarRef<any>
		readState: $.VarRef<any>
		stateLock: $.VarRef<sync.Mutex>
		recvBuf: $.VarRef<any>
		recvNotifyCh: $.VarRef<$.Channel<{}> | null>
		sendNotifyCh: $.VarRef<$.Channel<{}> | null>
		readDeadline: $.VarRef<any>
		writeDeadline: $.VarRef<any>
	}

	constructor(init?: Partial<{sendWindow?: number, memorySpan?: yamux2.MemoryManager | null, id?: number, session?: yamux2.Session | $.VarRef<yamux2.Session> | null, recvWindow?: number, epochStart?: time.Time, state?: any, writeState?: any, readState?: any, stateLock?: sync.Mutex, recvBuf?: any, recvNotifyCh?: $.Channel<{}> | null, sendNotifyCh?: $.Channel<{}> | null, readDeadline?: any, writeDeadline?: any}>) {
		this._fields = {
			sendWindow: $.varRef(init?.sendWindow ?? (0 as number)),
			memorySpan: $.varRef(init?.memorySpan ?? (null as yamux2.MemoryManager | null)),
			id: $.varRef(init?.id ?? (0 as number)),
			session: $.varRef(init?.session ?? (null as yamux2.Session | $.VarRef<yamux2.Session> | null)),
			recvWindow: $.varRef(init?.recvWindow ?? (0 as number)),
			epochStart: $.varRef(init?.epochStart ? $.markAsStructValue($.cloneStructValue(init.epochStart)) : $.markAsStructValue(new time.Time())),
			state: $.varRef(init?.state ?? (0 as any)),
			writeState: $.varRef(init?.writeState ?? (0 as any)),
			readState: $.varRef(init?.readState ?? (0 as any)),
			stateLock: $.varRef(init?.stateLock ? $.markAsStructValue($.cloneStructValue(init.stateLock)) : $.markAsStructValue(new sync.Mutex())),
			recvBuf: $.varRef(init?.recvBuf ?? (undefined as any as any)),
			recvNotifyCh: $.varRef(init?.recvNotifyCh ?? (null as $.Channel<{}> | null)),
			sendNotifyCh: $.varRef(init?.sendNotifyCh ?? (null as $.Channel<{}> | null)),
			readDeadline: $.varRef(init?.readDeadline ?? (undefined as any as any)),
			writeDeadline: $.varRef(init?.writeDeadline ?? (undefined as any as any))
		}
	}

	public clone(): yamuxStream {
		const cloned = new yamuxStream()
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
			recvBuf: $.varRef(this._fields.recvBuf.value),
			recvNotifyCh: $.varRef(this._fields.recvNotifyCh.value),
			sendNotifyCh: $.varRef(this._fields.sendNotifyCh.value),
			readDeadline: $.varRef(this._fields.readDeadline.value),
			writeDeadline: $.varRef(this._fields.writeDeadline.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.Close.call(yamuxStream.prototype.yamux.call(s))
	}

	public async CloseRead(): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.CloseRead.call(yamuxStream.prototype.yamux.call(s))
	}

	public async CloseWrite(): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.CloseWrite.call(yamuxStream.prototype.yamux.call(s))
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		let [n, err] = await yamux2.Stream.prototype.Read.call(yamuxStream.prototype.yamux.call(s), b)
		if (errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil($.interfaceValue<$.GoError>(yamux2.ErrStreamReset, "*yamux.Error"))!)) {
			err = __goscript_errors.ErrReset
		}
		return [n, err]
	}

	public async Reset(): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.Reset.call(yamuxStream.prototype.yamux.call(s))
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.SetDeadline.call(yamuxStream.prototype.yamux.call(s), $.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.SetReadDeadline.call(yamuxStream.prototype.yamux.call(s), $.markAsStructValue($.cloneStructValue(t)))
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return await yamux2.Stream.prototype.SetWriteDeadline.call(yamuxStream.prototype.yamux.call(s), $.markAsStructValue($.cloneStructValue(t)))
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		let [n, err] = await yamux2.Stream.prototype.Write.call(yamuxStream.prototype.yamux.call(s), b)
		if (errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil($.interfaceValue<$.GoError>(yamux2.ErrStreamReset, "*yamux.Error"))!)) {
			err = __goscript_errors.ErrReset
		}
		return [n, err]
	}

	public yamux(): yamux2.Stream | $.VarRef<yamux2.Stream> | null {
		const s: yamuxStream | $.VarRef<yamuxStream> | null = this
		return $.unsafePointerCast<yamux2.Stream | $.VarRef<yamux2.Stream> | null>(s)
	}

	static __typeInfo = $.registerStructType(
		"srpc.yamuxStream",
		() => new yamuxStream(),
		[{ name: "Close", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseRead", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "CloseWrite", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "SetDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetReadDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "SetWriteDeadline", args: [{ name: "t", type: "time.Time" }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "yamux", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Stream" } }] }],
		yamuxStream,
		[{ name: "sendWindow", key: "sendWindow", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "memorySpan", key: "memorySpan", type: "yamux.MemoryManager", pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 24, exported: false }, { name: "session", key: "session", type: { kind: $.TypeKind.Pointer, elemType: "yamux.Session" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 32, exported: false }, { name: "recvWindow", key: "recvWindow", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 40, exported: false }, { name: "epochStart", key: "epochStart", type: "time.Time", pkgPath: "github.com/libp2p/go-yamux/v4", index: [5], offset: 48, exported: false }, { name: "state", key: "state", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.streamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [6], offset: 72, exported: false }, { name: "writeState", key: "writeState", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.halfStreamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [7], offset: 80, exported: false }, { name: "readState", key: "readState", type: { kind: $.TypeKind.Basic, name: "int", typeName: "yamux.halfStreamState" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [8], offset: 88, exported: false }, { name: "stateLock", key: "stateLock", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [9], offset: 96, exported: false }, { name: "recvBuf", key: "recvBuf", type: "yamux.segmentedBuffer", pkgPath: "github.com/libp2p/go-yamux/v4", index: [10], offset: 104, exported: false }, { name: "recvNotifyCh", key: "recvNotifyCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [11], offset: 160, exported: false }, { name: "sendNotifyCh", key: "sendNotifyCh", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [12], offset: 168, exported: false }, { name: "readDeadline", key: "readDeadline", type: "yamux.pipeDeadline", pkgPath: "github.com/libp2p/go-yamux/v4", index: [13], offset: 176, exported: false }, { name: "writeDeadline", key: "writeDeadline", type: "yamux.pipeDeadline", pkgPath: "github.com/libp2p/go-yamux/v4", index: [14], offset: 200, exported: false }]
	)
}
