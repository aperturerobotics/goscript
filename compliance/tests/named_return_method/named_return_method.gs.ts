// Generated file based on named_return_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class content {
	public get bytes(): $.Bytes {
		return this._fields.bytes.value
	}
	public set bytes(value: $.Bytes) {
		this._fields.bytes.value = value
	}

	public _fields: {
		bytes: $.VarRef<$.Bytes>;
	}

	constructor(init?: Partial<{bytes?: $.Bytes}>) {
		this._fields = {
			bytes: $.varRef(init?.bytes ?? new Uint8Array(0))
		}
	}

	public clone(): content {
		const cloned = new content()
		cloned._fields = {
			bytes: $.varRef(this._fields.bytes.value)
		}
		return cloned
	}

	public ReadAt(b: $.Bytes, off: number): [number, $.GoError] {
		const c = this
		let n: number = 0
		let err: $.GoError = null
		if (off < 0 || off >= ($.len(c.bytes) as number)) {
			err = null // Simulate an error scenario
			return [n, err]
		}
		let l = ($.len(b) as number)
		if (off + l > ($.len(c.bytes) as number)) {
			l = ($.len(c.bytes) as number) - off
		}
		let btr = $.goSlice(c.bytes, off, off + l)
		n = $.copy(b, btr)
		return [n, err]
	}

	public ProcessData(input: number): [number, string, boolean] {
		let result: number = 0
		let status: string = ""
		let valid: boolean = false
		result = input * 2
		if (input > 10) {
			status = "high"
			valid = true
		} else if (input > 0) {
			status = "low"
			valid = true
		} else {
			// status and valid will be zero values
			status = "invalid"
		}
		return [result, status, valid]
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.content',
	  new content(),
	  [{ name: "ReadAt", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "off", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "ProcessData", args: [{ name: "input", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
	  content,
	  {"bytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }}
	);
}

export async function main(): Promise<void> {
	let c = new content({bytes: $.stringToBytes("Hello, World!")})

	// Test ReadAt method
	let buf = new Uint8Array(5)
	let [n1, err1] = c!.ReadAt(buf, 0)
	$.println(n1) // Expected: 5

	// Expected: nil
	if (err1 == null) {
		$.println("nil") // Expected: nil
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf)) // Expected: Hello

	// Test ReadAt with different offset
	let buf2 = new Uint8Array(6)
	let [n2, err2] = c!.ReadAt(buf2, 7)
	$.println(n2) // Expected: 6

	// Expected: nil
	if (err2 == null) {
		$.println("nil") // Expected: nil
	} else {
		$.println("error")
	}
	$.println($.bytesToString(buf2)) // Expected: World!

	// Test ProcessData method
	let [r1, s1, v1] = c!.ProcessData(15)
	$.println(r1) // Expected: 30
	$.println(s1) // Expected: high
	$.println(v1) // Expected: true

	let [r2, s2, v2] = c!.ProcessData(5)
	$.println(r2) // Expected: 10
	$.println(s2) // Expected: low
	$.println(v2) // Expected: true

	let [r3, s3, v3] = c!.ProcessData(-1)
	$.println(r3) // Expected: -2
	$.println(s3) // Expected: invalid
	$.println(v3) // Expected: false
}

