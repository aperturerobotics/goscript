import * as $ from "@goscript/builtin/index.js"
import { NewObj, NewScope } from "./scope.gs.js";
import { File, Ident, Package } from "./ast.gs.js";
import { Object, Scope } from "./scope.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as scanner from "@goscript/go/scanner/index.js"

import * as token from "@goscript/go/token/index.js"

import * as strconv from "@goscript/strconv/index.js"

export type Importer = ((imports: Map<string, Object | null> | null, path: string) => [Object | null, $.GoError]) | null;

export class pkgBuilder {
	public get fset(): token.FileSet | null {
		return this._fields.fset.value
	}
	public set fset(value: token.FileSet | null) {
		this._fields.fset.value = value
	}

	public get errors(): scanner.ErrorList {
		return this._fields.errors.value
	}
	public set errors(value: scanner.ErrorList) {
		this._fields.errors.value = value
	}

	public _fields: {
		fset: $.VarRef<token.FileSet | null>;
		errors: $.VarRef<scanner.ErrorList>;
	}

	constructor(init?: Partial<{errors?: scanner.ErrorList, fset?: token.FileSet | null}>) {
		this._fields = {
			fset: $.varRef(init?.fset ?? null),
			errors: $.varRef(init?.errors ?? null as scanner.ErrorList)
		}
	}

	public clone(): pkgBuilder {
		const cloned = new pkgBuilder()
		cloned._fields = {
			fset: $.varRef(this._fields.fset.value ? $.markAsStructValue(this._fields.fset.value.clone()) : null),
			errors: $.varRef(this._fields.errors.value)
		}
		return cloned
	}

	public error(pos: token.Pos, msg: string): void {
		const p = this
		scanner.ErrorList_Add(p._fields.errors, await p.fset!.Position(pos), msg)
	}

	public errorf(pos: token.Pos, format: string, ...args: any[]): void {
		const p = this
		p.error(pos, fmt.Sprintf(format, ...(args ?? [])))
	}

	public _declare(scope: Scope | null, altScope: Scope | null, obj: Object | null): void {
		const p = this
		let alt = scope!.Insert(obj)
		if (alt == null && altScope != null) {
			// see if there is a conflicting declaration in altScope
			alt = altScope!.Lookup(obj!.Name)
		}
		if (alt != null) {
			let prevDecl = ""
			{
				let pos = alt!.Pos()
				if (token.Pos_IsValid(pos)) {
					prevDecl = fmt.Sprintf("\n\tprevious declaration at %s", await p.fset!.Position(pos))
				}
			}
			p.error(obj!.Pos(), fmt.Sprintf("%s redeclared in this block%s", obj!.Name, prevDecl))
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'pkgBuilder',
	  new pkgBuilder(),
	  [{ name: "error", args: [{ name: "pos", type: "Pos" }, { name: "msg", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "errorf", args: [{ name: "pos", type: "Pos" }, { name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "declare", args: [{ name: "scope", type: { kind: $.TypeKind.Pointer, elemType: "Scope" } }, { name: "altScope", type: { kind: $.TypeKind.Pointer, elemType: "Scope" } }, { name: "obj", type: { kind: $.TypeKind.Pointer, elemType: "Object" } }], returns: [] }],
	  pkgBuilder,
	  {"fset": { kind: $.TypeKind.Pointer, elemType: "FileSet" }, "errors": "ErrorList"}
	);
}

export function resolve(scope: Scope | null, ident: Ident | null): boolean {
	for (; scope != null; scope = scope!.Outer) {
		{
			let obj = scope!.Lookup(ident!.Name)
			if (obj != null) {
				ident!.Obj = obj
				return true
			}
		}
	}
	return false
}

// NewPackage creates a new [Package] node from a set of [File] nodes. It resolves
// unresolved identifiers across files and updates each file's Unresolved list
// accordingly. If a non-nil importer and universe scope are provided, they are
// used to resolve identifiers not declared in any of the package files. Any
// remaining unresolved identifiers are reported as undeclared. If the files
// belong to different packages, one package name is selected and files with
// different package names are reported and then ignored.
// The result is a package node and a [scanner.ErrorList] if there were errors.
//
// Deprecated: use the type checker [go/types] instead; see [Object].
export function NewPackage(fset: token.FileSet | null, files: Map<string, File | null> | null, importer: Importer | null, universe: Scope | null): [Package | null, $.GoError] {
	let p: pkgBuilder = new pkgBuilder({})
	p.fset = fset

	// complete package scope
	let pkgName = ""
	let pkgScope = NewScope(universe)

	// package names must match

	// ignore this file

	// collect top-level file objects in package scope
	for (const [_k, file] of files?.entries() ?? []) {
		{
			// package names must match

			// ignore this file
			{let name = file!.Name!.Name
				switch (true) {
					case pkgName == "":
						pkgName = name
						break
					case name != pkgName:
						p.errorf(file!.Package, "package %s; expected %s", name, pkgName)
						continue
						break
				}
			}
			// collect top-level file objects in package scope
			for (const [_k, obj] of file!.Scope!.Objects?.entries() ?? []) {
				{
					p._declare(pkgScope, null, obj)
				}
			}
		}
	}

	// package global mapping of imported package ids to package objects
	let imports = $.makeMap<string, Object | null>()

	// complete file scopes with imports and resolve identifiers

	// ignore file if it belongs to a different package
	// (error has already been reported)

	// build file scope by processing all imports

	// TODO(gri) If a local package name != "." is provided,
	// global identifier resolution could proceed even if the
	// import failed. Consider adjusting the logic here a bit.

	// local name overrides imported package name

	// add import to file scope

	// merge imported scope with file scope

	// declare imported package object in file scope
	// (do not re-use pkg in the file scope but create
	// a new object instead; the Decl field is different
	// for different files)

	// resolve identifiers

	// don't use the universe scope without correct imports
	// (objects in the universe may be shadowed by imports;
	// with missing imports, identifiers might get resolved
	// incorrectly to universe objects)

	// reset universe scope
	for (const [_k, file] of files?.entries() ?? []) {
		{
			// ignore file if it belongs to a different package
			// (error has already been reported)
			if (file!.Name!.Name != pkgName) {
				continue
			}

			// build file scope by processing all imports
			let importErrors = false
			let fileScope = NewScope(pkgScope)

			// TODO(gri) If a local package name != "." is provided,
			// global identifier resolution could proceed even if the
			// import failed. Consider adjusting the logic here a bit.

			// local name overrides imported package name

			// add import to file scope

			// merge imported scope with file scope

			// declare imported package object in file scope
			// (do not re-use pkg in the file scope but create
			// a new object instead; the Decl field is different
			// for different files)
			for (let _i = 0; _i < $.len(file!.Imports); _i++) {
				const spec = file!.Imports![_i]
				{
					if (importer == null) {
						importErrors = true
						continue
					}
					let [path, ] = strconv.Unquote(spec!.Path!.Value)
					let [pkg, err] = importer!(imports, path)

					// TODO(gri) If a local package name != "." is provided,
					// global identifier resolution could proceed even if the
					// import failed. Consider adjusting the logic here a bit.
					if (err != null) {
						p.errorf(spec!.Path!.Pos(), "could not import %s (%s)", path, err)
						importErrors = true
						continue
					}

					// local name overrides imported package name
					let name = pkg!.Name
					if (spec!.Name != null) {
						name = spec!.Name!.Name
					}

					// add import to file scope

					// merge imported scope with file scope

					// declare imported package object in file scope
					// (do not re-use pkg in the file scope but create
					// a new object instead; the Decl field is different
					// for different files)
					if (name == ".") {
						// merge imported scope with file scope
						for (const [_k, obj] of $.mustTypeAssert<Scope | null>(pkg!.Data, {kind: $.TypeKind.Pointer, elemType: 'Scope'})!.Objects?.entries() ?? []) {
							{
								p._declare(fileScope, pkgScope, obj)
							}
						}
					}
					 else if (name != "_") {
						// declare imported package object in file scope
						// (do not re-use pkg in the file scope but create
						// a new object instead; the Decl field is different
						// for different files)
						let obj = NewObj(1, name)
						obj!.Decl = spec
						obj!.Data = pkg!.Data
						p._declare(fileScope, pkgScope, obj)
					}
				}
			}

			// resolve identifiers

			// don't use the universe scope without correct imports
			// (objects in the universe may be shadowed by imports;
			// with missing imports, identifiers might get resolved
			// incorrectly to universe objects)
			if (importErrors) {
				// don't use the universe scope without correct imports
				// (objects in the universe may be shadowed by imports;
				// with missing imports, identifiers might get resolved
				// incorrectly to universe objects)
				pkgScope!.Outer = null
			}
			let i = 0
			for (let _i = 0; _i < $.len(file!.Unresolved); _i++) {
				const ident = file!.Unresolved![_i]
				{
					if (!resolve(fileScope, ident)) {
						p.errorf(ident!.Pos(), "undeclared name: %s", ident!.Name)
						file!.Unresolved![i] = ident
						i++
					}

				}
			}
			file!.Unresolved = $.goSlice(file!.Unresolved, 0, i)
			pkgScope!.Outer = universe // reset universe scope
		}
	}

	scanner.ErrorList_Sort(p.errors)
	return [new Package({}), scanner.ErrorList_Err(p.errors)]
}

