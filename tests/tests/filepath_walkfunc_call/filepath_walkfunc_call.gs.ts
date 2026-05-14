// Generated file based on filepath_walkfunc_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

import * as filepath from "@goscript/path/filepath/index.ts"

import * as time from "@goscript/time/index.ts"

export type Filesystem = null | {
	ReadDir(path: string): [$.Slice<FileInfo>, error]
}

$.registerInterfaceType(
	"main.Filesystem",
	null,
	[{ name: "ReadDir", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "fs.FileInfo" } }, { name: "_r1", type: "error" }] }]
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

	public get dir(): boolean {
		return this._fields.dir.value
	}
	public set dir(value: boolean) {
		this._fields.dir.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		size: $.VarRef<number>
		dir: $.VarRef<boolean>
	}

	constructor(init?: Partial<{name?: string, size?: number, dir?: boolean}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			size: $.varRef(init?.size ?? 0),
			dir: $.varRef(init?.dir ?? false)
		}
	}

	public clone(): MockFileInfo {
		const cloned = new MockFileInfo()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			size: $.varRef(this._fields.size.value),
			dir: $.varRef(this._fields.dir.value)
		}
		return $.markAsStructValue(cloned)
	}

	public IsDir(): boolean {
		const m = this
		return m.dir
	}

	public ModTime(): Time {
		const m = this
		return $.markAsStructValue(new time.Time())
	}

	public Mode(): FileMode {
		const m = this
		return 0o644
	}

	public Name(): string {
		const m = this
		return m.name
	}

	public Size(): number {
		const m = this
		return m.size
	}

	public Sys(): any {
		const m = this
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.MockFileInfo",
		new MockFileInfo(),
		[{ name: "IsDir", args: [], returns: [] }, { name: "ModTime", args: [], returns: [] }, { name: "Mode", args: [], returns: [] }, { name: "Name", args: [], returns: [] }, { name: "Size", args: [], returns: [] }, { name: "Sys", args: [], returns: [] }],
		MockFileInfo,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "size": { kind: $.TypeKind.Basic, name: "int" }, "dir": { kind: $.TypeKind.Basic, name: "bool" }}
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
		const fs = this
		return [[$.markAsStructValue($.markAsStructValue(new MockFileInfo({name: "file1.txt", size: 100, dir: false})).clone()), $.markAsStructValue($.markAsStructValue(new MockFileInfo({name: "subdir", size: 0, dir: true})).clone())], null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export function walk(fs: Filesystem, path: string, info: FileInfo, walkFn: WalkFunc): error {
	let filename = path + "/" + info.Name()
	let fileInfo = info
	{
		let err = walkFn(filename, fileInfo, null)
		if (err != null && err != filepath.SkipDir) {
			return err
		}
	}
	let walkErr: error = null
	{
		let err = walkFn(filename, fileInfo, walkErr)
		if (err != null && err != filepath.SkipDir) {
			return err
		}
	}
	return null
}

export function walkFiles(rootPath: string, walkFn: WalkFunc): error {
	return walkFn(rootPath, null, null)
}

export function processPath(walkFn: WalkFunc): void {
	walkFn("test", null, null)
	if (walkFn("test", null, null) != null) {
		$.println("Error occurred")
	}
}

export async function main(): Promise<void> {
	let fs = $.markAsStructValue(new MockFilesystem())
	let fileInfo = $.markAsStructValue(new MockFileInfo({name: "test.txt", size: 50, dir: false}))
	let walkFunc = (path: string, info: FileInfo, err: error): error => {
	if (info != null) {
		$.println("Walking:", path, "size:", info.Size())
	}
	if (err != null) {
		$.println("Error:", err.Error())
	}
	return null
}
	let err = walk(fs, "/test", fileInfo, walkFunc)
	if (err != null) {
		$.println("Walk error:", err.Error())
	}
	let err2 = walkFiles("/root", walkFunc)
	if (err2 != null) {
		$.println("WalkFiles error:", err2.Error())
	}
	processPath(walkFunc)
}


if ($.isMainScript(import.meta)) {
	await main()
}
