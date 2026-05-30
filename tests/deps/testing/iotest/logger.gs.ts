// Generated file based on logger.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as log from "@goscript/log/index.js"
import "@goscript/io/index.js"
import "@goscript/log/index.js"

export class writeLogger {
	public get prefix(): string {
		return this._fields.prefix.value
	}
	public set prefix(value: string) {
		this._fields.prefix.value = value
	}

	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public _fields: {
		prefix: $.VarRef<string>
		w: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{prefix?: string, w?: io.Writer | null}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? ""),
			w: $.varRef(init?.w ?? null)
		}
	}

	public clone(): writeLogger {
		const cloned = new writeLogger()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value),
			w: $.varRef(this._fields.w.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const l: writeLogger | $.VarRef<writeLogger> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<writeLogger>(l).w).Write(p)
		n = __goscriptTuple0[0]
		err = __goscriptTuple0[1]
		if (err != null) {
			await log.Printf("%s %x: %v", $.arrayToSlice<any>([$.pointerValue<writeLogger>(l).prefix, $.interfaceValue<any>($.goSlice(p, 0, n), "[]byte"), (err as any)]))
		} else {
			await log.Printf("%s %x", $.arrayToSlice<any>([$.pointerValue<writeLogger>(l).prefix, $.interfaceValue<any>($.goSlice(p, 0, n), "[]byte")]))
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.writeLogger",
		() => new writeLogger(),
		[{ name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		writeLogger,
		[{ name: "prefix", key: "prefix", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "testing/iotest", index: [0], offset: 0, exported: false }, { name: "w", key: "w", type: "io.Writer", pkgPath: "testing/iotest", index: [1], offset: 16, exported: false }]
	)
}

export class readLogger {
	public get prefix(): string {
		return this._fields.prefix.value
	}
	public set prefix(value: string) {
		this._fields.prefix.value = value
	}

	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public _fields: {
		prefix: $.VarRef<string>
		r: $.VarRef<io.Reader | null>
	}

	constructor(init?: Partial<{prefix?: string, r?: io.Reader | null}>) {
		this._fields = {
			prefix: $.varRef(init?.prefix ?? ""),
			r: $.varRef(init?.r ?? null)
		}
	}

	public clone(): readLogger {
		const cloned = new readLogger()
		cloned._fields = {
			prefix: $.varRef(this._fields.prefix.value),
			r: $.varRef(this._fields.r.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const l: readLogger | $.VarRef<readLogger> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple1: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<readLogger>(l).r).Read(p)
		n = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			await log.Printf("%s %x: %v", $.arrayToSlice<any>([$.pointerValue<readLogger>(l).prefix, $.interfaceValue<any>($.goSlice(p, 0, n), "[]byte"), (err as any)]))
		} else {
			await log.Printf("%s %x", $.arrayToSlice<any>([$.pointerValue<readLogger>(l).prefix, $.interfaceValue<any>($.goSlice(p, 0, n), "[]byte")]))
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"iotest.readLogger",
		() => new readLogger(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		readLogger,
		[{ name: "prefix", key: "prefix", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "testing/iotest", index: [0], offset: 0, exported: false }, { name: "r", key: "r", type: "io.Reader", pkgPath: "testing/iotest", index: [1], offset: 16, exported: false }]
	)
}

export function NewWriteLogger(prefix: string, w: io.Writer | null): io.Writer | null {
	return $.interfaceValue<io.Writer | null>(new writeLogger({prefix: prefix, w: w}), "*iotest.writeLogger")
}

export function NewReadLogger(prefix: string, r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new readLogger({prefix: prefix, r: r}), "*iotest.readLogger")
}
