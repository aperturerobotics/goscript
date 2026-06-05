// Generated file based on singleflight.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class call {
	public get wg(): sync.WaitGroup {
		return this._fields.wg.value
	}
	public set wg(value: sync.WaitGroup) {
		this._fields.wg.value = value
	}

	// These fields are written once before the WaitGroup is done
	// and are only read after the WaitGroup is done.
	public get val(): any {
		return this._fields.val.value
	}
	public set val(value: any) {
		this._fields.val.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	// These fields are read and written with the singleflight
	// mutex held before the WaitGroup is done, and are read but
	// not written after the WaitGroup is done.
	public get dups(): number {
		return this._fields.dups.value
	}
	public set dups(value: number) {
		this._fields.dups.value = value
	}

	public get chans(): $.Slice<$.Channel<Result> | null> {
		return this._fields.chans.value
	}
	public set chans(value: $.Slice<$.Channel<Result> | null>) {
		this._fields.chans.value = value
	}

	public _fields: {
		wg: $.VarRef<sync.WaitGroup>
		val: $.VarRef<any>
		err: $.VarRef<$.GoError>
		dups: $.VarRef<number>
		chans: $.VarRef<$.Slice<$.Channel<Result> | null>>
	}

	constructor(init?: Partial<{wg?: sync.WaitGroup, val?: any, err?: $.GoError, dups?: number, chans?: $.Slice<$.Channel<Result> | null>}>) {
		this._fields = {
			wg: $.varRef(init?.wg ? $.markAsStructValue($.cloneStructValue(init.wg)) : $.markAsStructValue(new sync.WaitGroup())),
			val: $.varRef(init?.val ?? null),
			err: $.varRef(init?.err ?? null),
			dups: $.varRef(init?.dups ?? 0),
			chans: $.varRef(init?.chans ?? null)
		}
	}

	public clone(): call {
		const cloned = new call()
		cloned._fields = {
			wg: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.wg.value))),
			val: $.varRef(this._fields.val.value),
			err: $.varRef(this._fields.err.value),
			dups: $.varRef(this._fields.dups.value),
			chans: $.varRef(this._fields.chans.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"singleflight.call",
		() => new call(),
		[],
		call,
		[{ name: "wg", key: "wg", type: "sync.WaitGroup", pkgPath: "internal/singleflight", index: [0], offset: 0, exported: false }, { name: "val", key: "val", type: { kind: $.TypeKind.Interface, methods: [] }, pkgPath: "internal/singleflight", index: [1], offset: 16, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "internal/singleflight", index: [2], offset: 32, exported: false }, { name: "dups", key: "dups", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "internal/singleflight", index: [3], offset: 48, exported: false }, { name: "chans", key: "chans", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Channel, direction: "send", elemType: "singleflight.Result" } }, pkgPath: "internal/singleflight", index: [4], offset: 56, exported: false }]
	)
}

export class Group {
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public get m(): Map<string, call | $.VarRef<call> | null> | null {
		return this._fields.m.value
	}
	public set m(value: Map<string, call | $.VarRef<call> | null> | null) {
		this._fields.m.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>
		m: $.VarRef<Map<string, call | $.VarRef<call> | null> | null>
	}

	constructor(init?: Partial<{mu?: sync.Mutex, m?: Map<string, call | $.VarRef<call> | null> | null}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex())),
			m: $.varRef(init?.m ?? null)
		}
	}

	public clone(): Group {
		const cloned = new Group()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			m: $.varRef(this._fields.m.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Do(key: string, fn: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null): globalThis.Promise<[any, $.GoError, boolean]> {
		let g: Group | $.VarRef<Group> | null = this
		let v: any = null as any
		let err: $.GoError = null as $.GoError
		let shared: boolean = false
		await $.pointerValue<Group>(g).mu.Lock()
		if ($.pointerValue<Group>(g).m == null) {
			$.pointerValue<Group>(g).m = $.makeMap<string, call | $.VarRef<call> | null>()
		}
		{
			let __goscriptTuple0: any = $.mapGet($.pointerValue<Group>(g).m, key, null)
			let c: call | $.VarRef<call> | null = __goscriptTuple0[0]
			let ok = __goscriptTuple0[1]
			if (ok) {
				$.pointerValue<call>(c).dups++
				$.pointerValue<Group>(g).mu.Unlock()
				await $.pointerValue<call>(c).wg.Wait()
				return [$.pointerValue<call>(c).val, $.pointerValue<call>(c).err, true]
			}
		}
		let c: call | $.VarRef<call> | null = new call()
		$.pointerValue<call>(c).wg.Add(1)
		$.mapSet($.pointerValue<Group>(g).m, key, c)
		$.pointerValue<Group>(g).mu.Unlock()

		await Group.prototype.doCall.call(g, c, key, fn)
		return [$.pointerValue<call>(c).val, $.pointerValue<call>(c).err, $.pointerValue<call>(c).dups > 0]
	}

	public async DoChan(key: string, fn: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null): globalThis.Promise<$.Channel<Result> | null> {
		let g: Group | $.VarRef<Group> | null = this
		let ch: $.Channel<Result> | null = $.makeChannel<Result>(1, $.markAsStructValue(new Result()), "both")
		await $.pointerValue<Group>(g).mu.Lock()
		if ($.pointerValue<Group>(g).m == null) {
			$.pointerValue<Group>(g).m = $.makeMap<string, call | $.VarRef<call> | null>()
		}
		{
			let __goscriptTuple1: any = $.mapGet($.pointerValue<Group>(g).m, key, null)
			let c: call | $.VarRef<call> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				$.pointerValue<call>(c).dups++
				$.pointerValue<call>(c).chans = $.append($.pointerValue<call>(c).chans, ch)
				$.pointerValue<Group>(g).mu.Unlock()
				return ch
			}
		}
		let c: call | $.VarRef<call> | null = new call({chans: $.arrayToSlice<$.Channel<Result> | null>([ch])})
		$.pointerValue<call>(c).wg.Add(1)
		$.mapSet($.pointerValue<Group>(g).m, key, c)
		$.pointerValue<Group>(g).mu.Unlock()

		queueMicrotask(async () => { await Group.prototype.doCall.call(g, c, key, fn) })

		return ch
	}

	public async ForgetUnshared(key: string): globalThis.Promise<boolean> {
		const g: Group | $.VarRef<Group> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Group>(g).mu.Lock()
		__defer.defer(() => { $.pointerValue<Group>(g).mu.Unlock() })
		let __goscriptTuple2: any = $.mapGet($.pointerValue<Group>(g).m, key, null)
		let c: call | $.VarRef<call> | null = __goscriptTuple2[0]
		let ok = __goscriptTuple2[1]
		if (!ok) {
			return true
		}
		if ($.pointerValue<call>(c).dups == 0) {
			$.deleteMapEntry($.pointerValue<Group>(g).m, key)
			return true
		}
		return false
	}

	public async doCall(c: call | $.VarRef<call> | null, key: string, fn: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null): globalThis.Promise<void> {
		const g: Group | $.VarRef<Group> | null = this
		let __goscriptTuple3: any = await fn!()
		$.pointerValue<call>(c).val = __goscriptTuple3[0]
		$.pointerValue<call>(c).err = __goscriptTuple3[1]

		await $.pointerValue<Group>(g).mu.Lock()
		$.pointerValue<call>(c).wg.Done()
		if ($.mapGet($.pointerValue<Group>(g).m, key, null)[0] == c) {
			$.deleteMapEntry($.pointerValue<Group>(g).m, key)
		}
		for (let __goscriptRangeTarget0 = $.pointerValue<call>(c).chans, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let ch = __goscriptRangeTarget0![__rangeIndex]
			await $.chanSend(ch, $.markAsStructValue(new Result({Val: $.pointerValue<call>(c).val, Err: $.pointerValue<call>(c).err, Shared: $.pointerValue<call>(c).dups > 0})))
		}
		$.pointerValue<Group>(g).mu.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"singleflight.Group",
		() => new Group(),
		[{ name: "Do", args: [{ name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "fn", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }, "error"] } as $.FunctionTypeInfo) }], returns: [{ name: "v", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "err", type: "error" }, { name: "shared", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "DoChan", args: [{ name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "fn", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }, "error"] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Channel, direction: "receive", elemType: "singleflight.Result" } }] }, { name: "ForgetUnshared", args: [{ name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "doCall", args: [{ name: "c", type: { kind: $.TypeKind.Pointer, elemType: "singleflight.call" } }, { name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "fn", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }, "error"] } as $.FunctionTypeInfo) }], returns: [] }],
		Group,
		[{ name: "mu", key: "mu", type: "sync.Mutex", pkgPath: "internal/singleflight", index: [0], offset: 0, exported: false }, { name: "m", key: "m", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "singleflight.call" } }, pkgPath: "internal/singleflight", index: [1], offset: 8, exported: false }]
	)
}

export class Result {
	public get Val(): any {
		return this._fields.Val.value
	}
	public set Val(value: any) {
		this._fields.Val.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public get Shared(): boolean {
		return this._fields.Shared.value
	}
	public set Shared(value: boolean) {
		this._fields.Shared.value = value
	}

	public _fields: {
		Val: $.VarRef<any>
		Err: $.VarRef<$.GoError>
		Shared: $.VarRef<boolean>
	}

	constructor(init?: Partial<{Val?: any, Err?: $.GoError, Shared?: boolean}>) {
		this._fields = {
			Val: $.varRef(init?.Val ?? null),
			Err: $.varRef(init?.Err ?? null),
			Shared: $.varRef(init?.Shared ?? false)
		}
	}

	public clone(): Result {
		const cloned = new Result()
		cloned._fields = {
			Val: $.varRef(this._fields.Val.value),
			Err: $.varRef(this._fields.Err.value),
			Shared: $.varRef(this._fields.Shared.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"singleflight.Result",
		() => new Result(),
		[],
		Result,
		[{ name: "Val", key: "Val", type: { kind: $.TypeKind.Interface, methods: [] }, index: [0], offset: 0, exported: true }, { name: "Err", key: "Err", type: "error", index: [1], offset: 16, exported: true }, { name: "Shared", key: "Shared", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 32, exported: true }]
	)
}
