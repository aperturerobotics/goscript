import * as $ from "@goscript/builtin/index.js";
import { Mkdir, OpenFile, Remove } from "./file_js.gs.js";
import { Root, OpenRoot } from "./root_js.gs.js";
import { Lstat, Stat } from "./stat_js.gs.js";
import { File } from "./types_js.gs.js";

import * as fs from "@goscript/io/fs/index.js"

export function openRootNolog(name: string): [Root | null, $.GoError] {
	return OpenRoot(name)
}

export function openRootInRoot(r: Root | null, name: string): [Root | null, $.GoError] {
	return r?.OpenRoot(name) ?? [null, null]
}

export function newRoot(name: string): [Root | null, $.GoError] {
	return OpenRoot(name)
}

export function rootOpenFileNolog(r: Root | null, name: string, flag: number, perm: number): [File | null, $.GoError] {
	return r?.OpenFile(name, flag, perm) ?? OpenFile(name, flag, perm)
}

export function rootStat(r: Root | null, name: string, lstat: boolean): [fs.FileInfo | null, $.GoError] {
	if (r !== null) {
		return lstat ? r.Lstat(name) : r.Stat(name)
	}
	return lstat ? Lstat(name) : Stat(name)
}

export function rootMkdir(r: Root | null, name: string, perm: number): $.GoError {
	return r?.Mkdir(name, perm) ?? Mkdir(name, perm)
}

export function rootRemove(r: Root | null, name: string): $.GoError {
	return r?.Remove(name) ?? Remove(name)
}
