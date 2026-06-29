// Generated file based on wide_uint64_chunker_arith.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class chunker {
	public get pos(): bigint {
		return this._fields.pos.value
	}
	public set pos(value: bigint) {
		this._fields.pos.value = value
	}

	public _fields: {
		pos: $.VarRef<bigint>
	}

	constructor(init?: Partial<{pos?: bigint}>) {
		this._fields = {
			pos: $.varRef(init?.pos ?? (0n as bigint))
		}
	}

	public clone(): chunker {
		const cloned = new chunker()
		cloned._fields = {
			pos: $.varRef(this._fields.pos.value)
		}
		return $.markAsStructValue(cloned)
	}

	public advance(chunkSize: number): void {
		let c: chunker | $.VarRef<chunker> | null = this
		$.pointerValue<chunker>(c).pos = $.uint64Add($.pointerValue<chunker>(c).pos, $.uint64(chunkSize))
	}

	static __typeInfo = $.registerStructType(
		"main.chunker",
		() => new chunker(),
		[{ name: "advance", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		chunker,
		[{ name: "pos", key: "pos", type: { kind: $.TypeKind.Basic, name: "uint64" } }]
	)
}

export class repeatReader {
	public get remaining(): number {
		return this._fields.remaining.value
	}
	public set remaining(value: number) {
		this._fields.remaining.value = value
	}

	public _fields: {
		remaining: $.VarRef<number>
	}

	constructor(init?: Partial<{remaining?: number}>) {
		this._fields = {
			remaining: $.varRef(init?.remaining ?? (0 as number))
		}
	}

	public clone(): repeatReader {
		const cloned = new repeatReader()
		cloned._fields = {
			remaining: $.varRef(this._fields.remaining.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: repeatReader | $.VarRef<repeatReader> | null = this
		if ($.pointerValue<repeatReader>(r).remaining == 0) {
			return [0, io.EOF]
		}
		let n = $.len(p)
		if (n > $.pointerValue<repeatReader>(r).remaining) {
			n = $.pointerValue<repeatReader>(r).remaining
		}
		for (let i = 0; i < n; i++) {
			p![i] = $.uint($.uint(i, 8), 8)
		}
		$.pointerValue<repeatReader>(r).remaining = $.pointerValue<repeatReader>(r).remaining - (n)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.repeatReader",
		() => new repeatReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		repeatReader,
		[{ name: "remaining", key: "remaining", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export function algorithm(data: $.Slice<number>, n: number, g: $.Slice<bigint>, maskC: bigint, maskJ: bigint, minSize: number, jumpLength: number): number {
	let fp = 0n
	let i = minSize
	while (i < n) {
		fp = $.uint64Add(($.uint64Shl(fp, 1)), $.arrayIndex(g!, $.arrayIndex(data!, i) % uint64Len(g)))
		if (($.uint64And(fp, maskJ)) == 0n) {
			if (($.uint64And(fp, maskC)) == 0n) {
				return i
			}
			fp = 0n
			i = i + jumpLength
		} else {
			i++
		}
	}
	return $.min(i, n)
}

export function uint64Len(g: $.Slice<bigint>): number {
	return $.uint($.uint($.len(g), 8), 8)
}

export async function main(): globalThis.Promise<void> {
	let g: $.Slice<bigint> = $.arrayToSlice<bigint>([7n, 11n, 22n, 33n])
	let data: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(0, 8), $.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(0, 8), $.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(0, 8)])
	$.println("algo", algorithm(data, $.len(data), g, 3n, 1n, 0, 3))

	let c: chunker | $.VarRef<chunker> | null = new chunker()
	let totalSize: bigint = 0n
	let chkStart: bigint = 0n

	let src = io.LimitReader($.pointerValueOrNil($.interfaceValue<io.Reader | null>(newRepeatReader(40), "*main.repeatReader"))!, 25n)
	let buf: $.Slice<number> = $.makeSlice<number>(8, undefined, "byte")
	while (true) {
		let [nr, err] = await $.pointerValue<Exclude<io.Reader, null>>(src).Read(buf)
		if (nr > 0) {
			chunker.prototype.advance.call(c, nr)
			totalSize = $.uint64Add(totalSize, $.uint64(nr))
			chkStart = $.uint64Add(chkStart, $.uint64(nr))
		}
		if ($.comparableEqual(err, io.EOF)) {
			break
		}
		if (err != null) {
			$.println("err", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	$.println("pos", $.pointerValue<chunker>(c).pos)
	$.println("total", totalSize)
	$.println("chkStart", chkStart)
}

export function newRepeatReader(n: number): repeatReader | $.VarRef<repeatReader> | null {
	return new repeatReader({remaining: n})
}

if ($.isMainScript(import.meta)) {
	await main()
}
