// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class MyStruct {
	public get Value(): number {
		return this._fields.Value.value
	}
	public set Value(value: number) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<number>
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public DoesNotUseReceiver(): number {
		const m = this
		return 42
	}

	public UsesReceiver(): number {
		const m = this
		return $.pointerValue(m).Value
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		new MyStruct(),
		[{ name: "DoesNotUseReceiver", args: [], returns: [] }, { name: "UsesReceiver", args: [], returns: [] }],
		MyStruct,
		{"Value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): Promise<void> {
	let s = new MyStruct({Value: 10})
	$.println($.pointerValue(s).UsesReceiver())
	$.println($.pointerValue(s).DoesNotUseReceiver())
}


if ($.isMainScript(import.meta)) {
	await main()
}
