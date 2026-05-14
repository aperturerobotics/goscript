// Generated file based on package_import_strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as strings from "@goscript/strings/index.ts"

export async function main(): Promise<void> {
	let builder: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	builder.value.WriteString("Hello")
	builder.value.WriteString(" ")
	builder.value.WriteString("World")
	let result = builder.value.String()
	$.println("Result:", result)
	let builderPtr = new strings.Builder()
	$.pointerValue(builderPtr).WriteString("Direct make test")
	$.println("Direct:", $.pointerValue(builderPtr).String())
}


if ($.isMainScript(import.meta)) {
	await main()
}
