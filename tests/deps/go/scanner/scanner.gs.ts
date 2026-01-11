import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as token from "@goscript/go/token/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

// byte order mark, only permitted as very first character
export let bom: number = 0xFEFF

// end of file
export let eof: number = -1

// return comments as COMMENT tokens
export let ScanComments: Mode = (1 << 0)

// do not automatically insert semicolons - for testing only
export let dontInsertSemis: Mode = 0

export type ErrorHandler = ((pos: token.Position, msg: string) => void) | null;

export type Mode = number;

export class Scanner {
	// immutable state
	// source file handle
	public get file(): token.File | null {
		return this._fields.file.value
	}
	public set file(value: token.File | null) {
		this._fields.file.value = value
	}

	// directory portion of file.Name()
	public get dir(): string {
		return this._fields.dir.value
	}
	public set dir(value: string) {
		this._fields.dir.value = value
	}

	// source
	public get src(): $.Bytes {
		return this._fields.src.value
	}
	public set src(value: $.Bytes) {
		this._fields.src.value = value
	}

	// error reporting; or nil
	public get err(): ErrorHandler | null {
		return this._fields.err.value
	}
	public set err(value: ErrorHandler | null) {
		this._fields.err.value = value
	}

	// scanning mode
	public get mode(): Mode {
		return this._fields.mode.value
	}
	public set mode(value: Mode) {
		this._fields.mode.value = value
	}

	// scanning state
	// current character
	public get ch(): number {
		return this._fields.ch.value
	}
	public set ch(value: number) {
		this._fields.ch.value = value
	}

	// character offset
	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	// reading offset (position after current character)
	public get rdOffset(): number {
		return this._fields.rdOffset.value
	}
	public set rdOffset(value: number) {
		this._fields.rdOffset.value = value
	}

	// current line offset
	public get lineOffset(): number {
		return this._fields.lineOffset.value
	}
	public set lineOffset(value: number) {
		this._fields.lineOffset.value = value
	}

	// insert a semicolon before next newline
	public get insertSemi(): boolean {
		return this._fields.insertSemi.value
	}
	public set insertSemi(value: boolean) {
		this._fields.insertSemi.value = value
	}

	// position of newline in preceding comment
	public get nlPos(): token.Pos {
		return this._fields.nlPos.value
	}
	public set nlPos(value: token.Pos) {
		this._fields.nlPos.value = value
	}

	// public state - ok to modify
	// number of errors encountered
	public get ErrorCount(): number {
		return this._fields.ErrorCount.value
	}
	public set ErrorCount(value: number) {
		this._fields.ErrorCount.value = value
	}

	public _fields: {
		file: $.VarRef<token.File | null>;
		dir: $.VarRef<string>;
		src: $.VarRef<$.Bytes>;
		err: $.VarRef<ErrorHandler | null>;
		mode: $.VarRef<Mode>;
		ch: $.VarRef<number>;
		offset: $.VarRef<number>;
		rdOffset: $.VarRef<number>;
		lineOffset: $.VarRef<number>;
		insertSemi: $.VarRef<boolean>;
		nlPos: $.VarRef<token.Pos>;
		ErrorCount: $.VarRef<number>;
	}

	constructor(init?: Partial<{ErrorCount?: number, ch?: number, dir?: string, err?: ErrorHandler | null, file?: token.File | null, insertSemi?: boolean, lineOffset?: number, mode?: Mode, nlPos?: token.Pos, offset?: number, rdOffset?: number, src?: $.Bytes}>) {
		this._fields = {
			file: $.varRef(init?.file ?? null),
			dir: $.varRef(init?.dir ?? ""),
			src: $.varRef(init?.src ?? new Uint8Array(0)),
			err: $.varRef(init?.err ?? null),
			mode: $.varRef(init?.mode ?? 0 as Mode),
			ch: $.varRef(init?.ch ?? 0),
			offset: $.varRef(init?.offset ?? 0),
			rdOffset: $.varRef(init?.rdOffset ?? 0),
			lineOffset: $.varRef(init?.lineOffset ?? 0),
			insertSemi: $.varRef(init?.insertSemi ?? false),
			nlPos: $.varRef(init?.nlPos ?? 0 as token.Pos),
			ErrorCount: $.varRef(init?.ErrorCount ?? 0)
		}
	}

	public clone(): Scanner {
		const cloned = new Scanner()
		cloned._fields = {
			file: $.varRef(this._fields.file.value ? $.markAsStructValue(this._fields.file.value.clone()) : null),
			dir: $.varRef(this._fields.dir.value),
			src: $.varRef(this._fields.src.value),
			err: $.varRef(this._fields.err.value),
			mode: $.varRef(this._fields.mode.value),
			ch: $.varRef(this._fields.ch.value),
			offset: $.varRef(this._fields.offset.value),
			rdOffset: $.varRef(this._fields.rdOffset.value),
			lineOffset: $.varRef(this._fields.lineOffset.value),
			insertSemi: $.varRef(this._fields.insertSemi.value),
			nlPos: $.varRef(this._fields.nlPos.value),
			ErrorCount: $.varRef(this._fields.ErrorCount.value)
		}
		return cloned
	}

	// Read the next Unicode char into s.ch.
	// s.ch < 0 means end-of-file.
	//
	// For optimization, there is some overlap between this method and
	// s.scanIdentifier.
	public async next(): Promise<void> {
		const s = this
		if (s.rdOffset < $.len(s.src)) {
			s.offset = s.rdOffset
			if (Number(s.ch) == 10) {
				s.lineOffset = s.offset
				await s.file!.AddLine(s.offset)
			}
			let [r, w] = [(s.src![s.rdOffset] as number), 1]

			// not ASCII

			// U+FEFF BOM at start of file, encoded as big- or little-endian
			// UCS-2 (i.e. 2-byte UTF-16). Give specific error (go.dev/issue/71950).

			// consume all input to avoid error cascade
			switch (true) {
				case r == 0: {
					await s.error(s.offset, "illegal character NUL")
					break
				}
				case r >= utf8.RuneSelf: {
					;[r, w] = utf8.DecodeRune($.goSlice(s.src, s.rdOffset, undefined))
					if (r == utf8.RuneError && w == 1) {
						let _in = $.goSlice(s.src, s.rdOffset, undefined)

						// U+FEFF BOM at start of file, encoded as big- or little-endian
						// UCS-2 (i.e. 2-byte UTF-16). Give specific error (go.dev/issue/71950).

						// consume all input to avoid error cascade
						if (Number(s.offset) == 0 && $.len(_in) >= 2 && (_in![0] == 0xFF && _in![1] == 0xFE || _in![0] == 0xFE && _in![1] == 0xFF)) {
							// U+FEFF BOM at start of file, encoded as big- or little-endian
							// UCS-2 (i.e. 2-byte UTF-16). Give specific error (go.dev/issue/71950).
							await s.error(s.offset, "illegal UTF-8 encoding (got UTF-16)")
							s.rdOffset += $.len(_in) // consume all input to avoid error cascade
						} else {
							await s.error(s.offset, "illegal UTF-8 encoding")
						}
					} else if (r == 65279 && s.offset > 0) {
						await s.error(s.offset, "illegal byte order mark")
					}
					break
				}
			}
			s.rdOffset += w
			s.ch = r
		} else {
			s.offset = $.len(s.src)
			if (Number(s.ch) == 10) {
				s.lineOffset = s.offset
				await s.file!.AddLine(s.offset)
			}
			s.ch = -1
		}
	}

	// peek returns the byte following the most recently read character without
	// advancing the scanner. If the scanner is at EOF, peek returns 0.
	public peek(): number {
		const s = this
		if (s.rdOffset < $.len(s.src)) {
			return s.src![s.rdOffset]
		}
		return 0
	}

	// Init prepares the scanner s to tokenize the text src by setting the
	// scanner at the beginning of src. The scanner uses the file set file
	// for position information and it adds line information for each line.
	// It is ok to re-use the same file when re-scanning the same file as
	// line information which is already present is ignored. Init causes a
	// panic if the file size does not match the src size.
	//
	// Calls to [Scanner.Scan] will invoke the error handler err if they encounter a
	// syntax error and err is not nil. Also, for each error encountered,
	// the [Scanner] field ErrorCount is incremented by one. The mode parameter
	// determines how comments are handled.
	//
	// Note that Init may call err if there is an error in the first character
	// of the file.
	public async Init(file: token.File | null, src: $.Bytes, err: ErrorHandler | null, mode: Mode): Promise<void> {
		const s = this
		if (file!.Size() != $.len(src)) {
			$.panic(fmt.Sprintf("file size (%d) does not match src len (%d)", file!.Size(), $.len(src)))
		}
		s.file = file
		{
		  const _tmp = filepath.Split(file!.Name())
		  s.dir = _tmp[0]
		}
		s.src = src
		s.err = err
		s.mode = mode
		s.ch = 32
		s.offset = 0
		s.rdOffset = 0
		s.lineOffset = 0
		s.insertSemi = false
		s.ErrorCount = 0
		await s.next()
		if (Number(s.ch) == 65279) {
			await s.next() // ignore BOM at file beginning
		}
	}

	public async error(offs: number, msg: string): Promise<void> {
		const s = this
		if (s.err != null) {
			s.err!(await s.file!.Position(s.file!.Pos(offs)), msg)
		}
		s.ErrorCount++
	}

	public async errorf(offs: number, format: string, ...args: any[]): Promise<void> {
		const s = this
		await s.error(offs, fmt.Sprintf(format, ...(args ?? [])))
	}

	// scanComment returns the text of the comment and (if nonzero)
	// the offset of the first newline within it, which implies a
	// /*...*/ comment.
	public async scanComment(): Promise<[string, number]> {
		const s = this
		let offs = s.offset - 1 // position of initial '/'
		let next = -1 // position immediately following the comment; < 0 means invalid comment
		let numCR = 0
		let nlOffset = 0 // offset of first newline within /*...*/ comment
		if (Number(s.ch) == 47) {
			//-style comment
			// (the final '\n' is not considered part of the comment)
			await s.next()
			for (; Number(s.ch) != 10 && s.ch >= 0; ) {
				if (Number(s.ch) == 13) {
					numCR++
				}
				await s.next()
			}
			// if we are at '\n', the position following the comment is afterwards
			next = s.offset
			if (Number(s.ch) == 10) {
				next++
			}
			// goto exit // goto statement skipped
		}
		await s.next()
		for (; s.ch >= 0; ) {
			let ch = s.ch
			if (ch == 13) {
				numCR++
			} else if (ch == 10 && nlOffset == 0) {
				nlOffset = s.offset
			}
			await s.next()
			if (ch == 42 && Number(s.ch) == 47) {
				await s.next()
				next = s.offset
				// goto exit // goto statement skipped
			}
		}
		await s.error(offs, "comment not terminated")
		exit: {
			let lit = $.goSlice(s.src, offs, s.offset)
		}
		if (numCR > 0 && $.len(lit) >= 2 && lit![1] == 47 && lit![$.len(lit) - 1] == 13) {
			lit = $.goSlice(lit, undefined, $.len(lit) - 1)
			numCR--
		}
		if (next >= 0 && (lit![1] == 42 || offs == s.lineOffset) && bytes.HasPrefix($.goSlice(lit, 2, undefined), prefix)) {
			await s.updateLineInfo(next, offs, lit)
		}
		if (numCR > 0) {
			lit = stripCR(lit, lit![1] == 42)
		}
		return [$.bytesToString(lit), nlOffset]
	}

	// updateLineInfo parses the incoming comment text at offset offs
	// as a line directive. If successful, it updates the line info table
	// for the position next per the line directive.
	public async updateLineInfo(next: number, offs: number, text: $.Bytes): Promise<void> {
		const s = this
		if (text![1] == 42) {
			text = $.goSlice(text, undefined, $.len(text) - 2) // lop off trailing "*/"
		}
		text = $.goSlice(text, 7, undefined) // lop off leading "//line " or "/*line "
		offs += 7
		let [i, n, ok] = trailingDigits(text)
		if (i == 0) {
			return 
		}
		if (!ok) {
			// text has a suffix :xxx but xxx is not a number
			await s.error(offs + i, "invalid line number: " + $.bytesToString($.goSlice(text, i, undefined)))
			return 
		}
		let maxLineCol: number = (1 << 30)
		let line: number = 0
		let col: number = 0
		let [i2, n2, ok2] = trailingDigits($.goSlice(text, undefined, i - 1))
		if (ok2) {
			//line filename:line:col
			;[i, i2] = [i2, i]
			;[line, col] = [n2, n]
			if (col == 0 || col > 1073741824) {
				await s.error(offs + i2, "invalid column number: " + $.bytesToString($.goSlice(text, i2, undefined)))
				return 
			}
			text = $.goSlice(text, undefined, i2 - 1) // lop off ":col"
		} else {
			//line filename:line
			line = n
		}
		if (line == 0 || line > 1073741824) {
			await s.error(offs + i, "invalid line number: " + $.bytesToString($.goSlice(text, i, undefined)))
			return 
		}
		let filename = $.bytesToString($.goSlice(text, undefined, i - 1)) // lop off ":line", and trim white space
		if (filename == "" && ok2) {
			filename = (await s.file!.Position(s.file!.Pos(offs)))!.Filename
		} else if (filename != "") {
			// Put a relative filename in the current directory.
			// This is for compatibility with earlier releases.
			// See issue 26671.
			filename = filepath.Clean(filename)
			if (!filepath.IsAbs(filename)) {
				filename = filepath.Join(s.dir, filename)
			}
		}
		await s.file!.AddLineColumnInfo(next, filename, line, col)
	}

	// scanIdentifier reads the string of valid identifier characters at s.offset.
	// It must only be called when s.ch is known to be a valid letter.
	//
	// Be careful when making changes to this function: it is optimized and affects
	// scanning performance significantly.
	public async scanIdentifier(): Promise<string> {
		const s = this
		let offs = s.offset
		for (let rdOffset = 0; rdOffset < $.len($.goSlice(s.src, s.rdOffset, undefined)); rdOffset++) {
			let b = $.goSlice(s.src, s.rdOffset, undefined)![rdOffset]
			{

				// Avoid assigning a rune for the common case of an ascii character.
				if (97 <= b && b <= 122 || 65 <= b && b <= 90 || b == 95 || 48 <= b && b <= 57) {
					// Avoid assigning a rune for the common case of an ascii character.
					continue
				}
				s.rdOffset += rdOffset

				// Optimization: we've encountered an ASCII character that's not a letter
				// or number. Avoid the call into s.next() and corresponding set up.
				//
				// Note that s.next() does some line accounting if s.ch is '\n', so this
				// shortcut is only possible because we know that the preceding character
				// is not '\n'.
				if (0 < b && b < utf8.RuneSelf) {
					// Optimization: we've encountered an ASCII character that's not a letter
					// or number. Avoid the call into s.next() and corresponding set up.
					//
					// Note that s.next() does some line accounting if s.ch is '\n', so this
					// shortcut is only possible because we know that the preceding character
					// is not '\n'.
					s.ch = (b as number)
					s.offset = s.rdOffset
					s.rdOffset++
					// goto exit // goto statement skipped
				}
				// We know that the preceding character is valid for an identifier because
				// scanIdentifier is only called when s.ch is a letter, so calling s.next()
				// at s.rdOffset resets the scanner state.
				await s.next()
				for (; isLetter(s.ch) || isDigit(s.ch); ) {
					await s.next()
				}
				// goto exit // goto statement skipped
			}
		}
		s.offset = $.len(s.src)
		s.rdOffset = $.len(s.src)
		s.ch = -1
		exit: return $.bytesToString($.goSlice(s.src, offs, s.offset))
	}

	// digits accepts the sequence { digit | '_' }.
	// If base <= 10, digits accepts any decimal digit but records
	// the offset (relative to the source start) of a digit >= base
	// in *invalid, if *invalid < 0.
	// digits returns a bitset describing whether the sequence contained
	// digits (bit 0 is set), or separators '_' (bit 1 is set).
	public async digits(base: number, invalid: $.VarRef<number> | null): Promise<number> {
		const s = this
		let digsep: number = 0
		if (base <= 10) {
			let max = (48 + base as number)

			// record invalid rune offset
			for (; isDecimal(s.ch) || Number(s.ch) == 95; ) {
				let ds = 1

				// record invalid rune offset
				if (Number(s.ch) == 95) {
					ds = 2
				} else if (s.ch >= max && invalid!.value < 0) {
					invalid!.value = s.offset // record invalid rune offset
				}
				digsep |= ds
				await s.next()
			}
		} else {
			for (; isHex(s.ch) || Number(s.ch) == 95; ) {
				let ds = 1
				if (Number(s.ch) == 95) {
					ds = 2
				}
				digsep |= ds
				await s.next()
			}
		}
		return digsep
	}

	public async scanNumber(): Promise<[token.Token, string]> {
		const s = this
		let offs = s.offset
		let tok = token.ILLEGAL
		let base = 10 // number base
		let prefix = (0 as number) // one of 0 (decimal), '0' (0-octal), 'x', 'o', or 'b'
		let digsep = 0 // bit 0: digit present, bit 1: '_' present
		let invalid = $.varRef(-1) // index of invalid digit in literal, or < 0
		if (Number(s.ch) != 46) {
			tok = token.INT

			// leading 0
			if (Number(s.ch) == 48) {
				await s.next()

				// leading 0
				switch (lower(s.ch)) {
					case 120: {
						await s.next()
						;[base, prefix] = [16, 120]
						break
					}
					case 111: {
						await s.next()
						;[base, prefix] = [8, 111]
						break
					}
					case 98: {
						await s.next()
						;[base, prefix] = [2, 98]
						break
					}
					default: {
						;[base, prefix] = [8, 48]
						digsep = 1
						break
					}
				}
			}
			digsep |= await s.digits(base, invalid)
		}
		if (Number(s.ch) == 46) {
			tok = token.FLOAT
			if (prefix == 111 || prefix == 98) {
				await s.error(s.offset, "invalid radix point in " + litname(prefix))
			}
			await s.next()
			digsep |= await s.digits(base, invalid)
		}
		if ((digsep & 1) == 0) {
			await s.error(s.offset, litname(prefix) + " has no digits")
		}
		{
			let e = lower(s.ch)
			if (e == 101 || e == 112) {
				switch (true) {
					case e == 101 && prefix != 0 && prefix != 48: {
						await s.errorf(s.offset, "%q exponent requires decimal mantissa", s.ch)
						break
					}
					case e == 112 && prefix != 120: {
						await s.errorf(s.offset, "%q exponent requires hexadecimal mantissa", s.ch)
						break
					}
				}
				await s.next()
				tok = token.FLOAT
				if (Number(s.ch) == 43 || Number(s.ch) == 45) {
					await s.next()
				}
				let ds = await s.digits(10, null)
				digsep |= ds
				if ((ds & 1) == 0) {
					await s.error(s.offset, "exponent has no digits")
				}
			} else if (prefix == 120 && tok == token.FLOAT) {
				await s.error(s.offset, "hexadecimal mantissa requires a 'p' exponent")
			}
		}
		if (Number(s.ch) == 105) {
			tok = token.IMAG
			await s.next()
		}
		let lit = $.bytesToString($.goSlice(s.src, offs, s.offset))
		if (tok == token.INT && invalid!.value >= 0) {
			await s.errorf(invalid!.value, "invalid digit %q in %s", $.indexString(lit, invalid!.value - offs), litname(prefix))
		}
		if ((digsep & 2) != 0) {
			{
				let i = invalidSep(lit)
				if (i >= 0) {
					await s.error(offs + i, "'_' must separate successive digits")
				}
			}
		}
		return [tok, lit]
	}

	// scanEscape parses an escape sequence where rune is the accepted
	// escaped quote. In case of a syntax error, it stops at the offending
	// character (without consuming it) and returns false. Otherwise
	// it returns true.
	public async scanEscape(quote: number): Promise<boolean> {
		const s = this
		let offs = s.offset
		let n: number = 0
		let base: number = 0
		let max: number = 0
		switch (s.ch) {
			case 97:
			case 98:
			case 102:
			case 110:
			case 114:
			case 116:
			case 118:
			case 92:
			case quote: {
				await s.next()
				return true
				break
			}
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55: {
				;[n, base, max] = [3, 8, 255]
				break
			}
			case 120: {
				await s.next()
				;[n, base, max] = [2, 16, 255]
				break
			}
			case 117: {
				await s.next()
				;[n, base, max] = [4, 16, unicode.MaxRune]
				break
			}
			case 85: {
				await s.next()
				;[n, base, max] = [8, 16, unicode.MaxRune]
				break
			}
			default: {
				let msg = "unknown escape sequence"
				if (s.ch < 0) {
					msg = "escape sequence not terminated"
				}
				await s.error(offs, msg)
				return false
				break
			}
		}
		let x: number = 0
		for (; n > 0; ) {
			let d = (digitVal(s.ch) as number)
			if (d >= base) {
				let msg = fmt.Sprintf("illegal character %#U in escape sequence", s.ch)
				if (s.ch < 0) {
					msg = "escape sequence not terminated"
				}
				await s.error(s.offset, msg)
				return false
			}
			x = x * base + d
			await s.next()
			n--
		}
		if (x > max || 0xD800 <= x && x < 0xE000) {
			await s.error(offs, "escape sequence is invalid Unicode code point")
			return false
		}
		return true
	}

	public async scanRune(): Promise<string> {
		const s = this
		let offs = s.offset - 1
		let valid = true
		let n = 0
		for (; ; ) {
			let ch = s.ch

			// only report error if we don't have one already
			if (ch == 10 || ch < 0) {
				// only report error if we don't have one already
				if (valid) {
					await s.error(offs, "rune literal not terminated")
					valid = false
				}
				break
			}
			await s.next()
			if (ch == 39) {
				break
			}
			n++

			// continue to read to closing quote
			if (ch == 92) {

				// continue to read to closing quote
				if (!await s.scanEscape(39)) {
					valid = false
				}
				// continue to read to closing quote
			}
		}
		if (valid && n != 1) {
			await s.error(offs, "illegal rune literal")
		}
		return $.bytesToString($.goSlice(s.src, offs, s.offset))
	}

	public async scanString(): Promise<string> {
		const s = this
		let offs = s.offset - 1
		for (; ; ) {
			let ch = s.ch
			if (ch == 10 || ch < 0) {
				await s.error(offs, "string literal not terminated")
				break
			}
			await s.next()
			if (ch == 34) {
				break
			}
			if (ch == 92) {
				await s.scanEscape(34)
			}
		}
		return $.bytesToString($.goSlice(s.src, offs, s.offset))
	}

	public async scanRawString(): Promise<string> {
		const s = this
		let offs = s.offset - 1
		let hasCR = false
		for (; ; ) {
			let ch = s.ch
			if (ch < 0) {
				await s.error(offs, "raw string literal not terminated")
				break
			}
			await s.next()
			if (ch == 96) {
				break
			}
			if (ch == 13) {
				hasCR = true
			}
		}
		let lit = $.goSlice(s.src, offs, s.offset)
		if (hasCR) {
			lit = stripCR(lit, false)
		}
		return $.bytesToString(lit)
	}

	public async skipWhitespace(): Promise<void> {
		const s = this
		for (; Number(s.ch) == 32 || Number(s.ch) == 9 || Number(s.ch) == 10 && !s.insertSemi || Number(s.ch) == 13; ) {
			await s.next()
		}
	}

	public async switch2(tok0: token.Token, tok1: token.Token): Promise<token.Token> {
		const s = this
		if (Number(s.ch) == 61) {
			await s.next()
			return tok1
		}
		return tok0
	}

	public async switch3(tok0: token.Token, tok1: token.Token, ch2: number, tok2: token.Token): Promise<token.Token> {
		const s = this
		if (Number(s.ch) == 61) {
			await s.next()
			return tok1
		}
		if (s.ch == ch2) {
			await s.next()
			return tok2
		}
		return tok0
	}

	public async switch4(tok0: token.Token, tok1: token.Token, ch2: number, tok2: token.Token, tok3: token.Token): Promise<token.Token> {
		const s = this
		if (Number(s.ch) == 61) {
			await s.next()
			return tok1
		}
		if (s.ch == ch2) {
			await s.next()
			if (Number(s.ch) == 61) {
				await s.next()
				return tok3
			}
			return tok2
		}
		return tok0
	}

	// Scan scans the next token and returns the token position, the token,
	// and its literal string if applicable. The source end is indicated by
	// [token.EOF].
	//
	// If the returned token is a literal ([token.IDENT], [token.INT], [token.FLOAT],
	// [token.IMAG], [token.CHAR], [token.STRING]) or [token.COMMENT], the literal string
	// has the corresponding value.
	//
	// If the returned token is a keyword, the literal string is the keyword.
	//
	// If the returned token is [token.SEMICOLON], the corresponding
	// literal string is ";" if the semicolon was present in the source,
	// and "\n" if the semicolon was inserted because of a newline or
	// at EOF.
	//
	// If the returned token is [token.ILLEGAL], the literal string is the
	// offending character.
	//
	// In all other cases, Scan returns an empty literal string.
	//
	// For more tolerant parsing, Scan will return a valid token if
	// possible even if a syntax error was encountered. Thus, even
	// if the resulting token sequence contains no illegal tokens,
	// a client may not assume that no error occurred. Instead it
	// must check the scanner's ErrorCount or the number of calls
	// of the error handler, if there was one installed.
	//
	// Scan adds line information to the file added to the file
	// set with Init. Token positions are relative to that file
	// and thus relative to the file set.
	public async Scan(): Promise<[token.Pos, token.Token, string]> {
		const s = this
		let pos: token.Pos = 0
		let tok: token.Token = 0
		let lit: string = ""
		scanAgain: if (token.Pos_IsValid(s.nlPos)) {
			// Return artificial ';' token after /*...*/ comment
			// containing newline, at position of first newline.
			;[pos, tok, lit] = [s.nlPos, token.SEMICOLON, "\n"]
			s.nlPos = token.NoPos
			return [pos, tok, lit]
		}
		await s.skipWhitespace()
		pos = s.file!.Pos(s.offset)
		let insertSemi = false
		{let ch = s.ch
			switch (true) {
				case isLetter(ch): {
					lit = await s.scanIdentifier()
					if ($.len(lit) > 1) {
						// keywords are longer than one letter - avoid lookup otherwise
						tok = token.Lookup(lit)
						switch (tok) {
							case token.IDENT:
							case token.BREAK:
							case token.CONTINUE:
							case token.FALLTHROUGH:
							case token.RETURN: {
								insertSemi = true
								break
							}
						}
					} else {
						insertSemi = true
						tok = token.IDENT
					}
					break
				}
				case isDecimal(ch) || ch == 46 && isDecimal((s.peek() as number)): {
					insertSemi = true
					;[tok, lit] = await s.scanNumber()
					break
				}
				default: {
					await s.next() // always make progress
					switch (ch) {
						case -1: {
							if (s.insertSemi) {
								s.insertSemi = false // EOF consumed
								return [pos, token.SEMICOLON, "\n"]
							}
							tok = token.EOF
							break
						}
						case 10: {
							s.insertSemi = false // newline consumed
							return [pos, token.SEMICOLON, "\n"]
							break
						}
						case 34: {
							insertSemi = true
							tok = token.STRING
							lit = await s.scanString()
							break
						}
						case 39: {
							insertSemi = true
							tok = token.CHAR
							lit = await s.scanRune()
							break
						}
						case 96: {
							insertSemi = true
							tok = token.STRING
							lit = await s.scanRawString()
							break
						}
						case 58: {
							tok = await s.switch2(token.COLON, token.DEFINE)
							break
						}
						case 46: {
							tok = token.PERIOD
							if (Number(s.ch) == 46 && s.peek() == 46) {
								await s.next()
								await s.next() // consume last '.'
								tok = token.ELLIPSIS
							}
							break
						}
						case 44: {
							tok = token.COMMA
							break
						}
						case 59: {
							tok = token.SEMICOLON
							lit = ";"
							break
						}
						case 40: {
							tok = token.LPAREN
							break
						}
						case 41: {
							insertSemi = true
							tok = token.RPAREN
							break
						}
						case 91: {
							tok = token.LBRACK
							break
						}
						case 93: {
							insertSemi = true
							tok = token.RBRACK
							break
						}
						case 123: {
							tok = token.LBRACE
							break
						}
						case 125: {
							insertSemi = true
							tok = token.RBRACE
							break
						}
						case 43: {
							tok = await s.switch3(token.ADD, token.ADD_ASSIGN, 43, token.INC)
							if (tok == token.INC) {
								insertSemi = true
							}
							break
						}
						case 45: {
							tok = await s.switch3(token.SUB, token.SUB_ASSIGN, 45, token.DEC)
							if (tok == token.DEC) {
								insertSemi = true
							}
							break
						}
						case 42: {
							tok = await s.switch2(token.MUL, token.MUL_ASSIGN)
							break
						}
						case 47: {
							if (Number(s.ch) == 47 || Number(s.ch) == 42) {
								// comment
								let [comment, nlOffset] = await s.scanComment()

								// For /*...*/ containing \n, return
								// COMMENT then artificial SEMICOLON.

								// preserve insertSemi info
								if (s.insertSemi && nlOffset != 0) {
									// For /*...*/ containing \n, return
									// COMMENT then artificial SEMICOLON.
									s.nlPos = s.file!.Pos(nlOffset)
									s.insertSemi = false
								} else {
									insertSemi = s.insertSemi // preserve insertSemi info
								}

								// skip comment
								if ((s.mode & 1) == 0) {
									// skip comment
									// goto scanAgain // goto statement skipped
								}
								tok = token.COMMENT
								lit = comment
							} else {
								// division
								tok = await s.switch2(token.QUO, token.QUO_ASSIGN)
							}
							break
						}
						case 37: {
							tok = await s.switch2(token.REM, token.REM_ASSIGN)
							break
						}
						case 94: {
							tok = await s.switch2(token.XOR, token.XOR_ASSIGN)
							break
						}
						case 60: {
							if (Number(s.ch) == 45) {
								await s.next()
								tok = token.ARROW
							} else {
								tok = await s.switch4(token.LSS, token.LEQ, 60, token.SHL, token.SHL_ASSIGN)
							}
							break
						}
						case 62: {
							tok = await s.switch4(token.GTR, token.GEQ, 62, token.SHR, token.SHR_ASSIGN)
							break
						}
						case 61: {
							tok = await s.switch2(token.ASSIGN, token.EQL)
							break
						}
						case 33: {
							tok = await s.switch2(token.NOT, token.NEQ)
							break
						}
						case 38: {
							if (Number(s.ch) == 94) {
								await s.next()
								tok = await s.switch2(token.AND_NOT, token.AND_NOT_ASSIGN)
							} else {
								tok = await s.switch3(token.AND, token.AND_ASSIGN, 38, token.LAND)
							}
							break
						}
						case 124: {
							tok = await s.switch3(token.OR, token.OR_ASSIGN, 124, token.LOR)
							break
						}
						case 126: {
							tok = token.TILDE
							break
						}
						default: {
							if (ch != 65279) {
								// Report an informative error for U+201[CD] quotation
								// marks, which are easily introduced via copy and paste.
								if (ch == 8220 || ch == 8221) {
									await s.errorf(s.file!.Offset(pos), "curly quotation mark %q (use neutral %q)", ch, 34)
								} else {
									await s.errorf(s.file!.Offset(pos), "illegal character %#U", ch)
								}
							}
							insertSemi = s.insertSemi // preserve insertSemi info
							tok = token.ILLEGAL
							lit = $.runeOrStringToString(ch)
							break
						}
					}
					break
				}
			}
		}if ((s.mode & 2) == 0) {
			s.insertSemi = insertSemi
		}
		return [pos, tok, lit]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/scanner.Scanner',
	  new Scanner(),
	  [{ name: "next", args: [], returns: [] }, { name: "peek", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "byte" } }] }, { name: "Init", args: [{ name: "file", type: { kind: $.TypeKind.Pointer, elemType: "File" } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "err", type: "ErrorHandler" }, { name: "mode", type: "Mode" }], returns: [] }, { name: "error", args: [{ name: "offs", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "errorf", args: [{ name: "offs", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "scanComment", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "updateLineInfo", args: [{ name: "next", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "offs", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [] }, { name: "scanIdentifier", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "digits", args: [{ name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "invalid", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "scanNumber", args: [], returns: [{ type: "Token" }, { type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "scanEscape", args: [{ name: "quote", type: { kind: $.TypeKind.Basic, name: "rune" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "scanRune", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "scanString", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "scanRawString", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "skipWhitespace", args: [], returns: [] }, { name: "switch2", args: [{ name: "tok0", type: "Token" }, { name: "tok1", type: "Token" }], returns: [{ type: "Token" }] }, { name: "switch3", args: [{ name: "tok0", type: "Token" }, { name: "tok1", type: "Token" }, { name: "ch2", type: { kind: $.TypeKind.Basic, name: "rune" } }, { name: "tok2", type: "Token" }], returns: [{ type: "Token" }] }, { name: "switch4", args: [{ name: "tok0", type: "Token" }, { name: "tok1", type: "Token" }, { name: "ch2", type: { kind: $.TypeKind.Basic, name: "rune" } }, { name: "tok2", type: "Token" }, { name: "tok3", type: "Token" }], returns: [{ type: "Token" }] }, { name: "Scan", args: [], returns: [{ type: "Pos" }, { type: "Token" }, { type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Scanner,
	  {"file": { kind: $.TypeKind.Pointer, elemType: "File" }, "dir": { kind: $.TypeKind.Basic, name: "string" }, "src": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "err": "ErrorHandler", "mode": "Mode", "ch": { kind: $.TypeKind.Basic, name: "rune" }, "offset": { kind: $.TypeKind.Basic, name: "int" }, "rdOffset": { kind: $.TypeKind.Basic, name: "int" }, "lineOffset": { kind: $.TypeKind.Basic, name: "int" }, "insertSemi": { kind: $.TypeKind.Basic, name: "bool" }, "nlPos": "Pos", "ErrorCount": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export let prefix: $.Bytes = $.stringToBytes("line ")

export function trailingDigits(text: $.Bytes): [number, number, boolean] {
	let i = bytes.LastIndexByte(text, 58) // look from right (Windows filenames may contain ':')

	// no ":"
	if (i < 0) {
		return [0, 0, false]
	}
	// i >= 0
	let [n, err] = strconv.ParseUint($.bytesToString($.goSlice(text, i + 1, undefined)), 10, 0)
	return [i + 1, $.int(n), err == null]
}

export function isLetter(ch: number): boolean {
	return 97 <= lower(ch) && lower(ch) <= 122 || ch == 95 || ch >= utf8.RuneSelf && unicode.IsLetter(ch)
}

export function isDigit(ch: number): boolean {
	return isDecimal(ch) || ch >= utf8.RuneSelf && unicode.IsDigit(ch)
}

export function digitVal(ch: number): number {
	switch (true) {
		case 48 <= ch && ch <= 57: {
			return $.int(ch - 48)
			break
		}
		case 97 <= lower(ch) && lower(ch) <= 102: {
			return $.int(lower(ch) - 97 + 10)
			break
		}
	}
	return 16
}

export function lower(ch: number): number {
	return ((97 - 65) | ch)
}

export function isDecimal(ch: number): boolean {
	return 48 <= ch && ch <= 57
}

export function isHex(ch: number): boolean {
	return 48 <= ch && ch <= 57 || 97 <= lower(ch) && lower(ch) <= 102
}

export function litname(prefix: number): string {
	switch (prefix) {
		case 120: {
			return "hexadecimal literal"
			break
		}
		case 111:
		case 48: {
			return "octal literal"
			break
		}
		case 98: {
			return "binary literal"
			break
		}
	}
	return "decimal literal"
}

// invalidSep returns the index of the first invalid separator in x, or -1.
export function invalidSep(x: string): number {
	let x1 = 32 // prefix char, we only care if it's 'x'
	let d = 46 // digit, one of '_', '0' (a digit), or '.' (anything else)
	let i = 0

	// a prefix counts as a digit
	if ($.len(x) >= 2 && $.indexString(x, 0) == 48) {
		x1 = lower(($.indexString(x, 1) as number))
		if (x1 == 120 || x1 == 111 || x1 == 98) {
			d = 48
			i = 2
		}
	}

	// mantissa and exponent

	// previous digit
	for (; i < $.len(x); i++) {
		let p = d // previous digit
		d = ($.indexString(x, i) as number)
		switch (true) {
			case d == 95: {
				if (p != 48) {
					return i
				}
				break
			}
			case isDecimal(d) || x1 == 120 && isHex(d): {
				d = 48
				break
			}
			default: {
				if (p == 95) {
					return i - 1
				}
				d = 46
				break
			}
		}
	}
	if (d == 95) {
		return $.len(x) - 1
	}

	return -1
}

export function stripCR(b: $.Bytes, comment: boolean): $.Bytes {
	let c = new Uint8Array($.len(b))
	let i = 0

	// In a /*-style comment, don't strip \r from *\r/ (incl.
	// sequences of \r from *\r\r...\r/) since the resulting
	// */ would terminate the comment too early unless the \r
	// is immediately following the opening /* in which case
	// it's ok because /*/ is not closed yet (issue #11151).
	for (let j = 0; j < $.len(b); j++) {
		let ch = b![j]
		{
			// In a /*-style comment, don't strip \r from *\r/ (incl.
			// sequences of \r from *\r\r...\r/) since the resulting
			// */ would terminate the comment too early unless the \r
			// is immediately following the opening /* in which case
			// it's ok because /*/ is not closed yet (issue #11151).
			if (ch != 13 || comment && i > $.len("/*") && c![i - 1] == 42 && j + 1 < $.len(b) && b![j + 1] == 47) {
				c![i] = ch
				i++
			}
		}
	}
	return $.goSlice(c, undefined, i)
}

