import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as token from "@goscript/go/token/index.js"

import * as io from "@goscript/io/index.js"

import * as sort from "@goscript/sort/index.js"

export class Error {
	public get Pos(): token.Position {
		return this._fields.Pos.value
	}
	public set Pos(value: token.Position) {
		this._fields.Pos.value = value
	}

	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	public _fields: {
		Pos: $.VarRef<token.Position>;
		Msg: $.VarRef<string>;
	}

	constructor(init?: Partial<{Msg?: string, Pos?: token.Position}>) {
		this._fields = {
			Pos: $.varRef(init?.Pos ? $.markAsStructValue(init.Pos.clone()) : new token.Position()),
			Msg: $.varRef(init?.Msg ?? "")
		}
	}

	public clone(): Error {
		const cloned = new Error()
		cloned._fields = {
			Pos: $.varRef($.markAsStructValue(this._fields.Pos.value.clone())),
			Msg: $.varRef(this._fields.Msg.value)
		}
		return cloned
	}

	// Error implements the error interface.
	public Error(): string {
		const e = this
		if (e.Pos.Filename != "" || e.Pos.IsValid()) {
			// don't print "<unknown position>"
			// TODO(gri) reconsider the semantics of Position.IsValid
			return e.Pos.String() + ": " + e.Msg
		}
		return e.Msg
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/scanner.Error',
	  new Error(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Error,
	  {"Pos": "Position", "Msg": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type ErrorList = $.Slice<Error | null>;

export function ErrorList_Add(p: $.VarRef<ErrorList>, pos: token.Position, msg: string): void {
	p!.value = $.append(p!.value, new Error({Msg: msg, Pos: pos}))
}

export function ErrorList_Reset(p: $.VarRef<ErrorList>): void {
	p!.value = $.goSlice((p!.value), 0, 0)
}

export function ErrorList_Len(p: ErrorList): number {
	return $.len(p)
}

export function ErrorList_Swap(p: ErrorList, i: number, j: number): void {
	;[p![i], p![j]] = [p![j], p![i]]
}

export function ErrorList_Less(p: ErrorList, i: number, j: number): boolean {
	let e = p![i]!.Pos
	let f = p![j]!.Pos
	if (e!.Filename != f!.Filename) {
		return e!.Filename < f!.Filename
	}
	if (e!.Line != f!.Line) {
		return e!.Line < f!.Line
	}
	if (e!.Column != f!.Column) {
		return e!.Column < f!.Column
	}
	return p![i]!.Msg < p![j]!.Msg
}

export function ErrorList_Sort(p: ErrorList): void {
	sort.Sort(p)
}

export function ErrorList_RemoveMultiples(p: $.VarRef<ErrorList>): void {
	sort.Sort(p)
	// initial last.Line is != any legal error line
	let last: token.Position = new token.Position()
	let i = 0
	for (let _i = 0; _i < $.len(p!.value); _i++) {
		let e = p!.value![_i]
		{
			if (e!.Pos.Filename != last.Filename || e!.Pos.Line != last.Line) {
				last = $.markAsStructValue(e!.Pos.clone())
				(p!.value)![i] = e
				i++
			}
		}
	}
	p!.value = $.goSlice((p!.value), 0, i)
}

export function ErrorList_Error(p: ErrorList): string {
	switch ($.len(p)) {
		case 0: {
			return "no errors"
			break
		}
		case 1: {
			return p![0]!.Error()
			break
		}
	}
	return fmt.Sprintf("%s (and %d more errors)", p![0], $.len(p) - 1)
}

export function ErrorList_Err(p: ErrorList): $.GoError {
	if ($.len(p) == 0) {
		return null
	}
	return $.wrapPrimitiveError(p, ErrorList_Error)
}


// PrintError is a utility function that prints a list of errors to w,
// one error per line, if the err parameter is an [ErrorList]. Otherwise
// it prints the err string.
export function PrintError(w: null | io.Writer, err: $.GoError): void {
	{
		let { value: list, ok: ok } = $.typeAssert<ErrorList>(err, 'go/scanner.ErrorList')
		if (ok) {
			for (let _i = 0; _i < $.len(list); _i++) {
				let e = list![_i]
				{
					fmt.Fprintf(w, "%s\n", e)
				}
			}
		} else if (err != null) {
			fmt.Fprintf(w, "%s\n", err)
		}
	}
}

