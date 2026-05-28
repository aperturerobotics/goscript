// Generated file based on package_import_encoding_binary.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/encoding/binary/index.js"

export async function main(): globalThis.Promise<void> {
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let signed: number = $.int(2, 32)
	{
		let err = await binary.Write($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer"), $.interfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))), "binary.bigEndian"), $.namedValueInterfaceValue<any>(signed, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }))
		if (err != null) {
			$.println("write signed error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	{
		let err = await binary.Write($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer"), $.interfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))), "binary.bigEndian"), $.namedValueInterfaceValue<any>($.uint(3, 32), "uint32", {}, { kind: $.TypeKind.Basic, name: "uint32" }))
		if (err != null) {
			$.println("write unsigned error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	let out: $.Slice<number> = buf.value.Bytes()
	$.println("len:", $.len(out))
	for (let __goscriptRangeTarget0 = out, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let b = __goscriptRangeTarget0![__rangeIndex]
		$.println($.int(b))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}
