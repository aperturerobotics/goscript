// Generated file based on json_stream.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as strings from "@goscript/strings/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/fmt/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	// Compact preserves number literal spelling.
	let c: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	json.Compact(c, new Uint8Array([123, 34, 110, 34, 58, 32, 49, 101, 43, 48, 48, 44, 32, 34, 98, 105, 103, 34, 58, 32, 57, 48, 48, 55, 49, 57, 57, 50, 53, 52, 55, 52, 48, 57, 57, 51, 125]))
	fmt.Println(c.value.String())

	// Indent lays out the compact form with Go spacing.
	let ind: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	json.Indent(ind, new Uint8Array([123, 34, 97, 34, 58, 49, 44, 34, 98, 34, 58, 91, 50, 44, 51, 93, 125]), "", "  ")
	fmt.Println(ind.value.String())

	// Decoder reads one value per call and buffers the rest of the stream.
	let dec: json.Decoder | $.VarRef<json.Decoder> | null = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("1 2 3"), "*strings.Reader"))!)
	let n: $.VarRef<number> = $.varRef(0)
	while (json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(dec), $.interfaceValue<any>(n, "*int")) == null) {
		fmt.Println("decoded", $.namedValueInterfaceValue<any>(n.value, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
	}

	// UseNumber keeps the exact source literal beyond float64 precision.
	let und: json.Decoder | $.VarRef<json.Decoder> | null = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("{\"big\":9007199254740993}"), "*strings.Reader"))!)
	json.Decoder.prototype.UseNumber.call($.pointerValue<json.Decoder>(und))
	let m: $.VarRef<globalThis.Map<string, any> | null> = $.varRef(null as globalThis.Map<string, any> | null)
	json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(und), $.interfaceValue<any>(m, "*map[string]any"))
	fmt.Println("big", $.mapGet<string, any, any>(m.value, "big", null)[0])

	// A malformed document yields a *json.SyntaxError with the Go byte offset.
	let v: $.VarRef<any> = $.varRef(null as any)
	let err = json.Unmarshal(new Uint8Array([91, 49, 44, 93]), $.interfaceValue<any>(v, "*any"))
	{
		let __goscriptTuple0: any = $.typeAssertTuple<json.SyntaxError | $.VarRef<json.SyntaxError> | null>(err, { kind: $.TypeKind.Pointer, elemType: "json.SyntaxError" })
		let se: json.SyntaxError | $.VarRef<json.SyntaxError> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			fmt.Println("offset", $.namedValueInterfaceValue<any>($.pointerValue<json.SyntaxError>(se).Offset, "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }))
		}
	}

	// Token advances the stream; More reports remaining container elements.
	let mdec: json.Decoder | $.VarRef<json.Decoder> | null = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("[10,20]"), "*strings.Reader"))!)
	json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec))
	fmt.Println("more", json.Decoder.prototype.More.call($.pointerValue<json.Decoder>(mdec)))
	json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec))
	json.Decoder.prototype.Token.call($.pointerValue<json.Decoder>(mdec))
	fmt.Println("more", json.Decoder.prototype.More.call($.pointerValue<json.Decoder>(mdec)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
