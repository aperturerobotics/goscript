// Generated file based on interface_slice_index_short_decl.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_slice_index_short_decl/dep/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_slice_index_short_decl/dep/index.js"

export type Fixed = $.Slice<dep.Ref | null>

export type Shape = {
	Mark(): boolean
}

$.registerInterfaceType(
	"main.Shape",
	null,
	[{ name: "Mark", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
)

export class Action {
	public get Result(): number {
		return this._fields.Result.value
	}
	public set Result(value: number) {
		this._fields.Result.value = value
	}

	public get Filter(): Map<number, dep.Ref | null> | null {
		return this._fields.Filter.value
	}
	public set Filter(value: Map<number, dep.Ref | null> | null) {
		this._fields.Filter.value = value
	}

	public _fields: {
		Result: $.VarRef<number>
		Filter: $.VarRef<Map<number, dep.Ref | null> | null>
	}

	constructor(init?: Partial<{Result?: number, Filter?: Map<number, dep.Ref | null> | null}>) {
		this._fields = {
			Result: $.varRef(init?.Result ?? 0),
			Filter: $.varRef(init?.Filter ?? null)
		}
	}

	public clone(): Action {
		const cloned = new Action()
		cloned._fields = {
			Result: $.varRef(this._fields.Result.value),
			Filter: $.varRef(this._fields.Filter.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Mark(): boolean {
		const a = this
		return a.Filter != null
	}

	public SetFilter(k: number, v: dep.Ref | null): void {
		let a: Action | $.VarRef<Action> | null = this
		if ($.pointerValue<Action>(a).Filter == null) {
			$.pointerValue<Action>(a).Filter = $.makeMap<number, dep.Ref | null>()
		}
		$.mapSet($.pointerValue<Action>(a).Filter, k, v)
	}

	static __typeInfo = $.registerStructType(
		"main.Action",
		() => new Action(),
		[{ name: "Mark", args: [], returns: [] }, { name: "SetFilter", args: [], returns: [] }],
		Action,
		{"Result": { kind: $.TypeKind.Basic, name: "int" }, "Filter": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "int" }, elemType: "dep.Ref" }}
	)
}

export type value = Uint8Array

export function value_Key(v: value): any {
	return $.namedValueInterfaceValue<any>(v, "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)($.pointerValue(receiver), ...args)})
}

export function Fixed_Mark(f: Fixed): boolean {
	return $.len((f as Fixed)) != 0
}

export async function main(): globalThis.Promise<void> {
	let shapes: $.Slice<Shape | null> = $.arrayToSlice<Shape | null>([$.namedValueInterfaceValue<Shape | null>($.arrayToSlice<dep.Ref | null>([$.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([$.uint(1, 8), $.uint(2, 8)]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)($.pointerValue(receiver), ...args)})]), "main.Fixed", {Mark: (receiver: any, ...args: any[]) => (Fixed_Mark as any)($.pointerValue(receiver), ...args)}), $.interfaceValue<Shape | null>($.markAsStructValue(new Action({Result: 1, Filter: new Map<number, dep.Ref | null>([[1, $.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([$.uint(1, 8), $.uint(2, 8)]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)($.pointerValue(receiver), ...args)})]])})), "main.Action")])
	let fixed: $.Slice<Fixed> = null as $.Slice<Fixed>
	for (let __goscriptRangeTarget0 = shapes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let shape = __goscriptRangeTarget0![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = shape
			switch (true) {
				case $.typeAssert<Fixed>(__goscriptTypeSwitchValue, "main.Fixed").ok:
					{
						let shape: Fixed = $.typeAssert<Fixed>(__goscriptTypeSwitchValue, "main.Fixed").value
						shape = ($.append((shape as Fixed), $.namedValueInterfaceValue<dep.Ref | null>(new Uint8Array([$.uint(3, 8), $.uint(4, 8)]), "main.value", {Key: (receiver: any, ...args: any[]) => (value_Key as any)($.pointerValue(receiver), ...args)})) as Fixed)
						fixed = $.append(fixed, (shape as Fixed))
					}
					break
				case $.typeAssert<Action>(__goscriptTypeSwitchValue, "main.Action").ok:
					{
						let shape: $.VarRef<Action> = $.varRef($.typeAssert<Action>(__goscriptTypeSwitchValue, "main.Action").value)
						let fix: Fixed = (fixed![0] as Fixed)
						let fv = fix![0]
						{
							let v = $.mapGet(shape.value.Filter, shape.value.Result, null)[0]
							if (v != null) {
								dep.ToKey(v)
								dep.ToKey(fv)
							}
						}
						shape.value.SetFilter(2, fv)
					}
					break
			}
		}
	}
	let fix: Fixed = (fixed![0] as Fixed)
	let fv = fix![0]
	if (dep.ToKey(fv) != null) {
		$.println("ok")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
