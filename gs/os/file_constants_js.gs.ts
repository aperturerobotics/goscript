import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { getDeno, getEnv, getNodeFS, getPlatform, newHostError } from "./types_js.gs.js";

function pickFirstEnv(keys: string[]): string {
	for (const key of keys) {
		const value = getEnv(key)
		if (value !== "") {
			return value
		}
	}
	return ""
}

// File open flags - using values compatible with typical Unix systems
export const O_RDONLY = 0
export const O_WRONLY = 1
export const O_RDWR = 2
export const O_APPEND = 1024
export const O_CREATE = 64
export const O_EXCL = 128
export const O_SYNC = 1052672
export const O_TRUNC = 512

// Seek constants
export const SEEK_SET = 0
export const SEEK_CUR = 1
export const SEEK_END = 2

// LinkError carries details for link-related path errors.
export class LinkError {
	public get Op(): string {
		return this._fields.Op.value
	}
	public set Op(value: string) {
		this._fields.Op.value = value
	}

	public get Old(): string {
		return this._fields.Old.value
	}
	public set Old(value: string) {
		this._fields.Old.value = value
	}

	public get New(): string {
		return this._fields.New.value
	}
	public set New(value: string) {
		this._fields.New.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Op: $.VarRef<string>;
		Old: $.VarRef<string>;
		New: $.VarRef<string>;
		Err: $.VarRef<$.GoError>;
	}

	constructor(init?: Partial<{Op?: string, Old?: string, New?: string, Err?: $.GoError}>) {
		this._fields = {
			Op: $.varRef(init?.Op ?? ""),
			Old: $.varRef(init?.Old ?? ""),
			New: $.varRef(init?.New ?? ""),
			Err: $.varRef(init?.Err ?? null)
		}
	}

	public Error(): string {
		const e = this
		return e.Op + " " + e.Old + " " + e.New + ": " + (e.Err?.Error() ?? "")
	}

	public Unwrap(): $.GoError {
		const e = this
		return e.Err
	}
}

export function Readlink(name: string): [string, $.GoError] {
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

export function TempDir(): string {
	const value = pickFirstEnv(["TMPDIR", "TEMP", "TMP"])
	if (value !== "") {
		return value
	}
	return getPlatform() === "win32" ? "." : "/tmp"
}

export function UserCacheDir(): [string, $.GoError] {
	if (getPlatform() === "win32") {
		const value = pickFirstEnv(["LOCALAPPDATA", "APPDATA", "USERPROFILE"])
		if (value !== "") {
			return [value, null]
		}
		return ["", ErrUnimplemented]
	}
	const value = pickFirstEnv(["XDG_CACHE_HOME"])
	if (value !== "") {
		return [value, null]
	}
	const [home, err] = UserHomeDir()
	if (err !== null || home === "") {
		return ["", err ?? ErrUnimplemented]
	}
	return [home.replace(/\/+$/, "") + "/.cache", null]
}

export function UserConfigDir(): [string, $.GoError] {
	if (getPlatform() === "win32") {
		const value = pickFirstEnv(["APPDATA", "USERPROFILE"])
		if (value !== "") {
			return [value, null]
		}
		return ["", ErrUnimplemented]
	}
	const value = pickFirstEnv(["XDG_CONFIG_HOME"])
	if (value !== "") {
		return [value, null]
	}
	const [home, err] = UserHomeDir()
	if (err !== null || home === "") {
		return ["", err ?? ErrUnimplemented]
	}
	return [home.replace(/\/+$/, "") + "/.config", null]
}

export function UserHomeDir(): [string, $.GoError] {
	const keys = getPlatform() === "win32" ? ["USERPROFILE", "HOMEDRIVE", "HOME"] : ["HOME"]
	const value = pickFirstEnv(keys)
	if (value !== "") {
		return [value, null]
	}
	return ["", ErrUnimplemented]
}
