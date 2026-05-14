// Generated file based on reflect_struct_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as reflect from "@goscript/reflect/index.ts"

export async function main(): Promise<void> {
	let field = $.markAsStructValue(new reflect.StructField({Name: "TestField", Type: reflect.TypeFor({T: { zero: () => "" }})}))
	$.println("StructField Name:", field.Name)
	$.println("StructField Type:", field.Type.String())
}


if ($.isMainScript(import.meta)) {
	await main()
}
