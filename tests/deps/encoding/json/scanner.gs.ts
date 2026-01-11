import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as sync from "@goscript/sync/index.js"

// Continue.
// uninteresting byte
export let scanContinue: number = 0

// end implied by next result != scanContinue
export let scanBeginLiteral: number = 0

// begin object
export let scanBeginObject: number = 0

// just finished object key (string)
export let scanObjectKey: number = 0

// just finished non-last object value
export let scanObjectValue: number = 0

// end object (implies scanObjectValue if possible)
export let scanEndObject: number = 0

// begin array
export let scanBeginArray: number = 0

// just finished array value
export let scanArrayValue: number = 0

// end array (implies scanArrayValue if possible)
export let scanEndArray: number = 0

// space byte; can skip; known to be last "continue" result
export let scanSkipSpace: number = 0

// Stop.
// top-level value ended *before* this byte; known to be first "stop" result
export let scanEnd: number = 0

// hit an error, scanner.err.
export let scanError: number = 0

// parsing object key (before colon)
export let parseObjectKey: number = 0

// parsing object value (after colon)
export let parseObjectValue: number = 0

// parsing array value
export let parseArrayValue: number = 0

export let maxNestingDepth: number = 10000

export class SyntaxError {
	// description of error
	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	// error occurred after reading Offset bytes
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	public _fields: {
		msg: $.VarRef<string>;
		Offset: $.VarRef<number>;
	}

	constructor(init?: Partial<{Offset?: number, msg?: string}>) {
		this._fields = {
			msg: $.varRef(init?.msg ?? ""),
			Offset: $.varRef(init?.Offset ?? 0)
		}
	}

	public clone(): SyntaxError {
		const cloned = new SyntaxError()
		cloned._fields = {
			msg: $.varRef(this._fields.msg.value),
			Offset: $.varRef(this._fields.Offset.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return e.msg
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.SyntaxError',
	  new SyntaxError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  SyntaxError,
	  {"msg": { kind: $.TypeKind.Basic, name: "string" }, "Offset": { kind: $.TypeKind.Basic, name: "int64" }}
	);
}

export class scanner {
	// The step is a func to be called to execute the next transition.
	// Also tried using an integer constant and a single func
	// with a switch, but using the func directly was 10% faster
	// on a 64-bit Mac Mini, and it's nicer to read.
	public get step(): ((p0: scanner | null, p1: number) => number) | null {
		return this._fields.step.value
	}
	public set step(value: ((p0: scanner | null, p1: number) => number) | null) {
		this._fields.step.value = value
	}

	// Reached end of top-level value.
	public get endTop(): boolean {
		return this._fields.endTop.value
	}
	public set endTop(value: boolean) {
		this._fields.endTop.value = value
	}

	// Stack of what we're in the middle of - array values, object keys, object values.
	public get parseState(): $.Slice<number> {
		return this._fields.parseState.value
	}
	public set parseState(value: $.Slice<number>) {
		this._fields.parseState.value = value
	}

	// Error that happened, if any.
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	// total bytes consumed, updated by decoder.Decode (and deliberately
	// not set to zero by scan.reset)
	public get bytes(): number {
		return this._fields.bytes.value
	}
	public set bytes(value: number) {
		this._fields.bytes.value = value
	}

	public _fields: {
		step: $.VarRef<((p0: scanner | null, p1: number) => number) | null>;
		endTop: $.VarRef<boolean>;
		parseState: $.VarRef<$.Slice<number>>;
		err: $.VarRef<$.GoError>;
		bytes: $.VarRef<number>;
	}

	constructor(init?: Partial<{bytes?: number, endTop?: boolean, err?: $.GoError, parseState?: $.Slice<number>, step?: ((p0: scanner | null, p1: number) => number) | null}>) {
		this._fields = {
			step: $.varRef(init?.step ?? null),
			endTop: $.varRef(init?.endTop ?? false),
			parseState: $.varRef(init?.parseState ?? null),
			err: $.varRef(init?.err ?? null),
			bytes: $.varRef(init?.bytes ?? 0)
		}
	}

	public clone(): scanner {
		const cloned = new scanner()
		cloned._fields = {
			step: $.varRef(this._fields.step.value),
			endTop: $.varRef(this._fields.endTop.value),
			parseState: $.varRef(this._fields.parseState.value),
			err: $.varRef(this._fields.err.value),
			bytes: $.varRef(this._fields.bytes.value)
		}
		return cloned
	}

	// reset prepares the scanner for use.
	// It must be called before calling s.step.
	public reset(): void {
		const s = this
		s.step = stateBeginValue
		s.parseState = $.goSlice(s.parseState, 0, 0)
		s.err = null
		s.endTop = false
	}

	// eof tells the scanner that the end of input has been reached.
	// It returns a scan status just as s.step does.
	public eof(): number {
		const s = this
		if (s.err != null) {
			return 11
		}
		if (s.endTop) {
			return 10
		}
		s.step!(s, 32)
		if (s.endTop) {
			return 10
		}
		if (s.err == null) {
			s.err = new SyntaxError({Offset: s.bytes, msg: "unexpected end of JSON input"})
		}
		return 11
	}

	// pushParseState pushes a new parse state newParseState onto the parse stack.
	// an error state is returned if maxNestingDepth was exceeded, otherwise successState is returned.
	public pushParseState(c: number, newParseState: number, successState: number): number {
		const s = this
		s.parseState = $.append(s.parseState, newParseState)
		if ($.len(s.parseState) <= 10000) {
			return successState
		}
		return s.error(c, "exceeded max depth")
	}

	// popParseState pops a parse state (already obtained) off the stack
	// and updates s.step accordingly.
	public popParseState(): void {
		const s = this
		let n = $.len(s.parseState) - 1
		s.parseState = $.goSlice(s.parseState, 0, n)
		if (n == 0) {
			s.step = stateEndTop
			s.endTop = true
		} else {
			s.step = stateEndValue
		}
	}

	// error records an error and switches to the error state.
	public error(c: number, context: string): number {
		const s = this
		s.step = stateError
		s.err = new SyntaxError({Offset: s.bytes, msg: "invalid character " + quoteChar(c) + " " + context})
		return 11
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.scanner',
	  new scanner(),
	  [{ name: "reset", args: [], returns: [] }, { name: "eof", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "pushParseState", args: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "byte" } }, { name: "newParseState", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "successState", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "popParseState", args: [], returns: [] }, { name: "error", args: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "byte" } }, { name: "context", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
	  scanner,
	  {"step": { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "scanner" }, { kind: $.TypeKind.Basic, name: "byte" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] }, "endTop": { kind: $.TypeKind.Basic, name: "bool" }, "parseState": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "bytes": { kind: $.TypeKind.Basic, name: "int64" }}
	);
}

export let scannerPool: $.VarRef<sync.Pool> = $.varRef($.markAsStructValue(new sync.Pool({New: (): null | any => {
	return new scanner({})
}})))

// Valid reports whether data is a valid JSON encoding.
export function Valid(data: $.Bytes): boolean {
	using __defer = new $.DisposableStack();
	let scan = newScanner()
	__defer.defer(() => {
		freeScanner(scan)
	});
	return checkValid(data, scan) == null
}

// checkValid verifies that data is valid JSON-encoded data.
// scan is passed in for use by checkValid to avoid an allocation.
// checkValid returns nil or a SyntaxError.
export function checkValid(data: $.Bytes, scan: scanner | null): $.GoError {
	scan!.reset()
	for (let _i = 0; _i < $.len(data); _i++) {
		let c = data![_i]
		{
			scan!.bytes++
			if (scan!.step!(scan, c) == 11) {
				return scan!.err
			}
		}
	}
	if (scan!.eof() == 11) {
		return scan!.err
	}
	return null
}

export function newScanner(): scanner | null {
	let scan = $.mustTypeAssert<scanner | null>(scannerPool!.value.Get(), {kind: $.TypeKind.Pointer, elemType: 'encoding/json.scanner'})
	// scan.reset by design doesn't set bytes to zero
	scan!.bytes = 0
	scan!.reset()
	return scan
}

export function freeScanner(scan: scanner | null): void {
	// Avoid hanging on to too much memory in extreme cases.
	if ($.len(scan!.parseState) > 1024) {
		scan!.parseState = null
	}
	scannerPool!.value.Put(scan)
}

export function isSpace(c: number): boolean {
	return c <= 32 && (c == 32 || c == 9 || c == 13 || c == 10)
}

// stateBeginValueOrEmpty is the state after reading `[`.
export function stateBeginValueOrEmpty(s: scanner | null, c: number): number {
	if (isSpace(c)) {
		return 9
	}
	if (c == 93) {
		return stateEndValue(s, c)
	}
	return stateBeginValue(s, c)
}

// stateBeginValue is the state at the beginning of the input.
export function stateBeginValue(s: scanner | null, c: number): number {
	if (isSpace(c)) {
		return 9
	}

	// beginning of 0.123

	// beginning of true

	// beginning of false

	// beginning of null
	switch (c) {
		case 123: {
			s!.step = stateBeginStringOrEmpty
			return s!.pushParseState(c, 0, 2)
			break
		}
		case 91: {
			s!.step = stateBeginValueOrEmpty
			return s!.pushParseState(c, 2, 6)
			break
		}
		case 34: {
			s!.step = stateInString
			return 1
			break
		}
		case 45: {
			s!.step = stateNeg
			return 1
			break
		}
		case 48: {
			s!.step = state0
			return 1
			break
		}
		case 116: {
			s!.step = stateT
			return 1
			break
		}
		case 102: {
			s!.step = stateF
			return 1
			break
		}
		case 110: {
			s!.step = stateN
			return 1
			break
		}
	}
	// beginning of 1234.5
	if (49 <= c && c <= 57) {
		// beginning of 1234.5
		s!.step = state1
		return 1
	}
	return s!.error(c, "looking for beginning of value")
}

// stateBeginStringOrEmpty is the state after reading `{`.
export function stateBeginStringOrEmpty(s: scanner | null, c: number): number {
	if (isSpace(c)) {
		return 9
	}
	if (c == 125) {
		let n = $.len(s!.parseState)
		s!.parseState![n - 1] = 1
		return stateEndValue(s, c)
	}
	return stateBeginString(s, c)
}

// stateBeginString is the state after reading `{"key": value,`.
export function stateBeginString(s: scanner | null, c: number): number {
	if (isSpace(c)) {
		return 9
	}
	if (c == 34) {
		s!.step = stateInString
		return 1
	}
	return s!.error(c, "looking for beginning of object key string")
}

// stateEndValue is the state after completing a value,
// such as after reading `{}` or `true` or `["x"`.
export function stateEndValue(s: scanner | null, c: number): number {
	let n = $.len(s!.parseState)

	// Completed top-level before the current byte.
	if (n == 0) {
		// Completed top-level before the current byte.
		s!.step = stateEndTop
		s!.endTop = true
		return stateEndTop(s, c)
	}
	if (isSpace(c)) {
		s!.step = stateEndValue
		return 9
	}
	let ps = s!.parseState![n - 1]
	switch (ps) {
		case 0: {
			if (c == 58) {
				s!.parseState![n - 1] = 1
				s!.step = stateBeginValue
				return 3
			}
			return s!.error(c, "after object key")
			break
		}
		case 1: {
			if (c == 44) {
				s!.parseState![n - 1] = 0
				s!.step = stateBeginString
				return 4
			}
			if (c == 125) {
				s!.popParseState()
				return 5
			}
			return s!.error(c, "after object key:value pair")
			break
		}
		case 2: {
			if (c == 44) {
				s!.step = stateBeginValue
				return 7
			}
			if (c == 93) {
				s!.popParseState()
				return 8
			}
			return s!.error(c, "after array element")
			break
		}
	}
	return s!.error(c, "")
}

// stateEndTop is the state after finishing the top-level value,
// such as after reading `{}` or `[1,2,3]`.
// Only space characters should be seen now.
export function stateEndTop(s: scanner | null, c: number): number {

	// Complain about non-space byte on next call.
	if (!isSpace(c)) {
		// Complain about non-space byte on next call.
		s!.error(c, "after top-level value")
	}
	return 10
}

// stateInString is the state after reading `"`.
export function stateInString(s: scanner | null, c: number): number {
	if (c == 34) {
		s!.step = stateEndValue
		return 0
	}
	if (c == 92) {
		s!.step = stateInStringEsc
		return 0
	}
	if (c < 0x20) {
		return s!.error(c, "in string literal")
	}
	return 0
}

// stateInStringEsc is the state after reading `"\` during a quoted string.
export function stateInStringEsc(s: scanner | null, c: number): number {
	switch (c) {
		case 98:
		case 102:
		case 110:
		case 114:
		case 116:
		case 92:
		case 47:
		case 34: {
			s!.step = stateInString
			return 0
			break
		}
		case 117: {
			s!.step = stateInStringEscU
			return 0
			break
		}
	}
	return s!.error(c, "in string escape code")
}

// stateInStringEscU is the state after reading `"\u` during a quoted string.
export function stateInStringEscU(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57 || 97 <= c && c <= 102 || 65 <= c && c <= 70) {
		s!.step = stateInStringEscU1
		return 0
	}
	// numbers
	return s!.error(c, "in \\u hexadecimal character escape")
}

// stateInStringEscU1 is the state after reading `"\u1` during a quoted string.
export function stateInStringEscU1(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57 || 97 <= c && c <= 102 || 65 <= c && c <= 70) {
		s!.step = stateInStringEscU12
		return 0
	}
	// numbers
	return s!.error(c, "in \\u hexadecimal character escape")
}

// stateInStringEscU12 is the state after reading `"\u12` during a quoted string.
export function stateInStringEscU12(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57 || 97 <= c && c <= 102 || 65 <= c && c <= 70) {
		s!.step = stateInStringEscU123
		return 0
	}
	// numbers
	return s!.error(c, "in \\u hexadecimal character escape")
}

// stateInStringEscU123 is the state after reading `"\u123` during a quoted string.
export function stateInStringEscU123(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57 || 97 <= c && c <= 102 || 65 <= c && c <= 70) {
		s!.step = stateInString
		return 0
	}
	// numbers
	return s!.error(c, "in \\u hexadecimal character escape")
}

// stateNeg is the state after reading `-` during a number.
export function stateNeg(s: scanner | null, c: number): number {
	if (c == 48) {
		s!.step = state0
		return 0
	}
	if (49 <= c && c <= 57) {
		s!.step = state1
		return 0
	}
	return s!.error(c, "in numeric literal")
}

// state1 is the state after reading a non-zero integer during a number,
// such as after reading `1` or `100` but not `0`.
export function state1(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57) {
		s!.step = state1
		return 0
	}
	return state0(s, c)
}

// state0 is the state after reading `0` during a number.
export function state0(s: scanner | null, c: number): number {
	if (c == 46) {
		s!.step = stateDot
		return 0
	}
	if (c == 101 || c == 69) {
		s!.step = stateE
		return 0
	}
	return stateEndValue(s, c)
}

// stateDot is the state after reading the integer and decimal point in a number,
// such as after reading `1.`.
export function stateDot(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57) {
		s!.step = stateDot0
		return 0
	}
	return s!.error(c, "after decimal point in numeric literal")
}

// stateDot0 is the state after reading the integer, decimal point, and subsequent
// digits of a number, such as after reading `3.14`.
export function stateDot0(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57) {
		return 0
	}
	if (c == 101 || c == 69) {
		s!.step = stateE
		return 0
	}
	return stateEndValue(s, c)
}

// stateE is the state after reading the mantissa and e in a number,
// such as after reading `314e` or `0.314e`.
export function stateE(s: scanner | null, c: number): number {
	if (c == 43 || c == 45) {
		s!.step = stateESign
		return 0
	}
	return stateESign(s, c)
}

// stateESign is the state after reading the mantissa, e, and sign in a number,
// such as after reading `314e-` or `0.314e+`.
export function stateESign(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57) {
		s!.step = stateE0
		return 0
	}
	return s!.error(c, "in exponent of numeric literal")
}

// stateE0 is the state after reading the mantissa, e, optional sign,
// and at least one digit of the exponent in a number,
// such as after reading `314e-2` or `0.314e+1` or `3.14e0`.
export function stateE0(s: scanner | null, c: number): number {
	if (48 <= c && c <= 57) {
		return 0
	}
	return stateEndValue(s, c)
}

// stateT is the state after reading `t`.
export function stateT(s: scanner | null, c: number): number {
	if (c == 114) {
		s!.step = stateTr
		return 0
	}
	return s!.error(c, "in literal true (expecting 'r')")
}

// stateTr is the state after reading `tr`.
export function stateTr(s: scanner | null, c: number): number {
	if (c == 117) {
		s!.step = stateTru
		return 0
	}
	return s!.error(c, "in literal true (expecting 'u')")
}

// stateTru is the state after reading `tru`.
export function stateTru(s: scanner | null, c: number): number {
	if (c == 101) {
		s!.step = stateEndValue
		return 0
	}
	return s!.error(c, "in literal true (expecting 'e')")
}

// stateF is the state after reading `f`.
export function stateF(s: scanner | null, c: number): number {
	if (c == 97) {
		s!.step = stateFa
		return 0
	}
	return s!.error(c, "in literal false (expecting 'a')")
}

// stateFa is the state after reading `fa`.
export function stateFa(s: scanner | null, c: number): number {
	if (c == 108) {
		s!.step = stateFal
		return 0
	}
	return s!.error(c, "in literal false (expecting 'l')")
}

// stateFal is the state after reading `fal`.
export function stateFal(s: scanner | null, c: number): number {
	if (c == 115) {
		s!.step = stateFals
		return 0
	}
	return s!.error(c, "in literal false (expecting 's')")
}

// stateFals is the state after reading `fals`.
export function stateFals(s: scanner | null, c: number): number {
	if (c == 101) {
		s!.step = stateEndValue
		return 0
	}
	return s!.error(c, "in literal false (expecting 'e')")
}

// stateN is the state after reading `n`.
export function stateN(s: scanner | null, c: number): number {
	if (c == 117) {
		s!.step = stateNu
		return 0
	}
	return s!.error(c, "in literal null (expecting 'u')")
}

// stateNu is the state after reading `nu`.
export function stateNu(s: scanner | null, c: number): number {
	if (c == 108) {
		s!.step = stateNul
		return 0
	}
	return s!.error(c, "in literal null (expecting 'l')")
}

// stateNul is the state after reading `nul`.
export function stateNul(s: scanner | null, c: number): number {
	if (c == 108) {
		s!.step = stateEndValue
		return 0
	}
	return s!.error(c, "in literal null (expecting 'l')")
}

// stateError is the state after reaching a syntax error,
// such as after reading `[1}` or `5.1.2`.
export function stateError(s: scanner | null, c: number): number {
	return 11
}

// quoteChar formats c as a quoted character literal.
export function quoteChar(c: number): string {
	// special cases - different from quoted strings
	if (c == 39) {
		return "'\\''"
	}
	if (c == 34) {
		return `'"'`
	}

	// use quoted string with different quotation marks
	let s = strconv.Quote($.runeOrStringToString(c))
	return "'" + $.sliceString(s, 1, $.len(s) - 1) + "'"
}

