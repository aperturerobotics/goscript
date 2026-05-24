// Generated file based on package_import_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic byte slice operations
	let b1: $.Slice<number> = new Uint8Array([104, 101, 108, 108, 111])
	let b2: $.Slice<number> = new Uint8Array([119, 111, 114, 108, 100])

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
	if (bytes.Contains(b1, new Uint8Array([101, 108, 108]))) {
		$.println("Contains works correctly")
	}

	// Test Index
	let idx = bytes.Index(b1, new Uint8Array([108, 108]))
	if (idx == 2) {
		$.println("Index works correctly, found at position:", idx)
	}

	// Test Join
	let slices: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([b1, b2])
	let joined: $.Slice<number> = bytes.Join(slices, new Uint8Array([32]))
	$.println("Joined:", $.bytesToString(joined))

	// Test Split
	let split: $.Slice<$.Slice<number>> = bytes.Split(joined, new Uint8Array([32]))
	$.println("Split result length:", $.len(split))
	if ($.len(split) == 2) {
		$.println("Split works correctly")
	}

	// Test HasPrefix and HasSuffix
	if (bytes.HasPrefix(b1, new Uint8Array([104, 101]))) {
		$.println("HasPrefix works correctly")
	}

	if (bytes.HasSuffix(b1, new Uint8Array([108, 111]))) {
		$.println("HasSuffix works correctly")
	}

	// Test Trim functions
	let whitespace: $.Slice<number> = new Uint8Array([32, 32, 104, 101, 108, 108, 111, 32, 32])
	let trimmed: $.Slice<number> = bytes.TrimSpace(whitespace)
	$.println("Trimmed:", $.bytesToString(trimmed))

	// Test ToUpper and ToLower
	let upper: $.Slice<number> = bytes.ToUpper(b1)
	let lower: $.Slice<number> = bytes.ToLower(upper)
	$.println("Upper:", $.bytesToString(upper))
	$.println("Lower:", $.bytesToString(lower))

	// Test Repeat
	let repeated: $.Slice<number> = bytes.Repeat(new Uint8Array([120]), 3)
	$.println("Repeated:", $.bytesToString(repeated))

	// Test Count
	let count = bytes.Count(new Uint8Array([98, 97, 110, 97, 110, 97]), new Uint8Array([97]))
	$.println("Count of 'a' in 'banana':", count)

	// Test Replace
	let replaced: $.Slice<number> = bytes.Replace(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]), 1)
	$.println("Replace result:", $.bytesToString(replaced))

	// Test ReplaceAll
	let replacedAll: $.Slice<number> = bytes.ReplaceAll(new Uint8Array([104, 101, 108, 108, 111, 32, 104, 101, 108, 108, 111]), new Uint8Array([104, 101, 108, 108, 111]), new Uint8Array([104, 105]))
	$.println("ReplaceAll result:", $.bytesToString(replacedAll))

	// Test Buffer
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	buf.value.WriteString("Hello ")
	buf.value.WriteString("World")
	$.println("Buffer content:", buf.value.String())
	$.println("Buffer length:", buf.value.Len())

	// Test Buffer Read
	let data: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
	let [n, ] = buf.value.Read(data)
	$.println("Read", n, "bytes:", $.bytesToString(data))

	// Test Buffer Reset
	buf.value.Reset()
	$.println("Buffer after reset, length:", buf.value.Len())

	// Test Buffer as Reader interface through an address expression.
	buf.value.WriteString("abc")
	let multi = io.MultiReader($.pointerValue($.interfaceValue<io.Reader | null>(buf, "*bytes.Buffer")), $.pointerValue($.interfaceValue<io.Reader | null>(bytes.NewReader(new Uint8Array([100, 101])), "*bytes.Reader")))
	data = $.makeSlice<number>(5, undefined, "byte")
	let __goscriptTuple0: any = $.pointerValue<Exclude<io.Reader, null>>(multi).Read(data)
	n = __goscriptTuple0[0]
	$.println("MultiReader read", n, "bytes:", $.bytesToString($.goSlice(data, undefined, n)))

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
