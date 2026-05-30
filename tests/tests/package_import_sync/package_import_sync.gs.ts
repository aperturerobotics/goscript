// Generated file based on package_import_sync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class embeddedMutex {
	public get Mutex(): sync.Mutex {
		return this._fields.Mutex.value
	}
	public set Mutex(value: sync.Mutex) {
		this._fields.Mutex.value = value
	}

	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		Mutex: $.VarRef<sync.Mutex>
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex, value?: number}>) {
		this._fields = {
			Mutex: $.varRef(init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex())),
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): embeddedMutex {
		const cloned = new embeddedMutex()
		cloned._fields = {
			Mutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Mutex.value))),
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Lock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Lock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).TryLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedMutex",
		() => new embeddedMutex(),
		[{ name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unlock", args: [], returns: [] }],
		embeddedMutex,
		[{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true, index: [0], offset: 0, exported: true }, { name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_sync", index: [1], offset: 8, exported: false }]
	)
}

export class embeddedRWMutex {
	public get RWMutex(): sync.RWMutex {
		return this._fields.RWMutex.value
	}
	public set RWMutex(value: sync.RWMutex) {
		this._fields.RWMutex.value = value
	}

	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		RWMutex: $.VarRef<sync.RWMutex>
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{RWMutex?: sync.RWMutex, value?: number}>) {
		this._fields = {
			RWMutex: $.varRef(init?.RWMutex ? $.markAsStructValue($.cloneStructValue(init.RWMutex)) : $.markAsStructValue(new sync.RWMutex())),
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): embeddedRWMutex {
		const cloned = new embeddedRWMutex()
		cloned._fields = {
			RWMutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.RWMutex.value))),
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Lock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Lock()
	}

	public RLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLock()
	}

	public RLocker(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLocker()
	}

	public RUnlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RUnlock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryLock()
	}

	public TryRLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryRLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedRWMutex",
		() => new embeddedRWMutex(),
		[{ name: "Lock", args: [], returns: [] }, { name: "RLock", args: [], returns: [] }, { name: "RLocker", args: [], returns: [{ name: "_r0", type: "sync.Locker" }] }, { name: "RUnlock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "TryRLock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Unlock", args: [], returns: [] }],
		embeddedRWMutex,
		[{ name: "RWMutex", key: "RWMutex", type: "sync.RWMutex", anonymous: true, index: [0], offset: 0, exported: true }, { name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_sync", index: [1], offset: 24, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test Mutex
	let mu: $.VarRef<sync.Mutex> = $.varRef($.markAsStructValue(new sync.Mutex()))
	await mu.value.Lock()
	$.println("Mutex locked")
	mu.value.Unlock()
	$.println("Mutex unlocked")

	let embedded: $.VarRef<embeddedMutex> = $.varRef($.markAsStructValue(new embeddedMutex()))
	await embedded.value.Mutex.Lock()
	embedded.value.value = 7
	embedded.value.Mutex.Unlock()
	$.println("Embedded Mutex value:", embedded.value.value)

	let embeddedRW: $.VarRef<embeddedRWMutex> = $.varRef($.markAsStructValue(new embeddedRWMutex()))
	await embeddedRW.value.RWMutex.RLock()
	$.println("Embedded RWMutex read lock")
	embeddedRW.value.RWMutex.RUnlock()
	await embeddedRW.value.RWMutex.Lock()
	embeddedRW.value.value = 9
	embeddedRW.value.RWMutex.Unlock()
	$.println("Embedded RWMutex value:", embeddedRW.value.value)

	// Test TryLock
	if (mu.value.TryLock()) {
		$.println("TryLock succeeded")
		mu.value.Unlock()
	} else {
		$.println("TryLock failed")
	}

	// Test WaitGroup
	let wg: $.VarRef<sync.WaitGroup> = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	wg.value.Add(1)
	$.println("WaitGroup counter set to 1")
	wg.value.Done()
	$.println("WaitGroup counter decremented")
	await wg.value.Wait()
	$.println("WaitGroup wait completed")

	// Test Once
	let once: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))
	let counter = 0
	await once.value.Do($.functionValue((): void => {
		counter++
		$.println("Once function executed, counter:", counter)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await once.value.Do($.functionValue((): void => {
		counter++
		$.println("This should not execute")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	$.println("Final counter:", counter)

	// Test OnceFunc
	let onceFunc: (() => void) | null = sync.OnceFunc($.functionValue((): void => {
		$.println("OnceFunc executed")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await onceFunc!()
	await onceFunc!()

	// Test OnceValue
	let onceValue: (() => number | globalThis.Promise<number>) | null = (sync.OnceValue($.functionValue((): number => {
		$.println("OnceValue function executed")
		return 42
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))) as (() => number | globalThis.Promise<number>) | null)
	let val1 = await onceValue!()
	let val2 = await onceValue!()
	$.println("OnceValue results:", val1, val2)

	// Test sync.Map
	let m: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))
	await m.value.Store("key1", "value1")
	$.println("Stored key1")

	{
		let [val, ok] = await m.value.Load("key1")
		if (ok) {
			$.println("Loaded key1:", val)
		}
	}

	{
		let [val, loaded] = await m.value.LoadOrStore("key2", "value2")
		if (!loaded) {
			$.println("Stored key2:", val)
		}
	}

	{
		let [val, loaded] = await m.value.Swap("key2", "value3")
		if (loaded) {
			$.println("Swapped key2 previous:", val)
		}
	}
	{
		let [val, ok] = await m.value.Load("key2")
		if (ok) {
			$.println("Loaded key2 after swap:", val)
		}
	}
	if (!await m.value.CompareAndDelete("key2", "other")) {
		$.println("CompareAndDelete mismatch preserved key2")
	}
	if (await m.value.CompareAndDelete("key2", "value3")) {
		$.println("CompareAndDelete removed key2")
	}
	{
		let [, ok] = await m.value.Load("key2")
		if (!ok) {
			$.println("key2 compare deleted successfully")
		}
	}

	await m.value.Range($.functionValue((key: any, value: any): boolean => {
		$.println("Range:", key, "->", value)
		return true
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))

	await m.value.Delete("key1")
	{
		let [, ok] = await m.value.Load("key1")
		if (!ok) {
			$.println("key1 deleted successfully")
		}
	}

	// Test Pool
	let pool: sync.Pool | $.VarRef<sync.Pool> | null = new sync.Pool({New: $.functionValue((): any => {
		$.println("Pool creating new object")
		return "new object"
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})

	let obj1 = await sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool))
	$.println("Got from pool:", obj1)
	sync.Pool.prototype.Put.call($.pointerValue<sync.Pool>(pool), "reused object")
	let obj2 = await sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool))
	$.println("Got from pool:", obj2)

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
