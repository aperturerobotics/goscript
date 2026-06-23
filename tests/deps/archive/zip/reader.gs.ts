// Generated file based on reader.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as crc32 from "@goscript/hash/crc32/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as os from "@goscript/os/index.js"

import * as path from "@goscript/path/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_register from "./register.gs.ts"

import * as __goscript_struct from "./struct.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bufio/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/hash/crc32/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/path/index.js"
import "@goscript/path/filepath/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./register.gs.ts"
import "./struct.gs.ts"
import "./writer.gs.ts"

export class Reader {
	public get r(): io.ReaderAt | null {
		return this._fields.r.value
	}
	public set r(value: io.ReaderAt | null) {
		this._fields.r.value = value
	}

	public get File(): $.Slice<File | $.VarRef<File> | null> {
		return this._fields.File.value
	}
	public set File(value: $.Slice<File | $.VarRef<File> | null>) {
		this._fields.File.value = value
	}

	public get Comment(): string {
		return this._fields.Comment.value
	}
	public set Comment(value: string) {
		this._fields.Comment.value = value
	}

	public get decompressors(): globalThis.Map<number, __goscript_register.Decompressor | null> | null {
		return this._fields.decompressors.value
	}
	public set decompressors(value: globalThis.Map<number, __goscript_register.Decompressor | null> | null) {
		this._fields.decompressors.value = value
	}

	// Some JAR files are zip files with a prefix that is a bash script.
	// The baseOffset field is the start of the zip file proper.
	public get baseOffset(): bigint {
		return this._fields.baseOffset.value
	}
	public set baseOffset(value: bigint) {
		this._fields.baseOffset.value = value
	}

	// fileList is a list of files sorted by ename,
	// for use by the Open method.
	public get fileListOnce(): sync.Once {
		return this._fields.fileListOnce.value
	}
	public set fileListOnce(value: sync.Once) {
		this._fields.fileListOnce.value = value
	}

	public get fileList(): $.Slice<fileListEntry> {
		return this._fields.fileList.value
	}
	public set fileList(value: $.Slice<fileListEntry>) {
		this._fields.fileList.value = value
	}

	public _fields: {
		r: $.VarRef<io.ReaderAt | null>
		File: $.VarRef<$.Slice<File | $.VarRef<File> | null>>
		Comment: $.VarRef<string>
		decompressors: $.VarRef<globalThis.Map<number, __goscript_register.Decompressor | null> | null>
		baseOffset: $.VarRef<bigint>
		fileListOnce: $.VarRef<sync.Once>
		fileList: $.VarRef<$.Slice<fileListEntry>>
	}

	constructor(init?: Partial<{r?: io.ReaderAt | null, File?: $.Slice<File | $.VarRef<File> | null>, Comment?: string, decompressors?: globalThis.Map<number, __goscript_register.Decompressor | null> | null, baseOffset?: bigint, fileListOnce?: sync.Once, fileList?: $.Slice<fileListEntry>}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null as unknown as io.ReaderAt | null)),
			File: $.varRef(init?.File ?? (null as unknown as $.Slice<File | $.VarRef<File> | null>)),
			Comment: $.varRef(init?.Comment ?? ("" as unknown as string)),
			decompressors: $.varRef(init?.decompressors ?? (null as unknown as globalThis.Map<number, __goscript_register.Decompressor | null> | null)),
			baseOffset: $.varRef(init?.baseOffset ?? (0n as unknown as bigint)),
			fileListOnce: $.varRef(init?.fileListOnce ? $.markAsStructValue($.cloneStructValue(init.fileListOnce)) : $.markAsStructValue(new sync.Once())),
			fileList: $.varRef(init?.fileList ?? (null as unknown as $.Slice<fileListEntry>))
		}
	}

	public clone(): Reader {
		const cloned = new Reader()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			File: $.varRef(this._fields.File.value),
			Comment: $.varRef(this._fields.Comment.value),
			decompressors: $.varRef(this._fields.decompressors.value),
			baseOffset: $.varRef(this._fields.baseOffset.value),
			fileListOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.fileListOnce.value))),
			fileList: $.varRef(this._fields.fileList.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Open(name: string): globalThis.Promise<[fs.File | null, $.GoError]> {
		const r: Reader | $.VarRef<Reader> | null = this
		await Reader.prototype.initFileList.call(r)

		if (!fs.ValidPath(name)) {
			return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "open", Path: name, Err: fs.ErrInvalid}), "*fs.PathError")]
		}
		let e: fileListEntry | $.VarRef<fileListEntry> | null = Reader.prototype.openLookup.call(r, name)
		if (e == null) {
			return [null, $.interfaceValue<$.GoError>(new fs.PathError({Op: "open", Path: name, Err: fs.ErrNotExist}), "*fs.PathError")]
		}
		if ($.pointerValue<fileListEntry>(e).isDir) {
			return [$.interfaceValue<fs.File | null>((() => { const __goscriptLiteralField0 = Reader.prototype.openReadDir.call(r, name); return new openDir({e: e, files: __goscriptLiteralField0, offset: 0}) })(), "*zip.openDir"), null]
		}
		let [rc, err] = await File.prototype.Open.call($.pointerValue<fileListEntry>(e).file)
		if (err != null) {
			return [null, err]
		}
		return [$.mustTypeAssert<fs.File | null>(rc, "fs.File"), null]
	}

	public RegisterDecompressor(method: number, dcomp: __goscript_register.Decompressor | null): void {
		let r: Reader | $.VarRef<Reader> | null = this
		if ($.pointerValue<Reader>(r).decompressors == null) {
			$.pointerValue<Reader>(r).decompressors = $.makeMap<number, __goscript_register.Decompressor | null>()
		}
		$.mapSet($.pointerValue<Reader>(r).decompressors, $.uint(method, 16), dcomp)
	}

	public async decompressor(method: number): globalThis.Promise<__goscript_register.Decompressor | null> {
		const r: Reader | $.VarRef<Reader> | null = this
		let dcomp = $.mapGet<number, __goscript_register.Decompressor | null, __goscript_register.Decompressor | null>($.pointerValue<Reader>(r).decompressors, $.uint(method, 16), null)[0]
		if (dcomp == null) {
			dcomp = await __goscript_register.decompressor($.uint(method, 16))
		}
		return dcomp
	}

	public async init(rdr: io.ReaderAt | null, size: bigint): globalThis.Promise<$.GoError> {
		let r: Reader | $.VarRef<Reader> | null = this
		let __goscriptTuple0: any = await readDirectoryEnd(rdr, size)
		let end: __goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null = __goscriptTuple0[0]
		let baseOffset = __goscriptTuple0[1]
		let err = __goscriptTuple0[2]
		if (err != null) {
			return err
		}
		$.pointerValue<Reader>(r).r = rdr
		$.pointerValue<Reader>(r).baseOffset = baseOffset
		// Since the number of directory records is not validated, it is not
		// safe to preallocate r.File without first checking that the specified
		// number of files is reasonable, since a malformed archive may
		// indicate it contains up to 1 << 128 - 1 files. Since each file has a
		// header which will be _at least_ 30 bytes we can safely preallocate
		// if (data size / 30) >= end.directoryRecords.
		if (($.pointerValue<__goscript_struct.directoryEnd>(end).directorySize < $.uint64(size)) && (($.uint64Div(($.uint64Sub($.uint64(size), $.pointerValue<__goscript_struct.directoryEnd>(end).directorySize)), 30)) >= $.pointerValue<__goscript_struct.directoryEnd>(end).directoryRecords)) {
			$.pointerValue<Reader>(r).File = $.makeSlice<File | $.VarRef<File> | null>(0, Number($.pointerValue<__goscript_struct.directoryEnd>(end).directoryRecords))
		}
		$.pointerValue<Reader>(r).Comment = $.pointerValue<__goscript_struct.directoryEnd>(end).comment
		let rs: io.SectionReader | $.VarRef<io.SectionReader> | null = io.NewSectionReader($.pointerValueOrNil(rdr)!, 0n, size)
		{
			let __goscriptTuple1: any = io.SectionReader.prototype.Seek.call($.pointerValue<io.SectionReader>(rs), $.int64Add($.pointerValue<Reader>(r).baseOffset, $.int64($.pointerValue<__goscript_struct.directoryEnd>(end).directoryOffset)), io.SeekStart)
			err = __goscriptTuple1[1]
			if (err != null) {
				return err
			}
		}
		let buf: bufio.Reader | $.VarRef<bufio.Reader> | null = bufio.NewReader($.interfaceValue<io.Reader | null>(rs, "*io.SectionReader"))

		// The count of files inside a zip is truncated to fit in a uint16.
		// Gloss over this by reading headers until we encounter
		// a bad one, and then only report an ErrFormat or UnexpectedEOF if
		// the file count modulo 65536 is incorrect.
		while (true) {
			let f: File | $.VarRef<File> | null = new File({zip: r, zipr: rdr})
			err = await readDirectoryHeader(f, $.interfaceValue<io.Reader | null>(buf, "*bufio.Reader"))
			if (($.comparableEqual(err, ErrFormat)) || ($.comparableEqual(err, io.ErrUnexpectedEOF))) {
				break
			}
			if (err != null) {
				return err
			}
			$.pointerValue<File>(f).headerOffset = $.int64Add($.pointerValue<File>(f).headerOffset, $.pointerValue<Reader>(r).baseOffset)
			$.pointerValue<Reader>(r).File = $.append($.pointerValue<Reader>(r).File, f)
		}
		if ($.uint($.uint($.len($.pointerValue<Reader>(r).File), 16), 16) != $.uint($.uint($.pointerValue<__goscript_struct.directoryEnd>(end).directoryRecords, 16), 16)) {
			// Return the readDirectoryHeader error if we read
			// the wrong number of directory entries.
			return err
		}
		if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(zipinsecurepath)), "0")) {
			for (let __goscriptRangeTarget0 = $.pointerValue<Reader>(r).File, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
				let f = __goscriptRangeTarget0![__rangeIndex]
				if ($.stringEqual($.pointerValue<File>(f).FileHeader.Name, "")) {
					// Zip permits an empty file name field.
					continue
				}
				// The zip specification states that names must use forward slashes,
				// so consider any backslashes in the name insecure.
				if (!filepath.IsLocal($.pointerValue<File>(f).FileHeader.Name) || strings.Contains($.pointerValue<File>(f).FileHeader.Name, "\\")) {
					godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(zipinsecurepath))
					return ErrInsecurePath
				}
			}
		}
		return null
	}

	public async initFileList(): globalThis.Promise<void> {
		const r: Reader | $.VarRef<Reader> | null = this
		await $.pointerValue<Reader>(r).fileListOnce.Do($.functionValue(async (): globalThis.Promise<void> => {
			// Preallocate the minimum size of the index.
			// We may also synthesize additional directory entries.
			$.pointerValue<Reader>(r).fileList = $.makeSlice<fileListEntry>(0, $.len($.pointerValue<Reader>(r).File), undefined, () => $.markAsStructValue(new fileListEntry()))
			// files and knownDirs map from a file/directory name
			// to an index into the r.fileList entry that we are
			// building. They are used to mark duplicate entries.
			let files: globalThis.Map<string, number> | null = $.makeMap<string, number>()
			let knownDirs: globalThis.Map<string, number> | null = $.makeMap<string, number>()

			// dirs[name] is true if name is known to be a directory,
			// because it appears as a prefix in a path.
			let dirs: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()

			for (let __goscriptRangeTarget1 = $.pointerValue<Reader>(r).File, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
				let file = __goscriptRangeTarget1![__rangeIndex]
				let isDir = ($.len($.pointerValue<File>(file).FileHeader.Name) > 0) && ($.uint($.indexStringOrBytes($.pointerValue<File>(file).FileHeader.Name, $.len($.pointerValue<File>(file).FileHeader.Name) - 1), 8) == $.uint(47, 8))
				let name = toValidName($.pointerValue<File>(file).FileHeader.Name)
				if ($.stringEqual(name, "")) {
					continue
				}

				{
					let [idx, ok] = $.mapGet<string, number, number>(files, name, 0)
					if (ok) {
						$.pointerValue<Reader>(r).fileList![idx].isDup = true
						continue
					}
				}
				{
					let [idx, ok] = $.mapGet<string, number, number>(knownDirs, name, 0)
					if (ok) {
						$.pointerValue<Reader>(r).fileList![idx].isDup = true
						continue
					}
				}

				let dir = name
				while (true) {
					{
						let idx = strings.LastIndex(dir, "/")
						if (idx < 0) {
							break
						} else {
							dir = $.sliceStringOrBytes(dir, undefined, idx)
						}
					}
					if ($.mapGet<string, boolean, boolean>(dirs, dir, false)[0]) {
						break
					}
					$.mapSet(dirs, dir, true)
				}

				let idx = $.len($.pointerValue<Reader>(r).fileList)
				let entry = $.markAsStructValue(new fileListEntry({name: name, file: file, isDir: isDir}))
				$.pointerValue<Reader>(r).fileList = $.append($.pointerValue<Reader>(r).fileList, entry)
				if (isDir) {
					$.mapSet(knownDirs, name, idx)
				} else {
					$.mapSet(files, name, idx)
				}
			}
			for (const [dir, __rangeValue] of dirs?.entries() ?? []) {
				{
					let [, ok] = $.mapGet<string, number, number>(knownDirs, dir, 0)
					if (!ok) {
						{
							let [idx, __goscriptShadow0] = $.mapGet<string, number, number>(files, dir, 0)
							if (__goscriptShadow0) {
								$.pointerValue<Reader>(r).fileList![idx].isDup = true
							} else {
								let entry = $.markAsStructValue(new fileListEntry({name: dir, file: null, isDir: true}))
								$.pointerValue<Reader>(r).fileList = $.append($.pointerValue<Reader>(r).fileList, entry)
							}
						}
					}
				}
			}

			await slices.SortFunc($.pointerValue<Reader>(r).fileList, $.functionValue((a: fileListEntry, b: fileListEntry): number => {
				return fileEntryCompare(a.name, b.name)
			}, ({ kind: $.TypeKind.Function, params: ["zip.fileListEntry", "zip.fileListEntry"], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}

	public openLookup(name: string): fileListEntry | $.VarRef<fileListEntry> | null {
		const r: Reader | $.VarRef<Reader> | null = this
		if ($.stringEqual(name, ".")) {
			return dotFile
		}

		let [dir, elem, ] = split(name)
		let files: $.Slice<fileListEntry> = $.pointerValue<Reader>(r).fileList
		let [i, ] = slices.BinarySearchFunc(files, dir, $.functionValue((a: fileListEntry, dir: string): number => {
			let ret: number = 0
			let [idir, ielem, ] = split(a.name)
			if (!$.stringEqual(dir, idir)) {
				return strings.Compare(idir, dir)
			}
			return strings.Compare(ielem, elem)
		}, ({ kind: $.TypeKind.Function, params: ["zip.fileListEntry", { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
		if (i < $.len(files)) {
			let fname = files![i].name
			if (($.stringEqual(fname, name)) || ((($.len(fname) == ($.len(name) + 1)) && ($.uint($.indexStringOrBytes(fname, $.len(name)), 8) == $.uint(47, 8))) && ($.stringEqual($.sliceStringOrBytes(fname, undefined, $.len(name)), name)))) {
				return $.indexRef(files!, i)
			}
		}
		return null
	}

	public openReadDir(dir: string): $.Slice<fileListEntry> {
		const r: Reader | $.VarRef<Reader> | null = this
		let files: $.Slice<fileListEntry> = $.pointerValue<Reader>(r).fileList
		let [i, ] = slices.BinarySearchFunc(files, dir, $.functionValue((a: fileListEntry, dir: string): number => {
			let [idir, , ] = split(a.name)
			if (!$.stringEqual(dir, idir)) {
				return strings.Compare(idir, dir)
			}
			// find the first entry with dir
			return +1
		}, ({ kind: $.TypeKind.Function, params: ["zip.fileListEntry", { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
		let [j, ] = slices.BinarySearchFunc(files, dir, $.functionValue((a: fileListEntry, dir: string): number => {
			let [jdir, , ] = split(a.name)
			if (!$.stringEqual(dir, jdir)) {
				return strings.Compare(jdir, dir)
			}
			// find the last entry with dir
			return -1
		}, ({ kind: $.TypeKind.Function, params: ["zip.fileListEntry", { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))
		return $.goSlice(files, i, j)
	}

	static __typeInfo = $.registerStructType(
		"zip.Reader",
		() => new Reader(),
		[{ name: "Open", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "fs.File" }, { type: "error" }] }, { name: "RegisterDecompressor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "decompressor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: ({ kind: $.TypeKind.Function, name: "zip.Decompressor", params: ["io.Reader"], results: ["io.ReadCloser"] } as $.FunctionTypeInfo) }] }, { name: "init", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "initFileList", args: [], returns: [] }, { name: "openLookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "zip.fileListEntry" } }] }, { name: "openReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "zip.fileListEntry" } }] }],
		Reader,
		[{ name: "r", key: "r", type: "io.ReaderAt" }, { name: "File", key: "File", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "zip.File" } } }, { name: "Comment", key: "Comment", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "decompressors", key: "decompressors", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint16" }, elemType: ({ kind: $.TypeKind.Function, name: "zip.Decompressor", params: ["io.Reader"], results: ["io.ReadCloser"] } as $.FunctionTypeInfo) } }, { name: "baseOffset", key: "baseOffset", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "fileListOnce", key: "fileListOnce", type: "sync.Once" }, { name: "fileList", key: "fileList", type: { kind: $.TypeKind.Slice, elemType: "zip.fileListEntry" } }]
	)
}

export class ReadCloser {
	public get f(): os.File | $.VarRef<os.File> | null {
		return this._fields.f.value
	}
	public set f(value: os.File | $.VarRef<os.File> | null) {
		this._fields.f.value = value
	}

	public get Reader(): Reader {
		return this._fields.Reader.value
	}
	public set Reader(value: Reader) {
		this._fields.Reader.value = value
	}

	public _fields: {
		f: $.VarRef<os.File | $.VarRef<os.File> | null>
		Reader: $.VarRef<Reader>
	}

	constructor(init?: Partial<{f?: os.File | $.VarRef<os.File> | null, Reader?: Reader}>) {
		this._fields = {
			f: $.varRef(init?.f ?? (null as unknown as os.File | $.VarRef<os.File> | null)),
			Reader: $.varRef(init?.Reader ? $.markAsStructValue($.cloneStructValue(init.Reader)) : $.markAsStructValue(new Reader()))
		}
	}

	public clone(): ReadCloser {
		const cloned = new ReadCloser()
		cloned._fields = {
			f: $.varRef(this._fields.f.value),
			Reader: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Reader.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const rc: ReadCloser | $.VarRef<ReadCloser> | null = this
		return os.File.prototype.Close.call($.pointerValue<os.File>($.pointerValue<ReadCloser>(rc).f))
	}

	public async Open(name: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).Open(name)
	}

	public RegisterDecompressor(method: any, dcomp: any): any {
		return $.pointerValue<Reader>(this.Reader).RegisterDecompressor(method, dcomp)
	}

	public async decompressor(method: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).decompressor(method)
	}

	public async init(rdr: any, size: any): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).init(rdr, size)
	}

	public async initFileList(): globalThis.Promise<any> {
		return await $.pointerValue<Reader>(this.Reader).initFileList()
	}

	public openLookup(name: any): any {
		return $.pointerValue<Reader>(this.Reader).openLookup(name)
	}

	public openReadDir(dir: any): any {
		return $.pointerValue<Reader>(this.Reader).openReadDir(dir)
	}

	static __typeInfo = $.registerStructType(
		"zip.ReadCloser",
		() => new ReadCloser(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Open", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "fs.File" }, { type: "error" }] }, { name: "RegisterDecompressor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "decompressor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: ({ kind: $.TypeKind.Function, name: "zip.Decompressor", params: ["io.Reader"], results: ["io.ReadCloser"] } as $.FunctionTypeInfo) }] }, { name: "init", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "initFileList", args: [], returns: [] }, { name: "openLookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "zip.fileListEntry" } }] }, { name: "openReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "zip.fileListEntry" } }] }],
		ReadCloser,
		[{ name: "f", key: "f", type: { kind: $.TypeKind.Pointer, elemType: "os.File" } }, { name: "Reader", key: "Reader", type: "zip.Reader", anonymous: true }]
	)
}

export class File {
	public get FileHeader(): __goscript_struct.FileHeader {
		return this._fields.FileHeader.value
	}
	public set FileHeader(value: __goscript_struct.FileHeader) {
		this._fields.FileHeader.value = value
	}

	public get zip(): Reader | $.VarRef<Reader> | null {
		return this._fields.zip.value
	}
	public set zip(value: Reader | $.VarRef<Reader> | null) {
		this._fields.zip.value = value
	}

	public get zipr(): io.ReaderAt | null {
		return this._fields.zipr.value
	}
	public set zipr(value: io.ReaderAt | null) {
		this._fields.zipr.value = value
	}

	public get headerOffset(): bigint {
		return this._fields.headerOffset.value
	}
	public set headerOffset(value: bigint) {
		this._fields.headerOffset.value = value
	}

	public get zip64(): boolean {
		return this._fields.zip64.value
	}
	public set zip64(value: boolean) {
		this._fields.zip64.value = value
	}

	public _fields: {
		FileHeader: $.VarRef<__goscript_struct.FileHeader>
		zip: $.VarRef<Reader | $.VarRef<Reader> | null>
		zipr: $.VarRef<io.ReaderAt | null>
		headerOffset: $.VarRef<bigint>
		zip64: $.VarRef<boolean>
	}

	constructor(init?: Partial<{FileHeader?: __goscript_struct.FileHeader, zip?: Reader | $.VarRef<Reader> | null, zipr?: io.ReaderAt | null, headerOffset?: bigint, zip64?: boolean}>) {
		this._fields = {
			FileHeader: $.varRef(init?.FileHeader ? $.markAsStructValue($.cloneStructValue(init.FileHeader)) : $.markAsStructValue(new __goscript_struct.FileHeader())),
			zip: $.varRef(init?.zip ?? (null as unknown as Reader | $.VarRef<Reader> | null)),
			zipr: $.varRef(init?.zipr ?? (null as unknown as io.ReaderAt | null)),
			headerOffset: $.varRef(init?.headerOffset ?? (0n as unknown as bigint)),
			zip64: $.varRef(init?.zip64 ?? (false as unknown as boolean))
		}
	}

	public clone(): File {
		const cloned = new File()
		cloned._fields = {
			FileHeader: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.FileHeader.value))),
			zip: $.varRef(this._fields.zip.value),
			zipr: $.varRef(this._fields.zipr.value),
			headerOffset: $.varRef(this._fields.headerOffset.value),
			zip64: $.varRef(this._fields.zip64.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async DataOffset(): globalThis.Promise<[bigint, $.GoError]> {
		const f: File | $.VarRef<File> | null = this
		let offset: bigint = 0n
		let err: $.GoError = null as $.GoError
		let __goscriptTuple2: any = await File.prototype.findBodyOffset.call(f)
		let bodyOffset = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (err != null) {
			return [offset, err]
		}
		return [$.int64Add($.pointerValue<File>(f).headerOffset, bodyOffset), null]
	}

	public async Open(): globalThis.Promise<[io.ReadCloser | null, $.GoError]> {
		const f: File | $.VarRef<File> | null = this
		let [bodyOffset, err] = await File.prototype.findBodyOffset.call(f)
		if (err != null) {
			return [null, err]
		}
		if (strings.HasSuffix($.pointerValue<File>(f).FileHeader.Name, "/")) {
			// The ZIP specification (APPNOTE.TXT) specifies that directories, which
			// are technically zero-byte files, must not have any associated file
			// data. We previously tried failing here if f.CompressedSize64 != 0,
			// but it turns out that a number of implementations (namely, the Java
			// jar tool) don't properly set the storage method on directories
			// resulting in a file with compressed size > 0 but uncompressed size ==
			// 0. We still want to fail when a directory has associated uncompressed
			// data, but we are tolerant of cases where the uncompressed size is
			// zero but compressed size is not.
			if ($.pointerValue<File>(f).FileHeader.UncompressedSize64 != 0n) {
				return [$.interfaceValue<io.ReadCloser | null>(new dirReader({err: ErrFormat}), "*zip.dirReader"), null]
			} else {
				return [$.interfaceValue<io.ReadCloser | null>(new dirReader({err: io.EOF}), "*zip.dirReader"), null]
			}
		}
		let size = $.int64($.pointerValue<File>(f).FileHeader.CompressedSize64)
		let r: io.SectionReader | $.VarRef<io.SectionReader> | null = io.NewSectionReader($.pointerValueOrNil($.pointerValue<File>(f).zipr)!, $.int64Add($.pointerValue<File>(f).headerOffset, bodyOffset), size)
		let dcomp = await Reader.prototype.decompressor.call($.pointerValue<File>(f).zip, $.uint($.pointerValue<File>(f).FileHeader.Method, 16))
		if (dcomp == null) {
			return [null, ErrAlgorithm]
		}
		let rc: io.ReadCloser | null = await dcomp!($.interfaceValue<io.Reader | null>(r, "*io.SectionReader"))
		let desr: io.Reader | null = null as io.Reader | null
		if ($.pointerValue<File>(f).FileHeader.hasDataDescriptor()) {
			desr = $.interfaceValue<io.Reader | null>(io.NewSectionReader($.pointerValueOrNil($.pointerValue<File>(f).zipr)!, $.int64Add(($.int64Add($.pointerValue<File>(f).headerOffset, bodyOffset)), size), 16n), "*io.SectionReader")
		}
		rc = $.interfaceValue<io.ReadCloser | null>((await (async () => { const __goscriptLiteralField1 = await crc32.NewIEEE(); return new checksumReader({rc: rc, hash: __goscriptLiteralField1, f: f, desr: desr}) })()), "*zip.checksumReader")
		return [rc, null]
	}

	public async OpenRaw(): globalThis.Promise<[io.Reader | null, $.GoError]> {
		const f: File | $.VarRef<File> | null = this
		let [bodyOffset, err] = await File.prototype.findBodyOffset.call(f)
		if (err != null) {
			return [null, err]
		}
		let r: io.SectionReader | $.VarRef<io.SectionReader> | null = io.NewSectionReader($.pointerValueOrNil($.pointerValue<File>(f).zipr)!, $.int64Add($.pointerValue<File>(f).headerOffset, bodyOffset), $.int64($.pointerValue<File>(f).FileHeader.CompressedSize64))
		return [$.interfaceValue<io.Reader | null>(r, "*io.SectionReader"), null]
	}

	public async findBodyOffset(): globalThis.Promise<[bigint, $.GoError]> {
		const f: File | $.VarRef<File> | null = this
		let buf: Uint8Array = new Uint8Array(30)
		{
			let [, err] = await $.pointerValue<Exclude<io.ReaderAt, null>>($.pointerValue<File>(f).zipr).ReadAt($.goSlice(buf, undefined, undefined), $.pointerValue<File>(f).headerOffset)
			if (err != null) {
				return [0n, err]
			}
		}
		let b: $.VarRef<readBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as readBuf) as readBuf))
		{
			let sig = $.uint(readBuf_uint32(b), 32)
			if ($.uint(sig, 32) != $.uint(67324752, 32)) {
				return [0n, ErrFormat]
			}
		}
		b.value = ($.goSlice(b.value, 22, undefined) as readBuf)
		let filenameLen = $.int(readBuf_uint16(b))
		let extraLen = $.int(readBuf_uint16(b))
		return [$.int64((30 + filenameLen) + extraLen), null]
	}

	public FileInfo(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).FileInfo()
	}

	public ModTime(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).ModTime()
	}

	public Mode(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).Mode()
	}

	public SetModTime(t: any): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).SetModTime(t)
	}

	public SetMode(mode: any): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).SetMode(mode)
	}

	public hasDataDescriptor(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).hasDataDescriptor()
	}

	public isZip64(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).isZip64()
	}

	static __typeInfo = $.registerStructType(
		"zip.File",
		() => new File(),
		[{ name: "DataOffset", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }, { type: "error" }] }, { name: "Open", args: [], returns: [{ type: "io.ReadCloser" }, { type: "error" }] }, { name: "OpenRaw", args: [], returns: [{ type: "io.Reader" }, { type: "error" }] }, { name: "findBodyOffset", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }, { type: "error" }] }, { name: "FileInfo", args: [], returns: [{ type: "fs.FileInfo" }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "SetModTime", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "SetMode", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "hasDataDescriptor", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "isZip64", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		File,
		[{ name: "FileHeader", key: "FileHeader", type: "zip.FileHeader", anonymous: true }, { name: "zip", key: "zip", type: { kind: $.TypeKind.Pointer, elemType: "zip.Reader" } }, { name: "zipr", key: "zipr", type: "io.ReaderAt" }, { name: "headerOffset", key: "headerOffset", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "zip64", key: "zip64", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export class dirReader {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? (null as unknown as $.GoError))
		}
	}

	public clone(): dirReader {
		const cloned = new dirReader()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const r: dirReader | $.VarRef<dirReader> | null = this
		return null
	}

	public Read(_p0: $.Slice<number>): [number, $.GoError] {
		const r: dirReader | $.VarRef<dirReader> | null = this
		return [0, $.pointerValue<dirReader>(r).err]
	}

	static __typeInfo = $.registerStructType(
		"zip.dirReader",
		() => new dirReader(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		dirReader,
		[{ name: "err", key: "err", type: "error" }]
	)
}

export class checksumReader {
	public get rc(): io.ReadCloser | null {
		return this._fields.rc.value
	}
	public set rc(value: io.ReadCloser | null) {
		this._fields.rc.value = value
	}

	public get hash(): hash2.Hash32 | null {
		return this._fields.hash.value
	}
	public set hash(value: hash2.Hash32 | null) {
		this._fields.hash.value = value
	}

	public get nread(): bigint {
		return this._fields.nread.value
	}
	public set nread(value: bigint) {
		this._fields.nread.value = value
	}

	public get f(): File | $.VarRef<File> | null {
		return this._fields.f.value
	}
	public set f(value: File | $.VarRef<File> | null) {
		this._fields.f.value = value
	}

	public get desr(): io.Reader | null {
		return this._fields.desr.value
	}
	public set desr(value: io.Reader | null) {
		this._fields.desr.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		rc: $.VarRef<io.ReadCloser | null>
		hash: $.VarRef<hash2.Hash32 | null>
		nread: $.VarRef<bigint>
		f: $.VarRef<File | $.VarRef<File> | null>
		desr: $.VarRef<io.Reader | null>
		err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{rc?: io.ReadCloser | null, hash?: hash2.Hash32 | null, nread?: bigint, f?: File | $.VarRef<File> | null, desr?: io.Reader | null, err?: $.GoError}>) {
		this._fields = {
			rc: $.varRef(init?.rc ?? (null as unknown as io.ReadCloser | null)),
			hash: $.varRef(init?.hash ?? (null as unknown as hash2.Hash32 | null)),
			nread: $.varRef(init?.nread ?? (0n as unknown as bigint)),
			f: $.varRef(init?.f ?? (null as unknown as File | $.VarRef<File> | null)),
			desr: $.varRef(init?.desr ?? (null as unknown as io.Reader | null)),
			err: $.varRef(init?.err ?? (null as unknown as $.GoError))
		}
	}

	public clone(): checksumReader {
		const cloned = new checksumReader()
		cloned._fields = {
			rc: $.varRef(this._fields.rc.value),
			hash: $.varRef(this._fields.hash.value),
			nread: $.varRef(this._fields.nread.value),
			f: $.varRef(this._fields.f.value),
			desr: $.varRef(this._fields.desr.value),
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		const r: checksumReader | $.VarRef<checksumReader> | null = this
		return await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<checksumReader>(r).rc).Close()
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let r: checksumReader | $.VarRef<checksumReader> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<checksumReader>(r).err != null) {
			return [0, $.pointerValue<checksumReader>(r).err]
		}
		let __goscriptTuple5: any = await $.pointerValue<Exclude<io.ReadCloser, null>>($.pointerValue<checksumReader>(r).rc).Read(b)
		n = __goscriptTuple5[0]
		err = __goscriptTuple5[1]
		await $.pointerValue<Exclude<hash2.Hash32, null>>($.pointerValue<checksumReader>(r).hash).Write($.goSlice(b, undefined, n))
		$.pointerValue<checksumReader>(r).nread = $.uint64Add($.pointerValue<checksumReader>(r).nread, $.uint64(n))
		if ($.pointerValue<checksumReader>(r).nread > $.pointerValue<File>($.pointerValue<checksumReader>(r).f).FileHeader.UncompressedSize64) {
			return [0, ErrFormat]
		}
		if (err == null) {
			return [n, err]
		}
		if ($.comparableEqual(err, io.EOF)) {
			if ($.pointerValue<checksumReader>(r).nread != $.pointerValue<File>($.pointerValue<checksumReader>(r).f).FileHeader.UncompressedSize64) {
				return [0, io.ErrUnexpectedEOF]
			}
			if ($.pointerValue<checksumReader>(r).desr != null) {
				{
					let err1 = await readDataDescriptor($.pointerValue<checksumReader>(r).desr, $.pointerValue<checksumReader>(r).f)
					if (err1 != null) {
						if ($.comparableEqual(err1, io.EOF)) {
							err = io.ErrUnexpectedEOF
						} else {
							err = err1
						}
					} else {
						if ($.uint(await $.pointerValue<Exclude<hash2.Hash32, null>>($.pointerValue<checksumReader>(r).hash).Sum32(), 32) != $.uint($.pointerValue<File>($.pointerValue<checksumReader>(r).f).FileHeader.CRC32, 32)) {
							err = ErrChecksum
						}
					}
				}
			} else {
				// If there's not a data descriptor, we still compare
				// the CRC32 of what we've read against the file header
				// or TOC's CRC32, if it seems like it was set.
				if (($.uint($.pointerValue<File>($.pointerValue<checksumReader>(r).f).FileHeader.CRC32, 32) != $.uint(0, 32)) && ($.uint(await $.pointerValue<Exclude<hash2.Hash32, null>>($.pointerValue<checksumReader>(r).hash).Sum32(), 32) != $.uint($.pointerValue<File>($.pointerValue<checksumReader>(r).f).FileHeader.CRC32, 32))) {
					err = ErrChecksum
				}
			}
		}
		$.pointerValue<checksumReader>(r).err = err
		return [n, err]
	}

	public Stat(): [fs.FileInfo | null, $.GoError] {
		const r: checksumReader | $.VarRef<checksumReader> | null = this
		return [$.interfaceValue<fs.FileInfo | null>($.markAsStructValue(new __goscript_struct.headerFileInfo({fh: $.pointerValue<File>($.pointerValue<checksumReader>(r).f)._fields.FileHeader})), "zip.headerFileInfo"), null]
	}

	static __typeInfo = $.registerStructType(
		"zip.checksumReader",
		() => new checksumReader(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "Stat", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }],
		checksumReader,
		[{ name: "rc", key: "rc", type: "io.ReadCloser" }, { name: "hash", key: "hash", type: "hash.Hash32" }, { name: "nread", key: "nread", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "f", key: "f", type: { kind: $.TypeKind.Pointer, elemType: "zip.File" } }, { name: "desr", key: "desr", type: "io.Reader" }, { name: "err", key: "err", type: "error" }]
	)
}

export class fileListEntry {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get file(): File | $.VarRef<File> | null {
		return this._fields.file.value
	}
	public set file(value: File | $.VarRef<File> | null) {
		this._fields.file.value = value
	}

	public get isDir(): boolean {
		return this._fields.isDir.value
	}
	public set isDir(value: boolean) {
		this._fields.isDir.value = value
	}

	public get isDup(): boolean {
		return this._fields.isDup.value
	}
	public set isDup(value: boolean) {
		this._fields.isDup.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		file: $.VarRef<File | $.VarRef<File> | null>
		isDir: $.VarRef<boolean>
		isDup: $.VarRef<boolean>
	}

	constructor(init?: Partial<{name?: string, file?: File | $.VarRef<File> | null, isDir?: boolean, isDup?: boolean}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ("" as unknown as string)),
			file: $.varRef(init?.file ?? (null as unknown as File | $.VarRef<File> | null)),
			isDir: $.varRef(init?.isDir ?? (false as unknown as boolean)),
			isDup: $.varRef(init?.isDup ?? (false as unknown as boolean))
		}
	}

	public clone(): fileListEntry {
		const cloned = new fileListEntry()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			file: $.varRef(this._fields.file.value),
			isDir: $.varRef(this._fields.isDir.value),
			isDup: $.varRef(this._fields.isDup.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Info(): [fs.FileInfo | null, $.GoError] {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return [$.interfaceValue<fs.FileInfo | null>(f, "*zip.fileListEntry"), null]
	}

	public IsDir(): boolean {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return true
	}

	public ModTime(): time.Time {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		if ($.pointerValue<fileListEntry>(f).file == null) {
			return $.markAsStructValue(new time.Time())
		}
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<File>($.pointerValue<fileListEntry>(f).file).FileHeader.Modified)).UTC()))
	}

	public Mode(): fs.FileMode {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return $.uint(fs.ModeDir | 0o555, 32)
	}

	public Name(): string {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		let [, elem, ] = split($.pointerValue<fileListEntry>(f).name)
		return elem
	}

	public Size(): bigint {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return 0n
	}

	public String(): string {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return fs.FormatDirEntry($.pointerValueOrNil($.interfaceValue<fs.DirEntry | null>(f, "*zip.fileListEntry"))!)
	}

	public Sys(): any {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return null
	}

	public Type(): fs.FileMode {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		return $.uint(fs.ModeDir, 32)
	}

	public stat(): [fileInfoDirEntry | null, $.GoError] {
		const f: fileListEntry | $.VarRef<fileListEntry> | null = this
		if ($.pointerValue<fileListEntry>(f).isDup) {
			return [null, errors.New($.pointerValue<fileListEntry>(f).name + ": duplicate entries in zip file")]
		}
		if (!$.pointerValue<fileListEntry>(f).isDir) {
			return [$.interfaceValue<fileInfoDirEntry | null>($.markAsStructValue(new __goscript_struct.headerFileInfo({fh: $.pointerValue<File>($.pointerValue<fileListEntry>(f).file)._fields.FileHeader})), "zip.headerFileInfo"), null]
		}
		return [$.interfaceValue<fileInfoDirEntry | null>(f, "*zip.fileListEntry"), null]
	}

	static __typeInfo = $.registerStructType(
		"zip.fileListEntry",
		() => new fileListEntry(),
		[{ name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "stat", args: [], returns: [{ type: "zip.fileInfoDirEntry" }, { type: "error" }] }],
		fileListEntry,
		[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "file", key: "file", type: { kind: $.TypeKind.Pointer, elemType: "zip.File" } }, { name: "isDir", key: "isDir", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "isDup", key: "isDup", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export class openDir {
	public get e(): fileListEntry | $.VarRef<fileListEntry> | null {
		return this._fields.e.value
	}
	public set e(value: fileListEntry | $.VarRef<fileListEntry> | null) {
		this._fields.e.value = value
	}

	public get files(): $.Slice<fileListEntry> {
		return this._fields.files.value
	}
	public set files(value: $.Slice<fileListEntry>) {
		this._fields.files.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public _fields: {
		e: $.VarRef<fileListEntry | $.VarRef<fileListEntry> | null>
		files: $.VarRef<$.Slice<fileListEntry>>
		offset: $.VarRef<number>
	}

	constructor(init?: Partial<{e?: fileListEntry | $.VarRef<fileListEntry> | null, files?: $.Slice<fileListEntry>, offset?: number}>) {
		this._fields = {
			e: $.varRef(init?.e ?? (null as unknown as fileListEntry | $.VarRef<fileListEntry> | null)),
			files: $.varRef(init?.files ?? (null as unknown as $.Slice<fileListEntry>)),
			offset: $.varRef(init?.offset ?? (0 as unknown as number))
		}
	}

	public clone(): openDir {
		const cloned = new openDir()
		cloned._fields = {
			e: $.varRef(this._fields.e.value),
			files: $.varRef(this._fields.files.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const d: openDir | $.VarRef<openDir> | null = this
		return null
	}

	public Read(_p0: $.Slice<number>): [number, $.GoError] {
		const d: openDir | $.VarRef<openDir> | null = this
		return [0, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField9 = errors.New("is a directory"); return new fs.PathError({Op: "read", Path: $.pointerValue<fileListEntry>($.pointerValue<openDir>(d).e).name, Err: __goscriptLiteralField9}) })(), "*fs.PathError")]
	}

	public async ReadDir(count: number): globalThis.Promise<[$.Slice<fs.DirEntry | null>, $.GoError]> {
		let d: openDir | $.VarRef<openDir> | null = this
		let n = $.len($.pointerValue<openDir>(d).files) - $.pointerValue<openDir>(d).offset
		if ((count > 0) && (n > count)) {
			n = count
		}
		if (n == 0) {
			if (count <= 0) {
				return [null, null]
			}
			return [null, io.EOF]
		}
		let list: $.Slice<fs.DirEntry | null> = $.makeSlice<fs.DirEntry | null>(n)
		for (let __goscriptRangeTarget3 = list, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
			let [s, err] = $.pointerValue<openDir>(d).files![$.pointerValue<openDir>(d).offset + i].stat()
			if (err != null) {
				return [null, err]
			} else {
				if (($.stringEqual(await $.pointerValue<Exclude<fileInfoDirEntry, null>>(s).Name(), ".")) || !fs.ValidPath(await $.pointerValue<Exclude<fileInfoDirEntry, null>>(s).Name())) {
					return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField10 = fmt.Errorf("invalid file name: %v", $.pointerValue<openDir>(d).files![$.pointerValue<openDir>(d).offset + i].name); return new fs.PathError({Op: "readdir", Path: $.pointerValue<fileListEntry>($.pointerValue<openDir>(d).e).name, Err: __goscriptLiteralField10}) })(), "*fs.PathError")]
				}
			}
			list![i] = (s as fs.DirEntry | null)
		}
		$.pointerValue<openDir>(d).offset = $.pointerValue<openDir>(d).offset + (n)
		return [list, null]
	}

	public Stat(): [fs.FileInfo | null, $.GoError] {
		const d: openDir | $.VarRef<openDir> | null = this
		const __goscriptReturn0 = fileListEntry.prototype.stat.call($.pointerValue<openDir>(d).e)
		return [(__goscriptReturn0[0] as fs.FileInfo | null), __goscriptReturn0[1]]
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"zip.openDir",
		() => new openDir(),
		[{ name: "Close", args: [], returns: [{ type: "error" }] }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }, { name: "ReadDir", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "fs.DirEntry" } }, { type: "error" }] }, { name: "Stat", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }],
		openDir,
		[{ name: "e", key: "e", type: { kind: $.TypeKind.Pointer, elemType: "zip.fileListEntry" } }, { name: "files", key: "files", type: { kind: $.TypeKind.Slice, elemType: "zip.fileListEntry" } }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export let zipinsecurepath: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("zipinsecurepath")

export function __goscript_set_zipinsecurepath(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	zipinsecurepath = __goscriptValue
}

export let ErrFormat: $.GoError = errors.New("zip: not a valid zip file")

export function __goscript_set_ErrFormat(__goscriptValue: $.GoError): void {
	ErrFormat = __goscriptValue
}

export let ErrAlgorithm: $.GoError = errors.New("zip: unsupported compression algorithm")

export function __goscript_set_ErrAlgorithm(__goscriptValue: $.GoError): void {
	ErrAlgorithm = __goscriptValue
}

export let ErrChecksum: $.GoError = errors.New("zip: checksum error")

export function __goscript_set_ErrChecksum(__goscriptValue: $.GoError): void {
	ErrChecksum = __goscriptValue
}

export let ErrInsecurePath: $.GoError = errors.New("zip: insecure file path")

export function __goscript_set_ErrInsecurePath(__goscriptValue: $.GoError): void {
	ErrInsecurePath = __goscriptValue
}

export async function OpenReader(name: string): globalThis.Promise<[ReadCloser | $.VarRef<ReadCloser> | null, $.GoError]> {
	let __goscriptTuple3: any = os.Open(name)
	let f: os.File | $.VarRef<os.File> | null = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple4: any = os.File.prototype.Stat.call($.pointerValue<os.File>(f))
	let fi = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		os.File.prototype.Close.call($.pointerValue<os.File>(f))
		return [null, err]
	}
	let r: ReadCloser | $.VarRef<ReadCloser> | null = new ReadCloser()
	{
		err = await $.pointerValue<ReadCloser>(r).Reader.init($.interfaceValue<io.ReaderAt | null>(f, "*os.File"), await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).Size())
		if ((err != null) && (!$.comparableEqual(err, ErrInsecurePath))) {
			os.File.prototype.Close.call($.pointerValue<os.File>(f))
			return [null, err]
		}
	}
	$.pointerValue<ReadCloser>(r).f = f
	return [r, err]
}

export async function NewReader(r: io.ReaderAt | null, size: bigint): globalThis.Promise<[Reader | $.VarRef<Reader> | null, $.GoError]> {
	if (size < 0) {
		return [null, errors.New("zip: size cannot be negative")]
	}
	let zr: Reader | $.VarRef<Reader> | null = new Reader()
	let err: $.GoError = null as $.GoError
	{
		err = await Reader.prototype.init.call(zr, r, size)
		if ((err != null) && (!$.comparableEqual(err, ErrInsecurePath))) {
			return [null, err]
		}
	}
	return [zr, err]
}

export async function readDirectoryHeader(f: File | $.VarRef<File> | null, r: io.Reader | null): globalThis.Promise<$.GoError> {
	let buf: Uint8Array = new Uint8Array(46)
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, $.goSlice(buf, undefined, undefined))
		if (err != null) {
			return err
		}
	}
	let b: $.VarRef<readBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as readBuf) as readBuf))
	{
		let sig = $.uint(readBuf_uint32(b), 32)
		if ($.uint(sig, 32) != $.uint(33639248, 32)) {
			return ErrFormat
		}
	}
	$.pointerValue<File>(f).FileHeader.CreatorVersion = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.ReaderVersion = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.Flags = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.Method = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.ModifiedTime = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.ModifiedDate = $.uint(readBuf_uint16(b), 16)
	$.pointerValue<File>(f).FileHeader.CRC32 = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<File>(f).FileHeader.CompressedSize = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<File>(f).FileHeader.UncompressedSize = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<File>(f).FileHeader.CompressedSize64 = $.uint64($.pointerValue<File>(f).FileHeader.CompressedSize)
	$.pointerValue<File>(f).FileHeader.UncompressedSize64 = $.uint64($.pointerValue<File>(f).FileHeader.UncompressedSize)
	let filenameLen = $.int(readBuf_uint16(b))
	let extraLen = $.int(readBuf_uint16(b))
	let commentLen = $.int(readBuf_uint16(b))
	b.value = ($.goSlice(b.value, 4, undefined) as readBuf)
	$.pointerValue<File>(f).FileHeader.ExternalAttrs = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<File>(f).headerOffset = $.int64(readBuf_uint32(b))
	let d: $.Slice<number> = $.makeSlice<number>((filenameLen + extraLen) + commentLen, undefined, "byte")
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, d)
		if (err != null) {
			return err
		}
	}
	$.pointerValue<File>(f).FileHeader.Name = $.bytesToString($.goSlice(d, undefined, filenameLen))
	$.pointerValue<File>(f).FileHeader.Extra = $.goSlice(d, filenameLen, filenameLen + extraLen)
	$.pointerValue<File>(f).FileHeader.Comment = $.bytesToString($.goSlice(d, filenameLen + extraLen, undefined))

	// Determine the character encoding.
	let [utf8Valid1, utf8Require1] = __goscript_writer.detectUTF8($.pointerValue<File>(f).FileHeader.Name)
	let [utf8Valid2, utf8Require2] = __goscript_writer.detectUTF8($.pointerValue<File>(f).FileHeader.Comment)
	switch (true) {
		case !utf8Valid1 || !utf8Valid2:
		{
			$.pointerValue<File>(f).FileHeader.NonUTF8 = true
			break
		}
		case !utf8Require1 && !utf8Require2:
		{
			$.pointerValue<File>(f).FileHeader.NonUTF8 = false
			break
		}
		default:
		{
			$.pointerValue<File>(f).FileHeader.NonUTF8 = $.uint(($.pointerValue<File>(f).FileHeader.Flags & 0x800), 16) == $.uint(0, 16)
			break
		}
	}

	let needUSize = $.uint($.pointerValue<File>(f).FileHeader.UncompressedSize, 32) == $.uint($.uint(~$.uint(0, 32), 32), 32)
	let needCSize = $.uint($.pointerValue<File>(f).FileHeader.CompressedSize, 32) == $.uint($.uint(~$.uint(0, 32), 32), 32)
	let needHeaderOffset = $.pointerValue<File>(f).headerOffset == 4294967295n

	// Best effort to find what we need.
	// Other zip authors might not even follow the basic format,
	// and we'll just ignore the Extra content in that case.
	let modified: time.Time = $.markAsStructValue(new time.Time())
	parseExtras: for (let extra: $.VarRef<readBuf> = $.varRef((($.pointerValue<File>(f).FileHeader.Extra as readBuf) as readBuf)); $.len((extra.value as readBuf)) >= 4; ) {
		let fieldTag = $.uint(readBuf_uint16(extra), 16)
		let fieldSize = $.int(readBuf_uint16(extra))
		if ($.len((extra.value as readBuf)) < fieldSize) {
			break
		}
		let fieldBuf: $.VarRef<readBuf> = $.varRef((readBuf_sub(extra, fieldSize) as readBuf))

		switch (fieldTag) {
			case 1:
			{
				$.pointerValue<File>(f).zip64 = true

				// update directory values from the zip64 extra block.
				// They should only be consulted if the sizes read earlier
				// are maxed out.
				// See golang.org/issue/13367.
				if (needUSize) {
					needUSize = false
					if ($.len((fieldBuf.value as readBuf)) < 8) {
						return ErrFormat
					}
					$.pointerValue<File>(f).FileHeader.UncompressedSize64 = readBuf_uint64(fieldBuf)
				}
				if (needCSize) {
					needCSize = false
					if ($.len((fieldBuf.value as readBuf)) < 8) {
						return ErrFormat
					}
					$.pointerValue<File>(f).FileHeader.CompressedSize64 = readBuf_uint64(fieldBuf)
				}
				if (needHeaderOffset) {
					needHeaderOffset = false
					if ($.len((fieldBuf.value as readBuf)) < 8) {
						return ErrFormat
					}
					$.pointerValue<File>(f).headerOffset = $.int64(readBuf_uint64(fieldBuf))
				}
				break
			}
			case 10:
			{
				if ($.len((fieldBuf.value as readBuf)) < 4) {
					continue parseExtras
				}
				readBuf_uint32(fieldBuf)
				while ($.len((fieldBuf.value as readBuf)) >= 4) {
					let attrTag = $.uint(readBuf_uint16(fieldBuf), 16)
					let attrSize = $.int(readBuf_uint16(fieldBuf))
					if ($.len((fieldBuf.value as readBuf)) < attrSize) {
						continue parseExtras
					}
					let attrBuf: $.VarRef<readBuf> = $.varRef((readBuf_sub(fieldBuf, attrSize) as readBuf))
					if (($.uint(attrTag, 16) != $.uint(1, 16)) || (attrSize != 24)) {
						continue
					}

					const ticksPerSecond: number = 10000000
					let ts = $.int64(readBuf_uint64(attrBuf))
					let secs = $.int64Div(ts, 10000000)
					let nsecs = $.int64Mul(($.int64Div(1e9, 10000000)), ($.int64Mod(ts, 10000000)))
					let epoch = $.markAsStructValue($.cloneStructValue(time.Date(1601, time.January, 1, 0, 0, 0, 0, time.UTC)))
					modified = $.markAsStructValue($.cloneStructValue(time.Unix($.int64Add($.markAsStructValue($.cloneStructValue(epoch)).Unix(), secs), nsecs)))
				}
				break
			}
			case 13:
			case 22613:
			{
				if ($.len((fieldBuf.value as readBuf)) < 8) {
					continue parseExtras
				}
				readBuf_uint32(fieldBuf)
				let ts = $.int64(readBuf_uint32(fieldBuf))
				modified = $.markAsStructValue($.cloneStructValue(time.Unix(ts, 0n)))
				break
			}
			case 21589:
			{
				if (($.len((fieldBuf.value as readBuf)) < 5) || ($.uint((readBuf_uint8(fieldBuf) & 1), 8) == $.uint(0, 8))) {
					continue parseExtras
				}
				let ts = $.int64(readBuf_uint32(fieldBuf))
				modified = $.markAsStructValue($.cloneStructValue(time.Unix(ts, 0n)))
				break
			}
		}
	}

	let msdosModified = $.markAsStructValue($.cloneStructValue(__goscript_struct.msDosTimeToTime($.uint($.pointerValue<File>(f).FileHeader.ModifiedDate, 16), $.uint($.pointerValue<File>(f).FileHeader.ModifiedTime, 16))))
	$.pointerValue<File>(f).FileHeader.Modified = $.markAsStructValue($.cloneStructValue(msdosModified))
	if (!$.markAsStructValue($.cloneStructValue(modified)).IsZero()) {
		$.pointerValue<File>(f).FileHeader.Modified = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(modified)).UTC()))

		// If legacy MS-DOS timestamps are set, we can use the delta between
		// the legacy and extended versions to estimate timezone offset.
		//
		// A non-UTC timezone is always used (even if offset is zero).
		// Thus, FileHeader.Modified.Location() == time.UTC is useful for
		// determining whether extended timestamps are present.
		// This is necessary for users that need to do additional time
		// calculations when dealing with legacy ZIP formats.
		if (($.uint($.pointerValue<File>(f).FileHeader.ModifiedTime, 16) != $.uint(0, 16)) || ($.uint($.pointerValue<File>(f).FileHeader.ModifiedDate, 16) != $.uint(0, 16))) {
			$.pointerValue<File>(f).FileHeader.Modified = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(modified)).In(__goscript_struct.timeZone($.markAsStructValue($.cloneStructValue(msdosModified)).Sub($.markAsStructValue($.cloneStructValue(modified)))))))
		}
	}

	// Assume that uncompressed size 2³²-1 could plausibly happen in
	// an old zip32 file that was sharding inputs into the largest chunks
	// possible (or is just malicious; search the web for 42.zip).
	// If needUSize is true still, it means we didn't see a zip64 extension.
	// As long as the compressed size is not also 2³²-1 (implausible)
	// and the header is not also 2³²-1 (equally implausible),
	// accept the uncompressed size 2³²-1 as valid.
	// If nothing else, this keeps archive/zip working with 42.zip.
	needUSize

	if (needCSize || needHeaderOffset) {
		return ErrFormat
	}

	return null
}

export async function readDataDescriptor(r: io.Reader | null, f: File | $.VarRef<File> | null): globalThis.Promise<$.GoError> {
	let buf: Uint8Array = new Uint8Array(16)
	// The spec says: "Although not originally assigned a
	// signature, the value 0x08074b50 has commonly been adopted
	// as a signature value for the data descriptor record.
	// Implementers should be aware that ZIP files may be
	// encountered with or without this signature marking data
	// descriptors and should account for either case when reading
	// ZIP files to ensure compatibility."
	//
	// dataDescriptorLen includes the size of the signature but
	// first read just those 4 bytes to see if it exists.
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, $.goSlice(buf, undefined, 4))
		if (err != null) {
			return err
		}
	}
	let off = 0
	let maybeSig: $.VarRef<readBuf> = $.varRef((($.goSlice(buf, undefined, 4) as readBuf) as readBuf))
	if ($.uint(readBuf_uint32(maybeSig), 32) != $.uint(134695760, 32)) {
		// No data descriptor signature. Keep these four
		// bytes.
		off = off + (4)
	}
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, $.goSlice(buf, off, 12))
		if (err != null) {
			return err
		}
	}
	let b: $.VarRef<readBuf> = $.varRef((($.goSlice(buf, undefined, 12) as readBuf) as readBuf))
	if ($.uint(readBuf_uint32(b), 32) != $.uint($.pointerValue<File>(f).FileHeader.CRC32, 32)) {
		return ErrChecksum
	}

	// The two sizes that follow here can be either 32 bits or 64 bits
	// but the spec is not very clear on this and different
	// interpretations has been made causing incompatibilities. We
	// already have the sizes from the central directory so we can
	// just ignore these.

	return null
}

export async function readDirectoryEnd(r: io.ReaderAt | null, size: bigint): globalThis.Promise<[__goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null, bigint, $.GoError]> {
	let dir: __goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null = null as __goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null
	let baseOffset: bigint = 0n
	let err: $.GoError = null as $.GoError
	// look for directoryEndSignature in the last 1k, then in the last 65k
	let buf: $.Slice<number> = null as $.Slice<number>
	let directoryEndOffset: bigint = 0n
	for (let __goscriptRangeTarget2 = $.arrayToSlice<bigint>([1024n, 66560n]), i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let bLen = __goscriptRangeTarget2![i]
		if (bLen > size) {
			bLen = size
		}
		buf = $.makeSlice<number>($.int(bLen), undefined, "byte")
		{
			let [, __goscriptShadow1] = await $.pointerValue<Exclude<io.ReaderAt, null>>(r).ReadAt(buf, $.int64Sub(size, bLen))
			if ((__goscriptShadow1 != null) && (!$.comparableEqual(__goscriptShadow1, io.EOF))) {
				return [null, 0n, __goscriptShadow1]
			}
		}
		{
			let p = findSignatureInBlock(buf)
			if (p >= 0) {
				buf = $.goSlice(buf, p, undefined)
				directoryEndOffset = $.int64Add(($.int64Sub(size, bLen)), $.int64(p))
				break
			}
		}
		if ((i == 1) || (bLen == size)) {
			return [null, 0n, ErrFormat]
		}
	}

	// read header into struct
	let b: $.VarRef<readBuf> = $.varRef((($.goSlice(buf, 4, undefined) as readBuf) as readBuf))
	let d: __goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null = (() => { const __goscriptLiteralField2 = $.uint($.uint(readBuf_uint16(b), 32), 32); const __goscriptLiteralField3 = $.uint($.uint(readBuf_uint16(b), 32), 32); const __goscriptLiteralField4 = $.uint64(readBuf_uint16(b)); const __goscriptLiteralField5 = $.uint64(readBuf_uint16(b)); const __goscriptLiteralField6 = $.uint64(readBuf_uint32(b)); const __goscriptLiteralField7 = $.uint64(readBuf_uint32(b)); const __goscriptLiteralField8 = $.uint(readBuf_uint16(b), 16); return new __goscript_struct.directoryEnd({diskNbr: __goscriptLiteralField2, dirDiskNbr: __goscriptLiteralField3, dirRecordsThisDisk: __goscriptLiteralField4, directoryRecords: __goscriptLiteralField5, directorySize: __goscriptLiteralField6, directoryOffset: __goscriptLiteralField7, commentLen: __goscriptLiteralField8}) })()
	let l = $.int($.pointerValue<__goscript_struct.directoryEnd>(d).commentLen)
	if (l > $.len((b.value as readBuf))) {
		return [null, 0n, errors.New("zip: invalid comment length")]
	}
	$.pointerValue<__goscript_struct.directoryEnd>(d).comment = $.bytesToString($.goSlice(b.value, undefined, l))

	// These values mean that the file can be a zip64 file
	if ((($.pointerValue<__goscript_struct.directoryEnd>(d).directoryRecords == 65535n) || ($.pointerValue<__goscript_struct.directoryEnd>(d).directorySize == 65535n)) || ($.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset == 4294967295n)) {
		let [p, __goscriptShadow2] = await findDirectory64End(r, directoryEndOffset)
		if ((__goscriptShadow2 == null) && (p >= 0)) {
			directoryEndOffset = p
			__goscriptShadow2 = await readDirectory64End(r, p, d)
		}
		if (__goscriptShadow2 != null) {
			return [null, 0n, __goscriptShadow2]
		}
	}

	let maxInt64 = 9223372036854775807n
	if (($.pointerValue<__goscript_struct.directoryEnd>(d).directorySize > maxInt64) || ($.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset > maxInt64)) {
		return [null, 0n, ErrFormat]
	}

	baseOffset = $.int64Sub(($.int64Sub(directoryEndOffset, $.int64($.pointerValue<__goscript_struct.directoryEnd>(d).directorySize))), $.int64($.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset))

	// Make sure directoryOffset points to somewhere in our file.
	{
		let o = $.int64Add(baseOffset, $.int64($.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset))
		if ((o < 0) || (o >= size)) {
			return [null, 0n, ErrFormat]
		}
	}

	// If the directory end data tells us to use a non-zero baseOffset,
	// but we would find a valid directory entry if we assume that the
	// baseOffset is 0, then just use a baseOffset of 0.
	// We've seen files in which the directory end data gives us
	// an incorrect baseOffset.
	if (baseOffset > 0) {
		let off = $.int64($.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset)
		let rs: io.SectionReader | $.VarRef<io.SectionReader> | null = io.NewSectionReader($.pointerValueOrNil(r)!, off, $.int64Sub(size, off))
		if (await readDirectoryHeader(new File(), $.interfaceValue<io.Reader | null>(rs, "*io.SectionReader")) == null) {
			baseOffset = 0n
		}
	}

	return [d, baseOffset, null]
}

export async function findDirectory64End(r: io.ReaderAt | null, directoryEndOffset: bigint): globalThis.Promise<[bigint, $.GoError]> {
	let locOffset = $.int64Sub(directoryEndOffset, 20)
	if (locOffset < 0) {
		return [-1n, null]
	}
	let buf: $.Slice<number> = $.makeSlice<number>(20, undefined, "byte")
	{
		let [, err] = await $.pointerValue<Exclude<io.ReaderAt, null>>(r).ReadAt(buf, locOffset)
		if (err != null) {
			return [-1n, err]
		}
	}
	let b: $.VarRef<readBuf> = $.varRef(((buf as readBuf) as readBuf))
	{
		let sig = $.uint(readBuf_uint32(b), 32)
		if ($.uint(sig, 32) != $.uint(117853008, 32)) {
			return [-1n, null]
		}
	}
	if ($.uint(readBuf_uint32(b), 32) != $.uint(0, 32)) {
		return [-1n, null]
	}
	let p = readBuf_uint64(b)
	if ($.uint(readBuf_uint32(b), 32) != $.uint(1, 32)) {
		return [-1n, null]
	}
	return [$.int64(p), null]
}

export async function readDirectory64End(r: io.ReaderAt | null, offset: bigint, d: __goscript_struct.directoryEnd | $.VarRef<__goscript_struct.directoryEnd> | null): globalThis.Promise<$.GoError> {
	let err: $.GoError = null as $.GoError
	let buf: $.Slice<number> = $.makeSlice<number>(56, undefined, "byte")
	{
		let [, __goscriptShadow3] = await $.pointerValue<Exclude<io.ReaderAt, null>>(r).ReadAt(buf, offset)
		if (__goscriptShadow3 != null) {
			return __goscriptShadow3
		}
	}

	let b: $.VarRef<readBuf> = $.varRef(((buf as readBuf) as readBuf))
	{
		let sig = $.uint(readBuf_uint32(b), 32)
		if ($.uint(sig, 32) != $.uint(101075792, 32)) {
			return ErrFormat
		}
	}

	b.value = ($.goSlice(b.value, 12, undefined) as readBuf)
	$.pointerValue<__goscript_struct.directoryEnd>(d).diskNbr = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<__goscript_struct.directoryEnd>(d).dirDiskNbr = $.uint(readBuf_uint32(b), 32)
	$.pointerValue<__goscript_struct.directoryEnd>(d).dirRecordsThisDisk = readBuf_uint64(b)
	$.pointerValue<__goscript_struct.directoryEnd>(d).directoryRecords = readBuf_uint64(b)
	$.pointerValue<__goscript_struct.directoryEnd>(d).directorySize = readBuf_uint64(b)
	$.pointerValue<__goscript_struct.directoryEnd>(d).directoryOffset = readBuf_uint64(b)

	return null
}

export function findSignatureInBlock(b: $.Slice<number>): number {
	for (let i = $.len(b) - 22; i >= 0; i--) {
		// defined from directoryEndSignature in struct.go
		if (((($.uint(b![i], 8) == $.uint(80, 8)) && ($.uint(b![i + 1], 8) == $.uint(75, 8))) && ($.uint(b![i + 2], 8) == $.uint(0x05, 8))) && ($.uint(b![i + 3], 8) == $.uint(0x06, 8))) {
			// n is length of comment
			let n = $.int(b![(i + 22) - 2]) | ($.int(b![(i + 22) - 1]) << 8)
			if (((n + 22) + i) > $.len(b)) {
				// Truncated comment.
				// Some parsers (such as Info-ZIP) ignore the truncated comment
				// rather than treating it as a hard error.
				return -1
			}
			return i
		}
	}
	return -1
}

export type readBuf = $.Slice<number>

export function readBuf_uint8(b: $.VarRef<readBuf> | null): number {
	let v = $.uint(($.pointerValue<readBuf>(b))![0], 8)
	b!.value = ($.goSlice(($.pointerValue<readBuf>(b)), 1, undefined) as readBuf)
	return $.uint(v, 8)
}

export function readBuf_uint16(b: $.VarRef<readBuf> | null): number {
	let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint16($.pointerValue<readBuf>(b)), 16)
	b!.value = ($.goSlice(($.pointerValue<readBuf>(b)), 2, undefined) as readBuf)
	return $.uint(v, 16)
}

export function readBuf_uint32(b: $.VarRef<readBuf> | null): number {
	let v = $.uint($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint32($.pointerValue<readBuf>(b)), 32)
	b!.value = ($.goSlice(($.pointerValue<readBuf>(b)), 4, undefined) as readBuf)
	return $.uint(v, 32)
}

export function readBuf_uint64(b: $.VarRef<readBuf> | null): bigint {
	let v = $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.pointerValue<readBuf>(b))
	b!.value = ($.goSlice(($.pointerValue<readBuf>(b)), 8, undefined) as readBuf)
	return v
}

export function readBuf_sub(b: $.VarRef<readBuf> | null, n: number): readBuf {
	let b2: readBuf = ($.goSlice(($.pointerValue<readBuf>(b)), undefined, n) as readBuf)
	b!.value = ($.goSlice(($.pointerValue<readBuf>(b)), n, undefined) as readBuf)
	return (b2 as readBuf)
}

export type fileInfoDirEntry = {
	Info(): [fs.FileInfo | null, $.GoError]
	IsDir(): boolean
	ModTime(): time.Time
	Mode(): fs.FileMode
	Name(): string
	Size(): bigint
	Sys(): any
	Type(): fs.FileMode
}

$.registerInterfaceType(
	"zip.fileInfoDirEntry",
	null,
	[{ name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }]
);

export function toValidName(name: string): string {
	name = strings.ReplaceAll(name, "\\", "/")
	let p = path.Clean(name)

	p = strings.TrimPrefix(p, "/")

	while (strings.HasPrefix(p, "../")) {
		p = $.sliceStringOrBytes(p, 3, undefined)
	}

	return p
}

export function fileEntryCompare(x: string, y: string): number {
	let [xdir, xelem, ] = split(x)
	let [ydir, yelem, ] = split(y)
	if (!$.stringEqual(xdir, ydir)) {
		return strings.Compare(xdir, ydir)
	}
	return strings.Compare(xelem, yelem)
}

export function split(name: string): [string, string, boolean] {
	let dir: string = ""
	let elem: string = ""
	let isDir: boolean = false
	let __goscriptTuple6: any = strings.CutSuffix(name, "/")
	name = __goscriptTuple6[0]
	isDir = __goscriptTuple6[1]
	let i = strings.LastIndexByte(name, $.uint(47, 8))
	if (i < 0) {
		return [".", name, isDir]
	}
	return [$.sliceStringOrBytes(name, undefined, i), $.sliceStringOrBytes(name, i + 1, undefined), isDir]
}

export let dotFile: fileListEntry | $.VarRef<fileListEntry> | null = new fileListEntry({name: "./", isDir: true})

export function __goscript_set_dotFile(__goscriptValue: fileListEntry | $.VarRef<fileListEntry> | null): void {
	dotFile = __goscriptValue
}
