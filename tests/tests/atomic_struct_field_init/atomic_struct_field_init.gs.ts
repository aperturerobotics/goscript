// Generated file based on atomic_struct_field_init.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as atomic from "@goscript/sync/atomic/index.ts"

export class MyStruct {
	public get closed(): Bool {
		return this._fields.closed.value
	}
	public set closed(value: Bool) {
		this._fields.closed.value = value
	}

	public get count(): Int32 {
		return this._fields.count.value
	}
	public set count(value: Int32) {
		this._fields.count.value = value
	}

	public get flag(): Uint32 {
		return this._fields.flag.value
	}
	public set flag(value: Uint32) {
		this._fields.flag.value = value
	}

	public _fields: {
		closed: $.VarRef<Bool>
		count: $.VarRef<Int32>
		flag: $.VarRef<Uint32>
	}

	constructor(init?: Partial<{closed?: Bool, count?: Int32, flag?: Uint32}>) {
		this._fields = {
			closed: $.varRef(init?.closed ? $.markAsStructValue(init.closed.clone()) : $.markAsStructValue(new Bool())),
			count: $.varRef(init?.count ? $.markAsStructValue(init.count.clone()) : $.markAsStructValue(new Int32())),
			flag: $.varRef(init?.flag ? $.markAsStructValue(init.flag.clone()) : $.markAsStructValue(new Uint32()))
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
		new MyStruct(),
		[],
		MyStruct,
		{"closed": "atomic.Bool", "count": "atomic.Int32", "flag": "atomic.Uint32"}
	)
}

export async function main(): Promise<void> {
	let s = $.markAsStructValue(new MyStruct())
	s.closed.Store(true)
	s.count.Store(42)
	s.flag.Store(100)
	$.println("closed:", s.closed.Load())
	$.println("count:", s.count.Load())
	$.println("flag:", s.flag.Load())
	let s2 = $.markAsStructValue(new MyStruct({closed: $.markAsStructValue(new atomic.Bool()), count: $.markAsStructValue(new atomic.Int32()), flag: $.markAsStructValue(new atomic.Uint32())}))
	s2.closed.Store(false)
	s2.count.Store(24)
	s2.flag.Store(50)
	$.println("s2 closed:", s2.closed.Load())
	$.println("s2 count:", s2.count.Load())
	$.println("s2 flag:", s2.flag.Load())
	$.println("atomic struct field test finished")
}


if ($.isMainScript(import.meta)) {
	await main()
}
