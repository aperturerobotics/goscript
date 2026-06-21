// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_memory from "./memory.gs.ts"
import "./memory.gs.ts"

export class storage {
	public get files(): globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null {
		return this._fields.files.value
	}
	public set files(value: globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null) {
		this._fields.files.value = value
	}

	public get children(): globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null {
		return this._fields.children.value
	}
	public set children(value: globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null) {
		this._fields.children.value = value
	}

	public _fields: {
		files: $.VarRef<globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null>
		children: $.VarRef<globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null>
	}

	constructor(init?: Partial<{files?: globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null, children?: globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null}>) {
		this._fields = {
			files: $.varRef(init?.files ?? (null as unknown as globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null)),
			children: $.varRef(init?.children ?? (null as unknown as globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null))
		}
	}

	public clone(): storage {
		const cloned = new storage()
		cloned._fields = {
			files: $.varRef(this._fields.files.value),
			children: $.varRef(this._fields.children.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.storage",
		() => new storage(),
		[],
		storage,
		[{ name: "files", key: "files", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_separate_files", index: [0], offset: 0, exported: false }, { name: "children", key: "children", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_separate_files", index: [1], offset: 8, exported: false }]
	)
}
