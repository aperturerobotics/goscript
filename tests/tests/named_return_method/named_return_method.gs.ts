// Generated file based on named_return_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class content {
	public get bytes(): $.Slice<number> {
		return this._fields.bytes.value
	}
	public set bytes(value: $.Slice<number>) {
		this._fields.bytes.value = value
	}

	public _fields: {
		bytes: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{bytes?: $.Slice<number>}>) {
		this._fields = {
			bytes: $.varRef(init?.bytes ?? (null as $.Slice<number>))
		}
	}

	public clone(): content {
		const cloned = new content()
		cloned._fields = {
			bytes: $.varRef(this._fields.bytes.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ProcessData(input: number): [number, string, boolean] {
		const c: content | $.VarRef<content> | null = this
		let result: number = 0
		let status: string = ""
		let valid: boolean = false
		result = input * 2
		if (input > 10) {
			status = "high"
			valid = true
		} else {
			if (input > 0) {
				status = "low"
				valid = true
			} else {
				// status and valid will be zero values
				status = "invalid"
			}
		}
		return [result, status, valid]
	}

	public ReadAt(b: $.Slice<number>, off: bigint): [number, $.GoError] {
		const c: content | $.VarRef<content> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ((off < 0) || (off >= $.int64($.len($.pointerValue<content>(c).bytes)))) {
			err = null
			return [n, err]
		}

		let l = $.int64($.len(b))
		if (($.int64Add(off, l)) > $.int64($.len($.pointerValue<content>(c).bytes))) {
			l = $.int64Sub($.int64($.len($.pointerValue<content>(c).bytes)), off)
		}

		let btr: $.Slice<number> = $.goSlice($.pointerValue<content>(c).bytes, Number(off), Number($.int64Add(off, l)))
		n = $.copy(b, btr)
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"main.content",
		() => new content(),
		[{ name: "ProcessData", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "ReadAt", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		content,
		[{ name: "bytes", key: "bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let c: content | $.VarRef<content> | null = new content({bytes: new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])})

	// Test ReadAt method
	let buf: $.Slice<number> = $.makeSlice<number>(5, undefined, "byte")
	let [n1, err1] = content.prototype.ReadAt.call(c, buf, 0n)
	$.println(n1)
	if (err1 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf))

	// Test ReadAt with different offset
	let buf2: $.Slice<number> = $.makeSlice<number>(6, undefined, "byte")
	let [n2, err2] = content.prototype.ReadAt.call(c, buf2, 7n)
	$.println(n2)
	if (err2 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf2))

	// Test ProcessData method
	let [r1, s1, v1] = content.prototype.ProcessData.call(c, 15)
	$.println(r1)
	$.println(s1)
	$.println(v1)

	let [r2, s2, v2] = content.prototype.ProcessData.call(c, 5)
	$.println(r2)
	$.println(s2)
	$.println(v2)

	let [r3, s3, v3] = content.prototype.ProcessData.call(c, -1)
	$.println(r3)
	$.println(s3)
	$.println(v3)
}

if ($.isMainScript(import.meta)) {
	await main()
}
