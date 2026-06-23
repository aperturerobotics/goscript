import * as $ from "@goscript/builtin/index.js";
import * as unicode from "@goscript/unicode/index.js";
import { ErrSyntax } from "./atoi.gs.js";

const lowerhex = "0123456789abcdef";

// hexEscape emits Go's \xNN, \uNNNN, or \UNNNNNNNN escape with width hex digits.
function hexEscape(prefix: string, value: number, width: number): string {
	let out = prefix;
	for (let shift = (width - 1) * 4; shift >= 0; shift -= 4) {
		out += lowerhex[(value >> shift) & 0xf];
	}
	return out;
}

// appendEscapedRune returns the Go-escaped form of one rune, matching
// strconv.appendEscapedRune: printable runes pass through, the standard control
// escapes (\a \b \f \n \r \t \v) are emitted by name, control and DEL bytes
// become \xNN, invalid runes fold to U+FFFD, and the rest become \u/\U. This
// replaces the prior JSON.stringify / fromCharCode shortcuts, which used the
// wrong escape set and truncated runes above U+FFFF.
function appendEscapedRune(
	r: number,
	quote: number,
	asciiOnly: boolean,
	graphicOnly: boolean,
): string {
	if (r === quote || r === 0x5c /* backslash */) {
		return "\\" + String.fromCharCode(r);
	}
	if (asciiOnly) {
		if (r < 0x80 && unicode.IsPrint(r)) {
			return String.fromCharCode(r);
		}
	} else if (unicode.IsPrint(r) || (graphicOnly && unicode.IsGraphic(r))) {
		return $.runeToString(r);
	}
	switch (r) {
		case 0x07:
			return "\\a";
		case 0x08:
			return "\\b";
		case 0x0c:
			return "\\f";
		case 0x0a:
			return "\\n";
		case 0x0d:
			return "\\r";
		case 0x09:
			return "\\t";
		case 0x0b:
			return "\\v";
	}
	if (r < 0x20 || r === 0x7f) {
		return hexEscape("\\x", r & 0xff, 2);
	}
	if (r < 0 || r > 0x10ffff || (r >= 0xd800 && r <= 0xdfff)) {
		r = 0xfffd; // !utf8.ValidRune: fold to RuneError before emitting \u.
	}
	if (r < 0x10000) {
		return hexEscape("\\u", r, 4);
	}
	return hexEscape("\\U", r, 8);
}

// quoteWith renders s as a Go quoted literal using quote as the delimiter.
function quoteWith(
	s: string,
	quote: number,
	asciiOnly: boolean,
	graphicOnly: boolean,
): string {
	let out = String.fromCharCode(quote);
	for (const ch of s) {
		out += appendEscapedRune(ch.codePointAt(0)!, quote, asciiOnly, graphicOnly);
	}
	return out + String.fromCharCode(quote);
}

// quoteRuneWith renders a single rune as a Go quoted character literal.
function quoteRuneWith(
	r: number,
	quote: number,
	asciiOnly: boolean,
	graphicOnly: boolean,
): string {
	return (
		String.fromCharCode(quote) +
		appendEscapedRune(r, quote, asciiOnly, graphicOnly) +
		String.fromCharCode(quote)
	);
}

// Quote returns a double-quoted Go string literal representing s.
// The returned string uses Go escape sequences (\t, \n, \xFF, \u0100) for control characters and non-printable characters.
export function Quote(s: string): string {
	return quoteWith(s, 0x22 /* " */, false, false);
}

// QuoteToASCII returns a double-quoted Go string literal representing s.
// The returned string uses Go escape sequences (\t, \n, \xFF, \u0100) for control characters and non-ASCII characters.
export function QuoteToASCII(s: string): string {
	return quoteWith(s, 0x22, true, false);
}

// QuoteToGraphic returns a double-quoted Go string literal representing s.
// The returned string leaves Unicode graphic characters unchanged.
export function QuoteToGraphic(s: string): string {
	return quoteWith(s, 0x22, false, true);
}

// QuoteRune returns a single-quoted Go character literal representing the rune.
export function QuoteRune(r: number): string {
	return quoteRuneWith(r, 0x27 /* ' */, false, false);
}

// QuoteRuneToASCII returns a single-quoted Go character literal representing the rune.
export function QuoteRuneToASCII(r: number): string {
	return quoteRuneWith(r, 0x27, true, false);
}

// QuoteRuneToGraphic returns a single-quoted Go character literal representing the rune.
export function QuoteRuneToGraphic(r: number): string {
	return quoteRuneWith(r, 0x27, false, true);
}

// CanBackquote reports whether the string s can be represented unchanged as a
// single-line backquoted string. Go decodes UTF-8 runes: a tab is allowed, but
// other control bytes below space, a backtick, DEL, an invalid byte
// (utf8.RuneError at width 1), and a BOM (U+FEFF, invisible) are rejected.
export function CanBackquote(s: string): boolean {
	const bytes = $.stringToBytes(s);
	let i = 0;
	while (i < bytes.length) {
		const [r, wid] = decodeRune(bytes, i);
		i += wid;
		if (wid > 1) {
			if (r === 0xfeff) {
				return false; // BOMs are invisible and should not be quoted.
			}
			continue; // Other multibyte runes are valid and assumed printable.
		}
		if (r === 0xfffd) {
			return false; // utf8.RuneError from an invalid single byte.
		}
		if ((r < 0x20 && r !== 0x09) || r === 0x60 || r === 0x7f) {
			return false;
		}
	}
	return true;
}

// unhex returns the value of the hex digit byte b and whether b is a hex digit.
function unhex(b: number): [number, boolean] {
	if (b >= 0x30 && b <= 0x39) {
		return [b - 0x30, true];
	}
	if (b >= 0x61 && b <= 0x66) {
		return [b - 0x61 + 10, true];
	}
	if (b >= 0x41 && b <= 0x46) {
		return [b - 0x41 + 10, true];
	}
	return [0, false];
}

// decodeRune decodes the UTF-8 rune at bytes[pos], returning the rune and the
// number of bytes consumed. Invalid sequences decode to U+FFFD with width 1,
// matching utf8.DecodeRune.
function decodeRune(bytes: Uint8Array, pos: number): [number, number] {
	const b0 = bytes[pos];
	if (b0 < 0x80) {
		return [b0, 1];
	}
	let size: number;
	let r: number;
	if ((b0 & 0xe0) === 0xc0) {
		size = 2;
		r = b0 & 0x1f;
	} else if ((b0 & 0xf0) === 0xe0) {
		size = 3;
		r = b0 & 0x0f;
	} else if ((b0 & 0xf8) === 0xf0) {
		size = 4;
		r = b0 & 0x07;
	} else {
		return [0xfffd, 1];
	}
	if (pos + size > bytes.length) {
		return [0xfffd, 1];
	}
	for (let j = 1; j < size; j++) {
		const cb = bytes[pos + j];
		if ((cb & 0xc0) !== 0x80) {
			return [0xfffd, 1];
		}
		r = (r << 6) | (cb & 0x3f);
	}
	return [r, size];
}

// unquoteCharBytes decodes the first character or byte in the escaped byte
// sequence starting at pos, returning [value, multibyte, newPos, err]. It is the
// byte-oriented core shared by the exported UnquoteChar and Unquote so that
// \xNN raw bytes and multibyte source runes round-trip exactly as in Go.
function unquoteCharBytes(
	bytes: Uint8Array,
	pos: number,
	quote: number,
): [number, boolean, number, $.GoError] {
	if (pos >= bytes.length) {
		return [0, false, pos, ErrSyntax];
	}
	const c = bytes[pos];
	if (c === quote && (quote === 0x27 || quote === 0x22)) {
		return [0, false, pos, ErrSyntax];
	}
	if (c >= 0x80) {
		const [r, size] = decodeRune(bytes, pos);
		return [r, true, pos + size, null];
	}
	if (c !== 0x5c /* backslash */) {
		return [c, false, pos + 1, null];
	}
	if (pos + 1 >= bytes.length) {
		return [0, false, pos, ErrSyntax];
	}
	const e = bytes[pos + 1];
	let p = pos + 2;
	switch (e) {
		case 0x61: // \a
			return [0x07, false, p, null];
		case 0x62: // \b
			return [0x08, false, p, null];
		case 0x66: // \f
			return [0x0c, false, p, null];
		case 0x6e: // \n
			return [0x0a, false, p, null];
		case 0x72: // \r
			return [0x0d, false, p, null];
		case 0x74: // \t
			return [0x09, false, p, null];
		case 0x76: // \v
			return [0x0b, false, p, null];
		case 0x78: // \x
		case 0x75: // \u
		case 0x55: { // \U
			const n = e === 0x78 ? 2 : e === 0x75 ? 4 : 8;
			if (p + n > bytes.length) {
				return [0, false, pos, ErrSyntax];
			}
			let v = 0;
			for (let j = 0; j < n; j++) {
				const [x, ok] = unhex(bytes[p + j]);
				if (!ok) {
					return [0, false, pos, ErrSyntax];
				}
				v = (v << 4) | x;
			}
			p += n;
			if (e === 0x78) {
				return [v, false, p, null]; // single byte
			}
			if (v < 0 || v > 0x10ffff || (v >= 0xd800 && v <= 0xdfff)) {
				return [0, false, pos, ErrSyntax]; // !utf8.ValidRune
			}
			return [v, true, p, null];
		}
		case 0x30:
		case 0x31:
		case 0x32:
		case 0x33:
		case 0x34:
		case 0x35:
		case 0x36:
		case 0x37: { // octal \N
			let v = e - 0x30;
			if (p + 2 > bytes.length) {
				return [0, false, pos, ErrSyntax];
			}
			for (let j = 0; j < 2; j++) {
				const x = bytes[p + j] - 0x30;
				if (x < 0 || x > 7) {
					return [0, false, pos, ErrSyntax];
				}
				v = (v << 3) | x;
			}
			p += 2;
			if (v > 255) {
				return [0, false, pos, ErrSyntax];
			}
			return [v, false, p, null];
		}
		case 0x5c: // backslash
			return [0x5c, false, p, null];
		case 0x27: // '
		case 0x22: // "
			if (e !== quote) {
				return [0, false, pos, ErrSyntax];
			}
			return [e, false, p, null];
		default:
			return [0, false, pos, ErrSyntax];
	}
}

// UnquoteChar decodes the first character or byte in the escaped string or
// character literal represented by the string s. quote is the delimiting byte
// (' or "), or 0 to disallow neither.
export function UnquoteChar(s: string, quote: number): [number, boolean, string, $.GoError] {
	const bytes = $.stringToBytes(s);
	const [value, multibyte, newPos, err] = unquoteCharBytes(bytes, 0, quote);
	if (err !== null) {
		return [0, false, "", err];
	}
	return [value, multibyte, $.bytesToString(bytes.subarray(newPos)), null];
}

// Unquote interprets s as a single-quoted, double-quoted, or backquoted Go
// string literal, returning the string value that s quotes.
export function Unquote(s: string): [string, $.GoError] {
	const bytes = $.stringToBytes(s);
	const n = bytes.length;
	if (n < 2) {
		return ["", ErrSyntax];
	}
	const quote = bytes[0];
	if (quote !== bytes[n - 1]) {
		return ["", ErrSyntax];
	}
	const inner = bytes.subarray(1, n - 1);

	if (quote === 0x60 /* ` */) {
		for (let i = 0; i < inner.length; i++) {
			if (inner[i] === 0x60) {
				return ["", ErrSyntax];
			}
		}
		if (inner.includes(0x0d)) {
			const out: number[] = [];
			for (let i = 0; i < inner.length; i++) {
				if (inner[i] !== 0x0d) {
					out.push(inner[i]);
				}
			}
			return [$.bytesToString(Uint8Array.from(out)), null];
		}
		return [$.bytesToString(inner), null];
	}

	if (quote !== 0x22 && quote !== 0x27) {
		return ["", ErrSyntax];
	}
	if (inner.includes(0x0a)) {
		return ["", ErrSyntax]; // newline not allowed in " or ' literal
	}

	// Fast path: no escape and no embedded quote byte.
	if (!inner.includes(0x5c) && !inner.includes(quote)) {
		if (quote === 0x22) {
			return [$.bytesToString(inner), null];
		}
		// single-quoted: must hold exactly one rune
		const [r, size] = decodeRune(inner, 0);
		if (size === inner.length && (r !== 0xfffd || size !== 1)) {
			return [$.bytesToString(inner), null];
		}
	}

	const out: number[] = [];
	let pos = 0;
	while (pos < inner.length) {
		const [c, multibyte, newPos, err] = unquoteCharBytes(inner, pos, quote);
		if (err !== null) {
			return ["", err];
		}
		pos = newPos;
		if (c < 0x80 || !multibyte) {
			out.push(c & 0xff);
		} else {
			const enc = $.stringToBytes($.runeToString(c));
			for (let j = 0; j < enc.length; j++) {
				out.push(enc[j]);
			}
		}
		if (quote === 0x27 && pos < inner.length) {
			return ["", ErrSyntax]; // single-quoted must be one character
		}
	}
	return [$.bytesToString(Uint8Array.from(out)), null];
}

// QuotedPrefix returns the quoted string (as understood by Unquote) at the prefix of s.
export function QuotedPrefix(s: string): [string, $.GoError] {
	if (s.length === 0) {
		return ["", ErrSyntax];
	}
	
	const quote = s[0];
	if (quote !== '"' && quote !== "'" && quote !== '`') {
		return ["", ErrSyntax];
	}
	
	// Find matching quote
	for (let i = 1; i < s.length; i++) {
		if (s[i] === quote) {
			if (quote === '`') {
				return [s.slice(0, i+1), null];
			}
			// For " and ', need to handle escapes
			let escaped = false;
			for (let j = 1; j < i; j++) {
				if (s[j] === '\\' && !escaped) {
					escaped = true;
				} else {
					escaped = false;
				}
			}
			if (!escaped || s[i-1] !== '\\') {
				return [s.slice(0, i+1), null];
			}
		}
	}
	
	return ["", ErrSyntax];
}

// AppendQuote appends a double-quoted Go string literal representing s to dst and returns the extended buffer.
export function AppendQuote(dst: $.Bytes, s: string): $.Bytes {
	const quoted = Quote(s);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// AppendQuoteToASCII appends a double-quoted Go string literal representing s to dst and returns the extended buffer.
export function AppendQuoteToASCII(dst: $.Bytes, s: string): $.Bytes {
	const quoted = QuoteToASCII(s);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// AppendQuoteToGraphic appends a double-quoted Go string literal representing s to dst and returns the extended buffer.
export function AppendQuoteToGraphic(dst: $.Bytes, s: string): $.Bytes {
	const quoted = QuoteToGraphic(s);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// AppendQuoteRune appends a single-quoted Go character literal representing the rune to dst and returns the extended buffer.
export function AppendQuoteRune(dst: $.Bytes, r: number): $.Bytes {
	const quoted = QuoteRune(r);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// AppendQuoteRuneToASCII appends a single-quoted Go character literal representing the rune to dst and returns the extended buffer.
export function AppendQuoteRuneToASCII(dst: $.Bytes, r: number): $.Bytes {
	const quoted = QuoteRuneToASCII(r);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// AppendQuoteRuneToGraphic appends a single-quoted Go character literal representing the rune to dst and returns the extended buffer.
export function AppendQuoteRuneToGraphic(dst: $.Bytes, r: number): $.Bytes {
	const quoted = QuoteRuneToGraphic(r);
	return $.append(dst, ...$.stringToBytes(quoted)!);
}

// IsPrint reports whether the rune is defined as printable by Go.
export function IsPrint(r: number): boolean {
	return unicode.IsPrint(r);
}

// IsGraphic reports whether the rune is defined as a Graphic by Unicode.
export function IsGraphic(r: number): boolean {
	return unicode.IsGraphic(r);
}