// Generated file based on async_method_missing_async.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js";

import * as sync from "@goscript/sync/index.js"

export class AtomicBool {
	public get value(): boolean {
		return this._fields.value.value
	}
	public set value(value: boolean) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{value?: boolean}>) {
		this._fields = {
			value: $.varRef(init?.value ?? false)
		}
	}

	public clone(): AtomicBool {
		const cloned = new AtomicBool()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return cloned
	}

	public Swap(_new: boolean): boolean {
		const a = this
		let old = a.value
		a.value = _new
		return old
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'AtomicBool',
	  new AtomicBool(),
	  [{ name: "Swap", args: [{ name: "new", type: { kind: $.TypeKind.Basic, name: "boolean" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }],
	  AtomicBool,
	  {"value": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

export class FSHandleCursor {
	public get mutex(): sync.Mutex | null {
		return this._fields.mutex.value
	}
	public set mutex(value: sync.Mutex | null) {
		this._fields.mutex.value = value
	}

	// This references AtomicBool before it's defined
	public get released(): AtomicBool {
		return this._fields.released.value
	}
	public set released(value: AtomicBool) {
		this._fields.released.value = value
	}

	public get releaseHandle(): boolean {
		return this._fields.releaseHandle.value
	}
	public set releaseHandle(value: boolean) {
		this._fields.releaseHandle.value = value
	}

	public get relFunc(): (() => void) | null {
		return this._fields.relFunc.value
	}
	public set relFunc(value: (() => void) | null) {
		this._fields.relFunc.value = value
	}

	public _fields: {
		mutex: $.VarRef<sync.Mutex | null>;
		released: $.VarRef<AtomicBool>;
		releaseHandle: $.VarRef<boolean>;
		relFunc: $.VarRef<(() => void) | null>;
	}

	constructor(init?: Partial<{mutex?: sync.Mutex | null, relFunc?: (() => void) | null, releaseHandle?: boolean, released?: AtomicBool}>) {
		this._fields = {
			mutex: $.varRef(init?.mutex ?? null),
			released: $.varRef(init?.released ? $.markAsStructValue(init.released.clone()) : new AtomicBool()),
			releaseHandle: $.varRef(init?.releaseHandle ?? false),
			relFunc: $.varRef(init?.relFunc ?? null)
		}
	}

	public clone(): FSHandleCursor {
		const cloned = new FSHandleCursor()
		cloned._fields = {
			mutex: $.varRef(this._fields.mutex.value ? $.markAsStructValue(this._fields.mutex.value.clone()) : null),
			released: $.varRef($.markAsStructValue(this._fields.released.value.clone())),
			releaseHandle: $.varRef(this._fields.releaseHandle.value),
			relFunc: $.varRef(this._fields.relFunc.value)
		}
		return cloned
	}

	// Release releases the filesystem cursor.
	// note: locks rmtx. must NOT be locked when calling
	public async Release(): Promise<void> {
		const f = this
		if (!f!.released.Swap(true) && f!.releaseHandle) {
			await f!.mutex!.Lock() // This should generate await and method should be marked async
			console.log("Handler released")
			if (f!.relFunc != null) {
				f!.relFunc()
			}
			f!.mutex!.Unlock()
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'FSHandleCursor',
	  new FSHandleCursor(),
	  [{ name: "Release", args: [], returns: [] }],
	  FSHandleCursor,
	  {"mutex": { kind: $.TypeKind.Pointer, elemType: "Mutex" }, "released": "AtomicBool", "releaseHandle": { kind: $.TypeKind.Basic, name: "boolean" }, "relFunc": { kind: $.TypeKind.Function, params: [], results: [] }}
	);
}

export async function main(): Promise<void> {
	let cursor = new FSHandleCursor({mutex: new sync.Mutex({}), relFunc: (): void => {
		console.log("Cleanup function called")
	}, releaseHandle: true, released: $.markAsStructValue(new AtomicBool({value: false}))})

	await cursor!.Release()
	console.log("Test completed")
}

