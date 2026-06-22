// Generated file based on package_import_protobuf_equalvt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

export class msg {
	public get v(): number {
		return this._fields.v.value
	}
	public set v(value: number) {
		this._fields.v.value = value
	}

	public _fields: {
		v: $.VarRef<number>
	}

	constructor(init?: Partial<{v?: number}>) {
		this._fields = {
			v: $.varRef(init?.v ?? (0 as unknown as number))
		}
	}

	public clone(): msg {
		const cloned = new msg()
		cloned._fields = {
			v: $.varRef(this._fields.v.value)
		}
		return $.markAsStructValue(cloned)
	}

	public EqualVT(other: msg | $.VarRef<msg> | null): boolean {
		const m: msg | $.VarRef<msg> | null = this
		return (other != null) && ($.pointerValue<msg>(m).v == $.pointerValue<msg>(other).v)
	}

	static __typeInfo = $.registerStructType(
		"main.msg",
		() => new msg(),
		[{ name: "EqualVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		msg,
		[{ name: "v", key: "v", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	$.println("equal:", protobuf_go_lite.IsEqualVT({T: { type: { kind: $.TypeKind.Pointer, elemType: "main.msg" }, zero: () => null }}, new msg({v: 7}), new msg({v: 7})))
}

if ($.isMainScript(import.meta)) {
	await main()
}
