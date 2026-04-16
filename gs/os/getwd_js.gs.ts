import * as $ from "@goscript/builtin/index.js";
import { getDeno } from "./types_js.gs.js";

import * as fs from "@goscript/io/fs/index.js"

let currentWorkingDir: string = "/"

export function Getwd(): [string, $.GoError] {
	const denoObj = getDeno()
	if (denoObj?.cwd) {
		try {
			return [denoObj.cwd(), null]
		} catch {
			// Fall back to the tracked working directory below.
		}
	}
	const processObj = (globalThis as any).process
	if (processObj?.cwd) {
		try {
			return [processObj.cwd(), null]
		} catch {
			// Fall back to the tracked working directory below.
		}
	}
	return [currentWorkingDir, null]
}

export function setWorkingDir(dir: string): void {
	currentWorkingDir = dir
}

export function statNolog(name: string): [fs.FileInfo | null, $.GoError] {
	return [null, fs.ErrNotExist]
}

export function lstatNolog(name: string): [fs.FileInfo | null, $.GoError] {
	return [null, fs.ErrNotExist]
} 
