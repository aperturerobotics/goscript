// Generated file based on info.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class floatInfo {
	public get mantbits(): number {
		return this._fields.mantbits.value
	}
	public set mantbits(value: number) {
		this._fields.mantbits.value = value
	}

	public get expbits(): number {
		return this._fields.expbits.value
	}
	public set expbits(value: number) {
		this._fields.expbits.value = value
	}

	public _fields: {
		mantbits: $.VarRef<number>
		expbits: $.VarRef<number>
	}

	constructor(init?: Partial<{mantbits?: number, expbits?: number}>) {
		this._fields = {
			mantbits: $.varRef(init?.mantbits ?? (0 as number)),
			expbits: $.varRef(init?.expbits ?? (0 as number))
		}
	}

	public clone(): floatInfo {
		const cloned = new floatInfo()
		cloned._fields = {
			mantbits: $.varRef(this._fields.mantbits.value),
			expbits: $.varRef(this._fields.expbits.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.floatInfo",
		() => new floatInfo(),
		[],
		floatInfo,
		[{ name: "mantbits", key: "mantbits", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "expbits", key: "expbits", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export let info: $.VarRef<floatInfo> = $.varRef($.markAsStructValue(new floatInfo({mantbits: 52, expbits: 11})))

export function __goscript_set_info(__goscriptValue: floatInfo): void {
	info.value = __goscriptValue
}

export function infoPtr(): floatInfo | $.VarRef<floatInfo> | null {
	return info
}
