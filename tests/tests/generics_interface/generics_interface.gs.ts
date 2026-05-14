// Generated file based on generics_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Container = null | {
	Get(): any
	Set(_p0: any): void
	Size(): number
}

$.registerInterfaceType(
	"main.Container",
	null,
	[{ name: "Get", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Set", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
)

export type Comparable = null | {
	Compare(_p0: any): number
	Equal(_p0: any): boolean
}

$.registerInterfaceType(
	"main.Comparable",
	null,
	[{ name: "Compare", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Equal", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
)

export class ValueContainer {
	public get value(): any {
		return this._fields.value.value
	}
	public set value(value: any) {
		this._fields.value.value = value
	}

	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public _fields: {
		value: $.VarRef<any>
		count: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: any, count?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? null),
			count: $.varRef(init?.count ?? 0)
		}
	}

	public clone(): ValueContainer {
		const cloned = new ValueContainer()
		cloned._fields = {
			value: $.varRef(this._fields.value.value),
			count: $.varRef(this._fields.count.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Get(): any {
		const b = this
		return $.pointerValue(b).value
	}

	public Set(v: any): void {
		const b = this
		$.pointerValue(b).value = v
		$.pointerValue(b).count++
	}

	public Size(): number {
		const b = this
		return $.pointerValue(b).count
	}

	static __typeInfo = $.registerStructType(
		"main.ValueContainer",
		new ValueContainer(),
		[{ name: "Get", args: [], returns: [] }, { name: "Set", args: [], returns: [] }, { name: "Size", args: [], returns: [] }],
		ValueContainer,
		{"value": { kind: $.TypeKind.Interface, methods: [] }, "count": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export class StringValueContainer {
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

	public clone(): StringValueContainer {
		const cloned = new StringValueContainer()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Compare(other: string): number {
		const s = this
		if ($.pointerValue(s).value < other) {
			return -1
		} else {
			if ($.pointerValue(s).value > other) {
				return 1
			}
		}
		return 0
	}

	public Equal(other: string): boolean {
		const s = this
		return $.pointerValue(s).value == other
	}

	static __typeInfo = $.registerStructType(
		"main.StringValueContainer",
		new StringValueContainer(),
		[{ name: "Compare", args: [], returns: [] }, { name: "Equal", args: [], returns: [] }],
		StringValueContainer,
		{"value": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function useContainer(__typeArgs: $.GenericTypeArgs | undefined, c: Container, val: any): any {
	c.Set(val)
	return c.Get()
}

export function checkEqual(__typeArgs: $.GenericTypeArgs | undefined, c: Comparable, val: any): boolean {
	return c.Equal(val)
}

export async function main(): Promise<void> {
	$.println("=== Generic Interface Test ===")
	let intValueContainer = new ValueContainer()
	let result = useContainer({T: { zero: () => 0 }}, intValueContainer, 42)
	$.println("Int ValueContainer result:", result)
	$.println("Int ValueContainer size:", $.pointerValue(intValueContainer).Size())
	let stringValueContainer = new ValueContainer()
	let strResult = useContainer({T: { zero: () => "" }}, stringValueContainer, "hello")
	$.println("String ValueContainer result:", strResult)
	$.println("String ValueContainer size:", $.pointerValue(stringValueContainer).Size())
	let sb = new StringValueContainer({value: "test"})
	$.println("String comparison equal:", checkEqual({T: { zero: () => "" }}, sb, "test"))
	$.println("String comparison not equal:", checkEqual({T: { zero: () => "" }}, sb, "other"))
	$.println("String comparison -1:", $.pointerValue(sb).Compare("zebra"))
	$.println("String comparison 1:", $.pointerValue(sb).Compare("alpha"))
	$.println("String comparison 0:", $.pointerValue(sb).Compare("test"))
}


if ($.isMainScript(import.meta)) {
	await main()
}
