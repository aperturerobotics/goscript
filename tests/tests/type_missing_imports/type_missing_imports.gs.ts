// Generated file based on type_missing_imports.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class file {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{name?: string, data?: $.Slice<number>}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			data: $.varRef(init?.data ?? null)
		}
	}

	public clone(): file {
		const cloned = new file()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.file",
		() => new file(),
		[],
		file,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_missing_imports", index: [0], offset: 0, exported: false }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_missing_imports", index: [1], offset: 16, exported: false }]
	)
}

export class storage {
	public get files(): Map<string, file | $.VarRef<file> | null> | null {
		return this._fields.files.value
	}
	public set files(value: Map<string, file | $.VarRef<file> | null> | null) {
		this._fields.files.value = value
	}

	public get children(): Map<string, Map<string, file | $.VarRef<file> | null> | null> | null {
		return this._fields.children.value
	}
	public set children(value: Map<string, Map<string, file | $.VarRef<file> | null> | null> | null) {
		this._fields.children.value = value
	}

	public _fields: {
		files: $.VarRef<Map<string, file | $.VarRef<file> | null> | null>
		children: $.VarRef<Map<string, Map<string, file | $.VarRef<file> | null> | null> | null>
	}

	constructor(init?: Partial<{files?: Map<string, file | $.VarRef<file> | null> | null, children?: Map<string, Map<string, file | $.VarRef<file> | null> | null> | null}>) {
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
		[{ name: "files", key: "files", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_missing_imports", index: [0], offset: 0, exported: false }, { name: "children", key: "children", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/type_missing_imports", index: [1], offset: 8, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new storage({files: $.makeMap<string, file | $.VarRef<file> | null>(), children: $.makeMap<string, Map<string, file | $.VarRef<file> | null> | null>()}))

	let f: file | $.VarRef<file> | null = new file({name: "test.txt", data: new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.pointerValue<file>($.mapGet(s.files, "test", null)[0]).name)
}

if ($.isMainScript(import.meta)) {
	await main()
}
