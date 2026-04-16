import * as $ from "@goscript/builtin/index.ts"
import { Broadcast } from "./broadcast.gs.ts";

import * as context from "@goscript/context/index.ts"

import * as proto from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.ts"

// WatchBroadcast watches a broadcast for changes and sends snapshots.
//
// snapshot is called under the broadcast lock to get the current value.
// send is called outside the lock to transmit the value.
// Skips sending when the value is equal to the previous via ==.
// Returns when ctx is canceled or send returns an error.
export async function WatchBroadcast<T extends $.Comparable>(ctx: null | context.Context, bcast: Broadcast | null, snapshot: (() => T) | null, send: ((p0: T) => $.GoError) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(ctx, bcast, snapshot, send, null)
}

// WatchBroadcastWithEqual watches a broadcast for changes and sends snapshots.
//
// snapshot is called under the broadcast lock to get the current value.
// send is called outside the lock to transmit the value.
// equal is an optional comparator; if nil, uses == for dedup.
// Returns when ctx is canceled or send returns an error.
export async function WatchBroadcastWithEqual<T extends $.Comparable>(ctx: null | context.Context, bcast: Broadcast | null, snapshot: (() => T) | null, send: ((p0: T) => $.GoError) | null, equal: ((a: T, b: T) => boolean) | null): Promise<$.GoError> {
	let ch: $.Channel<{  }> | null = null
	let val: T = null as any
	await bcast!.HoldLock((_: (() => void) | null, getWaitCh: (() => $.Channel<{  }> | null) | null): void => {
		ch = getWaitCh!()
		val = snapshot!()
	})
	{
		let err = send!(val)
		if (err != null) {
			return err
		}
	}
	let prev = val
	for (; ; ) {
		const [_select_has_return_7b6c, _select_value_7b6c] = await $.selectStatement([
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
			},
		], false)
		if (_select_has_return_7b6c) {
			return _select_value_7b6c!
		}
		// If _select_has_return_7b6c is false, continue execution
		await bcast!.HoldLock((_: (() => void) | null, getWaitCh: (() => $.Channel<{  }> | null) | null): void => {
			ch = getWaitCh!()
			val = snapshot!()
		})
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

// WatchBroadcastVT watches a broadcast for changes and sends snapshots.
//
// Uses EqualVT for deduplication. Same as WatchBroadcast but for VTProtobuf messages.
export async function WatchBroadcastVT<T extends proto.EqualVT<T>>(ctx: null | context.Context, bcast: Broadcast | null, snapshot: (() => T) | null, send: ((p0: T) => $.GoError) | null): Promise<$.GoError> {
	return await WatchBroadcastWithEqual(ctx, bcast, snapshot, send, proto.CompareEqualVT<T>())
}

