// Generated file based on undefined_type_error.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class formatter {
	//nolint:unused
	public get wid(): number {
		return this._fields.wid.value
	}
	public set wid(value: number) {
		this._fields.wid.value = value
	}

	//nolint:unused
	public get prec(): number {
		return this._fields.prec.value
	}
	public set prec(value: number) {
		this._fields.prec.value = value
	}

	//nolint:unused
	public get widPresent(): boolean {
		return this._fields.widPresent.value
	}
	public set widPresent(value: boolean) {
		this._fields.widPresent.value = value
	}

	//nolint:unused
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

	//nolint:unused
	public get sharp(): boolean {
		return this._fields.sharp.value
	}
	public set sharp(value: boolean) {
		this._fields.sharp.value = value
	}

	//nolint:unused
	public get space(): boolean {
		return this._fields.space.value
	}
	public set space(value: boolean) {
		this._fields.space.value = value
	}

	//nolint:unused
	public get zero(): boolean {
		return this._fields.zero.value
	}
	public set zero(value: boolean) {
		this._fields.zero.value = value
	}

	//nolint:unused
	public get plusV(): boolean {
		return this._fields.plusV.value
	}
	public set plusV(value: boolean) {
		this._fields.plusV.value = value
	}

	//nolint:unused
	public get sharpV(): boolean {
		return this._fields.sharpV.value
	}
	public set sharpV(value: boolean) {
		this._fields.sharpV.value = value
	}

	public _fields: {
		wid: $.VarRef<number>;
		prec: $.VarRef<number>;
		widPresent: $.VarRef<boolean>;
		precPresent: $.VarRef<boolean>;
		minus: $.VarRef<boolean>;
		plus: $.VarRef<boolean>;
		sharp: $.VarRef<boolean>;
		space: $.VarRef<boolean>;
		zero: $.VarRef<boolean>;
		plusV: $.VarRef<boolean>;
		sharpV: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{minus?: boolean, plus?: boolean, plusV?: boolean, prec?: number, precPresent?: boolean, sharp?: boolean, sharpV?: boolean, space?: boolean, wid?: number, widPresent?: boolean, zero?: boolean}>) {
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
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.formatter',
	  new formatter(),
	  [],
	  formatter,
	  {"wid": { kind: $.TypeKind.Basic, name: "int" }, "prec": { kind: $.TypeKind.Basic, name: "int" }, "widPresent": { kind: $.TypeKind.Basic, name: "bool" }, "precPresent": { kind: $.TypeKind.Basic, name: "bool" }, "minus": { kind: $.TypeKind.Basic, name: "bool" }, "plus": { kind: $.TypeKind.Basic, name: "bool" }, "sharp": { kind: $.TypeKind.Basic, name: "bool" }, "space": { kind: $.TypeKind.Basic, name: "bool" }, "zero": { kind: $.TypeKind.Basic, name: "bool" }, "plusV": { kind: $.TypeKind.Basic, name: "bool" }, "sharpV": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export class printer {
	//nolint:unused
	public get buf(): $.Bytes {
		return this._fields.buf.value
	}
	public set buf(value: $.Bytes) {
		this._fields.buf.value = value
	}

	//nolint:unused
	public get arg(): null | any {
		return this._fields.arg.value
	}
	public set arg(value: null | any) {
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
		buf: $.VarRef<$.Bytes>;
		arg: $.VarRef<null | any>;
		fmt: $.VarRef<formatter>;
	}

	constructor(init?: Partial<{arg?: null | any, buf?: $.Bytes, fmt?: formatter}>) {
		this._fields = {
			buf: $.varRef(init?.buf ?? new Uint8Array(0)),
			arg: $.varRef(init?.arg ?? null),
			fmt: $.varRef(init?.fmt ? $.markAsStructValue(init.fmt.clone()) : new formatter())
		}
	}

	public clone(): printer {
		const cloned = new printer()
		cloned._fields = {
			buf: $.varRef(this._fields.buf.value),
			arg: $.varRef(this._fields.arg.value),
			fmt: $.varRef($.markAsStructValue(this._fields.fmt.value.clone()))
		}
		return cloned
	}

	public init(): void {
		const p = this
		p.fmt = $.markAsStructValue(new formatter({}))
	}

	public format(verb: number): void {
		const p = this
		if (p.fmt.minus) {
			$.println("minus flag set")
		}
		if (p.fmt.plus) {
			$.println("plus flag set")
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.printer',
	  new printer(),
	  [{ name: "init", args: [], returns: [] }, { name: "format", args: [{ name: "verb", type: { kind: $.TypeKind.Basic, name: "rune" } }], returns: [] }],
	  printer,
	  {"buf": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "arg": { kind: $.TypeKind.Interface, methods: [] }, "fmt": "formatter"}
	);
}

export async function main(): Promise<void> {
	let p = new printer({})
	p!.init()
	p!.format(100)
	$.println("Formatter test completed")
}

