// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Score = number

export type Describer = {
	Describe(): string
}

$.registerInterfaceType(
	"main.Describer",
	null,
	[{ name: "Describe", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export type Ordered = any

$.registerInterfaceType(
	"main.Ordered",
	null,
	[]
)

export type Set = Map<any, {}> | null

export class User {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Points(): Score {
		return this._fields.Points.value
	}
	public set Points(value: Score) {
		this._fields.Points.value = value
	}

	public get Tags(): $.Slice<string> {
		return this._fields.Tags.value
	}
	public set Tags(value: $.Slice<string>) {
		this._fields.Tags.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Points: $.VarRef<Score>
		Tags: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{Name?: string, Points?: Score, Tags?: $.Slice<string>}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Points: $.varRef(init?.Points ?? 0),
			Tags: $.varRef(init?.Tags ?? null)
		}
	}

	public clone(): User {
		const cloned = new User()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Points: $.varRef(this._fields.Points.value),
			Tags: $.varRef(this._fields.Tags.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AddPoints(points: Score): void {
		let u: User | $.VarRef<User> | null = this
		$.pointerValue<User>(u).Points = $.pointerValue<User>(u).Points + (points)
	}

	public Clone(): User {
		const u = this
		return $.markAsStructValue(new User({Name: u.Name, Points: u.Points, Tags: $.append($.arrayToSlice<string>([]), ...(u.Tags ?? []))}))
	}

	public Describe(): string {
		const u = this
		return u.Name
	}

	static __typeInfo = $.registerStructType(
		"main.User",
		() => new User(),
		[{ name: "AddPoints", args: [], returns: [] }, { name: "Clone", args: [], returns: [] }, { name: "Describe", args: [], returns: [] }],
		User,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Points": { kind: $.TypeKind.Basic, name: "int", typeName: "main.Score" }, "Tags": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }}
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

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		[],
		Pair,
		{"First": { kind: $.TypeKind.Interface, methods: [] }, "Second": { kind: $.TypeKind.Interface, methods: [] }}
	)
}

export function NewUser(name: string, points: Score, tags: $.Slice<string>): User {
	return $.markAsStructValue(new User({Name: name, Points: points, Tags: $.append($.arrayToSlice<string>([]), ...(tags ?? []))}))
}

export function Min(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): any {
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

export function Swap(__typeArgs: $.GenericTypeArgs | undefined, pair: Pair): Pair {
	return $.markAsStructValue(new Pair({First: pair.Second, Second: pair.First}))
}

export async function Filter<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>, keep: ((_p0: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<$.Slice<T>> {
	let filtered: $.Slice<T> = $.makeSlice<T>(0, $.len(items))
	for (let __goscriptRangeTarget1 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let item = __goscriptRangeTarget1![__rangeIndex]
		if (await keep!(item)) {
			filtered = $.append(filtered, item)
		}
	}
	return filtered
}

export function SumValues(__typeArgs: $.GenericTypeArgs | undefined, values: Map<any, number> | null): number {
	let sum = 0
	for (const [__rangeKey, value] of values?.entries() ?? []) {
		sum = sum + (value)
	}
	return sum
}

export function Classify(value: any): string {
	{
		const __goscriptTypeSwitchValue = value
		switch (true) {
			case $.typeAssert<User>(__goscriptTypeSwitchValue, "main.User").ok:
				{
					let v: User = $.typeAssert<User>(__goscriptTypeSwitchValue, "main.User").value
					return v.Name
				}
				break
			case $.typeAssert<User | $.VarRef<User> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.User" }).ok:
				{
					let v: User | $.VarRef<User> | null = $.typeAssert<User | $.VarRef<User> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.User" }).value
					return $.pointerValue<User>(v).Name
				}
				break
			case $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
				{
					let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
					return v
				}
				break
			default:
				{
					let v: any = __goscriptTypeSwitchValue
					return "unknown"
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function SendAll<T>(__typeArgs: $.GenericTypeArgs | undefined, out: $.Channel<any> | null, values: $.Slice<T>): globalThis.Promise<void> {
	for (let __goscriptRangeTarget2 = values, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let value = __goscriptRangeTarget2![__rangeIndex]
		await $.chanSend(out, value)
	}
}

export async function Collect<T>(__typeArgs: $.GenericTypeArgs | undefined, _in: $.Channel<any> | null, count: number): globalThis.Promise<$.Slice<T>> {
	let values: $.Slice<T> = $.makeSlice<T>(0, count)
	for (let __rangeIndex = 0; __rangeIndex < count; __rangeIndex++) {
		values = $.append(values, await $.chanRecv(_in))
	}
	return values
}

export function cleanup(label: string): void {
	$.println("cleanup:", label)
}

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	__defer.defer(() => { cleanup("simple") })

	$.println("GoScript feature tour")

	let user = $.varRef($.markAsStructValue($.cloneStructValue(NewUser("ada", 7, $.arrayToSlice<string>(["go", "wasm"])))))
	user.value.AddPoints(5)
	let clone = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(user.value)).Clone()))
	clone.Tags![0] = "typescript"
	$.println("struct:", user.value.Name, user.value.Points, user.value.Tags![0], clone.Tags![0])

	let describer: Describer | null = $.interfaceValue<Describer | null>($.markAsStructValue($.cloneStructValue(user.value)), "main.User")
	$.println("interface:", $.pointerValue<Exclude<Describer, null>>(describer).Describe())
	$.println("type switch:", Classify($.interfaceValue<any>(user, "*main.User")), Classify(42))

	let seen: Set = (NewSet(undefined, $.arrayToSlice<string>(["go", "ts"])) as Set)
	Set_Add(seen, "wasm")
	$.println("set:", Set_Has(seen, "go"), Set_Has(seen, "rust"), $.len(seen))

	let scores: Map<string, number> | null = new Map<string, number>([["go", 3], ["ts", 4], ["wasm", 5]])
	$.println("map:", SumValues(undefined, scores))

	let nums: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let evens: $.Slice<number> = (await Filter({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, nums, $.functionValue((n: number): boolean => {
		return (n % 2) == 0
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<number>)
	$.println("filter:", $.len(evens), evens![0], evens![1])

	let swapped = ($.markAsStructValue($.cloneStructValue(Swap({A: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }, B: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, $.markAsStructValue(new Pair({First: "answer", Second: 42}))))) as Pair)
	$.println("pair:", swapped.First, swapped.Second)

	$.println("min:", Min({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 8, 3), Min({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "main.Score" }, zero: () => 0 }}, 9, 4), Min({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, "go", "ts"))

	let ch = $.makeChannel<number>(3, 0, "both")
	queueMicrotask(async () => { await SendAll({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ch, $.goSlice(nums, undefined, 3)) })
	let collected: $.Slice<number> = (await Collect(undefined, ch, 3) as $.Slice<number>)
	$.println("channel:", $.len(collected), collected![0], collected![2])

	let ready = $.makeChannel<string>(1, "", "both")
	await $.chanSend(ready, "buffered")
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: ready,
			onSelected: async (__goscriptSelect0Result) => {
				let msg = __goscriptSelect0Result.value
				$.println("select:", msg)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				$.println("select: default")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
