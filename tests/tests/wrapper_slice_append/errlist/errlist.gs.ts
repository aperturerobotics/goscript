// Generated file based on errlist/errlist.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class AStruct {
	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	public _fields: {
		Msg: $.VarRef<string>;
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
		return cloned
	}

	public Set(msg: string): void {
		const a = this
		a.Msg = msg
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'github.com/aperturerobotics/goscript/tests/tests/wrapper_slice_append/errlist.AStruct',
	  new AStruct(),
	  [{ name: "Set", args: [{ name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }],
	  AStruct,
	  {"Msg": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type ErrorList = $.Slice<string>;

export function ErrorList_Add(p: $.VarRef<ErrorList>, msg: string): void {
	p!.value = $.append(p!.value, msg)
}


