import * as $ from "@goscript/builtin/index.js"
import { CommentGroup, File, GenDecl, ImportSpec, Spec } from "./ast.gs.js";

import * as cmp from "@goscript/cmp/index.js"

import * as token from "@goscript/go/token/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

export class cgPos {
	// true if comment is to the left of the spec, false otherwise.
	public get left(): boolean {
		return this._fields.left.value
	}
	public set left(value: boolean) {
		this._fields.left.value = value
	}

	public get cg(): CommentGroup | null {
		return this._fields.cg.value
	}
	public set cg(value: CommentGroup | null) {
		this._fields.cg.value = value
	}

	public _fields: {
		left: $.VarRef<boolean>;
		cg: $.VarRef<CommentGroup | null>;
	}

	constructor(init?: Partial<{cg?: CommentGroup | null, left?: boolean}>) {
		this._fields = {
			left: $.varRef(init?.left ?? false),
			cg: $.varRef(init?.cg ?? null)
		}
	}

	public clone(): cgPos {
		const cloned = new cgPos()
		cloned._fields = {
			left: $.varRef(this._fields.left.value),
			cg: $.varRef(this._fields.cg.value ? $.markAsStructValue(this._fields.cg.value.clone()) : null)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'cgPos',
	  new cgPos(),
	  [],
	  cgPos,
	  {"left": { kind: $.TypeKind.Basic, name: "boolean" }, "cg": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }}
	);
}

export class posSpan {
	public get Start(): token.Pos {
		return this._fields.Start.value
	}
	public set Start(value: token.Pos) {
		this._fields.Start.value = value
	}

	public get End(): token.Pos {
		return this._fields.End.value
	}
	public set End(value: token.Pos) {
		this._fields.End.value = value
	}

	public _fields: {
		Start: $.VarRef<token.Pos>;
		End: $.VarRef<token.Pos>;
	}

	constructor(init?: Partial<{End?: token.Pos, Start?: token.Pos}>) {
		this._fields = {
			Start: $.varRef(init?.Start ?? 0 as token.Pos),
			End: $.varRef(init?.End ?? 0 as token.Pos)
		}
	}

	public clone(): posSpan {
		const cloned = new posSpan()
		cloned._fields = {
			Start: $.varRef(this._fields.Start.value),
			End: $.varRef(this._fields.End.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'posSpan',
	  new posSpan(),
	  [],
	  posSpan,
	  {"Start": "Pos", "End": "Pos"}
	);
}

// SortImports sorts runs of consecutive import lines in import blocks in f.
// It also removes duplicate imports when it is possible to do so without data loss.
export function SortImports(fset: token.FileSet | null, f: File | null): void {

	// Not an import declaration, so we're done.
	// Imports are always first.

	// Not a block: sorted by default.

	// Identify and sort runs of specs on successive lines.

	// j begins a new run. End this one.

	// Deduping can leave a blank line before the rparen; clean that up.
	for (let _i = 0; _i < $.len(f!.Decls); _i++) {
		const d = f!.Decls![_i]
		{
			let { value: d, ok: ok } = $.typeAssert<GenDecl | null>(d, {kind: $.TypeKind.Pointer, elemType: 'GenDecl'})

			// Not an import declaration, so we're done.
			// Imports are always first.
			if (!ok || d!.Tok != token.IMPORT) {
				// Not an import declaration, so we're done.
				// Imports are always first.
				break
			}

			// Not a block: sorted by default.
			if (!token.Pos_IsValid(d!.Lparen)) {
				// Not a block: sorted by default.
				continue
			}

			// Identify and sort runs of specs on successive lines.
			let i = 0
			let specs = $.goSlice(d!.Specs, undefined, 0)

			// j begins a new run. End this one.
			for (let j = 0; j < $.len(d!.Specs); j++) {
				const s = d!.Specs![j]
				{

					// j begins a new run. End this one.
					if (j > i && lineAt(fset, s!.Pos()) > 1 + lineAt(fset, d!.Specs![j - 1]!.End())) {
						// j begins a new run. End this one.
						specs = $.append(specs, sortSpecs(fset, f, $.goSlice(d!.Specs, i, j)))
						i = j
					}
				}
			}
			specs = $.append(specs, sortSpecs(fset, f, $.goSlice(d!.Specs, i, undefined)))
			d!.Specs = specs

			// Deduping can leave a blank line before the rparen; clean that up.
			if ($.len(d!.Specs) > 0) {
				let lastSpec = d!.Specs![$.len(d!.Specs) - 1]
				let lastLine = lineAt(fset, lastSpec!.Pos())
				let rParenLine = lineAt(fset, d!.Rparen)
				for (; rParenLine > lastLine + 1; ) {
					rParenLine--
					(await fset!.File(d!.Rparen))!.MergeLine(rParenLine)
				}
			}
		}
	}

	// Make File.Imports order consistent.
	f!.Imports = $.goSlice(f!.Imports, undefined, 0)
	for (let _i = 0; _i < $.len(f!.Decls); _i++) {
		const decl = f!.Decls![_i]
		{
			const _temp_decl = decl
			{
				let { value: decl, ok: ok } = $.typeAssert<GenDecl | null>(_temp_decl, {kind: $.TypeKind.Pointer, elemType: 'GenDecl'})
				if (ok && decl!.Tok == token.IMPORT) {
					for (let _i = 0; _i < $.len(decl!.Specs); _i++) {
						const spec = decl!.Specs![_i]
						{
							f!.Imports = $.append(f!.Imports, $.mustTypeAssert<ImportSpec | null>(spec, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'}))
						}
					}
				}
			}
		}
	}
}

export function lineAt(fset: token.FileSet | null, pos: token.Pos): number {
	return (await fset!.PositionFor(pos, false))!.Line
}

export function importPath(s: Spec): string {
	let [t, err] = strconv.Unquote($.mustTypeAssert<ImportSpec | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})!.Path!.Value)
	if (err == null) {
		return t
	}
	return ""
}

export function importName(s: Spec): string {
	let n = $.mustTypeAssert<ImportSpec | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})!.Name
	if (n == null) {
		return ""
	}
	return n!.Name
}

export function importComment(s: Spec): string {
	let c = $.mustTypeAssert<ImportSpec | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})!.Comment
	if (c == null) {
		return ""
	}
	return c!.Text()
}

// collapse indicates whether prev may be removed, leaving only next.
export function collapse(prev: Spec, next: Spec): boolean {
	if (importPath(next) != importPath(prev) || importName(next) != importName(prev)) {
		return false
	}
	return $.mustTypeAssert<ImportSpec | null>(prev, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})!.Comment == null
}

export function sortSpecs(fset: token.FileSet | null, f: File | null, specs: $.Slice<Spec>): $.Slice<Spec> {
	// Can't short-circuit here even if specs are already sorted,
	// since they might yet need deduplication.
	// A lone import, however, may be safely ignored.
	if ($.len(specs) <= 1) {
		return specs
	}

	// Record positions for specs.
	let pos = $.makeSlice<posSpan>($.len(specs))
	for (let i = 0; i < $.len(specs); i++) {
		const s = specs![i]
		{
			pos![i] = $.markAsStructValue(new posSpan({}))
		}
	}

	// Identify comments in this range.
	let begSpecs = pos![0].Start
	let endSpecs = pos![$.len(pos) - 1].End
	let beg = (await fset!.File(begSpecs))!.LineStart(lineAt(fset, begSpecs))
	let endLine = lineAt(fset, endSpecs)
	let endFile = await fset!.File(endSpecs)
	let end: token.Pos = 0

	// beginning of next line
	if (endLine == await endFile!.LineCount()) {
		end = endSpecs
	}
	 else {
		end = await endFile!.LineStart(endLine + 1) // beginning of next line
	}
	let first = $.len(f!.Comments)
	let last = -1

	// g.End() < end

	// comment is within the range [beg, end[ of import declarations
	for (let i = 0; i < $.len(f!.Comments); i++) {
		const g = f!.Comments![i]
		{
			if (g!.End() >= end) {
				break
			}
			// g.End() < end

			// comment is within the range [beg, end[ of import declarations
			if (beg <= g!.Pos()) {
				// comment is within the range [beg, end[ of import declarations
				if (i < first) {
					first = i
				}
				if (i > last) {
					last = i
				}
			}
		}
	}

	let comments: $.Slice<CommentGroup | null> = null
	if (last >= 0) {
		comments = $.goSlice(f!.Comments, first, last + 1)
	}

	// Assign each comment to the import spec on the same line.
	let importComments = new Map([])
	let specIndex = 0

	// A block comment can appear before the first import spec.

	// Or it can appear on the left of an import spec.
	for (let _i = 0; _i < $.len(comments); _i++) {
		const g = comments![_i]
		{
			for (; specIndex + 1 < $.len(specs) && pos![specIndex + 1].Start <= g!.Pos(); ) {
				specIndex++
			}
			let left: boolean = false
			// A block comment can appear before the first import spec.

			// Or it can appear on the left of an import spec.
			if (specIndex == 0 && pos![specIndex].Start > g!.Pos()) {
				left = true
			}
			 else if (specIndex + 1 < $.len(specs) && lineAt(fset, pos![specIndex].Start) + 1 == lineAt(fset, g!.Pos())) {
				specIndex++
				left = true
			}
			let s = $.mustTypeAssert<ImportSpec | null>(specs![specIndex], {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})
			$.mapSet(importComments, s, $.append($.mapGet(importComments, s, null)[0], $.markAsStructValue(new cgPos({cg: g, left: left}))))
		}
	}

	// Sort the import specs by import path.
	// Remove duplicates, when possible without data loss.
	// Reassign the import paths to have the same position sequence.
	// Reassign each comment to the spec on the same line.
	// Sort the comments by new position.
	slices.SortFunc(specs, (a: Spec, b: Spec): number => {
		let ipath = importPath(a)
		let jpath = importPath(b)
		let r = cmp.Compare(ipath, jpath)
		if (r != 0) {
			return r
		}
		let iname = importName(a)
		let jname = importName(b)
		r = cmp.Compare(iname, jname)
		if (r != 0) {
			return r
		}
		return cmp.Compare(importComment(a), importComment(b))
	})

	// Dedup. Thanks to our sorting, we can just consider
	// adjacent pairs of imports.
	let deduped = $.goSlice(specs, undefined, 0)
	for (let i = 0; i < $.len(specs); i++) {
		const s = specs![i]
		{
			if (i == $.len(specs) - 1 || !collapse(s, specs![i + 1])) {
				deduped = $.append(deduped, s)
			}
			 else {
				let p = s!.Pos()
				(await fset!.File(p))!.MergeLine(lineAt(fset, p))
			}
		}
	}
	specs = deduped

	// Fix up comment positions

	// An import spec can have both block comment and a line comment
	// to its right. In that case, both of them will have the same pos.
	// But while formatting the AST, the line comment gets moved to
	// after the block comment.
	for (let i = 0; i < $.len(specs); i++) {
		const s = specs![i]
		{
			let s = $.mustTypeAssert<ImportSpec | null>(s, {kind: $.TypeKind.Pointer, elemType: 'ImportSpec'})
			if (s!.Name != null) {
				s!.Name!.NamePos = pos![i].Start
			}
			s!.Path!.ValuePos = pos![i].Start
			s!.EndPos = pos![i].End

			// An import spec can have both block comment and a line comment
			// to its right. In that case, both of them will have the same pos.
			// But while formatting the AST, the line comment gets moved to
			// after the block comment.
			for (let _i = 0; _i < $.len($.mapGet(importComments, s, null)[0]); _i++) {
				const g = $.mapGet(importComments, s, null)[0]![_i]
				{

					// An import spec can have both block comment and a line comment
					// to its right. In that case, both of them will have the same pos.
					// But while formatting the AST, the line comment gets moved to
					// after the block comment.
					for (let _i = 0; _i < $.len(g.cg!.List); _i++) {
						const c = g.cg!.List![_i]
						{

							// An import spec can have both block comment and a line comment
							// to its right. In that case, both of them will have the same pos.
							// But while formatting the AST, the line comment gets moved to
							// after the block comment.
							if (g.left) {
								c!.Slash = pos![i].Start - 1
							}
							 else {
								// An import spec can have both block comment and a line comment
								// to its right. In that case, both of them will have the same pos.
								// But while formatting the AST, the line comment gets moved to
								// after the block comment.
								c!.Slash = pos![i].End
							}
						}
					}
				}
			}
		}
	}

	slices.SortFunc(comments, (a: CommentGroup | null, b: CommentGroup | null): number => {
		return cmp.Compare(a!.Pos(), b!.Pos())
	})

	return specs
}

