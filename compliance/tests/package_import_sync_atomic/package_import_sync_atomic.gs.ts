// Generated file based on package_import_sync_atomic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

export async function main(): Promise<void> {
	// Test atomic.Int32
	let i32: $.VarRef<atomic.Int32> = $.varRef(new atomic.Int32())
	i32!.value.Store(42)
	$.println("Int32 stored 42, value:", i32!.value.Load())

	let old = i32!.value.Swap(100)
	$.println("Int32 swapped to 100, old value:", old, "new value:", i32!.value.Load())

	let newVal = i32!.value.Add(5)
	$.println("Int32 added 5, new value:", newVal)

	if (i32!.value.CompareAndSwap(105, 200)) {
		$.println("Int32 CompareAndSwap 105->200 succeeded, value:", i32!.value.Load())
	}

	// Test atomic.Int64
	let i64: $.VarRef<atomic.Int64> = $.varRef(new atomic.Int64())
	i64!.value.Store(1000)
	$.println("Int64 stored 1000, value:", i64!.value.Load())

	i64!.value.Add(-100)
	$.println("Int64 after subtracting 100:", i64!.value.Load())

	// Test atomic.Uint32
	let u32: $.VarRef<atomic.Uint32> = $.varRef(new atomic.Uint32())
	u32!.value.Store(50)
	$.println("Uint32 stored 50, value:", u32!.value.Load())

	u32!.value.Add(25)
	$.println("Uint32 after adding 25:", u32!.value.Load())

	// Test atomic.Uint64
	let u64: $.VarRef<atomic.Uint64> = $.varRef(new atomic.Uint64())
	u64!.value.Store(2000)
	$.println("Uint64 stored 2000, value:", u64!.value.Load())

	// Test atomic.Bool
	let b: $.VarRef<atomic.Bool> = $.varRef(new atomic.Bool())
	b!.value.Store(true)
	$.println("Bool stored true, value:", b!.value.Load())

	let old_bool = b!.value.Swap(false)
	$.println("Bool swapped to false, old value:", old_bool, "new value:", b!.value.Load())

	// Test atomic.Pointer
	let ptr: $.VarRef<atomic.Pointer<string>> = $.varRef(new atomic.Pointer<string>())
	let str1 = $.varRef("hello")
	let str2 = $.varRef("world")

	ptr!.value.Store(str1)
	let loaded = ptr!.value.Load()
	if (loaded != null) {
		$.println("Pointer loaded:", loaded!.value)
	}

	let old_ptr = ptr!.value.Swap(str2)
	if (old_ptr != null) {
		$.println("Pointer swapped, old:", old_ptr!.value)
	}
	loaded = ptr!.value.Load()
	if (loaded != null) {
		$.println("Pointer new value:", loaded!.value)
	}

	// Test atomic.Value
	let val: $.VarRef<atomic.Value> = $.varRef(new atomic.Value())
	val!.value.Store("atomic value")
	{
		let loaded_val = val!.value.Load()
		if (loaded_val != null) {
			{
				let { value: str, ok: ok } = $.typeAssert<string>(loaded_val, {kind: $.TypeKind.Basic, name: 'string'})
				if (ok) {
					$.println("Value loaded:", str)
				}
			}
		}
	}

	let old_val = val!.value.Swap("new atomic value")
	if (old_val != null) {
		{
			let { value: str, ok: ok } = $.typeAssert<string>(old_val, {kind: $.TypeKind.Basic, name: 'string'})
			if (ok) {
				$.println("Value swapped, old:", str)
			}
		}
	}
	{
		let loaded_val = val!.value.Load()
		if (loaded_val != null) {
			{
				let { value: str, ok: ok } = $.typeAssert<string>(loaded_val, {kind: $.TypeKind.Basic, name: 'string'})
				if (ok) {
					$.println("Value new:", str)
				}
			}
		}
	}

	$.println("atomic test finished")
}

