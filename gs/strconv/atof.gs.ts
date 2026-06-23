import * as $ from "@goscript/builtin/index.js";
import { ErrSyntax, ErrRange, NumError, underscoreOK } from "./atoi.gs.js";

const maxFloat32 = 3.4028234663852886e+38;

// special matches Go's special-value parsing: an optional sign followed by a
// case-insensitive inf/infinity/nan, with nan rejecting a sign. It returns the
// value and whether s was a special form.
function special(s: string): [number, boolean] {
	if (s === "") {
		return [0, false];
	}
	let sign = 1;
	let nsign = 0;
	if (s[0] === '+' || s[0] === '-') {
		if (s[0] === '-') {
			sign = -1;
		}
		nsign = 1;
	}
	const body = s.slice(nsign).toLowerCase();
	if (body === "nan") {
		if (nsign === 1) {
			return [0, false]; // signed NaN is not accepted
		}
		return [NaN, true];
	}
	if (body === "inf" || body === "infinity") {
		return [sign * Infinity, true];
	}
	return [0, false];
}

// parseHexFloat parses Go's hexadecimal floating-point syntax
// (0x1.8p3) into a float64, returning [value, ok]. The exponent letter p and a
// decimal exponent are mandatory; the value is mantissa * 2^(exp - 4*fracDigits).
function parseHexFloat(s: string): [number, boolean] {
	let sign = 1;
	let i = 0;
	if (s[0] === '+' || s[0] === '-') {
		if (s[0] === '-') {
			sign = -1;
		}
		i = 1;
	}
	if (i + 1 >= s.length || s[i] !== '0' || s[i + 1].toLowerCase() !== 'x') {
		return [0, false];
	}
	i += 2;
	let intPart = "";
	while (i < s.length && /[0-9a-fA-F]/.test(s[i])) {
		intPart += s[i];
		i++;
	}
	let fracPart = "";
	if (i < s.length && s[i] === '.') {
		i++;
		while (i < s.length && /[0-9a-fA-F]/.test(s[i])) {
			fracPart += s[i];
			i++;
		}
	}
	if (intPart === "" && fracPart === "") {
		return [0, false];
	}
	if (i >= s.length || s[i].toLowerCase() !== 'p') {
		return [0, false]; // exponent is required for hex floats
	}
	i++;
	let expSign = 1;
	if (i < s.length && (s[i] === '+' || s[i] === '-')) {
		if (s[i] === '-') {
			expSign = -1;
		}
		i++;
	}
	if (i >= s.length) {
		return [0, false];
	}
	let expStr = "";
	while (i < s.length && s[i] >= '0' && s[i] <= '9') {
		expStr += s[i];
		i++;
	}
	if (expStr === "" || i !== s.length) {
		return [0, false];
	}
	const mant = parseInt(intPart + fracPart, 16);
	const exp = expSign * parseInt(expStr, 10) - 4 * fracPart.length;
	return [sign * mant * Math.pow(2, exp), true];
}

// decimalSyntaxOK reports whether s is a syntactically valid Go decimal float
// literal (after underscores are removed): optional sign, a mantissa with digits
// on at least one side of an optional dot, and an optional decimal exponent.
function decimalSyntaxOK(s: string): boolean {
	return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s);
}

// hasNonZeroDigit reports whether s contains a digit other than 0, used to tell
// a true zero from an underflow to zero.
function hasNonZeroDigit(s: string): boolean {
	for (const ch of s) {
		if (ch >= '1' && ch <= '9') {
			return true;
		}
	}
	return false;
}

// ParseFloat converts the string s to a floating-point number with the precision
// specified by bitSize: 32 for float32 or 64 for float64. The result always has
// type float64; for bitSize 32 it is rounded to float32 precision and reports
// ErrRange on overflow to infinity or underflow to zero. Any bitSize other than
// 32 is treated as float64.
export function ParseFloat(s: string, bitSize: number): [number, $.GoError] {
	const syntax = (): [number, $.GoError] => [0, new NumError({Func: "ParseFloat", Num: s, Err: ErrSyntax})];
	const range = (v: number): [number, $.GoError] => [v, new NumError({Func: "ParseFloat", Num: s, Err: ErrRange})];

	if (s === "") {
		return syntax();
	}

	const [sv, isSpecial] = special(s);
	if (isSpecial) {
		return [sv, null];
	}

	let value: number;
	let nonZero: boolean;
	if (/^[+-]?0[xX]/.test(s)) {
		const [hv, ok] = parseHexFloat(s);
		if (!ok) {
			return syntax();
		}
		value = hv;
		nonZero = hv !== 0;
	} else {
		if (s.includes('_')) {
			if (!underscoreOK(s)) {
				return syntax();
			}
		}
		const clean = s.replace(/_/g, '');
		if (!decimalSyntaxOK(clean)) {
			return syntax();
		}
		value = Number(clean);
		nonZero = hasNonZeroDigit(clean);
	}

	if (bitSize === 32) {
		const f = Math.fround(value);
		if (!isFinite(f) && isFinite(value)) {
			return range(value > 0 ? Infinity : -Infinity);
		}
		if (f === 0 && nonZero) {
			return range(0);
		}
		// A finite float64 above float32 max also overflows.
		if (isFinite(value) && Math.abs(value) > maxFloat32) {
			return range(value > 0 ? Infinity : -Infinity);
		}
		return [f, null];
	}

	if (!isFinite(value) && nonZero) {
		return range(value > 0 ? Infinity : -Infinity);
	}
	if (value === 0 && nonZero) {
		return range(0);
	}
	return [value, null];
}
