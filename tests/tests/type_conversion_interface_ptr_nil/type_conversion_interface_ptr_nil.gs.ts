// Generated file based on type_conversion_interface_ptr_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

export type Stringer = null | {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]
)

export async function main(): Promise<void> {
	let t = reflect.TypeFor({T: { zero: () => null }})
	$.println("Type:", t.String())
	$.println("Kind:", t.Kind())
	let elem = t.Elem()
	$.println("Elem Type:", elem.String())
	$.println("Elem Kind:", elem.Kind())
}


if ($.isMainScript(import.meta)) {
	await main()
}
