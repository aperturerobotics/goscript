// Generated file based on string_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let myVar = "hello world"
	$.println(myVar)
	let r = 65
	let s = String.fromCodePoint(r)
	$.println(s)
	let r2: number = 97
	let s2 = String.fromCodePoint(r2)
	$.println(s2)
	let r3: number = 0x20AC
	let s3 = String.fromCodePoint(r3)
	$.println(s3)
	let myRunes = [71, 111, 83, 99, 114, 105, 112, 116]
	let myStringFromRunes = $.runesToString(myRunes)
	$.println(myStringFromRunes)
	let emptyRunes = $.arrayToSlice<number>([])
	let emptyStringFromRunes = $.runesToString(emptyRunes)
	$.println(emptyStringFromRunes)
	let originalString = "你好世界"
	let runesFromString = $.stringToRunes(originalString)
	let stringFromRunes = $.runesToString(runesFromString)
	$.println(originalString)
	$.println(stringFromRunes)
	$.println(originalString == stringFromRunes)
	let mutableRunes = $.stringToRunes("Mutable String")
	mutableRunes![0] = 109
	mutableRunes![8] = 115
	let modifiedString = $.runesToString(mutableRunes)
	$.println(modifiedString)
	let bytes = [72, 101, 108, 108, 111]
	let bytesString = $.bytesToString(bytes)
	$.println(bytesString)
	let i32 = $.int(66)
	let i32String = String.fromCodePoint(i32)
	$.println(i32String)
	let v: any = "interface test"
	let interfaceString = $.mustTypeAssert<string>(v, { kind: $.TypeKind.Basic, name: "string" })
	$.println(interfaceString)
	let myString: string = "variable test"
	let convertedString = myString
	$.println(convertedString)
	let b: number = 65
	let byteString = String.fromCodePoint(b)
	$.println(byteString)
}


if ($.isMainScript(import.meta)) {
	await main()
}
