// Generated file based on atomic_struct_field_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

export class MyStruct {
	public get closed(): atomic.Bool {
		return this._fields.closed.value
	}
	public set closed(value: atomic.Bool) {
		this._fields.closed.value = value
	}

	public get count(): atomic.Int32 {
		return this._fields.count.value
	}
	public set count(value: atomic.Int32) {
		this._fields.count.value = value
	}

	public get flag(): atomic.Uint32 {
		return this._fields.flag.value
	}
	public set flag(value: atomic.Uint32) {
		this._fields.flag.value = value
	}

	public _fields: {
		closed: $.VarRef<atomic.Bool>
		count: $.VarRef<atomic.Int32>
		flag: $.VarRef<atomic.Uint32>
	}

	constructor(init?: Partial<{closed?: atomic.Bool, count?: atomic.Int32, flag?: atomic.Uint32}>) {
		this._fields = {
			closed: $.varRef(init?.closed ? $.markAsStructValue(init.closed.clone()) : $.markAsStructValue(new atomic.Bool())),
			count: $.varRef(init?.count ? $.markAsStructValue(init.count.clone()) : $.markAsStructValue(new atomic.Int32())),
			flag: $.varRef(init?.flag ? $.markAsStructValue(init.flag.clone()) : $.markAsStructValue(new atomic.Uint32()))
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			closed: $.varRef($.markAsStructValue(this._fields.closed.value.clone())),
			count: $.varRef($.markAsStructValue(this._fields.count.value.clone())),
			flag: $.varRef($.markAsStructValue(this._fields.flag.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		{"closed": "atomic.Bool", "count": "atomic.Int32", "flag": "atomic.Uint32"}
	)
}

export async function main(): globalThis.Promise<void> {
	// Test struct initialization with atomic fields
	let s = $.markAsStructValue(new MyStruct())

	// Test that the atomic fields work correctly
	s.closed.Store(true)
	s.count.Store($.int(42, 32))
	s.flag.Store($.uint(100, 32))

	$.println("closed:", s.closed.Load())
	$.println("count:", $.int(s.count.Load(), 32))
	$.println("flag:", $.uint(s.flag.Load(), 32))

	// Test struct initialization with init values
	let s2 = $.markAsStructValue(new MyStruct({closed: $.markAsStructValue(new atomic.Bool()), count: $.markAsStructValue(new atomic.Int32()), flag: $.markAsStructValue(new atomic.Uint32())}))

	s2.closed.Store(false)
	s2.count.Store($.int(24, 32))
	s2.flag.Store($.uint(50, 32))

	$.println("s2 closed:", s2.closed.Load())
	$.println("s2 count:", $.int(s2.count.Load(), 32))
	$.println("s2 flag:", $.uint(s2.flag.Load(), 32))

	$.println("atomic struct field test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
