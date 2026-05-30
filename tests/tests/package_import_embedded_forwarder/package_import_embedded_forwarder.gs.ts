// Generated file based on package_import_embedded_forwarder.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/index.js"

import * as inner from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"

import * as tx from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export type Store = {
	Execute(): string
	NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null
}

$.registerInterfaceType(
	"main.Store",
	null,
	[{ name: "Execute", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "NewTransaction", args: [{ name: "write", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tx.Tx" } }] }]
)

export class VerboseStore {
	public get BaseStore(): dep.BaseStore | $.VarRef<dep.BaseStore> | null {
		return this._fields.BaseStore.value
	}
	public set BaseStore(value: dep.BaseStore | $.VarRef<dep.BaseStore> | null) {
		this._fields.BaseStore.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		BaseStore: $.VarRef<dep.BaseStore | $.VarRef<dep.BaseStore> | null>
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{BaseStore?: dep.BaseStore | $.VarRef<dep.BaseStore> | null, name?: string}>) {
		this._fields = {
			BaseStore: $.varRef(init?.BaseStore ?? null),
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): VerboseStore {
		const cloned = new VerboseStore()
		cloned._fields = {
			BaseStore: $.varRef(this._fields.BaseStore.value),
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Execute(): string {
		const s: VerboseStore | $.VarRef<VerboseStore> | null = this
		return "execute:" + $.pointerValue<VerboseStore>(s).name
	}

	public NewTransaction(write: any): any {
		return $.pointerValue<any>($.pointerValue<dep.BaseStore>(this.BaseStore).CoreStore).NewTransaction(write)
	}

	static __typeInfo = $.registerStructType(
		"main.VerboseStore",
		() => new VerboseStore(),
		[{ name: "Execute", args: [], returns: [] }, { name: "NewTransaction", args: [], returns: [] }],
		VerboseStore,
		[{ name: "BaseStore", key: "BaseStore", type: { kind: $.TypeKind.Pointer, elemType: "dep.BaseStore" }, anonymous: true, index: [0], offset: 0, exported: true }, { name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder", index: [1], offset: 8, exported: false }]
	)
}

export function NewVerboseStore(name: string): VerboseStore | $.VarRef<VerboseStore> | null {
	return (() => { const __goscriptLiteralField0 = dep.NewBaseStore(name); return new VerboseStore({BaseStore: __goscriptLiteralField0, name: name}) })()
}

export function useStore(store: Store | null): void {
	let read: tx.Tx | $.VarRef<tx.Tx> | null = $.pointerValue<Exclude<Store, null>>(store).NewTransaction(false)
	let write: tx.Tx | $.VarRef<tx.Tx> | null = $.pointerValue<Exclude<Store, null>>(store).NewTransaction(true)
	$.println($.pointerValue<Exclude<Store, null>>(store).Execute())
	$.println($.pointerValue<dep.Tx>(read).Name)
	$.println($.pointerValue<dep.Tx>(write).Name)
}

export async function main(): globalThis.Promise<void> {
	useStore($.interfaceValue<Store | null>(NewVerboseStore("outer"), "*main.VerboseStore"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
