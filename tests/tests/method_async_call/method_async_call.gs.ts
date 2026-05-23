// Generated file based on method_async_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export class FileTracker {
	public get mutex(): sync.Mutex {
		return this._fields.mutex.value
	}
	public set mutex(value: sync.Mutex) {
		this._fields.mutex.value = value
	}

	public get lines(): $.Slice<number> {
		return this._fields.lines.value
	}
	public set lines(value: $.Slice<number>) {
		this._fields.lines.value = value
	}

	public _fields: {
		mutex: $.VarRef<sync.Mutex>
		lines: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{mutex?: sync.Mutex, lines?: $.Slice<number>}>) {
		this._fields = {
			mutex: $.varRef(init?.mutex ? $.markAsStructValue(init.mutex.clone()) : $.markAsStructValue(new sync.Mutex())),
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

	public async AddLine(offset: number): globalThis.Promise<void> {
		let f: FileTracker | $.VarRef<FileTracker> | null = this
		await $.pointerValue<FileTracker>(f).mutex.Lock()
		$.pointerValue<FileTracker>(f).lines = $.append($.pointerValue<FileTracker>(f).lines, offset)
		$.pointerValue<FileTracker>(f).mutex.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.FileTracker",
		() => new FileTracker(),
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

	public async next(): globalThis.Promise<void> {
		const s: Scanner | $.VarRef<Scanner> | null = this
		await FileTracker.prototype.AddLine.call($.pointerValue<Scanner>(s).file, 10)
	}

	static __typeInfo = $.registerStructType(
		"main.Scanner",
		() => new Scanner(),
		[{ name: "next", args: [], returns: [] }],
		Scanner,
		{"file": { kind: $.TypeKind.Pointer, elemType: "main.FileTracker" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let tracker: FileTracker | $.VarRef<FileTracker> | null = new FileTracker({lines: $.arrayToSlice<number>([])})
	let scanner: Scanner | $.VarRef<Scanner> | null = new Scanner({file: tracker})
	await Scanner.prototype.next.call(scanner)
	$.println($.len($.pointerValue<FileTracker>(tracker).lines))
}

if ($.isMainScript(import.meta)) {
	await main()
}
