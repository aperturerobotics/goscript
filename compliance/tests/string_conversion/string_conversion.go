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

	// string(int32) conversion
	i32 := int32(66)
	i32String := string(i32)
	println(i32String)

	// Test with interface{} type assertion
	var v interface{} = "interface test"
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
