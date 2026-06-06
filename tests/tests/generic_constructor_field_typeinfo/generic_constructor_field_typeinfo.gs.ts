// Generated file based on generic_constructor_field_typeinfo.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Block = {
	MarshalBlock(): [$.Slice<number>, $.GoError]
	UnmarshalBlock(_p0: $.Slice<number>): $.GoError
}

$.registerInterfaceType(
	"main.Block",
	null,
	[{ name: "MarshalBlock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "UnmarshalBlock", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }]
);

export class blockType {
	public get typeID(): string {
		return this._fields.typeID.value
	}
	public set typeID(value: string) {
		this._fields.typeID.value = value
	}

	public get _constructor(): (() => any | globalThis.Promise<any>) | null {
		return this._fields._constructor.value
	}
	public set _constructor(value: (() => any | globalThis.Promise<any>) | null) {
		this._fields._constructor.value = value
	}

	public _fields: {
		typeID: $.VarRef<string>
		_constructor: $.VarRef<(() => any | globalThis.Promise<any>) | null>
	}

	constructor(init?: Partial<{typeID?: string, _constructor?: (() => any | globalThis.Promise<any>) | null}>) {
		this._fields = {
			typeID: $.varRef(init?.typeID ?? ("" as unknown as string)),
			_constructor: $.varRef(init?._constructor ?? (null as unknown as (() => any | globalThis.Promise<any>) | null))
		}
	}

	public clone(): blockType {
		const cloned = new blockType()
		cloned._fields = {
			typeID: $.varRef(this._fields.typeID.value),
			_constructor: $.varRef(this._fields._constructor.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Constructor(): globalThis.Promise<Block | null> {
		const t: blockType | $.VarRef<blockType> | null = this
		return (await $.pointerValue<blockType>(t)._constructor!() as Block | null)
	}

	public GetBlockTypeID(): string {
		const t: blockType | $.VarRef<blockType> | null = this
		return $.pointerValue<blockType>(t).typeID
	}

	static __typeInfo = $.registerStructType(
		"main.blockType",
		() => new blockType(),
		[{ name: "Constructor", args: [], returns: [{ name: "_r0", type: "main.Block" }] }, { name: "GetBlockTypeID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		blockType,
		[{ name: "typeID", key: "typeID", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/generic_constructor_field_typeinfo", index: [0], offset: 0, exported: false }, { name: "constructor", key: "_constructor", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [{ name: "MarshalBlock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "UnmarshalBlock", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }] }] } as $.FunctionTypeInfo), pkgPath: "github.com/aperturerobotics/goscript/tests/tests/generic_constructor_field_typeinfo", index: [1], offset: 16, exported: false }]
	)
}

export class sampleBlock {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): sampleBlock {
		const cloned = new sampleBlock()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public MarshalBlock(): [$.Slice<number>, $.GoError] {
		return [$.arrayToSlice<number>([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)]), null]
	}

	public UnmarshalBlock(_p0: $.Slice<number>): $.GoError {
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.sampleBlock",
		() => new sampleBlock(),
		[{ name: "MarshalBlock", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "UnmarshalBlock", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		sampleBlock,
		[]
	)
}

export function NewBlockType(__typeArgs: $.GenericTypeArgs | undefined, typeID: string, _constructor: (() => any | globalThis.Promise<any>) | null): blockType | $.VarRef<blockType> | null {
	return new blockType({typeID: typeID, _constructor: _constructor})
}

export async function main(): globalThis.Promise<void> {
	let bt: blockType | $.VarRef<blockType> | null = (NewBlockType(undefined, "sample", $.functionValue((): sampleBlock | $.VarRef<sampleBlock> | null => {
		return new sampleBlock()
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "main.sampleBlock" }] } as $.FunctionTypeInfo))) as blockType | $.VarRef<blockType> | null)
	let blk = await blockType.prototype.Constructor.call(bt)
	let __goscriptTuple0: any = await $.pointerValue<Exclude<Block, null>>(blk).MarshalBlock()
	let data: $.Slice<number> = __goscriptTuple0[0]
	$.println(blockType.prototype.GetBlockTypeID.call(bt), $.len(data))
}

if ($.isMainScript(import.meta)) {
	await main()
}
