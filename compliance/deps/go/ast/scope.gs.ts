import * as $ from "@goscript/builtin/index.js"
import { AssignStmt, Field, FuncDecl, Ident, ImportSpec, LabeledStmt, TypeSpec, ValueSpec } from "./ast.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as token from "@goscript/go/token/index.js"

import * as strings from "@goscript/strings/index.js"

// for error handling
export let Bad: ObjKind = 0

// package
export let Pkg: ObjKind = 0

// constant
export let Con: ObjKind = 0

// type
export let Typ: ObjKind = 0

// variable
export let Var: ObjKind = 0

// function or method
export let Fun: ObjKind = 0

// label
export let Lbl: ObjKind = 0

export type ObjKind = number;

export function ObjKind_String(kind: ObjKind): string {
	return objKindStrings![kind]
}


export class Scope {
	public get Outer(): Scope | null {
		return this._fields.Outer.value
	}
	public set Outer(value: Scope | null) {
		this._fields.Outer.value = value
	}

	public get Objects(): Map<string, Object | null> | null {
		return this._fields.Objects.value
	}
	public set Objects(value: Map<string, Object | null> | null) {
		this._fields.Objects.value = value
	}

	public _fields: {
		Outer: $.VarRef<Scope | null>;
		Objects: $.VarRef<Map<string, Object | null> | null>;
	}

	constructor(init?: Partial<{Objects?: Map<string, Object | null> | null, Outer?: Scope | null}>) {
		this._fields = {
			Outer: $.varRef(init?.Outer ?? null),
			Objects: $.varRef(init?.Objects ?? null)
		}
	}

	public clone(): Scope {
		const cloned = new Scope()
		cloned._fields = {
			Outer: $.varRef(this._fields.Outer.value ? $.markAsStructValue(this._fields.Outer.value.clone()) : null),
			Objects: $.varRef(this._fields.Objects.value)
		}
		return cloned
	}

	// Lookup returns the object with the given name if it is
	// found in scope s, otherwise it returns nil. Outer scopes
	// are ignored.
	public Lookup(name: string): Object | null {
		const s = this
		return $.mapGet(s.Objects, name, null)[0]
	}

	// Insert attempts to insert a named object obj into the scope s.
	// If the scope already contains an object alt with the same name,
	// Insert leaves the scope unchanged and returns alt. Otherwise
	// it inserts obj and returns nil.
	public Insert(obj: Object | null): Object | null {
		const s = this
		let alt: Object | null = null
		{
			alt = $.mapGet(s.Objects, obj!.Name, null)[0]
			if (alt == null) {
				$.mapSet(s.Objects, obj!.Name, obj)
			}
		}
		return alt
	}

	// Debugging support
	public String(): string {
		const s = this
		let buf: strings.Builder = new strings.Builder()
		fmt.Fprintf(buf, "scope %p {", s)
		if (s != null && $.len(s.Objects) > 0) {
			fmt.Fprintln(buf)
			for (const [_k, obj] of s.Objects?.entries() ?? []) {
				{
					fmt.Fprintf(buf, "\t%s %s\n", obj!.Kind, obj!.Name)
				}
			}
		}
		fmt.Fprintf(buf, "}\n")
		return buf.String()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Scope',
	  new Scope(),
	  [{ name: "Lookup", args: [{ name: "name", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Object" } }] }, { name: "Insert", args: [{ name: "obj", type: { kind: $.TypeKind.Pointer, elemType: "Object" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "Object" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Scope,
	  {"Outer": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "Objects": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "Object" } }}
	);
}

export class Object {
	public get Kind(): ObjKind {
		return this._fields.Kind.value
	}
	public set Kind(value: ObjKind) {
		this._fields.Kind.value = value
	}

	// declared name
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	// corresponding Field, XxxSpec, FuncDecl, LabeledStmt, AssignStmt, Scope; or nil
	public get Decl(): null | any {
		return this._fields.Decl.value
	}
	public set Decl(value: null | any) {
		this._fields.Decl.value = value
	}

	// object-specific data; or nil
	public get Data(): null | any {
		return this._fields.Data.value
	}
	public set Data(value: null | any) {
		this._fields.Data.value = value
	}

	// placeholder for type information; may be nil
	public get Type(): null | any {
		return this._fields.Type.value
	}
	public set Type(value: null | any) {
		this._fields.Type.value = value
	}

	public _fields: {
		Kind: $.VarRef<ObjKind>;
		Name: $.VarRef<string>;
		Decl: $.VarRef<null | any>;
		Data: $.VarRef<null | any>;
		Type: $.VarRef<null | any>;
	}

	constructor(init?: Partial<{Data?: null | any, Decl?: null | any, Kind?: ObjKind, Name?: string, Type?: null | any}>) {
		this._fields = {
			Kind: $.varRef(init?.Kind ?? 0 as ObjKind),
			Name: $.varRef(init?.Name ?? ""),
			Decl: $.varRef(init?.Decl ?? null),
			Data: $.varRef(init?.Data ?? null),
			Type: $.varRef(init?.Type ?? null)
		}
	}

	public clone(): Object {
		const cloned = new Object()
		cloned._fields = {
			Kind: $.varRef(this._fields.Kind.value),
			Name: $.varRef(this._fields.Name.value),
			Decl: $.varRef(this._fields.Decl.value),
			Data: $.varRef(this._fields.Data.value),
			Type: $.varRef(this._fields.Type.value)
		}
		return cloned
	}

	// Pos computes the source position of the declaration of an object name.
	// The result may be an invalid position if it cannot be computed
	// (obj.Decl may be nil or not correct).
	public Pos(): token.Pos {
		const obj = this
		let name = obj.Name
		$.typeSwitch(obj.Decl, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'Field'}], body: (d) => {
			for (let _i = 0; _i < $.len(d!.Names); _i++) {
				const n = d!.Names![_i]
				{
					if (n!.Name == name) {
						return n!.Pos()
					}
				}
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ImportSpec'}], body: (d) => {
			if (d!.Name != null && d!.Name!.Name == name) {
				return d!.Name!.Pos()
			}
			return d!.Path!.Pos()
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ValueSpec'}], body: (d) => {
			for (let _i = 0; _i < $.len(d!.Names); _i++) {
				const n = d!.Names![_i]
				{
					if (n!.Name == name) {
						return n!.Pos()
					}
				}
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'TypeSpec'}], body: (d) => {
			if (d!.Name!.Name == name) {
				return d!.Name!.Pos()
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncDecl'}], body: (d) => {
			if (d!.Name!.Name == name) {
				return d!.Name!.Pos()
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'LabeledStmt'}], body: (d) => {
			if (d!.Label!.Name == name) {
				return d!.Label!.Pos()
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'AssignStmt'}], body: (d) => {
			for (let _i = 0; _i < $.len(d!.Lhs); _i++) {
				const x = d!.Lhs![_i]
				{
					{
						let { value: ident, ok: isIdent } = $.typeAssert<Ident | null>(x, {kind: $.TypeKind.Pointer, elemType: 'Ident'})
						if (isIdent && ident!.Name == name) {
							return ident!.Pos()
						}
					}
				}
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'Scope'}], body: (d) => {}}])
		return token.NoPos
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'Object',
	  new Object(),
	  [{ name: "Pos", args: [], returns: [{ type: "Pos" }] }],
	  Object,
	  {"Kind": "ObjKind", "Name": { kind: $.TypeKind.Basic, name: "string" }, "Decl": { kind: $.TypeKind.Interface, methods: [] }, "Data": { kind: $.TypeKind.Interface, methods: [] }, "Type": { kind: $.TypeKind.Interface, methods: [] }}
	);
}

let objKindStrings = $.arrayToSlice<string>(["bad", "package", "const", "type", "var", "func", "label"])

// NewScope creates a new scope nested in the outer scope.
export function NewScope(outer: Scope | null): Scope | null {
	// initial scope capacity
	let n: number = 4
	return new Scope({})
}

// NewObj creates a new object of a given kind and name.
export function NewObj(kind: ObjKind, name: string): Object | null {
	return new Object({Kind: kind, Name: name})
}

