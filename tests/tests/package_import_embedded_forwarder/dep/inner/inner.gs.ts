// Generated file based on inner.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as tx from "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/package_import_embedded_forwarder/dep/tx/index.js"

export class CoreStore {
	public get Prefix(): string {
		return this._fields.Prefix.value
	}
	public set Prefix(value: string) {
		this._fields.Prefix.value = value
	}

	public _fields: {
		Prefix: $.VarRef<string>
	}

	constructor(init?: Partial<{Prefix?: string}>) {
		this._fields = {
			Prefix: $.varRef(init?.Prefix ?? "")
		}
	}

	public clone(): CoreStore {
		const cloned = new CoreStore()
		cloned._fields = {
			Prefix: $.varRef(this._fields.Prefix.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NewTransaction(write: boolean): tx.Tx | $.VarRef<tx.Tx> | null {
		const s: CoreStore | $.VarRef<CoreStore> | null = this
		if (write) {
			return new tx.Tx({Name: $.pointerValue<CoreStore>(s).Prefix + ":write"})
		}
		return new tx.Tx({Name: $.pointerValue<CoreStore>(s).Prefix + ":read"})
	}

	static __typeInfo = $.registerStructType(
		"inner.CoreStore",
		() => new CoreStore(),
		[{ name: "NewTransaction", args: [], returns: [] }],
		CoreStore,
		{"Prefix": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function NewCoreStore(prefix: string): CoreStore | $.VarRef<CoreStore> | null {
	return new CoreStore({Prefix: prefix})
}
