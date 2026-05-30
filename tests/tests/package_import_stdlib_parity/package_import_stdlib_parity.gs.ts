// Generated file based on package_import_stdlib_parity.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as scanner from "@goscript/go/scanner/index.js"

import * as hash from "@goscript/hash/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as mime from "@goscript/mime/index.js"

import * as os from "@goscript/os/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as zlib from "@goscript/compress/zlib/index.js"

import * as json from "@goscript/encoding/json/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/go/scanner/index.js"
import "@goscript/hash/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/mime/index.js"
import "@goscript/os/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/unicode/index.js"
import "@goscript/compress/zlib/index.js"
import "@goscript/encoding/json/index.js"

export class xof {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): xof {
		const cloned = new xof()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		return 1
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		return [$.len(p), null]
	}

	public Reset(): void {
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.xof",
		() => new xof(),
		[{ name: "BlockSize", args: [], returns: [] }, { name: "Read", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		xof,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let compact: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	json.Compact(compact, new Uint8Array([123, 32, 34, 120, 34, 32, 58, 32, 49, 32, 125]))
	let raw: json.RawMessage = ((compact.value.Bytes() as json.RawMessage) as json.RawMessage)
	let __goscriptTuple0: any = json.RawMessage_MarshalJSON(raw)
	let rawBytes: $.Slice<number> = __goscriptTuple0[0]
	let __goscriptTuple1: any = json.Number_Int64(String("42"))
	let num = $.int(__goscriptTuple1[0])
	$.println("json:", json.Valid(rawBytes), $.bytesToString(rawBytes), $.int(num))

	let __goscriptTuple2: any = mime.ParseMediaType("text/plain; charset=utf-8")
	let mediaType = __goscriptTuple2[0]
	let params: Map<string, string> | null = __goscriptTuple2[1]
	$.println("mime:", mediaType, $.mapGet(params, "charset", "")[0], mime.TypeByExtension(".json"), mime.WordEncoder_Encode(mime.BEncoding, "utf-8", "hi"))

	let [parsed, ] = strconv.ParseComplex("(1-2i)", 128)
	$.println("time:", time.RFC1123, time.Month_String(time.May))
	$.println("leaf:", $.uint(bits.Rem32($.uint(1, 32), $.uint(0, 32), $.uint(3, 32)), 32), strings.ToValidUTF8("abc", "?"), strconv.FormatComplex(parsed, $.uint(102, 8), -1, 128), $.int($.real(parsed)), $.int($.imag(parsed)), zlib.NoCompression, $.pointerValue<Exclude<$.GoError, null>>(os.ErrNoHandle).Error(), strings.ToUpperSpecial((unicode.TurkishCase as unicode.SpecialCase), "go"), $.stringEqual(strings.ToUpperSpecial((unicode.TurkishCase as unicode.SpecialCase), "iki"), "İKİ"))

	let scan: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	scanner.PrintError($.pointerValueOrNil($.interfaceValue<io.Writer | null>(scan, "*bytes.Buffer"))!, $.pointerValueOrNil(errors.New("scan failed"))!)
	$.println("scanner:", strings.TrimSpace(scan.value.String()))

	let h: hash.XOF | null = $.interfaceValue<hash.XOF | null>($.markAsStructValue(new xof()), "main.xof")
	$.println("hash:", $.pointerValue<Exclude<hash.XOF, null>>(h).BlockSize())
}

if ($.isMainScript(import.meta)) {
	await main()
}
