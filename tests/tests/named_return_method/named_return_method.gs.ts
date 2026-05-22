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
			bytes: $.varRef(init?.bytes ?? null)
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

	public ReadAt(b: $.Slice<number>, off: number): [number, $.GoError] {
		const c: content | $.VarRef<content> | null = this
		let n: number = 0
		let err: $.GoError = null
		if ((off < 0) || (off >= $.int($.len($.pointerValue<content>(c).bytes)))) {
			err = null
			return [n, err]
		}

		let l = $.int($.len(b))
		if ((off + l) > $.int($.len($.pointerValue<content>(c).bytes))) {
			l = $.int($.len($.pointerValue<content>(c).bytes)) - off
		}

		let btr = $.goSlice($.pointerValue<content>(c).bytes, off, off + l)
		n = $.copy(b, btr)
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"main.content",
		new content(),
		[{ name: "ProcessData", args: [], returns: [] }, { name: "ReadAt", args: [], returns: [] }],
		content,
		{"bytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): globalThis.Promise<void> {
	let c: content | $.VarRef<content> | null = new content({bytes: $.stringToBytes("Hello, World!")})

	// Test ReadAt method
	let buf = $.makeSlice<number>(5, undefined, "byte")
	let [n1, err1] = $.pointerValue<content>(c).ReadAt(buf, 0)
	$.println(n1)
	if (err1 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf))

	// Test ReadAt with different offset
	let buf2 = $.makeSlice<number>(6, undefined, "byte")
	let [n2, err2] = $.pointerValue<content>(c).ReadAt(buf2, 7)
	$.println(n2)
	if (err2 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf2))

	// Test ProcessData method
	let [r1, s1, v1] = $.pointerValue<content>(c).ProcessData(15)
	$.println(r1)
	$.println(s1)
	$.println(v1)

	let [r2, s2, v2] = $.pointerValue<content>(c).ProcessData(5)
	$.println(r2)
	$.println(s2)
	$.println(v2)

	let [r3, s3, v3] = $.pointerValue<content>(c).ProcessData(-1)
	$.println(r3)
	$.println(s3)
	$.println(v3)
}


if ($.isMainScript(import.meta)) {
	await main()
}
