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
		mutex: $.VarRef<sync.Mutex>;
		lines: $.VarRef<$.Slice<number>>;
	}

	constructor(init?: Partial<{lines?: $.Slice<number>, mutex?: sync.Mutex}>) {
		this._fields = {
			mutex: $.varRef(init?.mutex ? $.markAsStructValue(init.mutex.clone()) : new sync.Mutex()),
			lines: $.varRef(init?.lines ?? null)
		}
	}

	public clone(): FileTracker {
		const cloned = new FileTracker()
		cloned._fields = {
			mutex: $.varRef($.markAsStructValue(this._fields.mutex.value.clone())),
			lines: $.varRef(this._fields.lines.value)
		}
		return cloned
	}

	// AddLine is async because it uses a mutex
	public async AddLine(offset: number): Promise<void> {
		const f = this
		await f.mutex.Lock()
		f.lines = $.append(f.lines, offset)
		f.mutex.Unlock()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.FileTracker',
	  new FileTracker(),
	  [{ name: "AddLine", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }],
	  FileTracker,
	  {"mutex": "Mutex", "lines": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	);
}

export class Scanner {
	public get file(): FileTracker | null {
		return this._fields.file.value
	}
	public set file(value: FileTracker | null) {
		this._fields.file.value = value
	}

	public _fields: {
		file: $.VarRef<FileTracker | null>;
	}

	constructor(init?: Partial<{file?: FileTracker | null}>) {
		this._fields = {
			file: $.varRef(init?.file ?? null)
		}
	}

	public clone(): Scanner {
		const cloned = new Scanner()
		cloned._fields = {
			file: $.varRef(this._fields.file.value ? $.markAsStructValue(this._fields.file.value.clone()) : null)
		}
		return cloned
	}

	// next() calls an async method but itself is not marked async
	public async next(): Promise<void> {
		const s = this
		await s.file!.AddLine(10)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Scanner',
	  new Scanner(),
	  [{ name: "next", args: [], returns: [] }],
	  Scanner,
	  {"file": { kind: $.TypeKind.Pointer, elemType: "FileTracker" }}
	);
}

export async function main(): Promise<void> {
	let tracker = new FileTracker({lines: $.arrayToSlice<number>([])})
	let scanner = new Scanner({file: tracker})
	await scanner!.next()
	$.println($.len(tracker!.lines))
}

