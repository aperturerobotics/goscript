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
			Mutex: $.varRef(init?.Mutex ? $.markAsStructValue(init.Mutex.clone()) : $.markAsStructValue(new sync.Mutex()))
		}
	}

	public clone(): raw {
		const cloned = new raw()
		cloned._fields = {
			Mutex: $.varRef($.markAsStructValue(this._fields.Mutex.value.clone()))
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
			raw: $.varRef(init?.raw ? $.markAsStructValue(init.raw.clone()) : $.markAsStructValue(new raw()))
		}
	}

	public clone(): outer {
		const cloned = new outer()
		cloned._fields = {
			raw: $.varRef($.markAsStructValue(this._fields.raw.value.clone()))
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
			RWMutex: $.varRef(init?.RWMutex ? $.markAsStructValue(init.RWMutex.clone()) : $.markAsStructValue(new sync.RWMutex()))
		}
	}

	public clone(): rawRW {
		const cloned = new rawRW()
		cloned._fields = {
			RWMutex: $.varRef($.markAsStructValue(this._fields.RWMutex.value.clone()))
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
			rawRW: $.varRef(init?.rawRW ? $.markAsStructValue(init.rawRW.clone()) : $.markAsStructValue(new rawRW()))
		}
	}

	public clone(): outerRW {
		const cloned = new outerRW()
		cloned._fields = {
			rawRW: $.varRef($.markAsStructValue(this._fields.rawRW.value.clone()))
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

	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}
