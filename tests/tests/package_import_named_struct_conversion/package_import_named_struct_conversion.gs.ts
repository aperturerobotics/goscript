// Generated file based on package_import_named_struct_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/time/index.js"

export class LocalTime {
	public get wall(): bigint {
		return this._fields.wall.value
	}
	public set wall(value: bigint) {
		this._fields.wall.value = value
	}

	public get ext(): bigint {
		return this._fields.ext.value
	}
	public set ext(value: bigint) {
		this._fields.ext.value = value
	}

	public get loc(): time.Location | $.VarRef<time.Location> | null {
		return this._fields.loc.value
	}
	public set loc(value: time.Location | $.VarRef<time.Location> | null) {
		this._fields.loc.value = value
	}

	public _fields: {
		wall: $.VarRef<bigint>
		ext: $.VarRef<bigint>
		loc: $.VarRef<time.Location | $.VarRef<time.Location> | null>
	}

	constructor(init?: Partial<{wall?: bigint, ext?: bigint, loc?: time.Location | $.VarRef<time.Location> | null}>) {
		this._fields = {
			wall: $.varRef(init?.wall ?? (0n as bigint)),
			ext: $.varRef(init?.ext ?? (0n as bigint)),
			loc: $.varRef(init?.loc ?? (null as time.Location | $.VarRef<time.Location> | null))
		}
	}

	public clone(): LocalTime {
		const cloned = new LocalTime()
		cloned._fields = {
			wall: $.varRef(this._fields.wall.value),
			ext: $.varRef(this._fields.ext.value),
			loc: $.varRef(this._fields.loc.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.LocalTime",
		() => new LocalTime(),
		[],
		LocalTime,
		[{ name: "wall", key: "wall", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "ext", key: "ext", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "loc", key: "loc", type: { kind: $.TypeKind.Pointer, elemType: "time.Location" } }]
	)
}

export function asTime(t: LocalTime): time.Time {
	return $.markAsStructValue($.cloneStructValue($.namedStructConversion<time.Time>(t)))
}

export function asLocal(t: time.Time): LocalTime {
	return $.markAsStructValue($.cloneStructValue($.namedStructConversion<LocalTime>(t)))
}

export async function main(): globalThis.Promise<void> {
	let first = $.markAsStructValue($.cloneStructValue($.namedStructConversion<LocalTime>($.markAsStructValue($.cloneStructValue(time.Unix(11n, 0n))).UTC())))
	$.println("as time:", $.markAsStructValue($.cloneStructValue(asTime($.markAsStructValue($.cloneStructValue(first))))).Unix())

	let second = $.markAsStructValue($.cloneStructValue(asLocal($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(22n, 0n))).UTC())))))
	$.println("as local:", $.markAsStructValue($.cloneStructValue($.namedStructConversion<time.Time>(second))).Unix())
}

if ($.isMainScript(import.meta)) {
	await main()
}
