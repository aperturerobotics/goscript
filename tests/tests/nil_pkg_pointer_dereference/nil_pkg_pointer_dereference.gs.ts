// Generated file based on nil_pkg_pointer_dereference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as os from "@goscript/os/index.ts"

export class TestStruct {
	public get Mode(): FileMode {
		return this._fields.Mode.value
	}
	public set Mode(value: FileMode) {
		this._fields.Mode.value = value
	}

	public get File(): File | $.VarRef<File> | null {
		return this._fields.File.value
	}
	public set File(value: File | $.VarRef<File> | null) {
		this._fields.File.value = value
	}

	public _fields: {
		Mode: $.VarRef<FileMode>
		File: $.VarRef<File | $.VarRef<File> | null>
	}

	constructor(init?: Partial<{Mode?: FileMode, File?: File | $.VarRef<File> | null}>) {
		this._fields = {
			Mode: $.varRef(init?.Mode ?? 0),
			File: $.varRef(init?.File ?? null)
		}
	}

	public clone(): TestStruct {
		const cloned = new TestStruct()
		cloned._fields = {
			Mode: $.varRef(this._fields.Mode.value),
			File: $.varRef(this._fields.File.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.TestStruct",
		new TestStruct(),
		[],
		TestStruct,
		{"Mode": "fs.FileMode", "File": { kind: $.TypeKind.Pointer, elemType: "os.File" }}
	)
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new TestStruct({Mode: 420, File: null}))
	$.println("Mode:", $.int(s.Mode))
	$.println("File is nil:", s.File == null)
	let zero: TestStruct = $.markAsStructValue(new TestStruct())
	$.println("Zero Mode:", $.int(zero.Mode))
	$.println("Zero File is nil:", zero.File == null)
}


if ($.isMainScript(import.meta)) {
	await main()
}
