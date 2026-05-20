// Generated file based on nullable_function_param_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

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

export type WalkFunc = ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError) | null

export let SkipDir: $.GoError = os.ErrNotExist

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

export function walk(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: WalkFunc): $.GoError {
	// Test case 1: Direct call to nullable function parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !
	let err = walkFn!(path, info, null)
	if (err != null && err != SkipDir) {
		return err
	}

	// Test case 2: Call with error parameter
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	let result = walkFn!(path, info, walkErr)
	if (result != null) {
		return result
	}

	return null
}

export type ProcessFunc = ((data: string) => [string, $.GoError]) | null

export function processWithCallback(input: string, processor: ProcessFunc): [string, $.GoError] {
	// Test case 3: Function parameter with return values
	// This should generate: processor!(input)
	// But currently generates: processor(input) - missing !
	return processor!(input)
}

export type OptionalProcessFunc = ((data: string) => [string, $.GoError]) | null

export function maybeProcess(input: string, processor: OptionalProcessFunc): [string, $.GoError] {
	if (processor == null) {
		return ["nil processor", null]
	}
	return processor!(input)
}

export async function main(): Promise<void> {
	let fs = new MockFilesystem()
	let fileInfo = new MockFileInfo({name: "test.txt", size: 50, isDir: false})

	// Test the walk function with a callback
	let walkFunc = $.functionValue((path: string, info: FileInfo | null, err: $.GoError): $.GoError => {
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

	// Test the process function with a callback
	let processFunc = $.functionValue((data: string): [string, $.GoError] => {
		return ["processed: " + data, null]
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, "error"] })

	let [result, err2] = processWithCallback("hello", processFunc)
	if (err2 != null) {
		$.println("Process error:", err2!.Error())
	} else {
		$.println("Process result:", result)
	}

	let [result3, err3] = maybeProcess("ignored", null)
	if (err3 != null) {
		$.println("Optional process error:", err3!.Error())
	} else {
		$.println("Optional process result:", result3)
	}

	let [result4, err4] = maybeProcess("world", processFunc)
	if (err4 != null) {
		$.println("Optional process error:", err4!.Error())
	} else {
		$.println("Optional process result:", result4)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
