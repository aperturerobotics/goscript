// Generated file based on type_conversion_interface_ptr_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

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

	// Get the type
	let t = reflect.PointerTo(reflect.getInterfaceTypeByName("main.Stringer"))
	$.println("Type:", t!.String())
	$.println("Kind:", t!.Kind())

	// Get the element type (the interface type itself)
	let elem = t!.Elem()
	$.println("Elem Type:", elem!.String())
	$.println("Elem Kind:", elem!.Kind())
}


if ($.isMainScript(import.meta)) {
	await main()
}
