// Generated file based on package_import_io_fs_readdir_varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as fstest from "@goscript/testing/fstest/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/testing/fstest/index.js"

export class openOnlyFS {
	public get fsys(): fstest.MapFS {
		return this._fields.fsys.value
	}
	public set fsys(value: fstest.MapFS) {
		this._fields.fsys.value = value
	}

	public _fields: {
		fsys: $.VarRef<fstest.MapFS>
	}

	constructor(init?: Partial<{fsys?: fstest.MapFS}>) {
		this._fields = {
			fsys: $.varRef(init?.fsys ?? (null as unknown as fstest.MapFS))
		}
	}

	public clone(): openOnlyFS {
		const cloned = new openOnlyFS()
		cloned._fields = {
			fsys: $.varRef(this._fields.fsys.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Open(name: string): globalThis.Promise<[fs.File | null, $.GoError]> {
		const o = this
		return await fstest.MapFS_Open(o.fsys, name)
	}

	static __typeInfo = $.registerStructType(
		"main.openOnlyFS",
		() => new openOnlyFS(),
		[{ name: "Open", args: [{ name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "fs.File" }, { name: "_r1", type: "error" }] }],
		openOnlyFS,
		[{ name: "fsys", key: "fsys", type: "fstest.MapFS", pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_io_fs_readdir_varref", index: [0], offset: 0, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fsys: fstest.MapFS = new Map<string, fstest.MapFile | $.VarRef<fstest.MapFile> | null>([["b.txt", new fstest.MapFile({Data: new Uint8Array([98])})], ["a.txt", new fstest.MapFile({Data: new Uint8Array([97])})], ["dir/nested.txt", new fstest.MapFile({Data: new Uint8Array([110, 101, 115, 116, 101, 100])})]])

	let __goscriptTuple0: any = await fs.ReadDir($.interfaceValue<fs.FS | null>($.markAsStructValue(new openOnlyFS({fsys: fsys})), "main.openOnlyFS"), ".")
	let entries: $.Slice<fs.DirEntry | null> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("err:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	for (let __goscriptRangeTarget0 = entries, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let entry = __goscriptRangeTarget0![__rangeIndex]
		$.println(await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).IsDir())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
