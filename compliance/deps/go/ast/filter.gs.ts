import * as $ from "@goscript/builtin/index.js"
import { IsExported, NewIdent } from "./ast.gs.js";
import { ArrayType, ChanType, Comment, CommentGroup, CompositeLit, Decl, Expr, FieldList, File, FuncDecl, FuncType, GenDecl, Ident, ImportSpec, InterfaceType, KeyValueExpr, MapType, Package, ParenExpr, SelectorExpr, Spec, StarExpr, StructType, TypeSpec, ValueSpec } from "./ast.gs.js";

import * as token from "@goscript/go/token/index.js"

import * as slices from "@goscript/slices/index.js"

// If set, duplicate function declarations are excluded.
export let FilterFuncDuplicates: MergeMode = (1 << 0)

// If set, comments that are not associated with a specific
// AST node (as Doc or Comment) are excluded.
export let FilterUnassociatedComments: MergeMode = 0

// If set, duplicate import declarations are excluded.
export let FilterImportDuplicates: MergeMode = 0

export type Filter = ((p0: string) => boolean) | null;

export type MergeMode = number;

let separator: Comment | null = new Comment({})

// exportFilter is a special filter function to extract exported nodes.
export function exportFilter(name: string): boolean {
	return IsExported(name)
}

// FileExports trims the AST for a Go source file in place such that
// only exported nodes remain: all top-level identifiers which are not exported
// and their associated information (such as type, initial value, or function
// body) are removed. Non-exported fields and methods of exported types are
// stripped. The [File.Comments] list is not changed.
//
// FileExports reports whether there are exported declarations.
export function FileExports(src: File | null): boolean {
	return filterFile(src, exportFilter, true)
}

// PackageExports trims the AST for a Go package in place such that
// only exported nodes remain. The pkg.Files list is not changed, so that
// file names and top-level package comments don't get lost.
//
// PackageExports reports whether there are exported declarations;
// it returns false otherwise.
export function PackageExports(pkg: Package | null): boolean {
	return filterPackage(pkg, exportFilter, true)
}

export function filterIdentList(list: $.Slice<Ident | null>, f: Filter | null): $.Slice<Ident | null> {
	let j = 0
	for (let _i = 0; _i < $.len(list); _i++) {
		const x = list![_i]
		{
			if (f!(x!.Name)) {
				list![j] = x
				j++
			}
		}
	}
	return $.goSlice(list, 0, j)
}

// fieldName assumes that x is the type of an anonymous field and
// returns the corresponding field name. If x is not an acceptable
// anonymous field, the result is nil.
export function fieldName(x: Expr): Ident | null {
	$.typeSwitch(x, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'Ident'}], body: (t) => {
		return t
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SelectorExpr'}], body: (t) => {
		{
			let { ok: ok } = $.typeAssert<Ident | null>(t!.X, {kind: $.TypeKind.Pointer, elemType: 'Ident'})
			if (ok) {
				return t!.Sel
			}
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'StarExpr'}], body: (t) => {
		return fieldName(t!.X)
	}}])
	return null
}

export function filterFieldList(fields: FieldList | null, filter: Filter | null, _export: boolean): boolean {
	let removedFields: boolean = false
	{
		if (fields == null) {
			return false
		}
		let list = fields!.List
		let j = 0

		// anonymous field
		for (let _i = 0; _i < $.len(list); _i++) {
			const f = list![_i]
			{
				let keepField = false

				// anonymous field
				if ($.len(f!.Names) == 0) {
					// anonymous field
					let name = fieldName(f!.Type)
					keepField = name != null && filter!(name!.Name)
				}
				 else {
					let n = $.len(f!.Names)
					f!.Names = filterIdentList(f!.Names, filter)
					if ($.len(f!.Names) < n) {
						removedFields = true
					}
					keepField = $.len(f!.Names) > 0
				}
				if (keepField) {
					if (_export) {
						filterType(f!.Type, filter, _export)
					}
					list![j] = f
					j++
				}
			}
		}
		if (j < $.len(list)) {
			removedFields = true
		}
		fields!.List = $.goSlice(list, 0, j)
		return removedFields
	}
}

export function filterCompositeLit(lit: CompositeLit | null, filter: Filter | null, _export: boolean): void {
	let n = $.len(lit!.Elts)
	lit!.Elts = filterExprList(lit!.Elts, filter, _export)
	if ($.len(lit!.Elts) < n) {
		lit!.Incomplete = true
	}
}

export function filterExprList(list: $.Slice<Expr>, filter: Filter | null, _export: boolean): $.Slice<Expr> {
	let j = 0
	for (let _i = 0; _i < $.len(list); _i++) {
		const exp = list![_i]
		{
			$.typeSwitch(exp, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'CompositeLit'}], body: (x) => {
				filterCompositeLit(x, filter, _export)
			}},
			{ types: [{kind: $.TypeKind.Pointer, elemType: 'KeyValueExpr'}], body: (x) => {
				const _temp_x = x
				{
					let { value: x, ok: ok } = $.typeAssert<Ident | null>(_temp_x.Key, {kind: $.TypeKind.Pointer, elemType: 'Ident'})
					if (ok && !filter!(x!.Name)) {
						continue
					}
				}
				const _temp_x = x
				{
					let { value: x, ok: ok } = $.typeAssert<CompositeLit | null>(_temp_x.Value, {kind: $.TypeKind.Pointer, elemType: 'CompositeLit'})
					if (ok) {
						filterCompositeLit(x, filter, _export)
					}
				}
			}}])
			list![j] = exp
			j++
		}
	}
	return $.goSlice(list, 0, j)
}

export function filterParamList(fields: FieldList | null, filter: Filter | null, _export: boolean): boolean {
	if (fields == null) {
		return false
	}
	let b: boolean = false
	for (let _i = 0; _i < $.len(fields!.List); _i++) {
		const f = fields!.List![_i]
		{
			if (filterType(f!.Type, filter, _export)) {
				b = true
			}
		}
	}
	return b
}

export function filterType(typ: Expr, f: Filter | null, _export: boolean): boolean {
	$.typeSwitch(typ, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'Ident'}], body: (t) => {
		return f!(t!.Name)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ParenExpr'}], body: (t) => {
		return filterType(t!.X, f, _export)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ArrayType'}], body: (t) => {
		return filterType(t!.Elt, f, _export)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'StructType'}], body: (t) => {
		if (filterFieldList(t!.Fields, f, _export)) {
			t!.Incomplete = true
		}
		return $.len(t!.Fields!.List) > 0
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncType'}], body: (t) => {
		let b1 = filterParamList(t!.Params, f, _export)
		let b2 = filterParamList(t!.Results, f, _export)
		return b1 || b2
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'InterfaceType'}], body: (t) => {
		if (filterFieldList(t!.Methods, f, _export)) {
			t!.Incomplete = true
		}
		return $.len(t!.Methods!.List) > 0
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'MapType'}], body: (t) => {
		let b1 = filterType(t!.Key, f, _export)
		let b2 = filterType(t!.Value, f, _export)
		return b1 || b2
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ChanType'}], body: (t) => {
		return filterType(t!.Value, f, _export)
	}}])
	return false
}

export function filterSpec(spec: Spec, f: Filter | null, _export: boolean): boolean {

	// For general filtering (not just exports),
	// filter type even if name is not filtered
	// out.
	// If the type contains filtered elements,
	// keep the declaration.
	$.typeSwitch(spec, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ValueSpec'}], body: (s) => {
		s!.Names = filterIdentList(s!.Names, f)
		s!.Values = filterExprList(s!.Values, f, _export)
		if ($.len(s!.Names) > 0) {
			if (_export) {
				filterType(s!.Type, f, _export)
			}
			return true
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TypeSpec'}], body: (s) => {
		if (f!(s!.Name!.Name)) {
			if (_export) {
				filterType(s!.Type, f, _export)
			}
			return true
		}
		if (!_export) {
			// For general filtering (not just exports),
			// filter type even if name is not filtered
			// out.
			// If the type contains filtered elements,
			// keep the declaration.
			return filterType(s!.Type, f, _export)
		}
	}}])
	return false
}

export function filterSpecList(list: $.Slice<Spec>, f: Filter | null, _export: boolean): $.Slice<Spec> {
	let j = 0
	for (let _i = 0; _i < $.len(list); _i++) {
		const s = list![_i]
		{
			if (filterSpec(s, f, _export)) {
				list![j] = s
				j++
			}
		}
	}
	return $.goSlice(list, 0, j)
}

// FilterDecl trims the AST for a Go declaration in place by removing
// all names (including struct field and interface method names, but
// not from parameter lists) that don't pass through the filter f.
//
// FilterDecl reports whether there are any declared names left after
// filtering.
export function FilterDecl(decl: Decl, f: Filter | null): boolean {
	return filterDecl(decl, f, false)
}

export function filterDecl(decl: Decl, f: Filter | null, _export: boolean): boolean {
	$.typeSwitch(decl, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'GenDecl'}], body: (d) => {
		d!.Specs = filterSpecList(d!.Specs, f, _export)
		return $.len(d!.Specs) > 0
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncDecl'}], body: (d) => {
		return f!(d!.Name!.Name)
	}}])
	return false
}

// FilterFile trims the AST for a Go file in place by removing all
// names from top-level declarations (including struct field and
// interface method names, but not from parameter lists) that don't
// pass through the filter f. If the declaration is empty afterwards,
// the declaration is removed from the AST. Import declarations are
// always removed. The [File.Comments] list is not changed.
//
// FilterFile reports whether there are any top-level declarations
// left after filtering.
export function FilterFile(src: File | null, f: Filter | null): boolean {
	return filterFile(src, f, false)
}

export function filterFile(src: File | null, f: Filter | null, _export: boolean): boolean {
	let j = 0
	for (let _i = 0; _i < $.len(src!.Decls); _i++) {
		const d = src!.Decls![_i]
		{
			if (filterDecl(d, f, _export)) {
				src!.Decls![j] = d
				j++
			}
		}
	}
	src!.Decls = $.goSlice(src!.Decls, 0, j)
	return j > 0
}

// FilterPackage trims the AST for a Go package in place by removing
// all names from top-level declarations (including struct field and
// interface method names, but not from parameter lists) that don't
// pass through the filter f. If the declaration is empty afterwards,
// the declaration is removed from the AST. The pkg.Files list is not
// changed, so that file names and top-level package comments don't get
// lost.
//
// FilterPackage reports whether there are any top-level declarations
// left after filtering.
export function FilterPackage(pkg: Package | null, f: Filter | null): boolean {
	return filterPackage(pkg, f, false)
}

export function filterPackage(pkg: Package | null, f: Filter | null, _export: boolean): boolean {
	let hasDecls = false
	for (const [_k, src] of pkg!.Files?.entries() ?? []) {
		{
			if (filterFile(src, f, _export)) {
				hasDecls = true
			}
		}
	}
	return hasDecls
}

// nameOf returns the function (foo) or method name (foo.bar) for
// the given function declaration. If the AST is incorrect for the
// receiver, it assumes a function instead.
export function nameOf(f: FuncDecl | null): string {

	// looks like a correct receiver declaration

	// dereference pointer receiver types

	// the receiver type must be a type name

	// otherwise assume a function instead
	{
		let r = f!.Recv
		if (r != null && $.len(r!.List) == 1) {
			// looks like a correct receiver declaration
			let t = r!.List![0]!.Type
			// dereference pointer receiver types
			{
				let { value: p } = $.typeAssert<StarExpr | null>(t, {kind: $.TypeKind.Pointer, elemType: 'StarExpr'})
				if (p != null) {
					t = p!.X
				}
			}
			// the receiver type must be a type name

			// otherwise assume a function instead
			{
				let { value: p } = $.typeAssert<Ident | null>(t, {kind: $.TypeKind.Pointer, elemType: 'Ident'})
				if (p != null) {
					return p!.Name + "." + f!.Name!.Name
				}
			}
			// otherwise assume a function instead
		}
	}
	return f!.Name!.Name
}

// MergePackageFiles creates a file AST by merging the ASTs of the
// files belonging to a package. The mode flags control merging behavior.
export function MergePackageFiles(pkg: Package | null, mode: MergeMode): File | null {
	// Count the number of package docs, comments and declarations across
	// all package files. Also, compute sorted list of filenames, so that
	// subsequent iterations can always iterate in the same order.
	let ndocs = 0
	let ncomments = 0
	let ndecls = 0
	let filenames = $.makeSlice<string>($.len(pkg!.Files), undefined, 'string')
	let minPos: token.Pos = 0
	let maxPos: token.Pos = 0
	let i = 0

	// +1 for separator
	for (const [filename, f] of pkg!.Files?.entries() ?? []) {
		{
			filenames![i] = filename
			i++

			// +1 for separator
			if (f!.Doc != null) {
				ndocs += $.len(f!.Doc!.List) + 1 // +1 for separator
			}
			ncomments += $.len(f!.Comments)
			ndecls += $.len(f!.Decls)
			if (i == 0 || f!.FileStart < minPos) {
				minPos = f!.FileStart
			}
			if (i == 0 || f!.FileEnd > maxPos) {
				maxPos = f!.FileEnd
			}
		}
	}
	slices.Sort(filenames)

	// Collect package comments from all package files into a single
	// CommentGroup - the collected package documentation. In general
	// there should be only one file with a package comment; but it's
	// better to collect extra comments than drop them on the floor.
	let doc: CommentGroup | null = null
	let pos: token.Pos = 0

	// -1: no separator before first group

	// not the first group - add separator

	// Keep the maximum package clause position as
	// position for the package clause of the merged
	// files.
	if (ndocs > 0) {
		let list = $.makeSlice<Comment | null>(ndocs - 1) // -1: no separator before first group
		let i = 0

		// not the first group - add separator

		// Keep the maximum package clause position as
		// position for the package clause of the merged
		// files.
		for (let _i = 0; _i < $.len(filenames); _i++) {
			const filename = filenames![_i]
			{
				let f = $.mapGet(pkg!.Files, filename, null)[0]

				// not the first group - add separator

				// Keep the maximum package clause position as
				// position for the package clause of the merged
				// files.
				if (f!.Doc != null) {

					// not the first group - add separator
					if (i > 0) {
						// not the first group - add separator
						list![i] = separator
						i++
					}
					for (let _i = 0; _i < $.len(f!.Doc!.List); _i++) {
						const c = f!.Doc!.List![_i]
						{
							list![i] = c
							i++
						}
					}

					// Keep the maximum package clause position as
					// position for the package clause of the merged
					// files.
					if (f!.Package > pos) {
						// Keep the maximum package clause position as
						// position for the package clause of the merged
						// files.
						pos = f!.Package
					}
				}
			}
		}
		doc = new CommentGroup({})
	}

	// Collect declarations from all package files.
	let decls: $.Slice<Decl> = null

	// map of func name -> decls index
	// current index
	// number of filtered entries

	// A language entity may be declared multiple
	// times in different package files; only at
	// build time declarations must be unique.
	// For now, exclude multiple declarations of
	// functions - keep the one with documentation.
	//
	// TODO(gri): Expand this filtering to other
	//            entities (const, type, vars) if
	//            multiple declarations are common.

	// function declared already

	// existing declaration has no documentation;
	// ignore the existing declaration

	// ignore the new declaration

	// filtered an entry

	// Eliminate nil entries from the decls list if entries were
	// filtered. We do this using a 2nd pass in order to not disturb
	// the original declaration order in the source (otherwise, this
	// would also invalidate the monotonically increasing position
	// info within a single file).
	if (ndecls > 0) {
		decls = $.makeSlice<Decl>(ndecls)
		let funcs = $.makeMap<string, number>() // map of func name -> decls index
		let i = 0 // current index
		let n = 0 // number of filtered entries

		// A language entity may be declared multiple
		// times in different package files; only at
		// build time declarations must be unique.
		// For now, exclude multiple declarations of
		// functions - keep the one with documentation.
		//
		// TODO(gri): Expand this filtering to other
		//            entities (const, type, vars) if
		//            multiple declarations are common.

		// function declared already

		// existing declaration has no documentation;
		// ignore the existing declaration

		// ignore the new declaration

		// filtered an entry
		for (let _i = 0; _i < $.len(filenames); _i++) {
			const filename = filenames![_i]
			{
				let f = $.mapGet(pkg!.Files, filename, null)[0]

				// A language entity may be declared multiple
				// times in different package files; only at
				// build time declarations must be unique.
				// For now, exclude multiple declarations of
				// functions - keep the one with documentation.
				//
				// TODO(gri): Expand this filtering to other
				//            entities (const, type, vars) if
				//            multiple declarations are common.

				// function declared already

				// existing declaration has no documentation;
				// ignore the existing declaration

				// ignore the new declaration

				// filtered an entry
				for (let _i = 0; _i < $.len(f!.Decls); _i++) {
					const d = f!.Decls![_i]
					{

						// A language entity may be declared multiple
						// times in different package files; only at
						// build time declarations must be unique.
						// For now, exclude multiple declarations of
						// functions - keep the one with documentation.
						//
						// TODO(gri): Expand this filtering to other
						//            entities (const, type, vars) if
						//            multiple declarations are common.

						// function declared already

						// existing declaration has no documentation;
						// ignore the existing declaration

						// ignore the new declaration

						// filtered an entry
						if ((mode & 1) != 0) {
							// A language entity may be declared multiple
							// times in different package files; only at
							// build time declarations must be unique.
							// For now, exclude multiple declarations of
							// functions - keep the one with documentation.
							//
							// TODO(gri): Expand this filtering to other
							//            entities (const, type, vars) if
							//            multiple declarations are common.

							// function declared already

							// existing declaration has no documentation;
							// ignore the existing declaration

							// ignore the new declaration

							// filtered an entry
							{
								let { value: f, ok: isFun } = $.typeAssert<FuncDecl | null>(d, {kind: $.TypeKind.Pointer, elemType: 'FuncDecl'})
								if (isFun) {
									let name = nameOf(f)

									// function declared already

									// existing declaration has no documentation;
									// ignore the existing declaration

									// ignore the new declaration

									// filtered an entry
									{
										let [j, exists] = $.mapGet(funcs, name, 0)
										if (exists) {
											// function declared already

											// existing declaration has no documentation;
											// ignore the existing declaration

											// ignore the new declaration
											if (decls![j] != null && $.mustTypeAssert<FuncDecl | null>(decls![j], {kind: $.TypeKind.Pointer, elemType: 'FuncDecl'})!.Doc == null) {
												// existing declaration has no documentation;
												// ignore the existing declaration
												decls![j] = null
											}
											 else {
												// ignore the new declaration
												d = null
											}
											n++
										}
										 else {
											$.mapSet(funcs, name, i)
										}
									}
								}
							}
						}
						decls![i] = d
						i++
					}
				}
			}
		}

		// Eliminate nil entries from the decls list if entries were
		// filtered. We do this using a 2nd pass in order to not disturb
		// the original declaration order in the source (otherwise, this
		// would also invalidate the monotonically increasing position
		// info within a single file).
		if (n > 0) {
			i = 0
			for (let _i = 0; _i < $.len(decls); _i++) {
				const d = decls![_i]
				{
					if (d != null) {
						decls![i] = d
						i++
					}
				}
			}
			decls = $.goSlice(decls, 0, i)
		}
	}

	// Collect import specs from all package files.
	let imports: $.Slice<ImportSpec | null> = null

	// TODO: consider handling cases where:
	// - 2 imports exist with the same import path but
	//   have different local names (one should probably
	//   keep both of them)
	// - 2 imports exist but only one has a comment
	// - 2 imports exist and they both have (possibly
	//   different) comments

	// Iterate over filenames for deterministic order.
	if ((mode & 4) != 0) {
		let seen = $.makeMap<string, boolean>()

		// TODO: consider handling cases where:
		// - 2 imports exist with the same import path but
		//   have different local names (one should probably
		//   keep both of them)
		// - 2 imports exist but only one has a comment
		// - 2 imports exist and they both have (possibly
		//   different) comments
		for (let _i = 0; _i < $.len(filenames); _i++) {
			const filename = filenames![_i]
			{
				let f = $.mapGet(pkg!.Files, filename, null)[0]

				// TODO: consider handling cases where:
				// - 2 imports exist with the same import path but
				//   have different local names (one should probably
				//   keep both of them)
				// - 2 imports exist but only one has a comment
				// - 2 imports exist and they both have (possibly
				//   different) comments
				for (let _i = 0; _i < $.len(f!.Imports); _i++) {
					const imp = f!.Imports![_i]
					{

						// TODO: consider handling cases where:
						// - 2 imports exist with the same import path but
						//   have different local names (one should probably
						//   keep both of them)
						// - 2 imports exist but only one has a comment
						// - 2 imports exist and they both have (possibly
						//   different) comments
						{
							let path = imp!.Path!.Value
							if (!$.mapGet(seen, path, false)[0]) {
								// TODO: consider handling cases where:
								// - 2 imports exist with the same import path but
								//   have different local names (one should probably
								//   keep both of them)
								// - 2 imports exist but only one has a comment
								// - 2 imports exist and they both have (possibly
								//   different) comments
								imports = $.append(imports, imp)
								$.mapSet(seen, path, true)
							}
						}
					}
				}
			}
		}
	}
	 else {
		// Iterate over filenames for deterministic order.
		for (let _i = 0; _i < $.len(filenames); _i++) {
			const filename = filenames![_i]
			{
				let f = $.mapGet(pkg!.Files, filename, null)[0]
				imports = $.append(imports, f!.Imports)
			}
		}
	}

	// Collect comments from all package files.
	let comments: $.Slice<CommentGroup | null> = null
	if ((mode & 2) == 0) {
		comments = $.makeSlice<CommentGroup | null>(ncomments)
		let i = 0
		for (let _i = 0; _i < $.len(filenames); _i++) {
			const filename = filenames![_i]
			{
				let f = $.mapGet(pkg!.Files, filename, null)[0]
				i += $.copy($.goSlice(comments, i, undefined), f!.Comments)
			}
		}
	}

	// TODO(gri) need to compute unresolved identifiers!
	return new File({})
}

