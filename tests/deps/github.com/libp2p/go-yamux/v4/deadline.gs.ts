// Generated file based on deadline.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"

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
			timer: $.varRef(init?.timer ?? (null as unknown as time.Timer | $.VarRef<time.Timer> | null)),
			cancel: $.varRef(init?.cancel ?? (null as unknown as $.Channel<{}> | null))
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
		"yamux.pipeDeadline",
		() => new pipeDeadline(),
		[{ name: "set", args: [{ name: "t", type: "time.Time" }], returns: [] }, { name: "wait", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }] }],
		pipeDeadline,
		[{ name: "mu", key: "mu", type: "sync.Mutex", pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "timer", key: "timer", type: { kind: $.TypeKind.Pointer, elemType: "time.Timer" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "cancel", key: "cancel", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 16, exported: false }]
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
