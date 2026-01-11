import * as $ from "@goscript/builtin/index.js"

// Unicode replacement character
export let replacementChar: number = 65533

// Maximum valid Unicode code point.
export let maxRune: number = 1114111

// 0xd800-0xdc00 encodes the high 10 bits of a pair.
// 0xdc00-0xe000 encodes the low 10 bits of a pair.
// the value is those 20 bits plus 0x10000.
export let surr1: number = 0xd800

export let surr2: number = 0xdc00

export let surr3: number = 0xe000

export let surrSelf: number = 0x10000

// IsSurrogate reports whether the specified Unicode code point
// can appear in a surrogate pair.
export function IsSurrogate(r: number): boolean {
	return 55296 <= r && r < 57344
}

// DecodeRune returns the UTF-16 decoding of a surrogate pair.
// If the pair is not a valid UTF-16 surrogate pair, DecodeRune returns
// the Unicode replacement code point U+FFFD.
export function DecodeRune(r1: number, r2: number): number {
	if (55296 <= r1 && r1 < 56320 && 56320 <= r2 && r2 < 57344) {
		return (((r1 - 55296) << 10) | (r2 - 56320)) + 65536
	}
	return 65533
}

// EncodeRune returns the UTF-16 surrogate pair r1, r2 for the given rune.
// If the rune is not a valid Unicode code point or does not need encoding,
// EncodeRune returns U+FFFD, U+FFFD.
export function EncodeRune(r: number): [number, number] {
	let r1: number = 0
	let r2: number = 0
	{
		if (r < 65536 || r > 1114111) {
			return [65533, 65533]
		}
		r -= 65536
		return [55296 + (((r >> 10)) & 0x3ff), 56320 + (r & 0x3ff)]
	}
}

// RuneLen returns the number of 16-bit words in the UTF-16 encoding of the rune.
// It returns -1 if the rune is not a valid value to encode in UTF-16.
export function RuneLen(r: number): number {
	switch (true) {
		case 0 <= r && r < 55296:
		case 57344 <= r && r < 65536: {
			return 1
			break
		}
		case 65536 <= r && r <= 1114111: {
			return 2
			break
		}
		default: {
			return -1
			break
		}
	}
}

// Encode returns the UTF-16 encoding of the Unicode code point sequence s.
export function Encode(s: $.Slice<number>): $.Slice<number> {
	let n = $.len(s)
	for (let _i = 0; _i < $.len(s); _i++) {
		let v = s![_i]
		{
			if (v >= 65536) {
				n++
			}
		}
	}

	let a = $.makeSlice<number>(n, undefined, 'number')
	n = 0

	// normal rune

	// needs surrogate sequence
	for (let _i = 0; _i < $.len(s); _i++) {
		let v = s![_i]
		{

			// normal rune

			// needs surrogate sequence
			switch (RuneLen(v)) {
				case 1: {
					a![n] = (v as number)
					n++
					break
				}
				case 2: {
					let [r1, r2] = EncodeRune(v)
					a![n] = (r1 as number)
					a![n + 1] = (r2 as number)
					n += 2
					break
				}
				default: {
					a![n] = (65533 as number)
					n++
					break
				}
			}
		}
	}
	return $.goSlice(a, undefined, n)
}

// AppendRune appends the UTF-16 encoding of the Unicode code point r
// to the end of p and returns the extended buffer. If the rune is not
// a valid Unicode code point, it appends the encoding of U+FFFD.
export function AppendRune(a: $.Slice<number>, r: number): $.Slice<number> {
	// This function is inlineable for fast handling of ASCII.

	// normal rune

	// needs surrogate sequence
	switch (true) {
		case 0 <= r && r < 55296:
		case 57344 <= r && r < 65536: {
			return $.append(a, (r as number))
			break
		}
		case 65536 <= r && r <= 1114111: {
			let [r1, r2] = EncodeRune(r)
			return $.append(a, (r1 as number), (r2 as number))
			break
		}
	}
	return $.append(a, 65533)
}

// Decode returns the Unicode code point sequence represented
// by the UTF-16 encoding s.
export function Decode(s: $.Slice<number>): $.Slice<number> {
	// Preallocate capacity to hold up to 64 runes.
	// Decode inlines, so the allocation can live on the stack.
	let buf = $.makeSlice<number>(0, 64, 'number')
	return decode(s, buf)
}

// decode appends to buf the Unicode code point sequence represented
// by the UTF-16 encoding s and return the extended buffer.
export function decode(s: $.Slice<number>, buf: $.Slice<number>): $.Slice<number> {

	// normal rune

	// valid surrogate sequence

	// invalid surrogate sequence
	for (let i = 0; i < $.len(s); i++) {
		let ar: number = 0

		// normal rune

		// valid surrogate sequence

		// invalid surrogate sequence
		{let r = s![i]
			switch (true) {
				case r < 55296:
				case 57344 <= r: {
					ar = (r as number)
					break
				}
				case 55296 <= r && r < 56320 && i + 1 < $.len(s) && 56320 <= s![i + 1] && s![i + 1] < 57344: {
					ar = DecodeRune((r as number), (s![i + 1] as number))
					i++
					break
				}
				default: {
					ar = 65533
					break
				}
			}
		}buf = $.append(buf, ar)
	}
	return buf
}

