// Generated file based on star_compound_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public get values(): $.VarRef<$.Slice<number>> | null {
		return this._fields.values.value
	}
	public set values(value: $.VarRef<$.Slice<number>> | null) {
		this._fields.values.value = value
	}

	public _fields: {
		values: $.VarRef<$.VarRef<$.Slice<number>> | null>
	}

	constructor(init?: Partial<{values?: $.VarRef<$.Slice<number>> | null}>) {
		this._fields = {
			values: $.varRef(init?.values ?? (null as unknown as $.VarRef<$.Slice<number>> | null))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			values: $.varRef(this._fields.values.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[],
		holder,
		[{ name: "values", key: "values", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } } }]
	)
}

export function trim(h: holder | $.VarRef<holder> | null): void {
	$.pointerValue<holder>(h).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)), undefined, $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)) - 1)
}

export function trimParen(h: holder | $.VarRef<holder> | null): void {
	$.pointerValue<holder>(h).values!.value = $.goSlice(($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)), undefined, $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)) - 1)
}

export async function main(): globalThis.Promise<void> {
	let x: $.VarRef<number> = $.varRef(2)
	let p: $.VarRef<number> | null = x

	p!.value = p!.value + (3)
	$.println(x.value)

	p!.value = p!.value & ~((1))
	// 5 (0101) &^ 1 (0001) = 4 (0100)
	$.println(x.value)

	p!.value = p!.value << (2)
	$.println(x.value)

	p!.value = p!.value >> (1)
	$.println(x.value)

	p!.value = p!.value | (3)
	$.println(x.value)

	p!.value++
	$.println(x.value)

	p!.value--
	$.println(x.value)

	let values: $.VarRef<$.Slice<number>> = $.varRef($.arrayToSlice<number>([1, 2, 3, 4]))
	let h: holder | $.VarRef<holder> | null = new holder({values: values})
	trim(h)
	$.println("len after star:", $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)))
	trimParen(h)
	$.println("len after paren star:", $.len($.pointerValue<$.Slice<number>>($.pointerValue<holder>(h).values)))
}

if ($.isMainScript(import.meta)) {
	await main()
}
