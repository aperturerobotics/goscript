// Generated file based on named_type_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyFileMode = number

export function MyFileMode_String(m: MyFileMode): string {
	return "mode"
}

export class FileStatus {
	public get mode(): MyFileMode {
		return this._fields.mode.value
	}
	public set mode(value: MyFileMode) {
		this._fields.mode.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		mode: $.VarRef<MyFileMode>
		size: $.VarRef<number>
	}

	constructor(init?: Partial<{mode?: MyFileMode, size?: number}>) {
		this._fields = {
			mode: $.varRef(init?.mode ?? 0),
			size: $.varRef(init?.size ?? 0)
		}
	}

	public clone(): FileStatus {
		const cloned = new FileStatus()
		cloned._fields = {
			mode: $.varRef(this._fields.mode.value),
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.FileStatus",
		new FileStatus(),
		[],
		FileStatus,
		{"mode": "main.MyFileMode", "size": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	// Test using the named type directly
	let mode: MyFileMode = 0o644
	$.println("Mode value:", $.int(mode))
	$.println("Mode string:", MyFileMode_String(mode))

	// Test using in struct
	let status = $.markAsStructValue(new FileStatus({mode: 0o755, size: 1024}))

	$.println("Status mode:", $.int(status.mode))
	$.println("Status size:", status.size)

	// Test type assertion and conversion
	let genericMode: MyFileMode = 0o777
	$.println("Generic mode:", $.int(genericMode))
}


if ($.isMainScript(import.meta)) {
	await main()
}
