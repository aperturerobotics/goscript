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

// CanBackquote reports whether the string s can be represented unchanged as a single-line backquoted string.
export function CanBackquote(s: string): boolean {
	// Check if string contains backticks or control characters
	for (let i = 0; i < s.length; i++) {
		const c = s.charCodeAt(i);
		if (c === 96 || c < 32 || c === 127) { // backtick or control character
			return false;
		}
	}
	return true;
}

// Unquote interprets s as a single-quoted, double-quoted, or backquoted Go string literal.
export function Unquote(s: string): [string, $.GoError] {
	const n = s.length;
	if (n < 2) {
		return ["", ErrSyntax];
	}

	const quote = s[0];
	if (quote !== s[n-1]) {
		return ["", ErrSyntax];
	}

	s = s.slice(1, n-1);

	if (quote === '`') {
		// Backquoted string - no escapes processed
		if (s.includes('`')) {
			return ["", ErrSyntax];
		}
		if (s.includes('\r')) {
			return ["", ErrSyntax]; 
		}
		return [s, null];
	}

	if (quote !== '"' && quote !== "'") {
		return ["", ErrSyntax];
	}

	// Use JSON.parse for double-quoted strings as a starting point
	if (quote === '"') {
		try {
			const result = JSON.parse('"' + s + '"');
			return [result, null];
		} catch {
			return ["", ErrSyntax];
		}
	}

	// Single-quoted string - should contain single rune
	if (quote === "'") {
		// Simplified: just handle basic cases
		if (s.length === 1) {
			return [s, null];
		}
		if (s.length === 2 && s[0] === '\\') {
			switch (s[1]) {
				case 'n': return ['\n', null];
				case 't': return ['\t', null];
				case 'r': return ['\r', null];
				case '\\': return ['\\', null];
				case "'": return ["'", null];
				default: return ["", ErrSyntax];
			}
		}
		return ["", ErrSyntax];
	}

	return ["", ErrSyntax];
}

// UnquoteChar decodes the first character or byte in the escaped string or character literal represented by the string s.
export function UnquoteChar(s: string, quote: number): [number, boolean, string, $.GoError] {
	// Simplified implementation
	if (s.length === 0) {
		return [0, false, "", ErrSyntax];
	}
	
	const c = s.charCodeAt(0);
	if (c === quote) {
		return [0, false, "", ErrSyntax];
	}
	
	if (c !== 92) { // not backslash
		return [c, c >= 128, s.slice(1), null];
	}
	
	// Handle escape sequence - simplified
	if (s.length < 2) {
		return [0, false, "", ErrSyntax];
	}
	
	switch (s[1]) {
		case 'n': return [10, false, s.slice(2), null];  // \n
		case 't': return [9, false, s.slice(2), null];   // \t
		case 'r': return [13, false, s.slice(2), null];  // \r
		case '\\': return [92, false, s.slice(2), null]; // \\
		case '"': return [34, false, s.slice(2), null];  // \"
		case "'": return [39, false, s.slice(2), null];  // \'
		default: return [0, false, "", ErrSyntax];
	}
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