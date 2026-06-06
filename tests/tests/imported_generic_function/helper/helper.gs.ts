// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = {
	GetValue(): number
}

$.registerInterfaceType(
	"helper.Value",
	null,
	[{ name: "GetValue", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class Box {
	public get Value(): any {
		return this._fields.Value.value
	}
	public set Value(value: any) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<any>
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (null as unknown as any))
		}
	}

	public clone(): Box {
		const cloned = new Box()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"helper.Box",
		() => new Box(),
		[],
		Box,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] }, index: [0], offset: 0, exported: true }]
	)
}

export class IntValue {
	public get N(): number {
		return this._fields.N.value
	}
	public set N(value: number) {
		this._fields.N.value = value
	}

	public _fields: {
		N: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? (0 as unknown as number))
		}
	}

	public clone(): IntValue {
		const cloned = new IntValue()
		cloned._fields = {
			N: $.varRef(this._fields.N.value)
		}
		return $.markAsStructValue(cloned)
	}

	public GetValue(): number {
		const v = this
		return v.N
	}

	static __typeInfo = $.registerStructType(
		"helper.IntValue",
		() => new IntValue(),
		[{ name: "GetValue", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		IntValue,
		[{ name: "N", key: "N", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export function Wrap(__typeArgs: $.GenericTypeArgs | undefined, value: any): Box {
	return $.markAsStructValue(new Box({Value: value}))
}

export function Collect<T>(__typeArgs: $.GenericTypeArgs | undefined, value: any): [$.Slice<T>, $.GoError] {
	return [$.arrayToSlice<T>([value]), null]
}
