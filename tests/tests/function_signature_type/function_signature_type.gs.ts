// Generated file based on function_signature_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export type Func1 = ((a: number, b: string) => [boolean, $.GoError]) | null

export let fn1: Func1 = null

export type Func2 = ((_p0: number, _p1: string) => boolean) | null

export let fn2: Func2 = null

export type Func3 = (() => void) | null

export let fn3: Func3 = null

export type Func4 = ((a: number, b: $.Slice<string>) => void) | null

export let fn4: Func4 = null

export class MyError {
	public get s(): string {
		return this._fields.s.value
	}
	public set s(value: string) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<string>
	}

	constructor(init?: Partial<{s?: string}>) {
		this._fields = {
			s: $.varRef(init?.s ?? "")
		}
	}

	public clone(): MyError {
		const cloned = new MyError()
		cloned._fields = {
			s: $.varRef(this._fields.s.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return $.pointerValue(e).s
	}

	static __typeInfo = $.registerStructType(
		"main.MyError",
		new MyError(),
		[{ name: "Error", args: [], returns: [] }],
		MyError,
		{"s": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export function NewMyError(text: string): MyError | $.VarRef<MyError> | null {
	return new MyError({s: text})
}

export async function main(): Promise<void> {
	fn1 = $.functionValue((a: number, b: string): [boolean, $.GoError] => {
	$.println("fn1 called with:", a, b)
	if (a > 0) {
		return [true, null]
	}
	return [false, NewMyError("a was not positive")]
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }, "error"] })
	fn2 = $.functionValue((p0: number, p1: string): boolean => {
	$.println("fn2 called with:", p0, p1)
	return p0 == $.len(p1)
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })
	fn3 = $.functionValue((): void => {
	$.println("fn3 called")
}, { kind: $.TypeKind.Function, params: [], results: [] })
	fn4 = $.functionValue((a: number, b: $.Slice<string>): void => {
	$.println("fn4 called with: ", a)
	for (let __rangeIndex = 0; __rangeIndex < $.len(b); __rangeIndex++) {
		let s = b![__rangeIndex]
		$.println(" ", s)
	}
	$.println()
}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }], results: [], isVariadic: true })
	let [res1, err1] = fn1!(10, "hello")
	$.println("fn1 result 1: ", res1, " ")
	if (err1 != null) {
		$.println(err1!.Error())
	} else {
		$.println("nil")
	}
	let [res1_2, err1_2] = fn1!(-5, "world")
	$.println("fn1 result 2: ", res1_2, " ")
	if (err1_2 != null) {
		$.println(err1_2!.Error())
	} else {
		$.println("nil")
	}
	let res2 = fn2!(5, "hello")
	$.println("fn2 result 1:", res2)
	let res2_2 = fn2!(3, "hey")
	$.println("fn2 result 2:", res2_2)
	fn3!()
	fn4!(1, null)
	fn4!(2, $.arrayToSlice<string>(["one"]))
	fn4!(3, $.arrayToSlice<string>(["two", "three"]))
}


if ($.isMainScript(import.meta)) {
	await main()
}
