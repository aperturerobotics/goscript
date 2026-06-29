// Generated file based on level.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_logrus from "./logrus.gs.ts"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "./logrus.gs.ts"

export class lvlPrefix {
	public get full(): string {
		return this._fields.full.value
	}
	public set full(value: string) {
		this._fields.full.value = value
	}

	public get truncated(): string {
		return this._fields.truncated.value
	}
	public set truncated(value: string) {
		this._fields.truncated.value = value
	}

	public get padded(): string {
		return this._fields.padded.value
	}
	public set padded(value: string) {
		this._fields.padded.value = value
	}

	public _fields: {
		full: $.VarRef<string>
		truncated: $.VarRef<string>
		padded: $.VarRef<string>
	}

	constructor(init?: Partial<{full?: string, truncated?: string, padded?: string}>) {
		this._fields = {
			full: $.varRef(init?.full ?? ("" as string)),
			truncated: $.varRef(init?.truncated ?? ("" as string)),
			padded: $.varRef(init?.padded ?? ("" as string))
		}
	}

	public clone(): lvlPrefix {
		const cloned = new lvlPrefix()
		cloned._fields = {
			full: $.varRef(this._fields.full.value),
			truncated: $.varRef(this._fields.truncated.value),
			padded: $.varRef(this._fields.padded.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"logrus.lvlPrefix",
		() => new lvlPrefix(),
		[],
		lvlPrefix,
		[{ name: "full", key: "full", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/sirupsen/logrus", index: [0], offset: 0, exported: false }, { name: "truncated", key: "truncated", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/sirupsen/logrus", index: [1], offset: 16, exported: false }, { name: "padded", key: "padded", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "github.com/sirupsen/logrus", index: [2], offset: 32, exported: false }]
	)
}

export const ansiReset: string = "\x1b[0m"

export const ansiRed: string = "\x1b[31m"

export const ansiYellow: string = "\x1b[33m"

export const ansiCyan: string = "\x1b[36m"

export const ansiWhite: string = "\x1b[37m"

export function colorize(level: __goscript_logrus.Level, s: string): string {
	let color = "\x1b[36m"
	switch (level) {
		case 5:
		case 6:
		{
			color = "\x1b[37m"
			break
		}
		case 3:
		{
			color = "\x1b[33m"
			break
		}
		case 2:
		case 1:
		case 0:
		{
			color = "\x1b[31m"
			break
		}
		case 4:
		{
			color = "\x1b[36m"
			break
		}
	}
	return (color + s) + "\x1b[0m"
}

export function formatLevel(level: __goscript_logrus.Level, disableTrunc: boolean, pad: boolean, maxLen: number): string {
	let upper = strings.ToUpper(__goscript_logrus.Level_String(level))

	if (pad && (maxLen > $.len(upper))) {
		upper = upper + (strings.Repeat(" ", maxLen - $.len(upper)))
	}

	if ((!pad && !disableTrunc) && ($.len(upper) > 4)) {
		upper = $.sliceStringOrBytes(upper, undefined, 4)
	}

	return colorize($.uint(level, 32), upper)
}

export var levelPrefixOnce: (() => [globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix] | globalThis.Promise<[globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix]>) | null

export function __goscript_init_levelPrefixOnce(): void {
	if (((levelPrefixOnce) as any) === undefined) {
		levelPrefixOnce = sync.OnceValues($.functionValue((): [globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix] => {
	let maxLevel: __goscript_logrus.Level = 0
	let maxLen = 0
	for (let __goscriptRangeTarget0 = __goscript_logrus.__goscript_get_AllLevels(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let lvl = __goscriptRangeTarget0![__rangeIndex]
		if (lvl > maxLevel) {
			maxLevel = $.uint(lvl, 32)
		}
		{
			let l = $.len(__goscript_logrus.Level_String(lvl))
			if (l > maxLen) {
				maxLen = l
			}
		}
	}

	let prefix: globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null = $.makeMap<__goscript_logrus.Level, lvlPrefix>()
	for (let __goscriptRangeTarget1 = __goscript_logrus.__goscript_get_AllLevels(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let lvl = __goscriptRangeTarget1![__rangeIndex]
		$.mapSet(prefix, $.uint(lvl, 32), (() => { const __goscriptLiteralField0 = formatLevel($.uint(lvl, 32), true, false, maxLen); const __goscriptLiteralField1 = formatLevel($.uint(lvl, 32), false, false, maxLen); const __goscriptLiteralField2 = formatLevel($.uint(lvl, 32), true, true, maxLen); return $.markAsStructValue(new lvlPrefix({full: __goscriptLiteralField0, truncated: __goscriptLiteralField1, padded: __goscriptLiteralField2})) })())
	}

	let unknownLevel = $.uint(maxLevel + 1, 32)
	let _unknown = (() => { const __goscriptLiteralField3 = formatLevel($.uint(unknownLevel, 32), true, false, maxLen); const __goscriptLiteralField4 = formatLevel($.uint(unknownLevel, 32), false, false, maxLen); const __goscriptLiteralField5 = formatLevel($.uint(unknownLevel, 32), true, true, maxLen); return $.markAsStructValue(new lvlPrefix({full: __goscriptLiteralField3, truncated: __goscriptLiteralField4, padded: __goscriptLiteralField5})) })()

	return [prefix, $.markAsStructValue($.cloneStructValue(_unknown))]
}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "logrus.Level" }, elemType: "logrus.lvlPrefix" }, "logrus.lvlPrefix"] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_levelPrefixOnce(): (() => [globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix] | globalThis.Promise<[globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix]>) | null {
	if (((levelPrefixOnce) as any) === undefined) {
		__goscript_init_levelPrefixOnce()
	}
	return levelPrefixOnce
}

export function __goscript_set_levelPrefixOnce(__goscriptValue: (() => [globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix] | globalThis.Promise<[globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null, lvlPrefix]>) | null): void {
	levelPrefixOnce = __goscriptValue
}

export async function levelPrefix(level: __goscript_logrus.Level, disableTrunc: boolean, pad: boolean): globalThis.Promise<string> {
	let __goscriptTuple0: any = await __goscript_get_levelPrefixOnce()!()
	let prefix: globalThis.Map<__goscript_logrus.Level, lvlPrefix> | null = __goscriptTuple0[0]
	let _unknown = __goscriptTuple0[1]

	let [p, ok] = $.mapGet<__goscript_logrus.Level, lvlPrefix, lvlPrefix>(prefix, $.uint(level, 32), $.markAsStructValue(new lvlPrefix()))
	if (!ok) {
		p = $.markAsStructValue($.cloneStructValue(_unknown))
	}

	switch (true) {
		case pad:
		{
			return p.padded
			break
		}
		case !disableTrunc:
		{
			return p.truncated
			break
		}
		default:
		{
			return p.full
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
