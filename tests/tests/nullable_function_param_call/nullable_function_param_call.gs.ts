// Generated file based on nullable_function_param_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"
import "@goscript/os/index.js"

export type FileInfo = {
	IsDir(): boolean
	Name(): string
	Size(): number
}

$.registerInterfaceType(
	"main.FileInfo",
	null,
	[{ name: "IsDir", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type WalkFunc = ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null

export type Filesystem = {
	ReadDir(path: string): [$.Slice<FileInfo | null>, $.GoError]
}

$.registerInterfaceType(
	"main.Filesystem",
	null,
	[{ name: "ReadDir", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: "main.FileInfo" } }, { name: "_r1", type: "error" }] }]
)

export type ProcessFunc = ((data: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null

export type OptionalProcessFunc = ((data: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null

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
		return $.int($.pointerValue<MockFileInfo>(m).size)
	}

	static __typeInfo = $.registerStructType(
		"main.MockFileInfo",
		() => new MockFileInfo(),
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
		return [$.arrayToSlice<FileInfo | null>([$.interfaceValue<FileInfo | null>(new MockFileInfo({name: "file1.txt", size: $.int(100), isDir: false}), "*main.MockFileInfo"), $.interfaceValue<FileInfo | null>(new MockFileInfo({name: "subdir", size: $.int(0), isDir: true}), "*main.MockFileInfo")]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		() => new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export let SkipDir: $.GoError = os.ErrNotExist

export function __goscript_set_SkipDir(__goscriptValue: $.GoError): void {
	SkipDir = __goscriptValue
}

export async function walk(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 1: Direct call to nullable function parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !
	let err = await walkFn!(path, info, null)
	if ((err != null) && (!$.comparableEqual(err, SkipDir))) {
		return err
	}

	// Test case 2: Call with error parameter
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	let result = await walkFn!(path, info, walkErr)
	if (result != null) {
		return result
	}

	return null
}

export async function processWithCallback(input: string, processor: ((data: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null): globalThis.Promise<[string, $.GoError]> {
	// Test case 3: Function parameter with return values
	// This should generate: processor!(input)
	// But currently generates: processor(input) - missing !
	return await processor!(input)
}

export async function maybeProcess(input: string, processor: ((data: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null): globalThis.Promise<[string, $.GoError]> {
	if (processor == null) {
		return ["nil processor", null]
	}
	return await processor!(input)
}

export async function main(): globalThis.Promise<void> {
	let fs: MockFilesystem | $.VarRef<MockFilesystem> | null = new MockFilesystem()
	let fileInfo: MockFileInfo | $.VarRef<MockFileInfo> | null = new MockFileInfo({name: "test.txt", size: $.int(50), isDir: false})

	// Test the walk function with a callback
	let walkFunc: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null = $.functionValue((path: string, info: FileInfo | null, err: $.GoError): $.GoError => {
		$.println("Walking:", path, "size:", $.int($.pointerValue<Exclude<FileInfo, null>>(info).Size()))
		if (err != null) {
			$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] } as $.FunctionTypeInfo))

	let err = await walk($.interfaceValue<Filesystem | null>(fs, "*main.MockFilesystem"), "/test", $.interfaceValue<FileInfo | null>(fileInfo, "*main.MockFileInfo"), walkFunc)
	if (err != null) {
		$.println("Walk error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	// Test the process function with a callback
	let processFunc: ((data: string) => [string, $.GoError] | globalThis.Promise<[string, $.GoError]>) | null = $.functionValue((data: string): [string, $.GoError] => {
		return ["processed: " + data, null]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, "error"] } as $.FunctionTypeInfo))

	let [result, err2] = await processWithCallback("hello", processFunc)
	if (err2 != null) {
		$.println("Process error:", $.pointerValue<Exclude<$.GoError, null>>(err2).Error())
	} else {
		$.println("Process result:", result)
	}

	let [result3, err3] = await maybeProcess("ignored", (null as OptionalProcessFunc | null))
	if (err3 != null) {
		$.println("Optional process error:", $.pointerValue<Exclude<$.GoError, null>>(err3).Error())
	} else {
		$.println("Optional process result:", result3)
	}

	let [result4, err4] = await maybeProcess("world", processFunc)
	if (err4 != null) {
		$.println("Optional process error:", $.pointerValue<Exclude<$.GoError, null>>(err4).Error())
	} else {
		$.println("Optional process result:", result4)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
