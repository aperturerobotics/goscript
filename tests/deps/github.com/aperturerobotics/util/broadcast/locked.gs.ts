// Generated file based on locked.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_broadcast from "./broadcast.gs.ts"

import * as __goscript_compat from "./compat.gs.ts"
import "@goscript/sync/index.js"
import "./broadcast.gs.ts"
import "./compat.gs.ts"

export class Locked {
	public get b(): __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null {
		return this._fields.b.value
	}
	public set b(value: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null) {
		this._fields.b.value = value
	}

	public _fields: {
		b: $.VarRef<__goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null>
	}

	constructor(init?: Partial<{b?: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null}>) {
		this._fields = {
			b: $.varRef(init?.b ?? null)
		}
	}

	public clone(): Locked {
		const cloned = new Locked()
		cloned._fields = {
			b: $.varRef(this._fields.b.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Broadcast(): globalThis.Promise<void> {
		let l: Locked | $.VarRef<Locked> | null = this
		if ($.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch == null) {
			return
		}
		let ch: __goscript_broadcast.broadcastWaitCh | $.VarRef<__goscript_broadcast.broadcastWaitCh> | null = $.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch
		$.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch = null
		await __goscript_broadcast.broadcastWaitCh.prototype.close.call(ch)
	}

	public Unlock(): void {
		let l: Locked | $.VarRef<Locked> | null = this
		$.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).mtx.Unlock()
		$.pointerValue<Locked>(l).b = null
	}

	public WaitCh(): $.Channel<{}> | null {
		let l: Locked | $.VarRef<Locked> | null = this
		if ($.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch == null) {
			$.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch = __goscript_broadcast.newBroadcastWaitCh()
		}
		return $.pointerValue<__goscript_broadcast.broadcastWaitCh>($.pointerValue<__goscript_broadcast.Broadcast>($.pointerValue<Locked>(l).b).ch).ch
	}

	static __typeInfo = $.registerStructType(
		"broadcast.Locked",
		() => new Locked(),
		[{ name: "Broadcast", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }, { name: "WaitCh", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } } }] }],
		Locked,
		[{ name: "b", key: "b", type: { kind: $.TypeKind.Pointer, elemType: "broadcast.Broadcast" }, pkgPath: "github.com/aperturerobotics/util/broadcast", index: [0], offset: 0, exported: false }]
	)
}
