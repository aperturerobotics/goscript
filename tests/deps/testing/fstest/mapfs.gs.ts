// Generated file based on mapfs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as path2 from "@goscript/path/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/io/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/path/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"

export type MapFS = globalThis.Map<string, MapFile | $.VarRef<MapFile> | null> | null

export class MapFile {
	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	public get Mode(): fs.FileMode {
		return this._fields.Mode.value
	}
	public set Mode(value: fs.FileMode) {
		this._fields.Mode.value = value
	}

	public get ModTime(): time.Time {
		return this._fields.ModTime.value
	}
	public set ModTime(value: time.Time) {
		this._fields.ModTime.value = value
	}

	public get Sys(): any {
		return this._fields.Sys.value
	}
	public set Sys(value: any) {
		this._fields.Sys.value = value
	}

	public _fields: {
		Data: $.VarRef<$.Slice<number>>
		Mode: $.VarRef<fs.FileMode>
		ModTime: $.VarRef<time.Time>
		Sys: $.VarRef<any>
	}

	constructor(init?: Partial<{Data?: $.Slice<number>, Mode?: fs.FileMode, ModTime?: time.Time, Sys?: any}>) {
		this._fields = {
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>)),
			Mode: $.varRef(init?.Mode ?? (0 as fs.FileMode)),
			ModTime: $.varRef(init?.ModTime ? $.markAsStructValue($.cloneStructValue(init.ModTime)) : $.markAsStructValue(new time.Time())),
			Sys: $.varRef(init?.Sys ?? (null as any))
		}
	}

	public clone(): MapFile {
		const cloned = new MapFile()
		cloned._fields = {
			Data: $.varRef(this._fields.Data.value),
			Mode: $.varRef(this._fields.Mode.value),
			ModTime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ModTime.value))),
			Sys: $.varRef(this._fields.Sys.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"fstest.MapFile",
		() => new MapFile(),
		[],
		MapFile,
		[{ name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "Mode", key: "Mode", type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }, { name: "ModTime", key: "ModTime", type: "time.Time" }, { name: "Sys", key: "Sys", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class fsOnly {
	public get FS(): fs.FS | null {
		return this._fields.FS.value
	}
	public set FS(value: fs.FS | null) {
		this._fields.FS.value = value
	}

	public _fields: {
		FS: $.VarRef<fs.FS | null>
	}

	constructor(init?: Partial<{FS?: fs.FS | null}>) {
		this._fields = {
			FS: $.varRef(init?.FS ?? (null as fs.FS | null))
		}
	}

	public clone(): fsOnly {
		const cloned = new fsOnly()
		cloned._fields = {
			FS: $.varRef(this._fields.FS.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Open(name: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<fs.FS | null, null>>(this.FS).Open(name)
	}

	static __typeInfo = $.registerStructType(
		"fstest.fsOnly",
		() => new fsOnly(),
		[{ name: "Open", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "fs.File" }, { type: "error" }] }],
		fsOnly,
		[{ name: "FS", key: "FS", type: "fs.FS", anonymous: true }]
	)
}

export class noSub {
	public get MapFS(): MapFS {
		return this._fields.MapFS.value
	}
	public set MapFS(value: MapFS) {
		this._fields.MapFS.value = value
	}

	public _fields: {
		MapFS: $.VarRef<MapFS>
	}

	constructor(init?: Partial<{MapFS?: MapFS}>) {
		this._fields = {
			MapFS: $.varRef(init?.MapFS ?? (null as MapFS))
		}
	}

	public clone(): noSub {
		const cloned = new noSub()
		cloned._fields = {
			MapFS: $.varRef(this._fields.MapFS.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Sub(): void {
	}

	static __typeInfo = $.registerStructType(
		"fstest.noSub",
		() => new noSub(),
		[{ name: "Sub", args: [], returns: [] }],
		noSub,
		[{ name: "MapFS", key: "MapFS", type: "fstest.MapFS", anonymous: true }]
	)
}

export class mapFileInfo {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get f(): MapFile | $.VarRef<MapFile> | null {
		return this._fields.f.value
	}
	public set f(value: MapFile | $.VarRef<MapFile> | null) {
		this._fields.f.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		f: $.VarRef<MapFile | $.VarRef<MapFile> | null>
	}

	constructor(init?: Partial<{name?: string, f?: MapFile | $.VarRef<MapFile> | null}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ("" as string)),
			f: $.varRef(init?.f ?? (null as MapFile | $.VarRef<MapFile> | null))
		}
	}

	public clone(): mapFileInfo {
		const cloned = new mapFileInfo()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			f: $.varRef(this._fields.f.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Info(): [fs.FileInfo | null, $.GoError] {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return [$.interfaceValue<fs.FileInfo | null>(i, "*fstest.mapFileInfo"), null]
	}

	public IsDir(): boolean {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.uint(($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).Mode & fs.ModeDir), 32) != $.uint(0, 32)
	}

	public ModTime(): time.Time {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).ModTime))
	}

	public Mode(): fs.FileMode {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.uint($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).Mode, 32)
	}

	public Name(): string {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return path2.Base($.pointerValue<mapFileInfo>(i).name)
	}

	public Size(): bigint {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.int64($.len($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).Data))
	}

	public String(): string {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return fs.FormatFileInfo($.pointerValueOrNil($.interfaceValue<fs.FileInfo | null>(i, "*fstest.mapFileInfo"))!)
	}

	public Sys(): any {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).Sys
	}

	public Type(): fs.FileMode {
		const i: mapFileInfo | $.VarRef<mapFileInfo> | null = this
		return $.uint(fs.FileMode_Type($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(i).f).Mode), 32)
	}

	static __typeInfo = $.registerStructType(
		"fstest.mapFileInfo",
		() => new mapFileInfo(),
		[{ name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }],
		mapFileInfo,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "f", key: "f", type: { kind: $.TypeKind.Pointer, elemType: "fstest.MapFile" } }]
	)
}

export class openMapFile {
	public get path(): string {
		return this._fields.path.value
	}
	public set path(value: string) {
		this._fields.path.value = value
	}

	public get mapFileInfo(): mapFileInfo {
		return this._fields.mapFileInfo.value
	}
	public set mapFileInfo(value: mapFileInfo) {
		this._fields.mapFileInfo.value = value
	}

	public get offset(): bigint {
		return this._fields.offset.value
	}
	public set offset(value: bigint) {
		this._fields.offset.value = value
	}

	public _fields: {
		path: $.VarRef<string>
		mapFileInfo: $.VarRef<mapFileInfo>
		offset: $.VarRef<bigint>
	}

	constructor(init?: Partial<{path?: string, mapFileInfo?: mapFileInfo, offset?: bigint}>) {
		this._fields = {
			path: $.varRef(init?.path ?? ("" as string)),
			mapFileInfo: $.varRef(init?.mapFileInfo ? $.markAsStructValue($.cloneStructValue(init.mapFileInfo)) : $.markAsStructValue(new mapFileInfo())),
			offset: $.varRef(init?.offset ?? (0n as bigint))
		}
	}

	public clone(): openMapFile {
		const cloned = new openMapFile()
		cloned._fields = {
			path: $.varRef(this._fields.path.value),
			mapFileInfo: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mapFileInfo.value))),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const f: openMapFile | $.VarRef<openMapFile> | null = this
		return null
	}

	public Read(b: $.Slice<number>): [number, $.GoError] {
		let f: openMapFile | $.VarRef<openMapFile> | null = this
		if ($.pointerValue<openMapFile>(f).offset >= $.int64($.len($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data))) {
			return [0, io.EOF]
		}
		if ($.pointerValue<openMapFile>(f).offset < 0n) {
			return [0, $.interfaceValue<$.GoError>(new fs.PathError({Op: "read", Path: $.pointerValue<openMapFile>(f).path, Err: fs.ErrInvalid}), "*fs.PathError")]
		}
		let n = $.copy(b, $.goSlice($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data, Number($.pointerValue<openMapFile>(f).offset), undefined))
		$.pointerValue<openMapFile>(f).offset = $.int64Add($.pointerValue<openMapFile>(f).offset, $.int64(n))
		return [n, null]
	}

	public ReadAt(b: $.Slice<number>, offset: bigint): [number, $.GoError] {
		const f: openMapFile | $.VarRef<openMapFile> | null = this
		if ((offset < 0n) || (offset > $.int64($.len($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data)))) {
			return [0, $.interfaceValue<$.GoError>(new fs.PathError({Op: "read", Path: $.pointerValue<openMapFile>(f).path, Err: fs.ErrInvalid}), "*fs.PathError")]
		}
		let n = $.copy(b, $.goSlice($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data, Number(offset), undefined))
		if (n < $.len(b)) {
			return [n, io.EOF]
		}
		return [n, null]
	}

	public Seek(offset: bigint, whence: number): [bigint, $.GoError] {
		let f: openMapFile | $.VarRef<openMapFile> | null = this
		switch (whence) {
			case 0:
			{
				break
			}
			case 1:
			{
				offset = $.int64Add(offset, $.pointerValue<openMapFile>(f).offset)
				break
			}
			case 2:
			{
				offset = $.int64Add(offset, $.int64($.len($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data)))
				break
			}
		}
		if ((offset < 0n) || (offset > $.int64($.len($.pointerValue<MapFile>($.pointerValue<openMapFile>(f).mapFileInfo.f).Data)))) {
			return [0n, $.interfaceValue<$.GoError>(new fs.PathError({Op: "seek", Path: $.pointerValue<openMapFile>(f).path, Err: fs.ErrInvalid}), "*fs.PathError")]
		}
		$.pointerValue<openMapFile>(f).offset = offset
		return [offset, null]
	}

	public Stat(): [fs.FileInfo | null, $.GoError] {
		const f: openMapFile | $.VarRef<openMapFile> | null = this
		return [$.interfaceValue<fs.FileInfo | null>($.pointerValue<openMapFile>(f)._fields.mapFileInfo, "*fstest.mapFileInfo"), null]
	}

	public Info(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Info()
	}

	public IsDir(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).IsDir()
	}

	public ModTime(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).ModTime()
	}

	public Mode(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Mode()
	}

	public Name(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Name()
	}

	public Size(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Size()
	}

	public String(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).String()
	}

	public Sys(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Sys()
	}

	public Type(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Type()
	}

	static __typeInfo = $.registerStructType(
		"fstest.openMapFile",
		() => new openMapFile(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "ReadAt", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "Seek", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }, { type: "error" }] }, { name: "Stat", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }],
		openMapFile,
		[{ name: "path", key: "path", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "mapFileInfo", key: "mapFileInfo", type: "fstest.mapFileInfo", anonymous: true }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int64" } }]
	)
}

export class mapDir {
	public get path(): string {
		return this._fields.path.value
	}
	public set path(value: string) {
		this._fields.path.value = value
	}

	public get mapFileInfo(): mapFileInfo {
		return this._fields.mapFileInfo.value
	}
	public set mapFileInfo(value: mapFileInfo) {
		this._fields.mapFileInfo.value = value
	}

	public get entry(): $.Slice<mapFileInfo> {
		return this._fields.entry.value
	}
	public set entry(value: $.Slice<mapFileInfo>) {
		this._fields.entry.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		path: $.VarRef<string>
		mapFileInfo: $.VarRef<mapFileInfo>
		entry: $.VarRef<$.Slice<mapFileInfo>>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{path?: string, mapFileInfo?: mapFileInfo, entry?: $.Slice<mapFileInfo>, offset?: number}>) {
		this._fields = {
			path: $.varRef(init?.path ?? ("" as string)),
			mapFileInfo: $.varRef(init?.mapFileInfo ? $.markAsStructValue($.cloneStructValue(init.mapFileInfo)) : $.markAsStructValue(new mapFileInfo())),
			entry: $.varRef(init?.entry ?? (null as $.Slice<mapFileInfo>)),
			offset: $.varRef(init?.offset ?? (0 as number))
		}
	}

	public clone(): mapDir {
		const cloned = new mapDir()
		cloned._fields = {
			path: $.varRef(this._fields.path.value),
			mapFileInfo: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mapFileInfo.value))),
			entry: $.varRef(this._fields.entry.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const d: mapDir | $.VarRef<mapDir> | null = this
		return null
	}

	public Read(b: $.Slice<number>): [number, $.GoError] {
		const d: mapDir | $.VarRef<mapDir> | null = this
		return [0, $.interfaceValue<$.GoError>(new fs.PathError({Op: "read", Path: $.pointerValue<mapDir>(d).path, Err: fs.ErrInvalid}), "*fs.PathError")]
	}

	public ReadDir(count: number): [$.Slice<fs.DirEntry | null>, $.GoError] {
		let d: mapDir | $.VarRef<mapDir> | null = this
		let n = $.len($.pointerValue<mapDir>(d).entry) - $.pointerValue<mapDir>(d).offset
		if ((n == 0) && (count > 0)) {
			return [null, io.EOF]
		}
		if ((count > 0) && (n > count)) {
			n = count
		}
		let list: $.Slice<fs.DirEntry | null> = $.makeSlice<fs.DirEntry | null>(n)
		for (let __goscriptRangeTarget1 = list, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			list![i] = $.interfaceValue<fs.DirEntry | null>($.indexRef($.pointerValue<mapDir>(d).entry!, $.pointerValue<mapDir>(d).offset + i), "*fstest.mapFileInfo")
		}
		$.pointerValue<mapDir>(d).offset = $.pointerValue<mapDir>(d).offset + (n)
		return [list, null]
	}

	public Stat(): [fs.FileInfo | null, $.GoError] {
		const d: mapDir | $.VarRef<mapDir> | null = this
		return [$.interfaceValue<fs.FileInfo | null>($.pointerValue<mapDir>(d)._fields.mapFileInfo, "*fstest.mapFileInfo"), null]
	}

	public Info(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Info()
	}

	public IsDir(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).IsDir()
	}

	public ModTime(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).ModTime()
	}

	public Mode(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Mode()
	}

	public Name(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Name()
	}

	public Size(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Size()
	}

	public String(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).String()
	}

	public Sys(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Sys()
	}

	public Type(): any {
		return $.pointerValue<mapFileInfo>(this.mapFileInfo).Type()
	}

	static __typeInfo = $.registerStructType(
		"fstest.mapDir",
		() => new mapDir(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "ReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "fs.DirEntry" } }, { type: "error" }] }, { name: "Stat", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }],
		mapDir,
		[{ name: "path", key: "path", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "mapFileInfo", key: "mapFileInfo", type: "fstest.mapFileInfo", anonymous: true }, { name: "entry", key: "entry", type: { kind: $.TypeKind.Slice, elemType: "fstest.mapFileInfo" } }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function MapFS_Open(fsys: MapFS, name: string): globalThis.Promise<[fs.File | null, $.GoError]> {
	if (!fs.ValidPath(name)) {
		return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "open", Path: name, Err: fs.ErrNotExist}), "*fs.PathError")]
	}
	let [realName, ok] = MapFS_resolveSymlinks(fsys, name)
	if (!ok) {
		return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "open", Path: name, Err: fs.ErrNotExist}), "*fs.PathError")]
	}

	let file: MapFile | $.VarRef<MapFile> | null = $.mapGet<string, MapFile | $.VarRef<MapFile> | null, MapFile | $.VarRef<MapFile> | null>(fsys, realName, null)[0]
	if ((file != null) && ($.uint(($.pointerValue<MapFile>(file).Mode & fs.ModeDir), 32) == $.uint(0, 32))) {
		// Ordinary file
		return [$.interfaceValue<fs.File | null>(new openMapFile({path: name, mapFileInfo: (() => { const __goscriptLiteralField0 = path2.Base(name); return $.markAsStructValue(new mapFileInfo({name: __goscriptLiteralField0, f: file})) })(), offset: 0n}), "*fstest.openMapFile"), null]
	}

	// Directory, possibly synthesized.
	// Note that file can be nil here: the map need not contain explicit parent directories for all its files.
	// But file can also be non-nil, in case the user wants to set metadata for the directory explicitly.
	// Either way, we need to construct the list of children of this directory.
	let list: $.Slice<mapFileInfo> = null as $.Slice<mapFileInfo>
	let need: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()
	if ($.stringEqual(realName, ".")) {
		for (let [fname, f] of fsys?.entries() ?? []) {
			let i = strings.Index(fname, "/")
			if (i < 0) {
				if (!$.stringEqual(fname, ".")) {
					list = $.append(list, $.markAsStructValue(new mapFileInfo({name: fname, f: f})))
				}
			} else {
				$.mapSet(need, $.sliceStringOrBytes(fname, undefined, i), true)
			}
		}
	} else {
		let prefix = realName + "/"
		for (let [fname, f] of fsys?.entries() ?? []) {
			if (strings.HasPrefix(fname, prefix)) {
				let felem = $.sliceStringOrBytes(fname, $.len(prefix), undefined)
				let i = strings.Index(felem, "/")
				if (i < 0) {
					list = $.append(list, $.markAsStructValue(new mapFileInfo({name: felem, f: f})))
				} else {
					$.mapSet(need, $.sliceStringOrBytes(fname, $.len(prefix), $.len(prefix) + i), true)
				}
			}
		}
		// If the directory name is not in the map,
		// and there are no children of the name in the map,
		// then the directory is treated as not existing.
		if (((file == null) && (list == null)) && ($.len(need) == 0)) {
			return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "open", Path: name, Err: fs.ErrNotExist}), "*fs.PathError")]
		}
	}
	for (let __goscriptRangeTarget0 = list, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let fi = __goscriptRangeTarget0![__rangeIndex]
		$.deleteMapEntry(need, fi.name)
	}
	for (const [name, __rangeValue] of need?.entries() ?? []) {
		list = $.append(list, $.markAsStructValue(new mapFileInfo({name: name, f: new MapFile({Mode: $.uint(fs.ModeDir | 0o555, 32)})})))
	}
	await slices.SortFunc(list, $.functionValue((a: mapFileInfo, b: mapFileInfo): number => {
		return strings.Compare(a.name, b.name)
	}, ({ kind: $.TypeKind.Function, params: ["fstest.mapFileInfo", "fstest.mapFileInfo"], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))

	if (file == null) {
		file = new MapFile({Mode: $.uint(fs.ModeDir | 0o555, 32)})
	}
	let elem: string = ""
	if ($.stringEqual(name, ".")) {
		elem = "."
	} else {
		elem = $.sliceStringOrBytes(name, strings.LastIndex(name, "/") + 1, undefined)
	}
	return [$.interfaceValue<fs.File | null>(new mapDir({path: name, mapFileInfo: $.markAsStructValue(new mapFileInfo({name: elem, f: file})), entry: list, offset: 0}), "*fstest.mapDir"), null]
}

export function MapFS_resolveSymlinks(fsys: MapFS, name: string): [string, boolean] {
	let ok: boolean = false
	// Fast path: if a symlink is in the map, resolve it.
	{
		let file: MapFile | $.VarRef<MapFile> | null = $.mapGet<string, MapFile | $.VarRef<MapFile> | null, MapFile | $.VarRef<MapFile> | null>(fsys, name, null)[0]
		if ((file != null) && ($.uint(fs.FileMode_Type($.pointerValue<MapFile>(file).Mode), 32) == $.uint(fs.ModeSymlink, 32))) {
			let target = $.bytesToString($.pointerValue<MapFile>(file).Data)
			if (path2.IsAbs(target)) {
				return ["", false]
			}
			return MapFS_resolveSymlinks(fsys, path2.Join(path2.Dir(name), target))
		}
	}

	// Check if each parent directory (starting at root) is a symlink.
	for (let i = 0; i < $.len(name); ) {
		let j = strings.Index($.sliceStringOrBytes(name, i, undefined), "/")
		let dir: string = ""
		if (j < 0) {
			dir = name
			i = $.len(name)
		} else {
			dir = $.sliceStringOrBytes(name, undefined, i + j)
			i = i + (j)
		}
		{
			let file: MapFile | $.VarRef<MapFile> | null = $.mapGet<string, MapFile | $.VarRef<MapFile> | null, MapFile | $.VarRef<MapFile> | null>(fsys, dir, null)[0]
			if ((file != null) && ($.uint(fs.FileMode_Type($.pointerValue<MapFile>(file).Mode), 32) == $.uint(fs.ModeSymlink, 32))) {
				let target = $.bytesToString($.pointerValue<MapFile>(file).Data)
				if (path2.IsAbs(target)) {
					return ["", false]
				}
				return MapFS_resolveSymlinks(fsys, path2.Join(path2.Dir(dir), target) + $.sliceStringOrBytes(name, i, undefined))
			}
		}
		i = i + (1)
	}
	return [name, fs.ValidPath(name)]
}

export function MapFS_ReadLink(fsys: MapFS, name: string): [string, $.GoError] {
	let __goscriptTuple0: any = MapFS_lstat(fsys, name)
	let info: mapFileInfo | $.VarRef<mapFileInfo> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return ["", $.interfaceValue<$.GoError>(new fs.PathError({Op: "readlink", Path: name, Err: err}), "*fs.PathError")]
	}
	if ($.uint(fs.FileMode_Type($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(info).f).Mode), 32) != $.uint(fs.ModeSymlink, 32)) {
		return ["", $.interfaceValue<$.GoError>(new fs.PathError({Op: "readlink", Path: name, Err: fs.ErrInvalid}), "*fs.PathError")]
	}
	return [$.bytesToString($.pointerValue<MapFile>($.pointerValue<mapFileInfo>(info).f).Data), null]
}

export function MapFS_Lstat(fsys: MapFS, name: string): [fs.FileInfo | null, $.GoError] {
	let __goscriptTuple1: any = MapFS_lstat(fsys, name)
	let info: mapFileInfo | $.VarRef<mapFileInfo> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "lstat", Path: name, Err: err}), "*fs.PathError")]
	}
	return [$.interfaceValue<fs.FileInfo | null>(info, "*fstest.mapFileInfo"), null]
}

export function MapFS_lstat(fsys: MapFS, name: string): [mapFileInfo | $.VarRef<mapFileInfo> | null, $.GoError] {
	if (!fs.ValidPath(name)) {
		return [null, fs.ErrNotExist]
	}
	let [realDir, ok] = MapFS_resolveSymlinks(fsys, path2.Dir(name))
	if (!ok) {
		return [null, fs.ErrNotExist]
	}
	let elem = path2.Base(name)
	let realName = path2.Join(realDir, elem)

	let file: MapFile | $.VarRef<MapFile> | null = $.mapGet<string, MapFile | $.VarRef<MapFile> | null, MapFile | $.VarRef<MapFile> | null>(fsys, realName, null)[0]
	if (file != null) {
		return [new mapFileInfo({name: elem, f: file}), null]
	}

	if ($.stringEqual(realName, ".")) {
		return [new mapFileInfo({name: elem, f: new MapFile({Mode: $.uint(fs.ModeDir | 0o555, 32)})}), null]
	}
	// Maybe a directory.
	let prefix = realName + "/"
	for (const [fname, __rangeValue] of fsys?.entries() ?? []) {
		if (strings.HasPrefix(fname, prefix)) {
			return [new mapFileInfo({name: elem, f: new MapFile({Mode: $.uint(fs.ModeDir | 0o555, 32)})}), null]
		}
	}
	// If the directory name is not in the map,
	// and there are no children of the name in the map,
	// then the directory is treated as not existing.
	return [null, fs.ErrNotExist]
}

export function MapFS_ReadFile(fsys: MapFS, name: string): [$.Slice<number>, $.GoError] {
	return fs.ReadFile($.interfaceValue<fs.FS | null>($.markAsStructValue(new fsOnly({FS: $.namedValueInterfaceValue<fs.FS | null>(fsys, "fstest.MapFS", {Glob: (receiver: any, ...args: any[]) => (MapFS_Glob as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Lstat: (receiver: any, ...args: any[]) => (MapFS_Lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Open: (receiver: any, ...args: any[]) => (MapFS_Open as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadDir: (receiver: any, ...args: any[]) => (MapFS_ReadDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadFile: (receiver: any, ...args: any[]) => (MapFS_ReadFile as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadLink: (receiver: any, ...args: any[]) => (MapFS_ReadLink as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Stat: (receiver: any, ...args: any[]) => (MapFS_Stat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Sub: (receiver: any, ...args: any[]) => (MapFS_Sub as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), lstat: (receiver: any, ...args: any[]) => (MapFS_lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), resolveSymlinks: (receiver: any, ...args: any[]) => (MapFS_resolveSymlinks as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "fstest.MapFS")})), "fstest.fsOnly"), name)
}

export async function MapFS_Stat(fsys: MapFS, name: string): globalThis.Promise<[fs.FileInfo | null, $.GoError]> {
	return fs.Stat($.interfaceValue<fs.FS | null>($.markAsStructValue(new fsOnly({FS: $.namedValueInterfaceValue<fs.FS | null>(fsys, "fstest.MapFS", {Glob: (receiver: any, ...args: any[]) => (MapFS_Glob as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Lstat: (receiver: any, ...args: any[]) => (MapFS_Lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Open: (receiver: any, ...args: any[]) => (MapFS_Open as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadDir: (receiver: any, ...args: any[]) => (MapFS_ReadDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadFile: (receiver: any, ...args: any[]) => (MapFS_ReadFile as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadLink: (receiver: any, ...args: any[]) => (MapFS_ReadLink as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Stat: (receiver: any, ...args: any[]) => (MapFS_Stat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Sub: (receiver: any, ...args: any[]) => (MapFS_Sub as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), lstat: (receiver: any, ...args: any[]) => (MapFS_lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), resolveSymlinks: (receiver: any, ...args: any[]) => (MapFS_resolveSymlinks as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "fstest.MapFS")})), "fstest.fsOnly"), name)
}

export async function MapFS_ReadDir(fsys: MapFS, name: string): globalThis.Promise<[$.Slice<fs.DirEntry | null>, $.GoError]> {
	return fs.ReadDir($.interfaceValue<fs.FS | null>($.markAsStructValue(new fsOnly({FS: $.namedValueInterfaceValue<fs.FS | null>(fsys, "fstest.MapFS", {Glob: (receiver: any, ...args: any[]) => (MapFS_Glob as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Lstat: (receiver: any, ...args: any[]) => (MapFS_Lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Open: (receiver: any, ...args: any[]) => (MapFS_Open as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadDir: (receiver: any, ...args: any[]) => (MapFS_ReadDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadFile: (receiver: any, ...args: any[]) => (MapFS_ReadFile as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadLink: (receiver: any, ...args: any[]) => (MapFS_ReadLink as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Stat: (receiver: any, ...args: any[]) => (MapFS_Stat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Sub: (receiver: any, ...args: any[]) => (MapFS_Sub as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), lstat: (receiver: any, ...args: any[]) => (MapFS_lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), resolveSymlinks: (receiver: any, ...args: any[]) => (MapFS_resolveSymlinks as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "fstest.MapFS")})), "fstest.fsOnly"), name)
}

export async function MapFS_Glob(fsys: MapFS, pattern: string): globalThis.Promise<[$.Slice<string>, $.GoError]> {
	return fs.Glob($.interfaceValue<fs.FS | null>($.markAsStructValue(new fsOnly({FS: $.namedValueInterfaceValue<fs.FS | null>(fsys, "fstest.MapFS", {Glob: (receiver: any, ...args: any[]) => (MapFS_Glob as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Lstat: (receiver: any, ...args: any[]) => (MapFS_Lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Open: (receiver: any, ...args: any[]) => (MapFS_Open as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadDir: (receiver: any, ...args: any[]) => (MapFS_ReadDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadFile: (receiver: any, ...args: any[]) => (MapFS_ReadFile as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), ReadLink: (receiver: any, ...args: any[]) => (MapFS_ReadLink as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Stat: (receiver: any, ...args: any[]) => (MapFS_Stat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Sub: (receiver: any, ...args: any[]) => (MapFS_Sub as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), lstat: (receiver: any, ...args: any[]) => (MapFS_lstat as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), resolveSymlinks: (receiver: any, ...args: any[]) => (MapFS_resolveSymlinks as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "fstest.MapFS")})), "fstest.fsOnly"), pattern)
}

export async function MapFS_Sub(fsys: MapFS, dir: string): globalThis.Promise<[fs.FS | null, $.GoError]> {
	return fs.Sub($.interfaceValue<fs.FS | null>($.markAsStructValue(new noSub({MapFS: fsys})), "fstest.noSub"), dir)
}
