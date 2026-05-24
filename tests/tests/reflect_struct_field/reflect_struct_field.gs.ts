// Generated file based on reflect_struct_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	// Test creating a StructField value
	let field = $.markAsStructValue(new reflect.StructField({Name: "TestField", Type: reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})}))
	$.println("StructField Name:", field.Name)
	$.println("StructField Type:", $.pointerValue<Exclude<reflect.Type, null>>(field.Type).String())
}

if ($.isMainScript(import.meta)) {
	await main()
}
