package main

import "unicode/utf8"

func checkBytes(label string, b []byte) {
	println(label, "RuneCount:", utf8.RuneCount(b))
	println(label, "Valid:", utf8.Valid(b))
	r, size := utf8.DecodeLastRune(b)
	println(label, "Last rune:", r, "size:", size)
}

func main() {
	// Test basic UTF-8 functions
	s := "Hello, 世界"

	// Test RuneCountInString
	count := utf8.RuneCountInString(s)
	println("Rune count:", count)

	// Test DecodeRuneInString
	r, size := utf8.DecodeRuneInString(s)
	println("First rune:", r, "size:", size)

	// Test ValidString
	valid := utf8.ValidString(s)
	println("Valid UTF-8:", valid)

	// Test with bytes
	b := []byte(s)

	// Test RuneCount
	byteCount := utf8.RuneCount(b)
	println("Byte rune count:", byteCount)

	// Test DecodeRune
	br, bsize := utf8.DecodeRune(b)
	println("First rune from bytes:", br, "size:", bsize)

	// Test Valid
	bvalid := utf8.Valid(b)
	println("Valid UTF-8 bytes:", bvalid)
	checkBytes("param bytes", b)

	// Test EncodeRune
	var buf [4]byte
	n := utf8.EncodeRune(buf[:], '世')
	println("Encoded rune size:", n)

	// Test RuneLen
	runeLen := utf8.RuneLen('世')
	println("Rune length:", runeLen)

	// Test ValidRune
	validRune := utf8.ValidRune('世')
	println("Valid rune:", validRune)

	// Test constants
	println("RuneSelf:", utf8.RuneSelf)
	println("MaxRune:", utf8.MaxRune)
	println("UTFMax:", utf8.UTFMax)
}
