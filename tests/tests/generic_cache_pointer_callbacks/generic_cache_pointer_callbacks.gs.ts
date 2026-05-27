// Generated file based on generic_cache_pointer_callbacks.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class cache {
	public get stored(): any {
		return this._fields.stored.value
	}
	public set stored(value: any) {
		this._fields.stored.value = value
	}

	public _fields: {
		stored: $.VarRef<any>
	}

	constructor(init?: Partial<{stored?: any}>) {
		this._fields = {
			stored: $.varRef(init?.stored ?? null)
		}
	}

	public clone(): cache {
		const cloned = new cache()
		cloned._fields = {
			stored: $.varRef(this._fields.stored.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Get(k: any, _new: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null, check: ((_p0: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<[any, $.GoError]> {
		let c: cache | $.VarRef<cache> | null = this
		if (($.pointerValue<cache>(c).stored != null) && await check!($.pointerValue<cache>(c).stored)) {
			return [$.pointerValue<cache>(c).stored, null]
		}
		let [v, err] = await _new!()
		if (err != null) {
			return [null, err]
		}
		$.pointerValue<cache>(c).stored = v
		return [v, null]
	}

	static __typeInfo = $.registerStructType(
		"main.cache",
		() => new cache(),
		[{ name: "Get", args: [], returns: [] }],
		cache,
		{"stored": { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }}
	)
}

export class key {
	public get N(): number {
		return this._fields.N.value
	}
	public set N(value: number) {
		this._fields.N.value = value
	}

	public _fields: {
		N: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? 0)
		}
	}

	public clone(): key {
		const cloned = new key()
		cloned._fields = {
			N: $.varRef(this._fields.N.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.key",
		() => new key(),
		[],
		key,
		{"N": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class privateKey {
	public get D(): number {
		return this._fields.D.value
	}
	public set D(value: number) {
		this._fields.D.value = value
	}

	public _fields: {
		D: $.VarRef<number>
	}

	constructor(init?: Partial<{D?: number}>) {
		this._fields = {
			D: $.varRef(init?.D ?? 0)
		}
	}

	public clone(): privateKey {
		const cloned = new privateKey()
		cloned._fields = {
			D: $.varRef(this._fields.D.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.privateKey",
		() => new privateKey(),
		[],
		privateKey,
		{"D": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export let privateKeyCache: $.VarRef<cache> = $.varRef($.markAsStructValue(new cache()))

export function __goscript_set_privateKeyCache(__goscriptValue: cache): void {
	privateKeyCache.value = __goscriptValue
}

export async function privateKeyToCache(k: key | $.VarRef<key> | null): globalThis.Promise<[privateKey | $.VarRef<privateKey> | null, $.GoError]> {
	const __goscriptReturn0 = await privateKeyCache.value.Get(k, $.functionValue((): [privateKey | $.VarRef<privateKey> | null, $.GoError] => {
		return [new privateKey({D: $.pointerValue<key>(k).N}), null]
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "main.privateKey" }, "error"] } as $.FunctionTypeInfo)), $.functionValue((v: privateKey | $.VarRef<privateKey> | null): boolean => {
		return $.pointerValue<privateKey>(v).D == $.pointerValue<key>(k).N
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "main.privateKey" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	return [(__goscriptReturn0[0] as privateKey | $.VarRef<privateKey> | null), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let k: key | $.VarRef<key> | null = new key({N: 7})
	let __goscriptTuple0: any = await privateKeyToCache(k)
	let v: privateKey | $.VarRef<privateKey> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.panic((err as any))
	}
	$.println("cached:", $.pointerValue<privateKey>(v).D)
}

if ($.isMainScript(import.meta)) {
	await main()
}
