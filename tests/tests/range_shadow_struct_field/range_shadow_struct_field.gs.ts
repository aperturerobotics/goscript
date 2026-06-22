// Generated file based on range_shadow_struct_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Match {
	public get Size(): number {
		return this._fields.Size.value
	}
	public set Size(value: number) {
		this._fields.Size.value = value
	}

	public _fields: {
		Size: $.VarRef<number>
	}

	constructor(init?: Partial<{Size?: number}>) {
		this._fields = {
			Size: $.varRef(init?.Size ?? (0 as unknown as number))
		}
	}

	public clone(): Match {
		const cloned = new Match()
		cloned._fields = {
			Size: $.varRef(this._fields.Size.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Match",
		() => new Match(),
		[],
		Match,
		[{ name: "Size", key: "Size", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class Matcher {
	public get matches(): $.Slice<Match> {
		return this._fields.matches.value
	}
	public set matches(value: $.Slice<Match>) {
		this._fields.matches.value = value
	}

	public _fields: {
		matches: $.VarRef<$.Slice<Match>>
	}

	constructor(init?: Partial<{matches?: $.Slice<Match>}>) {
		this._fields = {
			matches: $.varRef(init?.matches ?? (null as unknown as $.Slice<Match>))
		}
	}

	public clone(): Matcher {
		const cloned = new Matcher()
		cloned._fields = {
			matches: $.varRef(this._fields.matches.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Blocks(): $.Slice<Match> {
		const m: Matcher | $.VarRef<Matcher> | null = this
		return $.pointerValue<Matcher>(m).matches
	}

	public Total(): number {
		const m: Matcher | $.VarRef<Matcher> | null = this
		let total = 0
		for (let __goscriptRangeTarget0 = Matcher.prototype.Blocks.call(m), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let __goscriptRangeShadow0 = __goscriptRangeTarget0![__rangeIndex]
			total = total + (__goscriptRangeShadow0.Size)
		}
		return total
	}

	static __typeInfo = $.registerStructType(
		"main.Matcher",
		() => new Matcher(),
		[{ name: "Blocks", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: "main.Match" } }] }, { name: "Total", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Matcher,
		[{ name: "matches", key: "matches", type: { kind: $.TypeKind.Slice, elemType: "main.Match" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let m: Matcher | $.VarRef<Matcher> | null = new Matcher({matches: $.arrayToSlice<Match>([$.markAsStructValue(new Match({Size: 3})), $.markAsStructValue(new Match({Size: 4}))])})
	$.println(Matcher.prototype.Total.call(m))
}

if ($.isMainScript(import.meta)) {
	await main()
}
