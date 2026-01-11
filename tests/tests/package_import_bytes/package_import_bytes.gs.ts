// Generated file based on package_import_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

export async function main(): Promise<void> {
	// Test basic byte slice operations
	let b1 = $.stringToBytes("hello")
	let b2 = $.stringToBytes("world")

	// Test Equal
	if (bytes.Equal(b1, b1)) {
		$.println("Equal works correctly")
	}

	// Test Compare
	let result = bytes.Compare(b1, b2)
	if (result < 0) {
		$.println("Compare works: hello < world")
	}

	// Test Contains
	if (bytes.Contains(b1, $.stringToBytes("ell"))) {
		$.println("Contains works correctly")
	}

	// Test Index
	let idx = bytes.Index(b1, $.stringToBytes("ll"))
	if (idx == 2) {
		$.println("Index works correctly, found at position:", idx)
	}

	// Test Join
	let slices = $.arrayToSlice<$.Bytes>([b1, b2], 2)
	let joined = bytes.Join(slices, $.stringToBytes(" "))
	$.println("Joined:", $.bytesToString(joined))

	// Test Split
	let split = bytes.Split(joined, $.stringToBytes(" "))
	$.println("Split result length:", $.len(split))
	if ($.len(split) == 2) {
		$.println("Split works correctly")
	}

	// Test HasPrefix and HasSuffix
	if (bytes.HasPrefix(b1, $.stringToBytes("he"))) {
		$.println("HasPrefix works correctly")
	}

	if (bytes.HasSuffix(b1, $.stringToBytes("lo"))) {
		$.println("HasSuffix works correctly")
	}

	// Test Trim functions
	let whitespace = $.stringToBytes("  hello  ")
	let trimmed = bytes.TrimSpace(whitespace)
	$.println("Trimmed:", $.bytesToString(trimmed))

	// Test ToUpper and ToLower
	let upper = bytes.ToUpper(b1)
	let lower = bytes.ToLower(upper)
	$.println("Upper:", $.bytesToString(upper))
	$.println("Lower:", $.bytesToString(lower))

	// Test Repeat
	let repeated = bytes.Repeat($.stringToBytes("x"), 3)
	$.println("Repeated:", $.bytesToString(repeated))

	// Test Count
	let count = bytes.Count($.stringToBytes("banana"), $.stringToBytes("a"))
	$.println("Count of 'a' in 'banana':", count)

	// Test Replace
	let replaced = bytes.Replace($.stringToBytes("hello hello"), $.stringToBytes("hello"), $.stringToBytes("hi"), 1)
	$.println("Replace result:", $.bytesToString(replaced))

	// Test ReplaceAll
	let replacedAll = bytes.ReplaceAll($.stringToBytes("hello hello"), $.stringToBytes("hello"), $.stringToBytes("hi"))
	$.println("ReplaceAll result:", $.bytesToString(replacedAll))

	// Test Buffer
	let buf: $.VarRef<bytes.Buffer> = $.varRef(new bytes.Buffer())
	buf!.value.WriteString("Hello ")
	buf!.value.WriteString("World")
	$.println("Buffer content:", buf!.value.String())
	$.println("Buffer length:", buf!.value.Len())

	// Test Buffer Read
	let data = new Uint8Array(5)
	let [n, ] = buf!.value.Read(data)
	$.println("Read", n, "bytes:", $.bytesToString(data))

	// Test Buffer Reset
	buf!.value.Reset()
	$.println("Buffer after reset, length:", buf!.value.Len())

	$.println("test finished")
}

