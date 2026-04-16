import * as $ from "@goscript/builtin/index.js";
import { ErrInvalid } from "./error.gs.js";
import { Create, Mkdir, Open, OpenFile, Remove } from "./file_js.gs.js";
import { Lstat as lstatPath, Stat as statPath } from "./stat_js.gs.js";
import { File } from "./types_js.gs.js";

import * as fs from "@goscript/io/fs/index.js"
import { ValidPath } from "@goscript/io/fs/index.js"

function isValidRootName(name: string): boolean {
	if (name === ".") {
		return true
	}
	return ValidPath(name)
}

function joinRootPath(dir: string, name: string): [string, $.GoError] {
	if (!isValidRootName(name)) {
		return ["", ErrInvalid]
	}
	if (name === ".") {
		return [dir, null]
	}
	return [dir.replace(/\/+$/, "") + "/" + name, null]
}

export function OpenInRoot(dir: string, name: string): [File | null, $.GoError] {
	const [path, err] = joinRootPath(dir, name)
	if (err !== null) {
		return [null, err]
	}
	return Open(path)
}

export class Root {
	public name: string

	constructor(init?: Partial<{name?: string}>) {
		this.name = init?.name ?? "."
	}

	public Name(): string {
		return this.name
	}

	public Close(): $.GoError {
		return null
	}

	public Open(name: string): [File | null, $.GoError] {
		return OpenInRoot(this.name, name)
	}

	public Create(name: string): [File | null, $.GoError] {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return [null, err]
		}
		return Create(path)
	}

	public OpenFile(name: string, flag: number, perm: number): [File | null, $.GoError] {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return [null, err]
		}
		return OpenFile(path, flag, perm)
	}

	public OpenRoot(name: string): [RootType | null, $.GoError] {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return [null, err]
		}
		return OpenRoot(path)
	}

	public Mkdir(name: string, perm: number): $.GoError {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return err
		}
		return Mkdir(path, perm)
	}

	public Remove(name: string): $.GoError {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return err
		}
		return Remove(path)
	}

	public Stat(name: string): [fs.FileInfo | null, $.GoError] {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return [null, err]
		}
		return statPath(path)
	}

	public Lstat(name: string): [fs.FileInfo | null, $.GoError] {
		const [path, err] = joinRootPath(this.name, name)
		if (err !== null) {
			return [null, err]
		}
		return lstatPath(path)
	}

	public FS(): fs.FS {
		return new rootFS({ root: this })
	}

	static __typeInfo = $.registerStructType(
		'Root',
		new Root(),
		[
			{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] },
			{ name: "Close", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }
		],
		Root,
		{ "name": { kind: $.TypeKind.Basic, name: "string" } }
	);
}

export type RootType = Root

export function OpenRoot(name: string): [Root | null, $.GoError] {
	const [info, err] = statPath(name)
	if (err !== null) {
		return [null, err]
	}
	if (!info?.IsDir()) {
		return [null, ErrInvalid]
	}
	return [new Root({ name }), null]
}

export function splitPathInRoot(s: string, prefix: $.Slice<string> | null, suffix: $.Slice<string> | null): [$.Slice<string>, string, $.GoError] {
	if (!isValidRootName(s)) {
		return [null, "", ErrInvalid]
	}
	const parts = s === "." ? [] : s.split("/").filter((part) => part !== "")
	const head = $.arrayToSlice<string>(parts.slice(0, Math.max(0, parts.length - 1)))
	const tail = parts.length === 0 ? "." : parts[parts.length - 1]
	return [head, tail, null]
}

export function isValidRootFSPath(name: string): boolean {
	return isValidRootName(name)
}

class rootFS {
	public root: Root

	constructor(init?: Partial<{root?: Root}>) {
		this.root = init?.root ?? new Root()
	}

	public Open(name: string): [fs.File, $.GoError] {
		return this.root.Open(name)
	}
}
