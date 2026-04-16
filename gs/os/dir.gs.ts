import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { createFileInfo, getDeno, getNodeFS, newHostError } from "./types_js.gs.js";
import { FileInfoToDirEntry } from "@goscript/io/fs/readdir.js";

import * as fs from "@goscript/io/fs/index.js"

type DirEntry = fs.DirEntry;

export function ReadDir(name: string): [$.Slice<DirEntry>, $.GoError] {
	const denoObj = getDeno()
	if (denoObj?.readDirSync) {
		try {
			const entries: DirEntry[] = []
			for (const entry of denoObj.readDirSync(name)) {
				const dirEntry = FileInfoToDirEntry(createFileInfo(entry.name, {
					isDirectory: () => entry.isDirectory,
					isSymbolicLink: () => entry.isSymlink,
					mode: 0,
					size: 0,
				}))
				if (dirEntry !== null) {
					entries.push(dirEntry)
				}
			}
			entries.sort((a, b) => (a?.Name() ?? "").localeCompare(b?.Name() ?? ""))
			return [$.arrayToSlice(entries), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	const nodeFS = getNodeFS()
	if (nodeFS?.readdirSync) {
		try {
			const entries = nodeFS.readdirSync(name, { withFileTypes: true }).map((entry: any) =>
				FileInfoToDirEntry(createFileInfo(entry.name, {
					isDirectory: () => typeof entry.isDirectory === "function" ? entry.isDirectory() : false,
					isSymbolicLink: () => typeof entry.isSymbolicLink === "function" ? entry.isSymbolicLink() : false,
					mode: 0,
					size: 0,
				}))
			).filter((entry: DirEntry | null): entry is DirEntry => entry !== null)
			entries.sort((a, b) => (a?.Name() ?? "").localeCompare(b?.Name() ?? ""))
			return [$.arrayToSlice(entries), null]
		} catch (err) {
			return [null, newHostError(err)]
		}
	}
	return [null, ErrUnimplemented]
}

export function CopyFS(dir: string, fsys: fs.FS): $.GoError {
	return ErrUnimplemented
}
