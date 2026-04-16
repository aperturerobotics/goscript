import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { getDeno, getNodeFS, newHostError } from "./types_js.gs.js";

export function syscallMode(i: number): number {
	return 0
}

export function ignoringEINTR(fn: () => $.GoError): $.GoError {
	return fn()
}

export function ignoringEINTR2(fn: () => [string, $.GoError]): [string, $.GoError] {
	return fn()
}

export function Chmod(name: string, mode: number): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.chmodSync) {
		try {
			denoObj.chmodSync(name, mode)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.chmodSync) {
		try {
			nodeFS.chmodSync(name, mode)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Chown(name: string, uid: number, gid: number): $.GoError {
	const denoObj = getDeno()
	if (denoObj?.chownSync) {
		try {
			denoObj.chownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.chownSync) {
		try {
			nodeFS.chownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Lchown(name: string, uid: number, gid: number): $.GoError {
	const nodeFS = getNodeFS()
	if (nodeFS?.lchownSync) {
		try {
			nodeFS.lchownSync(name, uid, gid)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}

export function Chtimes(name: string, atime: any, mtime: any): $.GoError {
	const at = typeof atime?.UnixMilli === "function" ? new Date(atime.UnixMilli()) : new Date(atime)
	const mt = typeof mtime?.UnixMilli === "function" ? new Date(mtime.UnixMilli()) : new Date(mtime)
	const denoObj = getDeno()
	if (denoObj?.utimeSync) {
		try {
			denoObj.utimeSync(name, at, mt)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.utimesSync) {
		try {
			nodeFS.utimesSync(name, at, mt)
			return null
		} catch (err) {
			return newHostError(err)
		}
	}
	return ErrUnimplemented
}
