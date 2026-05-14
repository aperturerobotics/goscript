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
		new file(),
		[],
		file,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
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
		new storage(),
		[],
		storage,
		{"files": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } }, "children": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } }}
	)
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new storage({files: $.makeMap<string, file | $.VarRef<file> | null>(), children: $.makeMap<string, Map<string, file | $.VarRef<file> | null> | null>()}))

	let f = new file({name: "test.txt", data: $.stringToBytes("hello world")})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.pointerValue($.mapGet(s.files, "test", null)[0]).name)
}


if ($.isMainScript(import.meta)) {
	await main()
}
