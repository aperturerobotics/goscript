// Generated file based on pipe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_net from "./net.gs.ts"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./net.gs.ts"

export class pipeDeadline {
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get timer(): time.Timer | $.VarRef<time.Timer> | null {
		return this._fields.timer.value
	}
	public set timer(value: time.Timer | $.VarRef<time.Timer> | null) {
		this._fields.timer.value = value
	}

	public get cancel(): $.Channel<{}> | null {
		return this._fields.cancel.value
	}
	public set cancel(value: $.Channel<{}> | null) {
		this._fields.cancel.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>
		timer: $.VarRef<time.Timer | $.VarRef<time.Timer> | null>
		cancel: $.VarRef<$.Channel<{}> | null>
	}

	constructor(init?: Partial<{mu?: sync.Mutex, timer?: time.Timer | $.VarRef<time.Timer> | null, cancel?: $.Channel<{}> | null}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			timer: $.varRef(init?.timer ?? null),
			cancel: $.varRef(init?.cancel ?? null)
		}
	}

	public clone(): pipeDeadline {
		const cloned = new pipeDeadline()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			timer: $.varRef(this._fields.timer.value),
			cancel: $.varRef(this._fields.cancel.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ["set"](t: time.Time): globalThis.Promise<void> {
		let d: pipeDeadline | $.VarRef<pipeDeadline> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<pipeDeadline>(d).mu.Lock()
		__defer.defer(() => { $.pointerValue<pipeDeadline>(d).mu.Unlock() })

		if (($.pointerValue<pipeDeadline>(d).timer != null) && !time.Timer.prototype.Stop.call($.pointerValue<time.Timer>($.pointerValue<pipeDeadline>(d).timer))) {
			await $.chanRecv($.pointerValue<pipeDeadline>(d).cancel)
		}
		$.pointerValue<pipeDeadline>(d).timer = null

		// Time is zero, then there is no deadline.
		let closed = await isClosedChan($.pointerValue<pipeDeadline>(d).cancel)
		if ($.markAsStructValue($.cloneStructValue(t)).IsZero()) {
			if (closed) {
				$.pointerValue<pipeDeadline>(d).cancel = $.makeChannel<{}>(0, {}, "both")
			}
			return
		}

		// Time in the future, setup a timer to cancel in the future.
		{
			let dur = time.Until($.markAsStructValue($.cloneStructValue(t)))
			if (dur > 0) {
				if (closed) {
					$.pointerValue<pipeDeadline>(d).cancel = $.makeChannel<{}>(0, {}, "both")
				}
				$.pointerValue<pipeDeadline>(d).timer = time.AfterFunc(dur, $.functionValue((): void => {
					$.pointerValue<pipeDeadline>(d).cancel!.close()
				}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
				return
			}
		}

		// Time in the past, so close immediately.
		if (!closed) {
			$.pointerValue<pipeDeadline>(d).cancel!.close()
		}
	}

	public async wait(): globalThis.Promise<$.Channel<{}> | null> {
		const d: pipeDeadline | $.VarRef<pipeDeadline> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<pipeDeadline>(d).mu.Lock()
		__defer.defer(() => { $.pointerValue<pipeDeadline>(d).mu.Unlock() })
		return $.pointerValue<pipeDeadline>(d).cancel
	}

	static __typeInfo = $.registerStructType(
		"net.pipeDeadline",
		() => new pipeDeadline(),
		[{ name: "set", args: [], returns: [] }, { name: "wait", args: [], returns: [] }],
		pipeDeadline,
		{"mu": "sync.Mutex", "timer": { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, "cancel": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }}
	)
}

export class pipeAddr {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): pipeAddr {
		const cloned = new pipeAddr()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Network(): string {
		return "pipe"
	}

	public String(): string {
		return "pipe"
	}

	static __typeInfo = $.registerStructType(
		"net.pipeAddr",
		() => new pipeAddr(),
		[{ name: "Network", args: [], returns: [] }, { name: "String", args: [], returns: [] }],
		pipeAddr,
		{}
	)
}

export class pipe {
	public get wrMu(): sync.Mutex {
		return this._fields.wrMu.value
	}
	public set wrMu(value: sync.Mutex) {
		this._fields.wrMu.value = value
	}

	// Used by local Read to interact with remote Write.
	// Successful receive on rdRx is always followed by send on rdTx.
	public get rdRx(): $.Channel<$.Slice<number>> | null {
		return this._fields.rdRx.value
	}
	public set rdRx(value: $.Channel<$.Slice<number>> | null) {
		this._fields.rdRx.value = value
	}

	public get rdTx(): $.Channel<number> | null {
		return this._fields.rdTx.value
	}
	public set rdTx(value: $.Channel<number> | null) {
		this._fields.rdTx.value = value
	}

	// Used by local Write to interact with remote Read.
	// Successful send on wrTx is always followed by receive on wrRx.
	public get wrTx(): $.Channel<$.Slice<number>> | null {
		return this._fields.wrTx.value
	}
	public set wrTx(value: $.Channel<$.Slice<number>> | null) {
		this._fields.wrTx.value = value
	}

	public get wrRx(): $.Channel<number> | null {
		return this._fields.wrRx.value
	}
	public set wrRx(value: $.Channel<number> | null) {
		this._fields.wrRx.value = value
	}

	public get once(): sync.Once {
		return this._fields.once.value
	}
	public set once(value: sync.Once) {
		this._fields.once.value = value
	}

	public get localDone(): $.Channel<{}> | null {
		return this._fields.localDone.value
	}
	public set localDone(value: $.Channel<{}> | null) {
		this._fields.localDone.value = value
	}

	public get remoteDone(): $.Channel<{}> | null {
		return this._fields.remoteDone.value
	}
	public set remoteDone(value: $.Channel<{}> | null) {
		this._fields.remoteDone.value = value
	}

	public get readDeadline(): pipeDeadline {
		return this._fields.readDeadline.value
	}
	public set readDeadline(value: pipeDeadline) {
		this._fields.readDeadline.value = value
	}

	public get writeDeadline(): pipeDeadline {
		return this._fields.writeDeadline.value
	}
	public set writeDeadline(value: pipeDeadline) {
		this._fields.writeDeadline.value = value
	}

	public _fields: {
		wrMu: $.VarRef<sync.Mutex>
		rdRx: $.VarRef<$.Channel<$.Slice<number>> | null>
		rdTx: $.VarRef<$.Channel<number> | null>
		wrTx: $.VarRef<$.Channel<$.Slice<number>> | null>
		wrRx: $.VarRef<$.Channel<number> | null>
		once: $.VarRef<sync.Once>
		localDone: $.VarRef<$.Channel<{}> | null>
		remoteDone: $.VarRef<$.Channel<{}> | null>
		readDeadline: $.VarRef<pipeDeadline>
		writeDeadline: $.VarRef<pipeDeadline>
	}

	constructor(init?: Partial<{wrMu?: sync.Mutex, rdRx?: $.Channel<$.Slice<number>> | null, rdTx?: $.Channel<number> | null, wrTx?: $.Channel<$.Slice<number>> | null, wrRx?: $.Channel<number> | null, once?: sync.Once, localDone?: $.Channel<{}> | null, remoteDone?: $.Channel<{}> | null, readDeadline?: pipeDeadline, writeDeadline?: pipeDeadline}>) {
		this._fields = {
			wrMu: $.varRef(init?.wrMu ? $.markAsStructValue($.cloneStructValue(init.wrMu)) : $.markAsStructValue(new sync.Mutex())),
			rdRx: $.varRef(init?.rdRx ?? null),
			rdTx: $.varRef(init?.rdTx ?? null),
			wrTx: $.varRef(init?.wrTx ?? null),
			wrRx: $.varRef(init?.wrRx ?? null),
			once: $.varRef(init?.once ? $.markAsStructValue($.cloneStructValue(init.once)) : $.markAsStructValue(new sync.Once())),
			localDone: $.varRef(init?.localDone ?? null),
			remoteDone: $.varRef(init?.remoteDone ?? null),
			readDeadline: $.varRef(init?.readDeadline ? $.markAsStructValue($.cloneStructValue(init.readDeadline)) : $.markAsStructValue(new pipeDeadline())),
			writeDeadline: $.varRef(init?.writeDeadline ? $.markAsStructValue($.cloneStructValue(init.writeDeadline)) : $.markAsStructValue(new pipeDeadline()))
		}
	}

	public clone(): pipe {
		const cloned = new pipe()
		cloned._fields = {
			wrMu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.wrMu.value))),
			rdRx: $.varRef(this._fields.rdRx.value),
			rdTx: $.varRef(this._fields.rdTx.value),
			wrTx: $.varRef(this._fields.wrTx.value),
			wrRx: $.varRef(this._fields.wrRx.value),
			once: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.once.value))),
			localDone: $.varRef(this._fields.localDone.value),
			remoteDone: $.varRef(this._fields.remoteDone.value),
			readDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.readDeadline.value))),
			writeDeadline: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.writeDeadline.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const p: pipe | $.VarRef<pipe> | null = this
		await $.pointerValue<pipe>(p).once.Do($.functionValue((): void => {
			$.pointerValue<pipe>(p).localDone!.close()
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return null
	}

	public LocalAddr(): __goscript_net.Addr | null {
		return $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new pipeAddr()), "net.pipeAddr")
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const p: pipe | $.VarRef<pipe> | null = this
		let [n, err] = await pipe.prototype.read.call(p, b)
		if (((err != null) && (!$.comparableEqual(err, io.EOF))) && (!$.comparableEqual(err, io.ErrClosedPipe))) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "read", Net: "pipe", Err: err}), "*net.OpError")
		}
		return [n, err]
	}

	public RemoteAddr(): __goscript_net.Addr | null {
		return $.interfaceValue<__goscript_net.Addr | null>($.markAsStructValue(new pipeAddr()), "net.pipeAddr")
	}

	public async SetDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const p: pipe | $.VarRef<pipe> | null = this
		if (await isClosedChan($.pointerValue<pipe>(p).localDone) || await isClosedChan($.pointerValue<pipe>(p).remoteDone)) {
			return io.ErrClosedPipe
		}
		await $.pointerValue<pipe>(p).readDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		await $.pointerValue<pipe>(p).writeDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		return null
	}

	public async SetReadDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const p: pipe | $.VarRef<pipe> | null = this
		if (await isClosedChan($.pointerValue<pipe>(p).localDone) || await isClosedChan($.pointerValue<pipe>(p).remoteDone)) {
			return io.ErrClosedPipe
		}
		await $.pointerValue<pipe>(p).readDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		return null
	}

	public async SetWriteDeadline(t: time.Time): globalThis.Promise<$.GoError> {
		const p: pipe | $.VarRef<pipe> | null = this
		if (await isClosedChan($.pointerValue<pipe>(p).localDone) || await isClosedChan($.pointerValue<pipe>(p).remoteDone)) {
			return io.ErrClosedPipe
		}
		await $.pointerValue<pipe>(p).writeDeadline.set($.markAsStructValue($.cloneStructValue(t)))
		return null
	}

	public async Write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const p: pipe | $.VarRef<pipe> | null = this
		let [n, err] = await pipe.prototype.write.call(p, b)
		if ((err != null) && (!$.comparableEqual(err, io.ErrClosedPipe))) {
			err = $.interfaceValue<$.GoError>(new __goscript_net.OpError({Op: "write", Net: "pipe", Err: err}), "*net.OpError")
		}
		return [n, err]
	}

	public async read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const p: pipe | $.VarRef<pipe> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		switch (true) {
			case await isClosedChan($.pointerValue<pipe>(p).localDone):
			{
				return [0, io.ErrClosedPipe]
				break
			}
			case await isClosedChan($.pointerValue<pipe>(p).remoteDone):
			{
				return [0, io.EOF]
				break
			}
			case await isClosedChan(await $.pointerValue<pipe>(p).readDeadline.wait()):
			{
				return [0, os.ErrDeadlineExceeded]
				break
			}
		}

		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, [number, $.GoError]>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<pipe>(p).rdRx,
				onSelected: async (__goscriptSelect1Result) => {
					let bw = __goscriptSelect1Result.value
					let nr = $.copy(b, bw)
					await $.chanSend($.pointerValue<pipe>(p).rdTx, nr)
					return [nr, null]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: $.pointerValue<pipe>(p).localDone,
				onSelected: async (__goscriptSelect1Result) => {
					return [0, io.ErrClosedPipe]
				}
			},
			{
				id: 2,
				isSend: false,
				channel: $.pointerValue<pipe>(p).remoteDone,
				onSelected: async (__goscriptSelect1Result) => {
					return [0, io.EOF]
				}
			},
			{
				id: 3,
				isSend: false,
				channel: await $.pointerValue<pipe>(p).readDeadline.wait(),
				onSelected: async (__goscriptSelect1Result) => {
					return [0, os.ErrDeadlineExceeded]
				}
			}
		], false)
		if (__goscriptSelect1HasReturn) {
			return __goscriptSelect1Value
		}
		throw new Error("unreachable select")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async write(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const p: pipe | $.VarRef<pipe> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		using __defer = new $.DisposableStack()
		switch (true) {
			case await isClosedChan($.pointerValue<pipe>(p).localDone):
			{
				return [0, io.ErrClosedPipe]
				break
			}
			case await isClosedChan($.pointerValue<pipe>(p).remoteDone):
			{
				return [0, io.ErrClosedPipe]
				break
			}
			case await isClosedChan(await $.pointerValue<pipe>(p).writeDeadline.wait()):
			{
				return [0, os.ErrDeadlineExceeded]
				break
			}
		}

		await $.pointerValue<pipe>(p).wrMu.Lock()
		__defer.defer(() => { $.pointerValue<pipe>(p).wrMu.Unlock() })
		for (let once = true; once || ($.len(b) > 0); once = false) {
			const [__goscriptSelect2HasReturn, __goscriptSelect2Value] = await $.selectStatement<any, [number, $.GoError]>([
				{
					id: 0,
					isSend: true,
					channel: $.pointerValue<pipe>(p).wrTx,
					value: b,
					onSelected: async (__goscriptSelect2Result) => {
						let nw = await $.chanRecv($.pointerValue<pipe>(p).wrRx)
						b = $.goSlice(b, nw, undefined)
						n = n + (nw)
					}
				},
				{
					id: 1,
					isSend: false,
					channel: $.pointerValue<pipe>(p).localDone,
					onSelected: async (__goscriptSelect2Result) => {
						const __goscriptReturn0: [number, $.GoError] = [n, io.ErrClosedPipe]
						n = __goscriptReturn0[0]
						err = __goscriptReturn0[1]
						__defer[Symbol.dispose]()
						return [n, err]
					}
				},
				{
					id: 2,
					isSend: false,
					channel: $.pointerValue<pipe>(p).remoteDone,
					onSelected: async (__goscriptSelect2Result) => {
						const __goscriptReturn1: [number, $.GoError] = [n, io.ErrClosedPipe]
						n = __goscriptReturn1[0]
						err = __goscriptReturn1[1]
						__defer[Symbol.dispose]()
						return [n, err]
					}
				},
				{
					id: 3,
					isSend: false,
					channel: await $.pointerValue<pipe>(p).writeDeadline.wait(),
					onSelected: async (__goscriptSelect2Result) => {
						const __goscriptReturn2: [number, $.GoError] = [n, os.ErrDeadlineExceeded]
						n = __goscriptReturn2[0]
						err = __goscriptReturn2[1]
						__defer[Symbol.dispose]()
						return [n, err]
					}
				}
			], false)
			if (__goscriptSelect2HasReturn) {
				return __goscriptSelect2Value
			}
		}
		const __goscriptReturn3: [number, $.GoError] = [n, null]
		n = __goscriptReturn3[0]
		err = __goscriptReturn3[1]
		__defer[Symbol.dispose]()
		return [n, err]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"net.pipe",
		() => new pipe(),
		[{ name: "Close", args: [], returns: [] }, { name: "LocalAddr", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "RemoteAddr", args: [], returns: [] }, { name: "SetDeadline", args: [], returns: [] }, { name: "SetReadDeadline", args: [], returns: [] }, { name: "SetWriteDeadline", args: [], returns: [] }, { name: "Write", args: [], returns: [] }, { name: "read", args: [], returns: [] }, { name: "write", args: [], returns: [] }],
		pipe,
		{"wrMu": "sync.Mutex", "rdRx": { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, "rdTx": { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Basic, name: "int" } }, "wrTx": { kind: $.TypeKind.Channel, direction: "send", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, "wrRx": { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Basic, name: "int" } }, "once": "sync.Once", "localDone": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }, "remoteDone": { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }, "readDeadline": "net.pipeDeadline", "writeDeadline": "net.pipeDeadline"}
	)
}

export function makePipeDeadline(): pipeDeadline {
	return $.markAsStructValue(new pipeDeadline({cancel: $.makeChannel<{}>(0, {}, "both")}))
}

export async function isClosedChan(c: $.Channel<{}> | null): globalThis.Promise<boolean> {
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, boolean>([
		{
			id: 0,
			isSend: false,
			channel: c,
			onSelected: async (__goscriptSelect0Result) => {
				return true
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				return false
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
	throw new Error("unreachable select")
	throw new globalThis.Error("goscript: unreachable return")
}

export function Pipe(): [__goscript_net.Conn | null, __goscript_net.Conn | null] {
	let cb1 = $.makeChannel<$.Slice<number>>(0, null, "both")
	let cb2 = $.makeChannel<$.Slice<number>>(0, null, "both")
	let cn1 = $.makeChannel<number>(0, 0, "both")
	let cn2 = $.makeChannel<number>(0, 0, "both")
	let done1 = $.makeChannel<{}>(0, {}, "both")
	let done2 = $.makeChannel<{}>(0, {}, "both")

	let p1: pipe | $.VarRef<pipe> | null = (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(makePipeDeadline())); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(makePipeDeadline())); return new pipe({rdRx: cb1, rdTx: cn1, wrTx: cb2, wrRx: cn2, localDone: done1, remoteDone: done2, readDeadline: __goscriptLiteralField0, writeDeadline: __goscriptLiteralField1}) })()
	let p2: pipe | $.VarRef<pipe> | null = (() => { const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(makePipeDeadline())); const __goscriptLiteralField3 = $.markAsStructValue($.cloneStructValue(makePipeDeadline())); return new pipe({rdRx: cb2, rdTx: cn2, wrTx: cb1, wrRx: cn1, localDone: done2, remoteDone: done1, readDeadline: __goscriptLiteralField2, writeDeadline: __goscriptLiteralField3}) })()
	return [$.interfaceValue<__goscript_net.Conn | null>(p1, "*net.pipe"), $.interfaceValue<__goscript_net.Conn | null>(p2, "*net.pipe")]
}
