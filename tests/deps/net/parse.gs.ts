// Generated file based on parse.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as time from "@goscript/time/index.js"

import * as fs from "@goscript/io/fs/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/time/index.js"
import "@goscript/io/fs/index.js"

export class file {
	public get file(): os.File | $.VarRef<os.File> | null {
		return this._fields.file.value
	}
	public set file(value: os.File | $.VarRef<os.File> | null) {
		this._fields.file.value = value
	}

	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public get atEOF(): boolean {
		return this._fields.atEOF.value
	}
	public set atEOF(value: boolean) {
		this._fields.atEOF.value = value
	}

	public _fields: {
		file: $.VarRef<os.File | $.VarRef<os.File> | null>
		data: $.VarRef<$.Slice<number>>
		atEOF: $.VarRef<boolean>
	}

	constructor(init?: Partial<{file?: os.File | $.VarRef<os.File> | null, data?: $.Slice<number>, atEOF?: boolean}>) {
		this._fields = {
			file: $.varRef(init?.file ?? null),
			data: $.varRef(init?.data ?? null),
			atEOF: $.varRef(init?.atEOF ?? false)
		}
	}

	public clone(): file {
		const cloned = new file()
		cloned._fields = {
			file: $.varRef(this._fields.file.value),
			data: $.varRef(this._fields.data.value),
			atEOF: $.varRef(this._fields.atEOF.value)
		}
		return $.markAsStructValue(cloned)
	}

	public close(): void {
		const f: file | $.VarRef<file> | null = this
		os.File.prototype.Close.call($.pointerValue<os.File>($.pointerValue<file>(f).file))
	}

	public getLineFromData(): [string, boolean] {
		let f: file | $.VarRef<file> | null = this
		let s: string = ""
		let ok: boolean = false
		let data: $.Slice<number> = $.pointerValue<file>(f).data
		let i = 0
		for (i = 0; i < $.len(data); i++) {
			if ($.uint(data![i], 8) == $.uint(10, 8)) {
				s = $.bytesToString($.goSlice(data, 0, i))
				ok = true
				// move data
				i++
				let n = $.len(data) - i
				$.copy($.goSlice(data, 0, undefined), $.goSlice(data, i, undefined))
				$.pointerValue<file>(f).data = $.goSlice(data, 0, n)
				return [s, ok]
			}
		}
		if ($.pointerValue<file>(f).atEOF && ($.len($.pointerValue<file>(f).data) > 0)) {
			// EOF, return all we have
			s = $.bytesToString(data)
			$.pointerValue<file>(f).data = $.goSlice($.pointerValue<file>(f).data, 0, 0)
			ok = true
		}
		return [s, ok]
	}

	public async readLine(): globalThis.Promise<[string, boolean]> {
		let f: file | $.VarRef<file> | null = this
		let s: string = ""
		let ok: boolean = false
		{
			let __goscriptTuple0: any = file.prototype.getLineFromData.call(f)
			s = __goscriptTuple0[0]
			ok = __goscriptTuple0[1]
			if (ok) {
				return [s, ok]
			}
		}
		if ($.len($.pointerValue<file>(f).data) < $.cap($.pointerValue<file>(f).data)) {
			let ln = $.len($.pointerValue<file>(f).data)
			let [n, err] = await io.ReadFull($.pointerValueOrNil($.interfaceValue<io.Reader | null>($.pointerValue<file>(f).file, "*os.File"))!, $.goSlice($.pointerValue<file>(f).data, ln, $.cap($.pointerValue<file>(f).data)))
			if (n >= 0) {
				$.pointerValue<file>(f).data = $.goSlice($.pointerValue<file>(f).data, 0, ln + n)
			}
			if (($.comparableEqual(err, io.EOF)) || ($.comparableEqual(err, io.ErrUnexpectedEOF))) {
				$.pointerValue<file>(f).atEOF = true
			}
		}
		let __goscriptTuple1: any = file.prototype.getLineFromData.call(f)
		s = __goscriptTuple1[0]
		ok = __goscriptTuple1[1]
		return [s, ok]
	}

	public stat(): [time.Time, number, $.GoError] {
		const f: file | $.VarRef<file> | null = this
		let mtime: time.Time = $.markAsStructValue(new time.Time())
		let size: number = 0
		let err: $.GoError = null as $.GoError
		let __goscriptTuple2: any = os.File.prototype.Stat.call($.pointerValue<os.File>($.pointerValue<file>(f).file))
		let st = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (err != null) {
			return [$.markAsStructValue(new time.Time()), $.int(0), err]
		}
		return [$.markAsStructValue($.cloneStructValue($.pointerValue<Exclude<fs.FileInfo, null>>(st).ModTime())), $.int($.pointerValue<Exclude<fs.FileInfo, null>>(st).Size()), null]
	}

	static __typeInfo = $.registerStructType(
		"net.file",
		() => new file(),
		[{ name: "close", args: [], returns: [] }, { name: "getLineFromData", args: [], returns: [] }, { name: "readLine", args: [], returns: [] }, { name: "stat", args: [], returns: [] }],
		file,
		{"file": { kind: $.TypeKind.Pointer, elemType: "os.File" }, "data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "atEOF": { kind: $.TypeKind.Basic, name: "bool" }}
	)
}

export const big: number = 16777215

export function open(name: string): [file | $.VarRef<file> | null, $.GoError] {
	let __goscriptTuple3: any = os.Open(name)
	let fd: os.File | $.VarRef<os.File> | null = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	return [new file({file: fd, data: $.makeSlice<number>(0, 64 * 1024, "byte"), atEOF: false}), null]
}

export function stat(name: string): [time.Time, number, $.GoError] {
	let mtime: time.Time = $.markAsStructValue(new time.Time())
	let size: number = 0
	let err: $.GoError = null as $.GoError
	let __goscriptTuple4: any = os.Stat(name)
	let st = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [$.markAsStructValue(new time.Time()), $.int(0), err]
	}
	return [$.markAsStructValue($.cloneStructValue($.pointerValue<Exclude<fs.FileInfo, null>>(st).ModTime())), $.int($.pointerValue<Exclude<fs.FileInfo, null>>(st).Size()), null]
}

export function countAnyByte(s: string, t: string): number {
	let n = 0
	for (let i = 0; i < $.len(s); i++) {
		if (bytealg.IndexByteString(t, $.uint($.indexStringOrBytes(s, i), 8)) >= 0) {
			n++
		}
	}
	return n
}

export function splitAtBytes(s: string, t: string): $.Slice<string> {
	let a: $.Slice<string> = $.makeSlice<string>(1 + countAnyByte(s, t), undefined, "string")
	let n = 0
	let last = 0
	for (let i = 0; i < $.len(s); i++) {
		if (bytealg.IndexByteString(t, $.uint($.indexStringOrBytes(s, i), 8)) >= 0) {
			if (last < i) {
				a![n] = $.sliceStringOrBytes(s, last, i)
				n++
			}
			last = i + 1
		}
	}
	if (last < $.len(s)) {
		a![n] = $.sliceStringOrBytes(s, last, undefined)
		n++
	}
	return $.goSlice(a, 0, n)
}

export function getFields(s: string): $.Slice<string> {
	return splitAtBytes(s, " \r\t\n")
}

export function dtoi(s: string): [number, number, boolean] {
	let n: number = 0
	let i: number = 0
	let ok: boolean = false
	n = 0
	for (i = 0; ((i < $.len(s)) && (48 <= $.indexStringOrBytes(s, i))) && ($.indexStringOrBytes(s, i) <= 57); i++) {
		n = (n * 10) + $.int($.indexStringOrBytes(s, i) - 48)
		if (n >= 16777215) {
			return [16777215, i, false]
		}
	}
	if (i == 0) {
		return [0, 0, false]
	}
	return [n, i, true]
}

export function xtoi(s: string): [number, number, boolean] {
	let n: number = 0
	let i: number = 0
	let ok: boolean = false
	n = 0
	for (i = 0; i < $.len(s); i++) {
		if ((48 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 57)) {
			n = n * (16)
			n = n + ($.int($.indexStringOrBytes(s, i) - 48))
		} else {
			if ((97 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 102)) {
				n = n * (16)
				n = n + ($.int($.indexStringOrBytes(s, i) - 97) + 10)
			} else {
				if ((65 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 70)) {
					n = n * (16)
					n = n + ($.int($.indexStringOrBytes(s, i) - 65) + 10)
				} else {
					break
				}
			}
		}
		if (n >= 16777215) {
			return [0, i, false]
		}
	}
	if (i == 0) {
		return [0, i, false]
	}
	return [n, i, true]
}

export function xtoi2(s: string, e: number): [number, boolean] {
	if (($.len(s) > 2) && ($.uint($.indexStringOrBytes(s, 2), 8) != $.uint(e, 8))) {
		return [$.uint(0, 8), false]
	}
	let [n, ei, ok] = xtoi($.sliceStringOrBytes(s, undefined, 2))
	return [$.uint($.uint(n, 8), 8), ok && (ei == 2)]
}

export function hasUpperCase(s: string): boolean {
	for (const [i, __rangeRune] of $.rangeString(s)) {
		if ((65 <= $.indexStringOrBytes(s, i)) && ($.indexStringOrBytes(s, i) <= 90)) {
			return true
		}
	}
	return false
}

export function lowerASCIIBytes(x: $.Slice<number>): void {
	for (let __goscriptRangeTarget0 = x, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let b = __goscriptRangeTarget0![i]
		if ((65 <= b) && (b <= 90)) {
			x![i] = x![i] + ($.uint(97 - 65, 8))
		}
	}
}

export function lowerASCII(b: number): number {
	if ((65 <= b) && (b <= 90)) {
		return $.uint(b + (97 - 65), 8)
	}
	return $.uint(b, 8)
}

export function trimSpace(x: string): string {
	while (($.len(x) > 0) && isSpace($.uint($.indexStringOrBytes(x, 0), 8))) {
		x = $.sliceStringOrBytes(x, 1, undefined)
	}
	while (($.len(x) > 0) && isSpace($.uint($.indexStringOrBytes(x, $.len(x) - 1), 8))) {
		x = $.sliceStringOrBytes(x, undefined, $.len(x) - 1)
	}
	return x
}

export function isSpace(b: number): boolean {
	return ((($.uint(b, 8) == $.uint(32, 8)) || ($.uint(b, 8) == $.uint(9, 8))) || ($.uint(b, 8) == $.uint(10, 8))) || ($.uint(b, 8) == $.uint(13, 8))
}

export function removeComment(line: string): string {
	{
		let i = bytealg.IndexByteString(line, $.uint(35, 8))
		if (i != -1) {
			return $.sliceStringOrBytes(line, undefined, i)
		}
	}
	return line
}

export async function foreachField(x: string, fn: ((field: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	x = trimSpace(x)
	while ($.len(x) > 0) {
		let sp = bytealg.IndexByteString(x, $.uint(32, 8))
		if (sp == -1) {
			return await fn!(x)
		}
		{
			let field = trimSpace($.sliceStringOrBytes(x, undefined, sp))
			if ($.len(field) > 0) {
				{
					let err = await fn!(field)
					if (err != null) {
						return err
					}
				}
			}
		}
		x = trimSpace($.sliceStringOrBytes(x, sp + 1, undefined))
	}
	return null
}

export function stringsHasSuffixFold(s: string, suffix: string): boolean {
	return ($.len(s) >= $.len(suffix)) && stringsEqualFold($.sliceStringOrBytes(s, $.len(s) - $.len(suffix), undefined), suffix)
}

export function stringsEqualFold(s: string, t: string): boolean {
	if ($.len(s) != $.len(t)) {
		return false
	}
	for (let i = 0; i < $.len(s); i++) {
		if ($.uint(lowerASCII($.uint($.indexStringOrBytes(s, i), 8)), 8) != $.uint(lowerASCII($.uint($.indexStringOrBytes(t, i), 8)), 8)) {
			return false
		}
	}
	return true
}
