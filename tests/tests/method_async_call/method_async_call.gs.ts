// Generated file based on method_async_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as sync from "@goscript/sync/index.ts"

export class FileTracker {
	public get mutex(): Mutex {
		return this._fields.mutex.value
	}
	public set mutex(value: Mutex) {
		this._fields.mutex.value = value
	}

	public get lines(): $.Slice<number> {
		return this._fields.lines.value
	}
	public set lines(value: $.Slice<number>) {
		this._fields.lines.value = value
	}

	public _fields: {
		mutex: $.VarRef<Mutex>
		lines: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{mutex?: Mutex, lines?: $.Slice<number>}>) {
		this._fields = {
			mutex: $.varRef(init?.mutex ? $.markAsStructValue(init.mutex.clone()) : $.markAsStructValue(new Mutex())),
			lines: $.varRef(init?.lines ?? null)
		}
	}

	public clone(): FileTracker {
		const cloned = new FileTracker()
		cloned._fields = {
			mutex: $.varRef($.markAsStructValue(this._fields.mutex.value.clone())),
			lines: $.varRef(this._fields.lines.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AddLine(offset: number): Promise<void> {
		const f = this
		await $.pointerValue(f).mutex.Lock()
		$.pointerValue(f).lines = $.append($.pointerValue(f).lines, offset)
		$.pointerValue(f).mutex.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.FileTracker",
		new FileTracker(),
		[{ name: "AddLine", args: [], returns: [] }],
		FileTracker,
		{"mutex": "sync.Mutex", "lines": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export class Scanner {
	public get file(): FileTracker | $.VarRef<FileTracker> | null {
		return this._fields.file.value
	}
	public set file(value: FileTracker | $.VarRef<FileTracker> | null) {
		this._fields.file.value = value
	}

	public _fields: {
		file: $.VarRef<FileTracker | $.VarRef<FileTracker> | null>
	}

	constructor(init?: Partial<{file?: FileTracker | $.VarRef<FileTracker> | null}>) {
		this._fields = {
			file: $.varRef(init?.file ?? null)
		}
	}

	public clone(): Scanner {
		const cloned = new Scanner()
		cloned._fields = {
			file: $.varRef(this._fields.file.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async next(): Promise<void> {
		const s = this
		await $.pointerValue($.pointerValue(s).file).AddLine(10)
	}

	static __typeInfo = $.registerStructType(
		"main.Scanner",
		new Scanner(),
		[{ name: "next", args: [], returns: [] }],
		Scanner,
		{"file": { kind: $.TypeKind.Pointer, elemType: "main.FileTracker" }}
	)
}

export async function main(): Promise<void> {
	let tracker = new FileTracker({lines: []})
	let scanner = new Scanner({file: tracker})
	await $.pointerValue(scanner).next()
	$.println($.len($.pointerValue(tracker).lines))
}


if ($.isMainScript(import.meta)) {
	await main()
}
