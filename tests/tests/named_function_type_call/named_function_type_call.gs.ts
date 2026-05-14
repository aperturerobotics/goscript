// Generated file based on named_function_type_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as filepath from "@goscript/path/filepath/index.ts"

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

export type Filesystem = null | {
	ReadDir(path: string): [$.Slice<FileInfo>, error]
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

	public ReadDir(path: string): void {
		const m = this
		return [[new MockFileInfo({name: "file1.txt", size: 100, isDir: false}), new MockFileInfo({name: "subdir", size: 0, isDir: true})], null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export type WalkFunc = (path: string, info: FileInfo, err: error) => error

export function walk(fs: Filesystem, path: string, info: FileInfo, walkFn: WalkFunc): error {
	return walkWithCustomFunc(fs, path, info, (p: string, i: FileInfo, e: error): error => {
	return null
})
}

export function walkWithCustomFunc(fs: Filesystem, path: string, info: FileInfo, walkFn: WalkFunc): error {
	{
		let err = walkFn(path, info, null)
		if (err != null && err != filepath.SkipDir) {
			return err
		}
	}
	let walkErr: error = null
	{
		let err = walkFn(path, info, walkErr)
		if (err != null && err != filepath.SkipDir) {
			return err
		}
	}
	if (walkFn(path, info, null) != null) {
		return filepath.SkipDir
	}
	return null
}

export function processFiles(pattern: string, fn: (_p0: string) => error): error {
	return fn(pattern)
}

export function multiCallback(walkFn: WalkFunc, processFn: (_p0: string) => error): error {
	{
		let err = walkFn("test", null, null)
		if (err != null) {
			return err
		}
	}
	return processFn("test")
}

export async function main(): Promise<void> {
	let fs = new MockFilesystem()
	let fileInfo = new MockFileInfo({name: "test.txt", size: 50, isDir: false})
	let walkFunc = (path: string, info: FileInfo, err: error): error => {
	if (info != null) {
		$.println("Walking:", path, "size:", info.Size())
	}
	if (err != null) {
		$.println("Error:", err.Error())
	}
	return null
}
	let err = walkWithCustomFunc(fs, "/test", fileInfo, walkFunc)
	if (err != null) {
		$.println("Walk error:", err.Error())
	}
	let processFunc = (pattern: string): error => {
	$.println("Processing pattern:", pattern)
	return null
}
	let err2 = processFiles("*.go", processFunc)
	if (err2 != null) {
		$.println("Process error:", err2.Error())
	}
	let err3 = multiCallback(walkFunc, processFunc)
	if (err3 != null) {
		$.println("Multi callback error:", err3.Error())
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
