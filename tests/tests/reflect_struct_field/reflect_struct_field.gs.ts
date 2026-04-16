// Generated file based on reflect_struct_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

export async function main(): Promise<void> {
	// Test creating a StructField value
	let field = $.markAsStructValue(new reflect.StructField({Name: "TestField", Type: reflect.TypeOf("")}))
	$.println("StructField Name:", field.Name)
	$.println("StructField Type:", field.Type!.String())
}

