// Generated file based on range_func_async_method_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class listProvider {
	public get items(): $.Slice<Group | $.VarRef<Group> | null> {
		return this._fields.items.value
	}
	public set items(value: $.Slice<Group | $.VarRef<Group> | null>) {
		this._fields.items.value = value
	}

	public _fields: {
		items: $.VarRef<$.Slice<Group | $.VarRef<Group> | null>>
	}

	constructor(init?: Partial<{items?: $.Slice<Group | $.VarRef<Group> | null>}>) {
		this._fields = {
			items: $.varRef(init?.items ?? (null as unknown as $.Slice<Group | $.VarRef<Group> | null>))
		}
	}

	public clone(): listProvider {
		const cloned = new listProvider()
		cloned._fields = {
			items: $.varRef(this._fields.items.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Items(): $.Slice<Group | $.VarRef<Group> | null> {
		const p: listProvider | $.VarRef<listProvider> | null = this
		return $.pointerValue<listProvider>(p).items
	}

	static __typeInfo = $.registerStructType(
		"main.listProvider",
		() => new listProvider(),
		[{ name: "Items", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.Group" } } }] }],
		listProvider,
		[{ name: "items", key: "items", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.Group" } } }]
	)
}

export class Group {
	public get provider(): provider | null {
		return this._fields.provider.value
	}
	public set provider(value: provider | null) {
		this._fields.provider.value = value
	}

	public get seen(): boolean {
		return this._fields.seen.value
	}
	public set seen(value: boolean) {
		this._fields.seen.value = value
	}

	public _fields: {
		provider: $.VarRef<provider | null>
		seen: $.VarRef<boolean>
	}

	constructor(init?: Partial<{provider?: provider | null, seen?: boolean}>) {
		this._fields = {
			provider: $.varRef(init?.provider ?? (null as unknown as provider | null)),
			seen: $.varRef(init?.seen ?? (false as unknown as boolean))
		}
	}

	public clone(): Group {
		const cloned = new Group()
		cloned._fields = {
			provider: $.varRef(this._fields.provider.value),
			seen: $.varRef(this._fields.seen.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Build(): globalThis.Promise<void> {
		const g: Group | $.VarRef<Group> | null = this
		let __goscriptRangeReturn0 = false
		;await (async () => {
			await $.functionValue(((__receiver) => (_yield: ((_p0: Group | $.VarRef<Group> | null) => boolean | globalThis.Promise<boolean>) | null) => __receiver.Each(_yield))($.pointerValue<Group>(g)), ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "main.Group" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))!(async (child) => {
				$.pointerValue<Group>(child).seen = true
				return true
			})
		})()
		if (__goscriptRangeReturn0) {
			return
		}
	}

	public async Each(_yield: ((_p0: Group | $.VarRef<Group> | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
		const g: Group | $.VarRef<Group> | null = this
		for (let __goscriptRangeTarget0 = await $.pointerValue<Exclude<provider, null>>($.pointerValue<Group>(g).provider).Items(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let child = __goscriptRangeTarget0![__rangeIndex]
			if (!await _yield!(child)) {
				return
			}
		}
	}

	static __typeInfo = $.registerStructType(
		"main.Group",
		() => new Group(),
		[{ name: "Build", args: [], returns: [] }, { name: "Each", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		Group,
		[{ name: "provider", key: "provider", type: "main.provider" }, { name: "seen", key: "seen", type: { kind: $.TypeKind.Basic, name: "bool" } }]
	)
}

export type provider = {
	Items(): $.Slice<Group | $.VarRef<Group> | null>
}

$.registerInterfaceType(
	"main.provider",
	null,
	[{ name: "Items", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.Group" } } }] }]
);

export async function main(): globalThis.Promise<void> {
	let child: Group | $.VarRef<Group> | null = new Group()
	let root: Group | $.VarRef<Group> | null = new Group({provider: $.interfaceValue<provider | null>(new listProvider({items: $.arrayToSlice<Group | $.VarRef<Group> | null>([child])}), "*main.listProvider")})
	await Group.prototype.Build.call(root)
	$.println($.pointerValue<Group>(child).seen)
}

if ($.isMainScript(import.meta)) {
	await main()
}
