// Generated file based on package_import_unicode.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"

export async function main(): Promise<void> {
	// Test character classification functions
	$.println("Testing character classification:")

	// Test IsLetter
	$.println("IsLetter('A'):", unicode.IsLetter(65))
	$.println("IsLetter('1'):", unicode.IsLetter(49))

	// Test IsDigit
	$.println("IsDigit('5'):", unicode.IsDigit(53))
	$.println("IsDigit('a'):", unicode.IsDigit(97))

	// Test IsUpper
	$.println("IsUpper('Z'):", unicode.IsUpper(90))
	$.println("IsUpper('z'):", unicode.IsUpper(122))

	// Test IsLower
	$.println("IsLower('b'):", unicode.IsLower(98))
	$.println("IsLower('B'):", unicode.IsLower(66))

	// Test IsSpace
	$.println("IsSpace(' '):", unicode.IsSpace(32))
	$.println("IsSpace('x'):", unicode.IsSpace(120))

	// Test IsPunct
	$.println("IsPunct('!'):", unicode.IsPunct(33))
	$.println("IsPunct('a'):", unicode.IsPunct(97))

	// Test case conversion functions
	$.println("\nTesting case conversion:")

	// Test ToUpper
	$.println("ToUpper('a'):", $.runeOrStringToString(unicode.ToUpper(97)))
	$.println("ToUpper('Z'):", $.runeOrStringToString(unicode.ToUpper(90)))

	// Test ToLower
	$.println("ToLower('A'):", $.runeOrStringToString(unicode.ToLower(65)))
	$.println("ToLower('z'):", $.runeOrStringToString(unicode.ToLower(122)))

	// Test ToTitle
	$.println("ToTitle('a'):", $.runeOrStringToString(unicode.ToTitle(97)))

	// Test To function with constants
	$.println("To(UpperCase, 'b'):", $.runeOrStringToString(unicode.To(unicode.UpperCase, 98)))
	$.println("To(LowerCase, 'C'):", $.runeOrStringToString(unicode.To(unicode.LowerCase, 67)))

	// Test SimpleFold
	$.println("SimpleFold('A'):", $.runeOrStringToString(unicode.SimpleFold(65)))
	$.println("SimpleFold('a'):", $.runeOrStringToString(unicode.SimpleFold(97)))

	// Test constants
	$.println("\nTesting constants:")
	$.println("MaxRune:", unicode.MaxRune)
	$.println("Version:", unicode.Version)

	// Test range tables with Is function
	$.println("\nTesting range tables:")
	$.println("Is(Letter, 'A'):", unicode.Is(unicode.Letter, 65))
	$.println("Is(Letter, '1'):", unicode.Is(unicode.Letter, 49))
	$.println("Is(Digit, '5'):", unicode.Is(unicode.Digit, 53))
	$.println("Is(Digit, 'x'):", unicode.Is(unicode.Digit, 120))

	// Test In function
	$.println("In('A', Letter, Digit):", unicode.In(65, unicode.Letter, unicode.Digit))
	$.println("In('5', Letter, Digit):", unicode.In(53, unicode.Letter, unicode.Digit))
	$.println("In('!', Letter, Digit):", unicode.In(33, unicode.Letter, unicode.Digit))

	$.println("test finished")
}

