// Generated file based on if_type_assert.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	let a: null | any = null
	a = "this is a string"
	{
		let { ok: ok } = $.typeAssert<string>(a, {kind: $.TypeKind.Basic, name: 'string'})
		if (ok) {
			$.println("Expected: string")
		} else {
			$.println("Not Expected: should be a string")
		}
	}

	// this is from go/ast/filter.go, line 117
	class KV {
		public get Key(): null | any {
			return this._fields.Key.value
		}
		public set Key(value: null | any) {
			this._fields.Key.value = value
		}

		public _fields: {
			Key: $.VarRef<null | any>;
		}

		constructor(init?: Partial<{Key?: null | any}>) {
			this._fields = {
				Key: $.varRef(init?.Key ?? null)
			}
		}

		public clone(): KV {
			const cloned = new KV()
			cloned._fields = {
				Key: $.varRef(this._fields.Key.value)
			}
			return cloned
		}

		// Register this type with the runtime type system
		static __typeInfo = $.registerStructType(
		  'main.KV',
		  new KV(),
		  [],
		  KV,
		  {"Key": { kind: $.TypeKind.Interface, methods: [] }}
		);
	}

	let list: $.Slice<null | any> = null
	let kv = new KV({Key: "string"})
	list = $.arrayToSlice<null | any>([kv])
	for (let _i = 0; _i < $.len(list); _i++) {
		let exp = list![_i]
		{
			$.typeSwitch(exp, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'main.KV'}], body: (x) => {
				const _temp_x = x
				{
					let { value: x, ok: ok } = $.typeAssert<string>(_temp_x.Key, {kind: $.TypeKind.Basic, name: 'string'})
					if (ok) {
						$.println("got string:", x)
					} else {
						$.println("fail: should be string")
					}
				}
			}}], () => {
				$.println("fail: should be KV")
			})
		}
	}
}

