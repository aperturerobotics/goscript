// Generated file based on package_import_unicode.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"

export async function main(): globalThis.Promise<void> {
	// Test character classification functions
	$.println("Testing character classification:")

	// Test IsLetter
	$.println("IsLetter('A'):", unicode.IsLetter($.int(65, 32)))
	$.println("IsLetter('1'):", unicode.IsLetter($.int(49, 32)))

	// Test IsDigit
	$.println("IsDigit('5'):", unicode.IsDigit($.int(53, 32)))
	$.println("IsDigit('a'):", unicode.IsDigit($.int(97, 32)))

	// Test IsUpper
	$.println("IsUpper('Z'):", unicode.IsUpper($.int(90, 32)))
	$.println("IsUpper('z'):", unicode.IsUpper($.int(122, 32)))

	// Test IsLower
	$.println("IsLower('b'):", unicode.IsLower($.int(98, 32)))
	$.println("IsLower('B'):", unicode.IsLower($.int(66, 32)))

	// Test IsSpace
	$.println("IsSpace(' '):", unicode.IsSpace($.int(32, 32)))
	$.println("IsSpace('x'):", unicode.IsSpace($.int(120, 32)))

	// Test IsPunct
	$.println("IsPunct('!'):", unicode.IsPunct($.int(33, 32)))
	$.println("IsPunct('a'):", unicode.IsPunct($.int(97, 32)))

	// Test case conversion functions
	$.println("\nTesting case conversion:")

	// Test ToUpper
	$.println("ToUpper('a'):", String.fromCodePoint(unicode.ToUpper($.int(97, 32))))
	$.println("ToUpper('Z'):", String.fromCodePoint(unicode.ToUpper($.int(90, 32))))

	// Test ToLower
	$.println("ToLower('A'):", String.fromCodePoint(unicode.ToLower($.int(65, 32))))
	$.println("ToLower('z'):", String.fromCodePoint(unicode.ToLower($.int(122, 32))))

	// Test ToTitle
	$.println("ToTitle('a'):", String.fromCodePoint(unicode.ToTitle($.int(97, 32))))

	// Test To function with constants
	$.println("To(UpperCase, 'b'):", String.fromCodePoint(unicode.To(unicode.UpperCase, $.int(98, 32))))
	$.println("To(LowerCase, 'C'):", String.fromCodePoint(unicode.To(unicode.LowerCase, $.int(67, 32))))

	// Test SimpleFold
	$.println("SimpleFold('A'):", String.fromCodePoint(unicode.SimpleFold($.int(65, 32))))
	$.println("SimpleFold('a'):", String.fromCodePoint(unicode.SimpleFold($.int(97, 32))))

	// Test constants
	$.println("\nTesting constants:")
	$.println("MaxRune:", $.int(unicode.MaxRune, 32))
	$.println("Version:", unicode.Version)

	// Test range tables with Is function
	$.println("\nTesting range tables:")
	$.println("Is(Letter, 'A'):", unicode.Is(unicode.Letter, $.int(65, 32)))
	$.println("Is(Letter, '1'):", unicode.Is(unicode.Letter, $.int(49, 32)))
	$.println("Is(Digit, '5'):", unicode.Is(unicode.Digit, $.int(53, 32)))
	$.println("Is(Digit, 'x'):", unicode.Is(unicode.Digit, $.int(120, 32)))

	// Test In function
	$.println("In('A', Letter, Digit):", unicode.In($.int(65, 32), unicode.Letter, unicode.Digit))
	$.println("In('5', Letter, Digit):", unicode.In($.int(53, 32), unicode.Letter, unicode.Digit))
	$.println("In('!', Letter, Digit):", unicode.In($.int(33, 32), unicode.Letter, unicode.Digit))

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
