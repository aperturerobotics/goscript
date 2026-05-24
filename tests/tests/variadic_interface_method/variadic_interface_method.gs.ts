// Generated file based on variadic_interface_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export type Basic = null | {
	Join(elem: $.Slice<string>): string
}

$.registerInterfaceType(
	"main.Basic",
	null,
	[{ name: "Join", args: [{ name: "elem", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export class PathJoiner {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): PathJoiner {
		const cloned = new PathJoiner()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Join(elem: $.Slice<string>): string {
		const p = this
		let result: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		for (let __goscriptRangeTarget0 = elem, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let e = __goscriptRangeTarget0![i]
			if (i > 0) {
				result.value.WriteString("/")
			}
			result.value.WriteString(e)
		}
		return result.value.String()
	}

	static __typeInfo = $.registerStructType(
		"main.PathJoiner",
		() => new PathJoiner(),
		[{ name: "Join", args: [], returns: [] }],
		PathJoiner,
		{}
	)
}

export async function main(): globalThis.Promise<void> {
	let b: Basic | null = $.interfaceValue<Basic | null>($.markAsStructValue(new PathJoiner()), "main.PathJoiner")

	// Test with multiple arguments
	let result1 = $.pointerValue<Exclude<Basic, null>>(b).Join($.arrayToSlice<string>(["path", "to", "file"]))
	$.println("Result1:", result1)

	// Test with single argument
	let result2 = $.pointerValue<Exclude<Basic, null>>(b).Join($.arrayToSlice<string>(["single"]))
	$.println("Result2:", result2)

	// Test with no arguments
	let result3 = $.pointerValue<Exclude<Basic, null>>(b).Join(null)
	$.println("Result3:", result3)

	// Test with slice expansion
	let parts: $.Slice<string> = $.arrayToSlice<string>(["another", "path", "here"])
	let result4 = $.pointerValue<Exclude<Basic, null>>(b).Join(parts)
	$.println("Result4:", result4)
}

if ($.isMainScript(import.meta)) {
	await main()
}
