import * as $ from "@goscript/builtin/index.js"
import { bailout, parser } from "./parser.gs.js";

import * as bytes from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as ast from "@goscript/go/ast/index.js"

import * as token from "@goscript/go/token/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as os from "@goscript/os/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

import * as strings from "@goscript/strings/index.js"

// stop parsing after package clause
export let PackageClauseOnly: Mode = (1 << 0)

// stop parsing after import declarations
export let ImportsOnly: Mode = 0

// parse comments and add them to AST
export let ParseComments: Mode = 0

// print a trace of parsed productions
export let Trace: Mode = 0

// report declaration errors
export let DeclarationErrors: Mode = 0

// same as AllErrors, for backward-compatibility
export let SpuriousErrors: Mode = 0

// skip deprecated identifier resolution; see ParseFile
export let SkipObjectResolution: Mode = 0

// report all errors (not just the first 10 on different lines)
export let AllErrors: Mode = 32

export type Mode = number;

// If src != nil, readSource converts src to a []byte if possible;
// otherwise it returns an error. If src == nil, readSource returns
// the result of reading the file specified by filename.
export function readSource(filename: string, src: null | any): [$.Bytes, $.GoError] {

	// is io.Reader, but src is already available in []byte form
	if (src != null) {

		// is io.Reader, but src is already available in []byte form
		$.typeSwitch(src, [{ types: [{kind: $.TypeKind.Basic, name: 'string'}], body: (s) => {
			return [$.stringToBytes(s), null]
		}},
		{ types: [{kind: $.TypeKind.Slice, elemType: {kind: $.TypeKind.Basic, name: 'number'}}], body: (s) => {
			return [s, null]
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'bytes.Buffer'}], body: (s) => {
			if (s != null) {
				return [s!.Bytes(), null]
			}
		}},
		{ types: ['io.Reader'], body: (s) => {
			return io.ReadAll(s)
		}}])
		return [null, errors.New("invalid source")]
	}
	return os.ReadFile(filename)
}

// ParseFile parses the source code of a single Go source file and returns
// the corresponding [ast.File] node. The source code may be provided via
// the filename of the source file, or via the src parameter.
//
// If src != nil, ParseFile parses the source from src and the filename is
// only used when recording position information. The type of the argument
// for the src parameter must be string, []byte, or [io.Reader].
// If src == nil, ParseFile parses the file specified by filename.
//
// The mode parameter controls the amount of source text parsed and
// other optional parser functionality. If the [SkipObjectResolution]
// mode bit is set (recommended), the object resolution phase of
// parsing will be skipped, causing File.Scope, File.Unresolved, and
// all Ident.Obj fields to be nil. Those fields are deprecated; see
// [ast.Object] for details.
//
// Position information is recorded in the file set fset, which must not be
// nil.
//
// If the source couldn't be read, the returned AST is nil and the error
// indicates the specific failure. If the source was read but syntax
// errors were found, the result is a partial AST (with [ast.Bad]* nodes
// representing the fragments of erroneous source code). Multiple errors
// are returned via a scanner.ErrorList which is sorted by source position.
export async function ParseFile(fset: token.FileSet | null, filename: string, src: null | any, mode: Mode): Promise<[ast.File | null, $.GoError]> {
	let f: ast.File | null = null
	let err: $.GoError = null
	{
		await using __defer = new $.AsyncDisposableStack();
		if (fset == null) {
			$.panic("parser.ParseFile: no token.FileSet provided (fset == nil)")
		}

		// get source
		let text: $.Bytes
		[text, err] = readSource(filename, src)
		if (err != null) {
			return [null, err]
		}

		let file = await fset!.AddFile(filename, -1, $.len(text))

		let p: parser = new parser({})

		// resume same panic if it's not a bailout

		// set result values

		// source is not a valid Go source file - satisfy
		// ParseFile API and return a valid (but) empty
		// *ast.File

		// Ensure the start/end are consistent,
		// whether parsing succeeded or not.
		__defer.defer(async () => {
			{
				let e = $.recover()
				if (e != null) {
					// resume same panic if it's not a bailout
					let { value: bail, ok: ok } = $.typeAssert<bailout>(e, 'bailout')
					if (!ok) {
						$.panic(e)
					}
					 else if (bail.msg != "") {
						scanner.ErrorList_Add(p._fields.errors, await p.file!.Position(bail.pos), bail.msg)
					}
				}
			}
			if (f == null) {
				// source is not a valid Go source file - satisfy
				// ParseFile API and return a valid (but) empty
				// *ast.File
				f = new ast.File({Name: new ast.Ident(), Scope: null})
			}
			f!.FileStart = (file!.Base() as token.Pos)
			f!.FileEnd = (file!.Base() + file!.Size() as token.Pos)
			scanner.ErrorList_Sort(p.errors)
			err = scanner.ErrorList_Err(p.errors)
		});

		// parse source
		p.init(file, text, mode)
		f = p.parseFile()

		return [f, err]
	}
}

// ParseDir calls [ParseFile] for all files with names ending in ".go" in the
// directory specified by path and returns a map of package name -> package
// AST with all the packages found.
//
// If filter != nil, only the files with [fs.FileInfo] entries passing through
// the filter (and ending in ".go") are considered. The mode bits are passed
// to [ParseFile] unchanged. Position information is recorded in fset, which
// must not be nil.
//
// If the directory couldn't be read, a nil map and the respective error are
// returned. If a parse error occurred, a non-nil but incomplete map and the
// first error encountered are returned.
export async function ParseDir(fset: token.FileSet | null, path: string, filter: ((p0: fs.FileInfo) => boolean) | null, mode: Mode): Promise<[Map<string, ast.Package | null> | null, $.GoError]> {
	let pkgs: Map<string, ast.Package | null> | null = null
	let first: $.GoError = null
	{
		let [list, err] = os.ReadDir(path)
		if (err != null) {
			return [null, err]
		}

		pkgs = $.makeMap<string, ast.Package | null>()
		for (let _i = 0; _i < $.len(list); _i++) {
			const d = list![_i]
			{
				if (d!.IsDir() || !strings.HasSuffix(d!.Name(), ".go")) {
					continue
				}
				if (filter != null) {
					let [info, err] = d!.Info()
					if (err != null) {
						return [null, err]
					}
					if (!filter!(info)) {
						continue
					}
				}
				let filename = filepath.Join(path, d!.Name())
				{
					let [src, err] = await ParseFile(fset, filename, null, mode)
					if (err == null) {
						let name = src!.Name!.Name
						let [pkg, found] = $.mapGet(pkgs, name, null)
						if (!found) {
							pkg = new ast.Package({Files: $.makeMap<string, ast.File | null>(), Name: name})
							$.mapSet(pkgs, name, pkg)
						}
						$.mapSet(pkg!.Files, filename, src)
					}
					 else if (first == null) {
						first = err
					}
				}
			}
		}

		return [pkgs, first]
	}
}

// ParseExprFrom is a convenience function for parsing an expression.
// The arguments have the same meaning as for [ParseFile], but the source must
// be a valid Go (type or value) expression. Specifically, fset must not
// be nil.
//
// If the source couldn't be read, the returned AST is nil and the error
// indicates the specific failure. If the source was read but syntax
// errors were found, the result is a partial AST (with [ast.Bad]* nodes
// representing the fragments of erroneous source code). Multiple errors
// are returned via a scanner.ErrorList which is sorted by source position.
export async function ParseExprFrom(fset: token.FileSet | null, filename: string, src: null | any, mode: Mode): Promise<[ast.Expr, $.GoError]> {
	let expr: ast.Expr = null
	let err: $.GoError = null
	{
		await using __defer = new $.AsyncDisposableStack();
		if (fset == null) {
			$.panic("parser.ParseExprFrom: no token.FileSet provided (fset == nil)")
		}

		// get source
		let text: $.Bytes
		[text, err] = readSource(filename, src)
		if (err != null) {
			return [null, err]
		}

		let p: parser = new parser({})

		// resume same panic if it's not a bailout
		__defer.defer(async () => {
			{
				let e = $.recover()
				if (e != null) {
					// resume same panic if it's not a bailout
					let { value: bail, ok: ok } = $.typeAssert<bailout>(e, 'bailout')
					if (!ok) {
						$.panic(e)
					}
					 else if (bail.msg != "") {
						scanner.ErrorList_Add(p._fields.errors, await p.file!.Position(bail.pos), bail.msg)
					}
				}
			}
			scanner.ErrorList_Sort(p.errors)
			err = scanner.ErrorList_Err(p.errors)
		});

		// parse expr
		let file = await fset!.AddFile(filename, -1, $.len(text))
		p.init(file, text, mode)
		expr = p.parseRhs()

		// If a semicolon was inserted, consume it;
		// report an error if there's more tokens.
		if (p.tok == token.SEMICOLON && p.lit == "\n") {
			p.next()
		}
		p.expect(token.EOF)

		return [expr, err]
	}
}

// ParseExpr is a convenience function for obtaining the AST of an expression x.
// The position information recorded in the AST is undefined. The filename used
// in error messages is the empty string.
//
// If syntax errors were found, the result is a partial AST (with [ast.Bad]* nodes
// representing the fragments of erroneous source code). Multiple errors are
// returned via a scanner.ErrorList which is sorted by source position.
export async function ParseExpr(x: string): Promise<[ast.Expr, $.GoError]> {
	return await ParseExprFrom(token.NewFileSet(), "", $.stringToBytes(x), 0)
}

