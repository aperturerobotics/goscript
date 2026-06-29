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
			name: $.varRef(init?.name ?? ("" as string)),
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
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
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export class storage {
	public get files(): globalThis.Map<string, file | $.VarRef<file> | null> | null {
		return this._fields.files.value
	}
	public set files(value: globalThis.Map<string, file | $.VarRef<file> | null> | null) {
		this._fields.files.value = value
	}

	public get children(): globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null {
		return this._fields.children.value
	}
	public set children(value: globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null) {
		this._fields.children.value = value
	}

	public _fields: {
		files: $.VarRef<globalThis.Map<string, file | $.VarRef<file> | null> | null>
		children: $.VarRef<globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null>
	}

	constructor(init?: Partial<{files?: globalThis.Map<string, file | $.VarRef<file> | null> | null, children?: globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null}>) {
		this._fields = {
			files: $.varRef(init?.files ?? (null as globalThis.Map<string, file | $.VarRef<file> | null> | null)),
			children: $.varRef(init?.children ?? (null as globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null))
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
		[{ name: "files", key: "files", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } }, { name: "children", key: "children", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "main.file" } } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new storage({files: $.makeMap<string, file | $.VarRef<file> | null>(), children: $.makeMap<string, globalThis.Map<string, file | $.VarRef<file> | null> | null>()}))

	let f: file | $.VarRef<file> | null = new file({name: "test.txt", data: new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])})

	$.mapSet(s.files, "test", f)

	$.println("Created storage with file:", $.pointerValue<file>($.mapGet<string, file | $.VarRef<file> | null, file | $.VarRef<file> | null>(s.files, "test", null)[0]).name)
}

if ($.isMainScript(import.meta)) {
	await main()
}
