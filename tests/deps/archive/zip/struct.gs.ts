// Generated file based on struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as path from "@goscript/path/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/path/index.js"
import "@goscript/time/index.js"

export class FileHeader {
	// Name is the name of the file.
	//
	// It must be a relative path, not start with a drive letter (such as "C:"),
	// and must use forward slashes instead of back slashes. A trailing slash
	// indicates that this file is a directory and should have no data.
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	// Comment is any arbitrary user-defined string shorter than 64KiB.
	public get Comment(): string {
		return this._fields.Comment.value
	}
	public set Comment(value: string) {
		this._fields.Comment.value = value
	}

	// NonUTF8 indicates that Name and Comment are not encoded in UTF-8.
	//
	// By specification, the only other encoding permitted should be CP-437,
	// but historically many ZIP readers interpret Name and Comment as whatever
	// the system's local character encoding happens to be.
	//
	// This flag should only be set if the user intends to encode a non-portable
	// ZIP file for a specific localized region. Otherwise, the Writer
	// automatically sets the ZIP format's UTF-8 flag for valid UTF-8 strings.
	public get NonUTF8(): boolean {
		return this._fields.NonUTF8.value
	}
	public set NonUTF8(value: boolean) {
		this._fields.NonUTF8.value = value
	}

	public get CreatorVersion(): number {
		return this._fields.CreatorVersion.value
	}
	public set CreatorVersion(value: number) {
		this._fields.CreatorVersion.value = value
	}

	public get ReaderVersion(): number {
		return this._fields.ReaderVersion.value
	}
	public set ReaderVersion(value: number) {
		this._fields.ReaderVersion.value = value
	}

	public get Flags(): number {
		return this._fields.Flags.value
	}
	public set Flags(value: number) {
		this._fields.Flags.value = value
	}

	// Method is the compression method. If zero, Store is used.
	public get Method(): number {
		return this._fields.Method.value
	}
	public set Method(value: number) {
		this._fields.Method.value = value
	}

	// Modified is the modified time of the file.
	//
	// When reading, an extended timestamp is preferred over the legacy MS-DOS
	// date field, and the offset between the times is used as the timezone.
	// If only the MS-DOS date is present, the timezone is assumed to be UTC.
	//
	// When writing, an extended timestamp (which is timezone-agnostic) is
	// always emitted. The legacy MS-DOS date field is encoded according to the
	// location of the Modified time.
	public get Modified(): time.Time {
		return this._fields.Modified.value
	}
	public set Modified(value: time.Time) {
		this._fields.Modified.value = value
	}

	// ModifiedTime is an MS-DOS-encoded time.
	//
	// Deprecated: Use Modified instead.
	public get ModifiedTime(): number {
		return this._fields.ModifiedTime.value
	}
	public set ModifiedTime(value: number) {
		this._fields.ModifiedTime.value = value
	}

	// ModifiedDate is an MS-DOS-encoded date.
	//
	// Deprecated: Use Modified instead.
	public get ModifiedDate(): number {
		return this._fields.ModifiedDate.value
	}
	public set ModifiedDate(value: number) {
		this._fields.ModifiedDate.value = value
	}

	// CRC32 is the CRC32 checksum of the file content.
	public get CRC32(): number {
		return this._fields.CRC32.value
	}
	public set CRC32(value: number) {
		this._fields.CRC32.value = value
	}

	// CompressedSize is the compressed size of the file in bytes.
	// If either the uncompressed or compressed size of the file
	// does not fit in 32 bits, CompressedSize is set to ^uint32(0).
	//
	// Deprecated: Use CompressedSize64 instead.
	public get CompressedSize(): number {
		return this._fields.CompressedSize.value
	}
	public set CompressedSize(value: number) {
		this._fields.CompressedSize.value = value
	}

	// UncompressedSize is the uncompressed size of the file in bytes.
	// If either the uncompressed or compressed size of the file
	// does not fit in 32 bits, UncompressedSize is set to ^uint32(0).
	//
	// Deprecated: Use UncompressedSize64 instead.
	public get UncompressedSize(): number {
		return this._fields.UncompressedSize.value
	}
	public set UncompressedSize(value: number) {
		this._fields.UncompressedSize.value = value
	}

	// CompressedSize64 is the compressed size of the file in bytes.
	public get CompressedSize64(): bigint {
		return this._fields.CompressedSize64.value
	}
	public set CompressedSize64(value: bigint) {
		this._fields.CompressedSize64.value = value
	}

	// UncompressedSize64 is the uncompressed size of the file in bytes.
	public get UncompressedSize64(): bigint {
		return this._fields.UncompressedSize64.value
	}
	public set UncompressedSize64(value: bigint) {
		this._fields.UncompressedSize64.value = value
	}

	public get Extra(): $.Slice<number> {
		return this._fields.Extra.value
	}
	public set Extra(value: $.Slice<number>) {
		this._fields.Extra.value = value
	}

	public get ExternalAttrs(): number {
		return this._fields.ExternalAttrs.value
	}
	public set ExternalAttrs(value: number) {
		this._fields.ExternalAttrs.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Comment: $.VarRef<string>
		NonUTF8: $.VarRef<boolean>
		CreatorVersion: $.VarRef<number>
		ReaderVersion: $.VarRef<number>
		Flags: $.VarRef<number>
		Method: $.VarRef<number>
		Modified: $.VarRef<time.Time>
		ModifiedTime: $.VarRef<number>
		ModifiedDate: $.VarRef<number>
		CRC32: $.VarRef<number>
		CompressedSize: $.VarRef<number>
		UncompressedSize: $.VarRef<number>
		CompressedSize64: $.VarRef<bigint>
		UncompressedSize64: $.VarRef<bigint>
		Extra: $.VarRef<$.Slice<number>>
		ExternalAttrs: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Comment?: string, NonUTF8?: boolean, CreatorVersion?: number, ReaderVersion?: number, Flags?: number, Method?: number, Modified?: time.Time, ModifiedTime?: number, ModifiedDate?: number, CRC32?: number, CompressedSize?: number, UncompressedSize?: number, CompressedSize64?: bigint, UncompressedSize64?: bigint, Extra?: $.Slice<number>, ExternalAttrs?: number}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ("" as string)),
			Comment: $.varRef(init?.Comment ?? ("" as string)),
			NonUTF8: $.varRef(init?.NonUTF8 ?? (false as boolean)),
			CreatorVersion: $.varRef(init?.CreatorVersion ?? (0 as number)),
			ReaderVersion: $.varRef(init?.ReaderVersion ?? (0 as number)),
			Flags: $.varRef(init?.Flags ?? (0 as number)),
			Method: $.varRef(init?.Method ?? (0 as number)),
			Modified: $.varRef(init?.Modified ? $.markAsStructValue($.cloneStructValue(init.Modified)) : $.markAsStructValue(new time.Time())),
			ModifiedTime: $.varRef(init?.ModifiedTime ?? (0 as number)),
			ModifiedDate: $.varRef(init?.ModifiedDate ?? (0 as number)),
			CRC32: $.varRef(init?.CRC32 ?? (0 as number)),
			CompressedSize: $.varRef(init?.CompressedSize ?? (0 as number)),
			UncompressedSize: $.varRef(init?.UncompressedSize ?? (0 as number)),
			CompressedSize64: $.varRef(init?.CompressedSize64 ?? (0n as bigint)),
			UncompressedSize64: $.varRef(init?.UncompressedSize64 ?? (0n as bigint)),
			Extra: $.varRef(init?.Extra ?? (null as $.Slice<number>)),
			ExternalAttrs: $.varRef(init?.ExternalAttrs ?? (0 as number))
		}
	}

	public clone(): FileHeader {
		const cloned = new FileHeader()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Comment: $.varRef(this._fields.Comment.value),
			NonUTF8: $.varRef(this._fields.NonUTF8.value),
			CreatorVersion: $.varRef(this._fields.CreatorVersion.value),
			ReaderVersion: $.varRef(this._fields.ReaderVersion.value),
			Flags: $.varRef(this._fields.Flags.value),
			Method: $.varRef(this._fields.Method.value),
			Modified: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Modified.value))),
			ModifiedTime: $.varRef(this._fields.ModifiedTime.value),
			ModifiedDate: $.varRef(this._fields.ModifiedDate.value),
			CRC32: $.varRef(this._fields.CRC32.value),
			CompressedSize: $.varRef(this._fields.CompressedSize.value),
			UncompressedSize: $.varRef(this._fields.UncompressedSize.value),
			CompressedSize64: $.varRef(this._fields.CompressedSize64.value),
			UncompressedSize64: $.varRef(this._fields.UncompressedSize64.value),
			Extra: $.varRef(this._fields.Extra.value),
			ExternalAttrs: $.varRef(this._fields.ExternalAttrs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public FileInfo(): fs.FileInfo | null {
		const h: FileHeader | $.VarRef<FileHeader> | null = this
		return $.interfaceValue<fs.FileInfo | null>($.markAsStructValue(new headerFileInfo({fh: h})), "zip.headerFileInfo")
	}

	public ModTime(): time.Time {
		const h: FileHeader | $.VarRef<FileHeader> | null = this
		return $.markAsStructValue($.cloneStructValue(msDosTimeToTime($.uint($.pointerValue<FileHeader>(h).ModifiedDate, 16), $.uint($.pointerValue<FileHeader>(h).ModifiedTime, 16))))
	}

	public Mode(): fs.FileMode {
		const h: FileHeader | $.VarRef<FileHeader> | null = this
		let mode: fs.FileMode = 0
		switch ($.uintShr($.pointerValue<FileHeader>(h).CreatorVersion, 8, 16)) {
			case 3:
			case 19:
			{
				mode = $.uint(unixModeToFileMode($.uint($.uintShr($.pointerValue<FileHeader>(h).ExternalAttrs, 16, 32), 32)), 32)
				break
			}
			case 11:
			case 14:
			case 0:
			{
				mode = $.uint(msdosModeToFileMode($.uint($.pointerValue<FileHeader>(h).ExternalAttrs, 32)), 32)
				break
			}
		}
		if (($.len($.pointerValue<FileHeader>(h).Name) > 0) && ($.uint($.indexStringOrBytes($.pointerValue<FileHeader>(h).Name, $.len($.pointerValue<FileHeader>(h).Name) - 1), 8) == $.uint(47, 8))) {
			mode = mode | ($.uint(fs.ModeDir, 32))
		}
		return $.uint(mode, 32)
	}

	public SetModTime(t: time.Time): void {
		let h: FileHeader | $.VarRef<FileHeader> | null = this
		t = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(t)).UTC()))
		$.pointerValue<FileHeader>(h).Modified = $.markAsStructValue($.cloneStructValue(t))
		let __goscriptTuple0: any = timeToMsDosTime($.markAsStructValue($.cloneStructValue(t)))
		$.pointerValue<FileHeader>(h).ModifiedDate = $.uint(__goscriptTuple0[0], 16)
		$.pointerValue<FileHeader>(h).ModifiedTime = $.uint(__goscriptTuple0[1], 16)
	}

	public SetMode(mode: fs.FileMode): void {
		let h: FileHeader | $.VarRef<FileHeader> | null = this
		$.pointerValue<FileHeader>(h).CreatorVersion = $.uint(($.pointerValue<FileHeader>(h).CreatorVersion & 0xff) | (768), 16)
		$.pointerValue<FileHeader>(h).ExternalAttrs = $.uint(fileModeToUnixMode($.uint(mode, 32)) << 16, 32)

		// set MSDOS attributes too, as the original zip does.
		if ($.uint((mode & fs.ModeDir), 32) != $.uint(0, 32)) {
			$.pointerValue<FileHeader>(h).ExternalAttrs = $.pointerValue<FileHeader>(h).ExternalAttrs | ($.uint(16, 32))
		}
		if ($.uint((mode & 0o200), 32) == $.uint(0, 32)) {
			$.pointerValue<FileHeader>(h).ExternalAttrs = $.pointerValue<FileHeader>(h).ExternalAttrs | ($.uint(1, 32))
		}
	}

	public hasDataDescriptor(): boolean {
		const h: FileHeader | $.VarRef<FileHeader> | null = this
		return $.uint(($.pointerValue<FileHeader>(h).Flags & 0x8), 16) != $.uint(0, 16)
	}

	public isZip64(): boolean {
		const h: FileHeader | $.VarRef<FileHeader> | null = this
		return ($.pointerValue<FileHeader>(h).CompressedSize64 >= 4294967295n) || ($.pointerValue<FileHeader>(h).UncompressedSize64 >= 4294967295n)
	}

	static __typeInfo = $.registerStructType(
		"zip.FileHeader",
		() => new FileHeader(),
		[{ name: "FileInfo", args: [], returns: [{ type: "fs.FileInfo" }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "SetModTime", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "SetMode", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "hasDataDescriptor", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "isZip64", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		FileHeader,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Comment", key: "Comment", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "NonUTF8", key: "NonUTF8", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "CreatorVersion", key: "CreatorVersion", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "ReaderVersion", key: "ReaderVersion", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "Flags", key: "Flags", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "Method", key: "Method", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "Modified", key: "Modified", type: "time.Time" }, { name: "ModifiedTime", key: "ModifiedTime", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "ModifiedDate", key: "ModifiedDate", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "CRC32", key: "CRC32", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "CompressedSize", key: "CompressedSize", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "UncompressedSize", key: "UncompressedSize", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "CompressedSize64", key: "CompressedSize64", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "UncompressedSize64", key: "UncompressedSize64", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "Extra", key: "Extra", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ExternalAttrs", key: "ExternalAttrs", type: { kind: $.TypeKind.Basic, name: "uint32" } }]
	)
}

export class headerFileInfo {
	public get fh(): FileHeader | $.VarRef<FileHeader> | null {
		return this._fields.fh.value
	}
	public set fh(value: FileHeader | $.VarRef<FileHeader> | null) {
		this._fields.fh.value = value
	}

	public _fields: {
		fh: $.VarRef<FileHeader | $.VarRef<FileHeader> | null>
	}

	constructor(init?: Partial<{fh?: FileHeader | $.VarRef<FileHeader> | null}>) {
		this._fields = {
			fh: $.varRef(init?.fh ?? (null as FileHeader | $.VarRef<FileHeader> | null))
		}
	}

	public clone(): headerFileInfo {
		const cloned = new headerFileInfo()
		cloned._fields = {
			fh: $.varRef(this._fields.fh.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Info(): [fs.FileInfo | null, $.GoError] {
		const fi = this
		return [$.interfaceValue<fs.FileInfo | null>($.markAsStructValue($.cloneStructValue(fi)), "zip.headerFileInfo"), null]
	}

	public IsDir(): boolean {
		const fi = this
		return fs.FileMode_IsDir($.markAsStructValue($.cloneStructValue(fi)).Mode())
	}

	public ModTime(): time.Time {
		const fi = this
		if ($.markAsStructValue($.cloneStructValue($.pointerValue<FileHeader>(fi.fh).Modified)).IsZero()) {
			return $.markAsStructValue($.cloneStructValue(FileHeader.prototype.ModTime.call(fi.fh)))
		}
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<FileHeader>(fi.fh).Modified)).UTC()))
	}

	public Mode(): fs.FileMode {
		const fi = this
		return $.uint(FileHeader.prototype.Mode.call(fi.fh), 32)
	}

	public Name(): string {
		const fi = this
		return path.Base($.pointerValue<FileHeader>(fi.fh).Name)
	}

	public Size(): bigint {
		const fi = this
		if ($.pointerValue<FileHeader>(fi.fh).UncompressedSize64 > 0n) {
			return $.int64($.pointerValue<FileHeader>(fi.fh).UncompressedSize64)
		}
		return $.int64($.pointerValue<FileHeader>(fi.fh).UncompressedSize)
	}

	public String(): string {
		const fi = this
		return fs.FormatFileInfo($.interfaceValue<fs.FileInfo | null>($.markAsStructValue($.cloneStructValue(fi)), "zip.headerFileInfo"))
	}

	public Sys(): any {
		const fi = this
		return $.interfaceValue<any>(fi.fh, "*zip.FileHeader")
	}

	public Type(): fs.FileMode {
		const fi = this
		return $.uint(fs.FileMode_Type(FileHeader.prototype.Mode.call(fi.fh)), 32)
	}

	static __typeInfo = $.registerStructType(
		"zip.headerFileInfo",
		() => new headerFileInfo(),
		[{ name: "Info", args: [], returns: [{ type: "fs.FileInfo" }, { type: "error" }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ModTime", args: [], returns: [{ type: "time.Time" }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }, { name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Type", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" } }] }],
		headerFileInfo,
		[{ name: "fh", key: "fh", type: { kind: $.TypeKind.Pointer, elemType: "zip.FileHeader" } }]
	)
}

export class directoryEnd {
	public get diskNbr(): number {
		return this._fields.diskNbr.value
	}
	public set diskNbr(value: number) {
		this._fields.diskNbr.value = value
	}

	public get dirDiskNbr(): number {
		return this._fields.dirDiskNbr.value
	}
	public set dirDiskNbr(value: number) {
		this._fields.dirDiskNbr.value = value
	}

	public get dirRecordsThisDisk(): bigint {
		return this._fields.dirRecordsThisDisk.value
	}
	public set dirRecordsThisDisk(value: bigint) {
		this._fields.dirRecordsThisDisk.value = value
	}

	public get directoryRecords(): bigint {
		return this._fields.directoryRecords.value
	}
	public set directoryRecords(value: bigint) {
		this._fields.directoryRecords.value = value
	}

	public get directorySize(): bigint {
		return this._fields.directorySize.value
	}
	public set directorySize(value: bigint) {
		this._fields.directorySize.value = value
	}

	public get directoryOffset(): bigint {
		return this._fields.directoryOffset.value
	}
	public set directoryOffset(value: bigint) {
		this._fields.directoryOffset.value = value
	}

	public get commentLen(): number {
		return this._fields.commentLen.value
	}
	public set commentLen(value: number) {
		this._fields.commentLen.value = value
	}

	public get comment(): string {
		return this._fields.comment.value
	}
	public set comment(value: string) {
		this._fields.comment.value = value
	}

	public _fields: {
		diskNbr: $.VarRef<number>
		dirDiskNbr: $.VarRef<number>
		dirRecordsThisDisk: $.VarRef<bigint>
		directoryRecords: $.VarRef<bigint>
		directorySize: $.VarRef<bigint>
		directoryOffset: $.VarRef<bigint>
		commentLen: $.VarRef<number>
		comment: $.VarRef<string>
	}

	constructor(init?: Partial<{diskNbr?: number, dirDiskNbr?: number, dirRecordsThisDisk?: bigint, directoryRecords?: bigint, directorySize?: bigint, directoryOffset?: bigint, commentLen?: number, comment?: string}>) {
		this._fields = {
			diskNbr: $.varRef(init?.diskNbr ?? (0 as number)),
			dirDiskNbr: $.varRef(init?.dirDiskNbr ?? (0 as number)),
			dirRecordsThisDisk: $.varRef(init?.dirRecordsThisDisk ?? (0n as bigint)),
			directoryRecords: $.varRef(init?.directoryRecords ?? (0n as bigint)),
			directorySize: $.varRef(init?.directorySize ?? (0n as bigint)),
			directoryOffset: $.varRef(init?.directoryOffset ?? (0n as bigint)),
			commentLen: $.varRef(init?.commentLen ?? (0 as number)),
			comment: $.varRef(init?.comment ?? ("" as string))
		}
	}

	public clone(): directoryEnd {
		const cloned = new directoryEnd()
		cloned._fields = {
			diskNbr: $.varRef(this._fields.diskNbr.value),
			dirDiskNbr: $.varRef(this._fields.dirDiskNbr.value),
			dirRecordsThisDisk: $.varRef(this._fields.dirRecordsThisDisk.value),
			directoryRecords: $.varRef(this._fields.directoryRecords.value),
			directorySize: $.varRef(this._fields.directorySize.value),
			directoryOffset: $.varRef(this._fields.directoryOffset.value),
			commentLen: $.varRef(this._fields.commentLen.value),
			comment: $.varRef(this._fields.comment.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"zip.directoryEnd",
		() => new directoryEnd(),
		[],
		directoryEnd,
		[{ name: "diskNbr", key: "diskNbr", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "dirDiskNbr", key: "dirDiskNbr", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "dirRecordsThisDisk", key: "dirRecordsThisDisk", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "directoryRecords", key: "directoryRecords", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "directorySize", key: "directorySize", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "directoryOffset", key: "directoryOffset", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "commentLen", key: "commentLen", type: { kind: $.TypeKind.Basic, name: "uint16" } }, { name: "comment", key: "comment", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export const Store: number = 0

export const Deflate: number = 8

export const fileHeaderSignature: number = 67324752

export const directoryHeaderSignature: number = 33639248

export const directoryEndSignature: number = 101010256

export const directory64LocSignature: number = 117853008

export const directory64EndSignature: number = 101075792

export const dataDescriptorSignature: number = 134695760

export const fileHeaderLen: number = 30

export const directoryHeaderLen: number = 46

export const directoryEndLen: number = 22

export const dataDescriptorLen: number = 16

export const dataDescriptor64Len: number = 24

export const directory64LocLen: number = 20

export const directory64EndLen: number = 56

export const creatorFAT: number = 0

export const creatorUnix: number = 3

export const creatorNTFS: number = 11

export const creatorVFAT: number = 14

export const creatorMacOSX: number = 19

export const zipVersion20: number = 20

export const zipVersion45: number = 45

export const uint16max: number = 65535

export const uint32max: number = 4294967295

export const zip64ExtraID: number = 1

export const ntfsExtraID: number = 10

export const unixExtraID: number = 13

export const extTimeExtraID: number = 21589

export const infoZipUnixExtraID: number = 22613

export const s_IFMT: number = 61440

export const s_IFSOCK: number = 49152

export const s_IFLNK: number = 40960

export const s_IFREG: number = 32768

export const s_IFBLK: number = 24576

export const s_IFDIR: number = 16384

export const s_IFCHR: number = 8192

export const s_IFIFO: number = 4096

export const s_ISUID: number = 2048

export const s_ISGID: number = 1024

export const s_ISVTX: number = 512

export const msdosDir: number = 16

export const msdosReadOnly: number = 1

export async function FileInfoHeader(fi: fs.FileInfo | null): globalThis.Promise<[FileHeader | $.VarRef<FileHeader> | null, $.GoError]> {
	let size = await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).Size()
	let fh: FileHeader | $.VarRef<FileHeader> | null = (await (async () => { const __goscriptLiteralField0 = await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).Name(); return new FileHeader({Name: __goscriptLiteralField0, UncompressedSize64: $.uint64(size)}) })())
	FileHeader.prototype.SetModTime.call(fh, $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).ModTime())))
	FileHeader.prototype.SetMode.call(fh, $.uint(await $.pointerValue<Exclude<fs.FileInfo, null>>(fi).Mode(), 32))
	if ($.pointerValue<FileHeader>(fh).UncompressedSize64 > 4294967295n) {
		$.pointerValue<FileHeader>(fh).UncompressedSize = $.uint(4294967295, 32)
	} else {
		$.pointerValue<FileHeader>(fh).UncompressedSize = $.uint($.uint($.pointerValue<FileHeader>(fh).UncompressedSize64, 32), 32)
	}
	return [fh, null]
}

export function timeZone(offset: time.Duration): time.Location | $.VarRef<time.Location> | null {
	const minOffset: time.Duration = -43200000000000n
	const maxOffset: time.Duration = 50400000000000n
	const offsetAlias: time.Duration = 900000000000n
	offset = time.Duration_Round(offset, 900000000000n)
	if ((offset < -43200000000000n) || (50400000000000n < offset)) {
		offset = 0n
	}
	return time.FixedZone("", $.int($.int64Div(offset, time.Second)))
}

export function msDosTimeToTime(dosDate: number, dosTime: number): time.Time {
	return $.markAsStructValue($.cloneStructValue(time.Date($.int(($.uintShr(dosDate, 9, 16)) + 1980), $.int(($.uintShr(dosDate, 5, 16)) & 0xf), $.int(dosDate & 0x1f), $.int($.uintShr(dosTime, 11, 16)), $.int(($.uintShr(dosTime, 5, 16)) & 0x3f), $.int((dosTime & 0x1f) * 2), 0, time.UTC)))
}

export function timeToMsDosTime(t: time.Time): [number, number] {
	let fDate: number = 0
	let fTime: number = 0
	fDate = $.uint($.uint(($.markAsStructValue($.cloneStructValue(t)).Day() + ($.int($.markAsStructValue($.cloneStructValue(t)).Month()) << 5)) + (($.markAsStructValue($.cloneStructValue(t)).Year() - 1980) << 9), 16), 16)
	fTime = $.uint($.uint(((Math.trunc($.markAsStructValue($.cloneStructValue(t)).Second() / 2)) + ($.markAsStructValue($.cloneStructValue(t)).Minute() << 5)) + ($.markAsStructValue($.cloneStructValue(t)).Hour() << 11), 16), 16)
	return [fDate, fTime]
}

export function msdosModeToFileMode(m: number): fs.FileMode {
	let mode: fs.FileMode = 0
	if ($.uint((m & 16), 32) != $.uint(0, 32)) {
		mode = $.uint(fs.ModeDir | 0o777, 32)
	} else {
		mode = $.uint(0o666, 32)
	}
	if ($.uint((m & 1), 32) != $.uint(0, 32)) {
		mode = mode & ~(($.uint(0o222, 32)))
	}
	return $.uint(mode, 32)
}

export function fileModeToUnixMode(mode: fs.FileMode): number {
	let m: number = 0
	switch (mode & fs.ModeType) {
		default:
		{
			m = $.uint(32768, 32)
			break
		}
		case fs.ModeDir:
		{
			m = $.uint(16384, 32)
			break
		}
		case fs.ModeSymlink:
		{
			m = $.uint(40960, 32)
			break
		}
		case fs.ModeNamedPipe:
		{
			m = $.uint(4096, 32)
			break
		}
		case fs.ModeSocket:
		{
			m = $.uint(49152, 32)
			break
		}
		case fs.ModeDevice:
		{
			m = $.uint(24576, 32)
			break
		}
		case fs.ModeDevice | fs.ModeCharDevice:
		{
			m = $.uint(8192, 32)
			break
		}
	}
	if ($.uint((mode & fs.ModeSetuid), 32) != $.uint(0, 32)) {
		m = m | ($.uint(2048, 32))
	}
	if ($.uint((mode & fs.ModeSetgid), 32) != $.uint(0, 32)) {
		m = m | ($.uint(1024, 32))
	}
	if ($.uint((mode & fs.ModeSticky), 32) != $.uint(0, 32)) {
		m = m | ($.uint(512, 32))
	}
	return $.uint(m | $.uint(mode & 0o777, 32), 32)
}

export function unixModeToFileMode(m: number): fs.FileMode {
	let mode = $.uint($.uint(m & 0o777, 32), 32)
	switch (m & 61440) {
		case 24576:
		{
			mode = mode | ($.uint(fs.ModeDevice, 32))
			break
		}
		case 8192:
		{
			mode = mode | ($.uint(fs.ModeDevice | fs.ModeCharDevice, 32))
			break
		}
		case 16384:
		{
			mode = mode | ($.uint(fs.ModeDir, 32))
			break
		}
		case 4096:
		{
			mode = mode | ($.uint(fs.ModeNamedPipe, 32))
			break
		}
		case 40960:
		{
			mode = mode | ($.uint(fs.ModeSymlink, 32))
			break
		}
		case 32768:
		{
			break
		}
		case 49152:
		{
			mode = mode | ($.uint(fs.ModeSocket, 32))
			break
		}
	}
	if ($.uint((m & 1024), 32) != $.uint(0, 32)) {
		mode = mode | ($.uint(fs.ModeSetgid, 32))
	}
	if ($.uint((m & 2048), 32) != $.uint(0, 32)) {
		mode = mode | ($.uint(fs.ModeSetuid, 32))
	}
	if ($.uint((m & 512), 32) != $.uint(0, 32)) {
		mode = mode | ($.uint(fs.ModeSticky, 32))
	}
	return $.uint(mode, 32)
}
