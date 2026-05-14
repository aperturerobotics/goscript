// Generated file based on named_return_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

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

	public ProcessData(input: number): void {
		const c = this
		result = input * 2
		if (input > 10) {
			status = "high"
			valid = true
		} else {
			if (input > 0) {
				status = "low"
				valid = true
			} else {
				status = "invalid"
			}
		}
		return
	}

	public ReadAt(b: $.Slice<number>, off: number): void {
		const c = this
		if (off < 0 || off >= $.int($.len($.pointerValue(c).bytes))) {
			err = null
			return
		}
		let l = $.int($.len(b))
		if (off + l > $.int($.len($.pointerValue(c).bytes))) {
			l = $.int($.len($.pointerValue(c).bytes)) - off
		}
		let btr = $.goSlice($.pointerValue(c).bytes, off, off + l)
		n = $.copy(b, btr)
		return
	}

	static __typeInfo = $.registerStructType(
		"main.content",
		new content(),
		[{ name: "ProcessData", args: [], returns: [] }, { name: "ReadAt", args: [], returns: [] }],
		content,
		{"bytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }}
	)
}

export async function main(): Promise<void> {
	let c = new content({bytes: $.stringToBytes("Hello, World!")})
	let buf = $.makeSlice<number>(5, undefined, "byte")
	let [n1, err1] = $.pointerValue(c).ReadAt(buf, 0)
	$.println(n1)
	if (err1 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf))
	let buf2 = $.makeSlice<number>(6, undefined, "byte")
	let [n2, err2] = $.pointerValue(c).ReadAt(buf2, 7)
	$.println(n2)
	if (err2 == null) {
		$.println("nil")
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf2))
	let [r1, s1, v1] = $.pointerValue(c).ProcessData(15)
	$.println(r1)
	$.println(s1)
	$.println(v1)
	let [r2, s2, v2] = $.pointerValue(c).ProcessData(5)
	$.println(r2)
	$.println(s2)
	$.println(v2)
	let [r3, s3, v3] = $.pointerValue(c).ProcessData(-1)
	$.println(r3)
	$.println(s3)
	$.println(v3)
}


if ($.isMainScript(import.meta)) {
	await main()
}
