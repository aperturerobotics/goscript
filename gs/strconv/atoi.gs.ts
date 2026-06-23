import * as $ from "@goscript/builtin/index.js";

export let ErrRange: $.GoError = $.newError("value out of range");
export let ErrSyntax: $.GoError = $.newError("invalid syntax");

export class NumError {
	// the failing function (ParseBool, ParseInt, ParseUint, ParseFloat, ParseComplex)
	public get Func(): string {
		return this._fields.Func.value;
	}
	public set Func(value: string) {
		this._fields.Func.value = value;
	}

	// the input
	public get Num(): string {
		return this._fields.Num.value;
	}
	public set Num(value: string) {
		this._fields.Num.value = value;
	}

	// the reason the conversion failed (e.g. ErrRange, ErrSyntax, etc.)
	public get Err(): $.GoError {
		return this._fields.Err.value;
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value;
	}

	public _fields: {
		Func: $.VarRef<string>;
		Num: $.VarRef<string>;
		Err: $.VarRef<$.GoError>;
	}

	constructor(init?: Partial<{Err?: $.GoError, Func?: string, Num?: string}>) {
		this._fields = {
			Func: $.varRef(init?.Func ?? ""),
			Num: $.varRef(init?.Num ?? ""),
			Err: $.varRef(init?.Err ?? null)
		};
	}

	public clone(): NumError {
		const cloned = new NumError();
		cloned._fields = {
			Func: $.varRef(this._fields.Func.value),
			Num: $.varRef(this._fields.Num.value),
			Err: $.varRef(this._fields.Err.value)
		};
		return cloned;
	}

	public Error(): string {
		const e = this;
		return "strconv." + e.Func + ": " + "parsing " + JSON.stringify(e.Num) + ": " + e.Err!.Error();
	}

	public Unwrap(): $.GoError {
		const e = this;
		return e.Err;
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
		'NumError',
		new NumError(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
		NumError,
		[{ name: "Func", key: "Func", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Num", key: "Num", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "Err", key: "Err", type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }]
	);
}

export function syntaxError(fn: string, str: string): NumError {
	return new NumError({Func: fn, Num: str, Err: ErrSyntax});
}

export function rangeError(fn: string, str: string): NumError {
	return new NumError({Func: fn, Num: str, Err: ErrRange});
}

export function baseError(fn: string, str: string, base: number): NumError {
	return new NumError({Func: fn, Num: str, Err: $.newError("invalid base " + base)});
}

export function bitSizeError(fn: string, str: string, bitSize: number): NumError {
	return new NumError({Func: fn, Num: str, Err: $.newError("invalid bit size " + bitSize)});
}

export let IntSize: number = 64;

// digitValue decodes the value of a single base-36 digit, returning 99 (an
// invalid sentinel above any legal base) for non-alphanumeric runes so the
// caller rejects them with a syntax error.
function digitValue(c: string): number {
	if (c >= '0' && c <= '9') {
		return c.charCodeAt(0) - 48;
	}
	const lc = c.toLowerCase();
	if (lc >= 'a' && lc <= 'z') {
		return lc.charCodeAt(0) - 97 + 10;
	}
	return 99;
}

// ParseUint is like ParseInt but for unsigned numbers.
// A sign prefix is not permitted. It returns the uint64 value as a bigint.
export function ParseUint(s: string, base: number, bitSize: number): [bigint, $.GoError] {
	if (s === "") {
		return [0n, syntaxError("ParseUint", s)];
	}

	const base0 = base === 0;
	const s0 = s;

	// Handle base validation
	if (base < 0 || base === 1 || base > 36) {
		return [0n, baseError("ParseUint", s0, base)];
	}

	// Handle base inference
	if (base === 0) {
		base = 10;
		if (s.length >= 3) {
			if (s[0] === '0') {
				const prefix = s[1].toLowerCase();
				if (prefix === 'b') {
					base = 2;
					s = s.slice(2);
				} else if (prefix === 'o') {
					base = 8;
					s = s.slice(2);
				} else if (prefix === 'x') {
					base = 16;
					s = s.slice(2);
				} else {
					base = 8;
					s = s.slice(1);
				}
			}
		} else if (s.length >= 2 && s[0] === '0') {
			base = 8;
			s = s.slice(1);
		}
	}

	// Validate bitSize
	if (bitSize === 0) {
		bitSize = 64;
	} else if (bitSize < 0 || bitSize > 64) {
		return [0n, bitSizeError("ParseUint", s0, bitSize)];
	}

	// Check for underscores only if base0 (auto-detected base)
	if (base0 && s.includes('_')) {
		if (!underscoreOK(s)) {
			return [0n, syntaxError("ParseUint", s0)];
		}
		s = s.replace(/_/g, '');
	}

	if (s === "") {
		return [0n, syntaxError("ParseUint", s0)];
	}

	const baseBig = BigInt(base);
	const maxVal = (1n << BigInt(bitSize)) - 1n;
	let n = 0n;
	for (const ch of s) {
		const d = digitValue(ch);
		if (d >= base) {
			return [0n, syntaxError("ParseUint", s0)];
		}
		n = n * baseBig + BigInt(d);
		if (n > maxVal) {
			return [maxVal, rangeError("ParseUint", s0)];
		}
	}

	return [n, null];
}

// ParseInt interprets a string s in the given base (0, 2 to 36) and
// bit size (0 to 64) and returns the corresponding value i as a bigint.
export function ParseInt(s: string, base: number, bitSize: number): [bigint, $.GoError] {
	if (s === "") {
		return [0n, syntaxError("ParseInt", s)];
	}

	const s0 = s;
	let neg = false;
	if (s[0] === '+' || s[0] === '-') {
		neg = s[0] === '-';
		s = s.slice(1);
		if (s.length < 1) {
			return [0n, syntaxError("ParseInt", s0)];
		}
	}

	// Convert to unsigned first
	const [un, err] = ParseUint(s, base, bitSize);
	if (err !== null && (err as NumError).Err !== ErrRange) {
		const numErr = err as NumError;
		numErr.Func = "ParseInt";
		numErr.Num = s0;
		return [0n, numErr];
	}

	if (bitSize === 0) {
		bitSize = 64;
	}

	const cutoff = 1n << BigInt(bitSize - 1);
	if (!neg && un >= cutoff) {
		return [cutoff - 1n, rangeError("ParseInt", s0)];
	}
	if (neg && un > cutoff) {
		return [-cutoff, rangeError("ParseInt", s0)];
	}

	return [neg ? -un : un, null];
}

// Atoi is equivalent to ParseInt(s, 10, 0), converted to type int.
export function Atoi(s: string): [number, $.GoError] {
	const [i64, err] = ParseInt(s, 10, 0);
	return [Number(i64), err];
}

// underscoreOK reports whether the underscores in s are allowed.
function underscoreOK(s: string): boolean {
	// Simplified validation for underscores
	if (s.length === 0) {
		return false;
	}
	
	// Can't start or end with underscore
	if (s[0] === '_' || s[s.length - 1] === '_') {
		return false;
	}
	
	// Can't have consecutive underscores
	for (let i = 0; i < s.length - 1; i++) {
		if (s[i] === '_' && s[i + 1] === '_') {
			return false;
		}
	}
	
	return true;
}

