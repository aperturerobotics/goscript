// Generated file based on mux.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as net from "@goscript/net/index.js"

import * as os from "@goscript/os/index.js"

import * as time from "@goscript/time/index.js"

import type * as context from "@goscript/context/index.js"

import * as log from "@goscript/log/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript__const from "./const.gs.ts"

import * as __goscript_addr from "./addr.gs.ts"

import * as __goscript_deadline from "./deadline.gs.ts"

import * as __goscript_ping from "./ping.gs.ts"

import * as __goscript_session from "./session.gs.ts"

import * as __goscript_stream from "./stream.gs.ts"

import * as __goscript_util from "./util.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/net/index.js"
import "@goscript/os/index.js"
import "@goscript/time/index.js"
import "@goscript/log/index.js"
import "@goscript/sync/index.js"
import "./const.gs.ts"
import "./addr.gs.ts"
import "./deadline.gs.ts"
import "./ping.gs.ts"
import "./session.gs.ts"
import "./stream.gs.ts"
import "./util.gs.ts"

export class Config {
	// AcceptBacklog is used to limit how many streams may be
	// waiting an accept.
	public get AcceptBacklog(): number {
		return this._fields.AcceptBacklog.value
	}
	public set AcceptBacklog(value: number) {
		this._fields.AcceptBacklog.value = value
	}

	// PingBacklog is used to limit how many ping acks we can queue.
	public get PingBacklog(): number {
		return this._fields.PingBacklog.value
	}
	public set PingBacklog(value: number) {
		this._fields.PingBacklog.value = value
	}

	// EnableKeepalive is used to do a period keep alive
	// messages using a ping.
	public get EnableKeepAlive(): boolean {
		return this._fields.EnableKeepAlive.value
	}
	public set EnableKeepAlive(value: boolean) {
		this._fields.EnableKeepAlive.value = value
	}

	// KeepAliveInterval is how often to perform the keep alive
	public get KeepAliveInterval(): time.Duration {
		return this._fields.KeepAliveInterval.value
	}
	public set KeepAliveInterval(value: time.Duration) {
		this._fields.KeepAliveInterval.value = value
	}

	// MeasureRTTInterval is how often to re-measure the round trip time
	public get MeasureRTTInterval(): time.Duration {
		return this._fields.MeasureRTTInterval.value
	}
	public set MeasureRTTInterval(value: time.Duration) {
		this._fields.MeasureRTTInterval.value = value
	}

	// ConnectionWriteTimeout is meant to be a "safety valve" timeout after
	// we which will suspect a problem with the underlying connection and
	// close it. This is only applied to writes, where's there's generally
	// an expectation that things will move along quickly.
	public get ConnectionWriteTimeout(): time.Duration {
		return this._fields.ConnectionWriteTimeout.value
	}
	public set ConnectionWriteTimeout(value: time.Duration) {
		this._fields.ConnectionWriteTimeout.value = value
	}

	// MaxIncomingStreams is maximum number of concurrent incoming streams
	// that we accept. If the peer tries to open more streams, those will be
	// reset immediately.
	public get MaxIncomingStreams(): number {
		return this._fields.MaxIncomingStreams.value
	}
	public set MaxIncomingStreams(value: number) {
		this._fields.MaxIncomingStreams.value = value
	}

	// InitialStreamWindowSize is used to control the initial
	// window size that we allow for a stream.
	public get InitialStreamWindowSize(): number {
		return this._fields.InitialStreamWindowSize.value
	}
	public set InitialStreamWindowSize(value: number) {
		this._fields.InitialStreamWindowSize.value = value
	}

	// MaxStreamWindowSize is used to control the maximum
	// window size that we allow for a stream.
	public get MaxStreamWindowSize(): number {
		return this._fields.MaxStreamWindowSize.value
	}
	public set MaxStreamWindowSize(value: number) {
		this._fields.MaxStreamWindowSize.value = value
	}

	// LogOutput is used to control the log destination
	public get LogOutput(): io.Writer | null {
		return this._fields.LogOutput.value
	}
	public set LogOutput(value: io.Writer | null) {
		this._fields.LogOutput.value = value
	}

	// ReadBufSize controls the size of the read buffer.
	//
	// Set to 0 to disable it.
	public get ReadBufSize(): number {
		return this._fields.ReadBufSize.value
	}
	public set ReadBufSize(value: number) {
		this._fields.ReadBufSize.value = value
	}

	// WriteCoalesceDelay is the maximum amount of time we'll delay
	// coalescing a packet before sending it. This should be on the order of
	// micro-milliseconds.
	public get WriteCoalesceDelay(): time.Duration {
		return this._fields.WriteCoalesceDelay.value
	}
	public set WriteCoalesceDelay(value: time.Duration) {
		this._fields.WriteCoalesceDelay.value = value
	}

	// MaxMessageSize is the maximum size of a message that we'll send on a
	// stream. This ensures that a single stream doesn't hog a connection.
	public get MaxMessageSize(): number {
		return this._fields.MaxMessageSize.value
	}
	public set MaxMessageSize(value: number) {
		this._fields.MaxMessageSize.value = value
	}

	public _fields: {
		AcceptBacklog: $.VarRef<number>
		PingBacklog: $.VarRef<number>
		EnableKeepAlive: $.VarRef<boolean>
		KeepAliveInterval: $.VarRef<time.Duration>
		MeasureRTTInterval: $.VarRef<time.Duration>
		ConnectionWriteTimeout: $.VarRef<time.Duration>
		MaxIncomingStreams: $.VarRef<number>
		InitialStreamWindowSize: $.VarRef<number>
		MaxStreamWindowSize: $.VarRef<number>
		LogOutput: $.VarRef<io.Writer | null>
		ReadBufSize: $.VarRef<number>
		WriteCoalesceDelay: $.VarRef<time.Duration>
		MaxMessageSize: $.VarRef<number>
	}

	constructor(init?: Partial<{AcceptBacklog?: number, PingBacklog?: number, EnableKeepAlive?: boolean, KeepAliveInterval?: time.Duration, MeasureRTTInterval?: time.Duration, ConnectionWriteTimeout?: time.Duration, MaxIncomingStreams?: number, InitialStreamWindowSize?: number, MaxStreamWindowSize?: number, LogOutput?: io.Writer | null, ReadBufSize?: number, WriteCoalesceDelay?: time.Duration, MaxMessageSize?: number}>) {
		this._fields = {
			AcceptBacklog: $.varRef(init?.AcceptBacklog ?? (0 as unknown as number)),
			PingBacklog: $.varRef(init?.PingBacklog ?? (0 as unknown as number)),
			EnableKeepAlive: $.varRef(init?.EnableKeepAlive ?? (false as unknown as boolean)),
			KeepAliveInterval: $.varRef(init?.KeepAliveInterval ?? (0 as unknown as time.Duration)),
			MeasureRTTInterval: $.varRef(init?.MeasureRTTInterval ?? (0 as unknown as time.Duration)),
			ConnectionWriteTimeout: $.varRef(init?.ConnectionWriteTimeout ?? (0 as unknown as time.Duration)),
			MaxIncomingStreams: $.varRef(init?.MaxIncomingStreams ?? (0 as unknown as number)),
			InitialStreamWindowSize: $.varRef(init?.InitialStreamWindowSize ?? (0 as unknown as number)),
			MaxStreamWindowSize: $.varRef(init?.MaxStreamWindowSize ?? (0 as unknown as number)),
			LogOutput: $.varRef(init?.LogOutput ?? (null as unknown as io.Writer | null)),
			ReadBufSize: $.varRef(init?.ReadBufSize ?? (0 as unknown as number)),
			WriteCoalesceDelay: $.varRef(init?.WriteCoalesceDelay ?? (0 as unknown as time.Duration)),
			MaxMessageSize: $.varRef(init?.MaxMessageSize ?? (0 as unknown as number))
		}
	}

	public clone(): Config {
		const cloned = new Config()
		cloned._fields = {
			AcceptBacklog: $.varRef(this._fields.AcceptBacklog.value),
			PingBacklog: $.varRef(this._fields.PingBacklog.value),
			EnableKeepAlive: $.varRef(this._fields.EnableKeepAlive.value),
			KeepAliveInterval: $.varRef(this._fields.KeepAliveInterval.value),
			MeasureRTTInterval: $.varRef(this._fields.MeasureRTTInterval.value),
			ConnectionWriteTimeout: $.varRef(this._fields.ConnectionWriteTimeout.value),
			MaxIncomingStreams: $.varRef(this._fields.MaxIncomingStreams.value),
			InitialStreamWindowSize: $.varRef(this._fields.InitialStreamWindowSize.value),
			MaxStreamWindowSize: $.varRef(this._fields.MaxStreamWindowSize.value),
			LogOutput: $.varRef(this._fields.LogOutput.value),
			ReadBufSize: $.varRef(this._fields.ReadBufSize.value),
			WriteCoalesceDelay: $.varRef(this._fields.WriteCoalesceDelay.value),
			MaxMessageSize: $.varRef(this._fields.MaxMessageSize.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"yamux.Config",
		() => new Config(),
		[],
		Config,
		[{ name: "AcceptBacklog", key: "AcceptBacklog", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "PingBacklog", key: "PingBacklog", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }, { name: "EnableKeepAlive", key: "EnableKeepAlive", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 16, exported: true }, { name: "KeepAliveInterval", key: "KeepAliveInterval", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [3], offset: 24, exported: true }, { name: "MeasureRTTInterval", key: "MeasureRTTInterval", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [4], offset: 32, exported: true }, { name: "ConnectionWriteTimeout", key: "ConnectionWriteTimeout", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [5], offset: 40, exported: true }, { name: "MaxIncomingStreams", key: "MaxIncomingStreams", type: { kind: $.TypeKind.Basic, name: "uint32" }, index: [6], offset: 48, exported: true }, { name: "InitialStreamWindowSize", key: "InitialStreamWindowSize", type: { kind: $.TypeKind.Basic, name: "uint32" }, index: [7], offset: 52, exported: true }, { name: "MaxStreamWindowSize", key: "MaxStreamWindowSize", type: { kind: $.TypeKind.Basic, name: "uint32" }, index: [8], offset: 56, exported: true }, { name: "LogOutput", key: "LogOutput", type: "io.Writer", index: [9], offset: 64, exported: true }, { name: "ReadBufSize", key: "ReadBufSize", type: { kind: $.TypeKind.Basic, name: "int" }, index: [10], offset: 80, exported: true }, { name: "WriteCoalesceDelay", key: "WriteCoalesceDelay", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, index: [11], offset: 88, exported: true }, { name: "MaxMessageSize", key: "MaxMessageSize", type: { kind: $.TypeKind.Basic, name: "uint32" }, index: [12], offset: 96, exported: true }]
	)
}

export function DefaultConfig(): Config | $.VarRef<Config> | null {
	return new Config({AcceptBacklog: 256, PingBacklog: 32, EnableKeepAlive: true, KeepAliveInterval: $.int64Mul(30, time.Second), MeasureRTTInterval: $.int64Mul(30, time.Second), ConnectionWriteTimeout: $.int64Mul(10, time.Second), MaxIncomingStreams: $.uint(1000, 32), InitialStreamWindowSize: $.uint(262144, 32), MaxStreamWindowSize: $.uint(16777216, 32), LogOutput: $.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"), ReadBufSize: 4096, MaxMessageSize: $.uint(64 * 1024, 32), WriteCoalesceDelay: $.int64Mul(100, time.Microsecond)})
}

export function VerifyConfig(config: Config | $.VarRef<Config> | null): $.GoError {
	if ($.pointerValue<Config>(config).AcceptBacklog <= 0) {
		return fmt.Errorf("backlog must be positive")
	}
	if ($.pointerValue<Config>(config).EnableKeepAlive && ($.pointerValue<Config>(config).KeepAliveInterval == 0)) {
		return fmt.Errorf("keep-alive interval must be positive")
	}
	if ($.pointerValue<Config>(config).MeasureRTTInterval == 0) {
		return fmt.Errorf("measure-rtt interval must be positive")
	}

	if ($.pointerValue<Config>(config).InitialStreamWindowSize < 262144) {
		return errors.New("InitialStreamWindowSize must be larger or equal 256 kB")
	}
	if ($.pointerValue<Config>(config).MaxStreamWindowSize < $.pointerValue<Config>(config).InitialStreamWindowSize) {
		return errors.New("MaxStreamWindowSize must be larger than the InitialStreamWindowSize")
	}
	if ($.pointerValue<Config>(config).MaxMessageSize < 1024) {
		return fmt.Errorf("MaxMessageSize must be greater than a kilobyte")
	}
	if ($.pointerValue<Config>(config).WriteCoalesceDelay < 0) {
		return fmt.Errorf("WriteCoalesceDelay must be >= 0")
	}
	if ($.pointerValue<Config>(config).PingBacklog < 1) {
		return fmt.Errorf("PingBacklog must be > 0")
	}
	return null
}

export async function Server(conn: net.Conn | null, config: Config | $.VarRef<Config> | null, mm: (() => [__goscript_session.MemoryManager | null, $.GoError] | globalThis.Promise<[__goscript_session.MemoryManager | null, $.GoError]>) | null): globalThis.Promise<[__goscript_session.Session | $.VarRef<__goscript_session.Session> | null, $.GoError]> {
	if (config == null) {
		config = DefaultConfig()
	}
	{
		let err = VerifyConfig(config)
		if (err != null) {
			return [null, err]
		}
	}
	return [await __goscript_session.newSession(config, conn, false, $.pointerValue<Config>(config).ReadBufSize, mm), null]
}

export async function Client(conn: net.Conn | null, config: Config | $.VarRef<Config> | null, mm: (() => [__goscript_session.MemoryManager | null, $.GoError] | globalThis.Promise<[__goscript_session.MemoryManager | null, $.GoError]>) | null): globalThis.Promise<[__goscript_session.Session | $.VarRef<__goscript_session.Session> | null, $.GoError]> {
	if (config == null) {
		config = DefaultConfig()
	}

	{
		let err = VerifyConfig(config)
		if (err != null) {
			return [null, err]
		}
	}
	return [await __goscript_session.newSession(config, conn, true, $.pointerValue<Config>(config).ReadBufSize, mm), null]
}
