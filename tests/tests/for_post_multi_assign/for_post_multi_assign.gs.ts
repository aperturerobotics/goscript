// Generated file based on for_post_multi_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class frame {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public _fields: {
		name: $.VarRef<string>
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: $.varRef(init?.name ?? "")
		}
	}

	public clone(): frame {
		const cloned = new frame()
		cloned._fields = {
			name: $.varRef(this._fields.name.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.frame",
		() => new frame(),
		[],
		frame,
		{"name": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export class iterator {
	public get idx(): number {
		return this._fields.idx.value
	}
	public set idx(value: number) {
		this._fields.idx.value = value
	}

	public _fields: {
		idx: $.VarRef<number>
	}

	constructor(init?: Partial<{idx?: number}>) {
		this._fields = {
			idx: $.varRef(init?.idx ?? 0)
		}
	}

	public clone(): iterator {
		const cloned = new iterator()
		cloned._fields = {
			idx: $.varRef(this._fields.idx.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Next(): [frame, boolean] {
		let it: iterator | $.VarRef<iterator> | null = this
		$.pointerValue<iterator>(it).idx++
		switch ($.pointerValue<iterator>(it).idx) {
			case 1:
			{
				return [$.markAsStructValue(new frame({name: "first"})), true]
				break
			}
			case 2:
			{
				return [$.markAsStructValue(new frame({name: "second"})), true]
				break
			}
			default:
			{
				return [$.markAsStructValue(new frame()), false]
				break
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"main.iterator",
		() => new iterator(),
		[{ name: "Next", args: [], returns: [] }],
		iterator,
		{"idx": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function findFrame(): frame | $.VarRef<frame> | null {
	let it: iterator | $.VarRef<iterator> | null = new iterator()
	for (let __goscriptTuple0 = iterator.prototype.Next.call(it), f = $.varRef(__goscriptTuple0[0]), again = __goscriptTuple0[1]; again; [f.value, again] = iterator.prototype.Next.call(it)) {
		if ($.stringEqual(f.value.name, "second")) {
			return f
		}
	}
	return null
}

export async function main(): globalThis.Promise<void> {
	for (let i = 0, j = 5; i < j; [i, j] = [i + 1, j - 1]) {
		$.println(i, j)
	}
	let found: frame | $.VarRef<frame> | null = findFrame()
	if (found != null) {
		$.println("frame:", $.pointerValue<frame>(found).name)
	}
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
