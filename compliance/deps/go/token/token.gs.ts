import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

// Special tokens
export let ILLEGAL: Token = 0

export let EOF: Token = 0

export let COMMENT: Token = 0

export let literal_beg: Token = 0

// Identifiers and basic type literals
// (these tokens stand for classes of literals)
// main
export let IDENT: Token = 0

// 12345
export let INT: Token = 0

// 123.45
export let FLOAT: Token = 0

// 123.45i
export let IMAG: Token = 0

// 'a'
export let CHAR: Token = 0

// "abc"
export let STRING: Token = 0

export let literal_end: Token = 0

export let operator_beg: Token = 0

// Operators and delimiters
// +
export let ADD: Token = 0

// -
export let SUB: Token = 0

// *
export let MUL: Token = 0

// /
export let QUO: Token = 0

// %
export let REM: Token = 0

// &
export let AND: Token = 0

// |
export let OR: Token = 0

// ^
export let XOR: Token = 0

// <<
export let SHL: Token = 0

// >>
export let SHR: Token = 0

// &^
export let AND_NOT: Token = 0

// +=
export let ADD_ASSIGN: Token = 0

// -=
export let SUB_ASSIGN: Token = 0

// *=
export let MUL_ASSIGN: Token = 0

// /=
export let QUO_ASSIGN: Token = 0

// %=
export let REM_ASSIGN: Token = 0

// &=
export let AND_ASSIGN: Token = 0

// |=
export let OR_ASSIGN: Token = 0

// ^=
export let XOR_ASSIGN: Token = 0

// <<=
export let SHL_ASSIGN: Token = 0

// >>=
export let SHR_ASSIGN: Token = 0

// &^=
export let AND_NOT_ASSIGN: Token = 0

// &&
export let LAND: Token = 0

// ||
export let LOR: Token = 0

// <-
export let ARROW: Token = 0

// ++
export let INC: Token = 0

// --
export let DEC: Token = 0

// ==
export let EQL: Token = 0

// <
export let LSS: Token = 0

// >
export let GTR: Token = 0

// =
export let ASSIGN: Token = 0

// !
export let NOT: Token = 0

// !=
export let NEQ: Token = 0

// <=
export let LEQ: Token = 0

// >=
export let GEQ: Token = 0

// :=
export let DEFINE: Token = 0

// ...
export let ELLIPSIS: Token = 0

// (
export let LPAREN: Token = 0

// [
export let LBRACK: Token = 0

// {
export let LBRACE: Token = 0

// ,
export let COMMA: Token = 0

// .
export let PERIOD: Token = 0

// )
export let RPAREN: Token = 0

// ]
export let RBRACK: Token = 0

// }
export let RBRACE: Token = 0

// ;
export let SEMICOLON: Token = 0

// :
export let COLON: Token = 0

export let operator_end: Token = 0

export let keyword_beg: Token = 0

// Keywords
export let BREAK: Token = 0

export let CASE: Token = 0

export let CHAN: Token = 0

export let CONST: Token = 0

export let CONTINUE: Token = 0

export let DEFAULT: Token = 0

export let DEFER: Token = 0

export let ELSE: Token = 0

export let FALLTHROUGH: Token = 0

export let FOR: Token = 0

export let FUNC: Token = 0

export let GO: Token = 0

export let GOTO: Token = 0

export let IF: Token = 0

export let IMPORT: Token = 0

export let INTERFACE: Token = 0

export let MAP: Token = 0

export let PACKAGE: Token = 0

export let RANGE: Token = 0

export let RETURN: Token = 0

export let SELECT: Token = 0

export let STRUCT: Token = 0

export let SWITCH: Token = 0

export let TYPE: Token = 0

export let VAR: Token = 0

export let keyword_end: Token = 0

export let additional_beg: Token = 0

// additional tokens, handled in an ad-hoc manner
export let TILDE: Token = 0

export let additional_end: Token = 0

// non-operators
export let LowestPrec: number = 0

export let UnaryPrec: number = 6

export let HighestPrec: number = 7

export type Token = number;

export function Token_String(tok: Token): string {
	let s = ""
	if (0 <= tok && tok < ($.len(tokens) as Token)) {
		s = tokens![tok]
	}
	if (s == "") {
		s = "token(" + strconv.Itoa(tok) + ")"
	}
	return s
}

export function Token_Precedence(op: Token): number {
	switch (op) {
		case 35: {
			return 1
			break
		}
		case 34: {
			return 2
			break
		}
		case 39:
		case 44:
		case 40:
		case 45:
		case 41:
		case 46: {
			return 3
			break
		}
		case 12:
		case 13:
		case 18:
		case 19: {
			return 4
			break
		}
		case 14:
		case 15:
		case 16:
		case 20:
		case 21:
		case 17:
		case 22: {
			return 5
			break
		}
	}
	return 0
}

export function Token_IsLiteral(tok: Token): boolean {
	return 3 < tok && tok < 10
}

export function Token_IsOperator(tok: Token): boolean {
	return (11 < tok && tok < 59) || tok == 88
}

export function Token_IsKeyword(tok: Token): boolean {
	return 60 < tok && tok < 86
}


export let keywords: Map<string, Token> | null = null

export let tokens = $.arrayToSlice<string>(["ILLEGAL", "EOF", "COMMENT", "", "IDENT", "INT", "FLOAT", "IMAG", "CHAR", "STRING", "", "", "+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>", "&^", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>=", "&^=", "&&", "||", "<-", "++", "--", "==", "<", ">", "=", "!", "!=", "<=", ">=", ":=", "...", "(", "[", "{", ",", ".", ")", "]", "}", ";", ":", "", "", "break", "case", "chan", "const", "continue", "default", "defer", "else", "fallthrough", "for", "func", "go", "goto", "if", "import", "interface", "map", "package", "range", "return", "select", "struct", "switch", "type", "var", "", "", "~"])

export function init(): void {
	keywords = $.makeMap<string, Token>()
	for (let i = 60 + 1; i < 86; i++) {
		$.mapSet(keywords, tokens![i], i)
	}
}

// Lookup maps an identifier to its keyword token or [IDENT] (if not a keyword).
export function Lookup(ident: string): Token {
	{
		let [tok, is_keyword] = $.mapGet(keywords, ident, 0)
		if (is_keyword) {
			return tok
		}
	}
	return 4
}

// IsExported reports whether name starts with an upper-case letter.
export function IsExported(name: string): boolean {
	let [ch, ] = utf8.DecodeRuneInString(name)
	return unicode.IsUpper(ch)
}

// IsKeyword reports whether name is a Go keyword, such as "func" or "return".
export function IsKeyword(name: string): boolean {
	// TODO: opt: use a perfect hash function instead of a global map.
	let [, ok] = $.mapGet(keywords, name, 0)
	return ok
}

// IsIdentifier reports whether name is a Go identifier, that is, a non-empty
// string made up of letters, digits, and underscores, where the first character
// is not a digit. Keywords are not identifiers.
export function IsIdentifier(name: string): boolean {
	if (name == "" || IsKeyword(name)) {
		return false
	}
	{
		const _runes = $.stringToRunes(name)
		for (let i = 0; i < _runes.length; i++) {
			let c = _runes[i]
			{
				if (!unicode.IsLetter(c) && c != 95 && (i == 0 || !unicode.IsDigit(c))) {
					return false
				}
			}
		}
	}
	return true
}

