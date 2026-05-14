// Generated file based on package_import_unicode.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as unicode from "@goscript/unicode/index.ts"

export async function main(): Promise<void> {
	$.println("Testing character classification:")
	$.println("IsLetter('A'):", unicode.IsLetter(65))
	$.println("IsLetter('1'):", unicode.IsLetter(49))
	$.println("IsDigit('5'):", unicode.IsDigit(53))
	$.println("IsDigit('a'):", unicode.IsDigit(97))
	$.println("IsUpper('Z'):", unicode.IsUpper(90))
	$.println("IsUpper('z'):", unicode.IsUpper(122))
	$.println("IsLower('b'):", unicode.IsLower(98))
	$.println("IsLower('B'):", unicode.IsLower(66))
	$.println("IsSpace(' '):", unicode.IsSpace(32))
	$.println("IsSpace('x'):", unicode.IsSpace(120))
	$.println("IsPunct('!'):", unicode.IsPunct(33))
	$.println("IsPunct('a'):", unicode.IsPunct(97))
	$.println("\nTesting case conversion:")
	$.println("ToUpper('a'):", String.fromCodePoint(unicode.ToUpper(97)))
	$.println("ToUpper('Z'):", String.fromCodePoint(unicode.ToUpper(90)))
	$.println("ToLower('A'):", String.fromCodePoint(unicode.ToLower(65)))
	$.println("ToLower('z'):", String.fromCodePoint(unicode.ToLower(122)))
	$.println("ToTitle('a'):", String.fromCodePoint(unicode.ToTitle(97)))
	$.println("To(UpperCase, 'b'):", String.fromCodePoint(unicode.To(unicode.UpperCase, 98)))
	$.println("To(LowerCase, 'C'):", String.fromCodePoint(unicode.To(unicode.LowerCase, 67)))
	$.println("SimpleFold('A'):", String.fromCodePoint(unicode.SimpleFold(65)))
	$.println("SimpleFold('a'):", String.fromCodePoint(unicode.SimpleFold(97)))
	$.println("\nTesting constants:")
	$.println("MaxRune:", unicode.MaxRune)
	$.println("Version:", unicode.Version)
	$.println("\nTesting range tables:")
	$.println("Is(Letter, 'A'):", unicode.Is(unicode.Letter, 65))
	$.println("Is(Letter, '1'):", unicode.Is(unicode.Letter, 49))
	$.println("Is(Digit, '5'):", unicode.Is(unicode.Digit, 53))
	$.println("Is(Digit, 'x'):", unicode.Is(unicode.Digit, 120))
	$.println("In('A', Letter, Digit):", unicode.In(65, unicode.Letter, unicode.Digit))
	$.println("In('5', Letter, Digit):", unicode.In(53, unicode.Letter, unicode.Digit))
	$.println("In('!', Letter, Digit):", unicode.In(33, unicode.Letter, unicode.Digit))
	$.println("test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
