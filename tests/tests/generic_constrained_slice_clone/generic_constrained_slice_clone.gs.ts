// Generated file based on generic_constrained_slice_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get value(): string {
		return this._fields.value.value
	}
	public set value(value: string) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? "")
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneVT(): item | $.VarRef<item> | null {
		const i: item | $.VarRef<item> | null = this
		if (i == null) {
			return null
		}
		return new item({value: $.pointerValue<item>(i).value})
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[{ name: "CloneVT", args: [], returns: [] }],
		item,
		{"value": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export type clonable = {
	CloneVT(): any
}

$.registerInterfaceType(
	"main.clonable",
	null,
	[{ name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
)

export function cloneSlice<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>): $.Slice<T> {
	let cloned: $.Slice<T> = $.makeSlice<T>(0, $.len(items))
	for (let __goscriptRangeTarget0 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let item = __goscriptRangeTarget0![__rangeIndex]
		cloned = $.append(cloned, $.callGenericMethod(__typeArgs, "T", "CloneVT", item))
	}
	return cloned
}

export async function main(): globalThis.Promise<void> {
	let items: $.Slice<item | $.VarRef<item> | null> = $.arrayToSlice<item | $.VarRef<item> | null>([new item({value: "first"}), new item({value: "second"})])
	let cloned: $.Slice<item | $.VarRef<item> | null> = (cloneSlice({T: { type: { kind: $.TypeKind.Pointer, elemType: "main.item" }, zero: () => null }}, items) as $.Slice<item | $.VarRef<item> | null>)
	$.println($.len(cloned), $.pointerValue<item>(cloned![0]).value, $.pointerValue<item>(cloned![1]).value, cloned![0] == items![0])
}

if ($.isMainScript(import.meta)) {
	await main()
}
