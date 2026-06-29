// Generated file based on runtime_trace_empty.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as trace from "@goscript/runtime/trace/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/fmt/index.js"
import "@goscript/runtime/trace/index.js"

export class byteSink {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): byteSink {
		const cloned = new byteSink()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let s: byteSink | $.VarRef<byteSink> | null = this
		$.pointerValue<byteSink>(s).data = $.appendSlice($.pointerValue<byteSink>(s).data, p)
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.byteSink",
		() => new byteSink(),
		[{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		byteSink,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export const hexDigits: string = "0123456789abcdef"

export function toHex(b: $.Slice<number>): string {
	let out: $.Slice<number> = $.makeSlice<number>($.len(b) * 2, undefined, "byte")
	for (let __goscriptRangeTarget0 = b, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let c = __goscriptRangeTarget0![i]
		out![i * 2] = $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(c, 4, 8)), 8)
		out![(i * 2) + 1] = $.uint($.indexStringOrBytes("0123456789abcdef", c & 0x0f), 8)
	}
	return $.bytesToString(out)
}

export async function main(): globalThis.Promise<void> {
	let sink: byteSink | $.VarRef<byteSink> | null = new byteSink()
	{
		let err = trace.Start($.pointerValueOrNil($.interfaceValue<io.Writer | null>(sink, "*main.byteSink"))!)
		if (err != null) {
			fmt.Println("ERROR:" + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	trace.Stop()

	fmt.Println(toHex($.pointerValue<byteSink>(sink).data))
}

if ($.isMainScript(import.meta)) {
	await main()
}
