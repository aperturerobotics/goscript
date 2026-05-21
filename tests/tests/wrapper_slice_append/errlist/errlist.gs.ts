// Generated file based on errlist.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ErrorList = $.Slice<string>

export class AStruct {
	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	public _fields: {
		Msg: $.VarRef<string>
	}

	constructor(init?: Partial<{Msg?: string}>) {
		this._fields = {
			Msg: $.varRef(init?.Msg ?? "")
		}
	}

	public clone(): AStruct {
		const cloned = new AStruct()
		cloned._fields = {
			Msg: $.varRef(this._fields.Msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Set(msg: string): void {
		const a: AStruct | $.VarRef<AStruct> | null = this
		$.pointerValue<AStruct>(a).Msg = msg
	}

	static __typeInfo = $.registerStructType(
		"errlist.AStruct",
		new AStruct(),
		[{ name: "Set", args: [], returns: [] }],
		AStruct,
		{"Msg": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function ErrorList_Add(p: $.VarRef<ErrorList> | null, msg: string): void {
	p!.value = $.append($.pointerValue<ErrorList>(p), msg)
}
