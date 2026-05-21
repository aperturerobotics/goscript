// Generated file based on watch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as proto from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_broadcast from "./broadcast.gs.ts"

export async function WatchBroadcast(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | Promise<any>) | null, send: ((_p0: any) => $.GoError | Promise<$.GoError>) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, null)
}

export async function WatchBroadcastWithEqual(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | Promise<any>) | null, send: ((_p0: any) => $.GoError | Promise<$.GoError>) | null, equal: ((a: any, b: any) => boolean | Promise<boolean>) | null): Promise<$.GoError> {
	let ch: $.Channel<{}> | null = null
	let val: any = $.genericZero(__typeArgs, "T", null)
	await $.pointerValue<__goscript_broadcast.Broadcast>(bcast).HoldLock($.functionValue(async (_p0: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null) | null): Promise<void> => {
		ch = await getWaitCh!()
		val = await snapshot!()
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
	{
		let err = await send!(val)
		if (err != null) {
			return err
		}
	}
	let prev = val
	while (true) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue(ctx).Done(),
				onSelected: async (result) => {
					return $.pointerValue(ctx).Err()
				}
			},
			{
				id: 1,
				isSend: false,
				channel: ch,
				onSelected: async (result) => {
				}
			}
		], false)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
		await $.pointerValue<__goscript_broadcast.Broadcast>(bcast).HoldLock($.functionValue(async (_p0: (() => void) | null, getWaitCh: (() => $.Channel<{}> | null) | null): Promise<void> => {
			ch = await getWaitCh!()
			val = await snapshot!()
		}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		if (val == prev) {
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
}

export async function WatchBroadcastVT(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any | Promise<any>) | null, send: ((_p0: any) => $.GoError | Promise<$.GoError>) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, proto.CompareEqualVT({T: { type: { kind: $.TypeKind.Interface, methods: [{ name: "EqualVT", args: [{ name: "other", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, zero: () => null }}))
}
