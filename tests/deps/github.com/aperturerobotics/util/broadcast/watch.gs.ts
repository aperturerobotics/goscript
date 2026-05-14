// Generated file based on watch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as proto from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as __goscript_broadcast from "./broadcast.gs.ts"

export async function WatchBroadcast(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any) | null, send: ((_p0: any) => $.GoError) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, null)
}

export async function WatchBroadcastWithEqual(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any) | null, send: ((_p0: any) => $.GoError) | null, equal: ((a: any, b: any) => boolean) | null): Promise<$.GoError> {
	let ch: $.Channel<Record<string, unknown>> | null = null
	let val: any = $.genericZero(__typeArgs, "T", null)
	await $.pointerValue(bcast).HoldLock($.functionValue((_: (() => void) | null, getWaitCh: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
		ch = getWaitCh!()
		val = snapshot!()
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
	{
		let err = send!(val)
		if (err != null) {
			return err
		}
	}
	let prev = val
	while (true) {
		const [__goscriptSelectHasReturn4792121, __goscriptSelectValue4792121] = await $.selectStatement<any, $.GoError>([
			{
				id: 0,
				isSend: false,
				channel: ctx!.Done(),
				onSelected: async (result) => {
					return ctx!.Err()
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
		if (__goscriptSelectHasReturn4792121) {
			return __goscriptSelectValue4792121
		}
		await $.pointerValue(bcast).HoldLock($.functionValue((_: (() => void) | null, getWaitCh: (() => $.Channel<Record<string, unknown>> | null) | null): void => {
			ch = getWaitCh!()
			val = snapshot!()
		}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Function, params: [], results: [] }, { kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Channel, direction: "receive", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }] }], results: [] }))
		if (val == prev) {
			continue
		}
		if (equal != null && equal!(val, prev)) {
			continue
		}
		{
			let err = send!(val)
			if (err != null) {
				return err
			}
		}
		prev = val
	}
}

export async function WatchBroadcastVT(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context, bcast: __goscript_broadcast.Broadcast | $.VarRef<__goscript_broadcast.Broadcast> | null, snapshot: (() => any) | null, send: ((_p0: any) => $.GoError) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(undefined, ctx, bcast, snapshot, send, proto.CompareEqualVT({T: { type: { kind: $.TypeKind.Interface, methods: [{ name: "EqualVT", args: [{ name: "other", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] }, zero: () => null }}))
}
