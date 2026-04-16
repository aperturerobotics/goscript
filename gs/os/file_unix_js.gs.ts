import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { createFileInfo, createHostFile, File, getDeno, getEnv, getNodeFS, getPlatform, newHostError } from "./types_js.gs.js";
import { O_APPEND, O_CREATE, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY } from "./file_constants_js.gs.js";
import { FileInfoToDirEntry } from "@goscript/io/fs/readdir.js"

import * as fs from "@goscript/io/fs/index.js"

function getDevNullPath(): string {
	return getPlatform() === "win32" ? "NUL" : "/dev/null"
}

function getTempDirPath(): string {
	for (const key of ["TMPDIR", "TEMP", "TMP"]) {
		const value = getEnv(key)
		if (value !== "") {
			return value
		}
	}
	return getPlatform() === "win32" ? "." : "/tmp"
}

function openOptionsFromFlags(flag: number): {
	append: boolean
	create: boolean
	createNew: boolean
	read: boolean
	truncate: boolean
	write: boolean
} {
	const readWrite = (flag & O_RDWR) !== 0
	const writeOnly = !readWrite && (flag & O_WRONLY) !== 0
	const write = readWrite || writeOnly
	const read = readWrite || !writeOnly
	return {
		append: (flag & O_APPEND) !== 0,
		create: (flag & O_CREATE) !== 0,
		createNew: (flag & O_CREATE) !== 0 && (flag & O_EXCL) !== 0,
		read,
		truncate: (flag & O_TRUNC) !== 0,
		write,
	}
}

// Device null path for the host platform.
export const DevNull = getDevNullPath()

const standardInputFD = 0
const standardOutputFD = 1
const standardErrorFD = 2

// Stdin, Stdout, and Stderr expose the host process standard streams.
export const Stdin: File | null = NewFile(standardInputFD, "/dev/stdin")
export const Stdout: File | null = NewFile(standardOutputFD, "/dev/stdout")
export const Stderr: File | null = NewFile(standardErrorFD, "/dev/stderr")

// NewFile creates a File from a file descriptor.
export function NewFile(fd: number, name: string): File | null {
	if (!Number.isInteger(fd) || fd < 0) {
		return null
	}
	return createHostFile(name, fd)
}

export function Remove(name: string): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.removeSync) {
		try {
			denoObj.removeSync(name)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.rmSync) {
		try {
			nodeFS.rmSync(name)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	if (nodeFS?.unlinkSync) {
		try {
			nodeFS.unlinkSync(name)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Link(oldname: string, newname: string): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.linkSync) {
		try {
			denoObj.linkSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.linkSync) {
		try {
			nodeFS.linkSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Symlink(oldname: string, newname: string): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.symlinkSync) {
		try {
			denoObj.symlinkSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.symlinkSync) {
		try {
			nodeFS.symlinkSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Truncate(name: string, size: number): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.truncateSync) {
		try {
			denoObj.truncateSync(name, size)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.truncateSync) {
		try {
			nodeFS.truncateSync(name, size)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function rename(oldname: string, newname: string): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.renameSync) {
		try {
			denoObj.renameSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.renameSync) {
		try {
			nodeFS.renameSync(oldname, newname)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function openFileNolog(name: string, flag: number, perm: number): [File | null, $.GoError] {
	const denoObj = getDeno()
	if (denoObj?.openSync) {
		try {
			const handle = denoObj.openSync(name, {
				...openOptionsFromFlags(flag),
				mode: perm,
			})
			return [createHostFile(name, handle?.rid ?? -1, handle), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.openSync) {
		try {
			const fd = nodeFS.openSync(name, flag, perm)
			return [createHostFile(name, fd), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	return [null, ErrUnimplemented]
}

export function openDirNolog(name: string): [File | null, $.GoError] {
	return openFileNolog(name, O_RDONLY, 0)
}

export function tempDir(): string {
	return getTempDirPath()
}

export function readlink(name: string): [string, $.GoError] {
	const denoObj = getDeno()
	if (denoObj?.readLinkSync) {
		try {
			return [denoObj.readLinkSync(name), null]
		} catch (err) {
			return ["", newHostError(err)]
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.readlinkSync) {
		try {
			return [nodeFS.readlinkSync(name), null]
		} catch (err) {
			return ["", newHostError(err)]
		}
	}
	return ["", ErrUnimplemented]
}

export function fixLongPath(path: string): string {
	return path
}

export function sigpipe(): void {
	// No-op in JavaScript
}

export function epipecheck(file: File | null, e: $.GoError): void {
	// No-op in JavaScript  
}

export interface dirInfo {
	close(): void
}

export function net_newUnixFile(fd: number, name: string): File | null {
	return NewFile(fd, name)
}

// File kind enum for compatibility
export type newFileKind = number

export function newFile(fd: number, name: string, _kind: newFileKind, _nonBlocking: boolean): File | null {
	return NewFile(fd, name)
}

export function newUnixDirent(parent: string, name: string, _typ: number): [fs.DirEntry | null, $.GoError] {
	const fullName = parent === "" || parent === "." ? name : parent.replace(/\/+$/, "") + "/" + name
	const denoObj = getDeno()
	if (denoObj?.lstatSync) {
		try {
			return [FileInfoToDirEntry(createFileInfo(name, denoObj.lstatSync(fullName))), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.lstatSync) {
		try {
			return [FileInfoToDirEntry(createFileInfo(name, nodeFS.lstatSync(fullName))), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	return [null, ErrUnimplemented]
} 
