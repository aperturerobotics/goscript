import * as $ from "@goscript/builtin/index.js";
import { ErrClosed, ErrInvalid, ErrUnimplemented } from "./error.gs.js";

import * as fs from "@goscript/io/fs/index.js"
import * as io from "@goscript/io/index.js"
import * as time from "@goscript/time/index.js"
import * as syscall from "@goscript/syscall/index.js"
import { newRawConn } from "./rawconn_js.gs.js"

export type NodeFSModule = {
	readSync(fd: number, buffer: Uint8Array, offset?: number, length?: number, position?: number | null): number
	writeSync(fd: number, buffer: Uint8Array, offset?: number, length?: number, position?: number | null): number
	closeSync?(fd: number): void
	fstatSync?(fd: number): HostStatLike
	fsyncSync?(fd: number): void
	ftruncateSync?(fd: number, len?: number): void
	openSync?(path: string, flags: number | string, mode?: number): number
	chmodSync?(path: string, mode: number): void
	chownSync?(path: string, uid: number, gid: number): void
	lchownSync?(path: string, uid: number, gid: number): void
	linkSync?(existingPath: string, newPath: string): void
	lstatSync?(path: string): HostStatLike
	mkdirSync?(path: string, options?: number | { mode?: number, recursive?: boolean }): void
	readFileSync?(path: string): Uint8Array
	readdirSync?(path: string, options?: { withFileTypes?: boolean }): any[]
	readlinkSync?(path: string): string
	renameSync?(oldPath: string, newPath: string): void
	rmSync?(path: string, options?: { force?: boolean, recursive?: boolean }): void
	rmdirSync?(path: string): void
	statSync?(path: string): HostStatLike
	symlinkSync?(target: string, path: string): void
	truncateSync?(path: string, len?: number): void
	unlinkSync?(path: string): void
	utimesSync?(path: string, atime: Date | number, mtime: Date | number): void
	writeFileSync?(path: string, data: Uint8Array, options?: { mode?: number }): void
}

export type DenoStream = {
	readSync?(buffer: Uint8Array): number | null
	writeSync?(buffer: Uint8Array): number
}

export type DenoFileLike = DenoStream & {
	close?(): void
	rid?: number
	seekSync?(offset: number, whence: number): number
	syncSync?(): void
	statSync?(): HostStatLike
	truncateSync?(len?: number): void
}

export type HostStatLike = {
	isDirectory(): boolean
	isSymbolicLink?(): boolean
	mode?: number
	mtime?: Date | null
	mtimeMs?: number
	size?: number
}

export function newHostError(err: unknown): $.GoError {
	const message =
		err instanceof Error ? err.message
		: typeof err === "string" ? err
		: String(err)
	return { Error: () => message }
}

export function getDynamicRequire(): ((specifier: string) => unknown) | null {
	try {
		return Function(
			"return typeof require !== 'undefined' ? require : null",
		)() as ((specifier: string) => unknown) | null
	} catch {
		return null
	}
}

export function getNodeFS(): NodeFSModule | null {
	const processObj = (globalThis as any).process
	if (processObj && typeof processObj.getBuiltinModule === "function") {
		const module = processObj.getBuiltinModule("fs")
		if (module && typeof module.readSync === "function" && typeof module.writeSync === "function") {
			return module as NodeFSModule
		}
	}

	const requireFn = getDynamicRequire()
	if (requireFn) {
		for (const specifier of ["node:fs", "fs"]) {
			try {
				const module = requireFn(specifier) as NodeFSModule | null
				if (module && typeof module.readSync === "function" && typeof module.writeSync === "function") {
					return module
				}
			} catch {
				// Try the next fallback.
			}
		}
	}

	return null
}

export function getDeno(): any | null {
	return (globalThis as any).Deno ?? null
}

export function getPlatform(): string {
	const denoObj = getDeno()
	if (denoObj?.build?.os) {
		return denoObj.build.os
	}

	const processObj = (globalThis as any).process
	if (processObj?.platform) {
		return processObj.platform
	}

	return "unknown"
}

export function getEnv(name: string): string {
	const denoObj = getDeno()
	if (denoObj?.env?.get) {
		try {
			return denoObj.env.get(name) ?? ""
		} catch {
			return ""
		}
	}

	const processObj = (globalThis as any).process
	return processObj?.env?.[name] ?? ""
}

export function getDenoStream(fd: number): DenoStream | null {
	const denoObj = getDeno()
	if (!denoObj) {
		return null
	}

	switch (fd) {
		case 0:
			return denoObj.stdin ?? null
		case 1:
			return denoObj.stdout ?? null
		case 2:
			return denoObj.stderr ?? null
		default:
			return null
	}
}

function readFD(fd: number, b: Uint8Array): [number, $.GoError] {
	if (b.length === 0) {
		return [0, null]
	}

	const denoStream = getDenoStream(fd)
	if (denoStream && typeof denoStream.readSync === "function") {
		try {
			const n = denoStream.readSync(b)
			if (n === null || n === 0) {
				return [0, io.EOF]
			}
			return [n, null]
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	const nodeFS = getNodeFS()
	if (nodeFS) {
		try {
			const n = nodeFS.readSync(fd, b, 0, b.length, null)
			if (n === 0) {
				return [0, io.EOF]
			}
			return [n, null]
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	return [0, ErrUnimplemented]
}

function writeFD(fd: number, b: Uint8Array): [number, $.GoError] {
	if (b.length === 0) {
		return [0, null]
	}

	const denoStream = getDenoStream(fd)
	if (denoStream && typeof denoStream.writeSync === "function") {
		try {
			return [denoStream.writeSync(b), null]
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	const nodeFS = getNodeFS()
	if (nodeFS) {
		try {
			return [nodeFS.writeSync(fd, b, 0, b.length, null), null]
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	return [0, ErrUnimplemented]
}

class hostFileInfo {
	public name: string
	public modTime: time.Time
	public mode: fs.FileMode
	public size: number
	public sys: HostStatLike | null

	constructor(init?: Partial<{modTime?: time.Time, mode?: fs.FileMode, name?: string, size?: number, sys?: HostStatLike | null}>) {
		this.name = init?.name ?? ""
		this.modTime = init?.modTime ?? time.Unix(0, 0)
		this.mode = init?.mode ?? 0
		this.size = init?.size ?? 0
		this.sys = init?.sys ?? null
	}

	public IsDir(): boolean {
		return fs.FileMode_IsDir(this.mode)
	}

	public ModTime(): time.Time {
		return this.modTime
	}

	public Mode(): fs.FileMode {
		return this.mode
	}

	public Name(): string {
		return this.name
	}

	public Size(): number {
		return this.size
	}

	public Sys(): HostStatLike | null {
		return this.sys
	}
}

export function createFileInfo(name: string, stat: HostStatLike): fs.FileInfo {
	const normalizedName = name.replace(/\\/g, "/").split("/").filter((part) => part !== "").slice(-1)[0] ?? name
	let mode = (stat.mode ?? 0) & fs.ModePerm
	if (stat.isDirectory()) {
		mode |= fs.ModeDir
	}
	if (stat.isSymbolicLink?.()) {
		mode |= fs.ModeSymlink
	}

	let mtimeMs = 0
	if (typeof stat.mtimeMs === "number") {
		mtimeMs = stat.mtimeMs
	} else if (stat.mtime instanceof Date) {
		mtimeMs = stat.mtime.getTime()
	}

	return new hostFileInfo({
		modTime: time.UnixMilli(mtimeMs),
		mode,
		name: normalizedName,
		size: stat.size ?? 0,
		sys: stat,
	})
}

export function createHostFile(name: string, fd: number = -1, handle: DenoFileLike | null = null): File {
	return new File({
		fd,
		file: new file({ handle, path: name }),
		name,
	})
}

// Re-export essential types
export type Time = time.Time;
export type FileInfo = fs.FileInfo;
export type FileMode = fs.FileMode;
export type DirEntry = fs.DirEntry;

// Export runtime values for ES module compatibility  
export const Time = null as any;
export const FileInfo = null as any;
// FileMode is now a class, so we re-export it directly from fs
export const DirEntry = null as any;

// Getpagesize returns the underlying system's memory page size.
export function Getpagesize(): number {
	// Return a standard page size for JavaScript environment
	// Most systems use 4096 bytes as the default page size
	return 4096
}

// File adapts host file descriptors and file handles to Go's os.File surface.
export class File {
	public get file(): file | null {
		return this._fields.file.value
	}
	public set file(value: file | null) {
		this._fields.file.value = value
	}

	public name: string
	public closed: boolean
	public fd: number

	public _fields: {
		file: $.VarRef<file | null>;
	}

	constructor(init?: Partial<{closed?: boolean, fd?: number, file?: file | null, name?: string}>) {
		this.name = init?.name ?? ""
		this.closed = init?.closed ?? false
		this.fd = init?.fd ?? -1
		this._fields = {
			file: $.varRef(init?.file ?? null)
		}
	}

	public clone(): File {
		return new File({
			closed: this.closed,
			fd: this.fd,
			file: this.file,
			name: this.name,
		})
	}

	public Readdir(n: number): [$.Slice<fs.FileInfo>, $.GoError] {
		return [null, ErrUnimplemented]
	}

	public Readdirnames(n: number): [$.Slice<string>, $.GoError] {
		return [null, ErrUnimplemented]
	}

	public ReadDir(n: number): [$.Slice<fs.DirEntry>, $.GoError] {
		return [null, ErrUnimplemented]
	}

	public readdir(n: number, mode: readdirMode): [$.Slice<string>, $.Slice<fs.DirEntry>, $.Slice<fs.FileInfo>, $.GoError] {
		return [null, null, null, ErrUnimplemented]
	}

	public Name(): string {
		return this.name
	}

	public Read(b: $.Bytes): [number, $.GoError] {
		if (this.closed) {
			return [0, ErrClosed]
		}
		if (this.fd < 0) {
			return [0, ErrInvalid]
		}
		if (b === null) {
			return [0, null]
		}
		const buf = $.bytesToUint8Array(b)
		const [n, err] = readFD(this.fd, buf)
		if (!(b instanceof Uint8Array) && n > 0) {
			$.copy(b, buf.subarray(0, n))
		}
		return [n, err]
	}

	public ReadAt(b: $.Bytes, off: number): [number, $.GoError] {
		const handle = this.file?.handle
		if (!handle || typeof handle.seekSync !== "function" || b === null) {
			return [0, ErrUnimplemented]
		}
		try {
			handle.seekSync(off, io.SeekStart)
			return this.Read(b)
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	public ReadFrom(r: io.Reader): [number, $.GoError] {
		if (this.closed) {
			return [0, ErrClosed]
		}
		return io.Copy(this, r)
	}

	public Write(b: $.Bytes): [number, $.GoError] {
		if (this.closed) {
			return [0, ErrClosed]
		}
		if (this.fd < 0) {
			return [0, ErrInvalid]
		}
		if (b === null) {
			return [0, null]
		}
		return writeFD(this.fd, $.bytesToUint8Array(b))
	}

	public WriteAt(b: $.Bytes, off: number): [number, $.GoError] {
		const handle = this.file?.handle
		if (!handle || typeof handle.seekSync !== "function" || b === null) {
			return [0, ErrUnimplemented]
		}
		try {
			handle.seekSync(off, io.SeekStart)
			return this.Write(b)
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	public WriteTo(w: io.Writer): [number, $.GoError] {
		if (this.closed) {
			return [0, ErrClosed]
		}
		return io.Copy(w, this)
	}

	public Seek(offset: number, whence: number): [number, $.GoError] {
		const handle = this.file?.handle
		if (!handle || typeof handle.seekSync !== "function") {
			return [0, ErrUnimplemented]
		}
		try {
			return [handle.seekSync(offset, whence), null]
		} catch (err) {
			return [0, newHostError(err)]
		}
	}

	public WriteString(s: string): [number, $.GoError] {
		return this.Write($.stringToBytes(s))
	}

	public Chmod(mode: number): $.GoError {
		if (this.closed) {
			return ErrClosed
		}
		if (this.name === "") {
			return ErrUnimplemented
		}
		const denoObj = getDeno()
		if (denoObj?.chmodSync) {
			try {
				denoObj.chmodSync(this.name, mode)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		const nodeFS = getNodeFS()
		if (nodeFS?.chmodSync) {
			try {
				nodeFS.chmodSync(this.name, mode)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		return ErrUnimplemented
	}

	public SetDeadline(t: time.Time): $.GoError {
		return ErrUnimplemented
	}

	public SetReadDeadline(t: time.Time): $.GoError {
		return ErrUnimplemented
	}

	public SetWriteDeadline(t: time.Time): $.GoError {
		return ErrUnimplemented
	}

	public SyscallConn(): [any, $.GoError] {
		if (this.closed) {
			return [null, ErrClosed]
		}
		if (this.fd < 0) {
			return [null, ErrInvalid]
		}
		return [newRawConn(this), null]
	}

	public Close(): $.GoError {
		if (this.closed) {
			return ErrClosed
		}
		const handle = this.file?.handle
		if (handle && typeof handle.close === "function") {
			try {
				handle.close()
			} catch (err) {
				return newHostError(err)
			}
		} else if (this.fd > 2) {
			const nodeFS = getNodeFS()
			if (nodeFS?.closeSync) {
				try {
					nodeFS.closeSync(this.fd)
				} catch (err) {
					return newHostError(err)
				}
			}
		}
		this.closed = true
		return null
	}

	public Chown(uid: number, gid: number): $.GoError {
		if (this.closed) {
			return ErrClosed
		}
		if (this.name === "") {
			return ErrUnimplemented
		}
		const denoObj = getDeno()
		if (denoObj?.chownSync) {
			try {
				denoObj.chownSync(this.name, uid, gid)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		const nodeFS = getNodeFS()
		if (nodeFS?.chownSync) {
			try {
				nodeFS.chownSync(this.name, uid, gid)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		return ErrUnimplemented
	}

	public Truncate(size: number): $.GoError {
		const handle = this.file?.handle
		if (handle && typeof handle.truncateSync === "function") {
			try {
				handle.truncateSync(size)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		const nodeFS = getNodeFS()
		if (nodeFS?.ftruncateSync && this.fd >= 0) {
			try {
				nodeFS.ftruncateSync(this.fd, size)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		return ErrUnimplemented
	}

	public Sync(): $.GoError {
		const handle = this.file?.handle
		if (handle && typeof handle.syncSync === "function") {
			try {
				handle.syncSync()
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		const nodeFS = getNodeFS()
		if (nodeFS?.fsyncSync && this.fd >= 0) {
			try {
				nodeFS.fsyncSync(this.fd)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		return ErrUnimplemented
	}

	public Chdir(): $.GoError {
		const processObj = (globalThis as any).process
		if (processObj?.chdir && this.name !== "") {
			try {
				processObj.chdir(this.name)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		const denoObj = getDeno()
		if (denoObj?.chdir && this.name !== "") {
			try {
				denoObj.chdir(this.name)
				return null
			} catch (err) {
				return newHostError(err)
			}
		}
		return ErrUnimplemented
	}

	public Fd(): syscall.uintptr {
		return this.fd
	}

	public Stat(): [fs.FileInfo, $.GoError] {
		const handle = this.file?.handle
		if (handle && typeof handle.statSync === "function") {
			try {
				return [createFileInfo(this.name, handle.statSync()), null]
			} catch (err) {
				return [null, newHostError(err)]
			}
		}
		const nodeFS = getNodeFS()
		if (nodeFS?.fstatSync && this.fd >= 0) {
			try {
				return [createFileInfo(this.name, nodeFS.fstatSync(this.fd)), null]
			} catch (err) {
				return [null, newHostError(err)]
			}
		}
		return [null, ErrUnimplemented]
	}

	// Internal methods
	public checkValid(op: string): $.GoError {
		if (this.closed) {
			return ErrClosed
		}
		if (this.fd < 0) {
			return ErrInvalid
		}
		return null
	}

	public wrapErr(op: string, err: $.GoError): $.GoError {
		return err
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
		'File',
		new File(),
		[
			{ name: "Readdir", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "FileInfo" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] },
			{ name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] },
			{ name: "Close", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }
		],
		File,
		{ "file": { kind: $.TypeKind.Pointer, elemType: "file" }, "name": { kind: $.TypeKind.Basic, name: "string" }, "closed": { kind: $.TypeKind.Basic, name: "boolean" }, "fd": { kind: $.TypeKind.Basic, name: "number" } }
	);
}

class file {
	public handle: DenoFileLike | null
	public path: string

	constructor(init?: Partial<{handle?: DenoFileLike | null, path?: string}>) {
		this.handle = init?.handle ?? null
		this.path = init?.path ?? ""
	}
}

// readdirMode mirrors the Go runtime helper enum.
type readdirMode = number

// File mode constants
export let ModeDir: fs.FileMode = fs.ModeDir
export let ModeAppend: fs.FileMode = fs.ModeAppend
export let ModeExclusive: fs.FileMode = fs.ModeExclusive
export let ModeTemporary: fs.FileMode = fs.ModeTemporary
export let ModeSymlink: fs.FileMode = fs.ModeSymlink
export let ModeDevice: fs.FileMode = fs.ModeDevice
export let ModeNamedPipe: fs.FileMode = fs.ModeNamedPipe
export let ModeSocket: fs.FileMode = fs.ModeSocket
export let ModeSetuid: fs.FileMode = fs.ModeSetuid
export let ModeSetgid: fs.FileMode = fs.ModeSetgid
export let ModeCharDevice: fs.FileMode = fs.ModeCharDevice
export let ModeSticky: fs.FileMode = fs.ModeSticky
export let ModeIrregular: fs.FileMode = fs.ModeIrregular

export let ModeType: fs.FileMode = fs.ModeType
export let ModePerm: fs.FileMode = fs.ModePerm

// SameFile reports whether fi1 and fi2 describe the same file.
export function SameFile(fi1: fs.FileInfo, fi2: fs.FileInfo): boolean {
	// In JavaScript environment, always return false as we can't compare files
	return false
}

// FileMode wrapper functions - re-export from fs module
export function FileMode_IsDir(receiver: fs.FileMode): boolean {
	return fs.FileMode_IsDir(receiver)
}

export function FileMode_IsRegular(receiver: fs.FileMode): boolean {
	return fs.FileMode_IsRegular(receiver)
}

export function FileMode_Perm(receiver: fs.FileMode): fs.FileMode {
	return fs.FileMode_Perm(receiver)
}

export function FileMode_String(receiver: fs.FileMode): string {
	return fs.FileMode_String(receiver)
}

export function FileMode_Type(receiver: fs.FileMode): fs.FileMode {
	return fs.FileMode_Type(receiver)
} 
