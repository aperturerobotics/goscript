import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

let maxSize: number = 1000

export type Expr = null | {
	// Eval reports whether the expression evaluates to true.
	// It calls ok(tag) as needed to find out whether a given build tag
	// is satisfied by the current build configuration.
	Eval(ok: ((tag: string) => boolean) | null): boolean
	// String returns the string form of the expression,
	// using the boolean syntax used in //go:build lines.
	String(): string
	// The presence of an isExpr method explicitly marks the type as an Expr.
	// Only implementations in this package should be used as Exprs.
	isExpr(): void
}

$.registerInterfaceType(
  'Expr',
  null, // Zero value for interface is null
  [{ name: "Eval", args: [{ name: "ok", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "boolean" }] } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "isExpr", args: [], returns: [] }]
);

export class SyntaxError {
	// byte offset in input where error was detected
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	// description of error
	public get Err(): string {
		return this._fields.Err.value
	}
	public set Err(value: string) {
		this._fields.Err.value = value
	}

	public _fields: {
		Offset: $.VarRef<number>;
		Err: $.VarRef<string>;
	}

	constructor(init?: Partial<{Err?: string, Offset?: number}>) {
		this._fields = {
			Offset: $.varRef(init?.Offset ?? 0),
			Err: $.varRef(init?.Err ?? "")
		}
	}

	public clone(): SyntaxError {
		const cloned = new SyntaxError()
		cloned._fields = {
			Offset: $.varRef(this._fields.Offset.value),
			Err: $.varRef(this._fields.Err.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return e.Err
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'SyntaxError',
	  new SyntaxError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  SyntaxError,
	  {"Offset": { kind: $.TypeKind.Basic, name: "number" }, "Err": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class TagExpr {
	// for example, “linux” or “cgo”
	public get Tag(): string {
		return this._fields.Tag.value
	}
	public set Tag(value: string) {
		this._fields.Tag.value = value
	}

	public _fields: {
		Tag: $.VarRef<string>;
	}

	constructor(init?: Partial<{Tag?: string}>) {
		this._fields = {
			Tag: $.varRef(init?.Tag ?? "")
		}
	}

	public clone(): TagExpr {
		const cloned = new TagExpr()
		cloned._fields = {
			Tag: $.varRef(this._fields.Tag.value)
		}
		return cloned
	}

	public isExpr(): void {
	}

	public Eval(ok: ((tag: string) => boolean) | null): boolean {
		const x = this
		return ok!(x.Tag)
	}

	public String(): string {
		const x = this
		return x.Tag
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'TagExpr',
	  new TagExpr(),
	  [{ name: "isExpr", args: [], returns: [] }, { name: "Eval", args: [{ name: "ok", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "boolean" }] } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  TagExpr,
	  {"Tag": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class exprParser {
	// input string
	public get s(): string {
		return this._fields.s.value
	}
	public set s(value: string) {
		this._fields.s.value = value
	}

	// next read location in s
	public get i(): number {
		return this._fields.i.value
	}
	public set i(value: number) {
		this._fields.i.value = value
	}

	// last token read
	public get tok(): string {
		return this._fields.tok.value
	}
	public set tok(value: string) {
		this._fields.tok.value = value
	}

	public get isTag(): boolean {
		return this._fields.isTag.value
	}
	public set isTag(value: boolean) {
		this._fields.isTag.value = value
	}

	// position (start) of last token
	public get pos(): number {
		return this._fields.pos.value
	}
	public set pos(value: number) {
		this._fields.pos.value = value
	}

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		s: $.VarRef<string>;
		i: $.VarRef<number>;
		tok: $.VarRef<string>;
		isTag: $.VarRef<boolean>;
		pos: $.VarRef<number>;
		size: $.VarRef<number>;
	}

	constructor(init?: Partial<{i?: number, isTag?: boolean, pos?: number, s?: string, size?: number, tok?: string}>) {
		this._fields = {
			s: $.varRef(init?.s ?? ""),
			i: $.varRef(init?.i ?? 0),
			tok: $.varRef(init?.tok ?? ""),
			isTag: $.varRef(init?.isTag ?? false),
			pos: $.varRef(init?.pos ?? 0),
			size: $.varRef(init?.size ?? 0)
		}
	}

	public clone(): exprParser {
		const cloned = new exprParser()
		cloned._fields = {
			s: $.varRef(this._fields.s.value),
			i: $.varRef(this._fields.i.value),
			tok: $.varRef(this._fields.tok.value),
			isTag: $.varRef(this._fields.isTag.value),
			pos: $.varRef(this._fields.pos.value),
			size: $.varRef(this._fields.size.value)
		}
		return cloned
	}

	// or parses a sequence of || expressions.
	// On entry, the next input token has not yet been lexed.
	// On exit, the next input token has been lexed and is in p.tok.
	public or(): Expr {
		const p = this
		let x = p.and()
		for (; p.tok == "||"; ) {
			x = or(x, p.and())
		}
		return x
	}

	// and parses a sequence of && expressions.
	// On entry, the next input token has not yet been lexed.
	// On exit, the next input token has been lexed and is in p.tok.
	public and(): Expr {
		const p = this
		let x = p.not()
		for (; p.tok == "&&"; ) {
			x = and(x, p.not())
		}
		return x
	}

	// not parses a ! expression.
	// On entry, the next input token has not yet been lexed.
	// On exit, the next input token has been lexed and is in p.tok.
	public not(): Expr {
		const p = this
		p.size++
		if (p.size > 1000) {
			$.panic(new SyntaxError({Err: "build expression too large", Offset: p.pos}))
		}
		p.lex()
		if (p.tok == "!") {
			p.lex()
			if (p.tok == "!") {
				$.panic(new SyntaxError({Err: "double negation not allowed", Offset: p.pos}))
			}
			return not(p.atom())
		}
		return p.atom()
	}

	// atom parses a tag or a parenthesized expression.
	// On entry, the next input token HAS been lexed.
	// On exit, the next input token has been lexed and is in p.tok.
	public atom(): Expr {
		const p = this
		using __defer = new $.DisposableStack();
		if (p.tok == "(") {
			using __defer = new $.DisposableStack();
			let pos = p.pos
			__defer.defer(() => {
				{
					let e = $.recover()
					if (e != null) {
						const _temp_e = e
						{
							let { value: e, ok: ok } = $.typeAssert<SyntaxError | null>(_temp_e, {kind: $.TypeKind.Pointer, elemType: 'SyntaxError'})
							if (ok && e!.Err == "unexpected end of expression") {
								e!.Err = "missing close paren"
							}
						}
						$.panic(e)
					}
				}
			});
			let x = p.or()
			if (p.tok != ")") {
				$.panic(new SyntaxError({Err: "missing close paren", Offset: pos}))
			}
			p.lex()
			return x
		}
		if (!p.isTag) {
			if (p.tok == "") {
				$.panic(new SyntaxError({Err: "unexpected end of expression", Offset: p.pos}))
			}
			$.panic(new SyntaxError({Err: "unexpected token " + p.tok, Offset: p.pos}))
		}
		let tok = p.tok
		p.lex()
		return tag(tok)
	}

	// lex finds and consumes the next token in the input stream.
	// On return, p.tok is set to the token text,
	// p.isTag reports whether the token was a tag,
	// and p.pos records the byte offset of the start of the token in the input stream.
	// If lex reaches the end of the input, p.tok is set to the empty string.
	// For any other syntax error, lex panics with a SyntaxError.
	public lex(): void {
		const p = this
		p.isTag = false
		for (; p.i < $.len(p.s) && ($.indexString(p.s, p.i) == 32 || $.indexString(p.s, p.i) == 9); ) {
			p.i++
		}
		if (p.i >= $.len(p.s)) {
			p.tok = ""
			p.pos = p.i
			return 
		}
		switch ($.indexString(p.s, p.i)) {
			case 40:
			case 41:
			case 33:
				p.pos = p.i
				p.i++
				p.tok = $.sliceString(p.s, p.pos, p.i)
				return 
				break
			case 38:
			case 124:
				if (p.i + 1 >= $.len(p.s) || $.indexString(p.s, p.i + 1) != $.indexString(p.s, p.i)) {
					$.panic(new SyntaxError({Err: "invalid syntax at " + $.runeOrStringToString($.indexString(p.s, p.i)), Offset: p.i}))
				}
				p.pos = p.i
				p.i += 2
				p.tok = $.sliceString(p.s, p.pos, p.i)
				return 
				break
		}
		let tag = $.sliceString(p.s, p.i, undefined)
		{
			const _runes = $.stringToRunes(tag)
			for (let i = 0; i < _runes.length; i++) {
				const c = _runes[i]
				{
					if (!unicode.IsLetter(c) && !unicode.IsDigit(c) && c != 95 && c != 46) {
						tag = $.sliceString(tag, undefined, i)
						break
					}
				}
			}
		}
		if (tag == "") {
			let [c, ] = utf8.DecodeRuneInString($.sliceString(p.s, p.i, undefined))
			$.panic(new SyntaxError({Err: "invalid syntax at " + $.runeOrStringToString(c), Offset: p.i}))
		}
		p.pos = p.i
		p.i += $.len(tag)
		p.tok = $.sliceString(p.s, p.pos, p.i)
		p.isTag = true
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'exprParser',
	  new exprParser(),
	  [{ name: "or", args: [], returns: [{ type: "Expr" }] }, { name: "and", args: [], returns: [{ type: "Expr" }] }, { name: "not", args: [], returns: [{ type: "Expr" }] }, { name: "atom", args: [], returns: [{ type: "Expr" }] }, { name: "lex", args: [], returns: [] }],
	  exprParser,
	  {"s": { kind: $.TypeKind.Basic, name: "string" }, "i": { kind: $.TypeKind.Basic, name: "number" }, "tok": { kind: $.TypeKind.Basic, name: "string" }, "isTag": { kind: $.TypeKind.Basic, name: "boolean" }, "pos": { kind: $.TypeKind.Basic, name: "number" }, "size": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

export class AndExpr {
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public get Y(): Expr {
		return this._fields.Y.value
	}
	public set Y(value: Expr) {
		this._fields.Y.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Y: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{X?: Expr, Y?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Y: $.varRef(init?.Y ?? null)
		}
	}

	public clone(): AndExpr {
		const cloned = new AndExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Y: $.varRef(this._fields.Y.value)
		}
		return cloned
	}

	public isExpr(): void {
	}

	public Eval(ok: ((tag: string) => boolean) | null): boolean {
		const x = this
		let xok = x.X!.Eval(ok)
		let yok = x.Y!.Eval(ok)
		return xok && yok
	}

	public String(): string {
		const x = this
		return andArg(x.X) + " && " + andArg(x.Y)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'AndExpr',
	  new AndExpr(),
	  [{ name: "isExpr", args: [], returns: [] }, { name: "Eval", args: [{ name: "ok", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "boolean" }] } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  AndExpr,
	  {"X": "Expr", "Y": "Expr"}
	);
}

export class NotExpr {
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

	public clone(): NotExpr {
		const cloned = new NotExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value)
		}
		return cloned
	}

	public isExpr(): void {
	}

	public Eval(ok: ((tag: string) => boolean) | null): boolean {
		const x = this
		return !x.X!.Eval(ok)
	}

	public String(): string {
		const x = this
		let s = x.X!.String()
		$.typeSwitch(x.X, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'AndExpr'}, {kind: $.TypeKind.Pointer, elemType: 'OrExpr'}], body: () => {
			s = "(" + s + ")"
		}}])
		return "!" + s
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'NotExpr',
	  new NotExpr(),
	  [{ name: "isExpr", args: [], returns: [] }, { name: "Eval", args: [{ name: "ok", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "boolean" }] } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  NotExpr,
	  {"X": "Expr"}
	);
}

export class OrExpr {
	public get X(): Expr {
		return this._fields.X.value
	}
	public set X(value: Expr) {
		this._fields.X.value = value
	}

	public get Y(): Expr {
		return this._fields.Y.value
	}
	public set Y(value: Expr) {
		this._fields.Y.value = value
	}

	public _fields: {
		X: $.VarRef<Expr>;
		Y: $.VarRef<Expr>;
	}

	constructor(init?: Partial<{X?: Expr, Y?: Expr}>) {
		this._fields = {
			X: $.varRef(init?.X ?? null),
			Y: $.varRef(init?.Y ?? null)
		}
	}

	public clone(): OrExpr {
		const cloned = new OrExpr()
		cloned._fields = {
			X: $.varRef(this._fields.X.value),
			Y: $.varRef(this._fields.Y.value)
		}
		return cloned
	}

	public isExpr(): void {
	}

	public Eval(ok: ((tag: string) => boolean) | null): boolean {
		const x = this
		let xok = x.X!.Eval(ok)
		let yok = x.Y!.Eval(ok)
		return xok || yok
	}

	public String(): string {
		const x = this
		return orArg(x.X) + " || " + orArg(x.Y)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'OrExpr',
	  new OrExpr(),
	  [{ name: "isExpr", args: [], returns: [] }, { name: "Eval", args: [{ name: "ok", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "boolean" }] } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  OrExpr,
	  {"X": "Expr", "Y": "Expr"}
	);
}

let errComplex: $.GoError = errors.New("expression too complex for // +build lines")

let errNotConstraint: $.GoError = errors.New("not a build constraint")

export function tag(tag: string): Expr {
	return new TagExpr({})
}

export function not(x: Expr): Expr {
	return new NotExpr({})
}

export function andArg(x: Expr): string {
	let s = x!.String()
	{
		let { ok: ok } = $.typeAssert<OrExpr | null>(x, {kind: $.TypeKind.Pointer, elemType: 'OrExpr'})
		if (ok) {
			s = "(" + s + ")"
		}
	}
	return s
}

export function and(x: Expr, y: Expr): Expr {
	return new AndExpr({})
}

export function orArg(x: Expr): string {
	let s = x!.String()
	{
		let { ok: ok } = $.typeAssert<AndExpr | null>(x, {kind: $.TypeKind.Pointer, elemType: 'AndExpr'})
		if (ok) {
			s = "(" + s + ")"
		}
	}
	return s
}

export function or(x: Expr, y: Expr): Expr {
	return new OrExpr({})
}

// Parse parses a single build constraint line of the form “//go:build ...” or “// +build ...”
// and returns the corresponding boolean expression.
export function Parse(line: string): [Expr, $.GoError] {
	{
		let [text, ok] = splitGoBuild(line)
		if (ok) {
			return parseExpr(text)
		}
	}
	{
		let [text, ok] = splitPlusBuild(line)
		if (ok) {
			return parsePlusBuildExpr(text)
		}
	}
	return [null, errNotConstraint]
}

// IsGoBuild reports whether the line of text is a “//go:build” constraint.
// It only checks the prefix of the text, not that the expression itself parses.
export function IsGoBuild(line: string): boolean {
	let [, ok] = splitGoBuild(line)
	return ok
}

// splitGoBuild splits apart the leading //go:build prefix in line from the build expression itself.
// It returns "", false if the input is not a //go:build line or if the input contains multiple lines.
export function splitGoBuild(line: string): [string, boolean] {
	let expr: string = ""
	let ok: boolean = false
	{
		// A single trailing newline is OK; otherwise multiple lines are not.
		if ($.len(line) > 0 && $.indexString(line, $.len(line) - 1) == 10) {
			line = $.sliceString(line, undefined, $.len(line) - 1)
		}
		if (strings.Contains(line, "\n")) {
			return ["", false]
		}

		if (!strings.HasPrefix(line, "//go:build")) {
			return ["", false]
		}

		line = strings.TrimSpace(line)
		line = $.sliceString(line, $.len("//go:build"), undefined)

		// If strings.TrimSpace finds more to trim after removing the //go:build prefix,
		// it means that the prefix was followed by a space, making this a //go:build line
		// (as opposed to a //go:buildsomethingelse line).
		// If line is empty, we had "//go:build" by itself, which also counts.
		let trim = strings.TrimSpace(line)
		if ($.len(line) == $.len(trim) && line != "") {
			return ["", false]
		}

		return [trim, true]
	}
}

// parseExpr parses a boolean build tag expression.
export function parseExpr(text: string): [Expr, $.GoError] {
	let x: Expr = null
	let err: $.GoError = null
	{
		using __defer = new $.DisposableStack();

		// unreachable unless parser has a bug
		__defer.defer(() => {
			{
				let e = $.recover()
				if (e != null) {
					const _temp_e = e
					{
						let { value: e, ok: ok } = $.typeAssert<SyntaxError | null>(_temp_e, {kind: $.TypeKind.Pointer, elemType: 'SyntaxError'})
						if (ok) {
							err = e
							return 
						}
					}
					$.panic(e) // unreachable unless parser has a bug
				}
			}
		});

		let p = new exprParser({s: text})
		x = p!.or()
		if (p!.tok != "") {
			$.panic(new SyntaxError({Err: "unexpected token " + p!.tok, Offset: p!.pos}))
		}
		return [x, null]
	}
}

// IsPlusBuild reports whether the line of text is a “// +build” constraint.
// It only checks the prefix of the text, not that the expression itself parses.
export function IsPlusBuild(line: string): boolean {
	let [, ok] = splitPlusBuild(line)
	return ok
}

// splitPlusBuild splits apart the leading // +build prefix in line from the build expression itself.
// It returns "", false if the input is not a // +build line or if the input contains multiple lines.
export function splitPlusBuild(line: string): [string, boolean] {
	let expr: string = ""
	let ok: boolean = false
	{
		// A single trailing newline is OK; otherwise multiple lines are not.
		if ($.len(line) > 0 && $.indexString(line, $.len(line) - 1) == 10) {
			line = $.sliceString(line, undefined, $.len(line) - 1)
		}
		if (strings.Contains(line, "\n")) {
			return ["", false]
		}

		if (!strings.HasPrefix(line, "//")) {
			return ["", false]
		}
		line = $.sliceString(line, $.len("//"), undefined)
		// Note the space is optional; "//+build" is recognized too.
		line = strings.TrimSpace(line)

		if (!strings.HasPrefix(line, "+build")) {
			return ["", false]
		}
		line = $.sliceString(line, $.len("+build"), undefined)

		// If strings.TrimSpace finds more to trim after removing the +build prefix,
		// it means that the prefix was followed by a space, making this a +build line
		// (as opposed to a +buildsomethingelse line).
		// If line is empty, we had "// +build" by itself, which also counts.
		let trim = strings.TrimSpace(line)
		if ($.len(line) == $.len(trim) && line != "") {
			return ["", false]
		}

		return [trim, true]
	}
}

// parsePlusBuildExpr parses a legacy build tag expression (as used with “// +build”).
export function parsePlusBuildExpr(text: string): [Expr, $.GoError] {
	// Only allow up to 100 AND/OR operators for "old" syntax.
	// This is much less than the limit for "new" syntax,
	// but uses of old syntax were always very simple.
	let maxOldSize: number = 100
	let size = 0

	let x: Expr = null
	for (let _i = 0; _i < $.len(strings.Fields(text)); _i++) {
		const clause = strings.Fields(text)![_i]
		{
			let y: Expr = null
			for (let _i = 0; _i < $.len(strings.Split(clause, ",")); _i++) {
				const lit = strings.Split(clause, ",")![_i]
				{
					let z: Expr = null
					let neg: boolean = false
					if (strings.HasPrefix(lit, "!!") || lit == "!") {
						z = tag("ignore")
					}
					 else {
						if (strings.HasPrefix(lit, "!")) {
							neg = true
							lit = $.sliceString(lit, $.len("!"), undefined)
						}
						if (isValidTag(lit)) {
							z = tag(lit)
						}
						 else {
							z = tag("ignore")
						}
						if (neg) {
							z = not(z)
						}
					}
					if (y == null) {
						y = z
					}
					 else {
						{
							size++
							if (size > 100) {
								return [null, errComplex]
							}
						}
						y = and(y, z)
					}
				}
			}
			if (x == null) {
				x = y
			}
			 else {
				{
					size++
					if (size > 100) {
						return [null, errComplex]
					}
				}
				x = or(x, y)
			}
		}
	}
	if (x == null) {
		x = tag("ignore")
	}
	return [x, null]
}

// isValidTag reports whether the word is a valid build tag.
// Tags must be letters, digits, underscores or dots.
// Unlike in Go identifiers, all digits are fine (e.g., "386").
export function isValidTag(word: string): boolean {
	if (word == "") {
		return false
	}
	{
		const _runes = $.stringToRunes(word)
		for (let i = 0; i < _runes.length; i++) {
			const c = _runes[i]
			{
				if (!unicode.IsLetter(c) && !unicode.IsDigit(c) && c != 95 && c != 46) {
					return false
				}
			}
		}
	}
	return true
}

// PlusBuildLines returns a sequence of “// +build” lines that evaluate to the build expression x.
// If the expression is too complex to convert directly to “// +build” lines, PlusBuildLines returns an error.
export function PlusBuildLines(x: Expr): [$.Slice<string>, $.GoError] {
	// Push all NOTs to the expression leaves, so that //go:build !(x && y) can be treated as !x || !y.
	// This rewrite is both efficient and commonly needed, so it's worth doing.
	// Essentially all other possible rewrites are too expensive and too rarely needed.
	x = pushNot(x, false)

	// Split into AND of ORs of ANDs of literals (tag or NOT tag).
	let split: $.Slice<$.Slice<$.Slice<Expr>>> = null
	for (let _i = 0; _i < $.len(appendSplitAnd(null, x)); _i++) {
		const or = appendSplitAnd(null, x)![_i]
		{
			let ands: $.Slice<$.Slice<Expr>> = null
			for (let _i = 0; _i < $.len(appendSplitOr(null, or)); _i++) {
				const and = appendSplitOr(null, or)![_i]
				{
					let lits: $.Slice<Expr> = null
					for (let _i = 0; _i < $.len(appendSplitAnd(null, and)); _i++) {
						const lit = appendSplitAnd(null, and)![_i]
						{
							$.typeSwitch(lit, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'TagExpr'}, {kind: $.TypeKind.Pointer, elemType: 'NotExpr'}], body: () => {
								lits = $.append(lits, lit)
							}}], () => {
								return [null, errComplex]
							})
						}
					}
					ands = $.append(ands, lits)
				}
			}
			split = $.append(split, ands)
		}
	}

	// If all the ORs have length 1 (no actual OR'ing going on),
	// push the top-level ANDs to the bottom level, so that we get
	// one // +build line instead of many.
	let maxOr = 0
	for (let _i = 0; _i < $.len(split); _i++) {
		const or = split![_i]
		{
			if (maxOr < $.len(or)) {
				maxOr = $.len(or)
			}
		}
	}
	if (maxOr == 1) {
		let lits: $.Slice<Expr> = null
		for (let _i = 0; _i < $.len(split); _i++) {
			const or = split![_i]
			{
				lits = $.append(lits, or![0])
			}
		}
		split = $.arrayToSlice<$.Slice<$.Slice<Expr>>>([[ lits ]], 2)
	}

	// Prepare the +build lines.
	let lines: $.Slice<string> = null
	for (let _i = 0; _i < $.len(split); _i++) {
		const or = split![_i]
		{
			let line = "// +build"
			for (let _i = 0; _i < $.len(or); _i++) {
				const and = or![_i]
				{
					let clause = ""
					for (let i = 0; i < $.len(and); i++) {
						const lit = and![i]
						{
							if (i > 0) {
								clause += ","
							}
							clause += lit!.String()
						}
					}
					line += " " + clause
				}
			}
			lines = $.append(lines, line)
		}
	}

	return [lines, null]
}

// pushNot applies DeMorgan's law to push negations down the expression,
// so that only tags are negated in the result.
// (It applies the rewrites !(X && Y) => (!X || !Y) and !(X || Y) => (!X && !Y).)
export function pushNot(x: Expr, not: boolean): Expr {

	// unreachable
	$.typeSwitch(x, [,
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'NotExpr'}], body: (x) => {
		{
			let { ok: ok } = $.typeAssert<TagExpr | null>(x!.X, {kind: $.TypeKind.Pointer, elemType: 'TagExpr'})
			if (ok && !not) {
				return x
			}
		}
		return pushNot(x!.X, !not)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TagExpr'}], body: (x) => {
		if (not) {
			return new NotExpr({X: x})
		}
		return x
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'AndExpr'}], body: (x) => {
		let x1 = pushNot(x!.X, not)
		let y1 = pushNot(x!.Y, not)
		if (not) {
			return or(x1, y1)
		}
		if (x1 == x!.X && y1 == x!.Y) {
			return x
		}
		return and(x1, y1)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'OrExpr'}], body: (x) => {
		let x1 = pushNot(x!.X, not)
		let y1 = pushNot(x!.Y, not)
		if (not) {
			return and(x1, y1)
		}
		if (x1 == x!.X && y1 == x!.Y) {
			return x
		}
		return or(x1, y1)
	}}], () => {
		return x
	})
}

// appendSplitAnd appends x to list while splitting apart any top-level && expressions.
// For example, appendSplitAnd({W}, X && Y && Z) = {W, X, Y, Z}.
export function appendSplitAnd(list: $.Slice<Expr>, x: Expr): $.Slice<Expr> {
	const _temp_x = x
	{
		let { value: x, ok: ok } = $.typeAssert<AndExpr | null>(_temp_x, {kind: $.TypeKind.Pointer, elemType: 'AndExpr'})
		if (ok) {
			list = appendSplitAnd(list, x!.X)
			list = appendSplitAnd(list, x!.Y)
			return list
		}
	}
	return $.append(list, x)
}

// appendSplitOr appends x to list while splitting apart any top-level || expressions.
// For example, appendSplitOr({W}, X || Y || Z) = {W, X, Y, Z}.
export function appendSplitOr(list: $.Slice<Expr>, x: Expr): $.Slice<Expr> {
	const _temp_x = x
	{
		let { value: x, ok: ok } = $.typeAssert<OrExpr | null>(_temp_x, {kind: $.TypeKind.Pointer, elemType: 'OrExpr'})
		if (ok) {
			list = appendSplitOr(list, x!.X)
			list = appendSplitOr(list, x!.Y)
			return list
		}
	}
	return $.append(list, x)
}

