// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_memory from "./memory.gs.ts"
import "./memory.gs.ts"

export class storage {
	public get files(): Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null {
		return this._fields.files.value
	}
	public set files(value: Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null) {
		this._fields.files.value = value
	}

	public get children(): Map<string, Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null {
		return this._fields.children.value
	}
	public set children(value: Map<string, Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null) {
		this._fields.children.value = value
	}

	public _fields: {
		files: $.VarRef<Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null>
		children: $.VarRef<Map<string, Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null>
	}

	constructor(init?: Partial<{files?: Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null, children?: Map<string, Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null}>) {
		this._fields = {
			files: $.varRef(init?.files ?? null),
			children: $.varRef(init?.children ?? null)
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
		{"files": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } }, "children": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } }}
	)
}
