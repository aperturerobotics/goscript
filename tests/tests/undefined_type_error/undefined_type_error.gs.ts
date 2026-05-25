// Generated file based on undefined_type_error.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class formatter {
	public get wid(): number {
		return this._fields.wid.value
	}
	public set wid(value: number) {
		this._fields.wid.value = value
	}

	public get prec(): number {
		return this._fields.prec.value
	}
	public set prec(value: number) {
		this._fields.prec.value = value
	}

	public get widPresent(): boolean {
		return this._fields.widPresent.value
	}
	public set widPresent(value: boolean) {
		this._fields.widPresent.value = value
	}

	public get precPresent(): boolean {
		return this._fields.precPresent.value
	}
	public set precPresent(value: boolean) {
		this._fields.precPresent.value = value
	}

	public get minus(): boolean {
		return this._fields.minus.value
	}
	public set minus(value: boolean) {
		this._fields.minus.value = value
	}

	public get plus(): boolean {
		return this._fields.plus.value
	}
	public set plus(value: boolean) {
		this._fields.plus.value = value
	}

	public get sharp(): boolean {
		return this._fields.sharp.value
	}
	public set sharp(value: boolean) {
		this._fields.sharp.value = value
	}

	public get space(): boolean {
		return this._fields.space.value
	}
	public set space(value: boolean) {
		this._fields.space.value = value
	}

	public get zero(): boolean {
		return this._fields.zero.value
	}
	public set zero(value: boolean) {
		this._fields.zero.value = value
	}

	public get plusV(): boolean {
		return this._fields.plusV.value
	}
	public set plusV(value: boolean) {
		this._fields.plusV.value = value
	}

	public get sharpV(): boolean {
		return this._fields.sharpV.value
	}
	public set sharpV(value: boolean) {
		this._fields.sharpV.value = value
	}

	public _fields: {
		wid: $.VarRef<number>
		prec: $.VarRef<number>
		widPresent: $.VarRef<boolean>
		precPresent: $.VarRef<boolean>
		minus: $.VarRef<boolean>
		plus: $.VarRef<boolean>
		sharp: $.VarRef<boolean>
		space: $.VarRef<boolean>
		zero: $.VarRef<boolean>
		plusV: $.VarRef<boolean>
		sharpV: $.VarRef<boolean>
	}

	constructor(init?: Partial<{wid?: number, prec?: number, widPresent?: boolean, precPresent?: boolean, minus?: boolean, plus?: boolean, sharp?: boolean, space?: boolean, zero?: boolean, plusV?: boolean, sharpV?: boolean}>) {
		this._fields = {
			wid: $.varRef(init?.wid ?? 0),
			prec: $.varRef(init?.prec ?? 0),
			widPresent: $.varRef(init?.widPresent ?? false),
			precPresent: $.varRef(init?.precPresent ?? false),
			minus: $.varRef(init?.minus ?? false),
			plus: $.varRef(init?.plus ?? false),
			sharp: $.varRef(init?.sharp ?? false),
			space: $.varRef(init?.space ?? false),
			zero: $.varRef(init?.zero ?? false),
			plusV: $.varRef(init?.plusV ?? false),
			sharpV: $.varRef(init?.sharpV ?? false)
		}
	}

	public clone(): formatter {
		const cloned = new formatter()
		cloned._fields = {
			wid: $.varRef(this._fields.wid.value),
			prec: $.varRef(this._fields.prec.value),
			widPresent: $.varRef(this._fields.widPresent.value),
			precPresent: $.varRef(this._fields.precPresent.value),
			minus: $.varRef(this._fields.minus.value),
			plus: $.varRef(this._fields.plus.value),
			sharp: $.varRef(this._fields.sharp.value),
			space: $.varRef(this._fields.space.value),
			zero: $.varRef(this._fields.zero.value),
			plusV: $.varRef(this._fields.plusV.value),
			sharpV: $.varRef(this._fields.sharpV.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.formatter",
		() => new formatter(),
		[],
		formatter,
		{"wid": { kind: $.TypeKind.Basic, name: "int" }, "prec": { kind: $.TypeKind.Basic, name: "int" }, "widPresent": { kind: $.TypeKind.Basic, name: "bool" }, "precPresent": { kind: $.TypeKind.Basic, name: "bool" }, "minus": { kind: $.TypeKind.Basic, name: "bool" }, "plus": { kind: $.TypeKind.Basic, name: "bool" }, "sharp": { kind: $.TypeKind.Basic, name: "bool" }, "space": { kind: $.TypeKind.Basic, name: "bool" }, "zero": { kind: $.TypeKind.Basic, name: "bool" }, "plusV": { kind: $.TypeKind.Basic, name: "bool" }, "sharpV": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export class printer {
	public get buf(): $.Slice<number> {
		return this._fields.buf.value
	}
	public set buf(value: $.Slice<number>) {
		this._fields.buf.value = value
	}

	public get arg(): any {
		return this._fields.arg.value
	}
	public set arg(value: any) {
		this._fields.arg.value = value
	}

	// This line causes the issue: fmt: $.VarRef<fmt>; where fmt is undefined
	// Should generate proper type reference
	public get fmt(): formatter {
		return this._fields.fmt.value
	}
	public set fmt(value: formatter) {
		this._fields.fmt.value = value
	}

	public _fields: {
		buf: $.VarRef<$.Slice<number>>
		arg: $.VarRef<any>
		fmt: $.VarRef<formatter>
	}

	constructor(init?: Partial<{buf?: $.Slice<number>, arg?: any, fmt?: formatter}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? null),
			arg: $.varRef(init?.arg ?? null),
			fmt: $.varRef(init?.fmt ? $.markAsStructValue($.cloneStructValue(init.fmt)) : $.markAsStructValue(new formatter()))
		}
	}

	public clone(): printer {
		const cloned = new printer()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value),
			arg: $.varRef(this._fields.arg.value),
			fmt: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.fmt.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public format(verb: number): void {
		const p: printer | $.VarRef<printer> | null = this
		// Use the formatter
		if ($.pointerValue<printer>(p).fmt.minus) {
			$.println("minus flag set")
		}
		if ($.pointerValue<printer>(p).fmt.plus) {
			$.println("plus flag set")
		}
	}

	public init(): void {
		let p: printer | $.VarRef<printer> | null = this
		$.pointerValue<printer>(p).fmt = $.markAsStructValue(new formatter())
	}

	static __typeInfo = $.registerStructType(
		"main.printer",
		() => new printer(),
		[{ name: "format", args: [], returns: [] }, { name: "init", args: [], returns: [] }],
		printer,
		{"buf": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "arg": { kind: $.TypeKind.Interface, methods: [] }, "fmt": "main.formatter"}
	)
}

export async function main(): globalThis.Promise<void> {
	let p: printer | $.VarRef<printer> | null = new printer()
	printer.prototype.init.call(p)
	printer.prototype.format.call(p, $.int(100, 32))
	$.println("Formatter test completed")
}

if ($.isMainScript(import.meta)) {
	await main()
}
