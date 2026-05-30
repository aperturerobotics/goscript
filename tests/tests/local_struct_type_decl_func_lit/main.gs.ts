// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let run: (() => void) | null = $.functionValue((): void => {
		class item {
			public get name(): string {
				return this._fields.name.value
			}
			public set name(value: string) {
				this._fields.name.value = value
			}

			public get count(): number {
				return this._fields.count.value
			}
			public set count(value: number) {
				this._fields.count.value = value
			}

			public _fields: {
				name: $.VarRef<string>
				count: $.VarRef<number>
			}

			constructor(init?: Partial<{name?: string, count?: number}>) {
				this._fields = {
					name: $.varRef(init?.name ?? ""),
					count: $.varRef(init?.count ?? 0)
				}
			}

			public clone(): item {
				const cloned = new item()
				cloned._fields = {
					name: $.varRef(this._fields.name.value),
					count: $.varRef(this._fields.count.value)
				}
				return $.markAsStructValue(cloned)
			}

			static __typeInfo = $.registerStructType(
				"main.item",
				() => new item(),
				[],
				item,
				[{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/local_struct_type_decl_func_lit", index: [0], offset: 0, exported: false }, { name: "count", key: "count", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/local_struct_type_decl_func_lit", index: [1], offset: 16, exported: false }]
			)
		}

		let items: $.Slice<item> = $.arrayToSlice<item>([$.markAsStructValue(new item({name: "alpha", count: 1})), $.markAsStructValue(new item({name: "beta", count: 2}))])
		for (let __goscriptRangeTarget0 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let item = __goscriptRangeTarget0![__rangeIndex]
			$.println(item.name, item.count)
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	await run!()
}

if ($.isMainScript(import.meta)) {
	await main()
}
