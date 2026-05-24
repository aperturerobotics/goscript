// Generated file based on package_import_io_fs_readlink.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/io/fs/index.js"

export class emptyFS {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): emptyFS {
		const cloned = new emptyFS()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Open(name: string): [fs.File | null, $.GoError] {
		return [null, fs.ErrNotExist]
	}

	static __typeInfo = $.registerStructType(
		"main.emptyFS",
		() => new emptyFS(),
		[{ name: "Open", args: [], returns: [] }],
		emptyFS,
		{}
	)
}

export class linkFS {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): linkFS {
		const cloned = new linkFS()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Lstat(name: string): [fs.FileInfo | null, $.GoError] {
		return [null, fs.ErrNotExist]
	}

	public Open(name: string): [fs.File | null, $.GoError] {
		return [null, fs.ErrNotExist]
	}

	public ReadLink(name: string): [string, $.GoError] {
		return ["target.txt", null]
	}

	static __typeInfo = $.registerStructType(
		"main.linkFS",
		() => new linkFS(),
		[{ name: "Lstat", args: [], returns: [] }, { name: "Open", args: [], returns: [] }, { name: "ReadLink", args: [], returns: [] }],
		linkFS,
		{}
	)
}

export async function main(): globalThis.Promise<void> {
	let [target, err] = fs.ReadLink($.interfaceValue<fs.FS | null>($.markAsStructValue(new linkFS()), "main.linkFS"), "link")
	$.println("target:", target, err == null)

	let __goscriptTuple0: any = fs.ReadLink($.interfaceValue<fs.FS | null>($.markAsStructValue(new emptyFS()), "main.emptyFS"), "link")
	err = __goscriptTuple0[1]
	$.println("unsupported:", err != null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
