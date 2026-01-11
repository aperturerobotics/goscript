// Generated file based on os_filemode_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

export class file {
	public get mode(): os.FileMode {
		return this._fields.mode.value
	}
	public set mode(value: os.FileMode) {
		this._fields.mode.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		mode: $.VarRef<os.FileMode>;
		name: $.VarRef<string>;
	}

	constructor(init?: Partial<{mode?: os.FileMode, name?: string}>) {
		this._fields = {
			mode: $.varRef(init?.mode ?? 0 as os.FileMode),
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): file {
		const cloned = new file()
		cloned._fields = {
			mode: $.varRef(this._fields.mode.value),
			name: $.varRef(this._fields.name.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.file',
	  new file(),
	  [],
	  file,
	  {"mode": { kind: $.TypeKind.Basic, name: "uint32" }, "name": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export async function main(): Promise<void> {
	let f = $.markAsStructValue(new file({mode: (0o644 as os.FileMode), name: "test.txt"}))

	$.println("File mode:", $.int(f.mode))
	$.println("File name:", f.name)

	// Test type assertion
	let mode: os.FileMode = (0o755 as os.FileMode)
	$.println("Mode type:", $.int(mode))
}

