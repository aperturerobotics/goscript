// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as maps from "@goscript/maps/index.js"

import * as slices from "@goscript/slices/index.js"

import * as iter from "@goscript/iter/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])

	// This should trigger the interface range issue
	// slices.All returns an iterator interface that can be ranged over
	let __goscriptRangeReturn0 = false
	;await (async () => {
		await slices.All(s)!(async (i, v) => {
			$.println("index:", i, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}
	let __goscriptRangeReturn1 = false
	;await (async () => {
		await slices.Backward(s)!(async (i, v) => {
			if (i < 3) {
				return false
			}
			$.println("backward:", i, v)
			return true
		})
	})()
	if (__goscriptRangeReturn1) {
		return
	}

	let cloned: $.Slice<number> = slices.Clone(s)
	cloned![0] = 99
	$.println("clone first:", cloned![0], "original first:", s![0], "same len:", $.len(cloned) == $.len(s))
	let nilSlice: $.Slice<number> = null as $.Slice<number>
	$.println("nil clone:", slices.Clone(nilSlice) == null)

	$.println("equal:", slices.Equal($.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([1, 2])), slices.Equal($.arrayToSlice<number>([1]), $.arrayToSlice<number>([2])))
	$.println("equal func:", slices.EqualFunc($.arrayToSlice<number>([1, 3]), $.arrayToSlice<number>([5, 7]), $.functionValue((a: number, b: number): boolean => {
		return (a % 2) == (b % 2)
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })))
	$.println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, $.functionValue((v: number): boolean => {
		return v > 4
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] })))
	let inserted: $.Slice<number> = slices.Insert($.arrayToSlice<number>([1, 4]), 1, 2, 3)
	$.println("insert:", inserted![0], inserted![1], inserted![2], inserted![3])
	slices.Reverse(inserted)
	$.println("reverse:", inserted![0], inserted![1], inserted![2], inserted![3])
	$.println("is sorted:", slices.IsSorted($.arrayToSlice<number>([1, 2, 3])), slices.IsSorted($.arrayToSlice<number>([1, 3, 2])))

	class item {
		public get group(): number {
			return this._fields.group.value
		}
		public set group(value: number) {
			this._fields.group.value = value
		}

		public get label(): string {
			return this._fields.label.value
		}
		public set label(value: string) {
			this._fields.label.value = value
		}

		public _fields: {
			group: $.VarRef<number>
			label: $.VarRef<string>
		}

		constructor(init?: Partial<{group?: number, label?: string}>) {
			this._fields = {
				group: $.varRef(init?.group ?? 0),
				label: $.varRef(init?.label ?? "")
			}
		}

		public clone(): item {
			const cloned = new item()
			cloned._fields = {
				group: $.varRef(this._fields.group.value),
				label: $.varRef(this._fields.label.value)
			}
			return $.markAsStructValue(cloned)
		}

		static __typeInfo = $.registerStructType(
			"main.item",
			() => new item(),
			[],
			item,
			{"group": { kind: $.TypeKind.Basic, name: "int" }, "label": { kind: $.TypeKind.Basic, name: "string" }}
		)
	}
	let stable: $.Slice<item> = $.arrayToSlice<item>([$.markAsStructValue(new item({group: 2, label: "a"})), $.markAsStructValue(new item({group: 1, label: "b"})), $.markAsStructValue(new item({group: 2, label: "c"})), $.markAsStructValue(new item({group: 1, label: "d"}))])
	slices.SortStableFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, { kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [{ kind: $.TypeKind.Basic, name: "int" }] }))
	$.println("stable:", stable![0].label, stable![1].label, stable![2].label, stable![3].label)
	$.println("is sorted func:", slices.IsSortedFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, { kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [{ kind: $.TypeKind.Basic, name: "int" }] })))

	let filtered: $.Slice<number> = slices.DeleteFunc($.arrayToSlice<number>([1, 2, 3, 4, 5]), $.functionValue((v: number): boolean => {
		return (v % 2) == 0
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] }))
	$.println("delete func:", filtered![0], filtered![1], filtered![2], $.len(filtered))

	let sortedKeys: $.Slice<string> = slices.Sorted(maps.Keys(new Map<string, number>([["c", 3], ["a", 1], ["b", 2]])))
	$.println("sorted:", sortedKeys![0], sortedKeys![1], sortedKeys![2])

	$.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
