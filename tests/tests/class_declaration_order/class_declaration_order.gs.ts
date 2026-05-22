// Generated file based on class_declaration_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class lateType {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): lateType {
		const cloned = new lateType()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Name(): string {
		return "late"
	}

	static __typeInfo = $.registerStructType(
		"main.lateType",
		() => new lateType(),
		[{ name: "Name", args: [], returns: [] }],
		lateType,
		{}
	)
}

export type named = null | {
	Name(): string
}

$.registerInterfaceType(
	"main.named",
	null,
	[{ name: "Name", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export let defaultNamed: named | null = $.interfaceValue<named | null>(new lateType(), "*main.lateType")

export function __goscript_set_defaultNamed(value: named | null): void {
	defaultNamed = value
}

export async function main(): globalThis.Promise<void> {
	$.println($.pointerValue<Exclude<named, null>>(defaultNamed).Name())
}

if ($.isMainScript(import.meta)) {
	await main()
}
