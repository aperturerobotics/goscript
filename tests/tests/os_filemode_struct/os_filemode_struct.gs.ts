// Generated file based on os_filemode_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export class file {
	public get mode(): FileMode {
		return this._fields.mode.value
	}
	public set mode(value: FileMode) {
		this._fields.mode.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		mode: $.VarRef<FileMode>
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{mode?: FileMode, name?: string}>) {
		this._fields = {
			mode: $.varRef(init?.mode ?? 0),
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): file {
		const cloned = new file()
		cloned._fields = {
			mode: $.varRef(this._fields.mode.value),
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.file",
		new file(),
		[],
		file,
		{"mode": "fs.FileMode", "name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): Promise<void> {
	let f = $.markAsStructValue(new file({mode: 0o644, name: "test.txt"}))
	$.println("File mode:", $.int(f.mode))
	$.println("File name:", f.name)
	let mode: FileMode = 0o755
	$.println("Mode type:", $.int(mode))
}


if ($.isMainScript(import.meta)) {
	await main()
}
