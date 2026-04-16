import * as $ from "@goscript/builtin/index.js";
import { lstatNolog as lstatPath, statNolog as statPath } from "./stat_js.gs.js";

import * as fs from "@goscript/io/fs/index.js"

export function statNolog(name: string): [fs.FileInfo | null, $.GoError] {
	return statPath(name)
}

export function lstatNolog(name: string): [fs.FileInfo | null, $.GoError] {
	return lstatPath(name)
}

export function fillFileStatFromSys(fileInfo: any, name: string): void {
	// No-op in JavaScript.
}

export interface fileStat {
	sys: any
}
