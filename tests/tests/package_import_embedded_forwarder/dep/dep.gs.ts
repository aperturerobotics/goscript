// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as inner from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"

import * as tx from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/inner/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export type Tx = tx.Tx

export type Store = {
	NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null
}

$.registerInterfaceType(
	"dep.Store",
	null,
	[{ name: "NewTransaction", args: [{ name: "write", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tx.Tx" } }] }]
)

export class BaseStore {
	public get CoreStore(): inner.CoreStore | $.VarRef<inner.CoreStore> | null {
		return this._fields.CoreStore.value
	}
	public set CoreStore(value: inner.CoreStore | $.VarRef<inner.CoreStore> | null) {
		this._fields.CoreStore.value = value
	}

	public _fields: {
		CoreStore: $.VarRef<inner.CoreStore | $.VarRef<inner.CoreStore> | null>
	}

	constructor(init?: Partial<{CoreStore?: inner.CoreStore | $.VarRef<inner.CoreStore> | null}>) {
		this._fields = {
			CoreStore: $.varRef(init?.CoreStore ?? null)
		}
	}

	public clone(): BaseStore {
		const cloned = new BaseStore()
		cloned._fields = {
			CoreStore: $.varRef(this._fields.CoreStore.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NewTransaction(write: any): any {
		return $.pointerValue<inner.CoreStore>(this.CoreStore).NewTransaction(write)
	}

	static __typeInfo = $.registerStructType(
		"dep.BaseStore",
		() => new BaseStore(),
		[{ name: "NewTransaction", args: [], returns: [] }],
		BaseStore,
		{"CoreStore": { kind: $.TypeKind.Pointer, elemType: "inner.CoreStore" }}
	)
}

export function NewBaseStore(prefix: string): BaseStore | $.VarRef<BaseStore> | null {
	return new BaseStore({CoreStore: inner.NewCoreStore(prefix)})
}
