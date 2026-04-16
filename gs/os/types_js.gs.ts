import * as $ from "@goscript/builtin/index.js";
import { ErrClosed, ErrInvalid, ErrUnimplemented } from "./error.gs.js";

import * as fs from "@goscript/io/fs/index.js"
import * as io from "@goscript/io/index.js"
import * as time from "@goscript/time/index.js"
import * as syscall from "@goscript/syscall/index.js"
import {
	DenoFileLike,
	DenoStream,
	HostUnsupportedError,
	hostRuntime,
	NodeFSModule,
	resetHostRuntimeForTests,
} from "@goscript/builtin/hostio.js"
import { newRawConn } from "./rawconn_js.gs.js"

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

export function getNodeFS(): NodeFSModule | null {
	return hostRuntime.nodeFS
}

export function getDeno(): any | null {
	return hostRuntime.deno
}

export function getPlatform(): string {
	return hostRuntime.platform
}

export function getEnv(name: string): string {
	return hostRuntime.getEnv(name)
}

export function getDenoStream(fd: number): DenoStream | null {
	return hostRuntime.getStdioHandle(fd)
}

function readFD(fd: number, b: Uint8Array): [number, $.GoError] {
	if (b.length === 0) {
		return [0, null]
	}

	try {
		const n = hostRuntime.readFD(fd, b)
		if (n === null || n === 0) {
			return [0, io.EOF]
		}
		return [n, null]
	} catch (err) {
		if (err instanceof HostUnsupportedError) {
			return [0, ErrUnimplemented]
		}
		return [0, newHostError(err)]
	}
}

function writeFD(fd: number, b: Uint8Array): [number, $.GoError] {
	if (b.length === 0) {
		return [0, null]
	}

	try {
		return [hostRuntime.writeFD(fd, b), null]
	} catch (err) {
		if (err instanceof HostUnsupportedError) {
			return [0, ErrUnimplemented]
		}
		return [0, newHostError(err)]
	}
}

function readHandle(handle: DenoFileLike, b: Uint8Array): [number, $.GoError] {
	if (typeof handle.readSync !== "function") {
		return [0, ErrUnimplemented]
	}
	try {
		const n = handle.readSync(b)
		if (n === null || n === 0) {
			return [0, io.EOF]
		}
		return [n, null]
	} catch (err) {
		return [0, newHostError(err)]
	}
}

function writeHandle(handle: DenoFileLike, b: Uint8Array): [number, $.GoError] {
	if (typeof handle.writeSync !== "function") {
		return [0, ErrUnimplemented]
	}
	try {
		let offset = 0
		while (offset < b.length) {
			const n = handle.writeSync(b.subarray(offset))
			if (!Number.isFinite(n) || n < 0) {
				throw new Error(`invalid write result: ${n}`)
			}
			if (n === 0) {
				throw new Error("short write")
			}
			offset += n
		}
		return [b.length, null]
	} catch (err) {
		return [0, newHostError(err)]
	}
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
		file: new file({ handle: handle ?? hostRuntime.getStdioHandle(fd), path: name }),
		name,
	})
}

export { resetHostRuntimeForTests }

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
		const handle = this.file?.handle
		const [n, err] =
			handle && typeof handle.readSync === "function"
				? readHandle(handle, buf)
				: readFD(this.fd, buf)
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
		const buf = $.bytesToUint8Array(b)
		const handle = this.file?.handle
		return handle && typeof handle.writeSync === "function"
			? writeHandle(handle, buf)
			: writeFD(this.fd, buf)
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
