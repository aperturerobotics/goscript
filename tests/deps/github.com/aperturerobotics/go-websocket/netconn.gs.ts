// Generated file based on netconn.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as net from "@goscript/net/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as wsjs from "@goscript/github.com/aperturerobotics/go-websocket/internal/wsjs/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_netconn_js from "./netconn_js.gs.ts"

import * as __goscript_stringer from "./stringer.gs.ts"

import * as __goscript_ws_js from "./ws_js.gs.ts"
import "@goscript/context/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/github.com/aperturerobotics/go-websocket/internal/wsjs/index.js"
import "@goscript/sync/index.js"
import "./netconn_js.gs.ts"
import "./stringer.gs.ts"
import "./ws_js.gs.ts"

export class netConn {
	public get c(): __goscript_ws_js.Conn | $.VarRef<__goscript_ws_js.Conn> | null {
		return this._fields.c.value
	}
	public set c(value: __goscript_ws_js.Conn | $.VarRef<__goscript_ws_js.Conn> | null) {
		this._fields.c.value = value
	}

	public get msgType(): __goscript_ws_js.MessageType {
		return this._fields.msgType.value
	}
	public set msgType(value: __goscript_ws_js.MessageType) {
		this._fields.msgType.value = value
	}

	public get writeTimer(): time.Timer | $.VarRef<time.Timer> | null {
		return this._fields.writeTimer.value
	}
	public set writeTimer(value: time.Timer | $.VarRef<time.Timer> | null) {
		this._fields.writeTimer.value = value
	}

	public get writeMu(): __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null {
		return this._fields.writeMu.value
	}
	public set writeMu(value: __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null) {
		this._fields.writeMu.value = value
	}

	public get writeExpired(): atomic.Int64 {
		return this._fields.writeExpired.value
	}
	public set writeExpired(value: atomic.Int64) {
		this._fields.writeExpired.value = value
	}

	public get writeCtx(): context.Context | null {
		return this._fields.writeCtx.value
	}
	public set writeCtx(value: context.Context | null) {
		this._fields.writeCtx.value = value
	}

	public get writeCancel(): (() => void) | null {
		return this._fields.writeCancel.value
	}
	public set writeCancel(value: (() => void) | null) {
		this._fields.writeCancel.value = value
	}

	public get readTimer(): time.Timer | $.VarRef<time.Timer> | null {
		return this._fields.readTimer.value
	}
	public set readTimer(value: time.Timer | $.VarRef<time.Timer> | null) {
		this._fields.readTimer.value = value
	}

	public get readMu(): __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null {
		return this._fields.readMu.value
	}
	public set readMu(value: __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null) {
		this._fields.readMu.value = value
	}

	public get readExpired(): atomic.Int64 {
		return this._fields.readExpired.value
	}
	public set readExpired(value: atomic.Int64) {
		this._fields.readExpired.value = value
	}

	public get readCtx(): context.Context | null {
		return this._fields.readCtx.value
	}
	public set readCtx(value: context.Context | null) {
		this._fields.readCtx.value = value
	}

	public get readCancel(): (() => void) | null {
		return this._fields.readCancel.value
	}
	public set readCancel(value: (() => void) | null) {
		this._fields.readCancel.value = value
	}

	public get readEOFed(): boolean {
		return this._fields.readEOFed.value
	}
	public set readEOFed(value: boolean) {
		this._fields.readEOFed.value = value
	}

	public get reader(): io.Reader | null {
		return this._fields.reader.value
	}
	public set reader(value: io.Reader | null) {
		this._fields.reader.value = value
	}

	public _fields: {
		c: $.VarRef<__goscript_ws_js.Conn | $.VarRef<__goscript_ws_js.Conn> | null>
		msgType: $.VarRef<__goscript_ws_js.MessageType>
		writeTimer: $.VarRef<time.Timer | $.VarRef<time.Timer> | null>
		writeMu: $.VarRef<__goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null>
		writeExpired: $.VarRef<atomic.Int64>
		writeCtx: $.VarRef<context.Context | null>
		writeCancel: $.VarRef<(() => void) | null>
		readTimer: $.VarRef<time.Timer | $.VarRef<time.Timer> | null>
		readMu: $.VarRef<__goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null>
		readExpired: $.VarRef<atomic.Int64>
		readCtx: $.VarRef<context.Context | null>
		readCancel: $.VarRef<(() => void) | null>
		readEOFed: $.VarRef<boolean>
		reader: $.VarRef<io.Reader | null>
	}

	constructor(init?: Partial<{c?: __goscript_ws_js.Conn | $.VarRef<__goscript_ws_js.Conn> | null, msgType?: __goscript_ws_js.MessageType, writeTimer?: time.Timer | $.VarRef<time.Timer> | null, writeMu?: __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null, writeExpired?: atomic.Int64, writeCtx?: context.Context | null, writeCancel?: (() => void) | null, readTimer?: time.Timer | $.VarRef<time.Timer> | null, readMu?: __goscript_ws_js.mu | $.VarRef<__goscript_ws_js.mu> | null, readExpired?: atomic.Int64, readCtx?: context.Context | null, readCancel?: (() => void) | null, readEOFed?: boolean, reader?: io.Reader | null}>) {
		this._fields = {
			c: $.varRef(init?.c ?? null),
			msgType: $.varRef(init?.msgType ?? 0),
			writeTimer: $.varRef(init?.writeTimer ?? null),
			writeMu: $.varRef(init?.writeMu ?? null),
			writeExpired: $.varRef(init?.writeExpired ? $.markAsStructValue($.cloneStructValue(init.writeExpired)) : $.markAsStructValue(new atomic.Int64())),
			writeCtx: $.varRef(init?.writeCtx ?? null),
			writeCancel: $.varRef(init?.writeCancel ?? null),
			readTimer: $.varRef(init?.readTimer ?? null),
			readMu: $.varRef(init?.readMu ?? null),
			readExpired: $.varRef(init?.readExpired ? $.markAsStructValue($.cloneStructValue(init.readExpired)) : $.markAsStructValue(new atomic.Int64())),
			readCtx: $.varRef(init?.readCtx ?? null),
			readCancel: $.varRef(init?.readCancel ?? null),
			readEOFed: $.varRef(init?.readEOFed ?? false),
			reader: $.varRef(init?.reader ?? null)
		}
	}

	public clone(): netConn {
		const cloned = new netConn()
		cloned._fields = {
			c: $.varRef(this._fields.c.value),
			msgType: $.varRef(this._fields.msgType.value),
			writeTimer: $.varRef(this._fields.writeTimer.value),
			writeMu: $.varRef(this._fields.writeMu.value),
			writeExpired: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeExpired.value))),
			writeCtx: $.varRef(this._fields.writeCtx.value),
			writeCancel: $.varRef(this._fields.writeCancel.value),
			readTimer: $.varRef(this._fields.readTimer.value),
			readMu: $.varRef(this._fields.readMu.value),
			readExpired: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readExpired.value))),
			readCtx: $.varRef(this._fields.readCtx.value),
			readCancel: $.varRef(this._fields.readCancel.value),
			readEOFed: $.varRef(this._fields.readEOFed.value),
			reader: $.varRef(this._fields.reader.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const nc: netConn | $.VarRef<netConn> | null = this
		time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).writeTimer))
		await $.pointerValue<netConn>(nc).writeCancel!()
		time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).readTimer))
		await $.pointerValue<netConn>(nc).readCancel!()
		return await __goscript_ws_js.Conn.prototype.Close.call($.pointerValue<netConn>(nc).c, 1000, "")
	}

	public LocalAddr(): net.Addr | null {
		const nc: netConn | $.VarRef<netConn> | null = this
		return $.interfaceValue<net.Addr | null>($.markAsStructValue(new websocketAddr()), "websocket.websocketAddr")
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const nc: netConn | $.VarRef<netConn> | null = this
		await using __defer = new $.AsyncDisposableStack()
		await __goscript_ws_js.mu.prototype.forceLock.call($.pointerValue<netConn>(nc).readMu)
		__defer.defer(async () => { await __goscript_ws_js.mu.prototype.unlock.call($.pointerValue<netConn>(nc).readMu) })

		while (true) {
			let [n, err] = await netConn.prototype.read.call(nc, p)
			if (err != null) {
				return [n, err]
			}
			if (n == 0) {
				continue
			}
			return [n, null]
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public RemoteAddr(): net.Addr | null {
		const nc: netConn | $.VarRef<netConn> | null = this
		return $.interfaceValue<net.Addr | null>($.markAsStructValue(new websocketAddr()), "websocket.websocketAddr")
	}

	public SetDeadline(t: time.Time): $.GoError {
		const nc: netConn | $.VarRef<netConn> | null = this
		netConn.prototype.SetWriteDeadline.call(nc, $.markAsStructValue($.cloneStructValue(t)))
		netConn.prototype.SetReadDeadline.call(nc, $.markAsStructValue($.cloneStructValue(t)))
		return null
	}

	public SetReadDeadline(t: time.Time): $.GoError {
		const nc: netConn | $.VarRef<netConn> | null = this
		$.pointerValue<netConn>(nc).readExpired.Store($.int(0))
		if ($.markAsStructValue($.cloneStructValue(t)).IsZero()) {
			time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).readTimer))
		} else {
			let dur = time.Until($.markAsStructValue($.cloneStructValue(t)))
			if (dur <= 0) {
				dur = 1
			}
			time.Timer.prototype.Reset.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).readTimer), dur)
		}
		return null
	}

	public SetWriteDeadline(t: time.Time): $.GoError {
		const nc: netConn | $.VarRef<netConn> | null = this
		$.pointerValue<netConn>(nc).writeExpired.Store($.int(0))
		if ($.markAsStructValue($.cloneStructValue(t)).IsZero()) {
			time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).writeTimer))
		} else {
			let dur = time.Until($.markAsStructValue($.cloneStructValue(t)))
			if (dur <= 0) {
				dur = 1
			}
			time.Timer.prototype.Reset.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).writeTimer), dur)
		}
		return null
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const nc: netConn | $.VarRef<netConn> | null = this
		await using __defer = new $.AsyncDisposableStack()
		await __goscript_ws_js.mu.prototype.forceLock.call($.pointerValue<netConn>(nc).writeMu)
		__defer.defer(async () => { await __goscript_ws_js.mu.prototype.unlock.call($.pointerValue<netConn>(nc).writeMu) })

		if ($.int($.pointerValue<netConn>(nc).writeExpired.Load()) == $.int(1)) {
			return [0, fmt.Errorf("failed to write: %w", (context.DeadlineExceeded as any))]
		}

		let err = await __goscript_ws_js.Conn.prototype.Write.call($.pointerValue<netConn>(nc).c, $.pointerValue<netConn>(nc).writeCtx, $.pointerValue<netConn>(nc).msgType, p)
		if (err != null) {
			return [0, err]
		}
		return [$.len(p), null]
	}

	public async read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let nc: netConn | $.VarRef<netConn> | null = this
		if ($.int($.pointerValue<netConn>(nc).readExpired.Load()) == $.int(1)) {
			return [0, fmt.Errorf("failed to read: %w", (context.DeadlineExceeded as any))]
		}

		if ($.pointerValue<netConn>(nc).readEOFed) {
			return [0, io.EOF]
		}

		if ($.pointerValue<netConn>(nc).reader == null) {
			let [typ, r, err] = await __goscript_ws_js.Conn.prototype.Reader.call($.pointerValue<netConn>(nc).c, $.pointerValue<netConn>(nc).readCtx)
			if (err != null) {
				switch (__goscript_ws_js.CloseStatus(err)) {
					case 1000:
					case 1001:
					{
						$.pointerValue<netConn>(nc).readEOFed = true
						return [0, io.EOF]
						break
					}
				}
				return [0, err]
			}
			if (typ != $.pointerValue<netConn>(nc).msgType) {
				let __goscriptShadow0 = fmt.Errorf("unexpected frame type read (expected %v): %v", $.namedValueInterfaceValue<any>($.pointerValue<netConn>(nc).msgType, "websocket.MessageType", {String: (receiver: any, ...args: any[]) => (__goscript_stringer.MessageType_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" }), $.namedValueInterfaceValue<any>(typ, "websocket.MessageType", {String: (receiver: any, ...args: any[]) => (__goscript_stringer.MessageType_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" }))
				await __goscript_ws_js.Conn.prototype.Close.call($.pointerValue<netConn>(nc).c, 1003, await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
				return [0, __goscriptShadow0]
			}
			$.pointerValue<netConn>(nc).reader = r
		}

		let [n, err] = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<netConn>(nc).reader).Read(p)
		if ($.comparableEqual(err, io.EOF)) {
			$.pointerValue<netConn>(nc).reader = null
			err = null
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"websocket.netConn",
		() => new netConn(),
		[{ name: "Close", args: [], returns: [] }, { name: "LocalAddr", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "RemoteAddr", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "read", args: [], returns: [] }],
		netConn,
		{"c": { kind: $.TypeKind.Pointer, elemType: "websocket.Conn" }, "msgType": { kind: $.TypeKind.Basic, name: "int", typeName: "websocket.MessageType" }, "writeTimer": { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, "writeMu": { kind: $.TypeKind.Pointer, elemType: "websocket.mu" }, "writeExpired": "atomic.Int64", "writeCtx": "context.Context", "writeCancel": ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), "readTimer": { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, "readMu": { kind: $.TypeKind.Pointer, elemType: "websocket.mu" }, "readExpired": "atomic.Int64", "readCtx": "context.Context", "readCancel": ({ kind: $.TypeKind.Function, name: "context.CancelFunc", params: [], results: [] } as $.FunctionTypeInfo), "readEOFed": { kind: $.TypeKind.Basic, name: "bool" }, "reader": "io.Reader"}
	)
}

export class websocketAddr {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): websocketAddr {
		const cloned = new websocketAddr()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		const a = this
		return "websocket"
	}

	public String(): string {
		const a = this
		return "websocket/unknown-addr"
	}

	static __typeInfo = $.registerStructType(
		"websocket.websocketAddr",
		() => new websocketAddr(),
		[{ name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		websocketAddr,
		{}
	)
}

export async function NetConn(ctx: context.Context | null, c: __goscript_ws_js.Conn | $.VarRef<__goscript_ws_js.Conn> | null, msgType: __goscript_ws_js.MessageType): globalThis.Promise<net.Conn | null> {
	__goscript_ws_js.Conn.prototype.SetReadLimit.call(c, $.int(-1))

	let nc: netConn | $.VarRef<netConn> | null = (() => { const __goscriptLiteralField0 = __goscript_ws_js.newMu(c); const __goscriptLiteralField1 = __goscript_ws_js.newMu(c); return new netConn({c: c, msgType: msgType, readMu: __goscriptLiteralField0, writeMu: __goscriptLiteralField1}) })()

	let __goscriptTuple0: any = context.WithCancel($.pointerValueOrNil(ctx)!)
	$.pointerValue<netConn>(nc).writeCtx = __goscriptTuple0[0]
	$.pointerValue<netConn>(nc).writeCancel = __goscriptTuple0[1]
	let __goscriptTuple1: any = context.WithCancel($.pointerValueOrNil(ctx)!)
	$.pointerValue<netConn>(nc).readCtx = __goscriptTuple1[0]
	$.pointerValue<netConn>(nc).readCancel = __goscriptTuple1[1]

	$.pointerValue<netConn>(nc).writeTimer = time.AfterFunc($.int("9223372036854775807", 64), $.functionValue(async (): globalThis.Promise<void> => {
		await using __defer = new $.AsyncDisposableStack()
		if (!await __goscript_ws_js.mu.prototype.tryLock.call($.pointerValue<netConn>(nc).writeMu)) {
			// If the lock cannot be acquired, then there is an
			// active write goroutine and so we should cancel the context.
			await $.pointerValue<netConn>(nc).writeCancel!()
			return
		}
		__defer.defer(async () => { await __goscript_ws_js.mu.prototype.unlock.call($.pointerValue<netConn>(nc).writeMu) })

		// Prevents future writes from writing until the deadline is reset.
		$.pointerValue<netConn>(nc).writeExpired.Store($.int(1))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	if (!time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).writeTimer))) {
		await $.chanRecv($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).writeTimer).C)
	}

	$.pointerValue<netConn>(nc).readTimer = time.AfterFunc($.int("9223372036854775807", 64), $.functionValue(async (): globalThis.Promise<void> => {
		await using __defer = new $.AsyncDisposableStack()
		if (!await __goscript_ws_js.mu.prototype.tryLock.call($.pointerValue<netConn>(nc).readMu)) {
			// If the lock cannot be acquired, then there is an
			// active read goroutine and so we should cancel the context.
			await $.pointerValue<netConn>(nc).readCancel!()
			return
		}
		__defer.defer(async () => { await __goscript_ws_js.mu.prototype.unlock.call($.pointerValue<netConn>(nc).readMu) })

		// Prevents future reads from reading until the deadline is reset.
		$.pointerValue<netConn>(nc).readExpired.Store($.int(1))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	if (!time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).readTimer))) {
		await $.chanRecv($.pointerValue<time.Timer>($.pointerValue<netConn>(nc).readTimer).C)
	}

	return $.interfaceValue<net.Conn | null>(nc, "*websocket.netConn")
}
