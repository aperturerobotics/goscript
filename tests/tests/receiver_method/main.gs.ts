// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
		const m: MyStruct | $.VarRef<MyStruct> | null = this
		return 42
	}

	public UsesReceiver(): number {
		const m: MyStruct | $.VarRef<MyStruct> | null = this
		return $.pointerValue<MyStruct>(m).Value
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[{ name: "DoesNotUseReceiver", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "UsesReceiver", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		MyStruct,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({Value: 10})
	$.println(MyStruct.prototype.UsesReceiver.call(s))
	$.println(MyStruct.prototype.DoesNotUseReceiver.call(s))
}

if ($.isMainScript(import.meta)) {
	await main()
}
