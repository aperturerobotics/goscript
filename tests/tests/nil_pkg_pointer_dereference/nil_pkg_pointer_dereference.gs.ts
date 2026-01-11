// Generated file based on nil_pkg_pointer_dereference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

export class TestStruct {
	public get Mode(): os.FileMode {
		return this._fields.Mode.value
	}
	public set Mode(value: os.FileMode) {
		this._fields.Mode.value = value
	}

	public get File(): os.File | null {
		return this._fields.File.value
	}
	public set File(value: os.File | null) {
		this._fields.File.value = value
	}

	public _fields: {
		Mode: $.VarRef<os.FileMode>;
		File: $.VarRef<os.File | null>;
	}

	constructor(init?: Partial<{File?: os.File | null, Mode?: os.FileMode}>) {
		this._fields = {
			Mode: $.varRef(init?.Mode ?? 0 as os.FileMode),
			File: $.varRef(init?.File ?? null)
		}
	}

	public clone(): TestStruct {
		const cloned = new TestStruct()
		cloned._fields = {
			Mode: $.varRef(this._fields.Mode.value),
			File: $.varRef(this._fields.File.value ? $.markAsStructValue(this._fields.File.value.clone()) : null)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.TestStruct',
	  new TestStruct(),
	  [],
	  TestStruct,
	  {"Mode": { kind: $.TypeKind.Basic, name: "uint32" }, "File": { kind: $.TypeKind.Pointer, elemType: "File" }}
	);
}

export async function main(): Promise<void> {
	// Test initialized struct

	// 420 in decimal
	let s = $.markAsStructValue(new TestStruct({File: null, Mode: 420}))

	$.println("Mode:", $.int(s.Mode))
	$.println("File is nil:", s.File == null)

	// Test zero values
	let zero: TestStruct = new TestStruct()
	$.println("Zero Mode:", $.int(zero.Mode))
	$.println("Zero File is nil:", zero.File == null)
}

