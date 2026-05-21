// Generated file based on interface_multi_param_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MultiParamReturner = null | {
	Process(data: $.Slice<number>, count: number, _: string): [boolean, $.GoError]
}

$.registerInterfaceType(
	"main.MultiParamReturner",
	null,
	[{ name: "Process", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { name: "count", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "_r1", type: "error" }] }]
)

export class MyProcessor {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyProcessor {
		const cloned = new MyProcessor()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Process(data: $.Slice<number>, count: number, _: string): [boolean, $.GoError] {
		const p = this
		// Dummy implementation
		if ((count > 0) && ($.len(data) > 0)) {
			$.println("Processing successful")
			return [true, null]
		}
		$.println("Processing failed")
		return [false, null]
	}

	static __typeInfo = $.registerStructType(
		"main.MyProcessor",
		new MyProcessor(),
		[{ name: "Process", args: [], returns: [] }],
		MyProcessor,
		{}
	)
}

export async function main(): Promise<void> {
	let processor: MultiParamReturner | null = $.interfaceValue<MultiParamReturner | null>($.markAsStructValue(new MyProcessor()), "main.MyProcessor")

	let data = $.arrayToSlice<number>([1, 2, 3])
	let [success, ] = $.pointerValue(processor).Process(data, 5, "unused")

	if (success) {
		$.println("Main: Success reported")
	} else {
		$.println("Main: Failure reported")
	}

	// test case: re-use success variable, ignore second variable
	let __goscriptTuple0 = $.pointerValue(processor).Process(data, 5, "unused")
	success = __goscriptTuple0[0]
	if (success) {
		$.println("Main: Success reported")
	} else {
		$.println("Main: Failure reported")
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
