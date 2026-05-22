// Generated file based on string_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// === string(string) Conversion ===
	let myVar = "hello world"
	$.println(myVar)

	// === string(rune) Conversion ===
	let r = 65
	let s = String.fromCodePoint(r)
	$.println(s)

	let r2: number = 97
	let s2 = String.fromCodePoint(r2)
	$.println(s2)

	let r3: number = 0x20AC
	let s3 = String.fromCodePoint(r3)
	$.println(s3)

	// === string([]rune) Conversion ===
	let myRunes = $.arrayToSlice<number>([71, 111, 83, 99, 114, 105, 112, 116])
	let myStringFromRunes = $.runesToString(myRunes)
	$.println(myStringFromRunes)

	let emptyRunes = $.arrayToSlice<number>([])
	let emptyStringFromRunes = $.runesToString(emptyRunes)
	$.println(emptyStringFromRunes)

	// === []rune(string) and string([]rune) Round Trip ===
	let originalString = "你好世界"
	let runesFromString = $.stringToRunes(originalString)
	let stringFromRunes = $.runesToString(runesFromString)
	$.println(originalString)
	$.println(stringFromRunes)
	$.println(originalString == stringFromRunes)

	// === Modify []rune and convert back to string ===
	let mutableRunes = $.stringToRunes("Mutable String")
	mutableRunes![0] = 109
	mutableRunes![8] = 115
	let modifiedString = $.runesToString(mutableRunes)
	$.println(modifiedString)

	// === Test cases that might trigger "unhandled string conversion" ===

	// string([]byte) conversion
	let bytes = $.arrayToSlice<number>([72, 101, 108, 108, 111])
	let bytesString = $.bytesToString(bytes)
	$.println(bytesString)

	// string(int32) conversion
	let i32 = $.int(66)
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
	let b: number = 65
	let byteString = String.fromCodePoint(b)
	$.println(byteString)
}


if ($.isMainScript(import.meta)) {
	await main()
}
