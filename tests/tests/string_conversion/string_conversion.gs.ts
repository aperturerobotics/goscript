// Generated file based on string_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// === string(string) Conversion ===
	let myVar = "hello world"
	$.println(myVar)

	// === string(rune) Conversion ===
	let r = $.int(65, 32)
	let s = String.fromCodePoint(r)
	$.println(s)

	let r2: number = $.int(97, 32)
	let s2 = String.fromCodePoint(r2)
	$.println(s2)

	let r3: number = $.int(0x20AC, 32)
	let s3 = String.fromCodePoint(r3)
	$.println(s3)

	// === string([]rune) Conversion ===
	let myRunes: $.Slice<number> = $.arrayToSlice<number>([$.int(71, 32), $.int(111, 32), $.int(83, 32), $.int(99, 32), $.int(114, 32), $.int(105, 32), $.int(112, 32), $.int(116, 32)])
	let myStringFromRunes = $.runesToString(myRunes)
	$.println(myStringFromRunes)

	let emptyRunes: $.Slice<number> = $.arrayToSlice<number>([])
	let emptyStringFromRunes = $.runesToString(emptyRunes)
	$.println(emptyStringFromRunes)

	// === []rune(string) and string([]rune) Round Trip ===
	let originalString = "你好世界"
	let runesFromString: $.Slice<number> = $.stringToRunes(originalString)
	let stringFromRunes = $.runesToString(runesFromString)
	$.println(originalString)
	$.println(stringFromRunes)
	$.println($.stringEqual(originalString, stringFromRunes))

	// === Modify []rune and convert back to string ===
	let mutableRunes: $.Slice<number> = $.stringToRunes("Mutable String")
	mutableRunes![0] = $.int(109, 32)
	mutableRunes![8] = $.int(115, 32)
	let modifiedString = $.runesToString(mutableRunes)
	$.println(modifiedString)

	// === Test cases that might trigger "unhandled string conversion" ===

	// string([]byte) conversion
	let bytes: $.Slice<number> = $.arrayToSlice<number>([$.uint(72, 8), $.uint(101, 8), $.uint(108, 8), $.uint(108, 8), $.uint(111, 8)])
	let bytesString = $.bytesToString(bytes)
	$.println(bytesString)
	$.println($.stringEqual($.bytesToString($.arrayToSlice<number>([$.uint(0xea, 8), $.uint(0x08, 8), $.uint(0x00, 8)])), $.bytesToString(new Uint8Array([234, 8, 0]))))
	$.println($.stringEqual($.bytesToString($.arrayToSlice<number>([$.uint(0xc3, 8), $.uint(0xa9, 8)])), "é"))
	const magic: string = $.bytesToString(new Uint8Array([255, 6, 0, 0, 83, 50, 115, 84, 119, 79]))
	$.println((10 as number) == 10)
	let magicBytes: $.Slice<number> = new Uint8Array([255, 6, 0, 0, 83, 50, 115, 84, 119, 79])
	$.println($.len(magicBytes) == 10)
	$.println($.uint($.arrayIndex(magicBytes!, 0), 8) == $.uint(255, 8))
	$.println($.uint($.arrayIndex(magicBytes!, 1), 8) == $.uint(6, 8))
	$.println($.stringEqual($.bytesToString(magicBytes), $.bytesToString(new Uint8Array([255, 6, 0, 0, 83, 50, 115, 84, 119, 79]))))
	$.println((2 as number) == 2)
	let utf8Bytes: $.Slice<number> = new Uint8Array([195, 169])
	$.println($.len(utf8Bytes) == 2)
	$.println($.uint($.arrayIndex(utf8Bytes!, 0), 8) == $.uint(195, 8))
	$.println($.uint($.arrayIndex(utf8Bytes!, 1), 8) == $.uint(169, 8))

	// string(int32) conversion
	let i32 = $.int($.int(66, 32), 32)
	let i32String = String.fromCodePoint(i32)
	$.println(i32String)

	// Test with interface{} type assertion
	let v: any = "interface test"
	let interfaceString = $.mustTypeAssert<string>(v, { kind: $.TypeKind.Basic, name: "string" })
	$.println(interfaceString)

	// Test with type conversion through variable
	let myString: string = "variable test"
	let convertedString = myString
	$.println(convertedString)

	// === Test string(byte) conversion ===
	let b: number = $.uint(65, 8)
	let byteString = String.fromCodePoint(b)
	$.println(byteString)
}

if ($.isMainScript(import.meta)) {
	await main()
}
