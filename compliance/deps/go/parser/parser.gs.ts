import * as $ from "@goscript/builtin/index.js"
import { resolveFile } from "./resolver.gs.js";
import { Mode } from "./interface.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as ast from "@goscript/go/ast/index.js"

import * as constraint from "@goscript/go/build/constraint/index.js"

import * as scanner from "@goscript/go/scanner/index.js"

import * as token from "@goscript/go/token/index.js"

import * as strings from "@goscript/strings/index.js"

let maxNestLev: number = 1e5

let basic: number = 0

let labelOk: number = 0

let rangeOk: number = 0

export class bailout {
	public get pos(): token.Pos {
		return this._fields.pos.value
	}
	public set pos(value: token.Pos) {
		this._fields.pos.value = value
	}

	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public _fields: {
		pos: $.VarRef<token.Pos>;
		msg: $.VarRef<string>;
	}

	constructor(init?: Partial<{msg?: string, pos?: token.Pos}>) {
		this._fields = {
			pos: $.varRef(init?.pos ?? 0 as token.Pos),
			msg: $.varRef(init?.msg ?? "")
		}
	}

	public clone(): bailout {
		const cloned = new bailout()
		cloned._fields = {
			pos: $.varRef(this._fields.pos.value),
			msg: $.varRef(this._fields.msg.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'bailout',
	  new bailout(),
	  [],
	  bailout,
	  {"pos": "Pos", "msg": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class field {
	public get name(): ast.Ident | null {
		return this._fields.name.value
	}
	public set name(value: ast.Ident | null) {
		this._fields.name.value = value
	}

	public get typ(): ast.Expr {
		return this._fields.typ.value
	}
	public set typ(value: ast.Expr) {
		this._fields.typ.value = value
	}

	public _fields: {
		name: $.VarRef<ast.Ident | null>;
		typ: $.VarRef<ast.Expr>;
	}

	constructor(init?: Partial<{name?: ast.Ident | null, typ?: ast.Expr}>) {
		this._fields = {
			name: $.varRef(init?.name ?? null),
			typ: $.varRef(init?.typ ?? null)
		}
	}

	public clone(): field {
		const cloned = new field()
		cloned._fields = {
			name: $.varRef(this._fields.name.value ? $.markAsStructValue(this._fields.name.value.clone()) : null),
			typ: $.varRef(this._fields.typ.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'field',
	  new field(),
	  [],
	  field,
	  {"name": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "typ": "Expr"}
	);
}

export type parseSpecFunction = ((doc: ast.CommentGroup | null, keyword: token.Token, iota: number) => ast.Spec) | null;

export class parser {
	public get file(): token.File | null {
		return this._fields.file.value
	}
	public set file(value: token.File | null) {
		this._fields.file.value = value
	}

	public get errors(): scanner.ErrorList {
		return this._fields.errors.value
	}
	public set errors(value: scanner.ErrorList) {
		this._fields.errors.value = value
	}

	public get scanner(): scanner.Scanner {
		return this._fields.scanner.value
	}
	public set scanner(value: scanner.Scanner) {
		this._fields.scanner.value = value
	}

	// Tracing/debugging
	// parsing mode
	public get mode(): Mode {
		return this._fields.mode.value
	}
	public set mode(value: Mode) {
		this._fields.mode.value = value
	}

	// == (mode&Trace != 0)
	public get trace(): boolean {
		return this._fields.trace.value
	}
	public set trace(value: boolean) {
		this._fields.trace.value = value
	}

	// indentation used for tracing output
	public get indent(): number {
		return this._fields.indent.value
	}
	public set indent(value: number) {
		this._fields.indent.value = value
	}

	// Comments
	public get comments(): $.Slice<ast.CommentGroup | null> {
		return this._fields.comments.value
	}
	public set comments(value: $.Slice<ast.CommentGroup | null>) {
		this._fields.comments.value = value
	}

	// last lead comment
	public get leadComment(): ast.CommentGroup | null {
		return this._fields.leadComment.value
	}
	public set leadComment(value: ast.CommentGroup | null) {
		this._fields.leadComment.value = value
	}

	// last line comment
	public get lineComment(): ast.CommentGroup | null {
		return this._fields.lineComment.value
	}
	public set lineComment(value: ast.CommentGroup | null) {
		this._fields.lineComment.value = value
	}

	// in top of file (before package clause)
	public get top(): boolean {
		return this._fields.top.value
	}
	public set top(value: boolean) {
		this._fields.top.value = value
	}

	// minimum Go version found in //go:build comment
	public get goVersion(): string {
		return this._fields.goVersion.value
	}
	public set goVersion(value: string) {
		this._fields.goVersion.value = value
	}

	// Next token
	// token position
	public get pos(): token.Pos {
		return this._fields.pos.value
	}
	public set pos(value: token.Pos) {
		this._fields.pos.value = value
	}

	// one token look-ahead
	public get tok(): token.Token {
		return this._fields.tok.value
	}
	public set tok(value: token.Token) {
		this._fields.tok.value = value
	}

	// token literal
	public get lit(): string {
		return this._fields.lit.value
	}
	public set lit(value: string) {
		this._fields.lit.value = value
	}

	// Error recovery
	// (used to limit the number of calls to parser.advance
	// w/o making scanning progress - avoids potential endless
	// loops across multiple parser functions during error recovery)
	// last synchronization position
	public get syncPos(): token.Pos {
		return this._fields.syncPos.value
	}
	public set syncPos(value: token.Pos) {
		this._fields.syncPos.value = value
	}

	// number of parser.advance calls without progress
	public get syncCnt(): number {
		return this._fields.syncCnt.value
	}
	public set syncCnt(value: number) {
		this._fields.syncCnt.value = value
	}

	// Non-syntactic parser control
	// < 0: in control clause, >= 0: in expression
	public get exprLev(): number {
		return this._fields.exprLev.value
	}
	public set exprLev(value: number) {
		this._fields.exprLev.value = value
	}

	// if set, the parser is parsing a rhs expression
	public get inRhs(): boolean {
		return this._fields.inRhs.value
	}
	public set inRhs(value: boolean) {
		this._fields.inRhs.value = value
	}

	// list of imports
	public get imports(): $.Slice<ast.ImportSpec | null> {
		return this._fields.imports.value
	}
	public set imports(value: $.Slice<ast.ImportSpec | null>) {
		this._fields.imports.value = value
	}

	// nestLev is used to track and limit the recursion depth
	// during parsing.
	public get nestLev(): number {
		return this._fields.nestLev.value
	}
	public set nestLev(value: number) {
		this._fields.nestLev.value = value
	}

	public _fields: {
		file: $.VarRef<token.File | null>;
		errors: $.VarRef<scanner.ErrorList>;
		scanner: $.VarRef<scanner.Scanner>;
		mode: $.VarRef<Mode>;
		trace: $.VarRef<boolean>;
		indent: $.VarRef<number>;
		comments: $.VarRef<$.Slice<ast.CommentGroup | null>>;
		leadComment: $.VarRef<ast.CommentGroup | null>;
		lineComment: $.VarRef<ast.CommentGroup | null>;
		top: $.VarRef<boolean>;
		goVersion: $.VarRef<string>;
		pos: $.VarRef<token.Pos>;
		tok: $.VarRef<token.Token>;
		lit: $.VarRef<string>;
		syncPos: $.VarRef<token.Pos>;
		syncCnt: $.VarRef<number>;
		exprLev: $.VarRef<number>;
		inRhs: $.VarRef<boolean>;
		imports: $.VarRef<$.Slice<ast.ImportSpec | null>>;
		nestLev: $.VarRef<number>;
	}

	constructor(init?: Partial<{comments?: $.Slice<ast.CommentGroup | null>, errors?: scanner.ErrorList, exprLev?: number, file?: token.File | null, goVersion?: string, imports?: $.Slice<ast.ImportSpec | null>, inRhs?: boolean, indent?: number, leadComment?: ast.CommentGroup | null, lineComment?: ast.CommentGroup | null, lit?: string, mode?: Mode, nestLev?: number, pos?: token.Pos, scanner?: scanner.Scanner, syncCnt?: number, syncPos?: token.Pos, tok?: token.Token, top?: boolean, trace?: boolean}>) {
		this._fields = {
			file: $.varRef(init?.file ?? null),
			errors: $.varRef(init?.errors ?? null as scanner.ErrorList),
			scanner: $.varRef(init?.scanner ? $.markAsStructValue(init.scanner.clone()) : new scanner.Scanner()),
			mode: $.varRef(init?.mode ?? new Mode(0)),
			trace: $.varRef(init?.trace ?? false),
			indent: $.varRef(init?.indent ?? 0),
			comments: $.varRef(init?.comments ?? null),
			leadComment: $.varRef(init?.leadComment ?? null),
			lineComment: $.varRef(init?.lineComment ?? null),
			top: $.varRef(init?.top ?? false),
			goVersion: $.varRef(init?.goVersion ?? ""),
			pos: $.varRef(init?.pos ?? 0 as token.Pos),
			tok: $.varRef(init?.tok ?? 0 as token.Token),
			lit: $.varRef(init?.lit ?? ""),
			syncPos: $.varRef(init?.syncPos ?? 0 as token.Pos),
			syncCnt: $.varRef(init?.syncCnt ?? 0),
			exprLev: $.varRef(init?.exprLev ?? 0),
			inRhs: $.varRef(init?.inRhs ?? false),
			imports: $.varRef(init?.imports ?? null),
			nestLev: $.varRef(init?.nestLev ?? 0)
		}
	}

	public clone(): parser {
		const cloned = new parser()
		cloned._fields = {
			file: $.varRef(this._fields.file.value ? $.markAsStructValue(this._fields.file.value.clone()) : null),
			errors: $.varRef(this._fields.errors.value),
			scanner: $.varRef($.markAsStructValue(this._fields.scanner.value.clone())),
			mode: $.varRef(this._fields.mode.value),
			trace: $.varRef(this._fields.trace.value),
			indent: $.varRef(this._fields.indent.value),
			comments: $.varRef(this._fields.comments.value),
			leadComment: $.varRef(this._fields.leadComment.value ? $.markAsStructValue(this._fields.leadComment.value.clone()) : null),
			lineComment: $.varRef(this._fields.lineComment.value ? $.markAsStructValue(this._fields.lineComment.value.clone()) : null),
			top: $.varRef(this._fields.top.value),
			goVersion: $.varRef(this._fields.goVersion.value),
			pos: $.varRef(this._fields.pos.value),
			tok: $.varRef(this._fields.tok.value),
			lit: $.varRef(this._fields.lit.value),
			syncPos: $.varRef(this._fields.syncPos.value),
			syncCnt: $.varRef(this._fields.syncCnt.value),
			exprLev: $.varRef(this._fields.exprLev.value),
			inRhs: $.varRef(this._fields.inRhs.value),
			imports: $.varRef(this._fields.imports.value),
			nestLev: $.varRef(this._fields.nestLev.value)
		}
		return cloned
	}

	public init(file: token.File | null, src: $.Bytes, mode: Mode): void {
		const p = this
		p.file = file
		let eh = (pos: token.Position, msg: string): void => {
			scanner.ErrorList_Add(p._fields.errors, pos, msg)
		}
		await p.scanner.Init(p.file, src, eh, scanner.ScanComments)
		p.top = true
		p.mode = mode
		p.trace = (mode & 8) != 0 // for convenience (p.trace is used frequently)
		p.next()
	}

	public printTrace(...a: any[]): void {
		const p = this
		let dots: string = ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . "
		let n: number = $.len(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ")
		let pos = $.markAsStructValue(await p.file!.Position(p.pos).clone())
		fmt.Printf("%5d:%3d: ", pos.Line, pos.Column)
		let i = 2 * p.indent
		for (; i > 64; ) {
			fmt.Print(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ")
			i -= 64
		}
		fmt.Print($.sliceString(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ", 0, i))
		fmt.Println(...(a ?? []))
	}

	// Advance to the next token.
	public next0(): void {
		const p = this
		if (p.trace && token.Pos_IsValid(p.pos)) {
			let s = token.Token_String(p.tok)
			switch (true) {
				case token.Token_IsLiteral(p.tok):
					p.printTrace(s, p.lit)
					break
				case token.Token_IsOperator(p.tok):
				case token.Token_IsKeyword(p.tok):
					p.printTrace("\"" + s + "\"")
					break
				default:
					p.printTrace(s)
					break
			}
		}
		for (; ; ) {
			{
			  const _tmp = await p.scanner.Scan()
			  p.pos = _tmp[0]
			  p.tok = _tmp[1]
			  p.lit = _tmp[2]
			}

			// Found a non-comment; top of file is over.
			if (p.tok == token.COMMENT) {
				if (p.top && strings.HasPrefix(p.lit, "//go:build")) {
					{
						let [x, err] = constraint.Parse(p.lit)
						if (err == null) {
							p.goVersion = constraint.GoVersion(x)
						}
					}
				}
				if ((p.mode & 4) == 0) {
					continue
				}
			}
			 else {
				// Found a non-comment; top of file is over.
				p.top = false
			}
			break
		}
	}

	// Consume a comment and return it and the line on which it ends.
	public consumeComment(): [ast.Comment | null, number] {
		const p = this
		let comment: ast.Comment | null = null
		let endline: number = 0
		endline = p.file!.Line(p.pos)
		if ($.indexString(p.lit, 1) == 42) {
			// don't use range here - no need to decode Unicode code points
			for (let i = 0; i < $.len(p.lit); i++) {
				if ($.indexString(p.lit, i) == 10) {
					endline++
				}
			}
		}
		comment = new ast.Comment({Slash: p.pos, Text: p.lit})
		p.next0()
		return [comment, endline]
	}

	// Consume a group of adjacent comments, add it to the parser's
	// comments list, and return it together with the line at which
	// the last comment in the group ends. A non-comment token or n
	// empty lines terminate a comment group.
	public consumeCommentGroup(n: number): [ast.CommentGroup | null, number] {
		const p = this
		let comments: ast.CommentGroup | null = null
		let endline: number = 0
		let list: $.Slice<ast.Comment | null> = null
		endline = p.file!.Line(p.pos)
		for (; p.tok == token.COMMENT && p.file!.Line(p.pos) <= endline + n; ) {
			let comment: ast.Comment | null = null
			;[comment, endline] = p.consumeComment()
			list = $.append(list, comment)
		}
		comments = new ast.CommentGroup({List: list})
		p.comments = $.append(p.comments, comments)
		return [comments, endline]
	}

	// Advance to the next non-comment token. In the process, collect
	// any comment groups encountered, and remember the last lead and
	// line comments.
	//
	// A lead comment is a comment group that starts and ends in a
	// line without any other tokens and that is followed by a non-comment
	// token on the line immediately after the comment group.
	//
	// A line comment is a comment group that follows a non-comment
	// token on the same line, and that has no tokens after it on the line
	// where it ends.
	//
	// Lead and line comments may be considered documentation that is
	// stored in the AST.
	public next(): void {
		const p = this
		p.leadComment = null
		p.lineComment = null
		let prev = p.pos
		p.next0()
		if (p.tok == token.COMMENT) {
			let comment: ast.CommentGroup | null = null
			let endline: number = 0

			// The comment is on same line as the previous token; it
			// cannot be a lead comment but may be a line comment.

			// The next token is on a different line, thus
			// the last comment group is a line comment.
			if (p.file!.Line(p.pos) == p.file!.Line(prev)) {
				// The comment is on same line as the previous token; it
				// cannot be a lead comment but may be a line comment.
				;[comment, endline] = p.consumeCommentGroup(0)

				// The next token is on a different line, thus
				// the last comment group is a line comment.
				if (p.file!.Line(p.pos) != endline || p.tok == token.SEMICOLON || p.tok == token.EOF) {
					// The next token is on a different line, thus
					// the last comment group is a line comment.
					p.lineComment = comment
				}
			}

			// consume successor comments, if any
			endline = -1
			for (; p.tok == token.COMMENT; ) {
				;[comment, endline] = p.consumeCommentGroup(1)
			}

			// The next token is following on the line immediately after the
			// comment group, thus the last comment group is a lead comment.
			if (endline + 1 == p.file!.Line(p.pos)) {
				// The next token is following on the line immediately after the
				// comment group, thus the last comment group is a lead comment.
				p.leadComment = comment
			}
		}
	}

	public error(pos: token.Pos, msg: string): void {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "error: " + msg))
			});
		}
		let epos = $.markAsStructValue(await p.file!.Position(pos).clone())
		if ((p.mode & 32) == 0) {
			let n = $.len(p.errors)

			// discard - likely a spurious error
			if (n > 0 && p.errors![n - 1]!.Pos.Line == epos.Line) {
				return 
			}
			if (n > 10) {
				$.panic($.markAsStructValue(new bailout({})))
			}
		}
		scanner.ErrorList_Add(p._fields.errors, epos, msg)
	}

	public errorExpected(pos: token.Pos, msg: string): void {
		const p = this
		msg = "expected " + msg
		if (pos == p.pos) {
			// the error happened at the current position;
			// make the error message more specific

			// print 123 rather than 'INT', etc.
			switch (true) {
				case p.tok == token.SEMICOLON && p.lit == "\n":
					msg += ", found newline"
					break
				case token.Token_IsLiteral(p.tok):
					msg += ", found " + p.lit
					break
				default:
					msg += ", found '" + token.Token_String(p.tok) + "'"
					break
			}
		}
		p.error(pos, msg)
	}

	public expect(tok: token.Token): token.Pos {
		const p = this
		let pos = p.pos
		if (p.tok != tok) {
			p.errorExpected(pos, "'" + token.Token_String(tok) + "'")
		}
		p.next() // make progress
		return pos
	}

	// expect2 is like expect, but it returns an invalid position
	// if the expected token is not found.
	public expect2(tok: token.Token): token.Pos {
		const p = this
		let pos: token.Pos = 0
		if (p.tok == tok) {
			pos = p.pos
		}
		 else {
			p.errorExpected(p.pos, "'" + token.Token_String(tok) + "'")
		}
		p.next() // make progress
		return pos
	}

	// expectClosing is like expect but provides a better error message
	// for the common case of a missing comma before a newline.
	public expectClosing(tok: token.Token, context: string): token.Pos {
		const p = this
		if (p.tok != tok && p.tok == token.SEMICOLON && p.lit == "\n") {
			p.error(p.pos, "missing ',' before newline in " + context)
			p.next()
		}
		return p.expect(tok)
	}

	// expectSemi consumes a semicolon and returns the applicable line comment.
	public expectSemi(): ast.CommentGroup | null {
		const p = this
		let comment: ast.CommentGroup | null = null
		if (p.tok != token.RPAREN && p.tok != token.RBRACE) {

			// permit a ',' instead of a ';' but complain

			// explicit semicolon

			// use following comments

			// artificial semicolon
			// use preceding comments
			switch (p.tok) {
				case token.COMMA:
					p.errorExpected(p.pos, "';'")
					// fallthrough // fallthrough statement skipped
					break
				case token.SEMICOLON:
					if (p.lit == ";") {
						// explicit semicolon
						p.next()
						comment = p.lineComment // use following comments
					}
					 else {
						// artificial semicolon
						comment = p.lineComment // use preceding comments
						p.next()
					}
					return comment
					break
				default:
					p.errorExpected(p.pos, "';'")
					p.advance(stmtStart)
					break
			}
		}
		return null
	}

	public atComma(context: string, follow: token.Token): boolean {
		const p = this
		if (p.tok == token.COMMA) {
			return true
		}
		if (p.tok != follow) {
			let msg = "missing ','"
			if (p.tok == token.SEMICOLON && p.lit == "\n") {
				msg += " before newline"
			}
			p.error(p.pos, msg + " in " + context)
			return true
		}
		return false
	}

	// advance consumes tokens until the current token p.tok
	// is in the 'to' set, or token.EOF. For error recovery.
	public advance(to: Map<token.Token, boolean> | null): void {
		const p = this
		for (; p.tok != token.EOF; p.next()) {

			// Return only if parser made some progress since last
			// sync or if it has not reached 10 advance calls without
			// progress. Otherwise consume at least one token to
			// avoid an endless parser loop (it is possible that
			// both parseOperand and parseStmt call advance and
			// correctly do not advance, thus the need for the
			// invocation limit p.syncCnt).

			// Reaching here indicates a parser bug, likely an
			// incorrect token list in this function, but it only
			// leads to skipping of possibly correct code if a
			// previous error is present, and thus is preferred
			// over a non-terminating parse.
			if ($.mapGet(to, p.tok, false)[0]) {
				// Return only if parser made some progress since last
				// sync or if it has not reached 10 advance calls without
				// progress. Otherwise consume at least one token to
				// avoid an endless parser loop (it is possible that
				// both parseOperand and parseStmt call advance and
				// correctly do not advance, thus the need for the
				// invocation limit p.syncCnt).
				if (p.pos == p.syncPos && p.syncCnt < 10) {
					p.syncCnt++
					return 
				}

				// Reaching here indicates a parser bug, likely an
				// incorrect token list in this function, but it only
				// leads to skipping of possibly correct code if a
				// previous error is present, and thus is preferred
				// over a non-terminating parse.
				if (p.pos > p.syncPos) {
					p.syncPos = p.pos
					p.syncCnt = 0
					return 
				}
				// Reaching here indicates a parser bug, likely an
				// incorrect token list in this function, but it only
				// leads to skipping of possibly correct code if a
				// previous error is present, and thus is preferred
				// over a non-terminating parse.
			}
		}
	}

	// safePos returns a valid file position for a given position: If pos
	// is valid to begin with, safePos returns pos. If pos is out-of-range,
	// safePos returns the EOF position.
	//
	// This is hack to work around "artificial" end positions in the AST which
	// are computed by adding 1 to (presumably valid) token positions. If the
	// token positions are invalid due to parse errors, the resulting end position
	// may be past the file's EOF position, which would lead to panics if used
	// later on.
	public safePos(pos: token.Pos): token.Pos {
		const p = this
		using __defer = new $.DisposableStack();
		let res: token.Pos = 0
		__defer.defer(() => {
			if ($.recover() != null) {
				res = (p.file!.Base() + p.file!.Size() as token.Pos) // EOF position
			}
		});
		/* _ = */ p.file!.Offset(pos) // trigger a panic if position is out-of-range
		return pos
	}

	public parseIdent(): ast.Ident | null {
		const p = this
		let pos = p.pos
		let name = "_"
		if (p.tok == token.IDENT) {
			name = p.lit
			p.next()
		}
		 else {
			p.expect(token.IDENT) // use expect() error handling
		}
		return new ast.Ident({Name: name, NamePos: pos})
	}

	public parseIdentList(): $.Slice<ast.Ident | null> {
		const p = this
		using __defer = new $.DisposableStack();
		let list: $.Slice<ast.Ident | null> = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "IdentList"))
			});
		}
		list = $.append(list, p.parseIdent())
		for (; p.tok == token.COMMA; ) {
			p.next()
			list = $.append(list, p.parseIdent())
		}
		return list
	}

	// If lhs is set, result list elements which are identifiers are not resolved.
	public parseExprList(): $.Slice<ast.Expr> {
		const p = this
		using __defer = new $.DisposableStack();
		let list: $.Slice<ast.Expr> = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ExpressionList"))
			});
		}
		list = $.append(list, p.parseExpr())
		for (; p.tok == token.COMMA; ) {
			p.next()
			list = $.append(list, p.parseExpr())
		}
		return list
	}

	public parseList(inRhs: boolean): $.Slice<ast.Expr> {
		const p = this
		let old = p.inRhs
		p.inRhs = inRhs
		let list = p.parseExprList()
		p.inRhs = old
		return list
	}

	public parseType(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Type"))
			});
		}
		let typ = p.tryIdentOrType()
		if (typ == null) {
			let pos = p.pos
			p.errorExpected(pos, "type")
			p.advance(exprEnd)
			return new ast.BadExpr({From: pos, To: p.pos})
		}
		return typ
	}

	public parseQualifiedIdent(ident: ast.Ident | null): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "QualifiedIdent"))
			});
		}
		let typ = p.parseTypeName(ident)
		if (p.tok == token.LBRACK) {
			typ = p.parseTypeInstance(typ)
		}
		return typ
	}

	// If the result is an identifier, it is not resolved.
	public parseTypeName(ident: ast.Ident | null): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "TypeName"))
			});
		}
		if (ident == null) {
			ident = p.parseIdent()
		}
		if (p.tok == token.PERIOD) {
			// ident is a package name
			p.next()
			let sel = p.parseIdent()
			return new ast.SelectorExpr({Sel: sel, X: ident})
		}
		return ident
	}

	// "[" has already been consumed, and lbrack is its position.
	// If len != nil it is the already consumed array length.
	public parseArrayType(lbrack: token.Pos, len: ast.Expr): ast.ArrayType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ArrayType"))
			});
		}
		if (len == null) {
			p.exprLev++
			// always permit ellipsis for more fault-tolerant parsing
			if (p.tok == token.ELLIPSIS) {
				len = new ast.Ellipsis({Ellipsis: p.pos})
				p.next()
			}
			 else if (p.tok != token.RBRACK) {
				len = p.parseRhs()
			}
			p.exprLev--
		}
		if (p.tok == token.COMMA) {
			// Trailing commas are accepted in type parameter
			// lists but not in array type declarations.
			// Accept for better error handling but complain.
			p.error(p.pos, "unexpected comma; expecting ]")
			p.next()
		}
		p.expect(token.RBRACK)
		let elt = p.parseType()
		return new ast.ArrayType({Elt: elt, Lbrack: lbrack, Len: len})
	}

	public parseArrayFieldOrTypeInstance(x: ast.Ident | null): [ast.Ident | null, ast.Expr] {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ArrayFieldOrTypeInstance"))
			});
		}
		let lbrack = p.expect(token.LBRACK)
		let trailingComma = token.NoPos // if valid, the position of a trailing comma preceding the ']'
		let args: $.Slice<ast.Expr> = null
		if (p.tok != token.RBRACK) {
			p.exprLev++
			args = $.append(args, p.parseRhs())
			for (; p.tok == token.COMMA; ) {
				let comma = p.pos
				p.next()
				if (p.tok == token.RBRACK) {
					trailingComma = comma
					break
				}
				args = $.append(args, p.parseRhs())
			}
			p.exprLev--
		}
		let rbrack = p.expect(token.RBRACK)
		if ($.len(args) == 0) {
			// x []E
			let elt = p.parseType()
			return [x, new ast.ArrayType({Elt: elt, Lbrack: lbrack})]
		}
		if ($.len(args) == 1) {
			let elt = p.tryIdentOrType()

			// x [P]E

			// Trailing commas are invalid in array type fields.
			if (elt != null) {
				// x [P]E

				// Trailing commas are invalid in array type fields.
				if (token.Pos_IsValid(trailingComma)) {
					// Trailing commas are invalid in array type fields.
					p.error(trailingComma, "unexpected comma; expecting ]")
				}
				return [x, new ast.ArrayType({Elt: elt, Lbrack: lbrack, Len: args![0]})]
			}
		}
		return [null, packIndexExpr(x, lbrack, args, rbrack)]
	}

	public parseFieldDecl(): ast.Field | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "FieldDecl"))
			});
		}
		let doc = p.leadComment
		let names: $.Slice<ast.Ident | null> = null
		let typ: ast.Expr = null
		switch (p.tok) {
			case token.IDENT:
				let name = p.parseIdent()
				if (p.tok == token.PERIOD || p.tok == token.STRING || p.tok == token.SEMICOLON || p.tok == token.RBRACE) {
					// embedded type
					typ = name
					if (p.tok == token.PERIOD) {
						typ = p.parseQualifiedIdent(name)
					}
				}
				 else {
					// name1, name2, ... T
					names = $.arrayToSlice<ast.Ident | null>([name])
					for (; p.tok == token.COMMA; ) {
						p.next()
						names = $.append(names, p.parseIdent())
					}
					// Careful dance: We don't know if we have an embedded instantiated
					// type T[P1, P2, ...] or a field T of array type []E or [P]E.

					// T P
					if ($.len(names) == 1 && p.tok == token.LBRACK) {
						;[name, typ] = p.parseArrayFieldOrTypeInstance(name)
						if (name == null) {
							names = null
						}
					}
					 else {
						// T P
						typ = p.parseType()
					}
				}
				break
			case token.MUL:
				let star = p.pos
				p.next()
				if (p.tok == token.LPAREN) {
					// *(T)
					p.error(p.pos, "cannot parenthesize embedded type")
					p.next()
					typ = null
					// expect closing ')' but no need to complain if missing
					if (p.tok == token.RPAREN) {
						p.next()
					}
				}
				 else {
					// *T
					typ = null
				}
				typ = new ast.StarExpr({Star: star, X: typ})
				break
			case token.LPAREN:
				p.error(p.pos, "cannot parenthesize embedded type")
				p.next()
				if (p.tok == token.MUL) {
					// (*T)
					let star = p.pos
					p.next()
					typ = new ast.StarExpr({Star: star, X: null})
				}
				 else {
					// (T)
					typ = null
				}
				if (p.tok == token.RPAREN) {
					p.next()
				}
				break
			default:
				let pos = p.pos
				p.errorExpected(pos, "field name or embedded type")
				p.advance(exprEnd)
				typ = new ast.BadExpr({From: pos, To: p.pos})
				break
		}
		let tag: ast.BasicLit | null = null
		if (p.tok == token.STRING) {
			tag = new ast.BasicLit({Kind: p.tok, Value: p.lit, ValuePos: p.pos})
			p.next()
		}
		let comment = p.expectSemi()
		let field = new ast.Field({Comment: comment, Doc: doc, Names: names, Tag: tag, Type: typ})
		return field
	}

	public parseStructType(): ast.StructType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "StructType"))
			});
		}
		let pos = p.expect(token.STRUCT)
		let lbrace = p.expect(token.LBRACE)
		let list: $.Slice<ast.Field | null> = null
		for (; p.tok == token.IDENT || p.tok == token.MUL || p.tok == token.LPAREN; ) {
			// a field declaration cannot start with a '(' but we accept
			// it here for more robust parsing and better error messages
			// (parseFieldDecl will check and complain if necessary)
			list = $.append(list, p.parseFieldDecl())
		}
		let rbrace = p.expect(token.RBRACE)
		return new ast.StructType({Fields: new ast.FieldList({Closing: rbrace, List: list, Opening: lbrace}), Struct: pos})
	}

	public parsePointerType(): ast.StarExpr | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "PointerType"))
			});
		}
		let star = p.expect(token.MUL)
		let base = p.parseType()
		return new ast.StarExpr({Star: star, X: base})
	}

	public parseDotsType(): ast.Ellipsis | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "DotsType"))
			});
		}
		let pos = p.expect(token.ELLIPSIS)
		let elt = p.parseType()
		return new ast.Ellipsis({Ellipsis: pos, Elt: elt})
	}

	public parseParamDecl(name: ast.Ident | null, typeSetsOK: boolean): field {
		const p = this
		using __defer = new $.DisposableStack();
		let f: field = new field()
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ParamDecl"))
			});
		}
		let ptok = p.tok
		if (name != null) {
			p.tok = token.IDENT // force token.IDENT case in switch below
		}
		 else if (typeSetsOK && p.tok == token.TILDE) {
			// "~" ...
			return $.markAsStructValue(new field({}))
		}
		switch (p.tok) {
			case token.IDENT:
				if (name != null) {
					f.name = name
					p.tok = ptok
				}
				 else {
					f.name = p.parseIdent()
				}
				switch (p.tok) {
					case token.IDENT:
					case token.MUL:
					case token.ARROW:
					case token.FUNC:
					case token.CHAN:
					case token.MAP:
					case token.STRUCT:
					case token.INTERFACE:
					case token.LPAREN:
						f.typ = p.parseType()
						break
					case token.LBRACK:
						{
						  const _tmp = p.parseArrayFieldOrTypeInstance(f.name)
						  f.name = _tmp[0]
						  f.typ = _tmp[1]
						}
						break
					case token.ELLIPSIS:
						f.typ = p.parseDotsType()
						return f
						break
					case token.PERIOD:
						f.typ = p.parseQualifiedIdent(f.name)
						f.name = null
						break
					case token.TILDE:
						if (typeSetsOK) {
							f.typ = null
							return f
						}
						break
					case token.OR:
						if (typeSetsOK) {
							// name "|" typeset
							f.typ = p.embeddedElem(f.name)
							f.name = null
							return f
						}
						break
				}
				break
			case token.MUL:
			case token.ARROW:
			case token.FUNC:
			case token.LBRACK:
			case token.CHAN:
			case token.MAP:
			case token.STRUCT:
			case token.INTERFACE:
			case token.LPAREN:
				f.typ = p.parseType()
				break
			case token.ELLIPSIS:
				f.typ = p.parseDotsType()
				return f
				break
			default:
				p.errorExpected(p.pos, "')'")
				p.advance(exprEnd)
				break
		}
		if (typeSetsOK && p.tok == token.OR && f.typ != null) {
			f.typ = p.embeddedElem(f.typ)
		}
		return f
	}

	public parseParameterList(name0: ast.Ident | null, typ0: ast.Expr, closing: token.Token): $.Slice<ast.Field | null> {
		const p = this
		using __defer = new $.DisposableStack();
		let params: $.Slice<ast.Field | null> = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ParameterList"))
			});
		}
		let tparams = closing == token.RBRACK
		let pos0 = p.pos
		if (name0 != null) {
			pos0 = name0!.Pos()
		}
		 else if (typ0 != null) {
			pos0 = typ0!.Pos()
		}
		let list: $.Slice<field> = null
		// number of parameters that have an explicit name and type
		let named: number = 0
		// number of parameters that have an explicit type
		let typed: number = 0
		for (; name0 != null || p.tok != closing && p.tok != token.EOF; ) {
			let par: field = new field()
			if (typ0 != null) {
				if (tparams) {
					typ0 = p.embeddedElem(typ0)
				}
				par = $.markAsStructValue(new field({}))
			}
			 else {
				par = $.markAsStructValue(p.parseParamDecl(name0, tparams).clone())
			}
			name0 = null // 1st name was consumed if present
			typ0 = null // 1st typ was consumed if present
			if (par.name != null || par.typ != null) {
				list = $.append(list, par)
				if (par.name != null && par.typ != null) {
					named++
				}
				if (par.typ != null) {
					typed++
				}
			}
			if (!p.atComma("parameter list", closing)) {
				break
			}
			p.next()
		}
		if ($.len(list) == 0) {
			return params
		}
		if (named == 0) {
			// all unnamed => found names are type names
			for (let i = 0; i < $.len(list); i++) {
				let par = list![i]
				{
					let typ = par!.name
					if (typ != null) {
						par!.typ = typ
						par!.name = null
					}
				}
			}

			// This is the same error handling as below, adjusted for type parameters only.
			// See comment below for details. (go.dev/issue/64534)

			/* same as typed == 0 */
			// position error at closing ]

			// position at opening [ or first name
			if (tparams) {
				// This is the same error handling as below, adjusted for type parameters only.
				// See comment below for details. (go.dev/issue/64534)
				let errPos: token.Pos = 0
				let msg: string = ""
				/* same as typed == 0 */
				// position error at closing ]

				// position at opening [ or first name
				if (named == typed) {
					errPos = p.pos // position error at closing ]
					msg = "missing type constraint"
				}
				 else {
					errPos = pos0 // position at opening [ or first name
					msg = "missing type parameter name"
					if ($.len(list) == 1) {
						msg += " or invalid array length"
					}
				}
				p.error(errPos, msg)
			}
		}
		 else if (named != $.len(list)) {
			// some named or we're in a type parameter list => all must be named
			// left-most error position (or invalid)
			let errPos: token.Pos = 0
			// current type (from right to left)
			let typ: ast.Expr = null

			// correct position

			// par.typ == nil && typ == nil => we only have a par.name
			for (let i = $.len(list) - 1; i >= 0; i--) {

				// correct position

				// par.typ == nil && typ == nil => we only have a par.name
				{
					let par = list![i]
					if (par!.typ != null) {
						typ = par!.typ

						// correct position
						if (par!.name == null) {
							errPos = typ!.Pos()
							let n = ast.NewIdent("_")
							n!.NamePos = errPos // correct position
							par!.name = n
						}
					}
					 else if (typ != null) {
						par!.typ = typ
					}
					 else {
						// par.typ == nil && typ == nil => we only have a par.name
						errPos = par!.name!.Pos()
						par!.typ = new ast.BadExpr({From: errPos, To: p.pos})
					}
				}
			}

			// Not all parameters are named because named != len(list).
			// If named == typed, there must be parameters that have no types.
			// They must be at the end of the parameter list, otherwise types
			// would have been filled in by the right-to-left sweep above and
			// there would be no error.
			// If tparams is set, the parameter list is a type parameter list.

			// position error at closing token ) or ]

			// go.dev/issue/60812
			if (token.Pos_IsValid(errPos)) {
				// Not all parameters are named because named != len(list).
				// If named == typed, there must be parameters that have no types.
				// They must be at the end of the parameter list, otherwise types
				// would have been filled in by the right-to-left sweep above and
				// there would be no error.
				// If tparams is set, the parameter list is a type parameter list.
				let msg: string = ""

				// position error at closing token ) or ]

				// go.dev/issue/60812
				if (named == typed) {
					errPos = p.pos // position error at closing token ) or ]
					if (tparams) {
						msg = "missing type constraint"
					}
					 else {
						msg = "missing parameter type"
					}
				}
				 else {

					// go.dev/issue/60812
					if (tparams) {
						msg = "missing type parameter name"
						// go.dev/issue/60812
						if ($.len(list) == 1) {
							msg += " or invalid array length"
						}
					}
					 else {
						msg = "missing parameter name"
					}
				}
				p.error(errPos, msg)
			}
		}
		if (named == 0) {
			// parameter list consists of types only
			for (let _i = 0; _i < $.len(list); _i++) {
				const par = list![_i]
				{
					assert(par.typ != null, "nil type in unnamed parameter list")
					params = $.append(params, new ast.Field({Type: par.typ}))
				}
			}
			return params
		}
		let names: $.Slice<ast.Ident | null> = null
		let typ: ast.Expr = null
		let addParams = (): void => {
			assert(typ != null, "nil type in named parameter list")
			let field = new ast.Field({Names: names, Type: typ})
			params = $.append(params, field)
			names = null
		}
		for (let _i = 0; _i < $.len(list); _i++) {
			const par = list![_i]
			{
				if (par.typ != typ) {
					if ($.len(names) > 0) {
						addParams!()
					}
					typ = par.typ
				}
				names = $.append(names, par.name)
			}
		}
		if ($.len(names) > 0) {
			addParams!()
		}
		return params
	}

	public parseParameters(acceptTParams: boolean): ast.FieldList | null {
		const p = this
		using __defer = new $.DisposableStack();
		let tparams: ast.FieldList | null = null
		let params: ast.FieldList | null = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Parameters"))
			});
		}
		if (acceptTParams && p.tok == token.LBRACK) {
			let opening = p.pos
			p.next()
			// [T any](params) syntax
			let list = p.parseParameterList(null, null, token.RBRACK)
			let rbrack = p.expect(token.RBRACK)
			tparams = new ast.FieldList({Closing: rbrack, List: list, Opening: opening})
			// Type parameter lists must not be empty.

			// avoid follow-on errors
			if (tparams!.NumFields() == 0) {
				p.error(tparams!.Closing, "empty type parameter list")
				tparams = null // avoid follow-on errors
			}
		}
		let opening = p.expect(token.LPAREN)
		let fields: $.Slice<ast.Field | null> = null
		if (p.tok != token.RPAREN) {
			fields = p.parseParameterList(null, null, token.RPAREN)
		}
		let rparen = p.expect(token.RPAREN)
		params = new ast.FieldList({Closing: rparen, List: fields, Opening: opening})
		return [tparams, params]
	}

	public parseResult(): ast.FieldList | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Result"))
			});
		}
		if (p.tok == token.LPAREN) {
			let [, results] = p.parseParameters(false)
			return results
		}
		let typ = p.tryIdentOrType()
		if (typ != null) {
			let list = $.makeSlice<ast.Field | null>(1)
			list![0] = new ast.Field({Type: typ})
			return new ast.FieldList({List: list})
		}
		return null
	}

	public parseFuncType(): ast.FuncType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "FuncType"))
			});
		}
		let pos = p.expect(token.FUNC)
		let [tparams, params] = p.parseParameters(true)
		if (tparams != null) {
			p.error(tparams!.Pos(), "function type must have no type parameters")
		}
		let results = p.parseResult()
		return new ast.FuncType({Func: pos, Params: params, Results: results})
	}

	public parseMethodSpec(): ast.Field | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "MethodSpec"))
			});
		}
		let doc = p.leadComment
		let idents: $.Slice<ast.Ident | null> = null
		let typ: ast.Expr = null
		let x = null
		{
			let { value: ident } = $.typeAssert<ast.Ident | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
			if (ident != null) {

				// generic method or embedded instantiated type

				// generic method m[T any]
				//
				// Interface methods do not have type parameters. We parse them for a
				// better error message and improved error recovery.

				// TODO(rfindley) refactor to share code with parseFuncType.

				// embedded instantiated type
				// TODO(rfindley) should resolve all identifiers in x.

				// ordinary method
				// TODO(rfindley) refactor to share code with parseFuncType.

				// embedded type
				switch (true) {
					case p.tok == token.LBRACK:
						let lbrack = p.pos
						p.next()
						p.exprLev++
						let x = p.parseExpr()
						p.exprLev--
						{
							let { value: name0 } = $.typeAssert<ast.Ident | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
							if (name0 != null && p.tok != token.COMMA && p.tok != token.RBRACK) {
								// generic method m[T any]
								//
								// Interface methods do not have type parameters. We parse them for a
								// better error message and improved error recovery.
								/* _ = */ p.parseParameterList(name0, null, token.RBRACK)
								/* _ = */ p.expect(token.RBRACK)
								p.error(lbrack, "interface method must have no type parameters")

								// TODO(rfindley) refactor to share code with parseFuncType.
								let [, params] = p.parseParameters(false)
								let results = p.parseResult()
								idents = $.arrayToSlice<ast.Ident | null>([ident])
								typ = new ast.FuncType({Func: token.NoPos, Params: params, Results: results})
							}
							 else {
								// embedded instantiated type
								// TODO(rfindley) should resolve all identifiers in x.
								let list = $.arrayToSlice<ast.Expr>([x])
								if (p.atComma("type argument list", token.RBRACK)) {
									p.exprLev++
									p.next()
									for (; p.tok != token.RBRACK && p.tok != token.EOF; ) {
										list = $.append(list, p.parseType())
										if (!p.atComma("type argument list", token.RBRACK)) {
											break
										}
										p.next()
									}
									p.exprLev--
								}
								let rbrack = p.expectClosing(token.RBRACK, "type argument list")
								typ = packIndexExpr(ident, lbrack, list, rbrack)
							}
						}
						break
					case p.tok == token.LPAREN:
						let [, params] = p.parseParameters(false)
						let results = p.parseResult()
						idents = $.arrayToSlice<ast.Ident | null>([ident])
						typ = new ast.FuncType({Func: token.NoPos, Params: params, Results: results})
						break
					default:
						typ = x
						break
				}
			}
			 else {
				// embedded, possibly instantiated type
				typ = x

				// embedded instantiated interface
				if (p.tok == token.LBRACK) {
					// embedded instantiated interface
					typ = p.parseTypeInstance(typ)
				}
			}
		}
		return new ast.Field({Doc: doc, Names: idents, Type: typ})
	}

	public embeddedElem(x: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "EmbeddedElem"))
			});
		}
		if (x == null) {
			x = p.embeddedTerm()
		}
		for (; p.tok == token.OR; ) {
			let t = new ast.BinaryExpr()
			t!.OpPos = p.pos
			t!.Op = token.OR
			p.next()
			t!.X = x
			t!.Y = p.embeddedTerm()
			x = t
		}
		return x
	}

	public embeddedTerm(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "EmbeddedTerm"))
			});
		}
		if (p.tok == token.TILDE) {
			let t = new ast.UnaryExpr()
			t!.OpPos = p.pos
			t!.Op = token.TILDE
			p.next()
			t!.X = p.parseType()
			return t
		}
		let t = p.tryIdentOrType()
		if (t == null) {
			let pos = p.pos
			p.errorExpected(pos, "~ term or type")
			p.advance(exprEnd)
			return new ast.BadExpr({From: pos, To: p.pos})
		}
		return t
	}

	public parseInterfaceType(): ast.InterfaceType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "InterfaceType"))
			});
		}
		let pos = p.expect(token.INTERFACE)
		let lbrace = p.expect(token.LBRACE)
		let list: $.Slice<ast.Field | null> = null
		parseElements: for (; ; ) {
			switch (true) {
				case p.tok == token.IDENT:
					let f = p.parseMethodSpec()
					if (f!.Names == null) {
						f!.Type = p.embeddedElem(f!.Type)
					}
					f!.Comment = p.expectSemi()
					list = $.append(list, f)
					break
				case p.tok == token.TILDE:
					let typ = null
					let comment = p.expectSemi()
					list = $.append(list, new ast.Field({Comment: comment, Type: typ}))
					break
				default:
					{
						let t = p.tryIdentOrType()
						if (t != null) {
							let typ = p.embeddedElem(t)
							let comment = p.expectSemi()
							list = $.append(list, new ast.Field({Comment: comment, Type: typ}))
						}
						 else {
							break
						}
					}
					break
			}
		}
		let rbrace = p.expect(token.RBRACE)
		return new ast.InterfaceType({Interface: pos, Methods: new ast.FieldList({Closing: rbrace, List: list, Opening: lbrace})})
	}

	public parseMapType(): ast.MapType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "MapType"))
			});
		}
		let pos = p.expect(token.MAP)
		p.expect(token.LBRACK)
		let key = p.parseType()
		p.expect(token.RBRACK)
		let value = p.parseType()
		return new ast.MapType({Key: key, Map: pos, Value: value})
	}

	public parseChanType(): ast.ChanType | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ChanType"))
			});
		}
		let pos = p.pos
		let dir = (ast.SEND | ast.RECV)
		let arrow: token.Pos = 0
		if (p.tok == token.CHAN) {
			p.next()
			if (p.tok == token.ARROW) {
				arrow = p.pos
				p.next()
				dir = ast.SEND
			}
		}
		 else {
			arrow = p.expect(token.ARROW)
			p.expect(token.CHAN)
			dir = ast.RECV
		}
		let value = p.parseType()
		return new ast.ChanType({Arrow: arrow, Begin: pos, Dir: dir, Value: value})
	}

	public parseTypeInstance(typ: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "TypeInstance"))
			});
		}
		let opening = p.expect(token.LBRACK)
		p.exprLev++
		let list: $.Slice<ast.Expr> = null
		for (; p.tok != token.RBRACK && p.tok != token.EOF; ) {
			list = $.append(list, p.parseType())
			if (!p.atComma("type argument list", token.RBRACK)) {
				break
			}
			p.next()
		}
		p.exprLev--
		let closing = p.expectClosing(token.RBRACK, "type argument list")
		if ($.len(list) == 0) {
			p.errorExpected(closing, "type argument list")
			return new ast.IndexExpr({Index: new ast.BadExpr({From: opening + 1, To: closing}), Lbrack: opening, Rbrack: closing, X: typ})
		}
		return packIndexExpr(typ, opening, list, closing)
	}

	public tryIdentOrType(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		__defer.defer(() => {
			decNestLev(incNestLev(p))
		});
		switch (p.tok) {
			case token.IDENT:
				let typ = null
				if (p.tok == token.LBRACK) {
					typ = p.parseTypeInstance(typ)
				}
				return typ
				break
			case token.LBRACK:
				let lbrack = p.expect(token.LBRACK)
				return p.parseArrayType(lbrack, null)
				break
			case token.STRUCT:
				return p.parseStructType()
				break
			case token.MUL:
				return p.parsePointerType()
				break
			case token.FUNC:
				return p.parseFuncType()
				break
			case token.INTERFACE:
				return p.parseInterfaceType()
				break
			case token.MAP:
				return p.parseMapType()
				break
			case token.CHAN:
			case token.ARROW:
				return p.parseChanType()
				break
			case token.LPAREN:
				let lparen = p.pos
				p.next()
				let typ = p.parseType()
				let rparen = p.expect(token.RPAREN)
				return new ast.ParenExpr({Lparen: lparen, Rparen: rparen, X: typ})
				break
		}
		return null
	}

	public parseStmtList(): $.Slice<ast.Stmt> {
		const p = this
		using __defer = new $.DisposableStack();
		let list: $.Slice<ast.Stmt> = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "StatementList"))
			});
		}
		for (; p.tok != token.CASE && p.tok != token.DEFAULT && p.tok != token.RBRACE && p.tok != token.EOF; ) {
			list = $.append(list, p.parseStmt())
		}
		return list
	}

	public parseBody(): ast.BlockStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Body"))
			});
		}
		let lbrace = p.expect(token.LBRACE)
		let list = p.parseStmtList()
		let rbrace = p.expect2(token.RBRACE)
		return new ast.BlockStmt({Lbrace: lbrace, List: list, Rbrace: rbrace})
	}

	public parseBlockStmt(): ast.BlockStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "BlockStmt"))
			});
		}
		let lbrace = p.expect(token.LBRACE)
		let list = p.parseStmtList()
		let rbrace = p.expect2(token.RBRACE)
		return new ast.BlockStmt({Lbrace: lbrace, List: list, Rbrace: rbrace})
	}

	public parseFuncTypeOrLit(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "FuncTypeOrLit"))
			});
		}
		let typ = p.parseFuncType()
		if (p.tok != token.LBRACE) {
			// function type only
			return typ
		}
		p.exprLev++
		let body = p.parseBody()
		p.exprLev--
		return new ast.FuncLit({Body: body, Type: typ})
	}

	// parseOperand may return an expression or a raw type (incl. array
	// types of the form [...]T). Callers must verify the result.
	public parseOperand(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Operand"))
			});
		}
		switch (p.tok) {
			case token.IDENT:
				let x = p.parseIdent()
				return x
				break
			case token.INT:
			case token.FLOAT:
			case token.IMAG:
			case token.CHAR:
			case token.STRING:
				let x = new ast.BasicLit({Kind: p.tok, Value: p.lit, ValuePos: p.pos})
				p.next()
				return x
				break
			case token.LPAREN:
				let lparen = p.pos
				p.next()
				p.exprLev++
				let x = p.parseRhs() // types may be parenthesized: (some type)
				p.exprLev--
				let rparen = p.expect(token.RPAREN)
				return new ast.ParenExpr({Lparen: lparen, Rparen: rparen, X: x})
				break
			case token.FUNC:
				return p.parseFuncTypeOrLit()
				break
		}
		{
			let typ = p.tryIdentOrType()
			if (typ != null) {
				// do not consume trailing type parameters
				// could be type for composite literal or conversion
				let { ok: isIdent } = $.typeAssert<ast.Ident | null>(typ, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
				assert(!isIdent, "type cannot be identifier")
				return typ
			}
		}
		let pos = p.pos
		p.errorExpected(pos, "operand")
		p.advance(stmtStart)
		return new ast.BadExpr({From: pos, To: p.pos})
	}

	public parseSelector(x: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Selector"))
			});
		}
		let sel = p.parseIdent()
		return new ast.SelectorExpr({Sel: sel, X: x})
	}

	public parseTypeAssertion(x: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "TypeAssertion"))
			});
		}
		let lparen = p.expect(token.LPAREN)
		let typ: ast.Expr = null
		if (p.tok == token.TYPE) {
			// type switch: typ == nil
			p.next()
		}
		 else {
			typ = p.parseType()
		}
		let rparen = p.expect(token.RPAREN)
		return new ast.TypeAssertExpr({Lparen: lparen, Rparen: rparen, Type: typ, X: x})
	}

	public parseIndexOrSliceOrInstance(x: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "parseIndexOrSliceOrInstance"))
			});
		}
		let lbrack = p.expect(token.LBRACK)
		if (p.tok == token.RBRACK) {
			// empty index, slice or index expressions are not permitted;
			// accept them for parsing tolerance, but complain
			p.errorExpected(p.pos, "operand")
			let rbrack = p.pos
			p.next()
			return new ast.IndexExpr({Index: new ast.BadExpr({From: rbrack, To: rbrack}), Lbrack: lbrack, Rbrack: rbrack, X: x})
		}
		p.exprLev++
		// change the 3 to 2 to disable 3-index slices
		let N: number = 3
		let args: $.Slice<ast.Expr> = null
		let index: ast.Expr[] = [null, null, null]
		let colons: token.Pos[] = [0, 0]
		if (p.tok != token.COLON) {
			// We can't know if we have an index expression or a type instantiation;
			// so even if we see a (named) type we are not going to be in type context.
			index![0] = p.parseRhs()
		}
		let ncolons = 0
		switch (p.tok) {
			case token.COLON:
				for (; p.tok == token.COLON && ncolons < $.len(colons); ) {
					colons![ncolons] = p.pos
					ncolons++
					p.next()
					if (p.tok != token.COLON && p.tok != token.RBRACK && p.tok != token.EOF) {
						index![ncolons] = p.parseRhs()
					}
				}
				break
			case token.COMMA:
				args = $.append(args, index![0])
				for (; p.tok == token.COMMA; ) {
					p.next()
					if (p.tok != token.RBRACK && p.tok != token.EOF) {
						args = $.append(args, p.parseType())
					}
				}
				break
		}
		p.exprLev--
		let rbrack = p.expect(token.RBRACK)
		if (ncolons > 0) {
			// slice expression
			let slice3 = false

			// Check presence of middle and final index here rather than during type-checking
			// to prevent erroneous programs from passing through gofmt (was go.dev/issue/7305).
			if (ncolons == 2) {
				slice3 = true
				// Check presence of middle and final index here rather than during type-checking
				// to prevent erroneous programs from passing through gofmt (was go.dev/issue/7305).
				if (index![1] == null) {
					p.error(colons![0], "middle index required in 3-index slice")
					index![1] = new ast.BadExpr({From: colons![0] + 1, To: colons![1]})
				}
				if (index![2] == null) {
					p.error(colons![1], "final index required in 3-index slice")
					index![2] = new ast.BadExpr({From: colons![1] + 1, To: rbrack})
				}
			}
			return new ast.SliceExpr({High: index![1], Lbrack: lbrack, Low: index![0], Max: index![2], Rbrack: rbrack, Slice3: slice3, X: x})
		}
		if ($.len(args) == 0) {
			// index expression
			return new ast.IndexExpr({Index: index![0], Lbrack: lbrack, Rbrack: rbrack, X: x})
		}
		return packIndexExpr(x, lbrack, args, rbrack)
	}

	public parseCallOrConversion(fun: ast.Expr): ast.CallExpr | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "CallOrConversion"))
			});
		}
		let lparen = p.expect(token.LPAREN)
		p.exprLev++
		let list: $.Slice<ast.Expr> = null
		let ellipsis: token.Pos = 0
		for (; p.tok != token.RPAREN && p.tok != token.EOF && !token.Pos_IsValid(ellipsis); ) {
			list = $.append(list, p.parseRhs()) // builtins may expect a type: make(some type, ...)
			if (p.tok == token.ELLIPSIS) {
				ellipsis = p.pos
				p.next()
			}
			if (!p.atComma("argument list", token.RPAREN)) {
				break
			}
			p.next()
		}
		p.exprLev--
		let rparen = p.expectClosing(token.RPAREN, "argument list")
		return new ast.CallExpr({Args: list, Ellipsis: ellipsis, Fun: fun, Lparen: lparen, Rparen: rparen})
	}

	public parseValue(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Element"))
			});
		}
		if (p.tok == token.LBRACE) {
			return null
		}
		let x = p.parseExpr()
		return x
	}

	public parseElement(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Element"))
			});
		}
		let x = p.parseValue()
		if (p.tok == token.COLON) {
			let colon = p.pos
			p.next()
			x = new ast.KeyValueExpr({Colon: colon, Key: x, Value: p.parseValue()})
		}
		return x
	}

	public parseElementList(): $.Slice<ast.Expr> {
		const p = this
		using __defer = new $.DisposableStack();
		let list: $.Slice<ast.Expr> = null
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ElementList"))
			});
		}
		for (; p.tok != token.RBRACE && p.tok != token.EOF; ) {
			list = $.append(list, p.parseElement())
			if (!p.atComma("composite literal", token.RBRACE)) {
				break
			}
			p.next()
		}
		return list
	}

	public parseLiteralValue(typ: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		__defer.defer(() => {
			decNestLev(incNestLev(p))
		});
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "LiteralValue"))
			});
		}
		let lbrace = p.expect(token.LBRACE)
		let elts: $.Slice<ast.Expr> = null
		p.exprLev++
		if (p.tok != token.RBRACE) {
			elts = p.parseElementList()
		}
		p.exprLev--
		let rbrace = p.expectClosing(token.RBRACE, "composite literal")
		return new ast.CompositeLit({Elts: elts, Lbrace: lbrace, Rbrace: rbrace, Type: typ})
	}

	public parsePrimaryExpr(x: ast.Expr): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "PrimaryExpr"))
			});
		}
		if (x == null) {
			x = p.parseOperand()
		}
		let n: number = 0
		__defer.defer(() => {
			p.nestLev -= n
		});
		for (n = 1; ; n++) {
			incNestLev(p)

			// TODO(rFindley) The check for token.RBRACE below is a targeted fix
			//                to error recovery sufficient to make the x/tools tests to
			//                pass with the new parsing logic introduced for type
			//                parameters. Remove this once error recovery has been
			//                more generally reconsidered.

			// make progress

			// operand may have returned a parenthesized complit
			// type; accept it but complain if we have a complit

			// determine if '{' belongs to a composite literal or a block statement

			// x is possibly a composite literal type

			// x is possibly a composite literal type

			// x is a composite literal type

			// already progressed, no need to advance
			switch (p.tok) {
				case token.PERIOD:
					p.next()
					switch (p.tok) {
						case token.IDENT:
							x = p.parseSelector(x)
							break
						case token.LPAREN:
							x = p.parseTypeAssertion(x)
							break
						default:
							let pos = p.pos
							p.errorExpected(pos, "selector or type assertion")
							if (p.tok != token.RBRACE) {
								p.next() // make progress
							}
							let sel = new ast.Ident({Name: "_", NamePos: pos})
							x = new ast.SelectorExpr({Sel: sel, X: x})
							break
					}
					break
				case token.LBRACK:
					x = p.parseIndexOrSliceOrInstance(x)
					break
				case token.LPAREN:
					x = p.parseCallOrConversion(x)
					break
				case token.LBRACE:
					let t = ast.Unparen(x)
					$.typeSwitch(t, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BadExpr'}, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'}, {kind: $.TypeKind.Pointer, elemType: 'ast.SelectorExpr'}], body: () => {
						if (p.exprLev < 0) {
							return x
						}
					}},
					{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.IndexExpr'}, {kind: $.TypeKind.Pointer, elemType: 'ast.IndexListExpr'}], body: () => {
						if (p.exprLev < 0) {
							return x
						}
					}},
					{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.ArrayType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.StructType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.MapType'}], body: () => {}}], () => {
						return x
					})
					if (t != x) {

						// already progressed, no need to advance
						p.error(t!.Pos(), "cannot parenthesize type in composite literal")
						// already progressed, no need to advance
					}
					x = p.parseLiteralValue(x)
					break
				default:
					return x
					break
			}
		}
	}

	public parseUnaryExpr(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		__defer.defer(() => {
			decNestLev(incNestLev(p))
		});
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "UnaryExpr"))
			});
		}
		switch (p.tok) {
			case token.ADD:
			case token.SUB:
			case token.NOT:
			case token.XOR:
			case token.AND:
			case token.TILDE:
				let [pos, op] = [p.pos, p.tok]
				p.next()
				let x = p.parseUnaryExpr()
				return new ast.UnaryExpr({Op: op, OpPos: pos, X: x})
				break
			case token.ARROW:
				let arrow = p.pos
				p.next()
				let x = p.parseUnaryExpr()
				{
					let { value: typ, ok: ok } = $.typeAssert<ast.ChanType | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.ChanType'})
					if (ok) {
						// (<-type)

						// re-associate position info and <-
						let dir = ast.SEND

						// error: (<-type) is (<-(<-chan T))
						for (; ok && dir == ast.SEND; ) {

							// error: (<-type) is (<-(<-chan T))
							if (typ!.Dir == ast.RECV) {
								// error: (<-type) is (<-(<-chan T))
								p.errorExpected(typ!.Arrow, "'chan'")
							}
							;[arrow, typ!.Begin, typ!.Arrow] = [typ!.Arrow, arrow, arrow]
							;[dir, typ!.Dir] = [typ!.Dir, ast.RECV]
							({ value: typ, ok: ok } = $.typeAssert<ast.ChanType | null>(typ!.Value, {kind: $.TypeKind.Pointer, elemType: 'ast.ChanType'}))
						}
						if (dir == ast.SEND) {
							p.errorExpected(arrow, "channel type")
						}

						return x
					}
				}
				return new ast.UnaryExpr({Op: token.ARROW, OpPos: arrow, X: x})
				break
			case token.MUL:
				let pos = p.pos
				p.next()
				let x = p.parseUnaryExpr()
				return new ast.StarExpr({Star: pos, X: x})
				break
		}
		return null
	}

	public tokPrec(): [token.Token, number] {
		const p = this
		let tok = p.tok
		if (p.inRhs && tok == token.ASSIGN) {
			tok = token.EQL
		}
		return [tok, token.Token_Precedence(tok)]
	}

	// parseBinaryExpr parses a (possibly) binary expression.
	// If x is non-nil, it is used as the left operand.
	//
	// TODO(rfindley): parseBinaryExpr has become overloaded. Consider refactoring.
	public parseBinaryExpr(x: ast.Expr, prec1: number): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "BinaryExpr"))
			});
		}
		if (x == null) {
			x = p.parseUnaryExpr()
		}
		let n: number = 0
		__defer.defer(() => {
			p.nestLev -= n
		});
		for (n = 1; ; n++) {
			incNestLev(p)
			let [op, oprec] = p.tokPrec()
			if (oprec < prec1) {
				return x
			}
			let pos = p.expect(op)
			let y = p.parseBinaryExpr(null, oprec + 1)
			x = new ast.BinaryExpr({Op: op, OpPos: pos, X: x, Y: y})
		}
	}

	// The result may be a type or even a raw type ([...]int).
	public parseExpr(): ast.Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Expression"))
			});
		}
		return p.parseBinaryExpr(null, token.LowestPrec + 1)
	}

	public parseRhs(): ast.Expr {
		const p = this
		let old = p.inRhs
		p.inRhs = true
		let x = p.parseExpr()
		p.inRhs = old
		return x
	}

	// parseSimpleStmt returns true as 2nd result if it parsed the assignment
	// of a range clause (with mode == rangeOk). The returned statement is an
	// assignment with a right-hand side that is a single unary expression of
	// the form "range x". No guarantees are given for the left-hand side.
	public parseSimpleStmt(mode: number): [ast.Stmt, boolean] {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "SimpleStmt"))
			});
		}
		let x = p.parseList(false)
		switch (p.tok) {
			case token.DEFINE:
			case token.ASSIGN:
			case token.ADD_ASSIGN:
			case token.SUB_ASSIGN:
			case token.MUL_ASSIGN:
			case token.QUO_ASSIGN:
			case token.REM_ASSIGN:
			case token.AND_ASSIGN:
			case token.OR_ASSIGN:
			case token.XOR_ASSIGN:
			case token.SHL_ASSIGN:
			case token.SHR_ASSIGN:
			case token.AND_NOT_ASSIGN:
				let [pos, tok] = [p.pos, p.tok]
				p.next()
				let y: $.Slice<ast.Expr> = null
				let isRange = false
				if (mode == 2 && p.tok == token.RANGE && (tok == token.DEFINE || tok == token.ASSIGN)) {
					let pos = p.pos
					p.next()
					y = $.arrayToSlice<ast.Expr>([new ast.UnaryExpr({Op: token.RANGE, OpPos: pos, X: p.parseRhs()})])
					isRange = true
				}
				 else {
					y = p.parseList(true)
				}
				return [new ast.AssignStmt({Lhs: x, Rhs: y, Tok: tok, TokPos: pos}), isRange]
				break
		}
		if ($.len(x) > 1) {

			// continue with first expression
			p.errorExpected(x![0]!.Pos(), "1 expression")
			// continue with first expression
		}
		switch (p.tok) {
			case token.COLON:
				let colon = p.pos
				p.next()
				{
					let { value: label, ok: isIdent } = $.typeAssert<ast.Ident | null>(x![0], {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (mode == 1 && isIdent) {
						// Go spec: The scope of a label is the body of the function
						// in which it is declared and excludes the body of any nested
						// function.
						let stmt = new ast.LabeledStmt({Colon: colon, Label: label, Stmt: p.parseStmt()})
						return [stmt, false]
					}
				}
				p.error(colon, "illegal label declaration")
				return [new ast.BadStmt({From: x![0]!.Pos(), To: colon + 1}), false]
				break
			case token.ARROW:
				let arrow = p.pos
				p.next()
				let y = p.parseRhs()
				return [new ast.SendStmt({Arrow: arrow, Chan: x![0], Value: y}), false]
				break
			case token.INC:
			case token.DEC:
				let s = new ast.IncDecStmt({Tok: p.tok, TokPos: p.pos, X: x![0]})
				p.next()
				return [s, false]
				break
		}
		return [new ast.ExprStmt({X: x![0]}), false]
	}

	public parseCallExpr(callType: string): ast.CallExpr | null {
		const p = this
		let x = p.parseRhs() // could be a conversion: (some type)(x)
		{
			let t = ast.Unparen(x)
			if (t != x) {
				p.error(x!.Pos(), fmt.Sprintf("expression in %s must not be parenthesized", callType))
				x = t
			}
		}
		{
			let { value: call, ok: isCall } = $.typeAssert<ast.CallExpr | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.CallExpr'})
			if (isCall) {
				return call
			}
		}
		{
			let { ok: isBad } = $.typeAssert<ast.BadExpr | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.BadExpr'})
			if (!isBad) {
				// only report error if it's a new one
				p.error(p.safePos(x!.End()), fmt.Sprintf("expression in %s must be function call", callType))
			}
		}
		return null
	}

	public parseGoStmt(): ast.Stmt {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "GoStmt"))
			});
		}
		let pos = p.expect(token.GO)
		let call = p.parseCallExpr("go")
		p.expectSemi()
		if (call == null) {
			return new ast.BadStmt({From: pos, To: pos + 2})
		}
		return new ast.GoStmt({Call: call, Go: pos})
	}

	public parseDeferStmt(): ast.Stmt {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "DeferStmt"))
			});
		}
		let pos = p.expect(token.DEFER)
		let call = p.parseCallExpr("defer")
		p.expectSemi()
		if (call == null) {
			return new ast.BadStmt({From: pos, To: pos + 5})
		}
		return new ast.DeferStmt({Call: call, Defer: pos})
	}

	public parseReturnStmt(): ast.ReturnStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ReturnStmt"))
			});
		}
		let pos = p.pos
		p.expect(token.RETURN)
		let x: $.Slice<ast.Expr> = null
		if (p.tok != token.SEMICOLON && p.tok != token.RBRACE) {
			x = p.parseList(true)
		}
		p.expectSemi()
		return new ast.ReturnStmt({Results: x, Return: pos})
	}

	public parseBranchStmt(tok: token.Token): ast.BranchStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "BranchStmt"))
			});
		}
		let pos = p.expect(tok)
		let label: ast.Ident | null = null
		if (tok != token.FALLTHROUGH && p.tok == token.IDENT) {
			label = p.parseIdent()
		}
		p.expectSemi()
		return new ast.BranchStmt({Label: label, Tok: tok, TokPos: pos})
	}

	public makeExpr(s: ast.Stmt, want: string): ast.Expr {
		const p = this
		if (s == null) {
			return null
		}
		{
			let { value: es, ok: isExpr } = $.typeAssert<ast.ExprStmt | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ast.ExprStmt'})
			if (isExpr) {
				return es!.X
			}
		}
		let found = "simple statement"
		{
			let { ok: isAss } = $.typeAssert<ast.AssignStmt | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ast.AssignStmt'})
			if (isAss) {
				found = "assignment"
			}
		}
		p.error(s!.Pos(), fmt.Sprintf("expected %s, found %s (missing parentheses around composite literal?)", want, found))
		return new ast.BadExpr({From: s!.Pos(), To: p.safePos(s!.End())})
	}

	// parseIfHeader is an adjusted version of parser.header
	// in cmd/compile/internal/syntax/parser.go, which has
	// been tuned for better error handling.
	public parseIfHeader(): [ast.Stmt, ast.Expr] {
		const p = this
		let init: ast.Stmt = null
		let cond: ast.Expr = null
		if (p.tok == token.LBRACE) {
			p.error(p.pos, "missing condition in if statement")
			cond = new ast.BadExpr({From: p.pos, To: p.pos})
			return [init, cond]
		}
		let prevLev = p.exprLev
		p.exprLev = -1
		if (p.tok != token.SEMICOLON) {
			// accept potential variable declaration but complain
			if (p.tok == token.VAR) {
				p.next()
				p.error(p.pos, "var declaration not allowed in if initializer")
			}
			;[init] = p.parseSimpleStmt(0)
		}
		let condStmt: ast.Stmt = null
		let semi: { pos?: token.Pos; lit?: string } = {}
		if (p.tok != token.LBRACE) {
			if (p.tok == token.SEMICOLON) {
				semi.pos = p.pos
				semi.lit = p.lit
				p.next()
			}
			 else {
				p.expect(token.SEMICOLON)
			}
			if (p.tok != token.LBRACE) {
				;[condStmt] = p.parseSimpleStmt(0)
			}
		}
		 else {
			condStmt = init
			init = null
		}
		if (condStmt != null) {
			cond = p.makeExpr(condStmt, "boolean expression")
		}
		 else if (token.Pos_IsValid(semi.pos)) {
			if (semi.lit == "\n") {
				p.error(semi.pos, "unexpected newline, expecting { after if clause")
			}
			 else {
				p.error(semi.pos, "missing condition in if statement")
			}
		}
		if (cond == null) {
			cond = new ast.BadExpr({From: p.pos, To: p.pos})
		}
		p.exprLev = prevLev
		return [init, cond]
	}

	public parseIfStmt(): ast.IfStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		__defer.defer(() => {
			decNestLev(incNestLev(p))
		});
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "IfStmt"))
			});
		}
		let pos = p.expect(token.IF)
		let [init, cond] = p.parseIfHeader()
		let body = p.parseBlockStmt()
		let else_: ast.Stmt = null
		if (p.tok == token.ELSE) {
			p.next()
			switch (p.tok) {
				case token.IF:
					else_ = p.parseIfStmt()
					break
				case token.LBRACE:
					else_ = p.parseBlockStmt()
					p.expectSemi()
					break
				default:
					p.errorExpected(p.pos, "if statement or block")
					else_ = new ast.BadStmt({From: p.pos, To: p.pos})
					break
			}
		}
		 else {
			p.expectSemi()
		}
		return new ast.IfStmt({Body: body, Cond: cond, Else: else_, If: pos, Init: init})
	}

	public parseCaseClause(): ast.CaseClause | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "CaseClause"))
			});
		}
		let pos = p.pos
		let list: $.Slice<ast.Expr> = null
		if (p.tok == token.CASE) {
			p.next()
			list = p.parseList(true)
		}
		 else {
			p.expect(token.DEFAULT)
		}
		let colon = p.expect(token.COLON)
		let body = p.parseStmtList()
		return new ast.CaseClause({Body: body, Case: pos, Colon: colon, List: list})
	}

	public isTypeSwitchGuard(s: ast.Stmt): boolean {
		const p = this
		$.typeSwitch(s, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.ExprStmt'}], body: (t) => {
			return isTypeSwitchAssert(t!.X)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.AssignStmt'}], body: (t) => {
			if ($.len(t!.Lhs) == 1 && $.len(t!.Rhs) == 1 && isTypeSwitchAssert(t!.Rhs![0])) {

				// permit v = x.(type) but complain
				switch (t!.Tok) {
					case token.ASSIGN:
						p.error(t!.TokPos, "expected ':=', found '='")
						// fallthrough // fallthrough statement skipped
						break
					case token.DEFINE:
						return true
						break
				}
			}
		}}])
		return false
	}

	public parseSwitchStmt(): ast.Stmt {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "SwitchStmt"))
			});
		}
		let pos = p.expect(token.SWITCH)
		let s1: ast.Stmt = null
		let s2: ast.Stmt = null
		if (p.tok != token.LBRACE) {
			let prevLev = p.exprLev
			p.exprLev = -1
			if (p.tok != token.SEMICOLON) {
				;[s2] = p.parseSimpleStmt(0)
			}

			// A TypeSwitchGuard may declare a variable in addition
			// to the variable declared in the initial SimpleStmt.
			// Introduce extra scope to avoid redeclaration errors:
			//
			//	switch t := 0; t := x.(T) { ... }
			//
			// (this code is not valid Go because the first t
			// cannot be accessed and thus is never used, the extra
			// scope is needed for the correct error message).
			//
			// If we don't have a type switch, s2 must be an expression.
			// Having the extra nested but empty scope won't affect it.
			if (p.tok == token.SEMICOLON) {
				p.next()
				s1 = s2
				s2 = null

				// A TypeSwitchGuard may declare a variable in addition
				// to the variable declared in the initial SimpleStmt.
				// Introduce extra scope to avoid redeclaration errors:
				//
				//	switch t := 0; t := x.(T) { ... }
				//
				// (this code is not valid Go because the first t
				// cannot be accessed and thus is never used, the extra
				// scope is needed for the correct error message).
				//
				// If we don't have a type switch, s2 must be an expression.
				// Having the extra nested but empty scope won't affect it.
				if (p.tok != token.LBRACE) {
					// A TypeSwitchGuard may declare a variable in addition
					// to the variable declared in the initial SimpleStmt.
					// Introduce extra scope to avoid redeclaration errors:
					//
					//	switch t := 0; t := x.(T) { ... }
					//
					// (this code is not valid Go because the first t
					// cannot be accessed and thus is never used, the extra
					// scope is needed for the correct error message).
					//
					// If we don't have a type switch, s2 must be an expression.
					// Having the extra nested but empty scope won't affect it.
					;[s2] = p.parseSimpleStmt(0)
				}
			}
			p.exprLev = prevLev
		}
		let typeSwitch = p.isTypeSwitchGuard(s2)
		let lbrace = p.expect(token.LBRACE)
		let list: $.Slice<ast.Stmt> = null
		for (; p.tok == token.CASE || p.tok == token.DEFAULT; ) {
			list = $.append(list, p.parseCaseClause())
		}
		let rbrace = p.expect(token.RBRACE)
		p.expectSemi()
		let body = new ast.BlockStmt({Lbrace: lbrace, List: list, Rbrace: rbrace})
		if (typeSwitch) {
			return new ast.TypeSwitchStmt({Assign: s2, Body: body, Init: s1, Switch: pos})
		}
		return new ast.SwitchStmt({Body: body, Init: s1, Switch: pos, Tag: p.makeExpr(s2, "switch expression")})
	}

	public parseCommClause(): ast.CommClause | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "CommClause"))
			});
		}
		let pos = p.pos
		let comm: ast.Stmt = null
		if (p.tok == token.CASE) {
			p.next()
			let lhs = p.parseList(false)

			// SendStmt

			// continue with first expression

			// RecvStmt

			// RecvStmt with assignment

			// continue with first two expressions

			// lhs must be single receive operation

			// continue with first expression
			if (p.tok == token.ARROW) {
				// SendStmt

				// continue with first expression
				if ($.len(lhs) > 1) {

					// continue with first expression
					p.errorExpected(lhs![0]!.Pos(), "1 expression")
					// continue with first expression
				}
				let arrow = p.pos
				p.next()
				let rhs = p.parseRhs()
				comm = new ast.SendStmt({Arrow: arrow, Chan: lhs![0], Value: rhs})
			}
			 else {
				// RecvStmt

				// RecvStmt with assignment

				// continue with first two expressions

				// lhs must be single receive operation

				// continue with first expression
				{
					let tok = p.tok
					if (tok == token.ASSIGN || tok == token.DEFINE) {
						// RecvStmt with assignment

						// continue with first two expressions
						if ($.len(lhs) > 2) {
							p.errorExpected(lhs![0]!.Pos(), "1 or 2 expressions")
							// continue with first two expressions
							lhs = $.goSlice(lhs, 0, 2)
						}
						let pos = p.pos
						p.next()
						let rhs = p.parseRhs()
						comm = new ast.AssignStmt({Lhs: lhs, Rhs: $.arrayToSlice<ast.Expr>([rhs]), Tok: tok, TokPos: pos})
					}
					 else {
						// lhs must be single receive operation

						// continue with first expression
						if ($.len(lhs) > 1) {

							// continue with first expression
							p.errorExpected(lhs![0]!.Pos(), "1 expression")
							// continue with first expression
						}
						comm = new ast.ExprStmt({X: lhs![0]})
					}
				}
			}
		}
		 else {
			p.expect(token.DEFAULT)
		}
		let colon = p.expect(token.COLON)
		let body = p.parseStmtList()
		return new ast.CommClause({Body: body, Case: pos, Colon: colon, Comm: comm})
	}

	public parseSelectStmt(): ast.SelectStmt | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "SelectStmt"))
			});
		}
		let pos = p.expect(token.SELECT)
		let lbrace = p.expect(token.LBRACE)
		let list: $.Slice<ast.Stmt> = null
		for (; p.tok == token.CASE || p.tok == token.DEFAULT; ) {
			list = $.append(list, p.parseCommClause())
		}
		let rbrace = p.expect(token.RBRACE)
		p.expectSemi()
		let body = new ast.BlockStmt({Lbrace: lbrace, List: list, Rbrace: rbrace})
		return new ast.SelectStmt({Body: body, Select: pos})
	}

	public parseForStmt(): ast.Stmt {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ForStmt"))
			});
		}
		let pos = p.expect(token.FOR)
		let s1: ast.Stmt = null
		let s2: ast.Stmt = null
		let s3: ast.Stmt = null
		let isRange: boolean = false
		if (p.tok != token.LBRACE) {
			let prevLev = p.exprLev
			p.exprLev = -1

			// "for range x" (nil lhs in assignment)
			if (p.tok != token.SEMICOLON) {

				// "for range x" (nil lhs in assignment)
				if (p.tok == token.RANGE) {
					// "for range x" (nil lhs in assignment)
					let pos = p.pos
					p.next()
					let y = $.arrayToSlice<ast.Expr>([new ast.UnaryExpr({Op: token.RANGE, OpPos: pos, X: p.parseRhs()})])
					s2 = new ast.AssignStmt({Rhs: y})
					isRange = true
				}
				 else {
					;[s2, isRange] = p.parseSimpleStmt(2)
				}
			}
			if (!isRange && p.tok == token.SEMICOLON) {
				p.next()
				s1 = s2
				s2 = null
				if (p.tok != token.SEMICOLON) {
					;[s2] = p.parseSimpleStmt(0)
				}
				p.expectSemi()
				if (p.tok != token.LBRACE) {
					;[s3] = p.parseSimpleStmt(0)
				}
			}
			p.exprLev = prevLev
		}
		let body = p.parseBlockStmt()
		p.expectSemi()
		if (isRange) {
			let _as = $.mustTypeAssert<ast.AssignStmt | null>(s2, {kind: $.TypeKind.Pointer, elemType: 'ast.AssignStmt'})
			// check lhs
			let key: ast.Expr = null
			let value: ast.Expr = null

			// nothing to do
			switch ($.len(_as!.Lhs)) {
				case 0:
					break
				case 1:
					key = _as!.Lhs![0]
					break
				case 2:
					;[key, value] = [_as!.Lhs![0], _as!.Lhs![1]]
					break
				default:
					p.errorExpected(_as!.Lhs![$.len(_as!.Lhs) - 1]!.Pos(), "at most 2 expressions")
					return new ast.BadStmt({From: pos, To: p.safePos(body!.End())})
					break
			}
			// parseSimpleStmt returned a right-hand side that
			// is a single unary expression of the form "range x"
			let x = $.mustTypeAssert<ast.UnaryExpr | null>(_as!.Rhs![0], {kind: $.TypeKind.Pointer, elemType: 'ast.UnaryExpr'})!.X
			return new ast.RangeStmt({Body: body, For: pos, Key: key, Range: _as!.Rhs![0]!.Pos(), Tok: _as!.Tok, TokPos: _as!.TokPos, Value: value, X: x})
		}
		return new ast.ForStmt({Body: body, Cond: p.makeExpr(s2, "boolean or range expression"), For: pos, Init: s1, Post: s3})
	}

	public parseStmt(): ast.Stmt {
		const p = this
		using __defer = new $.DisposableStack();
		let s: ast.Stmt = null
		__defer.defer(() => {
			decNestLev(incNestLev(p))
		});
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Statement"))
			});
		}
		switch (p.tok) {
			case token.CONST:
			case token.TYPE:
			case token.VAR:
				s = new ast.DeclStmt({Decl: p.parseDecl(stmtStart)})
				break
			case token.IDENT:
			case token.INT:
			case token.FLOAT:
			case token.IMAG:
			case token.CHAR:
			case token.STRING:
			case token.FUNC:
			case token.LPAREN:
			case token.LBRACK:
			case token.STRUCT:
			case token.MAP:
			case token.CHAN:
			case token.INTERFACE:
			case token.ADD:
			case token.SUB:
			case token.MUL:
			case token.AND:
			case token.XOR:
			case token.ARROW:
			case token.NOT:
				;[s] = p.parseSimpleStmt(1)
				{
					let { ok: isLabeledStmt } = $.typeAssert<ast.LabeledStmt | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ast.LabeledStmt'})
					if (!isLabeledStmt) {
						p.expectSemi()
					}
				}
				break
			case token.GO:
				s = p.parseGoStmt()
				break
			case token.DEFER:
				s = p.parseDeferStmt()
				break
			case token.RETURN:
				s = p.parseReturnStmt()
				break
			case token.BREAK:
			case token.CONTINUE:
			case token.GOTO:
			case token.FALLTHROUGH:
				s = p.parseBranchStmt(p.tok)
				break
			case token.LBRACE:
				s = p.parseBlockStmt()
				p.expectSemi()
				break
			case token.IF:
				s = p.parseIfStmt()
				break
			case token.SWITCH:
				s = p.parseSwitchStmt()
				break
			case token.SELECT:
				s = p.parseSelectStmt()
				break
			case token.FOR:
				s = p.parseForStmt()
				break
			case token.SEMICOLON:
				s = new ast.EmptyStmt({Implicit: p.lit == "\n", Semicolon: p.pos})
				p.next()
				break
			case token.RBRACE:
				s = new ast.EmptyStmt({Implicit: true, Semicolon: p.pos})
				break
			default:
				let pos = p.pos
				p.errorExpected(pos, "statement")
				p.advance(stmtStart)
				s = new ast.BadStmt({From: pos, To: p.pos})
				break
		}
		return s
	}

	public parseImportSpec(doc: ast.CommentGroup | null, _: token.Token, _: number): ast.Spec {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "ImportSpec"))
			});
		}
		let ident: ast.Ident | null = null
		switch (p.tok) {
			case token.IDENT:
				ident = p.parseIdent()
				break
			case token.PERIOD:
				ident = new ast.Ident({Name: ".", NamePos: p.pos})
				p.next()
				break
		}
		let pos = p.pos
		let path: string = ""
		if (p.tok == token.STRING) {
			path = p.lit
			p.next()
		}
		 else if (token.Token_IsLiteral(p.tok)) {
			p.error(pos, "import path must be a string")
			p.next()
		}
		 else {
			p.error(pos, "missing import path")
			p.advance(exprEnd)
		}
		let comment = p.expectSemi()
		let spec = new ast.ImportSpec({Comment: comment, Doc: doc, Name: ident, Path: new ast.BasicLit({Kind: token.STRING, Value: path, ValuePos: pos})})
		p.imports = $.append(p.imports, spec)
		return spec
	}

	public parseValueSpec(doc: ast.CommentGroup | null, keyword: token.Token, iota: number): ast.Spec {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, token.Token_String(keyword) + "Spec"))
			});
		}
		let idents = p.parseIdentList()
		let typ: ast.Expr = null
		let values: $.Slice<ast.Expr> = null
		switch (keyword) {
			case token.CONST:
				if (p.tok != token.EOF && p.tok != token.SEMICOLON && p.tok != token.RPAREN) {
					typ = p.tryIdentOrType()
					if (p.tok == token.ASSIGN) {
						p.next()
						values = p.parseList(true)
					}
				}
				break
			case token.VAR:
				if (p.tok != token.ASSIGN) {
					typ = p.parseType()
				}
				if (p.tok == token.ASSIGN) {
					p.next()
					values = p.parseList(true)
				}
				break
			default:
				$.panic("unreachable")
				break
		}
		let comment = p.expectSemi()
		let spec = new ast.ValueSpec({Comment: comment, Doc: doc, Names: idents, Type: typ, Values: values})
		return spec
	}

	public parseGenericType(spec: ast.TypeSpec | null, openPos: token.Pos, name0: ast.Ident | null, typ0: ast.Expr): void {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "parseGenericType"))
			});
		}
		let list = p.parseParameterList(name0, typ0, token.RBRACK)
		let closePos = p.expect(token.RBRACK)
		spec!.TypeParams = new ast.FieldList({Closing: closePos, List: list, Opening: openPos})
		if (p.tok == token.ASSIGN) {
			// type alias
			spec!.Assign = p.pos
			p.next()
		}
		spec!.Type = p.parseType()
	}

	public parseTypeSpec(doc: ast.CommentGroup | null, _: token.Token, _: number): ast.Spec {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "TypeSpec"))
			});
		}
		let name = p.parseIdent()
		let spec = new ast.TypeSpec({Doc: doc, Name: name})
		if (p.tok == token.LBRACK) {
			// spec.Name "[" ...
			// array/slice type or type parameter list
			let lbrack = p.pos
			p.next()

			// We may have an array type or a type parameter list.
			// In either case we expect an expression x (which may
			// just be a name, or a more complex expression) which
			// we can analyze further.
			//
			// A type parameter list may have a type bound starting
			// with a "[" as in: P []E. In that case, simply parsing
			// an expression would lead to an error: P[] is invalid.
			// But since index or slice expressions are never constant
			// and thus invalid array length expressions, if the name
			// is followed by "[" it must be the start of an array or
			// slice constraint. Only if we don't see a "[" do we
			// need to parse a full expression. Notably, name <- x
			// is not a concern because name <- x is a statement and
			// not an expression.

			// To parse the expression starting with name, expand
			// the call sequence we would get by passing in name
			// to parser.expr, and pass in name to parsePrimaryExpr.

			// Analyze expression x. If we can split x into a type parameter
			// name, possibly followed by a type parameter type, we consider
			// this the start of a type parameter list, with some caveats:
			// a single name followed by "]" tilts the decision towards an
			// array declaration; a type parameter type that could also be
			// an ordinary expression but which is followed by a comma tilts
			// the decision towards a type parameter list.

			// spec.Name "[" pname ...
			// spec.Name "[" pname ptype ...
			// spec.Name "[" pname ptype "," ...
			// ptype may be nil

			// spec.Name "[" pname "]" ...
			// spec.Name "[" x ...

			// array type
			if (p.tok == token.IDENT) {
				// We may have an array type or a type parameter list.
				// In either case we expect an expression x (which may
				// just be a name, or a more complex expression) which
				// we can analyze further.
				//
				// A type parameter list may have a type bound starting
				// with a "[" as in: P []E. In that case, simply parsing
				// an expression would lead to an error: P[] is invalid.
				// But since index or slice expressions are never constant
				// and thus invalid array length expressions, if the name
				// is followed by "[" it must be the start of an array or
				// slice constraint. Only if we don't see a "[" do we
				// need to parse a full expression. Notably, name <- x
				// is not a concern because name <- x is a statement and
				// not an expression.
				let x: ast.Expr = p.parseIdent()

				// To parse the expression starting with name, expand
				// the call sequence we would get by passing in name
				// to parser.expr, and pass in name to parsePrimaryExpr.
				if (p.tok != token.LBRACK) {
					// To parse the expression starting with name, expand
					// the call sequence we would get by passing in name
					// to parser.expr, and pass in name to parsePrimaryExpr.
					p.exprLev++
					let lhs = p.parsePrimaryExpr(x)
					x = p.parseBinaryExpr(lhs, token.LowestPrec + 1)
					p.exprLev--
				}
				// Analyze expression x. If we can split x into a type parameter
				// name, possibly followed by a type parameter type, we consider
				// this the start of a type parameter list, with some caveats:
				// a single name followed by "]" tilts the decision towards an
				// array declaration; a type parameter type that could also be
				// an ordinary expression but which is followed by a comma tilts
				// the decision towards a type parameter list.

				// spec.Name "[" pname ...
				// spec.Name "[" pname ptype ...
				// spec.Name "[" pname ptype "," ...
				// ptype may be nil

				// spec.Name "[" pname "]" ...
				// spec.Name "[" x ...
				{
					let [pname, ptype] = extractName(x, p.tok == token.COMMA)
					if (pname != null && (ptype != null || p.tok != token.RBRACK)) {
						// spec.Name "[" pname ...
						// spec.Name "[" pname ptype ...
						// spec.Name "[" pname ptype "," ...
						p.parseGenericType(spec, lbrack, pname, ptype) // ptype may be nil
					}
					 else {
						// spec.Name "[" pname "]" ...
						// spec.Name "[" x ...
						spec!.Type = p.parseArrayType(lbrack, x)
					}
				}
			}
			 else {
				// array type
				spec!.Type = p.parseArrayType(lbrack, null)
			}
		}
		 else {
			// no type parameters

			// type alias
			if (p.tok == token.ASSIGN) {
				// type alias
				spec!.Assign = p.pos
				p.next()
			}
			spec!.Type = p.parseType()
		}
		spec!.Comment = p.expectSemi()
		return spec
	}

	public parseGenDecl(keyword: token.Token, f: parseSpecFunction | null): ast.GenDecl | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "GenDecl(" + token.Token_String(keyword) + ")"))
			});
		}
		let doc = p.leadComment
		let pos = p.expect(keyword)
		let lparen: token.Pos = 0
		let rparen: token.Pos = 0
		let list: $.Slice<ast.Spec> = null
		if (p.tok == token.LPAREN) {
			lparen = p.pos
			p.next()
			for (let iota = 0; p.tok != token.RPAREN && p.tok != token.EOF; iota++) {
				list = $.append(list, f!(p.leadComment, keyword, iota))
			}
			rparen = p.expect(token.RPAREN)
			p.expectSemi()
		}
		 else {
			list = $.append(list, f!(null, keyword, 0))
		}
		return new ast.GenDecl({Doc: doc, Lparen: lparen, Rparen: rparen, Specs: list, Tok: keyword, TokPos: pos})
	}

	public parseFuncDecl(): ast.FuncDecl | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "FunctionDecl"))
			});
		}
		let doc = p.leadComment
		let pos = p.expect(token.FUNC)
		let recv: ast.FieldList | null = null
		if (p.tok == token.LPAREN) {
			;[, recv] = p.parseParameters(false)
		}
		let ident = p.parseIdent()
		let [tparams, params] = p.parseParameters(true)
		if (recv != null && tparams != null) {
			// Method declarations do not have type parameters. We parse them for a
			// better error message and improved error recovery.
			p.error(tparams!.Opening, "method must have no type parameters")
			tparams = null
		}
		let results = p.parseResult()
		let body: ast.BlockStmt | null = null
		switch (p.tok) {
			case token.LBRACE:
				body = p.parseBody()
				p.expectSemi()
				break
			case token.SEMICOLON:
				p.next()
				if (p.tok == token.LBRACE) {
					// opening { of function declaration on next line
					p.error(p.pos, "unexpected semicolon or newline before {")
					body = p.parseBody()
					p.expectSemi()
				}
				break
			default:
				p.expectSemi()
				break
		}
		let decl = new ast.FuncDecl({Body: body, Doc: doc, Name: ident, Recv: recv, Type: new ast.FuncType({Func: pos, Params: params, Results: results, TypeParams: tparams})})
		return decl
	}

	public parseDecl(sync: Map<token.Token, boolean> | null): ast.Decl {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "Declaration"))
			});
		}
		let f: parseSpecFunction | null = null
		switch (p.tok) {
			case token.IMPORT:
				f = p!.parseImportSpec.bind(p!)
				break
			case token.CONST:
			case token.VAR:
				f = p!.parseValueSpec.bind(p!)
				break
			case token.TYPE:
				f = p!.parseTypeSpec.bind(p!)
				break
			case token.FUNC:
				return p.parseFuncDecl()
				break
			default:
				let pos = p.pos
				p.errorExpected(pos, "declaration")
				p.advance(sync)
				return new ast.BadDecl({From: pos, To: p.pos})
				break
		}
		return p.parseGenDecl(p.tok, f)
	}

	public parseFile(): ast.File | null {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.trace) {
			using __defer = new $.DisposableStack();
			__defer.defer(() => {
				un(trace(p, "File"))
			});
		}
		if (scanner.ErrorList_Len(p.errors) != 0) {
			return null
		}
		let doc = p.leadComment
		let pos = p.expect(token.PACKAGE)
		let ident = p.parseIdent()
		if (ident!.Name == "_" && (p.mode & 16) != 0) {
			p.error(p.pos, "invalid package name _")
		}
		p.expectSemi()
		if (scanner.ErrorList_Len(p.errors) != 0) {
			return null
		}
		let decls: $.Slice<ast.Decl> = null
		if ((p.mode & 1) == 0) {
			// import decls
			for (; p.tok == token.IMPORT; ) {
				decls = $.append(decls, p.parseGenDecl(token.IMPORT, p!.parseImportSpec.bind(p!)))
			}

			// rest of package body

			// Continue to accept import declarations for error tolerance, but complain.
			if ((p.mode & 2) == 0) {
				// rest of package body
				let prev = token.IMPORT

				// Continue to accept import declarations for error tolerance, but complain.
				for (; p.tok != token.EOF; ) {
					// Continue to accept import declarations for error tolerance, but complain.
					if (p.tok == token.IMPORT && prev != token.IMPORT) {
						p.error(p.pos, "imports must appear before other declarations")
					}
					prev = p.tok

					decls = $.append(decls, p.parseDecl(declStart))
				}
			}
		}
		let f = new ast.File({Comments: p.comments, Decls: decls, Doc: doc, GoVersion: p.goVersion, Imports: p.imports, Name: ident, Package: pos})
		let declErr: ((p0: token.Pos, p1: string) => void) | null = null
		if ((p.mode & 16) != 0) {
			declErr = p!.error.bind(p!)
		}
		if ((p.mode & 64) == 0) {
			resolveFile(f, p.file, declErr)
		}
		return f
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'parser',
	  new parser(),
	  [{ name: "init", args: [{ name: "file", type: { kind: $.TypeKind.Pointer, elemType: "File" } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }, { name: "mode", type: "Mode" }], returns: [] }, { name: "printTrace", args: [{ name: "a", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "next0", args: [], returns: [] }, { name: "consumeComment", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Comment" } }, { type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "consumeCommentGroup", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, { type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "next", args: [], returns: [] }, { name: "error", args: [{ name: "pos", type: "Pos" }, { name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "errorExpected", args: [{ name: "pos", type: "Pos" }, { name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "expect", args: [{ name: "tok", type: "Token" }], returns: [{ type: "Pos" }] }, { name: "expect2", args: [{ name: "tok", type: "Token" }], returns: [{ type: "Pos" }] }, { name: "expectClosing", args: [{ name: "tok", type: "Token" }, { name: "context", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: "Pos" }] }, { name: "expectSemi", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }] }, { name: "atComma", args: [{ name: "context", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "follow", type: "Token" }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "advance", args: [{ name: "to", type: { kind: $.TypeKind.Map, keyType: "Token", elemType: { kind: $.TypeKind.Basic, name: "boolean" } } }], returns: [] }, { name: "safePos", args: [{ name: "pos", type: "Pos" }], returns: [{ type: "Pos" }] }, { name: "parseIdent", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }] }, { name: "parseIdentList", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } } }] }, { name: "parseExprList", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "Expr" } }] }, { name: "parseList", args: [{ name: "inRhs", type: { kind: $.TypeKind.Basic, name: "boolean" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "Expr" } }] }, { name: "parseType", args: [], returns: [{ type: "Expr" }] }, { name: "parseQualifiedIdent", args: [{ name: "ident", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }], returns: [{ type: "Expr" }] }, { name: "parseTypeName", args: [{ name: "ident", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }], returns: [{ type: "Expr" }] }, { name: "parseArrayType", args: [{ name: "lbrack", type: "Pos" }, { name: "len", type: "Expr" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "ArrayType" } }] }, { name: "parseArrayFieldOrTypeInstance", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, { type: "Expr" }] }, { name: "parseFieldDecl", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Field" } }] }, { name: "parseStructType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "StructType" } }] }, { name: "parsePointerType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "StarExpr" } }] }, { name: "parseDotsType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Ellipsis" } }] }, { name: "parseParamDecl", args: [{ name: "name", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, { name: "typeSetsOK", type: { kind: $.TypeKind.Basic, name: "boolean" } }], returns: [{ type: "field" }] }, { name: "parseParameterList", args: [{ name: "name0", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, { name: "typ0", type: "Expr" }, { name: "closing", type: "Token" }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Field" } } }] }, { name: "parseParameters", args: [{ name: "acceptTParams", type: { kind: $.TypeKind.Basic, name: "boolean" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }, { type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }] }, { name: "parseResult", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }] }, { name: "parseFuncType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "FuncType" } }] }, { name: "parseMethodSpec", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Field" } }] }, { name: "embeddedElem", args: [{ name: "x", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "embeddedTerm", args: [], returns: [{ type: "Expr" }] }, { name: "parseInterfaceType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "InterfaceType" } }] }, { name: "parseMapType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "MapType" } }] }, { name: "parseChanType", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "ChanType" } }] }, { name: "parseTypeInstance", args: [{ name: "typ", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "tryIdentOrType", args: [], returns: [{ type: "Expr" }] }, { name: "parseStmtList", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "Stmt" } }] }, { name: "parseBody", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "BlockStmt" } }] }, { name: "parseBlockStmt", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "BlockStmt" } }] }, { name: "parseFuncTypeOrLit", args: [], returns: [{ type: "Expr" }] }, { name: "parseOperand", args: [], returns: [{ type: "Expr" }] }, { name: "parseSelector", args: [{ name: "x", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "parseTypeAssertion", args: [{ name: "x", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "parseIndexOrSliceOrInstance", args: [{ name: "x", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "parseCallOrConversion", args: [{ name: "fun", type: "Expr" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CallExpr" } }] }, { name: "parseValue", args: [], returns: [{ type: "Expr" }] }, { name: "parseElement", args: [], returns: [{ type: "Expr" }] }, { name: "parseElementList", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "Expr" } }] }, { name: "parseLiteralValue", args: [{ name: "typ", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "parsePrimaryExpr", args: [{ name: "x", type: "Expr" }], returns: [{ type: "Expr" }] }, { name: "parseUnaryExpr", args: [], returns: [{ type: "Expr" }] }, { name: "tokPrec", args: [], returns: [{ type: "Token" }, { type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "parseBinaryExpr", args: [{ name: "x", type: "Expr" }, { name: "prec1", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: "Expr" }] }, { name: "parseExpr", args: [], returns: [{ type: "Expr" }] }, { name: "parseRhs", args: [], returns: [{ type: "Expr" }] }, { name: "parseSimpleStmt", args: [{ name: "mode", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: "Stmt" }, { type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "parseCallExpr", args: [{ name: "callType", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CallExpr" } }] }, { name: "parseGoStmt", args: [], returns: [{ type: "Stmt" }] }, { name: "parseDeferStmt", args: [], returns: [{ type: "Stmt" }] }, { name: "parseReturnStmt", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "ReturnStmt" } }] }, { name: "parseBranchStmt", args: [{ name: "tok", type: "Token" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "BranchStmt" } }] }, { name: "makeExpr", args: [{ name: "s", type: "Stmt" }, { name: "want", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: "Expr" }] }, { name: "parseIfHeader", args: [], returns: [{ type: "Stmt" }, { type: "Expr" }] }, { name: "parseIfStmt", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "IfStmt" } }] }, { name: "parseCaseClause", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CaseClause" } }] }, { name: "isTypeSwitchGuard", args: [{ name: "s", type: "Stmt" }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "parseSwitchStmt", args: [], returns: [{ type: "Stmt" }] }, { name: "parseCommClause", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "CommClause" } }] }, { name: "parseSelectStmt", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "SelectStmt" } }] }, { name: "parseForStmt", args: [], returns: [{ type: "Stmt" }] }, { name: "parseStmt", args: [], returns: [{ type: "Stmt" }] }, { name: "parseImportSpec", args: [{ name: "doc", type: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, { name: "_", type: "Token" }, { name: "_", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: "Spec" }] }, { name: "parseValueSpec", args: [{ name: "doc", type: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, { name: "keyword", type: "Token" }, { name: "iota", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: "Spec" }] }, { name: "parseGenericType", args: [{ name: "spec", type: { kind: $.TypeKind.Pointer, elemType: "TypeSpec" } }, { name: "openPos", type: "Pos" }, { name: "name0", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, { name: "typ0", type: "Expr" }], returns: [] }, { name: "parseTypeSpec", args: [{ name: "doc", type: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, { name: "_", type: "Token" }, { name: "_", type: { kind: $.TypeKind.Basic, name: "number" } }], returns: [{ type: "Spec" }] }, { name: "parseGenDecl", args: [{ name: "keyword", type: "Token" }, { name: "f", type: "parseSpecFunction" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "GenDecl" } }] }, { name: "parseFuncDecl", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "FuncDecl" } }] }, { name: "parseDecl", args: [{ name: "sync", type: { kind: $.TypeKind.Map, keyType: "Token", elemType: { kind: $.TypeKind.Basic, name: "boolean" } } }], returns: [{ type: "Decl" }] }, { name: "parseFile", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "File" } }] }],
	  parser,
	  {"file": { kind: $.TypeKind.Pointer, elemType: "File" }, "errors": "ErrorList", "scanner": "Scanner", "mode": "Mode", "trace": { kind: $.TypeKind.Basic, name: "boolean" }, "indent": { kind: $.TypeKind.Basic, name: "number" }, "comments": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, "leadComment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "lineComment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "top": { kind: $.TypeKind.Basic, name: "boolean" }, "goVersion": { kind: $.TypeKind.Basic, name: "string" }, "pos": "Pos", "tok": "Token", "lit": { kind: $.TypeKind.Basic, name: "string" }, "syncPos": "Pos", "syncCnt": { kind: $.TypeKind.Basic, name: "number" }, "exprLev": { kind: $.TypeKind.Basic, name: "number" }, "inRhs": { kind: $.TypeKind.Basic, name: "boolean" }, "imports": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "ImportSpec" } }, "nestLev": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

let declStart: Map<token.Token, boolean> | null = new Map([[token.IMPORT, true], [token.CONST, true], [token.TYPE, true], [token.VAR, true]])

let exprEnd: Map<token.Token, boolean> | null = new Map([[token.COMMA, true], [token.COLON, true], [token.SEMICOLON, true], [token.RPAREN, true], [token.RBRACK, true], [token.RBRACE, true]])

let stmtStart: Map<token.Token, boolean> | null = new Map([[token.BREAK, true], [token.CONST, true], [token.CONTINUE, true], [token.DEFER, true], [token.FALLTHROUGH, true], [token.FOR, true], [token.GO, true], [token.GOTO, true], [token.IF, true], [token.RETURN, true], [token.SELECT, true], [token.SWITCH, true], [token.TYPE, true], [token.VAR, true]])

export function trace(p: parser | null, msg: string): parser | null {
	p!.printTrace(msg, "(")
	p!.indent++
	return p
}

// Usage pattern: defer un(trace(p, "..."))
export function un(p: parser | null): void {
	p!.indent--
	p!.printTrace(")")
}

export function incNestLev(p: parser | null): parser | null {
	p!.nestLev++
	if (p!.nestLev > 100000) {
		p!.error(p!.pos, "exceeded max nesting depth")
		$.panic($.markAsStructValue(new bailout({})))
	}
	return p
}

// decNestLev is used to track nesting depth during parsing to prevent stack exhaustion.
// It is used along with incNestLev in a similar fashion to how un and trace are used.
export function decNestLev(p: parser | null): void {
	p!.nestLev--
}

export function assert(cond: boolean, msg: string): void {
	if (!cond) {
		$.panic("go/parser internal error: " + msg)
	}
}

export function isTypeSwitchAssert(x: ast.Expr): boolean {
	let { value: a, ok: ok } = $.typeAssert<ast.TypeAssertExpr | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.TypeAssertExpr'})
	return ok && a!.Type == null
}

// extractName splits the expression x into (name, expr) if syntactically
// x can be written as name expr. The split only happens if expr is a type
// element (per the isTypeElem predicate) or if force is set.
// If x is just a name, the result is (name, nil). If the split succeeds,
// the result is (name, expr). Otherwise the result is (nil, x).
// Examples:
//
//	x           force    name    expr
//	------------------------------------
//	P*[]int     T/F      P       *[]int
//	P*E         T        P       *E
//	P*E         F        nil     P*E
//	P([]int)    T/F      P       ([]int)
//	P(E)        T        P       (E)
//	P(E)        F        nil     P(E)
//	P*E|F|~G    T/F      P       *E|F|~G
//	P*E|F|G     T        P       *E|F|G
//	P*E|F|G     F        nil     P*E|F|G
export function extractName(x: ast.Expr, force: boolean): [ast.Ident | null, ast.Expr] {

	// x = name *x.Y

	// x = name lhs|x.Y

	// x = name (x.Args[0])
	// (Note that the cmd/compile/internal/syntax parser does not care
	// about syntax tree fidelity and does not preserve parentheses here.)
	$.typeSwitch(x, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.Ident'}], body: (x) => {
		return [x, null]
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BinaryExpr'}], body: (x) => {
		switch (x!.Op) {
			case token.MUL:
				{
					let { value: name } = $.typeAssert<ast.Ident | null>(x!.X, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (name != null && (force || isTypeElem(x!.Y))) {
						// x = name *x.Y
						return [name, new ast.StarExpr({Star: x!.OpPos, X: x!.Y})]
					}
				}
				break
			case token.OR:
				{
					let [name, lhs] = extractName(x!.X, force || isTypeElem(x!.Y))
					if (name != null && lhs != null) {
						// x = name lhs|x.Y
						let op = $.markAsStructValue(x!.clone())
						op.X = lhs
						return [name, op]
					}
				}
				break
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CallExpr'}], body: (x) => {
		{
			let { value: name } = $.typeAssert<ast.Ident | null>(x!.Fun, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
			if (name != null) {

				// x = name (x.Args[0])
				// (Note that the cmd/compile/internal/syntax parser does not care
				// about syntax tree fidelity and does not preserve parentheses here.)
				if ($.len(x!.Args) == 1 && x!.Ellipsis == token.NoPos && (force || isTypeElem(x!.Args![0]))) {
					// x = name (x.Args[0])
					// (Note that the cmd/compile/internal/syntax parser does not care
					// about syntax tree fidelity and does not preserve parentheses here.)
					return [name, new ast.ParenExpr({Lparen: x!.Lparen, Rparen: x!.Rparen, X: x!.Args![0]})]
				}
			}
		}
	}}])
	return [null, x]
}

// isTypeElem reports whether x is a (possibly parenthesized) type element expression.
// The result is false if x could be a type element OR an ordinary (value) expression.
export function isTypeElem(x: ast.Expr): boolean {
	$.typeSwitch(x, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.ArrayType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.StructType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.FuncType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.InterfaceType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.MapType'}, {kind: $.TypeKind.Pointer, elemType: 'ast.ChanType'}], body: (x) => {
		return true
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BinaryExpr'}], body: (x) => {
		return isTypeElem(x!.X) || isTypeElem(x!.Y)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.UnaryExpr'}], body: (x) => {
		return x!.Op == token.TILDE
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.ParenExpr'}], body: (x) => {
		return isTypeElem(x!.X)
	}}])
	return false
}

// packIndexExpr returns an IndexExpr x[expr0] or IndexListExpr x[expr0, ...].
export function packIndexExpr(x: ast.Expr, lbrack: token.Pos, exprs: $.Slice<ast.Expr>, rbrack: token.Pos): ast.Expr {
	switch ($.len(exprs)) {
		case 0:
			$.panic("internal error: packIndexExpr with empty expr slice")
			break
		case 1:
			return new ast.IndexExpr({Index: exprs![0], Lbrack: lbrack, Rbrack: rbrack, X: x})
			break
		default:
			return new ast.IndexListExpr({Indices: exprs, Lbrack: lbrack, Rbrack: rbrack, X: x})
			break
	}
}

