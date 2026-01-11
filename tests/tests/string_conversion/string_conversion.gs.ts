// Generated file based on string_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// === string(string) Conversion ===
	let myVar = "hello world"
	$.println(myVar)

	// === string(rune) Conversion ===
	let r = 65
	let s = $.runeOrStringToString(r)
	$.println(s)

	// 'a'
	let r2: number = 97
	let s2 = $.runeOrStringToString(r2)
	$.println(s2)

	// '€'
	let r3: number = 0x20AC
	let s3 = $.runeOrStringToString(r3)
	$.println(s3)

	// === string([]rune) Conversion ===
	let myRunes = $.arrayToSlice<number>([71, 111, 83, 99, 114, 105, 112, 116])
	let myStringFromRunes = $.runesToString(myRunes)
	$.println(myStringFromRunes)

	let emptyRunes = $.arrayToSlice<number>([])
	let emptyStringFromRunes = $.runesToString(emptyRunes)
	$.println(emptyStringFromRunes)

	// === []rune(string) and string([]rune) Round Trip ===
	let originalString = "你好世界" // Example with multi-byte characters
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
	let bytes = new Uint8Array([72, 101, 108, 108, 111])
	let bytesString = $.bytesToString(bytes)
	$.println(bytesString)

	// string(int32) conversion
	let i32 = (66 as number)
	let i32String = $.runeOrStringToString(i32)
	$.println(i32String)

	// Test with interface{} type assertion
	let v: null | any = "interface test"
	let interfaceString = $.mustTypeAssert<string>(v, {kind: $.TypeKind.Basic, name: 'string'})
	$.println(interfaceString)

	// Test with type conversion through variable
	let myString: string = "variable test"
	let convertedString = myString
	$.println(convertedString)

	// === Test string(byte) conversion ===
	let b: number = 65
	let byteString = $.runeOrStringToString(b)
	$.println(byteString)
}

