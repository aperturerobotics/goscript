// Generated file based on named_function_type_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

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
	ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError]
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
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this
		return $.pointerValue<MockFileInfo>(m).isDir
	}

	public Name(): string {
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this
		return $.pointerValue<MockFileInfo>(m).name
	}

	public Size(): number {
		const m: MockFileInfo | $.VarRef<MockFileInfo> | null = this
		return $.pointerValue<MockFileInfo>(m).size
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

	public ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError] {
		const m: MockFilesystem | $.VarRef<MockFilesystem> | null = this
		return [$.arrayToSlice<FileInfo | null>([$.interfaceValue<FileInfo | null>(new MockFileInfo({name: "file1.txt", size: 100, isDir: false}), "*main.MockFileInfo"), $.interfaceValue<FileInfo | null>(new MockFileInfo({name: "subdir", size: 0, isDir: true}), "*main.MockFileInfo")]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export type WalkFunc = ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError) | null

export function walk(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: filepath.WalkFunc): $.GoError {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !

	// We need to convert our FileInfo to os.FileInfo for filepath.WalkFunc
	// For this test, we'll use a simpler approach with our own WalkFunc
	return walkWithCustomFunc(fs, path, info, $.functionValue((p: string, i: FileInfo | null, e: $.GoError): $.GoError => {
		// This simulates the issue by calling filepath.WalkFunc indirectly
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] }))
}

export function walkWithCustomFunc(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: WalkFunc): $.GoError {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !
	{
		let err = walkFn!(path, info, null)
		if ((err != null) && (err != filepath.SkipDir)) {
			return err
		}
	}

	// Test case 2: Call with variable error
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	{
		let err = walkFn!(path, info, walkErr)
		if ((err != null) && (err != filepath.SkipDir)) {
			return err
		}
	}

	// Test case 3: Call in if statement condition
	// This should generate: walkFn!(path, info, nil)
	if (walkFn!(path, info, null) != null) {
		return filepath.SkipDir
	}

	return null
}

export function processFiles(pattern: string, fn: ((_p0: string) => $.GoError) | null): $.GoError {
	// Test case 4: Anonymous function type parameter (for comparison)
	// This should also have ! operator when called
	return fn!(pattern)
}

export function multiCallback(walkFn: WalkFunc, processFn: ((_p0: string) => $.GoError) | null): $.GoError {
	// Test case 5: Multiple function parameters
	// Both should generate ! operators
	{
		let err = walkFn!("test", null, null)
		if (err != null) {
			return err
		}
	}
	return processFn!("test")
}

export async function main(): Promise<void> {
	let fs = new MockFilesystem()
	let fileInfo = new MockFileInfo({name: "test.txt", size: 50, isDir: false})

	// Test the walk function with custom WalkFunc
	let walkFunc = $.functionValue((path: string, info: FileInfo | null, err: $.GoError): $.GoError => {
		if (info != null) {
			$.println("Walking:", path, "size:", $.pointerValue(info).Size())
		}
		if (err != null) {
			$.println("Error:", $.pointerValue(err).Error())
		}
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] })

	let err = walkWithCustomFunc($.interfaceValue<Filesystem | null>(fs, "*main.MockFilesystem"), "/test", $.interfaceValue<FileInfo | null>(fileInfo, "*main.MockFileInfo"), walkFunc)
	if (err != null) {
		$.println("Walk error:", $.pointerValue(err).Error())
	}

	// Test with processFiles
	let processFunc = $.functionValue((pattern: string): $.GoError => {
		$.println("Processing pattern:", pattern)
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] })

	let err2 = processFiles("*.go", processFunc)
	if (err2 != null) {
		$.println("Process error:", $.pointerValue(err2).Error())
	}

	// Test with multiCallback
	let err3 = multiCallback(walkFunc, processFunc)
	if (err3 != null) {
		$.println("Multi callback error:", $.pointerValue(err3).Error())
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
