// Generated file based on promoted_external_embedded_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class raw {
	public get Mutex(): sync.Mutex {
		return this._fields.Mutex.value
	}
	public set Mutex(value: sync.Mutex) {
		this._fields.Mutex.value = value
	}

	public _fields: {
		Mutex: $.VarRef<sync.Mutex>
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex}>) {
		this._fields = {
			Mutex: $.varRef(init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex()))
		}
	}

	public clone(): raw {
		const cloned = new raw()
		cloned._fields = {
			Mutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Mutex.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.raw",
		() => new raw(),
		[],
		raw,
		{"Mutex": "sync.Mutex"}
	)
}

export class outer {
	public get raw(): raw {
		return this._fields.raw.value
	}
	public set raw(value: raw) {
		this._fields.raw.value = value
	}

	public _fields: {
		raw: $.VarRef<raw>
	}

	constructor(init?: Partial<{raw?: raw}>) {
		this._fields = {
			raw: $.varRef(init?.raw ? $.markAsStructValue($.cloneStructValue(init.raw)) : $.markAsStructValue(new raw()))
		}
	}

	public clone(): outer {
		const cloned = new outer()
		cloned._fields = {
			raw: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.raw.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Lock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.Lock()
	}

	public TryLock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.TryLock()
	}

	public Unlock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		() => new outer(),
		[{ name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		outer,
		{"raw": "main.raw"}
	)
}

export class rawRW {
	public get RWMutex(): sync.RWMutex {
		return this._fields.RWMutex.value
	}
	public set RWMutex(value: sync.RWMutex) {
		this._fields.RWMutex.value = value
	}

	public _fields: {
		RWMutex: $.VarRef<sync.RWMutex>
	}

	constructor(init?: Partial<{RWMutex?: sync.RWMutex}>) {
		this._fields = {
			RWMutex: $.varRef(init?.RWMutex ? $.markAsStructValue($.cloneStructValue(init.RWMutex)) : $.markAsStructValue(new sync.RWMutex()))
		}
	}

	public clone(): rawRW {
		const cloned = new rawRW()
		cloned._fields = {
			RWMutex: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.RWMutex.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.rawRW",
		() => new rawRW(),
		[],
		rawRW,
		{"RWMutex": "sync.RWMutex"}
	)
}

export class outerRW {
	public get rawRW(): rawRW {
		return this._fields.rawRW.value
	}
	public set rawRW(value: rawRW) {
		this._fields.rawRW.value = value
	}

	public _fields: {
		rawRW: $.VarRef<rawRW>
	}

	constructor(init?: Partial<{rawRW?: rawRW}>) {
		this._fields = {
			rawRW: $.varRef(init?.rawRW ? $.markAsStructValue($.cloneStructValue(init.rawRW)) : $.markAsStructValue(new rawRW()))
		}
	}

	public clone(): outerRW {
		const cloned = new outerRW()
		cloned._fields = {
			rawRW: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rawRW.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Lock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.Lock()
	}

	public RLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RLock()
	}

	public RLocker(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RLocker()
	}

	public RUnlock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RUnlock()
	}

	public TryLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.TryLock()
	}

	public TryRLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.TryRLock()
	}

	public Unlock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.outerRW",
		() => new outerRW(),
		[{ name: "Lock", args: [], returns: [] }, { name: "RLock", args: [], returns: [] }, { name: "RLocker", args: [], returns: [] }, { name: "RUnlock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [] }, { name: "TryRLock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		outerRW,
		{"rawRW": "main.rawRW"}
	)
}

export class rawRunner {
	public get runner(): runner | null {
		return this._fields.runner.value
	}
	public set runner(value: runner | null) {
		this._fields.runner.value = value
	}

	public _fields: {
		runner: $.VarRef<runner | null>
	}

	constructor(init?: Partial<{runner?: runner | null}>) {
		this._fields = {
			runner: $.varRef(init?.runner ?? null)
		}
	}

	public clone(): rawRunner {
		const cloned = new rawRunner()
		cloned._fields = {
			runner: $.varRef(this._fields.runner.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Run(): any {
		return $.pointerValue<Exclude<runner | null, null>>(this.runner).Run()
	}

	static __typeInfo = $.registerStructType(
		"main.rawRunner",
		() => new rawRunner(),
		[{ name: "Run", args: [], returns: [] }],
		rawRunner,
		{"runner": "main.runner"}
	)
}

export class outerRunner {
	public get rawRunner(): rawRunner {
		return this._fields.rawRunner.value
	}
	public set rawRunner(value: rawRunner) {
		this._fields.rawRunner.value = value
	}

	public _fields: {
		rawRunner: $.VarRef<rawRunner>
	}

	constructor(init?: Partial<{rawRunner?: rawRunner}>) {
		this._fields = {
			rawRunner: $.varRef(init?.rawRunner ? $.markAsStructValue($.cloneStructValue(init.rawRunner)) : $.markAsStructValue(new rawRunner()))
		}
	}

	public clone(): outerRunner {
		const cloned = new outerRunner()
		cloned._fields = {
			rawRunner: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.rawRunner.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Run(): any {
		return $.pointerValue<Exclude<runner | null, null>>($.pointerValue<rawRunner>(this.rawRunner).runner).Run()
	}

	static __typeInfo = $.registerStructType(
		"main.outerRunner",
		() => new outerRunner(),
		[{ name: "Run", args: [], returns: [] }],
		outerRunner,
		{"rawRunner": "main.rawRunner"}
	)
}

export class runnable {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): runnable {
		const cloned = new runnable()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Run(): string {
		return "runner"
	}

	static __typeInfo = $.registerStructType(
		"main.runnable",
		() => new runnable(),
		[{ name: "Run", args: [], returns: [] }],
		runnable,
		{}
	)
}

export type runner = null | {
	Run(): string
}

$.registerInterfaceType(
	"main.runner",
	null,
	[{ name: "Run", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export async function main(): globalThis.Promise<void> {
	let o: $.VarRef<outer> = $.varRef($.markAsStructValue(new outer()))
	await o.value.raw.Mutex.Lock()
	o.value.raw.Mutex.Unlock()

	let rw: $.VarRef<outerRW> = $.varRef($.markAsStructValue(new outerRW()))
	await rw.value.rawRW.RWMutex.RLock()
	rw.value.rawRW.RWMutex.RUnlock()
	let locker = rw.value.rawRW.RWMutex.RLocker()
	$.pointerValue<Exclude<sync.Locker, null>>(locker).Lock()
	$.pointerValue<Exclude<sync.Locker, null>>(locker).Unlock()

	let or = $.markAsStructValue(new outerRunner({rawRunner: $.markAsStructValue(new rawRunner({runner: $.interfaceValue<runner | null>($.markAsStructValue(new runnable()), "main.runnable")}))}))
	$.println($.pointerValue<Exclude<runner, null>>(or.rawRunner.runner).Run())
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}
