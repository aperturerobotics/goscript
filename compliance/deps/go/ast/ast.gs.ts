import * as $ from "@goscript/builtin/index.js"
import { Object, Scope } from "./scope.gs.js";

import * as token from "@goscript/go/token/index.js"

import * as strings from "@goscript/strings/index.js"

export let SEND: ChanDir = (1 << 0)

export let RECV: ChanDir = 0

// A BadDecl node is a placeholder for a declaration containing
// syntax errors for which a correct declaration node cannot be
// created.
//
export class BadDecl {
	// position range of bad declaration
	public get From(): token.Pos {
		return this._fields.From.value
	}
	public set From(value: token.Pos) {
		this._fields.From.value = value
	}

	// position range of bad declaration
	public get To(): token.Pos {
		return this._fields.To.value
	}
	public set To(value: token.Pos) {
		this._fields.To.value = value
	}

	public _fields: {
		From: $.VarRef<token.Pos>;
		To: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{From?: token.Pos, To?: token.Pos}>) {
		this._fields = {
			From: $.varRef(init?.From ?? 0 as token.Pos),
			To: $.varRef(init?.To ?? 0 as token.Pos)
		}
	}

	public clone(): BadDecl {
		const cloned = new BadDecl()
		cloned._fields = {
			From: $.varRef(this._fields.From.value),
			To: $.varRef(this._fields.To.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const d = this
		return d.From
	}

	public End(): token.Pos {
		const d = this
		return d.To
	}

	// declNode() ensures that only declaration nodes can be
	// assigned to a Decl.
	public declNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BadDecl',
	  new BadDecl(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "declNode", args: [], returns: [] }],
	  BadDecl,
	  {"From": "Pos", "To": "Pos"}
	);
}

// A BadExpr node is a placeholder for an expression containing
// syntax errors for which a correct expression node cannot be
// created.
//
export class BadExpr {
	// position range of bad expression
	public get From(): token.Pos {
		return this._fields.From.value
	}
	public set From(value: token.Pos) {
		this._fields.From.value = value
	}

	// position range of bad expression
	public get To(): token.Pos {
		return this._fields.To.value
	}
	public set To(value: token.Pos) {
		this._fields.To.value = value
	}

	public _fields: {
		From: $.VarRef<token.Pos>;
		To: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{From?: token.Pos, To?: token.Pos}>) {
		this._fields = {
			From: $.varRef(init?.From ?? 0 as token.Pos),
			To: $.varRef(init?.To ?? 0 as token.Pos)
		}
	}

	public clone(): BadExpr {
		const cloned = new BadExpr()
		cloned._fields = {
			From: $.varRef(this._fields.From.value),
			To: $.varRef(this._fields.To.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.From
	}

	public End(): token.Pos {
		const x = this
		return x.To
	}

	// exprNode() ensures that only expression/type nodes can be
	// assigned to an Expr.
	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BadExpr',
	  new BadExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  BadExpr,
	  {"From": "Pos", "To": "Pos"}
	);
}

// A BadStmt node is a placeholder for statements containing
// syntax errors for which no correct statement nodes can be
// created.
//
export class BadStmt {
	// position range of bad statement
	public get From(): token.Pos {
		return this._fields.From.value
	}
	public set From(value: token.Pos) {
		this._fields.From.value = value
	}

	// position range of bad statement
	public get To(): token.Pos {
		return this._fields.To.value
	}
	public set To(value: token.Pos) {
		this._fields.To.value = value
	}

	public _fields: {
		From: $.VarRef<token.Pos>;
		To: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{From?: token.Pos, To?: token.Pos}>) {
		this._fields = {
			From: $.varRef(init?.From ?? 0 as token.Pos),
			To: $.varRef(init?.To ?? 0 as token.Pos)
		}
	}

	public clone(): BadStmt {
		const cloned = new BadStmt()
		cloned._fields = {
			From: $.varRef(this._fields.From.value),
			To: $.varRef(this._fields.To.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.From
	}

	public End(): token.Pos {
		const s = this
		return s.To
	}

	// stmtNode() ensures that only statement nodes can be
	// assigned to a Stmt.
	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BadStmt',
	  new BadStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  BadStmt,
	  {"From": "Pos", "To": "Pos"}
	);
}

// A BasicLit node represents a literal of basic type.
//
// Note that for the CHAR and STRING kinds, the literal is stored
// with its quotes. For example, for a double-quoted STRING, the
// first and the last rune in the Value field will be ". The
// [strconv.Unquote] and [strconv.UnquoteChar] functions can be
// used to unquote STRING and CHAR values, respectively.
//
// For raw string literals (Kind == token.STRING && Value[0] == '`'),
// the Value field contains the string text without carriage returns (\r) that
// may have been present in the source. Because the end position is
// computed using len(Value), the position reported by [BasicLit.End] does not match the
// true source end position for raw string literals containing carriage returns.
export class BasicLit {
	// literal position
	public get ValuePos(): token.Pos {
		return this._fields.ValuePos.value
	}
	public set ValuePos(value: token.Pos) {
		this._fields.ValuePos.value = value
	}

	// token.INT, token.FLOAT, token.IMAG, token.CHAR, or token.STRING
	public get Kind(): token.Token {
		return this._fields.Kind.value
	}
	public set Kind(value: token.Token) {
		this._fields.Kind.value = value
	}

	// literal string; e.g. 42, 0x7f, 3.14, 1e-9, 2.4i, 'a', '\x7f', "foo" or `\m\n\o`
	public get Value(): string {
		return this._fields.Value.value
	}
	public set Value(value: string) {
		this._fields.Value.value = value
	}

	public _fields: {
		ValuePos: $.VarRef<token.Pos>;
		Kind: $.VarRef<token.Token>;
		Value: $.VarRef<string>;
	}

	constructor(init?: Partial<{Kind?: token.Token, Value?: string, ValuePos?: token.Pos}>) {
		this._fields = {
			ValuePos: $.varRef(init?.ValuePos ?? 0 as token.Pos),
			Kind: $.varRef(init?.Kind ?? 0 as token.Token),
			Value: $.varRef(init?.Value ?? "")
		}
	}

	public clone(): BasicLit {
		const cloned = new BasicLit()
		cloned._fields = {
			ValuePos: $.varRef(this._fields.ValuePos.value),
			Kind: $.varRef(this._fields.Kind.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.ValuePos
	}

	public End(): token.Pos {
		const x = this
		return (x.ValuePos + $.len(x.Value) as token.Pos)
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BasicLit',
	  new BasicLit(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  BasicLit,
	  {"ValuePos": "Pos", "Kind": "Token", "Value": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

// A BranchStmt node represents a break, continue, goto,
// or fallthrough statement.
//
export class BranchStmt {
	// position of Tok
	public get TokPos(): token.Pos {
		return this._fields.TokPos.value
	}
	public set TokPos(value: token.Pos) {
		this._fields.TokPos.value = value
	}

	// keyword token (BREAK, CONTINUE, GOTO, FALLTHROUGH)
	public get Tok(): token.Token {
		return this._fields.Tok.value
	}
	public set Tok(value: token.Token) {
		this._fields.Tok.value = value
	}

	// label name; or nil
	public get Label(): Ident | null {
		return this._fields.Label.value
	}
	public set Label(value: Ident | null) {
		this._fields.Label.value = value
	}

	public _fields: {
		TokPos: $.VarRef<token.Pos>;
		Tok: $.VarRef<token.Token>;
		Label: $.VarRef<Ident | null>;
	}

	constructor(init?: Partial<{Label?: Ident | null, Tok?: token.Token, TokPos?: token.Pos}>) {
		this._fields = {
			TokPos: $.varRef(init?.TokPos ?? 0 as token.Pos),
			Tok: $.varRef(init?.Tok ?? 0 as token.Token),
			Label: $.varRef(init?.Label ?? null)
		}
	}

	public clone(): BranchStmt {
		const cloned = new BranchStmt()
		cloned._fields = {
			TokPos: $.varRef(this._fields.TokPos.value),
			Tok: $.varRef(this._fields.Tok.value),
			Label: $.varRef(this._fields.Label.value ? $.markAsStructValue(this._fields.Label.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.TokPos
	}

	public End(): token.Pos {
		const s = this
		if (s.Label != null) {
			return s.Label!.End()
		}
		return (s.TokPos + $.len(token.Token_String(s.Tok)) as token.Pos)
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BranchStmt',
	  new BranchStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  BranchStmt,
	  {"TokPos": "Pos", "Tok": "Token", "Label": { kind: $.TypeKind.Pointer, elemType: "Ident" }}
	);
}

export type ChanDir = number;

export class Comment {
	// position of "/" starting the comment
	public get Slash(): token.Pos {
		return this._fields.Slash.value
	}
	public set Slash(value: token.Pos) {
		this._fields.Slash.value = value
	}

	// comment text (excluding '\n' for //-style comments)
	public get Text(): string {
		return this._fields.Text.value
	}
	public set Text(value: string) {
		this._fields.Text.value = value
	}

	public _fields: {
		Slash: $.VarRef<token.Pos>;
		Text: $.VarRef<string>;
	}

	constructor(init?: Partial<{Slash?: token.Pos, Text?: string}>) {
		this._fields = {
			Slash: $.varRef(init?.Slash ?? 0 as token.Pos),
			Text: $.varRef(init?.Text ?? "")
		}
	}

	public clone(): Comment {
		const cloned = new Comment()
		cloned._fields = {
			Slash: $.varRef(this._fields.Slash.value),
			Text: $.varRef(this._fields.Text.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const c = this
		return c.Slash
	}

	public End(): token.Pos {
		const c = this
		return (c.Slash + $.len(c.Text) as token.Pos)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Comment',
	  new Comment(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }],
	  Comment,
	  {"Slash": "Pos", "Text": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class CommentGroup {
	// len(List) > 0
	public get List(): $.Slice<Comment | null> {
		return this._fields.List.value
	}
	public set List(value: $.Slice<Comment | null>) {
		this._fields.List.value = value
	}

	public _fields: {
		List: $.VarRef<$.Slice<Comment | null>>;
	}

	constructor(init?: Partial<{List?: $.Slice<Comment | null>}>) {
		this._fields = {
			List: $.varRef(init?.List ?? null)
		}
	}

	public clone(): CommentGroup {
		const cloned = new CommentGroup()
		cloned._fields = {
			List: $.varRef(this._fields.List.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const g = this
		return g.List![0]!.Pos()
	}

	public End(): token.Pos {
		const g = this
		return g.List![$.len(g.List) - 1]!.End()
	}

	// Text returns the text of the comment.
	// Comment markers (//, /*, and */), the first space of a line comment, and
	// leading and trailing empty lines are removed.
	// Comment directives like "//line" and "//go:noinline" are also removed.
	// Multiple empty lines are reduced to one, and trailing space on lines is trimmed.
	// Unless the result is empty, it is newline-terminated.
	public Text(): string {
		const g = this
		if (g == null) {
			return ""
		}
		let comments = $.makeSlice<string>($.len(g.List), undefined, 'string')
		for (let i = 0; i < $.len(g.List); i++) {
			const c = g.List![i]
			{
				comments![i] = c!.Text
			}
		}
		let lines = $.makeSlice<string>(0, 10, 'string') // most comments are less than 10 lines
		for (let _i = 0; _i < $.len(comments); _i++) {
			const c = comments![_i]
			{
				// Remove comment markers.
				// The parser has given us exactly the comment text.

				//-style comment (no newline at the end)

				// empty line

				// strip first space - required for Example tests

				// Ignore //go:noinline, //line, and so on.

				/*-style comment */
				switch ($.indexString(c, 1)) {
					case 47:
						c = $.sliceString(c, 2, undefined)
						if ($.len(c) == 0) {
							// empty line
							break
						}
						if ($.indexString(c, 0) == 32) {
							// strip first space - required for Example tests
							c = $.sliceString(c, 1, undefined)
							break
						}
						if (isDirective(c)) {
							// Ignore //go:noinline, //line, and so on.
							continue
						}
						break
					case 42:
						c = $.sliceString(c, 2, $.len(c) - 2)
						break
				}

				// Split on newlines.
				let cl = strings.Split(c, "\n")

				// Walk lines, stripping trailing white space and adding to list.
				for (let _i = 0; _i < $.len(cl); _i++) {
					const l = cl![_i]
					{
						lines = $.append(lines, stripTrailingWhitespace(l))
					}
				}
			}
		}
		let n = 0
		for (let _i = 0; _i < $.len(lines); _i++) {
			const line = lines![_i]
			{
				if (line != "" || n > 0 && lines![n - 1] != "") {
					lines![n] = line
					n++
				}
			}
		}
		lines = $.goSlice(lines, 0, n)
		if (n > 0 && lines![n - 1] != "") {
			lines = $.append(lines, "")
		}
		return strings.Join(lines, "\n")
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'CommentGroup',
	  new CommentGroup(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "Text", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  CommentGroup,
	  {"List": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Comment" } }}
	);
}

export type Decl = null | {
	declNode(): void
} & Node

$.registerInterfaceType(
  'Decl',
  null, // Zero value for interface is null
  [{ name: "declNode", args: [], returns: [] }]
);

// A DeferStmt node represents a defer statement.
export class DeferStmt {
	// position of "defer" keyword
	public get Defer(): token.Pos {
		return this._fields.Defer.value
	}
	public set Defer(value: token.Pos) {
		this._fields.Defer.value = value
	}

	public get Call(): CallExpr | null {
		return this._fields.Call.value
	}
	public set Call(value: CallExpr | null) {
		this._fields.Call.value = value
	}

	public _fields: {
		Defer: $.VarRef<token.Pos>;
		Call: $.VarRef<CallExpr | null>;
	}

	constructor(init?: Partial<{Call?: CallExpr | null, Defer?: token.Pos}>) {
		this._fields = {
			Defer: $.varRef(init?.Defer ?? 0 as token.Pos),
			Call: $.varRef(init?.Call ?? null)
		}
	}

	public clone(): DeferStmt {
		const cloned = new DeferStmt()
		cloned._fields = {
			Defer: $.varRef(this._fields.Defer.value),
			Call: $.varRef(this._fields.Call.value ? $.markAsStructValue(this._fields.Call.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Defer
	}

	public End(): token.Pos {
		const s = this
		return s.Call!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'DeferStmt',
	  new DeferStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  DeferStmt,
	  {"Defer": "Pos", "Call": { kind: $.TypeKind.Pointer, elemType: "CallExpr" }}
	);
}

// An EmptyStmt node represents an empty statement.
// The "position" of the empty statement is the position
// of the immediately following (explicit or implicit) semicolon.
//
export class EmptyStmt {
	// position of following ";"
	public get Semicolon(): token.Pos {
		return this._fields.Semicolon.value
	}
	public set Semicolon(value: token.Pos) {
		this._fields.Semicolon.value = value
	}

	// if set, ";" was omitted in the source
	public get Implicit(): boolean {
		return this._fields.Implicit.value
	}
	public set Implicit(value: boolean) {
		this._fields.Implicit.value = value
	}

	public _fields: {
		Semicolon: $.VarRef<token.Pos>;
		Implicit: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{Implicit?: boolean, Semicolon?: token.Pos}>) {
		this._fields = {
			Semicolon: $.varRef(init?.Semicolon ?? 0 as token.Pos),
			Implicit: $.varRef(init?.Implicit ?? false)
		}
	}

	public clone(): EmptyStmt {
		const cloned = new EmptyStmt()
		cloned._fields = {
			Semicolon: $.varRef(this._fields.Semicolon.value),
			Implicit: $.varRef(this._fields.Implicit.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Semicolon
	}

	public End(): token.Pos {
		const s = this
		if (s.Implicit) {
			return s.Semicolon
		}
		return s.Semicolon + 1
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'EmptyStmt',
	  new EmptyStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  EmptyStmt,
	  {"Semicolon": "Pos", "Implicit": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

export type Expr = null | {
	exprNode(): void
} & Node

$.registerInterfaceType(
  'Expr',
  null, // Zero value for interface is null
  [{ name: "exprNode", args: [], returns: [] }]
);

export class FieldList {
	// position of opening parenthesis/brace/bracket, if any
	public get Opening(): token.Pos {
		return this._fields.Opening.value
	}
	public set Opening(value: token.Pos) {
		this._fields.Opening.value = value
	}

	// field list; or nil
	public get List(): $.Slice<Field | null> {
		return this._fields.List.value
	}
	public set List(value: $.Slice<Field | null>) {
		this._fields.List.value = value
	}

	// position of closing parenthesis/brace/bracket, if any
	public get Closing(): token.Pos {
		return this._fields.Closing.value
	}
	public set Closing(value: token.Pos) {
		this._fields.Closing.value = value
	}

	public _fields: {
		Opening: $.VarRef<token.Pos>;
		List: $.VarRef<$.Slice<Field | null>>;
		Closing: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Closing?: token.Pos, List?: $.Slice<Field | null>, Opening?: token.Pos}>) {
		this._fields = {
			Opening: $.varRef(init?.Opening ?? 0 as token.Pos),
			List: $.varRef(init?.List ?? null),
			Closing: $.varRef(init?.Closing ?? 0 as token.Pos)
		}
	}

	public clone(): FieldList {
		const cloned = new FieldList()
		cloned._fields = {
			Opening: $.varRef(this._fields.Opening.value),
			List: $.varRef(this._fields.List.value),
			Closing: $.varRef(this._fields.Closing.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const f = this
		if (token.Pos_IsValid(f.Opening)) {
			return f.Opening
		}
		if ($.len(f.List) > 0) {
			return f.List![0]!.Pos()
		}
		return token.NoPos
	}

	public End(): token.Pos {
		const f = this
		if (token.Pos_IsValid(f.Closing)) {
			return f.Closing + 1
		}
		{
			let n = $.len(f.List)
			if (n > 0) {
				return f.List![n - 1]!.End()
			}
		}
		return token.NoPos
	}

	// NumFields returns the number of parameters or struct fields represented by a [FieldList].
	public NumFields(): number {
		const f = this
		let n = 0
		if (f != null) {
			for (let _i = 0; _i < $.len(f.List); _i++) {
				const g = f.List![_i]
				{
					let m = $.len(g!.Names)
					if (m == 0) {
						m = 1
					}
					n += m
				}
			}
		}
		return n
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'FieldList',
	  new FieldList(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "NumFields", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }],
	  FieldList,
	  {"Opening": "Pos", "List": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Field" } }, "Closing": "Pos"}
	);
}

// A FuncDecl node represents a function declaration.
export class FuncDecl {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// receiver (methods); or nil (functions)
	public get Recv(): FieldList | null {
		return this._fields.Recv.value
	}
	public set Recv(value: FieldList | null) {
		this._fields.Recv.value = value
	}

	// function/method name
	public get Name(): Ident | null {
		return this._fields.Name.value
	}
	public set Name(value: Ident | null) {
		this._fields.Name.value = value
	}

	// function signature: type and value parameters, results, and position of "func" keyword
	public get Type(): FuncType | null {
		return this._fields.Type.value
	}
	public set Type(value: FuncType | null) {
		this._fields.Type.value = value
	}

	// function body; or nil for external (non-Go) function
	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Recv: $.VarRef<FieldList | null>;
		Name: $.VarRef<Ident | null>;
		Type: $.VarRef<FuncType | null>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Doc?: CommentGroup | null, Name?: Ident | null, Recv?: FieldList | null, Type?: FuncType | null}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Recv: $.varRef(init?.Recv ?? null),
			Name: $.varRef(init?.Name ?? null),
			Type: $.varRef(init?.Type ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): FuncDecl {
		const cloned = new FuncDecl()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Recv: $.varRef(this._fields.Recv.value ? $.markAsStructValue(this._fields.Recv.value.clone()) : null),
			Name: $.varRef(this._fields.Name.value ? $.markAsStructValue(this._fields.Name.value.clone()) : null),
			Type: $.varRef(this._fields.Type.value ? $.markAsStructValue(this._fields.Type.value.clone()) : null),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const d = this
		return d.Type!.Pos()
	}

	public End(): token.Pos {
		const d = this
		if (d.Body != null) {
			return d.Body!.End()
		}
		return d.Type!.End()
	}

	public declNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'FuncDecl',
	  new FuncDecl(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "declNode", args: [], returns: [] }],
	  FuncDecl,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Recv": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Name": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "Type": { kind: $.TypeKind.Pointer, elemType: "FuncType" }, "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// A FuncLit node represents a function literal.
export class FuncLit {
	// function type
	public get Type(): FuncType | null {
		return this._fields.Type.value
	}
	public set Type(value: FuncType | null) {
		this._fields.Type.value = value
	}

	// function body
	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		Type: $.VarRef<FuncType | null>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Type?: FuncType | null}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): FuncLit {
		const cloned = new FuncLit()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value ? $.markAsStructValue(this._fields.Type.value.clone()) : null),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Type!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Body!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'FuncLit',
	  new FuncLit(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  FuncLit,
	  {"Type": { kind: $.TypeKind.Pointer, elemType: "FuncType" }, "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// A FuncType node represents a function type.
export class FuncType {
	// position of "func" keyword (token.NoPos if there is no "func")
	public get Func(): token.Pos {
		return this._fields.Func.value
	}
	public set Func(value: token.Pos) {
		this._fields.Func.value = value
	}

	// type parameters; or nil
	public get TypeParams(): FieldList | null {
		return this._fields.TypeParams.value
	}
	public set TypeParams(value: FieldList | null) {
		this._fields.TypeParams.value = value
	}

	// (incoming) parameters; non-nil
	public get Params(): FieldList | null {
		return this._fields.Params.value
	}
	public set Params(value: FieldList | null) {
		this._fields.Params.value = value
	}

	// (outgoing) results; or nil
	public get Results(): FieldList | null {
		return this._fields.Results.value
	}
	public set Results(value: FieldList | null) {
		this._fields.Results.value = value
	}

	public _fields: {
		Func: $.VarRef<token.Pos>;
		TypeParams: $.VarRef<FieldList | null>;
		Params: $.VarRef<FieldList | null>;
		Results: $.VarRef<FieldList | null>;
	}

	constructor(init?: Partial<{Func?: token.Pos, Params?: FieldList | null, Results?: FieldList | null, TypeParams?: FieldList | null}>) {
		this._fields = {
			Func: $.varRef(init?.Func ?? 0 as token.Pos),
			TypeParams: $.varRef(init?.TypeParams ?? null),
			Params: $.varRef(init?.Params ?? null),
			Results: $.varRef(init?.Results ?? null)
		}
	}

	public clone(): FuncType {
		const cloned = new FuncType()
		cloned._fields = {
			Func: $.varRef(this._fields.Func.value),
			TypeParams: $.varRef(this._fields.TypeParams.value ? $.markAsStructValue(this._fields.TypeParams.value.clone()) : null),
			Params: $.varRef(this._fields.Params.value ? $.markAsStructValue(this._fields.Params.value.clone()) : null),
			Results: $.varRef(this._fields.Results.value ? $.markAsStructValue(this._fields.Results.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		if (token.Pos_IsValid(x.Func) || x.Params == null) {
			// see issue 3870
			return x.Func
		}
		return x.Params!.Pos()
	}

	public End(): token.Pos {
		const x = this
		if (x.Results != null) {
			return x.Results!.End()
		}
		return x.Params!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'FuncType',
	  new FuncType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  FuncType,
	  {"Func": "Pos", "TypeParams": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Params": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Results": { kind: $.TypeKind.Pointer, elemType: "FieldList" }}
	);
}

// A GoStmt node represents a go statement.
export class GoStmt {
	// position of "go" keyword
	public get Go(): token.Pos {
		return this._fields.Go.value
	}
	public set Go(value: token.Pos) {
		this._fields.Go.value = value
	}

	public get Call(): CallExpr | null {
		return this._fields.Call.value
	}
	public set Call(value: CallExpr | null) {
		this._fields.Call.value = value
	}

	public _fields: {
		Go: $.VarRef<token.Pos>;
		Call: $.VarRef<CallExpr | null>;
	}

	constructor(init?: Partial<{Call?: CallExpr | null, Go?: token.Pos}>) {
		this._fields = {
			Go: $.varRef(init?.Go ?? 0 as token.Pos),
			Call: $.varRef(init?.Call ?? null)
		}
	}

	public clone(): GoStmt {
		const cloned = new GoStmt()
		cloned._fields = {
			Go: $.varRef(this._fields.Go.value),
			Call: $.varRef(this._fields.Call.value ? $.markAsStructValue(this._fields.Call.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Go
	}

	public End(): token.Pos {
		const s = this
		return s.Call!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'GoStmt',
	  new GoStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  GoStmt,
	  {"Go": "Pos", "Call": { kind: $.TypeKind.Pointer, elemType: "CallExpr" }}
	);
}

// An Ident node represents an identifier.
export class Ident {
	// identifier position
	public get NamePos(): token.Pos {
		return this._fields.NamePos.value
	}
	public set NamePos(value: token.Pos) {
		this._fields.NamePos.value = value
	}

	// identifier name
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	// denoted object, or nil. Deprecated: see Object.
	public get Obj(): Object | null {
		return this._fields.Obj.value
	}
	public set Obj(value: Object | null) {
		this._fields.Obj.value = value
	}

	public _fields: {
		NamePos: $.VarRef<token.Pos>;
		Name: $.VarRef<string>;
		Obj: $.VarRef<Object | null>;
	}

	constructor(init?: Partial<{Name?: string, NamePos?: token.Pos, Obj?: Object | null}>) {
		this._fields = {
			NamePos: $.varRef(init?.NamePos ?? 0 as token.Pos),
			Name: $.varRef(init?.Name ?? ""),
			Obj: $.varRef(init?.Obj ?? null)
		}
	}

	public clone(): Ident {
		const cloned = new Ident()
		cloned._fields = {
			NamePos: $.varRef(this._fields.NamePos.value),
			Name: $.varRef(this._fields.Name.value),
			Obj: $.varRef(this._fields.Obj.value ? $.markAsStructValue(this._fields.Obj.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.NamePos
	}

	public End(): token.Pos {
		const x = this
		return (x.NamePos + $.len(x.Name) as token.Pos)
	}

	public exprNode(): void {
	}

	// IsExported reports whether id starts with an upper-case letter.
	public IsExported(): boolean {
		const id = this
		return token.IsExported(id.Name)
	}

	public String(): string {
		const id = this
		if (id != null) {
			return id.Name
		}
		return "<nil>"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Ident',
	  new Ident(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }, { name: "IsExported", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Ident,
	  {"NamePos": "Pos", "Name": { kind: $.TypeKind.Basic, name: "string" }, "Obj": { kind: $.TypeKind.Pointer, elemType: "Object" }}
	);
}

// An ImportSpec node represents a single package import.
export class ImportSpec {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// local package name (including "."); or nil
	public get Name(): Ident | null {
		return this._fields.Name.value
	}
	public set Name(value: Ident | null) {
		this._fields.Name.value = value
	}

	// import path
	public get Path(): BasicLit | null {
		return this._fields.Path.value
	}
	public set Path(value: BasicLit | null) {
		this._fields.Path.value = value
	}

	// line comments; or nil
	public get Comment(): CommentGroup | null {
		return this._fields.Comment.value
	}
	public set Comment(value: CommentGroup | null) {
		this._fields.Comment.value = value
	}

	// end of spec (overrides Path.Pos if nonzero)
	public get EndPos(): token.Pos {
		return this._fields.EndPos.value
	}
	public set EndPos(value: token.Pos) {
		this._fields.EndPos.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Name: $.VarRef<Ident | null>;
		Path: $.VarRef<BasicLit | null>;
		Comment: $.VarRef<CommentGroup | null>;
		EndPos: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Comment?: CommentGroup | null, Doc?: CommentGroup | null, EndPos?: token.Pos, Name?: Ident | null, Path?: BasicLit | null}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Name: $.varRef(init?.Name ?? null),
			Path: $.varRef(init?.Path ?? null),
			Comment: $.varRef(init?.Comment ?? null),
			EndPos: $.varRef(init?.EndPos ?? 0 as token.Pos)
		}
	}

	public clone(): ImportSpec {
		const cloned = new ImportSpec()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Name: $.varRef(this._fields.Name.value ? $.markAsStructValue(this._fields.Name.value.clone()) : null),
			Path: $.varRef(this._fields.Path.value ? $.markAsStructValue(this._fields.Path.value.clone()) : null),
			Comment: $.varRef(this._fields.Comment.value ? $.markAsStructValue(this._fields.Comment.value.clone()) : null),
			EndPos: $.varRef(this._fields.EndPos.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		if (s.Name != null) {
			return s.Name!.Pos()
		}
		return s.Path!.Pos()
	}

	public End(): token.Pos {
		const s = this
		if (s.EndPos != 0) {
			return s.EndPos
		}
		return s.Path!.End()
	}

	// specNode() ensures that only spec nodes can be
	// assigned to a Spec.
	public specNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ImportSpec',
	  new ImportSpec(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "specNode", args: [], returns: [] }],
	  ImportSpec,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Name": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "Path": { kind: $.TypeKind.Pointer, elemType: "BasicLit" }, "Comment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "EndPos": "Pos"}
	);
}

// An InterfaceType node represents an interface type.
export class InterfaceType {
	// position of "interface" keyword
	public get Interface(): token.Pos {
		return this._fields.Interface.value
	}
	public set Interface(value: token.Pos) {
		this._fields.Interface.value = value
	}

	// list of embedded interfaces, methods, or types
	public get Methods(): FieldList | null {
		return this._fields.Methods.value
	}
	public set Methods(value: FieldList | null) {
		this._fields.Methods.value = value
	}

	// true if (source) methods or types are missing in the Methods list
	public get Incomplete(): boolean {
		return this._fields.Incomplete.value
	}
	public set Incomplete(value: boolean) {
		this._fields.Incomplete.value = value
	}

	public _fields: {
		Interface: $.VarRef<token.Pos>;
		Methods: $.VarRef<FieldList | null>;
		Incomplete: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{Incomplete?: boolean, Interface?: token.Pos, Methods?: FieldList | null}>) {
		this._fields = {
			Interface: $.varRef(init?.Interface ?? 0 as token.Pos),
			Methods: $.varRef(init?.Methods ?? null),
			Incomplete: $.varRef(init?.Incomplete ?? false)
		}
	}

	public clone(): InterfaceType {
		const cloned = new InterfaceType()
		cloned._fields = {
			Interface: $.varRef(this._fields.Interface.value),
			Methods: $.varRef(this._fields.Methods.value ? $.markAsStructValue(this._fields.Methods.value.clone()) : null),
			Incomplete: $.varRef(this._fields.Incomplete.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Interface
	}

	public End(): token.Pos {
		const x = this
		return x.Methods!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'InterfaceType',
	  new InterfaceType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  InterfaceType,
	  {"Interface": "Pos", "Methods": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Incomplete": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

export type Node = null | {
	// position of first character immediately after the node
	End(): token.Pos
	// position of first character belonging to the node
	Pos(): token.Pos
}

$.registerInterfaceType(
  'Node',
  null, // Zero value for interface is null
  [{ name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "Pos", args: [], returns: [{ type: "Pos" }] }]
);

export class Package {
	// package name
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	// package scope across all files
	public get Scope(): Scope | null {
		return this._fields.Scope.value
	}
	public set Scope(value: Scope | null) {
		this._fields.Scope.value = value
	}

	// map of package id -> package object
	public get Imports(): Map<string, Object | null> | null {
		return this._fields.Imports.value
	}
	public set Imports(value: Map<string, Object | null> | null) {
		this._fields.Imports.value = value
	}

	// Go source files by filename
	public get Files(): Map<string, File | null> | null {
		return this._fields.Files.value
	}
	public set Files(value: Map<string, File | null> | null) {
		this._fields.Files.value = value
	}

	public _fields: {
		Name: $.VarRef<string>;
		Scope: $.VarRef<Scope | null>;
		Imports: $.VarRef<Map<string, Object | null> | null>;
		Files: $.VarRef<Map<string, File | null> | null>;
	}

	constructor(init?: Partial<{Files?: Map<string, File | null> | null, Imports?: Map<string, Object | null> | null, Name?: string, Scope?: Scope | null}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Scope: $.varRef(init?.Scope ?? null),
			Imports: $.varRef(init?.Imports ?? null),
			Files: $.varRef(init?.Files ?? null)
		}
	}

	public clone(): Package {
		const cloned = new Package()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Scope: $.varRef(this._fields.Scope.value ? $.markAsStructValue(this._fields.Scope.value.clone()) : null),
			Imports: $.varRef(this._fields.Imports.value),
			Files: $.varRef(this._fields.Files.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		return token.NoPos
	}

	public End(): token.Pos {
		return token.NoPos
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Package',
	  new Package(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }],
	  Package,
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Scope": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "Imports": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "Object" } }, "Files": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "File" } }}
	);
}

// A SelectStmt node represents a select statement.
export class SelectStmt {
	// position of "select" keyword
	public get Select(): token.Pos {
		return this._fields.Select.value
	}
	public set Select(value: token.Pos) {
		this._fields.Select.value = value
	}

	// CommClauses only
	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		Select: $.VarRef<token.Pos>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Select?: token.Pos}>) {
		this._fields = {
			Select: $.varRef(init?.Select ?? 0 as token.Pos),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): SelectStmt {
		const cloned = new SelectStmt()
		cloned._fields = {
			Select: $.varRef(this._fields.Select.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Select
	}

	public End(): token.Pos {
		const s = this
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SelectStmt',
	  new SelectStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  SelectStmt,
	  {"Select": "Pos", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// The Spec type stands for any of *ImportSpec, *ValueSpec, and *TypeSpec.
export type Spec = null | {
	specNode(): void
} & Node

$.registerInterfaceType(
  'Spec',
  null, // Zero value for interface is null
  [{ name: "specNode", args: [], returns: [] }]
);

export type Stmt = null | {
	stmtNode(): void
} & Node

$.registerInterfaceType(
  'Stmt',
  null, // Zero value for interface is null
  [{ name: "stmtNode", args: [], returns: [] }]
);

// A StructType node represents a struct type.
export class StructType {
	// position of "struct" keyword
	public get Struct(): token.Pos {
		return this._fields.Struct.value
	}
	public set Struct(value: token.Pos) {
		this._fields.Struct.value = value
	}

	// list of field declarations
	public get Fields(): FieldList | null {
		return this._fields.Fields.value
	}
	public set Fields(value: FieldList | null) {
		this._fields.Fields.value = value
	}

	// true if (source) fields are missing in the Fields list
	public get Incomplete(): boolean {
		return this._fields.Incomplete.value
	}
	public set Incomplete(value: boolean) {
		this._fields.Incomplete.value = value
	}

	public _fields: {
		Struct: $.VarRef<token.Pos>;
		Fields: $.VarRef<FieldList | null>;
		Incomplete: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{Fields?: FieldList | null, Incomplete?: boolean, Struct?: token.Pos}>) {
		this._fields = {
			Struct: $.varRef(init?.Struct ?? 0 as token.Pos),
			Fields: $.varRef(init?.Fields ?? null),
			Incomplete: $.varRef(init?.Incomplete ?? false)
		}
	}

	public clone(): StructType {
		const cloned = new StructType()
		cloned._fields = {
			Struct: $.varRef(this._fields.Struct.value),
			Fields: $.varRef(this._fields.Fields.value ? $.markAsStructValue(this._fields.Fields.value.clone()) : null),
			Incomplete: $.varRef(this._fields.Incomplete.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Struct
	}

	public End(): token.Pos {
		const x = this
		return x.Fields!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'StructType',
	  new StructType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  StructType,
	  {"Struct": "Pos", "Fields": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Incomplete": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

// A DeclStmt node represents a declaration in a statement list.
export class DeclStmt {
	// *GenDecl with CONST, TYPE, or VAR token
	public get Decl(): Decl {
		return this._fields.Decl.value
	}
	public set Decl(value: Decl) {
		this._fields.Decl.value = value
	}

	public _fields: {
		Decl: $.VarRef<Decl>;
	}

	constructor(init?: Partial<{Decl?: Decl}>) {
		this._fields = {
			Decl: $.varRef(init?.Decl ?? null)
		}
	}

	public clone(): DeclStmt {
		const cloned = new DeclStmt()
		cloned._fields = {
			Decl: $.varRef(this._fields.Decl.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Decl!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.Decl!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'DeclStmt',
	  new DeclStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  DeclStmt,
	  {"Decl": "Decl"}
	);
}

export class File {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// position of "package" keyword
	public get Package(): token.Pos {
		return this._fields.Package.value
	}
	public set Package(value: token.Pos) {
		this._fields.Package.value = value
	}

	// package name
	public get Name(): Ident | null {
		return this._fields.Name.value
	}
	public set Name(value: Ident | null) {
		this._fields.Name.value = value
	}

	// top-level declarations; or nil
	public get Decls(): $.Slice<Decl> {
		return this._fields.Decls.value
	}
	public set Decls(value: $.Slice<Decl>) {
		this._fields.Decls.value = value
	}

	// start and end of entire file
	public get FileStart(): token.Pos {
		return this._fields.FileStart.value
	}
	public set FileStart(value: token.Pos) {
		this._fields.FileStart.value = value
	}

	// start and end of entire file
	public get FileEnd(): token.Pos {
		return this._fields.FileEnd.value
	}
	public set FileEnd(value: token.Pos) {
		this._fields.FileEnd.value = value
	}

	// package scope (this file only). Deprecated: see Object
	public get Scope(): Scope | null {
		return this._fields.Scope.value
	}
	public set Scope(value: Scope | null) {
		this._fields.Scope.value = value
	}

	// imports in this file
	public get Imports(): $.Slice<ImportSpec | null> {
		return this._fields.Imports.value
	}
	public set Imports(value: $.Slice<ImportSpec | null>) {
		this._fields.Imports.value = value
	}

	// unresolved identifiers in this file. Deprecated: see Object
	public get Unresolved(): $.Slice<Ident | null> {
		return this._fields.Unresolved.value
	}
	public set Unresolved(value: $.Slice<Ident | null>) {
		this._fields.Unresolved.value = value
	}

	// list of all comments in the source file
	public get Comments(): $.Slice<CommentGroup | null> {
		return this._fields.Comments.value
	}
	public set Comments(value: $.Slice<CommentGroup | null>) {
		this._fields.Comments.value = value
	}

	// minimum Go version required by //go:build or // +build directives
	public get GoVersion(): string {
		return this._fields.GoVersion.value
	}
	public set GoVersion(value: string) {
		this._fields.GoVersion.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Package: $.VarRef<token.Pos>;
		Name: $.VarRef<Ident | null>;
		Decls: $.VarRef<$.Slice<Decl>>;
		FileStart: $.VarRef<token.Pos>;
		FileEnd: $.VarRef<token.Pos>;
		Scope: $.VarRef<Scope | null>;
		Imports: $.VarRef<$.Slice<ImportSpec | null>>;
		Unresolved: $.VarRef<$.Slice<Ident | null>>;
		Comments: $.VarRef<$.Slice<CommentGroup | null>>;
		GoVersion: $.VarRef<string>;
	}

	constructor(init?: Partial<{Comments?: $.Slice<CommentGroup | null>, Decls?: $.Slice<Decl>, Doc?: CommentGroup | null, FileEnd?: token.Pos, FileStart?: token.Pos, GoVersion?: string, Imports?: $.Slice<ImportSpec | null>, Name?: Ident | null, Package?: token.Pos, Scope?: Scope | null, Unresolved?: $.Slice<Ident | null>}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Package: $.varRef(init?.Package ?? 0 as token.Pos),
			Name: $.varRef(init?.Name ?? null),
			Decls: $.varRef(init?.Decls ?? null),
			FileStart: $.varRef(init?.FileStart ?? 0 as token.Pos),
			FileEnd: $.varRef(init?.FileEnd ?? 0 as token.Pos),
			Scope: $.varRef(init?.Scope ?? null),
			Imports: $.varRef(init?.Imports ?? null),
			Unresolved: $.varRef(init?.Unresolved ?? null),
			Comments: $.varRef(init?.Comments ?? null),
			GoVersion: $.varRef(init?.GoVersion ?? "")
		}
	}

	public clone(): File {
		const cloned = new File()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Package: $.varRef(this._fields.Package.value),
			Name: $.varRef(this._fields.Name.value ? $.markAsStructValue(this._fields.Name.value.clone()) : null),
			Decls: $.varRef(this._fields.Decls.value),
			FileStart: $.varRef(this._fields.FileStart.value),
			FileEnd: $.varRef(this._fields.FileEnd.value),
			Scope: $.varRef(this._fields.Scope.value ? $.markAsStructValue(this._fields.Scope.value.clone()) : null),
			Imports: $.varRef(this._fields.Imports.value),
			Unresolved: $.varRef(this._fields.Unresolved.value),
			Comments: $.varRef(this._fields.Comments.value),
			GoVersion: $.varRef(this._fields.GoVersion.value)
		}
		return cloned
	}

	// Pos returns the position of the package declaration.
	// It may be invalid, for example in an empty file.
	//
	// (Use FileStart for the start of the entire file. It is always valid.)
	public Pos(): token.Pos {
		const f = this
		return f.Package
	}

	// End returns the end of the last declaration in the file.
	// It may be invalid, for example in an empty file.
	//
	// (Use FileEnd for the end of the entire file. It is always valid.)
	public End(): token.Pos {
		const f = this
		{
			let n = $.len(f.Decls)
			if (n > 0) {
				return f.Decls![n - 1]!.End()
			}
		}
		return f.Name!.End()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'File',
	  new File(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }],
	  File,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Package": "Pos", "Name": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "Decls": { kind: $.TypeKind.Slice, elemType: "Decl" }, "FileStart": "Pos", "FileEnd": "Pos", "Scope": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "Imports": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "ImportSpec" } }, "Unresolved": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, "Comments": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, "GoVersion": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

// An ArrayType node represents an array or slice type.
export class ArrayType {
	// position of "["
	public get Lbrack(): token.Pos {
		return this._fields.Lbrack.value
	}
	public set Lbrack(value: token.Pos) {
		this._fields.Lbrack.value = value
	}

	// Ellipsis node for [...]T array types, nil for slice types
	public get Len(): Expr {
		return this._fields.Len.value
	}
	public set Len(value: Expr) {
		this._fields.Len.value = value
	}

	// element type
	public get Elt(): Expr {
		return this._fields.Elt.value
	}
	public set Elt(value: Expr) {
		this._fields.Elt.value = value
	}

	public _fields: {
		Lbrack: $.VarRef<token.Pos>;
		Len: $.VarRef<Expr>;
		Elt: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Elt?: Expr, Lbrack?: token.Pos, Len?: Expr}>) {
		this._fields = {
			Lbrack: $.varRef(init?.Lbrack ?? 0 as token.Pos),
			Len: $.varRef(init?.Len ?? null),
			Elt: $.varRef(init?.Elt ?? null)
		}
	}

	public clone(): ArrayType {
		const cloned = new ArrayType()
		cloned._fields = {
			Lbrack: $.varRef(this._fields.Lbrack.value),
			Len: $.varRef(this._fields.Len.value),
			Elt: $.varRef(this._fields.Elt.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Lbrack
	}

	public End(): token.Pos {
		const x = this
		return x.Elt!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ArrayType',
	  new ArrayType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  ArrayType,
	  {"Lbrack": "Pos", "Len": "Expr", "Elt": "Expr"}
	);
}

// An AssignStmt node represents an assignment or
// a short variable declaration.
//
export class AssignStmt {
	public get Lhs(): $.Slice<Expr> {
		return this._fields.Lhs.value
	}
	public set Lhs(value: $.Slice<Expr>) {
		this._fields.Lhs.value = value
	}

	// position of Tok
	public get TokPos(): token.Pos {
		return this._fields.TokPos.value
	}
	public set TokPos(value: token.Pos) {
		this._fields.TokPos.value = value
	}

	// assignment token, DEFINE
	public get Tok(): token.Token {
		return this._fields.Tok.value
	}
	public set Tok(value: token.Token) {
		this._fields.Tok.value = value
	}

	public get Rhs(): $.Slice<Expr> {
		return this._fields.Rhs.value
	}
	public set Rhs(value: $.Slice<Expr>) {
		this._fields.Rhs.value = value
	}

	public _fields: {
		Lhs: $.VarRef<$.Slice<Expr>>;
		TokPos: $.VarRef<token.Pos>;
		Tok: $.VarRef<token.Token>;
		Rhs: $.VarRef<$.Slice<Expr>>;
	}

	constructor(init?: Partial<{Lhs?: $.Slice<Expr>, Rhs?: $.Slice<Expr>, Tok?: token.Token, TokPos?: token.Pos}>) {
		this._fields = {
			Lhs: $.varRef(init?.Lhs ?? null),
			TokPos: $.varRef(init?.TokPos ?? 0 as token.Pos),
			Tok: $.varRef(init?.Tok ?? 0 as token.Token),
			Rhs: $.varRef(init?.Rhs ?? null)
		}
	}

	public clone(): AssignStmt {
		const cloned = new AssignStmt()
		cloned._fields = {
			Lhs: $.varRef(this._fields.Lhs.value),
			TokPos: $.varRef(this._fields.TokPos.value),
			Tok: $.varRef(this._fields.Tok.value),
			Rhs: $.varRef(this._fields.Rhs.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Lhs![0]!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.Rhs![$.len(s.Rhs) - 1]!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'AssignStmt',
	  new AssignStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  AssignStmt,
	  {"Lhs": { kind: $.TypeKind.Slice, elemType: "Expr" }, "TokPos": "Pos", "Tok": "Token", "Rhs": { kind: $.TypeKind.Slice, elemType: "Expr" }}
	);
}

// A BinaryExpr node represents a binary expression.
export class BinaryExpr {
	// left operand
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of Op
	public get OpPos(): token.Pos {
		return this._fields.OpPos.value
	}
	public set OpPos(value: token.Pos) {
		this._fields.OpPos.value = value
	}

	// operator
	public get Op(): token.Token {
		return this._fields.Op.value
	}
	public set Op(value: token.Token) {
		this._fields.Op.value = value
	}

	// right operand
	public get Y(): Expr {
		return this._fields.Y.value
	}
	public set Y(value: Expr) {
		this._fields.Y.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		OpPos: $.VarRef<token.Pos>;
		Op: $.VarRef<token.Token>;
		Y: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Op?: token.Token, OpPos?: token.Pos, X?: Expr, Y?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			OpPos: $.varRef(init?.OpPos ?? 0 as token.Pos),
			Op: $.varRef(init?.Op ?? 0 as token.Token),
			Y: $.varRef(init?.Y ?? null)
		}
	}

	public clone(): BinaryExpr {
		const cloned = new BinaryExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			OpPos: $.varRef(this._fields.OpPos.value),
			Op: $.varRef(this._fields.Op.value),
			Y: $.varRef(this._fields.Y.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Y!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BinaryExpr',
	  new BinaryExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  BinaryExpr,
	  {"X": "Expr", "OpPos": "Pos", "Op": "Token", "Y": "Expr"}
	);
}

// A CallExpr node represents an expression followed by an argument list.
export class CallExpr {
	// function expression
	public get Fun(): Expr {
		return this._fields.Fun.value
	}
	public set Fun(value: Expr) {
		this._fields.Fun.value = value
	}

	// position of "("
	public get Lparen(): token.Pos {
		return this._fields.Lparen.value
	}
	public set Lparen(value: token.Pos) {
		this._fields.Lparen.value = value
	}

	// function arguments; or nil
	public get Args(): $.Slice<Expr> {
		return this._fields.Args.value
	}
	public set Args(value: $.Slice<Expr>) {
		this._fields.Args.value = value
	}

	// position of "..." (token.NoPos if there is no "...")
	public get Ellipsis(): token.Pos {
		return this._fields.Ellipsis.value
	}
	public set Ellipsis(value: token.Pos) {
		this._fields.Ellipsis.value = value
	}

	// position of ")"
	public get Rparen(): token.Pos {
		return this._fields.Rparen.value
	}
	public set Rparen(value: token.Pos) {
		this._fields.Rparen.value = value
	}

	public _fields: {
		Fun: $.VarRef<Expr>;
		Lparen: $.VarRef<token.Pos>;
		Args: $.VarRef<$.Slice<Expr>>;
		Ellipsis: $.VarRef<token.Pos>;
		Rparen: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Args?: $.Slice<Expr>, Ellipsis?: token.Pos, Fun?: Expr, Lparen?: token.Pos, Rparen?: token.Pos}>) {
		this._fields = {
			Fun: $.varRef(init?.Fun ?? null),
			Lparen: $.varRef(init?.Lparen ?? 0 as token.Pos),
			Args: $.varRef(init?.Args ?? null),
			Ellipsis: $.varRef(init?.Ellipsis ?? 0 as token.Pos),
			Rparen: $.varRef(init?.Rparen ?? 0 as token.Pos)
		}
	}

	public clone(): CallExpr {
		const cloned = new CallExpr()
		cloned._fields = {
			Fun: $.varRef(this._fields.Fun.value),
			Lparen: $.varRef(this._fields.Lparen.value),
			Args: $.varRef(this._fields.Args.value),
			Ellipsis: $.varRef(this._fields.Ellipsis.value),
			Rparen: $.varRef(this._fields.Rparen.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Fun!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Rparen + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'CallExpr',
	  new CallExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  CallExpr,
	  {"Fun": "Expr", "Lparen": "Pos", "Args": { kind: $.TypeKind.Slice, elemType: "Expr" }, "Ellipsis": "Pos", "Rparen": "Pos"}
	);
}

// A ChanType node represents a channel type.
export class ChanType {
	// position of "chan" keyword or "<-" (whichever comes first)
	public get Begin(): token.Pos {
		return this._fields.Begin.value
	}
	public set Begin(value: token.Pos) {
		this._fields.Begin.value = value
	}

	// position of "<-" (token.NoPos if there is no "<-")
	public get Arrow(): token.Pos {
		return this._fields.Arrow.value
	}
	public set Arrow(value: token.Pos) {
		this._fields.Arrow.value = value
	}

	// channel direction
	public get Dir(): ChanDir {
		return this._fields.Dir.value
	}
	public set Dir(value: ChanDir) {
		this._fields.Dir.value = value
	}

	// value type
	public get Value(): Expr {
		return this._fields.Value.value
	}
	public set Value(value: Expr) {
		this._fields.Value.value = value
	}

	public _fields: {
		Begin: $.VarRef<token.Pos>;
		Arrow: $.VarRef<token.Pos>;
		Dir: $.VarRef<ChanDir>;
		Value: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Arrow?: token.Pos, Begin?: token.Pos, Dir?: ChanDir, Value?: Expr}>) {
		this._fields = {
			Begin: $.varRef(init?.Begin ?? 0 as token.Pos),
			Arrow: $.varRef(init?.Arrow ?? 0 as token.Pos),
			Dir: $.varRef(init?.Dir ?? new ChanDir(0)),
			Value: $.varRef(init?.Value ?? null)
		}
	}

	public clone(): ChanType {
		const cloned = new ChanType()
		cloned._fields = {
			Begin: $.varRef(this._fields.Begin.value),
			Arrow: $.varRef(this._fields.Arrow.value),
			Dir: $.varRef(this._fields.Dir.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Begin
	}

	public End(): token.Pos {
		const x = this
		return x.Value!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ChanType',
	  new ChanType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  ChanType,
	  {"Begin": "Pos", "Arrow": "Pos", "Dir": "ChanDir", "Value": "Expr"}
	);
}

// A CompositeLit node represents a composite literal.
export class CompositeLit {
	// literal type; or nil
	public get Type(): Expr {
		return this._fields.Type.value
	}
	public set Type(value: Expr) {
		this._fields.Type.value = value
	}

	// position of "{"
	public get Lbrace(): token.Pos {
		return this._fields.Lbrace.value
	}
	public set Lbrace(value: token.Pos) {
		this._fields.Lbrace.value = value
	}

	// list of composite elements; or nil
	public get Elts(): $.Slice<Expr> {
		return this._fields.Elts.value
	}
	public set Elts(value: $.Slice<Expr>) {
		this._fields.Elts.value = value
	}

	// position of "}"
	public get Rbrace(): token.Pos {
		return this._fields.Rbrace.value
	}
	public set Rbrace(value: token.Pos) {
		this._fields.Rbrace.value = value
	}

	// true if (source) expressions are missing in the Elts list
	public get Incomplete(): boolean {
		return this._fields.Incomplete.value
	}
	public set Incomplete(value: boolean) {
		this._fields.Incomplete.value = value
	}

	public _fields: {
		Type: $.VarRef<Expr>;
		Lbrace: $.VarRef<token.Pos>;
		Elts: $.VarRef<$.Slice<Expr>>;
		Rbrace: $.VarRef<token.Pos>;
		Incomplete: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{Elts?: $.Slice<Expr>, Incomplete?: boolean, Lbrace?: token.Pos, Rbrace?: token.Pos, Type?: Expr}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? null),
			Lbrace: $.varRef(init?.Lbrace ?? 0 as token.Pos),
			Elts: $.varRef(init?.Elts ?? null),
			Rbrace: $.varRef(init?.Rbrace ?? 0 as token.Pos),
			Incomplete: $.varRef(init?.Incomplete ?? false)
		}
	}

	public clone(): CompositeLit {
		const cloned = new CompositeLit()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Lbrace: $.varRef(this._fields.Lbrace.value),
			Elts: $.varRef(this._fields.Elts.value),
			Rbrace: $.varRef(this._fields.Rbrace.value),
			Incomplete: $.varRef(this._fields.Incomplete.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		if (x.Type != null) {
			return x.Type!.Pos()
		}
		return x.Lbrace
	}

	public End(): token.Pos {
		const x = this
		return x.Rbrace + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'CompositeLit',
	  new CompositeLit(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  CompositeLit,
	  {"Type": "Expr", "Lbrace": "Pos", "Elts": { kind: $.TypeKind.Slice, elemType: "Expr" }, "Rbrace": "Pos", "Incomplete": { kind: $.TypeKind.Basic, name: "boolean" }}
	);
}

// An Ellipsis node stands for the "..." type in a
// parameter list or the "..." length in an array type.
//
export class Ellipsis {
	// position of "..."
	public get Ellipsis(): token.Pos {
		return this._fields.Ellipsis.value
	}
	public set Ellipsis(value: token.Pos) {
		this._fields.Ellipsis.value = value
	}

	// ellipsis element type (parameter lists only); or nil
	public get Elt(): Expr {
		return this._fields.Elt.value
	}
	public set Elt(value: Expr) {
		this._fields.Elt.value = value
	}

	public _fields: {
		Ellipsis: $.VarRef<token.Pos>;
		Elt: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Ellipsis?: token.Pos, Elt?: Expr}>) {
		this._fields = {
			Ellipsis: $.varRef(init?.Ellipsis ?? 0 as token.Pos),
			Elt: $.varRef(init?.Elt ?? null)
		}
	}

	public clone(): Ellipsis {
		const cloned = new Ellipsis()
		cloned._fields = {
			Ellipsis: $.varRef(this._fields.Ellipsis.value),
			Elt: $.varRef(this._fields.Elt.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Ellipsis
	}

	public End(): token.Pos {
		const x = this
		if (x.Elt != null) {
			return x.Elt!.End()
		}
		return x.Ellipsis + 3
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Ellipsis',
	  new Ellipsis(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  Ellipsis,
	  {"Ellipsis": "Pos", "Elt": "Expr"}
	);
}

// An ExprStmt node represents a (stand-alone) expression
// in a statement list.
//
export class ExprStmt {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null)
		}
	}

	public clone(): ExprStmt {
		const cloned = new ExprStmt()
		cloned._fields = {
			X: $.varRef(this._fields.X.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.X!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.X!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ExprStmt',
	  new ExprStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  ExprStmt,
	  {"X": "Expr"}
	);
}

export class Field {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// field/method/(type) parameter names; or nil
	public get Names(): $.Slice<Ident | null> {
		return this._fields.Names.value
	}
	public set Names(value: $.Slice<Ident | null>) {
		this._fields.Names.value = value
	}

	// field/method/parameter type; or nil
	public get Type(): Expr {
		return this._fields.Type.value
	}
	public set Type(value: Expr) {
		this._fields.Type.value = value
	}

	// field tag; or nil
	public get Tag(): BasicLit | null {
		return this._fields.Tag.value
	}
	public set Tag(value: BasicLit | null) {
		this._fields.Tag.value = value
	}

	// line comments; or nil
	public get Comment(): CommentGroup | null {
		return this._fields.Comment.value
	}
	public set Comment(value: CommentGroup | null) {
		this._fields.Comment.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Names: $.VarRef<$.Slice<Ident | null>>;
		Type: $.VarRef<Expr>;
		Tag: $.VarRef<BasicLit | null>;
		Comment: $.VarRef<CommentGroup | null>;
	}

	constructor(init?: Partial<{Comment?: CommentGroup | null, Doc?: CommentGroup | null, Names?: $.Slice<Ident | null>, Tag?: BasicLit | null, Type?: Expr}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Names: $.varRef(init?.Names ?? null),
			Type: $.varRef(init?.Type ?? null),
			Tag: $.varRef(init?.Tag ?? null),
			Comment: $.varRef(init?.Comment ?? null)
		}
	}

	public clone(): Field {
		const cloned = new Field()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Names: $.varRef(this._fields.Names.value),
			Type: $.varRef(this._fields.Type.value),
			Tag: $.varRef(this._fields.Tag.value ? $.markAsStructValue(this._fields.Tag.value.clone()) : null),
			Comment: $.varRef(this._fields.Comment.value ? $.markAsStructValue(this._fields.Comment.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const f = this
		if ($.len(f.Names) > 0) {
			return f.Names![0]!.Pos()
		}
		if (f.Type != null) {
			return f.Type!.Pos()
		}
		return token.NoPos
	}

	public End(): token.Pos {
		const f = this
		if (f.Tag != null) {
			return f.Tag!.End()
		}
		if (f.Type != null) {
			return f.Type!.End()
		}
		if ($.len(f.Names) > 0) {
			return f.Names![$.len(f.Names) - 1]!.End()
		}
		return token.NoPos
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Field',
	  new Field(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }],
	  Field,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Names": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, "Type": "Expr", "Tag": { kind: $.TypeKind.Pointer, elemType: "BasicLit" }, "Comment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }}
	);
}

// An IncDecStmt node represents an increment or decrement statement.
export class IncDecStmt {
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of Tok
	public get TokPos(): token.Pos {
		return this._fields.TokPos.value
	}
	public set TokPos(value: token.Pos) {
		this._fields.TokPos.value = value
	}

	// INC or DEC
	public get Tok(): token.Token {
		return this._fields.Tok.value
	}
	public set Tok(value: token.Token) {
		this._fields.Tok.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		TokPos: $.VarRef<token.Pos>;
		Tok: $.VarRef<token.Token>;
	}

	constructor(init?: Partial<{Tok?: token.Token, TokPos?: token.Pos, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			TokPos: $.varRef(init?.TokPos ?? 0 as token.Pos),
			Tok: $.varRef(init?.Tok ?? 0 as token.Token)
		}
	}

	public clone(): IncDecStmt {
		const cloned = new IncDecStmt()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			TokPos: $.varRef(this._fields.TokPos.value),
			Tok: $.varRef(this._fields.Tok.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.X!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.TokPos + 2
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'IncDecStmt',
	  new IncDecStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  IncDecStmt,
	  {"X": "Expr", "TokPos": "Pos", "Tok": "Token"}
	);
}

// An IndexExpr node represents an expression followed by an index.
export class IndexExpr {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of "["
	public get Lbrack(): token.Pos {
		return this._fields.Lbrack.value
	}
	public set Lbrack(value: token.Pos) {
		this._fields.Lbrack.value = value
	}

	// index expression
	public get Index(): Expr {
		return this._fields.Index.value
	}
	public set Index(value: Expr) {
		this._fields.Index.value = value
	}

	// position of "]"
	public get Rbrack(): token.Pos {
		return this._fields.Rbrack.value
	}
	public set Rbrack(value: token.Pos) {
		this._fields.Rbrack.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Lbrack: $.VarRef<token.Pos>;
		Index: $.VarRef<Expr>;
		Rbrack: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Index?: Expr, Lbrack?: token.Pos, Rbrack?: token.Pos, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Lbrack: $.varRef(init?.Lbrack ?? 0 as token.Pos),
			Index: $.varRef(init?.Index ?? null),
			Rbrack: $.varRef(init?.Rbrack ?? 0 as token.Pos)
		}
	}

	public clone(): IndexExpr {
		const cloned = new IndexExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Lbrack: $.varRef(this._fields.Lbrack.value),
			Index: $.varRef(this._fields.Index.value),
			Rbrack: $.varRef(this._fields.Rbrack.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Rbrack + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'IndexExpr',
	  new IndexExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  IndexExpr,
	  {"X": "Expr", "Lbrack": "Pos", "Index": "Expr", "Rbrack": "Pos"}
	);
}

// An IndexListExpr node represents an expression followed by multiple
// indices.
export class IndexListExpr {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of "["
	public get Lbrack(): token.Pos {
		return this._fields.Lbrack.value
	}
	public set Lbrack(value: token.Pos) {
		this._fields.Lbrack.value = value
	}

	// index expressions
	public get Indices(): $.Slice<Expr> {
		return this._fields.Indices.value
	}
	public set Indices(value: $.Slice<Expr>) {
		this._fields.Indices.value = value
	}

	// position of "]"
	public get Rbrack(): token.Pos {
		return this._fields.Rbrack.value
	}
	public set Rbrack(value: token.Pos) {
		this._fields.Rbrack.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Lbrack: $.VarRef<token.Pos>;
		Indices: $.VarRef<$.Slice<Expr>>;
		Rbrack: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Indices?: $.Slice<Expr>, Lbrack?: token.Pos, Rbrack?: token.Pos, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Lbrack: $.varRef(init?.Lbrack ?? 0 as token.Pos),
			Indices: $.varRef(init?.Indices ?? null),
			Rbrack: $.varRef(init?.Rbrack ?? 0 as token.Pos)
		}
	}

	public clone(): IndexListExpr {
		const cloned = new IndexListExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Lbrack: $.varRef(this._fields.Lbrack.value),
			Indices: $.varRef(this._fields.Indices.value),
			Rbrack: $.varRef(this._fields.Rbrack.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Rbrack + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'IndexListExpr',
	  new IndexListExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  IndexListExpr,
	  {"X": "Expr", "Lbrack": "Pos", "Indices": { kind: $.TypeKind.Slice, elemType: "Expr" }, "Rbrack": "Pos"}
	);
}

// A KeyValueExpr node represents (key : value) pairs
// in composite literals.
//
export class KeyValueExpr {
	public get Key(): Expr {
		return this._fields.Key.value
	}
	public set Key(value: Expr) {
		this._fields.Key.value = value
	}

	// position of ":"
	public get Colon(): token.Pos {
		return this._fields.Colon.value
	}
	public set Colon(value: token.Pos) {
		this._fields.Colon.value = value
	}

	public get Value(): Expr {
		return this._fields.Value.value
	}
	public set Value(value: Expr) {
		this._fields.Value.value = value
	}

	public _fields: {
		Key: $.VarRef<Expr>;
		Colon: $.VarRef<token.Pos>;
		Value: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Colon?: token.Pos, Key?: Expr, Value?: Expr}>) {
		this._fields = {
			Key: $.varRef(init?.Key ?? null),
			Colon: $.varRef(init?.Colon ?? 0 as token.Pos),
			Value: $.varRef(init?.Value ?? null)
		}
	}

	public clone(): KeyValueExpr {
		const cloned = new KeyValueExpr()
		cloned._fields = {
			Key: $.varRef(this._fields.Key.value),
			Colon: $.varRef(this._fields.Colon.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Key!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Value!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'KeyValueExpr',
	  new KeyValueExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  KeyValueExpr,
	  {"Key": "Expr", "Colon": "Pos", "Value": "Expr"}
	);
}

// A MapType node represents a map type.
export class MapType {
	// position of "map" keyword
	public get Map(): token.Pos {
		return this._fields.Map.value
	}
	public set Map(value: token.Pos) {
		this._fields.Map.value = value
	}

	public get Key(): Expr {
		return this._fields.Key.value
	}
	public set Key(value: Expr) {
		this._fields.Key.value = value
	}

	public get Value(): Expr {
		return this._fields.Value.value
	}
	public set Value(value: Expr) {
		this._fields.Value.value = value
	}

	public _fields: {
		Map: $.VarRef<token.Pos>;
		Key: $.VarRef<Expr>;
		Value: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Key?: Expr, Map?: token.Pos, Value?: Expr}>) {
		this._fields = {
			Map: $.varRef(init?.Map ?? 0 as token.Pos),
			Key: $.varRef(init?.Key ?? null),
			Value: $.varRef(init?.Value ?? null)
		}
	}

	public clone(): MapType {
		const cloned = new MapType()
		cloned._fields = {
			Map: $.varRef(this._fields.Map.value),
			Key: $.varRef(this._fields.Key.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Map
	}

	public End(): token.Pos {
		const x = this
		return x.Value!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'MapType',
	  new MapType(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  MapType,
	  {"Map": "Pos", "Key": "Expr", "Value": "Expr"}
	);
}

// A ParenExpr node represents a parenthesized expression.
export class ParenExpr {
	// position of "("
	public get Lparen(): token.Pos {
		return this._fields.Lparen.value
	}
	public set Lparen(value: token.Pos) {
		this._fields.Lparen.value = value
	}

	// parenthesized expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of ")"
	public get Rparen(): token.Pos {
		return this._fields.Rparen.value
	}
	public set Rparen(value: token.Pos) {
		this._fields.Rparen.value = value
	}

	public _fields: {
		Lparen: $.VarRef<token.Pos>;
		X: $.VarRef<Expr>;
		Rparen: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Lparen?: token.Pos, Rparen?: token.Pos, X?: Expr}>) {
		this._fields = {
			Lparen: $.varRef(init?.Lparen ?? 0 as token.Pos),
			X: $.varRef(init?.X ?? null),
			Rparen: $.varRef(init?.Rparen ?? 0 as token.Pos)
		}
	}

	public clone(): ParenExpr {
		const cloned = new ParenExpr()
		cloned._fields = {
			Lparen: $.varRef(this._fields.Lparen.value),
			X: $.varRef(this._fields.X.value),
			Rparen: $.varRef(this._fields.Rparen.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Lparen
	}

	public End(): token.Pos {
		const x = this
		return x.Rparen + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ParenExpr',
	  new ParenExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  ParenExpr,
	  {"Lparen": "Pos", "X": "Expr", "Rparen": "Pos"}
	);
}

// A RangeStmt represents a for statement with a range clause.
export class RangeStmt {
	// position of "for" keyword
	public get For(): token.Pos {
		return this._fields.For.value
	}
	public set For(value: token.Pos) {
		this._fields.For.value = value
	}

	// Key, Value may be nil
	public get Key(): Expr {
		return this._fields.Key.value
	}
	public set Key(value: Expr) {
		this._fields.Key.value = value
	}

	// Key, Value may be nil
	public get Value(): Expr {
		return this._fields.Value.value
	}
	public set Value(value: Expr) {
		this._fields.Value.value = value
	}

	// position of Tok; invalid if Key == nil
	public get TokPos(): token.Pos {
		return this._fields.TokPos.value
	}
	public set TokPos(value: token.Pos) {
		this._fields.TokPos.value = value
	}

	// ILLEGAL if Key == nil, ASSIGN, DEFINE
	public get Tok(): token.Token {
		return this._fields.Tok.value
	}
	public set Tok(value: token.Token) {
		this._fields.Tok.value = value
	}

	// position of "range" keyword
	public get Range(): token.Pos {
		return this._fields.Range.value
	}
	public set Range(value: token.Pos) {
		this._fields.Range.value = value
	}

	// value to range over
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		For: $.VarRef<token.Pos>;
		Key: $.VarRef<Expr>;
		Value: $.VarRef<Expr>;
		TokPos: $.VarRef<token.Pos>;
		Tok: $.VarRef<token.Token>;
		Range: $.VarRef<token.Pos>;
		X: $.VarRef<Expr>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, For?: token.Pos, Key?: Expr, Range?: token.Pos, Tok?: token.Token, TokPos?: token.Pos, Value?: Expr, X?: Expr}>) {
		this._fields = {
			For: $.varRef(init?.For ?? 0 as token.Pos),
			Key: $.varRef(init?.Key ?? null),
			Value: $.varRef(init?.Value ?? null),
			TokPos: $.varRef(init?.TokPos ?? 0 as token.Pos),
			Tok: $.varRef(init?.Tok ?? 0 as token.Token),
			Range: $.varRef(init?.Range ?? 0 as token.Pos),
			X: $.varRef(init?.X ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): RangeStmt {
		const cloned = new RangeStmt()
		cloned._fields = {
			For: $.varRef(this._fields.For.value),
			Key: $.varRef(this._fields.Key.value),
			Value: $.varRef(this._fields.Value.value),
			TokPos: $.varRef(this._fields.TokPos.value),
			Tok: $.varRef(this._fields.Tok.value),
			Range: $.varRef(this._fields.Range.value),
			X: $.varRef(this._fields.X.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.For
	}

	public End(): token.Pos {
		const s = this
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'RangeStmt',
	  new RangeStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  RangeStmt,
	  {"For": "Pos", "Key": "Expr", "Value": "Expr", "TokPos": "Pos", "Tok": "Token", "Range": "Pos", "X": "Expr", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// A ReturnStmt node represents a return statement.
export class ReturnStmt {
	// position of "return" keyword
	public get Return(): token.Pos {
		return this._fields.Return.value
	}
	public set Return(value: token.Pos) {
		this._fields.Return.value = value
	}

	// result expressions; or nil
	public get Results(): $.Slice<Expr> {
		return this._fields.Results.value
	}
	public set Results(value: $.Slice<Expr>) {
		this._fields.Results.value = value
	}

	public _fields: {
		Return: $.VarRef<token.Pos>;
		Results: $.VarRef<$.Slice<Expr>>;
	}

	constructor(init?: Partial<{Results?: $.Slice<Expr>, Return?: token.Pos}>) {
		this._fields = {
			Return: $.varRef(init?.Return ?? 0 as token.Pos),
			Results: $.varRef(init?.Results ?? null)
		}
	}

	public clone(): ReturnStmt {
		const cloned = new ReturnStmt()
		cloned._fields = {
			Return: $.varRef(this._fields.Return.value),
			Results: $.varRef(this._fields.Results.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Return
	}

	public End(): token.Pos {
		const s = this
		{
			let n = $.len(s.Results)
			if (n > 0) {
				return s.Results![n - 1]!.End()
			}
		}
		return s.Return + 6
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ReturnStmt',
	  new ReturnStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  ReturnStmt,
	  {"Return": "Pos", "Results": { kind: $.TypeKind.Slice, elemType: "Expr" }}
	);
}

// A SelectorExpr node represents an expression followed by a selector.
export class SelectorExpr {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// field selector
	public get Sel(): Ident | null {
		return this._fields.Sel.value
	}
	public set Sel(value: Ident | null) {
		this._fields.Sel.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Sel: $.VarRef<Ident | null>;
	}

	constructor(init?: Partial<{Sel?: Ident | null, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Sel: $.varRef(init?.Sel ?? null)
		}
	}

	public clone(): SelectorExpr {
		const cloned = new SelectorExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Sel: $.varRef(this._fields.Sel.value ? $.markAsStructValue(this._fields.Sel.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Sel!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SelectorExpr',
	  new SelectorExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  SelectorExpr,
	  {"X": "Expr", "Sel": { kind: $.TypeKind.Pointer, elemType: "Ident" }}
	);
}

// A SendStmt node represents a send statement.
export class SendStmt {
	public get Chan(): Expr {
		return this._fields.Chan.value
	}
	public set Chan(value: Expr) {
		this._fields.Chan.value = value
	}

	// position of "<-"
	public get Arrow(): token.Pos {
		return this._fields.Arrow.value
	}
	public set Arrow(value: token.Pos) {
		this._fields.Arrow.value = value
	}

	public get Value(): Expr {
		return this._fields.Value.value
	}
	public set Value(value: Expr) {
		this._fields.Value.value = value
	}

	public _fields: {
		Chan: $.VarRef<Expr>;
		Arrow: $.VarRef<token.Pos>;
		Value: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Arrow?: token.Pos, Chan?: Expr, Value?: Expr}>) {
		this._fields = {
			Chan: $.varRef(init?.Chan ?? null),
			Arrow: $.varRef(init?.Arrow ?? 0 as token.Pos),
			Value: $.varRef(init?.Value ?? null)
		}
	}

	public clone(): SendStmt {
		const cloned = new SendStmt()
		cloned._fields = {
			Chan: $.varRef(this._fields.Chan.value),
			Arrow: $.varRef(this._fields.Arrow.value),
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Chan!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.Value!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SendStmt',
	  new SendStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  SendStmt,
	  {"Chan": "Expr", "Arrow": "Pos", "Value": "Expr"}
	);
}

// A SliceExpr node represents an expression followed by slice indices.
export class SliceExpr {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of "["
	public get Lbrack(): token.Pos {
		return this._fields.Lbrack.value
	}
	public set Lbrack(value: token.Pos) {
		this._fields.Lbrack.value = value
	}

	// begin of slice range; or nil
	public get Low(): Expr {
		return this._fields.Low.value
	}
	public set Low(value: Expr) {
		this._fields.Low.value = value
	}

	// end of slice range; or nil
	public get High(): Expr {
		return this._fields.High.value
	}
	public set High(value: Expr) {
		this._fields.High.value = value
	}

	// maximum capacity of slice; or nil
	public get Max(): Expr {
		return this._fields.Max.value
	}
	public set Max(value: Expr) {
		this._fields.Max.value = value
	}

	// true if 3-index slice (2 colons present)
	public get Slice3(): boolean {
		return this._fields.Slice3.value
	}
	public set Slice3(value: boolean) {
		this._fields.Slice3.value = value
	}

	// position of "]"
	public get Rbrack(): token.Pos {
		return this._fields.Rbrack.value
	}
	public set Rbrack(value: token.Pos) {
		this._fields.Rbrack.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Lbrack: $.VarRef<token.Pos>;
		Low: $.VarRef<Expr>;
		High: $.VarRef<Expr>;
		Max: $.VarRef<Expr>;
		Slice3: $.VarRef<boolean>;
		Rbrack: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{High?: Expr, Lbrack?: token.Pos, Low?: Expr, Max?: Expr, Rbrack?: token.Pos, Slice3?: boolean, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Lbrack: $.varRef(init?.Lbrack ?? 0 as token.Pos),
			Low: $.varRef(init?.Low ?? null),
			High: $.varRef(init?.High ?? null),
			Max: $.varRef(init?.Max ?? null),
			Slice3: $.varRef(init?.Slice3 ?? false),
			Rbrack: $.varRef(init?.Rbrack ?? 0 as token.Pos)
		}
	}

	public clone(): SliceExpr {
		const cloned = new SliceExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Lbrack: $.varRef(this._fields.Lbrack.value),
			Low: $.varRef(this._fields.Low.value),
			High: $.varRef(this._fields.High.value),
			Max: $.varRef(this._fields.Max.value),
			Slice3: $.varRef(this._fields.Slice3.value),
			Rbrack: $.varRef(this._fields.Rbrack.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Rbrack + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SliceExpr',
	  new SliceExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  SliceExpr,
	  {"X": "Expr", "Lbrack": "Pos", "Low": "Expr", "High": "Expr", "Max": "Expr", "Slice3": { kind: $.TypeKind.Basic, name: "boolean" }, "Rbrack": "Pos"}
	);
}

// A StarExpr node represents an expression of the form "*" Expression.
// Semantically it could be a unary "*" expression, or a pointer type.
//
export class StarExpr {
	// position of "*"
	public get Star(): token.Pos {
		return this._fields.Star.value
	}
	public set Star(value: token.Pos) {
		this._fields.Star.value = value
	}

	// operand
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public _fields: {
		Star: $.VarRef<token.Pos>;
		X: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Star?: token.Pos, X?: Expr}>) {
		this._fields = {
			Star: $.varRef(init?.Star ?? 0 as token.Pos),
			X: $.varRef(init?.X ?? null)
		}
	}

	public clone(): StarExpr {
		const cloned = new StarExpr()
		cloned._fields = {
			Star: $.varRef(this._fields.Star.value),
			X: $.varRef(this._fields.X.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.Star
	}

	public End(): token.Pos {
		const x = this
		return x.X!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'StarExpr',
	  new StarExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  StarExpr,
	  {"Star": "Pos", "X": "Expr"}
	);
}

// A TypeAssertExpr node represents an expression followed by a
// type assertion.
//
export class TypeAssertExpr {
	// expression
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	// position of "("
	public get Lparen(): token.Pos {
		return this._fields.Lparen.value
	}
	public set Lparen(value: token.Pos) {
		this._fields.Lparen.value = value
	}

	// asserted type; nil means type switch X.(type)
	public get Type(): Expr {
		return this._fields.Type.value
	}
	public set Type(value: Expr) {
		this._fields.Type.value = value
	}

	// position of ")"
	public get Rparen(): token.Pos {
		return this._fields.Rparen.value
	}
	public set Rparen(value: token.Pos) {
		this._fields.Rparen.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Lparen: $.VarRef<token.Pos>;
		Type: $.VarRef<Expr>;
		Rparen: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Lparen?: token.Pos, Rparen?: token.Pos, Type?: Expr, X?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Lparen: $.varRef(init?.Lparen ?? 0 as token.Pos),
			Type: $.varRef(init?.Type ?? null),
			Rparen: $.varRef(init?.Rparen ?? 0 as token.Pos)
		}
	}

	public clone(): TypeAssertExpr {
		const cloned = new TypeAssertExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Lparen: $.varRef(this._fields.Lparen.value),
			Type: $.varRef(this._fields.Type.value),
			Rparen: $.varRef(this._fields.Rparen.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.X!.Pos()
	}

	public End(): token.Pos {
		const x = this
		return x.Rparen + 1
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'TypeAssertExpr',
	  new TypeAssertExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  TypeAssertExpr,
	  {"X": "Expr", "Lparen": "Pos", "Type": "Expr", "Rparen": "Pos"}
	);
}

// A TypeSpec node represents a type declaration (TypeSpec production).
export class TypeSpec {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// type name
	public get Name(): Ident | null {
		return this._fields.Name.value
	}
	public set Name(value: Ident | null) {
		this._fields.Name.value = value
	}

	// type parameters; or nil
	public get TypeParams(): FieldList | null {
		return this._fields.TypeParams.value
	}
	public set TypeParams(value: FieldList | null) {
		this._fields.TypeParams.value = value
	}

	// position of '=', if any
	public get Assign(): token.Pos {
		return this._fields.Assign.value
	}
	public set Assign(value: token.Pos) {
		this._fields.Assign.value = value
	}

	// *Ident, *ParenExpr, *SelectorExpr, *StarExpr, or any of the *XxxTypes
	public get Type(): Expr {
		return this._fields.Type.value
	}
	public set Type(value: Expr) {
		this._fields.Type.value = value
	}

	// line comments; or nil
	public get Comment(): CommentGroup | null {
		return this._fields.Comment.value
	}
	public set Comment(value: CommentGroup | null) {
		this._fields.Comment.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Name: $.VarRef<Ident | null>;
		TypeParams: $.VarRef<FieldList | null>;
		Assign: $.VarRef<token.Pos>;
		Type: $.VarRef<Expr>;
		Comment: $.VarRef<CommentGroup | null>;
	}

	constructor(init?: Partial<{Assign?: token.Pos, Comment?: CommentGroup | null, Doc?: CommentGroup | null, Name?: Ident | null, Type?: Expr, TypeParams?: FieldList | null}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Name: $.varRef(init?.Name ?? null),
			TypeParams: $.varRef(init?.TypeParams ?? null),
			Assign: $.varRef(init?.Assign ?? 0 as token.Pos),
			Type: $.varRef(init?.Type ?? null),
			Comment: $.varRef(init?.Comment ?? null)
		}
	}

	public clone(): TypeSpec {
		const cloned = new TypeSpec()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Name: $.varRef(this._fields.Name.value ? $.markAsStructValue(this._fields.Name.value.clone()) : null),
			TypeParams: $.varRef(this._fields.TypeParams.value ? $.markAsStructValue(this._fields.TypeParams.value.clone()) : null),
			Assign: $.varRef(this._fields.Assign.value),
			Type: $.varRef(this._fields.Type.value),
			Comment: $.varRef(this._fields.Comment.value ? $.markAsStructValue(this._fields.Comment.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Name!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.Type!.End()
	}

	public specNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'TypeSpec',
	  new TypeSpec(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "specNode", args: [], returns: [] }],
	  TypeSpec,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Name": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "TypeParams": { kind: $.TypeKind.Pointer, elemType: "FieldList" }, "Assign": "Pos", "Type": "Expr", "Comment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }}
	);
}

// A UnaryExpr node represents a unary expression.
// Unary "*" expressions are represented via StarExpr nodes.
//
export class UnaryExpr {
	// position of Op
	public get OpPos(): token.Pos {
		return this._fields.OpPos.value
	}
	public set OpPos(value: token.Pos) {
		this._fields.OpPos.value = value
	}

	// operator
	public get Op(): token.Token {
		return this._fields.Op.value
	}
	public set Op(value: token.Token) {
		this._fields.Op.value = value
	}

	// operand
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public _fields: {
		OpPos: $.VarRef<token.Pos>;
		Op: $.VarRef<token.Token>;
		X: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{Op?: token.Token, OpPos?: token.Pos, X?: Expr}>) {
		this._fields = {
			OpPos: $.varRef(init?.OpPos ?? 0 as token.Pos),
			Op: $.varRef(init?.Op ?? 0 as token.Token),
			X: $.varRef(init?.X ?? null)
		}
	}

	public clone(): UnaryExpr {
		const cloned = new UnaryExpr()
		cloned._fields = {
			OpPos: $.varRef(this._fields.OpPos.value),
			Op: $.varRef(this._fields.Op.value),
			X: $.varRef(this._fields.X.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const x = this
		return x.OpPos
	}

	public End(): token.Pos {
		const x = this
		return x.X!.End()
	}

	public exprNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'UnaryExpr',
	  new UnaryExpr(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "exprNode", args: [], returns: [] }],
	  UnaryExpr,
	  {"OpPos": "Pos", "Op": "Token", "X": "Expr"}
	);
}

// A ValueSpec node represents a constant or variable declaration
// (ConstSpec or VarSpec production).
//
export class ValueSpec {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// value names (len(Names) > 0)
	public get Names(): $.Slice<Ident | null> {
		return this._fields.Names.value
	}
	public set Names(value: $.Slice<Ident | null>) {
		this._fields.Names.value = value
	}

	// value type; or nil
	public get Type(): Expr {
		return this._fields.Type.value
	}
	public set Type(value: Expr) {
		this._fields.Type.value = value
	}

	// initial values; or nil
	public get Values(): $.Slice<Expr> {
		return this._fields.Values.value
	}
	public set Values(value: $.Slice<Expr>) {
		this._fields.Values.value = value
	}

	// line comments; or nil
	public get Comment(): CommentGroup | null {
		return this._fields.Comment.value
	}
	public set Comment(value: CommentGroup | null) {
		this._fields.Comment.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		Names: $.VarRef<$.Slice<Ident | null>>;
		Type: $.VarRef<Expr>;
		Values: $.VarRef<$.Slice<Expr>>;
		Comment: $.VarRef<CommentGroup | null>;
	}

	constructor(init?: Partial<{Comment?: CommentGroup | null, Doc?: CommentGroup | null, Names?: $.Slice<Ident | null>, Type?: Expr, Values?: $.Slice<Expr>}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			Names: $.varRef(init?.Names ?? null),
			Type: $.varRef(init?.Type ?? null),
			Values: $.varRef(init?.Values ?? null),
			Comment: $.varRef(init?.Comment ?? null)
		}
	}

	public clone(): ValueSpec {
		const cloned = new ValueSpec()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			Names: $.varRef(this._fields.Names.value),
			Type: $.varRef(this._fields.Type.value),
			Values: $.varRef(this._fields.Values.value),
			Comment: $.varRef(this._fields.Comment.value ? $.markAsStructValue(this._fields.Comment.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Names![0]!.Pos()
	}

	public End(): token.Pos {
		const s = this
		{
			let n = $.len(s.Values)
			if (n > 0) {
				return s.Values![n - 1]!.End()
			}
		}
		if (s.Type != null) {
			return s.Type!.End()
		}
		return s.Names![$.len(s.Names) - 1]!.End()
	}

	public specNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ValueSpec',
	  new ValueSpec(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "specNode", args: [], returns: [] }],
	  ValueSpec,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "Names": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, "Type": "Expr", "Values": { kind: $.TypeKind.Slice, elemType: "Expr" }, "Comment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }}
	);
}

// A GenDecl node (generic declaration node) represents an import,
// constant, type or variable declaration. A valid Lparen position
// (Lparen.IsValid()) indicates a parenthesized declaration.
//
// Relationship between Tok value and Specs element type:
//
//	token.IMPORT  *ImportSpec
//	token.CONST   *ValueSpec
//	token.TYPE    *TypeSpec
//	token.VAR     *ValueSpec
//
export class GenDecl {
	// associated documentation; or nil
	public get Doc(): CommentGroup | null {
		return this._fields.Doc.value
	}
	public set Doc(value: CommentGroup | null) {
		this._fields.Doc.value = value
	}

	// position of Tok
	public get TokPos(): token.Pos {
		return this._fields.TokPos.value
	}
	public set TokPos(value: token.Pos) {
		this._fields.TokPos.value = value
	}

	// IMPORT, CONST, TYPE, or VAR
	public get Tok(): token.Token {
		return this._fields.Tok.value
	}
	public set Tok(value: token.Token) {
		this._fields.Tok.value = value
	}

	// position of '(', if any
	public get Lparen(): token.Pos {
		return this._fields.Lparen.value
	}
	public set Lparen(value: token.Pos) {
		this._fields.Lparen.value = value
	}

	public get Specs(): $.Slice<Spec> {
		return this._fields.Specs.value
	}
	public set Specs(value: $.Slice<Spec>) {
		this._fields.Specs.value = value
	}

	// position of ')', if any
	public get Rparen(): token.Pos {
		return this._fields.Rparen.value
	}
	public set Rparen(value: token.Pos) {
		this._fields.Rparen.value = value
	}

	public _fields: {
		Doc: $.VarRef<CommentGroup | null>;
		TokPos: $.VarRef<token.Pos>;
		Tok: $.VarRef<token.Token>;
		Lparen: $.VarRef<token.Pos>;
		Specs: $.VarRef<$.Slice<Spec>>;
		Rparen: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Doc?: CommentGroup | null, Lparen?: token.Pos, Rparen?: token.Pos, Specs?: $.Slice<Spec>, Tok?: token.Token, TokPos?: token.Pos}>) {
		this._fields = {
			Doc: $.varRef(init?.Doc ?? null),
			TokPos: $.varRef(init?.TokPos ?? 0 as token.Pos),
			Tok: $.varRef(init?.Tok ?? 0 as token.Token),
			Lparen: $.varRef(init?.Lparen ?? 0 as token.Pos),
			Specs: $.varRef(init?.Specs ?? null),
			Rparen: $.varRef(init?.Rparen ?? 0 as token.Pos)
		}
	}

	public clone(): GenDecl {
		const cloned = new GenDecl()
		cloned._fields = {
			Doc: $.varRef(this._fields.Doc.value ? $.markAsStructValue(this._fields.Doc.value.clone()) : null),
			TokPos: $.varRef(this._fields.TokPos.value),
			Tok: $.varRef(this._fields.Tok.value),
			Lparen: $.varRef(this._fields.Lparen.value),
			Specs: $.varRef(this._fields.Specs.value),
			Rparen: $.varRef(this._fields.Rparen.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const d = this
		return d.TokPos
	}

	public End(): token.Pos {
		const d = this
		if (token.Pos_IsValid(d.Rparen)) {
			return d.Rparen + 1
		}
		return d.Specs![0]!.End()
	}

	public declNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'GenDecl',
	  new GenDecl(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "declNode", args: [], returns: [] }],
	  GenDecl,
	  {"Doc": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "TokPos": "Pos", "Tok": "Token", "Lparen": "Pos", "Specs": { kind: $.TypeKind.Slice, elemType: "Spec" }, "Rparen": "Pos"}
	);
}

// A BlockStmt node represents a braced statement list.
export class BlockStmt {
	// position of "{"
	public get Lbrace(): token.Pos {
		return this._fields.Lbrace.value
	}
	public set Lbrace(value: token.Pos) {
		this._fields.Lbrace.value = value
	}

	public get List(): $.Slice<Stmt> {
		return this._fields.List.value
	}
	public set List(value: $.Slice<Stmt>) {
		this._fields.List.value = value
	}

	// position of "}", if any (may be absent due to syntax error)
	public get Rbrace(): token.Pos {
		return this._fields.Rbrace.value
	}
	public set Rbrace(value: token.Pos) {
		this._fields.Rbrace.value = value
	}

	public _fields: {
		Lbrace: $.VarRef<token.Pos>;
		List: $.VarRef<$.Slice<Stmt>>;
		Rbrace: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{Lbrace?: token.Pos, List?: $.Slice<Stmt>, Rbrace?: token.Pos}>) {
		this._fields = {
			Lbrace: $.varRef(init?.Lbrace ?? 0 as token.Pos),
			List: $.varRef(init?.List ?? null),
			Rbrace: $.varRef(init?.Rbrace ?? 0 as token.Pos)
		}
	}

	public clone(): BlockStmt {
		const cloned = new BlockStmt()
		cloned._fields = {
			Lbrace: $.varRef(this._fields.Lbrace.value),
			List: $.varRef(this._fields.List.value),
			Rbrace: $.varRef(this._fields.Rbrace.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Lbrace
	}

	public End(): token.Pos {
		const s = this
		if (token.Pos_IsValid(s.Rbrace)) {
			return s.Rbrace + 1
		}
		{
			let n = $.len(s.List)
			if (n > 0) {
				return s.List![n - 1]!.End()
			}
		}
		return s.Lbrace + 1
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'BlockStmt',
	  new BlockStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  BlockStmt,
	  {"Lbrace": "Pos", "List": { kind: $.TypeKind.Slice, elemType: "Stmt" }, "Rbrace": "Pos"}
	);
}

// A CaseClause represents a case of an expression or type switch statement.
export class CaseClause {
	// position of "case" or "default" keyword
	public get Case(): token.Pos {
		return this._fields.Case.value
	}
	public set Case(value: token.Pos) {
		this._fields.Case.value = value
	}

	// list of expressions or types; nil means default case
	public get List(): $.Slice<Expr> {
		return this._fields.List.value
	}
	public set List(value: $.Slice<Expr>) {
		this._fields.List.value = value
	}

	// position of ":"
	public get Colon(): token.Pos {
		return this._fields.Colon.value
	}
	public set Colon(value: token.Pos) {
		this._fields.Colon.value = value
	}

	// statement list; or nil
	public get Body(): $.Slice<Stmt> {
		return this._fields.Body.value
	}
	public set Body(value: $.Slice<Stmt>) {
		this._fields.Body.value = value
	}

	public _fields: {
		Case: $.VarRef<token.Pos>;
		List: $.VarRef<$.Slice<Expr>>;
		Colon: $.VarRef<token.Pos>;
		Body: $.VarRef<$.Slice<Stmt>>;
	}

	constructor(init?: Partial<{Body?: $.Slice<Stmt>, Case?: token.Pos, Colon?: token.Pos, List?: $.Slice<Expr>}>) {
		this._fields = {
			Case: $.varRef(init?.Case ?? 0 as token.Pos),
			List: $.varRef(init?.List ?? null),
			Colon: $.varRef(init?.Colon ?? 0 as token.Pos),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): CaseClause {
		const cloned = new CaseClause()
		cloned._fields = {
			Case: $.varRef(this._fields.Case.value),
			List: $.varRef(this._fields.List.value),
			Colon: $.varRef(this._fields.Colon.value),
			Body: $.varRef(this._fields.Body.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Case
	}

	public End(): token.Pos {
		const s = this
		{
			let n = $.len(s.Body)
			if (n > 0) {
				return s.Body![n - 1]!.End()
			}
		}
		return s.Colon + 1
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'CaseClause',
	  new CaseClause(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  CaseClause,
	  {"Case": "Pos", "List": { kind: $.TypeKind.Slice, elemType: "Expr" }, "Colon": "Pos", "Body": { kind: $.TypeKind.Slice, elemType: "Stmt" }}
	);
}

// A CommClause node represents a case of a select statement.
export class CommClause {
	// position of "case" or "default" keyword
	public get Case(): token.Pos {
		return this._fields.Case.value
	}
	public set Case(value: token.Pos) {
		this._fields.Case.value = value
	}

	// send or receive statement; nil means default case
	public get Comm(): Stmt {
		return this._fields.Comm.value
	}
	public set Comm(value: Stmt) {
		this._fields.Comm.value = value
	}

	// position of ":"
	public get Colon(): token.Pos {
		return this._fields.Colon.value
	}
	public set Colon(value: token.Pos) {
		this._fields.Colon.value = value
	}

	// statement list; or nil
	public get Body(): $.Slice<Stmt> {
		return this._fields.Body.value
	}
	public set Body(value: $.Slice<Stmt>) {
		this._fields.Body.value = value
	}

	public _fields: {
		Case: $.VarRef<token.Pos>;
		Comm: $.VarRef<Stmt>;
		Colon: $.VarRef<token.Pos>;
		Body: $.VarRef<$.Slice<Stmt>>;
	}

	constructor(init?: Partial<{Body?: $.Slice<Stmt>, Case?: token.Pos, Colon?: token.Pos, Comm?: Stmt}>) {
		this._fields = {
			Case: $.varRef(init?.Case ?? 0 as token.Pos),
			Comm: $.varRef(init?.Comm ?? null),
			Colon: $.varRef(init?.Colon ?? 0 as token.Pos),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): CommClause {
		const cloned = new CommClause()
		cloned._fields = {
			Case: $.varRef(this._fields.Case.value),
			Comm: $.varRef(this._fields.Comm.value),
			Colon: $.varRef(this._fields.Colon.value),
			Body: $.varRef(this._fields.Body.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Case
	}

	public End(): token.Pos {
		const s = this
		{
			let n = $.len(s.Body)
			if (n > 0) {
				return s.Body![n - 1]!.End()
			}
		}
		return s.Colon + 1
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'CommClause',
	  new CommClause(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  CommClause,
	  {"Case": "Pos", "Comm": "Stmt", "Colon": "Pos", "Body": { kind: $.TypeKind.Slice, elemType: "Stmt" }}
	);
}

// A ForStmt represents a for statement.
export class ForStmt {
	// position of "for" keyword
	public get For(): token.Pos {
		return this._fields.For.value
	}
	public set For(value: token.Pos) {
		this._fields.For.value = value
	}

	// initialization statement; or nil
	public get Init(): Stmt {
		return this._fields.Init.value
	}
	public set Init(value: Stmt) {
		this._fields.Init.value = value
	}

	// condition; or nil
	public get Cond(): Expr {
		return this._fields.Cond.value
	}
	public set Cond(value: Expr) {
		this._fields.Cond.value = value
	}

	// post iteration statement; or nil
	public get Post(): Stmt {
		return this._fields.Post.value
	}
	public set Post(value: Stmt) {
		this._fields.Post.value = value
	}

	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		For: $.VarRef<token.Pos>;
		Init: $.VarRef<Stmt>;
		Cond: $.VarRef<Expr>;
		Post: $.VarRef<Stmt>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Cond?: Expr, For?: token.Pos, Init?: Stmt, Post?: Stmt}>) {
		this._fields = {
			For: $.varRef(init?.For ?? 0 as token.Pos),
			Init: $.varRef(init?.Init ?? null),
			Cond: $.varRef(init?.Cond ?? null),
			Post: $.varRef(init?.Post ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): ForStmt {
		const cloned = new ForStmt()
		cloned._fields = {
			For: $.varRef(this._fields.For.value),
			Init: $.varRef(this._fields.Init.value),
			Cond: $.varRef(this._fields.Cond.value),
			Post: $.varRef(this._fields.Post.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.For
	}

	public End(): token.Pos {
		const s = this
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'ForStmt',
	  new ForStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  ForStmt,
	  {"For": "Pos", "Init": "Stmt", "Cond": "Expr", "Post": "Stmt", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// An IfStmt node represents an if statement.
export class IfStmt {
	// position of "if" keyword
	public get If(): token.Pos {
		return this._fields.If.value
	}
	public set If(value: token.Pos) {
		this._fields.If.value = value
	}

	// initialization statement; or nil
	public get Init(): Stmt {
		return this._fields.Init.value
	}
	public set Init(value: Stmt) {
		this._fields.Init.value = value
	}

	// condition
	public get Cond(): Expr {
		return this._fields.Cond.value
	}
	public set Cond(value: Expr) {
		this._fields.Cond.value = value
	}

	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	// else branch; or nil
	public get Else(): Stmt {
		return this._fields.Else.value
	}
	public set Else(value: Stmt) {
		this._fields.Else.value = value
	}

	public _fields: {
		If: $.VarRef<token.Pos>;
		Init: $.VarRef<Stmt>;
		Cond: $.VarRef<Expr>;
		Body: $.VarRef<BlockStmt | null>;
		Else: $.VarRef<Stmt>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Cond?: Expr, Else?: Stmt, If?: token.Pos, Init?: Stmt}>) {
		this._fields = {
			If: $.varRef(init?.If ?? 0 as token.Pos),
			Init: $.varRef(init?.Init ?? null),
			Cond: $.varRef(init?.Cond ?? null),
			Body: $.varRef(init?.Body ?? null),
			Else: $.varRef(init?.Else ?? null)
		}
	}

	public clone(): IfStmt {
		const cloned = new IfStmt()
		cloned._fields = {
			If: $.varRef(this._fields.If.value),
			Init: $.varRef(this._fields.Init.value),
			Cond: $.varRef(this._fields.Cond.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null),
			Else: $.varRef(this._fields.Else.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.If
	}

	public End(): token.Pos {
		const s = this
		if (s.Else != null) {
			return s.Else!.End()
		}
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'IfStmt',
	  new IfStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  IfStmt,
	  {"If": "Pos", "Init": "Stmt", "Cond": "Expr", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }, "Else": "Stmt"}
	);
}

// A LabeledStmt node represents a labeled statement.
export class LabeledStmt {
	public get Label(): Ident | null {
		return this._fields.Label.value
	}
	public set Label(value: Ident | null) {
		this._fields.Label.value = value
	}

	// position of ":"
	public get Colon(): token.Pos {
		return this._fields.Colon.value
	}
	public set Colon(value: token.Pos) {
		this._fields.Colon.value = value
	}

	public get Stmt(): Stmt {
		return this._fields.Stmt.value
	}
	public set Stmt(value: Stmt) {
		this._fields.Stmt.value = value
	}

	public _fields: {
		Label: $.VarRef<Ident | null>;
		Colon: $.VarRef<token.Pos>;
		Stmt: $.VarRef<Stmt>;
	}

	constructor(init?: Partial<{Colon?: token.Pos, Label?: Ident | null, Stmt?: Stmt}>) {
		this._fields = {
			Label: $.varRef(init?.Label ?? null),
			Colon: $.varRef(init?.Colon ?? 0 as token.Pos),
			Stmt: $.varRef(init?.Stmt ?? null)
		}
	}

	public clone(): LabeledStmt {
		const cloned = new LabeledStmt()
		cloned._fields = {
			Label: $.varRef(this._fields.Label.value ? $.markAsStructValue(this._fields.Label.value.clone()) : null),
			Colon: $.varRef(this._fields.Colon.value),
			Stmt: $.varRef(this._fields.Stmt.value)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Label!.Pos()
	}

	public End(): token.Pos {
		const s = this
		return s.Stmt!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'LabeledStmt',
	  new LabeledStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  LabeledStmt,
	  {"Label": { kind: $.TypeKind.Pointer, elemType: "Ident" }, "Colon": "Pos", "Stmt": "Stmt"}
	);
}

// A SwitchStmt node represents an expression switch statement.
export class SwitchStmt {
	// position of "switch" keyword
	public get Switch(): token.Pos {
		return this._fields.Switch.value
	}
	public set Switch(value: token.Pos) {
		this._fields.Switch.value = value
	}

	// initialization statement; or nil
	public get Init(): Stmt {
		return this._fields.Init.value
	}
	public set Init(value: Stmt) {
		this._fields.Init.value = value
	}

	// tag expression; or nil
	public get Tag(): Expr {
		return this._fields.Tag.value
	}
	public set Tag(value: Expr) {
		this._fields.Tag.value = value
	}

	// CaseClauses only
	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		Switch: $.VarRef<token.Pos>;
		Init: $.VarRef<Stmt>;
		Tag: $.VarRef<Expr>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Body?: BlockStmt | null, Init?: Stmt, Switch?: token.Pos, Tag?: Expr}>) {
		this._fields = {
			Switch: $.varRef(init?.Switch ?? 0 as token.Pos),
			Init: $.varRef(init?.Init ?? null),
			Tag: $.varRef(init?.Tag ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): SwitchStmt {
		const cloned = new SwitchStmt()
		cloned._fields = {
			Switch: $.varRef(this._fields.Switch.value),
			Init: $.varRef(this._fields.Init.value),
			Tag: $.varRef(this._fields.Tag.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Switch
	}

	public End(): token.Pos {
		const s = this
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SwitchStmt',
	  new SwitchStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  SwitchStmt,
	  {"Switch": "Pos", "Init": "Stmt", "Tag": "Expr", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

// A TypeSwitchStmt node represents a type switch statement.
export class TypeSwitchStmt {
	// position of "switch" keyword
	public get Switch(): token.Pos {
		return this._fields.Switch.value
	}
	public set Switch(value: token.Pos) {
		this._fields.Switch.value = value
	}

	// initialization statement; or nil
	public get Init(): Stmt {
		return this._fields.Init.value
	}
	public set Init(value: Stmt) {
		this._fields.Init.value = value
	}

	// x := y.(type) or y.(type)
	public get Assign(): Stmt {
		return this._fields.Assign.value
	}
	public set Assign(value: Stmt) {
		this._fields.Assign.value = value
	}

	// CaseClauses only
	public get Body(): BlockStmt | null {
		return this._fields.Body.value
	}
	public set Body(value: BlockStmt | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		Switch: $.VarRef<token.Pos>;
		Init: $.VarRef<Stmt>;
		Assign: $.VarRef<Stmt>;
		Body: $.VarRef<BlockStmt | null>;
	}

	constructor(init?: Partial<{Assign?: Stmt, Body?: BlockStmt | null, Init?: Stmt, Switch?: token.Pos}>) {
		this._fields = {
			Switch: $.varRef(init?.Switch ?? 0 as token.Pos),
			Init: $.varRef(init?.Init ?? null),
			Assign: $.varRef(init?.Assign ?? null),
			Body: $.varRef(init?.Body ?? null)
		}
	}

	public clone(): TypeSwitchStmt {
		const cloned = new TypeSwitchStmt()
		cloned._fields = {
			Switch: $.varRef(this._fields.Switch.value),
			Init: $.varRef(this._fields.Init.value),
			Assign: $.varRef(this._fields.Assign.value),
			Body: $.varRef(this._fields.Body.value ? $.markAsStructValue(this._fields.Body.value.clone()) : null)
		}
		return cloned
	}

	public Pos(): token.Pos {
		const s = this
		return s.Switch
	}

	public End(): token.Pos {
		const s = this
		return s.Body!.End()
	}

	public stmtNode(): void {
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'TypeSwitchStmt',
	  new TypeSwitchStmt(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }, { name: "End", args: [], returns: [{ type: "Pos" }] }, { name: "stmtNode", args: [], returns: [] }],
	  TypeSwitchStmt,
	  {"Switch": "Pos", "Init": "Stmt", "Assign": "Stmt", "Body": { kind: $.TypeKind.Pointer, elemType: "BlockStmt" }}
	);
}

export function isWhitespace(ch: number): boolean {
	return ch == 32 || ch == 9 || ch == 10 || ch == 13
}

export function stripTrailingWhitespace(s: string): string {
	let i = $.len(s)
	for (; i > 0 && isWhitespace($.indexString(s, i - 1)); ) {
		i--
	}
	return $.sliceString(s, 0, i)
}

// isDirective reports whether c is a comment directive.
// This code is also in go/printer.
export function isDirective(c: string): boolean {
	// "//line " is a line directive.
	// "//extern " is for gccgo.
	// "//export " is for cgo.
	// (The // has been removed.)
	if (strings.HasPrefix(c, "line ") || strings.HasPrefix(c, "extern ") || strings.HasPrefix(c, "export ")) {
		return true
	}

	// "//[a-z0-9]+:[a-z0-9]"
	// (The // has been removed.)
	let colon = strings.Index(c, ":")
	if (colon <= 0 || colon + 1 >= $.len(c)) {
		return false
	}
	for (let i = 0; i <= colon + 1; i++) {
		if (i == colon) {
			continue
		}
		let b = $.indexString(c, i)
		if (!(97 <= b && b <= 122 || 48 <= b && b <= 57)) {
			return false
		}
	}
	return true
}

// NewIdent creates a new [Ident] without position.
// Useful for ASTs generated by code other than the Go parser.
export function NewIdent(name: string): Ident | null {
	return new Ident({})
}

// IsExported reports whether name starts with an upper-case letter.
export function IsExported(name: string): boolean {
	return token.IsExported(name)
}

// IsGenerated reports whether the file was generated by a program,
// not handwritten, by detecting the special comment described
// at https://go.dev/s/generatedcode.
//
// The syntax tree must have been parsed with the [parser.ParseComments] flag.
// Example:
//
//	f, err := parser.ParseFile(fset, filename, src, parser.ParseComments|parser.PackageClauseOnly)
//	if err != nil { ... }
//	gen := ast.IsGenerated(f)
export function IsGenerated(file: File | null): boolean {
	let [, ok] = generator(file)
	return ok
}

export function generator(file: File | null): [string, boolean] {

	// after package declaration

	// opt: check Contains first to avoid unnecessary array allocation in Split.
	for (let _i = 0; _i < $.len(file!.Comments); _i++) {
		const group = file!.Comments![_i]
		{

			// after package declaration

			// opt: check Contains first to avoid unnecessary array allocation in Split.
			for (let _i = 0; _i < $.len(group!.List); _i++) {
				const comment = group!.List![_i]
				{

					// after package declaration
					if (comment!.Pos() > file!.Package) {
						break
					}
					// opt: check Contains first to avoid unnecessary array allocation in Split.
					let prefix: string = "// Code generated "
					if (strings.Contains(comment!.Text, "// Code generated ")) {
						for (let _i = 0; _i < $.len(strings.Split(comment!.Text, "\n")); _i++) {
							const line = strings.Split(comment!.Text, "\n")![_i]
							{
								{
									let [rest, ok] = strings.CutPrefix(line, "// Code generated ")
									if (ok) {
										{
											let [gen, ok] = strings.CutSuffix(rest, " DO NOT EDIT.")
											if (ok) {
												return [gen, true]
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return ["", false]
}

// Unparen returns the expression with any enclosing parentheses removed.
export function Unparen(e: Expr): Expr {
	for (; ; ) {
		let { value: paren, ok: ok } = $.typeAssert<ParenExpr | null>(e, {kind: $.TypeKind.Pointer, elemType: 'ParenExpr'})
		if (!ok) {
			return e
		}
		e = paren!.X
	}
}

