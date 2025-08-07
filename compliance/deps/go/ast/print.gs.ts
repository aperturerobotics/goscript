import * as $ from "@goscript/builtin/index.js"
import { IsExported } from "./ast.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as token from "@goscript/go/token/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as reflect from "@goscript/reflect/index.js"

export type FieldFilter = ((name: string, value: reflect.Value) => boolean) | null;

export class localError {
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public _fields: {
		err: $.VarRef<$.GoError>;
	}

	constructor(init?: Partial<{err?: $.GoError}>) {
		this._fields = {
			err: $.varRef(init?.err ?? null)
		}
	}

	public clone(): localError {
		const cloned = new localError()
		cloned._fields = {
			err: $.varRef(this._fields.err.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'localError',
	  new localError(),
	  [],
	  localError,
	  {"err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }}
	);
}

export class printer {
	public get output(): io.Writer {
		return this._fields.output.value
	}
	public set output(value: io.Writer) {
		this._fields.output.value = value
	}

	public get fset(): token.FileSet | null {
		return this._fields.fset.value
	}
	public set fset(value: token.FileSet | null) {
		this._fields.fset.value = value
	}

	public get filter(): FieldFilter | null {
		return this._fields.filter.value
	}
	public set filter(value: FieldFilter | null) {
		this._fields.filter.value = value
	}

	// *T -> line number
	public get ptrmap(): Map<null | any, number> | null {
		return this._fields.ptrmap.value
	}
	public set ptrmap(value: Map<null | any, number> | null) {
		this._fields.ptrmap.value = value
	}

	// current indentation level
	public get indent(): number {
		return this._fields.indent.value
	}
	public set indent(value: number) {
		this._fields.indent.value = value
	}

	// the last byte processed by Write
	public get last(): number {
		return this._fields.last.value
	}
	public set last(value: number) {
		this._fields.last.value = value
	}

	// current line number
	public get line(): number {
		return this._fields.line.value
	}
	public set line(value: number) {
		this._fields.line.value = value
	}

	public _fields: {
		output: $.VarRef<io.Writer>;
		fset: $.VarRef<token.FileSet | null>;
		filter: $.VarRef<FieldFilter | null>;
		ptrmap: $.VarRef<Map<null | any, number> | null>;
		indent: $.VarRef<number>;
		last: $.VarRef<number>;
		line: $.VarRef<number>;
	}

	constructor(init?: Partial<{filter?: FieldFilter | null, fset?: token.FileSet | null, indent?: number, last?: number, line?: number, output?: io.Writer, ptrmap?: Map<null | any, number> | null}>) {
		this._fields = {
			output: $.varRef(init?.output ?? null),
			fset: $.varRef(init?.fset ?? null),
			filter: $.varRef(init?.filter ?? new FieldFilter | null(null)),
			ptrmap: $.varRef(init?.ptrmap ?? null),
			indent: $.varRef(init?.indent ?? 0),
			last: $.varRef(init?.last ?? 0),
			line: $.varRef(init?.line ?? 0)
		}
	}

	public clone(): printer {
		const cloned = new printer()
		cloned._fields = {
			output: $.varRef(this._fields.output.value),
			fset: $.varRef(this._fields.fset.value ? $.markAsStructValue(this._fields.fset.value.clone()) : null),
			filter: $.varRef(this._fields.filter.value),
			ptrmap: $.varRef(this._fields.ptrmap.value),
			indent: $.varRef(this._fields.indent.value),
			last: $.varRef(this._fields.last.value),
			line: $.varRef(this._fields.line.value)
		}
		return cloned
	}

	public Write(data: $.Bytes): [number, $.GoError] {
		const p = this
		let n: number = 0
		let err: $.GoError = null
		let m: number = 0
		for (let i = 0; i < $.len(data); i++) {
			const b = data![i]
			{
				// invariant: data[0:n] has been written
				if (b == 10) {
					;[m, err] = p.output!.Write($.goSlice(data, n, i + 1))
					n += m
					if (err != null) {
						return [n, err]
					}
					p.line++
				}
				 else if (p.last == 10) {
					;[, err] = fmt.Fprintf(p.output, "%6d  ", p.line)
					if (err != null) {
						return [n, err]
					}
					for (let j = p.indent; j > 0; j--) {
						;[, err] = p.output!.Write(indent)
						if (err != null) {
							return [n, err]
						}
					}
				}
				p.last = b
			}
		}
		if ($.len(data) > n) {
			;[m, err] = p.output!.Write($.goSlice(data, n, undefined))
			n += m
		}
		return [n, err]
	}

	// printf is a convenience wrapper that takes care of print errors.
	public printf(format: string, ...args: any[]): void {
		const p = this
		{
			let [, err] = fmt.Fprintf(p, format, ...(args ?? []))
			if (err != null) {
				$.panic($.markAsStructValue(new localError({})))
			}
		}
	}

	public print(x: reflect.Value): void {
		const p = this
		if (!NotNilFilter("", x)) {
			p.printf("nil")
			return 
		}
		switch (x.Kind()) {
			case reflect.Interface:
				p.print(x.Elem())
				break
			case reflect.Map:
				p.printf("%s (len = %d) {", x.Type(), x.Len())
				if (x.Len() > 0) {
					p.indent++
					p.printf("\n")
					for (let _i = 0; _i < $.len(x.MapKeys()); _i++) {
						const key = x.MapKeys()![_i]
						{
							p.print(key)
							p.printf(": ")
							p.print(x.MapIndex(key))
							p.printf("\n")
						}
					}
					p.indent--
				}
				p.printf("}")
				break
			case reflect.Pointer:
				p.printf("*")
				let ptr = await x.Interface()
				{
					let [line, exists] = $.mapGet(p.ptrmap, ptr, 0)
					if (exists) {
						p.printf("(obj @ %d)", line)
					}
					 else {
						$.mapSet(p.ptrmap, ptr, p.line)
						p.print(x.Elem())
					}
				}
				break
			case reflect.Array:
				p.printf("%s {", x.Type())
				if (x.Len() > 0) {
					p.indent++
					p.printf("\n")
					for (let i = 0, n = x.Len(); i < n; i++) {
						p.printf("%d: ", i)
						p.print(x.Index(i))
						p.printf("\n")
					}
					p.indent--
				}
				p.printf("}")
				break
			case reflect.Slice:
				{
					let { value: s, ok: ok } = $.typeAssert<$.Bytes>(await x.Interface(), {kind: $.TypeKind.Slice, elemType: {kind: $.TypeKind.Basic, name: 'number'}})
					if (ok) {
						p.printf("%#q", s)
						return 
					}
				}
				p.printf("%s (len = %d) {", x.Type(), x.Len())
				if (x.Len() > 0) {
					p.indent++
					p.printf("\n")
					for (let i = 0, n = x.Len(); i < n; i++) {
						p.printf("%d: ", i)
						p.print(x.Index(i))
						p.printf("\n")
					}
					p.indent--
				}
				p.printf("}")
				break
			case reflect.Struct:
				let t = x.Type()
				p.printf("%s {", t)
				p.indent++
				let first = true
				for (let i = 0, n = t!.NumField(); i < n; i++) {
					// exclude non-exported fields because their
					// values cannot be accessed via reflection
					{
						let name = (t!.Field(i))!.Name
						if (IsExported(name)) {
							let value = $.markAsStructValue(x.Field(i).clone())
							if (p.filter == null || p.filter!(name, value)) {
								if (first) {
									p.printf("\n")
									first = false
								}
								p.printf("%s: ", name)
								p.print(value)
								p.printf("\n")
							}
						}
					}
				}
				p.indent--
				p.printf("}")
				break
			default:
				let v = await x.Interface()
				$.typeSwitch(v, [{ types: [{kind: $.TypeKind.Basic, name: 'string'}], body: (v) => {
					p.printf("%q", v)
					return 
				}},
				{ types: ['token.Pos'], body: (v) => {
					if (p.fset != null) {
						p.printf("%s", await p.fset!.Position(v))
						return 
					}
				}}])
				p.printf("%v", v)
				break
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'printer',
	  new printer(),
	  [{ name: "Write", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "printf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "print", args: [{ name: "x", type: "Value" }], returns: [] }],
	  printer,
	  {"output": "Writer", "fset": { kind: $.TypeKind.Pointer, elemType: "FileSet" }, "filter": "FieldFilter", "ptrmap": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Interface, methods: [] }, elemType: { kind: $.TypeKind.Basic, name: "number" } }, "indent": { kind: $.TypeKind.Basic, name: "number" }, "last": { kind: $.TypeKind.Basic, name: "number" }, "line": { kind: $.TypeKind.Basic, name: "number" }}
	);
}

let indent: $.Bytes = $.stringToBytes(".  ")

// NotNilFilter is a [FieldFilter] that returns true for field values
// that are not nil; it returns false otherwise.
export function NotNilFilter(_: string, v: reflect.Value): boolean {
	switch (v.Kind()) {
		case reflect.Chan:
		case reflect.Func:
		case reflect.Interface:
		case reflect.Map:
		case reflect.Pointer:
		case reflect.Slice:
			return !v.IsNil()
			break
	}
	return true
}

// Fprint prints the (sub-)tree starting at AST node x to w.
// If fset != nil, position information is interpreted relative
// to that file set. Otherwise positions are printed as integer
// values (file set specific offsets).
//
// A non-nil [FieldFilter] f may be provided to control the output:
// struct fields for which f(fieldname, fieldvalue) is true are
// printed; all others are filtered from the output. Unexported
// struct fields are never printed.
export function Fprint(w: io.Writer, fset: token.FileSet | null, x: null | any, f: FieldFilter | null): $.GoError {
	return fprint(w, fset, x, f)
}

export function fprint(w: io.Writer, fset: token.FileSet | null, x: null | any, f: FieldFilter | null): $.GoError {
	let err: $.GoError = null
	{
		using __defer = new $.DisposableStack();
		// setup printer

		// force printing of line number on first line
		let p = $.markAsStructValue(new printer({filter: f, fset: fset, last: 10, output: w, ptrmap: $.makeMap<null | any, number>()}))

		// install error handler

		// re-panics if it's not a localError
		__defer.defer(() => {
			{
				let e = $.recover()
				if (e != null) {
					err = $.mustTypeAssert<localError>(e, 'localError').err // re-panics if it's not a localError
				}
			}
		});

		// print x
		if (x == null) {
			p.printf("nil\n")
			return err
		}
		p.print(reflect.ValueOf(x))
		p.printf("\n")

		return err
	}
}

// Print prints x to standard output, skipping nil fields.
// Print(fset, x) is the same as Fprint(os.Stdout, fset, x, NotNilFilter).
export function Print(fset: token.FileSet | null, x: null | any): $.GoError {
	return Fprint(os.Stdout, fset, x, NotNilFilter)
}

