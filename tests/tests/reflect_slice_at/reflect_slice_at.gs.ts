// Generated file based on reflect_slice_at.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/reflect/index.js"
import "@goscript/unsafe/index.js"

export async function main(): globalThis.Promise<void> {
	let local = $.varRef(41)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}))!, (local as any)))).Elem())).SetInt($.int(42))
	$.println("newat-local:", local.value)

	class holder {
		public get Count(): number {
			return this._fields.Count.value
		}
		public set Count(value: number) {
			this._fields.Count.value = value
		}

		public _fields: {
			Count: $.VarRef<number>
		}

		constructor(init?: Partial<{Count?: number}>) {
			this._fields = {
				Count: $.varRef(init?.Count ?? (0 as unknown as number))
			}
		}

		public clone(): holder {
			const cloned = new holder()
			cloned._fields = {
				Count: $.varRef(this._fields.Count.value)
			}
			return $.markAsStructValue(cloned)
		}

		static __typeInfo = $.registerStructType(
			"main.holder",
			() => new holder(),
			[],
			holder,
			[{ name: "Count", key: "Count", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
		)
	}
	let h = $.markAsStructValue(new holder({Count: 5}))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}))!, (h._fields.Count as any)))).Elem())).SetInt($.int(6))
	$.println("newat-field:", h.Count)

	let buf: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8), $.uint(4, 8)])
	let bytes = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "uint8" }, zero: () => 0 }}))!, ($.indexRef(buf!, 1) as any), 2)))
	$.println("bytes:", $.markAsStructValue($.cloneStructValue(bytes)).Len(), $.markAsStructValue($.cloneStructValue(bytes)).Cap(), $.uint($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(0))).Uint(), 64), $.uint($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(1))).Uint(), 64))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(0))).SetUint($.uint(9, 64))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(1))).SetUint($.uint(8, 64))
	$.println("buf:", $.uint(buf![0], 8), $.uint(buf![1], 8), $.uint(buf![2], 8), $.uint(buf![3], 8))

	let ints: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30, 40])
	let intSlice = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}))!, ($.indexRef(ints!, 1) as any), 2)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(intSlice)).Index(1))).SetInt($.int(77))
	$.println("ints:", ints![0], ints![1], ints![2], ints![3], $.markAsStructValue($.cloneStructValue(intSlice)).Len(), $.markAsStructValue($.cloneStructValue(intSlice)).Cap())

	let empty = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}))!, (null as any), 0)))
	$.println("empty:", $.markAsStructValue($.cloneStructValue(empty)).IsNil(), $.markAsStructValue($.cloneStructValue(empty)).Len(), $.markAsStructValue($.cloneStructValue(empty)).Cap())

	$.println("reflect_slice_at test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
