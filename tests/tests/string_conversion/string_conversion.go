package main

func main() {
	// === string(string) Conversion ===
	myVar := string("hello world")
	println(myVar)

	// === string(rune) Conversion ===
	r := 'A'
	s := string(r)
	println(s)

	var r2 rune = 97 // 'a'
	s2 := string(r2)
	println(s2)

	var r3 rune = 0x20AC // '€'
	s3 := string(r3)
	println(s3)

	// === string([]rune) Conversion ===
	myRunes := []rune{'G', 'o', 'S', 'c', 'r', 'i', 'p', 't'}
	myStringFromRunes := string(myRunes)
	println(myStringFromRunes)

	emptyRunes := []rune{}
	emptyStringFromRunes := string(emptyRunes)
	println(emptyStringFromRunes)

	// === []rune(string) and string([]rune) Round Trip ===
	originalString := "你好世界" // Example with multi-byte characters
	runesFromString := []rune(originalString)
	stringFromRunes := string(runesFromString)
	println(originalString)
	println(stringFromRunes)
	println(originalString == stringFromRunes)

	// === Modify []rune and convert back to string ===
	mutableRunes := []rune("Mutable String")
	mutableRunes[0] = 'm'
	mutableRunes[8] = 's'
	modifiedString := string(mutableRunes)
	println(modifiedString)

	// === Test cases that might trigger "unhandled string conversion" ===

	// string([]byte) conversion
	bytes := []byte{72, 101, 108, 108, 111}
	bytesString := string(bytes)
	println(bytesString)
	println(string([]byte{0xea, 0x08, 0x00}) == "\xea\x08\x00")
	println(string([]byte{0xc3, 0xa9}) == "é")
	const magic = "\xff\x06\x00\x00S2sTwO"
	println(len(magic) == 10)
	magicBytes := []byte(magic)
	println(len(magicBytes) == 10)
	println(magicBytes[0] == 255)
	println(magicBytes[1] == 6)
	println(string(magicBytes) == magic)
	println(len("é") == 2)
	utf8Bytes := []byte("é")
	println(len(utf8Bytes) == 2)
	println(utf8Bytes[0] == 195)
	println(utf8Bytes[1] == 169)

	// string(int32) conversion
	i32 := int32(66)
	i32String := string(i32)
	println(i32String)

	// Test with interface{} type assertion
	var v any = "interface test"
	interfaceString := string(v.(string))
	println(interfaceString)

	// Test with type conversion through variable
	var myString string = "variable test"
	convertedString := string(myString)
	println(convertedString)

	// === Test string(byte) conversion ===
	var b byte = 65
	byteString := string(b)
	println(byteString)
}
