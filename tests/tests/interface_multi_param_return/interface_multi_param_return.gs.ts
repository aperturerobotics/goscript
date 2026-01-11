// Generated file based on interface_multi_param_return.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MultiParamReturner = null | {
	Process(data: $.Bytes, count: number, _p2: string): [boolean, $.GoError]
}

$.registerInterfaceType(
  'main.MultiParamReturner',
  null, // Zero value for interface is null
  [{ name: "Process", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "count", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }]
);

export class MyProcessor {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): MyProcessor {
		const cloned = new MyProcessor()
		cloned._fields = {
		}
		return cloned
	}

	public Process(data: $.Bytes, count: number, _: string): [boolean, $.GoError] {
		if (count > 0 && $.len(data) > 0) {
			$.println("Processing successful")
			return [true, null]
		}
		$.println("Processing failed")
		return [false, null]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.MyProcessor',
	  new MyProcessor(),
	  [{ name: "Process", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "count", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  MyProcessor,
	  {}
	);
}

export async function main(): Promise<void> {
	let processor: MultiParamReturner = $.markAsStructValue(new MyProcessor({}))

	let data = new Uint8Array([1, 2, 3])
	let [success, ] = processor!.Process(data, 5, "unused")

	if (success) {
		$.println("Main: Success reported")
	} else {
		$.println("Main: Failure reported")
	}

	// test case: re-use success variable, ignore second variable
	;[success] = processor!.Process(data, 5, "unused")
	if (success) {
		$.println("Main: Success reported")
	} else {
		$.println("Main: Failure reported")
	}
}

