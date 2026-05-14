// Generated file based on nullable_function_param_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export type FileInfo = null | {
	IsDir(): boolean
	Name(): string
	Size(): number
}

$.registerInterfaceType(
	"main.FileInfo",
	null,
	[{ name: "IsDir", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type WalkFunc = (path: string, info: FileInfo, err: $.GoError) => $.GoError

export let SkipDir: $.GoError = os.ErrNotExist

export type Filesystem = null | {
	ReadDir(path: string): [$.Slice<FileInfo>, $.GoError]
}

$.registerInterfaceType(
	"main.Filesystem",
	null,
	[{ name: "ReadDir", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "main.FileInfo" } }, { name: "_r1", type: "error" }] }]
)

export class MockFileInfo {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public get isDir(): boolean {
		return this._fields.isDir.value
	}
	public set isDir(value: boolean) {
		this._fields.isDir.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		size: $.VarRef<number>
		isDir: $.VarRef<boolean>
	}

	constructor(init?: Partial<{name?: string, size?: number, isDir?: boolean}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			size: $.varRef(init?.size ?? 0),
			isDir: $.varRef(init?.isDir ?? false)
		}
	}

	public clone(): MockFileInfo {
		const cloned = new MockFileInfo()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			size: $.varRef(this._fields.size.value),
			isDir: $.varRef(this._fields.isDir.value)
		}
		return $.markAsStructValue(cloned)
	}

	public IsDir(): boolean {
		const m = this
		return $.pointerValue(m).isDir
	}

	public Name(): string {
		const m = this
		return $.pointerValue(m).name
	}

	public Size(): number {
		const m = this
		return $.pointerValue(m).size
	}

	static __typeInfo = $.registerStructType(
		"main.MockFileInfo",
		new MockFileInfo(),
		[{ name: "IsDir", args: [], returns: [] }, { name: "Name", args: [], returns: [] }, { name: "Size", args: [], returns: [] }],
		MockFileInfo,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "size": { kind: $.TypeKind.Basic, name: "int" }, "isDir": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class MockFilesystem {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MockFilesystem {
		const cloned = new MockFilesystem()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public ReadDir(path: string): [$.Slice<FileInfo>, $.GoError] {
		const m = this
		return [$.arrayToSlice<FileInfo>([$.interfaceValue<FileInfo>(new MockFileInfo({name: "file1.txt", size: 100, isDir: false}), "*main.MockFileInfo"), $.interfaceValue<FileInfo>(new MockFileInfo({name: "subdir", size: 0, isDir: true}), "*main.MockFileInfo")]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export function walk(fs: Filesystem, path: string, info: FileInfo, walkFn: WalkFunc): $.GoError {
	let err = walkFn(path, info, null)
	if (err != null && err != SkipDir) {
		return err
	}
	let walkErr: $.GoError = null
	let result = walkFn(path, info, walkErr)
	if (result != null) {
		return result
	}
	return null
}

export type ProcessFunc = (data: string) => [string, $.GoError]

export function processWithCallback(input: string, processor: ProcessFunc): [string, $.GoError] {
	return processor(input)
}

export async function main(): Promise<void> {
	let fs = new MockFilesystem()
	let fileInfo = new MockFileInfo({name: "test.txt", size: 50, isDir: false})
	let walkFunc = $.functionValue((path: string, info: FileInfo, err: $.GoError): $.GoError => {
	$.println("Walking:", path, "size:", info!.Size())
	if (err != null) {
		$.println("Error:", err!.Error())
	}
	return null
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] })
	let err = walk(fs, "/test", fileInfo, walkFunc)
	if (err != null) {
		$.println("Walk error:", err!.Error())
	}
	let processFunc = $.functionValue((data: string): [string, $.GoError] => {
	return ["processed: " + data, null]
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, "error"] })
	let [result, err2] = processWithCallback("hello", processFunc)
	if (err2 != null) {
		$.println("Process error:", err2!.Error())
	} else {
		$.println("Process result:", result)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
