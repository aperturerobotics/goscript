// Generated file based on package_import_strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	// This should trigger the unhandled make call error
	// strings.Builder uses make internally for its buffer
	let builder: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	builder.value.WriteString("Hello")
	builder.value.WriteString(" ")
	builder.value.WriteString("World")
	let [n, err] = builder.value.Write(new Uint8Array([33]))
	$.println("Write:", n, err == null)

	let result = builder.value.String()
	$.println("Result:", result)
	printBuilderPointer(builder)
	$.println("After pointer:", builder.value.String())

	// Also test direct make with strings.Builder
	let builderPtr: strings.Builder | $.VarRef<strings.Builder> | null = new strings.Builder()
	strings.Builder.prototype.WriteString.call(builderPtr, "Direct make test")
	$.println("Direct:", strings.Builder.prototype.String.call(builderPtr))
	$.println("LastIndexByte:", strings.LastIndexByte("hello", $.uint(108, 8)))
	$.println("LastIndex:", strings.LastIndex("hello", "l"))
}

export function printBuilderPointer(builder: strings.Builder | $.VarRef<strings.Builder> | null): void {
	$.println("Pointer Len Before:", strings.Builder.prototype.Len.call(builder))
	strings.Builder.prototype.WriteString.call(builder, " Pointer")
	$.println("Pointer Len After:", strings.Builder.prototype.Len.call(builder))
}

if ($.isMainScript(import.meta)) {
	await main()
}
