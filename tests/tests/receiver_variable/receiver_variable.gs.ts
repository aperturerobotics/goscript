// Generated file based on receiver_variable.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as errors from "@goscript/errors/index.ts"

import * as sync from "@goscript/sync/index.ts"

export class content {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get bytes(): $.Slice<number> {
		return this._fields.bytes.value
	}
	public set bytes(value: $.Slice<number>) {
		this._fields.bytes.value = value
	}

	public get m(): RWMutex {
		return this._fields.m.value
	}
	public set m(value: RWMutex) {
		this._fields.m.value = value
	}

	public _fields: {
		name: $.VarRef<string>
		bytes: $.VarRef<$.Slice<number>>
		m: $.VarRef<RWMutex>
	}

	constructor(init?: Partial<{name?: string, bytes?: $.Slice<number>, m?: RWMutex}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			bytes: $.varRef(init?.bytes ?? null),
			m: $.varRef(init?.m ? $.markAsStructValue(init.m.clone()) : $.markAsStructValue(new RWMutex()))
		}
	}

	public clone(): content {
		const cloned = new content()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			bytes: $.varRef(this._fields.bytes.value),
			m: $.varRef($.markAsStructValue(this._fields.m.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	public async Clear(): Promise<void> {
		const c = this
		using __defer = new $.DisposableStack()
		await $.pointerValue(c).m.Lock()
		__defer.defer(() => { $.pointerValue(c).m.Unlock() })
		{
			let len = $.len($.pointerValue(c).bytes)
			if (len > 0) {
				$.pointerValue(c).bytes = $.makeSlice<number>(0, undefined, "byte")
			}
		}
	}

	public async ComplexMethod(): Promise<error> {
		const c = this
		using __defer = new $.DisposableStack()
		await $.pointerValue(c).m.Lock()
		__defer.defer(() => { $.pointerValue(c).m.Unlock() })
		if ($.len($.pointerValue(c).bytes) == 0) {
			$.pointerValue(c).bytes = $.makeSlice<number>(10, undefined, "byte")
		}
		for (let i = 0; i < 3; i++) {
			{
				let [data, err] = $.pointerValue(c).getData(i)
				if (err == null) {
					if ($.len(data) > 0) {
						$.pointerValue(c).bytes = $.append($.pointerValue(c).bytes, data)
					}
				}
			}
		}
		{
			let x = $.len($.pointerValue(c).bytes)
			if (x > 20) {
				$.pointerValue(c).bytes = $.goSlice($.pointerValue(c).bytes, undefined, 20)
				let fn = (): void => {
	if ($.len($.pointerValue(c).bytes) > 0) {
		$.pointerValue(c).bytes[0] = 42
	}
}
				fn()
			}
		}
		return null
	}

	public Len(): number {
		const c = this
		return $.len($.pointerValue(c).bytes)
	}

	public async ReadAt(b: $.Slice<number>, off: number): Promise<void> {
		const c = this
		if (off < 0) {
			return [0, errors.New("negative offset")]
		}
		await $.pointerValue(c).m.RLock()
		let size = $.int($.len($.pointerValue(c).bytes))
		if (off >= size) {
			$.pointerValue(c).m.RUnlock()
			return [0, errors.New("EOF")]
		}
		let l = $.int($.len(b))
		if (off + l > size) {
			l = size - off
		}
		let btr = $.goSlice($.pointerValue(c).bytes, off, off + l)
		n = $.copy(b, btr)
		if ($.len(btr) < $.len(b)) {
			err = errors.New("EOF")
		}
		$.pointerValue(c).m.RUnlock()
		return
	}

	public async Size(): Promise<number> {
		const c = this
		using __defer = new $.DisposableStack()
		await $.pointerValue(c).m.RLock()
		__defer.defer(() => { ((): void => {
	$.pointerValue(c).m.RUnlock()
})() })
		return $.len($.pointerValue(c).bytes)
	}

	public Truncate(): void {
		const c = this
		$.pointerValue(c).bytes = $.makeSlice<number>(0, undefined, "byte")
	}

	public async WriteAt(p: $.Slice<number>, off: number): Promise<void> {
		const c = this
		if (off < 0) {
			return [0, errors.New("negative offset")]
		}
		await $.pointerValue(c).m.Lock()
		let prev = $.len($.pointerValue(c).bytes)
		let diff = $.int(off) - prev
		if (diff > 0) {
			$.pointerValue(c).bytes = $.append($.pointerValue(c).bytes, $.makeSlice<number>(diff, undefined, "byte"))
		}
		$.pointerValue(c).bytes = $.append($.goSlice($.pointerValue(c).bytes, undefined, off), p)
		if ($.len($.pointerValue(c).bytes) < prev) {
			$.pointerValue(c).bytes = $.goSlice($.pointerValue(c).bytes, undefined, prev)
		}
		$.pointerValue(c).m.Unlock()
		return [$.len(p), null]
	}

	public getData(index: number): void {
		const c = this
		if (index < 0) {
			return [null, errors.New("invalid index")]
		}
		return [[$.int(index), $.int(index + 1)], null]
	}

	static __typeInfo = $.registerStructType(
		"main.content",
		new content(),
		[{ name: "Clear", args: [], returns: [] }, { name: "ComplexMethod", args: [], returns: [] }, { name: "Len", args: [], returns: [] }, { name: "ReadAt", args: [], returns: [] }, { name: "Size", args: [], returns: [] }, { name: "Truncate", args: [], returns: [] }, { name: "WriteAt", args: [], returns: [] }, { name: "getData", args: [], returns: [] }],
		content,
		{"name": { kind: $.TypeKind.Basic, name: "string" }, "bytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "m": "sync.RWMutex"}
	)
}

export async function main(): Promise<void> {
	let c = new content({name: "test", bytes: $.makeSlice<number>(0, undefined, "byte")})
	{
		let err = await $.pointerValue(c).ComplexMethod()
		if (err != null) {
			$.println("Error:", err.Error())
			return
		}
	}
	$.println("Complex method completed, size:", await $.pointerValue(c).Size())
}


if ($.isMainScript(import.meta)) {
	await main()
}
