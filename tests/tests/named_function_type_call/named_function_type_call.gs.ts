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

export type WalkFunc = ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null

export type Shape = null | {
	Stats(): number
}

$.registerInterfaceType(
	"main.Shape",
	null,
	[{ name: "Stats", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type Morphism = ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null

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
		return [$.arrayToSlice<FileInfo | null>([$.interfaceValue<FileInfo | null>(new MockFileInfo({name: "file1.txt", size: 100, isDir: false}), "*main.MockFileInfo"), $.interfaceValue<FileInfo | null>(new MockFileInfo({name: "subdir", size: 0, isDir: true}), "*main.MockFileInfo")]), null]
	}

	static __typeInfo = $.registerStructType(
		"main.MockFilesystem",
		() => new MockFilesystem(),
		[{ name: "ReadDir", args: [], returns: [] }],
		MockFilesystem,
		{}
	)
}

export class shapeNode {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): shapeNode {
		const cloned = new shapeNode()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Stats(): number {
		const s: shapeNode | $.VarRef<shapeNode> | null = this
		return $.pointerValue<shapeNode>(s).value
	}

	static __typeInfo = $.registerStructType(
		"main.shapeNode",
		() => new shapeNode(),
		[{ name: "Stats", args: [], returns: [] }],
		shapeNode,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class MorphismHolder {
	public get morphism(): ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null {
		return this._fields.morphism.value
	}
	public set morphism(value: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null) {
		this._fields.morphism.value = value
	}

	public _fields: {
		morphism: $.VarRef<((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null>
	}

	constructor(init?: Partial<{morphism?: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null}>) {
		this._fields = {
			morphism: $.varRef(init?.morphism ?? null)
		}
	}

	public clone(): MorphismHolder {
		const cloned = new MorphismHolder()
		cloned._fields = {
			morphism: $.varRef(this._fields.morphism.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async apply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this
		return $.pointerValue<Exclude<Shape, null>>(await $.pointerValue<MorphismHolder>(h).morphism!(s)).Stats()
	}

	public async cloneApply(s: Shape | null): globalThis.Promise<number> {
		const h: MorphismHolder | $.VarRef<MorphismHolder> | null = this
		return $.pointerValue<Exclude<Shape, null>>(await $.pointerValue<MorphismHolder>(cloneMorphism($.pointerValue<MorphismHolder>(h).morphism)).morphism!(s)).Stats()
	}

	static __typeInfo = $.registerStructType(
		"main.MorphismHolder",
		() => new MorphismHolder(),
		[{ name: "apply", args: [], returns: [] }, { name: "cloneApply", args: [], returns: [] }],
		MorphismHolder,
		{"morphism": { kind: $.TypeKind.Function, name: "main.Morphism", params: ["main.Shape"], results: ["main.Shape"] }}
	)
}

export class morphismWorker {
	public get ready(): $.Channel<boolean> | null {
		return this._fields.ready.value
	}
	public set ready(value: $.Channel<boolean> | null) {
		this._fields.ready.value = value
	}

	public _fields: {
		ready: $.VarRef<$.Channel<boolean> | null>
	}

	constructor(init?: Partial<{ready?: $.Channel<boolean> | null}>) {
		this._fields = {
			ready: $.varRef(init?.ready ?? null)
		}
	}

	public clone(): morphismWorker {
		const cloned = new morphismWorker()
		cloned._fields = {
			ready: $.varRef(this._fields.ready.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async lookup(s: Shape | null): globalThis.Promise<Shape | null> {
		const w: morphismWorker | $.VarRef<morphismWorker> | null = this
		await $.chanSend($.pointerValue<morphismWorker>(w).ready, true)
		await $.chanRecv($.pointerValue<morphismWorker>(w).ready)
		return s
	}

	static __typeInfo = $.registerStructType(
		"main.morphismWorker",
		() => new morphismWorker(),
		[{ name: "lookup", args: [], returns: [] }],
		morphismWorker,
		{"ready": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "bool" } }}
	)
}

export async function walk(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !

	// We need to convert our FileInfo to os.FileInfo for filepath.WalkFunc
	// For this test, we'll use a simpler approach with our own WalkFunc
	return await walkWithCustomFunc(fs, path, info, $.functionValue((p: string, i: FileInfo | null, e: $.GoError): $.GoError => {
		// This simulates the issue by calling filepath.WalkFunc indirectly
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] }))
}

export async function walkWithCustomFunc(fs: Filesystem | null, path: string, info: FileInfo | null, walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 1: Direct call to named function type parameter
	// This should generate: walkFn!(path, info, nil)
	// But currently generates: walkFn(path, info, nil) - missing !
	{
		let err = await walkFn!(path, info, null)
		if ((err != null) && (err != filepath.SkipDir)) {
			return err
		}
	}

	// Test case 2: Call with variable error
	let walkErr: $.GoError = null
	// This should also generate: walkFn!(path, info, walkErr)
	{
		let err = await walkFn!(path, info, walkErr)
		if ((err != null) && (err != filepath.SkipDir)) {
			return err
		}
	}

	// Test case 3: Call in if statement condition
	// This should generate: walkFn!(path, info, nil)
	if (await walkFn!(path, info, null) != null) {
		return filepath.SkipDir
	}

	return null
}

export async function processFiles(pattern: string, fn: ((_p0: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 4: Anonymous function type parameter (for comparison)
	// This should also have ! operator when called
	return await fn!(pattern)
}

export async function multiCallback(walkFn: ((path: string, info: FileInfo | null, err: $.GoError) => $.GoError | globalThis.Promise<$.GoError>) | null, processFn: ((_p0: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	// Test case 5: Multiple function parameters
	// Both should generate ! operators
	{
		let err = await walkFn!("test", null, null)
		if (err != null) {
			return err
		}
	}
	return await processFn!("test")
}

export async function indexedCallback(cbs: $.Slice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>, value: string): globalThis.Promise<boolean> {
	return await cbs![0]!(value)
}

export async function useMorphism(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null, s: Shape | null): globalThis.Promise<number> {
	return $.pointerValue<Exclude<Shape, null>>(await m!(s)).Stats()
}

export async function newMorphismHolder(m: ((_p0: Shape | null) => Shape | null | globalThis.Promise<Shape | null>) | null): globalThis.Promise<MorphismHolder | $.VarRef<MorphismHolder> | null> {
	return new MorphismHolder({morphism: m})
}

export function cloneMorphism(m: Morphism): MorphismHolder | $.VarRef<MorphismHolder> | null {
	return new MorphismHolder({morphism: m})
}

export async function main(): globalThis.Promise<void> {
	let fs: MockFilesystem | $.VarRef<MockFilesystem> | null = new MockFilesystem()
	let fileInfo: MockFileInfo | $.VarRef<MockFileInfo> | null = new MockFileInfo({name: "test.txt", size: 50, isDir: false})

	// Test the walk function with custom WalkFunc
	let walkFunc = $.functionValue((path: string, info: FileInfo | null, err: $.GoError): $.GoError => {
		if (info != null) {
			$.println("Walking:", path, "size:", $.pointerValue<Exclude<FileInfo, null>>(info).Size())
		}
		if (err != null) {
			$.println("Error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "main.FileInfo", "error"], results: ["error"] })

	let err = await walkWithCustomFunc($.interfaceValue<Filesystem | null>(fs, "*main.MockFilesystem"), "/test", $.interfaceValue<FileInfo | null>(fileInfo, "*main.MockFileInfo"), walkFunc)
	if (err != null) {
		$.println("Walk error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}

	// Test with processFiles
	let processFunc = $.functionValue((pattern: string): $.GoError => {
		$.println("Processing pattern:", pattern)
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] })

	let err2 = await processFiles("*.go", processFunc)
	if (err2 != null) {
		$.println("Process error:", $.pointerValue<Exclude<$.GoError, null>>(err2).Error())
	}

	// Test with multiCallback
	let err3 = await multiCallback(walkFunc, processFunc)
	if (err3 != null) {
		$.println("Multi callback error:", $.pointerValue<Exclude<$.GoError, null>>(err3).Error())
	}

	await indexedCallback($.arrayToSlice<((_p0: string) => boolean | globalThis.Promise<boolean>) | null>([$.functionValue((value: string): boolean => {
		$.println("Indexed callback:", value)
		return true
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })]), "slice")

	let worker: morphismWorker | $.VarRef<morphismWorker> | null = new morphismWorker({ready: $.makeChannel<boolean>(1, false, "both")})
	let shape: shapeNode | $.VarRef<shapeNode> | null = new shapeNode({value: 7})
	$.println("Named morphism:", await useMorphism(((__receiver) => (s: Shape | null) => __receiver.lookup(s))($.pointerValue<morphismWorker>(worker)), $.interfaceValue<Shape | null>(shape, "*main.shapeNode")))
	let holder: MorphismHolder | $.VarRef<MorphismHolder> | null = await newMorphismHolder(((__receiver) => (s: Shape | null) => __receiver.lookup(s))($.pointerValue<morphismWorker>(worker)))
	$.println("Field morphism:", await $.pointerValue<MorphismHolder>(holder).apply($.interfaceValue<Shape | null>(shape, "*main.shapeNode")))
	$.println("Cloned field morphism:", await $.pointerValue<MorphismHolder>(holder).cloneApply($.interfaceValue<Shape | null>(shape, "*main.shapeNode")))
	$.pointerValue<morphismWorker>(worker).ready!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}
