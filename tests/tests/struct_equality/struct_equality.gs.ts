// Generated file based on struct_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = ObjectID

export class ObjectID {
	public get hash(): Uint8Array {
		return this._fields.hash.value
	}
	public set hash(value: Uint8Array) {
		this._fields.hash.value = value
	}

	public get format(): number {
		return this._fields.format.value
	}
	public set format(value: number) {
		this._fields.format.value = value
	}

	public _fields: {
		hash: $.VarRef<Uint8Array>
		format: $.VarRef<number>
	}

	constructor(init?: Partial<{hash?: Uint8Array, format?: number}>) {
		this._fields = {
			hash: $.varRef(init?.hash !== undefined ? $.cloneArrayValue(init.hash) : new Uint8Array(4)),
			format: $.varRef(init?.format ?? (0 as unknown as number))
		}
	}

	public clone(): ObjectID {
		const cloned = new ObjectID()
		cloned._fields = {
			hash: $.varRef($.cloneArrayValue(this._fields.hash.value)),
			format: $.varRef(this._fields.format.value)
		}
		return $.markAsStructValue(cloned)
	}

	public IsZero(): boolean {
		const s = this
		return $.comparableEqual(s, $.markAsStructValue(new ObjectID()))
	}

	public Valid(): boolean {
		const s = this
		return !$.comparableEqual(s, $.markAsStructValue(new ObjectID()))
	}

	static __typeInfo = $.registerStructType(
		"main.ObjectID",
		() => new ObjectID(),
		[{ name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Valid", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		ObjectID,
		[{ name: "hash", key: "hash", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 4 }, pkgPath: "github.com/s4wave/goscript/tests/tests/struct_equality", index: [0], offset: 0, exported: false }, { name: "format", key: "format", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "github.com/s4wave/goscript/tests/tests/struct_equality", index: [1], offset: 4, exported: false }]
	)
}

export async function main(): globalThis.Promise<void> {
	let zero: Hash = $.markAsStructValue(new ObjectID())
	let otherZero = $.markAsStructValue(new ObjectID())
	let one = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, $.uint(7, 8), 0, 0])}))
	let otherOne = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, $.uint(7, 8), 0, 0])}))
	let different = $.markAsStructValue(new ObjectID({hash: new Uint8Array([0, 0, $.uint(7, 8), 0])}))

	$.println("zero is zero:", $.markAsStructValue($.cloneStructValue(zero)).IsZero())
	$.println("zero valid:", $.markAsStructValue($.cloneStructValue(zero)).Valid())
	$.println("zero equals zero:", $.comparableEqual(zero, otherZero))
	$.println("one valid:", $.markAsStructValue($.cloneStructValue(one)).Valid())
	$.println("one equals other one:", $.comparableEqual(one, otherOne))
	$.println("one differs:", !$.comparableEqual(one, different))
}

if ($.isMainScript(import.meta)) {
	await main()
}
