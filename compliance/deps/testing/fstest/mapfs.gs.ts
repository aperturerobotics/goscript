import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as path from "@goscript/path/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

export type MapFS = Map<string, MapFile | null> | null;

export function MapFS_Open(fsys: MapFS, name: string): [fs.File, $.GoError] {
	if (!fs.ValidPath(name)) {
		return [null, new fs.PathError({Err: fs.ErrNotExist, Op: "open", Path: name})]
	}
	let [realName, ok] = MapFS_resolveSymlinks(fsys, name)
	if (!ok) {
		return [null, new fs.PathError({Err: fs.ErrNotExist, Op: "open", Path: name})]
	}
	let file = $.mapGet(fsys, realName, null)[0]
	if (file != null && (file!.Mode & fs.ModeDir) == 0) {
		// Ordinary file
		return [new openMapFile({}), null]
	}
	let list: $.Slice<mapFileInfo> = null
	let need: Map<string, boolean> | null = $.makeMap<string, boolean>()
	if (realName == ".") {
		for (const [fname, f] of fsys?.entries() ?? []) {
			{
				let i = strings.Index(fname, "/")
				if (i < 0) {
					if (fname != ".") {
						list = $.append(list, $.markAsStructValue(new mapFileInfo({})))
					}
				}
				 else {
					$.mapSet(need, $.sliceString(fname, undefined, i), true)
				}
			}
		}
	}
	 else {
		let prefix = realName + "/"
		for (const [fname, f] of fsys?.entries() ?? []) {
			{
				if (strings.HasPrefix(fname, prefix)) {
					let felem = $.sliceString(fname, $.len(prefix), undefined)
					let i = strings.Index(felem, "/")
					if (i < 0) {
						list = $.append(list, $.markAsStructValue(new mapFileInfo({})))
					}
					 else {
						$.mapSet(need, $.sliceString(fname, $.len(prefix), $.len(prefix) + i), true)
					}
				}
			}
		}
		// If the directory name is not in the map,
		// and there are no children of the name in the map,
		// then the directory is treated as not existing.
		if (file == null && list == null && $.len(need) == 0) {
			return [null, new fs.PathError({Err: fs.ErrNotExist, Op: "open", Path: name})]
		}
	}
	for (let _i = 0; _i < $.len(list); _i++) {
		const fi = list![_i]
		{
			$.deleteMapEntry(need, fi.name)
		}
	}
	for (const [name, _v] of need?.entries() ?? []) {
		{
			list = $.append(list, $.markAsStructValue(new mapFileInfo({})))
		}
	}
	slices.SortFunc(list, (a: mapFileInfo, b: mapFileInfo): number => {
		return strings.Compare(a.name, b.name)
	})
	if (file == null) {
		file = new MapFile({Mode: (fs.ModeDir | 0o555)})
	}
	let elem: string = ""
	if (name == ".") {
		elem = "."
	}
	 else {
		elem = $.sliceString(name, strings.LastIndex(name, "/") + 1, undefined)
	}
	return [new mapDir({}), null]
}

export function MapFS_resolveSymlinks(fsys: MapFS, name: string): [string, boolean] {
	{
		let file = $.mapGet(fsys, name, null)[0]
		if (file != null && fs.FileMode_Type(file!.Mode) == fs.ModeSymlink) {
			let target = $.bytesToString(file!.Data)
			if (path.IsAbs(target)) {
				return ["", false]
			}
			return MapFS_resolveSymlinks(fsys, path.Join(path.Dir(name), target))
		}
	}
	for (let i = 0; i < $.len(name); ) {
		let j = strings.Index($.sliceString(name, i, undefined), "/")
		let dir: string = ""
		if (j < 0) {
			dir = name
			i = $.len(name)
		}
		 else {
			dir = $.sliceString(name, undefined, i + j)
			i += j
		}
		{
			let file = $.mapGet(fsys, dir, null)[0]
			if (file != null && fs.FileMode_Type(file!.Mode) == fs.ModeSymlink) {
				let target = $.bytesToString(file!.Data)
				if (path.IsAbs(target)) {
					return ["", false]
				}
				return MapFS_resolveSymlinks(fsys, path.Join(path.Dir(dir), target) + $.sliceString(name, i, undefined))
			}
		}
		i += $.len("/")
	}
	return [name, fs.ValidPath(name)]
}

export function MapFS_ReadLink(fsys: MapFS, name: string): [string, $.GoError] {
	let [info, err] = MapFS_lstat(fsys, name)
	if (err != null) {
		return ["", new fs.PathError({Err: err, Op: "readlink", Path: name})]
	}
	if (fs.FileMode_Type(info!.f!.Mode) != fs.ModeSymlink) {
		return ["", new fs.PathError({Err: fs.ErrInvalid, Op: "readlink", Path: name})]
	}
	return [$.bytesToString(info!.f!.Data), null]
}

export function MapFS_Lstat(fsys: MapFS, name: string): [fs.FileInfo, $.GoError] {
	let [info, err] = MapFS_lstat(fsys, name)
	if (err != null) {
		return [null, new fs.PathError({Err: err, Op: "lstat", Path: name})]
	}
	return [info, null]
}

export function MapFS_lstat(fsys: MapFS, name: string): [mapFileInfo | null, $.GoError] {
	if (!fs.ValidPath(name)) {
		return [null, fs.ErrNotExist]
	}
	let [realDir, ok] = MapFS_resolveSymlinks(fsys, path.Dir(name))
	if (!ok) {
		return [null, fs.ErrNotExist]
	}
	let elem = path.Base(name)
	let realName = path.Join(realDir, elem)
	let file = $.mapGet(fsys, realName, null)[0]
	if (file != null) {
		return [new mapFileInfo({}), null]
	}
	if (realName == ".") {
		return [new mapFileInfo({}), null]
	}
	let prefix = realName + "/"
	for (const [fname, _v] of fsys?.entries() ?? []) {
		{
			if (strings.HasPrefix(fname, prefix)) {
				return [new mapFileInfo({}), null]
			}
		}
	}
	return [null, fs.ErrNotExist]
}

export function MapFS_ReadFile(fsys: MapFS, name: string): [$.Bytes, $.GoError] {
	return fs.ReadFile($.markAsStructValue(new fsOnly({})), name)
}

export function MapFS_Stat(fsys: MapFS, name: string): [fs.FileInfo, $.GoError] {
	return fs.Stat($.markAsStructValue(new fsOnly({})), name)
}

export function MapFS_ReadDir(fsys: MapFS, name: string): [$.Slice<fs.DirEntry>, $.GoError] {
	return fs.ReadDir($.markAsStructValue(new fsOnly({})), name)
}

export function MapFS_Glob(fsys: MapFS, pattern: string): [$.Slice<string>, $.GoError] {
	return fs.Glob($.markAsStructValue(new fsOnly({})), pattern)
}

export function MapFS_Sub(fsys: MapFS, dir: string): [fs.FS, $.GoError] {
	return fs.Sub($.markAsStructValue(new noSub({})), dir)
}


export class MapFile {
	// file content or symlink destination
	public get Data(): $.Bytes {
		return this._fields.Data.value
	}
	public set Data(value: $.Bytes) {
		this._fields.Data.value = value
	}

	// fs.FileInfo.Mode
	public get Mode(): fs.FileMode {
		return this._fields.Mode.value
	}
	public set Mode(value: fs.FileMode) {
		this._fields.Mode.value = value
	}

	// fs.FileInfo.ModTime
	public get ModTime(): time.Time {
		return this._fields.ModTime.value
	}
	public set ModTime(value: time.Time) {
		this._fields.ModTime.value = value
	}

	// fs.FileInfo.Sys
	public get Sys(): null | any {
		return this._fields.Sys.value
	}
	public set Sys(value: null | any) {
		this._fields.Sys.value = value
	}

	public _fields: {
		Data: $.VarRef<$.Bytes>;
		Mode: $.VarRef<fs.FileMode>;
		ModTime: $.VarRef<time.Time>;
		Sys: $.VarRef<null | any>;
	}

	constructor(init?: Partial<{Data?: $.Bytes, ModTime?: time.Time, Mode?: fs.FileMode, Sys?: null | any}>) {
		this._fields = {
			Data: $.varRef(init?.Data ?? new Uint8Array(0)),
			Mode: $.varRef(init?.Mode ?? 0 as fs.FileMode),
			ModTime: $.varRef(init?.ModTime ? $.markAsStructValue(init.ModTime.clone()) : new time.Time()),
			Sys: $.varRef(init?.Sys ?? null)
		}
	}

	public clone(): MapFile {
		const cloned = new MapFile()
		cloned._fields = {
			Data: $.varRef(this._fields.Data.value),
			Mode: $.varRef(this._fields.Mode.value),
			ModTime: $.varRef($.markAsStructValue(this._fields.ModTime.value.clone())),
			Sys: $.varRef(this._fields.Sys.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'MapFile',
	  new MapFile(),
	  [],
	  MapFile,
	  {"Data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } }, "Mode": "FileMode", "ModTime": "Time", "Sys": { kind: $.TypeKind.Interface, methods: [] }}
	);
}

export class fsOnly {
	public get FS(): fs.FS {
		return this._fields.FS.value
	}
	public set FS(value: fs.FS) {
		this._fields.FS.value = value
	}

	public _fields: {
		FS: $.VarRef<fs.FS>;
	}

	constructor(init?: Partial<{FS?: fs.FS}>) {
		this._fields = {
			FS: $.varRef(init?.FS ?? null)
		}
	}

	public clone(): fsOnly {
		const cloned = new fsOnly()
		cloned._fields = {
			FS: $.varRef(this._fields.FS.value)
		}
		return cloned
	}

	public Open(name: string): [fs.File, $.GoError] {
		return this.FS!.Open(name)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'fsOnly',
	  new fsOnly(),
	  [],
	  fsOnly,
	  {"FS": "FS"}
	);
}

export class mapFileInfo {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get f(): MapFile | null {
		return this._fields.f.value
	}
	public set f(value: MapFile | null) {
		this._fields.f.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
		f: $.VarRef<MapFile | null>;
	}

	constructor(init?: Partial<{f?: MapFile | null, name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			f: $.varRef(init?.f ?? null)
		}
	}

	public clone(): mapFileInfo {
		const cloned = new mapFileInfo()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			f: $.varRef(this._fields.f.value ? $.markAsStructValue(this._fields.f.value.clone()) : null)
		}
		return cloned
	}

	public Name(): string {
		const i = this
		return path.Base(i.name)
	}

	public Size(): number {
		const i = this
		return ($.len(i.f!.Data) as number)
	}

	public Mode(): fs.FileMode {
		const i = this
		return i.f!.Mode
	}

	public Type(): fs.FileMode {
		const i = this
		return fs.FileMode_Type(i.f!.Mode)
	}

	public ModTime(): time.Time {
		const i = this
		return i.f!.ModTime
	}

	public IsDir(): boolean {
		const i = this
		return (i.f!.Mode & fs.ModeDir) != 0
	}

	public Sys(): null | any {
		const i = this
		return i.f!.Sys
	}

	public Info(): [fs.FileInfo, $.GoError] {
		const i = this
		return [i, null]
	}

	public String(): string {
		const i = this
		return fs.FormatFileInfo(i)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'mapFileInfo',
	  new mapFileInfo(),
	  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "Mode", args: [], returns: [{ type: "FileMode" }] }, { name: "Type", args: [], returns: [{ type: "FileMode" }] }, { name: "ModTime", args: [], returns: [{ type: "Time" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Info", args: [], returns: [{ type: "FileInfo" }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  mapFileInfo,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }, "f": { kind: $.TypeKind.Pointer, elemType: "MapFile" }}
	);
}

export class noSub {
	public get MapFS(): MapFS {
		return this._fields.MapFS.value
	}
	public set MapFS(value: MapFS) {
		this._fields.MapFS.value = value
	}

	public _fields: {
		MapFS: $.VarRef<MapFS>;
	}

	constructor(init?: Partial<{MapFS?: Partial<ConstructorParameters<typeof MapFS>[0]>}>) {
		this._fields = {
			MapFS: $.varRef(new MapFS(init?.MapFS))
		}
	}

	public clone(): noSub {
		const cloned = new noSub()
		cloned._fields = {
			MapFS: $.varRef(this._fields.MapFS.value)
		}
		return cloned
	}

	public Sub(): void {
	}

	public Glob(pattern: string): [$.Slice<string>, $.GoError] {
		return this.MapFS.Glob(pattern)
	}

	public Lstat(name: string): [fs.FileInfo, $.GoError] {
		return this.MapFS.Lstat(name)
	}

	public Open(name: string): [fs.File, $.GoError] {
		return this.MapFS.Open(name)
	}

	public ReadDir(name: string): [$.Slice<fs.DirEntry>, $.GoError] {
		return this.MapFS.ReadDir(name)
	}

	public ReadFile(name: string): [$.Bytes, $.GoError] {
		return this.MapFS.ReadFile(name)
	}

	public ReadLink(name: string): [string, $.GoError] {
		return this.MapFS.ReadLink(name)
	}

	public Stat(name: string): [fs.FileInfo, $.GoError] {
		return this.MapFS.Stat(name)
	}

	public lstat(name: string): [mapFileInfo | null, $.GoError] {
		return this.MapFS.lstat(name)
	}

	public resolveSymlinks(name: string): [string, boolean] {
		return this.MapFS.resolveSymlinks(name)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'noSub',
	  new noSub(),
	  [{ name: "Sub", args: [], returns: [] }],
	  noSub,
	  {"MapFS": "MapFS"}
	);
}

export class mapDir {
	public get path(): string {
		return this._fields.path.value
	}
	public set path(value: string) {
		this._fields.path.value = value
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

	public get mapFileInfo(): mapFileInfo {
		return this._fields.mapFileInfo.value
	}
	public set mapFileInfo(value: mapFileInfo) {
		this._fields.mapFileInfo.value = value
	}

	public _fields: {
		path: $.VarRef<string>;
		mapFileInfo: $.VarRef<mapFileInfo>;
		entry: $.VarRef<$.Slice<mapFileInfo>>;
		offset: $.VarRef<number>;
	}

	constructor(init?: Partial<{entry?: $.Slice<mapFileInfo>, mapFileInfo?: Partial<ConstructorParameters<typeof mapFileInfo>[0]>, offset?: number, path?: string}>) {
		this._fields = {
			path: $.varRef(init?.path ?? ""),
			mapFileInfo: $.varRef(new mapFileInfo(init?.mapFileInfo)),
			entry: $.varRef(init?.entry ?? null),
			offset: $.varRef(init?.offset ?? 0)
		}
	}

	public clone(): mapDir {
		const cloned = new mapDir()
		cloned._fields = {
			path: $.varRef(this._fields.path.value),
			mapFileInfo: $.varRef($.markAsStructValue(this._fields.mapFileInfo.value.clone())),
			entry: $.varRef(this._fields.entry.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return cloned
	}

	public Stat(): [fs.FileInfo, $.GoError] {
		const d = this
		return [d.mapFileInfo, null]
	}

	public Close(): $.GoError {
		return null
	}

	public Read(b: $.Bytes): [number, $.GoError] {
		const d = this
		return [0, new fs.PathError({Err: fs.ErrInvalid, Op: "read", Path: d.path})]
	}

	public ReadDir(count: number): [$.Slice<fs.DirEntry>, $.GoError] {
		const d = this
		let n = $.len(d.entry) - d.offset
		if (n == 0 && count > 0) {
			return [null, io.EOF]
		}
		if (count > 0 && n > count) {
			n = count
		}
		let list = $.makeSlice<fs.DirEntry>(n)
		for (let i = 0; i < $.len(list); i++) {
			{
				list![i] = d.entry![d.offset + i]
			}
		}
		d.offset += n
		return [list, null]
	}

	public get name(): string {
		return this.mapFileInfo.name
	}
	public set name(value: string) {
		this.mapFileInfo.name = value
	}

	public get f(): MapFile | null {
		return this.mapFileInfo.f
	}
	public set f(value: MapFile | null) {
		this.mapFileInfo.f = value
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'mapDir',
	  new mapDir(),
	  [{ name: "Stat", args: [], returns: [{ type: "FileInfo" }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Close", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "ReadDir", args: [{ name: "count", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "DirEntry" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  mapDir,
	  {"path": { kind: $.TypeKind.Basic, name: "string" }, "mapFileInfo": "mapFileInfo", "entry": { kind: $.TypeKind.Slice, elemType: "mapFileInfo" }, "offset": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

export class openMapFile {
	public get path(): string {
		return this._fields.path.value
	}
	public set path(value: string) {
		this._fields.path.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public get mapFileInfo(): mapFileInfo {
		return this._fields.mapFileInfo.value
	}
	public set mapFileInfo(value: mapFileInfo) {
		this._fields.mapFileInfo.value = value
	}

	public _fields: {
		path: $.VarRef<string>;
		mapFileInfo: $.VarRef<mapFileInfo>;
		offset: $.VarRef<number>;
	}

	constructor(init?: Partial<{mapFileInfo?: Partial<ConstructorParameters<typeof mapFileInfo>[0]>, offset?: number, path?: string}>) {
		this._fields = {
			path: $.varRef(init?.path ?? ""),
			mapFileInfo: $.varRef(new mapFileInfo(init?.mapFileInfo)),
			offset: $.varRef(init?.offset ?? 0)
		}
	}

	public clone(): openMapFile {
		const cloned = new openMapFile()
		cloned._fields = {
			path: $.varRef(this._fields.path.value),
			mapFileInfo: $.varRef($.markAsStructValue(this._fields.mapFileInfo.value.clone())),
			offset: $.varRef(this._fields.offset.value)
		}
		return cloned
	}

	public Stat(): [fs.FileInfo, $.GoError] {
		const f = this
		return [f.mapFileInfo, null]
	}

	public Close(): $.GoError {
		return null
	}

	public Read(b: $.Bytes): [number, $.GoError] {
		const f = this
		if (f.offset >= ($.len(f.f!.Data) as number)) {
			return [0, io.EOF]
		}
		if (f.offset < 0) {
			return [0, new fs.PathError({Err: fs.ErrInvalid, Op: "read", Path: f.path})]
		}
		let n = $.copy(b, $.goSlice(f.f!.Data, f.offset, undefined))
		f.offset += (n as number)
		return [n, null]
	}

	public Seek(offset: number, whence: number): [number, $.GoError] {
		const f = this
		switch (whence) {
			case 0: {
				break
			}
			case 1: {
				offset += f.offset
				break
			}
			case 2: {
				offset += ($.len(f.f!.Data) as number)
				break
			}
		}
		if (offset < 0 || offset > ($.len(f.f!.Data) as number)) {
			return [0, new fs.PathError({Err: fs.ErrInvalid, Op: "seek", Path: f.path})]
		}
		f.offset = offset
		return [offset, null]
	}

	public ReadAt(b: $.Bytes, offset: number): [number, $.GoError] {
		const f = this
		if (offset < 0 || offset > ($.len(f.f!.Data) as number)) {
			return [0, new fs.PathError({Err: fs.ErrInvalid, Op: "read", Path: f.path})]
		}
		let n = $.copy(b, $.goSlice(f.f!.Data, offset, undefined))
		if (n < $.len(b)) {
			return [n, io.EOF]
		}
		return [n, null]
	}

	public get name(): string {
		return this.mapFileInfo.name
	}
	public set name(value: string) {
		this.mapFileInfo.name = value
	}

	public get f(): MapFile | null {
		return this.mapFileInfo.f
	}
	public set f(value: MapFile | null) {
		this.mapFileInfo.f = value
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'openMapFile',
	  new openMapFile(),
	  [{ name: "Stat", args: [], returns: [{ type: "FileInfo" }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Close", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Seek", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "whence", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "ReadAt", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }, { name: "offset", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  openMapFile,
	  {"path": { kind: $.TypeKind.Basic, name: "string" }, "mapFileInfo": "mapFileInfo", "offset": { kind: $.TypeKind.Basic, name: "number" }}
	);
}


