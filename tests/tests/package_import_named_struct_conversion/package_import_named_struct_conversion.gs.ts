// Generated file based on package_import_named_struct_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

export class LocalTime {
	public get wall(): number {
		return this._fields.wall.value
	}
	public set wall(value: number) {
		this._fields.wall.value = value
	}

	public get ext(): number {
		return this._fields.ext.value
	}
	public set ext(value: number) {
		this._fields.ext.value = value
	}

	public get loc(): time.Location | $.VarRef<time.Location> | null {
		return this._fields.loc.value
	}
	public set loc(value: time.Location | $.VarRef<time.Location> | null) {
		this._fields.loc.value = value
	}

	public _fields: {
		wall: $.VarRef<number>
		ext: $.VarRef<number>
		loc: $.VarRef<time.Location | $.VarRef<time.Location> | null>
	}

	constructor(init?: Partial<{wall?: number, ext?: number, loc?: time.Location | $.VarRef<time.Location> | null}>) {
		this._fields = {
			wall: $.varRef(init?.wall ?? 0),
			ext: $.varRef(init?.ext ?? 0),
			loc: $.varRef(init?.loc ?? null)
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
		new LocalTime(),
		[],
		LocalTime,
		{"wall": { kind: $.TypeKind.Basic, name: "int" }, "ext": { kind: $.TypeKind.Basic, name: "int" }, "loc": { kind: $.TypeKind.Pointer, elemType: "time.Location" }}
	)
}

export function asTime(t: LocalTime): time.Time {
	return $.markAsStructValue($.cloneStructValue((t as unknown as time.Time)))
}

export function asLocal(t: time.Time): LocalTime {
	return $.markAsStructValue($.cloneStructValue((t as unknown as LocalTime)))
}

export async function main(): globalThis.Promise<void> {
	let first = $.markAsStructValue($.cloneStructValue(($.markAsStructValue($.cloneStructValue(time.Unix(11, 0))).UTC() as unknown as LocalTime)))
	$.println("as time:", $.markAsStructValue($.cloneStructValue(asTime($.markAsStructValue($.cloneStructValue(first))))).Unix())

	let second = $.markAsStructValue($.cloneStructValue(asLocal($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(time.Unix(22, 0))).UTC())))))
	$.println("as local:", $.markAsStructValue($.cloneStructValue((second as unknown as time.Time))).Unix())
}


if ($.isMainScript(import.meta)) {
	await main()
}
