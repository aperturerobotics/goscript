// Generated file based on watch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as proto from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_broadcast from "./broadcast.gs.ts"

import * as __goscript_compat from "./compat.gs.ts"

import * as __goscript_locked from "./locked.gs.ts"
import "@goscript/context/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/sync/index.js"
import "./broadcast.gs.ts"
import "./compat.gs.ts"
import "./locked.gs.ts"

export async function WatchBroadcast(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | globalThis.Promise<any>) | null, send: ((_p0: any) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, (null as ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null))
}

export async function WatchBroadcastWithEqual(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | globalThis.Promise<any>) | null, send: ((_p0: any) => $.GoError | globalThis.Promise<$.GoError>) | null, equal: ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.GoError> {
	let ch: $.Channel<{}> | null = null as $.Channel<{}> | null
	let val: any = $.genericZero(__typeArgs, "T", null)
	let locked = $.varRef($.markAsStructValue($.cloneStructValue(await __goscript_broadcast.Broadcast.prototype.Lock.call(bcast))))
	ch = locked.value.WaitCh()
	val = await snapshot!()
	locked.value.Unlock()
	{
		let err = await send!(val)
		if (err != null) {
			return err
		}
	}
	let prev: any = val
	while (true) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue<Exclude<context.Context, null>>(ctx).Done(),
				onSelected: async (__goscriptSelect0Result) => {
					return $.pointerValue<Exclude<context.Context, null>>(ctx).Err()
				}
			},
			{
				id: 1,
				isSend: false,
				channel: ch,
				onSelected: async (__goscriptSelect0Result) => {
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		let __goscriptShadow0 = $.varRef($.markAsStructValue($.cloneStructValue(await __goscript_broadcast.Broadcast.prototype.Lock.call(bcast))))
		ch = __goscriptShadow0.value.WaitCh()
		val = await snapshot!()
		__goscriptShadow0.value.Unlock()
		if ($.comparableEqual(val, prev)) {
			continue
		}
		if ((equal != null) && await equal!(val, prev)) {
			continue
		}
		{
			let err = await send!(val)
			if (err != null) {
				return err
			}
		}
		prev = val
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function WatchBroadcastVT(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | globalThis.Promise<any>) | null, send: ((_p0: any) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, proto.CompareEqualVT({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "EqualVT", args: [{ name: "other", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, zero: () => null }}))
}
