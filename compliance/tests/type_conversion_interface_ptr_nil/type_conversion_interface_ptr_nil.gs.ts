// Generated file based on type_conversion_interface_ptr_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
  'main.Stringer',
  null, // Zero value for interface is null
  [{ name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }]
);

export async function main(): Promise<void> {
	// Create a typed nil pointer to interface
	let nilPtr: Stringer | null = $.typedNil("*main.Stringer")

	// Get the type
	let t = reflect.TypeOf(nilPtr)
	console.log("Type:", t!.String())
	console.log("Kind:", t!.Kind())

	// Get the element type (the interface type itself)
	let elem = t!.Elem()
	console.log("Elem Type:", elem!.String())
	console.log("Elem Kind:", elem!.Kind())
}

