// Generated file based on generics_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Ordered = any

$.registerInterfaceType(
	"main.Ordered",
	null,
	[]
);

export type Score = number

export type Set = Map<any, {}> | null

export type Cloner = {
	Clone(): any
}

$.registerInterfaceType(
	"main.Cloner",
	null,
	[{ name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class Stack {
	public get items(): $.Slice<any> {
		return this._fields.items.value
	}
	public set items(value: $.Slice<any>) {
		this._fields.items.value = value
	}

	public _fields: {
		items: $.VarRef<$.Slice<any>>
	}

	constructor(init?: Partial<{items?: $.Slice<any>}>) {
		this._fields = {
			items: $.varRef(init?.items ?? null)
		}
	}

	public clone(): Stack {
		const cloned = new Stack()
		cloned._fields = {
			items: $.varRef(this._fields.items.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Len(): number {
		const s: Stack | $.VarRef<Stack> | null = this
		return $.len($.pointerValue<Stack>(s).items)
	}

	public Pop(): [any, boolean] {
		let s: Stack | $.VarRef<Stack> | null = this
		if ($.len($.pointerValue<Stack>(s).items) == 0) {
			$.panic("pop from empty stack")
		}
		let last = $.len($.pointerValue<Stack>(s).items) - 1
		let value = $.pointerValue<Stack>(s).items![last]
		$.pointerValue<Stack>(s).items = $.goSlice($.pointerValue<Stack>(s).items, undefined, last)
		return [value, true]
	}

	public Push(value: any): void {
		let s: Stack | $.VarRef<Stack> | null = this
		$.pointerValue<Stack>(s).items = $.append($.pointerValue<Stack>(s).items, value)
	}

	static __typeInfo = $.registerStructType(
		"main.Stack",
		() => new Stack(),
		[{ name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Pop", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Push", args: [{ name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }],
		Stack,
		[{ name: "items", key: "items", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/generics_basic", index: [0], offset: 0, exported: false }]
	)
}

export class Item {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
	}

	constructor(init?: Partial<{Name?: string}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? "")
		}
	}

	public clone(): Item {
		const cloned = new Item()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Clone(): Item | $.VarRef<Item> | null {
		const i: Item | $.VarRef<Item> | null = this
		if (i == null) {
			return null
		}
		return new Item({Name: $.pointerValue<Item>(i).Name + " copy"})
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		[{ name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "main.Item" } }] }],
		Item,
		[{ name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }]
	)
}

export class Mapper {
	public get values(): Map<any, any> | null {
		return this._fields.values.value
	}
	public set values(value: Map<any, any> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<Map<any, any> | null>
	}

	constructor(init?: Partial<{values?: Map<any, any> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? null)
		}
	}

	public clone(): Mapper {
		const cloned = new Mapper()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Get(key: any): [any, boolean] {
		const m: Mapper | $.VarRef<Mapper> | null = this
		let [value, ok] = $.mapGet($.pointerValue<Mapper>(m).values, key, null)
		return [value, ok]
	}

	public Put(key: any, value: any): void {
		let m: Mapper | $.VarRef<Mapper> | null = this
		$.mapSet($.pointerValue<Mapper>(m).values, key, value)
	}

	static __typeInfo = $.registerStructType(
		"main.Mapper",
		() => new Mapper(),
		[{ name: "Get", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Put", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }],
		Mapper,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Interface, methods: [] }, elemType: { kind: $.TypeKind.Interface, methods: [] } }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/generics_basic", index: [0], offset: 0, exported: false }]
	)
}

export class Pair {
	public get First(): any {
		return this._fields.First.value
	}
	public set First(value: any) {
		this._fields.First.value = value
	}

	public get Second(): any {
		return this._fields.Second.value
	}
	public set Second(value: any) {
		this._fields.Second.value = value
	}

	public _fields: {
		First: $.VarRef<any>
		Second: $.VarRef<any>
	}

	constructor(init?: Partial<{First?: any, Second?: any}>) {
		this._fields = {
			First: $.varRef(init?.First ?? null),
			Second: $.varRef(init?.Second ?? null)
		}
	}

	public clone(): Pair {
		const cloned = new Pair()
		cloned._fields = {
			First: $.varRef(this._fields.First.value),
			Second: $.varRef(this._fields.Second.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Swap(): Pair {
		const p = this
		return $.markAsStructValue(new Pair({First: p.Second, Second: p.First}))
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		[{ name: "Swap", args: [], returns: [{ name: "_r0", type: "main.Pair" }] }],
		Pair,
		[{ name: "First", key: "First", type: { kind: $.TypeKind.Interface, methods: [] }, index: [0], offset: 0, exported: true }, { name: "Second", key: "Second", type: { kind: $.TypeKind.Interface, methods: [] }, index: [1], offset: 0, exported: true }]
	)
}

export function min(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): any {
	if ((b as any) < (a as any)) {
		return b
	}
	return a
}

export function NewSet<T>(__typeArgs: $.GenericTypeArgs | undefined, values: $.Slice<T>): Set {
	let _set: Set = $.makeMap<any, {}>()
	for (let __goscriptRangeTarget0 = values, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let value = __goscriptRangeTarget0![__rangeIndex]
		$.mapSet(_set, value, {})
	}
	return _set
}

export function Set_Add(s: Set, value: any): void {
	$.mapSet(s, value, {})
}

export function Set_Has(s: Set, value: any): boolean {
	let [, ok] = $.mapGet(s, value, {})
	return ok
}

export function CloneAll<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>): $.Slice<T> {
	let clones: $.Slice<T> = $.makeSlice<T>(0, $.len(items))
	for (let __goscriptRangeTarget1 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let item = __goscriptRangeTarget1![__rangeIndex]
		clones = $.append(clones, $.callGenericMethod(__typeArgs, "T", "Clone", item))
	}
	return clones
}

export function NewMapper(__typeArgs: $.GenericTypeArgs | undefined): Mapper | $.VarRef<Mapper> | null {
	return new Mapper({values: $.makeMap<any, any>()})
}

export async function Apply(__typeArgs: $.GenericTypeArgs | undefined, value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): globalThis.Promise<any> {
	return await fn!(value)
}

export async function main(): globalThis.Promise<void> {
	$.println("=== Generic constraints ===")
	$.println("min:", min({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 8, 3), min({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.Score" }, zero: () => 0 }}, 9, 4), min({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, "go", "ts"))

	$.println("=== Generic stack ===")
	let stack: $.VarRef<Stack> = $.varRef($.markAsStructValue(new Stack()))
	stack.value.Push(10)
	stack.value.Push(20)
	let __goscriptTuple0: any = stack.value.Pop()
	let value = (__goscriptTuple0[0] as number)
	let ok = __goscriptTuple0[1]
	$.println("pop:", value, ok, stack.value.Len())
	let __goscriptTuple1: any = stack.value.Pop()
	value = (__goscriptTuple1[0] as number)
	ok = __goscriptTuple1[1]
	$.println("pop:", value, ok, stack.value.Len())

	$.println("=== Generic map alias ===")
	let seen: Set = (NewSet(undefined, $.arrayToSlice<string>(["go", "ts"])) as Set)
	Set_Add(seen, "wasm")
	$.println("set:", Set_Has(seen, "go"), Set_Has(seen, "rust"), $.len(seen))

	$.println("=== Interface constraint ===")
	let items: $.Slice<Item | $.VarRef<Item> | null> = $.arrayToSlice<Item | $.VarRef<Item> | null>([new Item({Name: "alpha"}), new Item({Name: "beta"})])
	let clones: $.Slice<Item | $.VarRef<Item> | null> = (CloneAll({T: { type: { kind: $.TypeKind.Pointer, elemType: "main.Item" }, zero: () => null }}, items) as $.Slice<Item | $.VarRef<Item> | null>)
	$.println("clone:", $.pointerValue<Item>(clones![0]).Name, $.pointerValue<Item>(clones![1]).Name, clones![0] == items![0])

	$.println("=== Generic struct with map field ===")
	let mapper: Mapper | $.VarRef<Mapper> | null = (NewMapper({K: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, V: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}) as Mapper | $.VarRef<Mapper> | null)
	Mapper.prototype.Put.call(mapper, "answer", 42)
	let __goscriptTuple2: any = Mapper.prototype.Get.call(mapper, "answer")
	let answer = (__goscriptTuple2[0] as number)
	let found = __goscriptTuple2[1]
	$.println("mapper:", answer, found)

	$.println("=== Function instantiation ===")
	let applyInt: ((value: number, fn: ((_p0: number) => number | globalThis.Promise<number>) | null) => number | globalThis.Promise<number>) | null = $.functionValue(async (value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): globalThis.Promise<any> => await Apply({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, value, fn), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))
	$.println("apply:", await applyInt!(21, $.functionValue((n: number): number => {
		return n * 2
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo))))

	$.println("=== Generic pair method ===")
	let pair = $.markAsStructValue(new Pair({First: "left", Second: "right"}))
	let swapped = ($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(pair)).Swap())) as Pair)
	$.println("pair:", swapped.First, swapped.Second)
}

if ($.isMainScript(import.meta)) {
	await main()
}
