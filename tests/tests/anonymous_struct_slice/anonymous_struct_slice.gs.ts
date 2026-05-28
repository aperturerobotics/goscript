// Generated file based on anonymous_struct_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class namedItem {
	public get key(): string {
		return this._fields.key.value
	}
	public set key(value: string) {
		this._fields.key.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		key: $.VarRef<string>
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{key?: string, data?: $.Slice<number>}>) {
		this._fields = {
			key: $.varRef(init?.key ?? ""),
			data: $.varRef(init?.data ?? null)
		}
	}

	public clone(): namedItem {
		const cloned = new namedItem()
		cloned._fields = {
			key: $.varRef(this._fields.key.value),
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.namedItem",
		() => new namedItem(),
		[],
		namedItem,
		{"key": { kind: $.TypeKind.Basic, name: "string" }, "data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }}
	)
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<{"name": string, "input": string, "count": number}>([{name: "first", input: "alpha", count: 1}, {name: "second", input: "beta", count: 2}]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let tt = __goscriptRangeTarget0![__rangeIndex]
		$.println(tt.name, tt.input, tt.count)
	}

	let x = {Name: "third", Offsets: (null as $.Slice<number>), Count: 3}
	x.Offsets = $.append(x.Offsets, 5)
	$.println(x.Name, x.Offsets![0], x.Count)

	let __goscriptTuple0: any = buildNamedItems()
	let items: $.Slice<namedItem> = __goscriptTuple0[0]
	for (let __goscriptRangeTarget1 = $.goSlice(items, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let item = __goscriptRangeTarget1![__rangeIndex]
		$.println(item.key, $.len(item.data))
	}
}

export function buildNamedItems(): [$.Slice<namedItem>, boolean] {
	return [$.arrayToSlice<namedItem>([$.markAsStructValue(new namedItem({key: "skip", data: $.arrayToSlice<number>([$.uint(0, 8)])})), $.markAsStructValue(new namedItem({key: "keep", data: $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])}))]), true]
}

if ($.isMainScript(import.meta)) {
	await main()
}
