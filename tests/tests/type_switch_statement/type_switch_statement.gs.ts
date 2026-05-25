// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ObjectIdentifier = $.Slice<number>

export class RawValue {
	public get Tag(): number {
		return this._fields.Tag.value
	}
	public set Tag(value: number) {
		this._fields.Tag.value = value
	}

	public _fields: {
		Tag: $.VarRef<number>
	}

	constructor(init?: Partial<{Tag?: number}>) {
		this._fields = {
			Tag: $.varRef(init?.Tag ?? 0)
		}
	}

	public clone(): RawValue {
		const cloned = new RawValue()
		cloned._fields = {
			Tag: $.varRef(this._fields.Tag.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.RawValue",
		() => new RawValue(),
		[],
		RawValue,
		{"Tag": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	// Basic type switch with variable and default case
	let i: any = "hello"
	{
		const __goscriptTypeSwitchValue = i
		switch (true) {
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
					$.println("int", v)
				}
				break
			case $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
				{
					let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
					$.println("string", v)
				}
				break
			default:
				{
					let v: any = __goscriptTypeSwitchValue
					$.println("unknown")
				}
				break
		}
	}

	// Type switch without variable
	let x: any = 123
	{
		const __goscriptTypeSwitchValue = x
		switch (true) {
			case $.typeAssert<boolean>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).ok:
				{
					$.println("bool")
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				{
					$.println("int")
				}
				break
		}
	}

	// Type switch with multiple types in a case
	let y: any = true
	{
		const __goscriptTypeSwitchValue = y
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }):
				{
					let v = __goscriptTypeSwitchValue
					$.println("number", v)
				}
				break
			case $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }) || $.is(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }):
				{
					let v = __goscriptTypeSwitchValue
					$.println("string or bool", v)
				}
				break
		}
	}

	// Type switch with initialization statement
	let z = getInterface()
	{
		const __goscriptTypeSwitchValue = z
		switch (true) {
			case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
					$.println("z is int", v)
				}
				break
		}
	}

	// Default-only type switch
	let w: any = "test"
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				{
					$.println("default only")
				}
				break
		}
	}
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				{
					$.println("default only, value is", $.mustTypeAssert<string>(w, { kind: $.TypeKind.Basic, name: "string" }))
				}
				break
		}
	}

	for (let __goscriptRangeTarget0 = $.arrayToSlice<any>([$.int(7, 32)]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				default:
					{
						let v: any = __goscriptTypeSwitchValue
						$.println("shadow default", $.int($.mustTypeAssert<number>(v, { kind: $.TypeKind.Basic, name: "int" }), 32))
					}
					break
			}
		}
	}

	let count = 0
	for (let __goscriptRangeTarget1 = $.arrayToSlice<any>([1, "skip", 2]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				case $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
					{
						let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
						$.println("continue", v)
						continue
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
						count += v
					}
					break
			}
		}
		$.println("after switch")
	}
	$.println("type switch count", count)

	let oid: $.VarRef<ObjectIdentifier> = $.varRef(null as ObjectIdentifier)
	let ok = false
	let oidValue: any = $.interfaceValue<any>(oid, "*main.ObjectIdentifier")
	{
		const __goscriptTypeSwitchValue = oidValue
		switch (true) {
			case $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.ObjectIdentifier" }).ok:
				{
					let v: $.VarRef<ObjectIdentifier> | null = $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.ObjectIdentifier" }).value
					let __goscriptTuple0: any = parseObjectIdentifier()
					v!.value = (__goscriptTuple0[0] as ObjectIdentifier)
					ok = __goscriptTuple0[1]
				}
				break
		}
	}
	$.println("oid", $.len((oid.value as ObjectIdentifier)), oid.value![0], ok)

	let raw: $.VarRef<RawValue> = $.varRef($.markAsStructValue(new RawValue()))
	let rawValue: any = $.interfaceValue<any>(raw, "*main.RawValue")
	{
		const __goscriptTypeSwitchValue = rawValue
		switch (true) {
			case $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.RawValue" }).ok:
				{
					let v: RawValue | $.VarRef<RawValue> | null = $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "main.RawValue" }).value
					let __goscriptTuple1: any = parseRawValue()
					$.assignStruct($.pointerValue<RawValue>(v), __goscriptTuple1[0])
					ok = __goscriptTuple1[1]
				}
				break
		}
	}
	$.println("raw", raw.value.Tag, ok)
}

export function getInterface(): any {
	return 42
}

export function parseObjectIdentifier(): [ObjectIdentifier, boolean] {
	return [($.arrayToSlice<number>([1, 2, 3]) as ObjectIdentifier), true]
}

export function parseRawValue(): [RawValue, boolean] {
	return [$.markAsStructValue(new RawValue({Tag: 9})), true]
}

if ($.isMainScript(import.meta)) {
	await main()
}
