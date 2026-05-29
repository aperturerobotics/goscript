// Generated file based on formatter.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import type * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_json_formatter from "./json_formatter.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/time/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "./buffer_pool.gs.ts"
import "./hooks.gs.ts"
import "./json_formatter.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./writer.gs.ts"

export type Formatter = {
	Format(_p0: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"logrus.Formatter",
	null,
	[{ name: "Format", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }]
)

export const defaultTimestampFormat: string = "2006-01-02T15:04:05Z07:00"

export const defaultFields: number = 3

export const FieldKeyMsg: string = "msg"

export const FieldKeyLevel: string = "level"

export const FieldKeyTime: string = "time"

export const FieldKeyLogrusError: string = "logrus_error"

export const FieldKeyFunc: string = "func"

export const FieldKeyFile: string = "file"

export function prefixFieldClashes(data: __goscript_logrus.Fields, fieldMap: __goscript_json_formatter.FieldMap, reportCaller: boolean): void {
	let timeKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "time")
	{
		let [t, ok] = $.mapGet(data, timeKey, null)
		if (ok) {
			$.mapSet(data, "fields." + timeKey, t)
			$.deleteMapEntry(data, timeKey)
		}
	}

	let msgKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "msg")
	{
		let [m, ok] = $.mapGet(data, msgKey, null)
		if (ok) {
			$.mapSet(data, "fields." + msgKey, m)
			$.deleteMapEntry(data, msgKey)
		}
	}

	let levelKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "level")
	{
		let [l, ok] = $.mapGet(data, levelKey, null)
		if (ok) {
			$.mapSet(data, "fields." + levelKey, l)
			$.deleteMapEntry(data, levelKey)
		}
	}

	let logrusErrKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "logrus_error")
	{
		let [l, ok] = $.mapGet(data, logrusErrKey, null)
		if (ok) {
			$.mapSet(data, "fields." + logrusErrKey, l)
			$.deleteMapEntry(data, logrusErrKey)
		}
	}

	// If reportCaller is not set, 'func' will not conflict.
	if (reportCaller) {
		let funcKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "func")
		{
			let [l, ok] = $.mapGet(data, funcKey, null)
			if (ok) {
				$.mapSet(data, "fields." + funcKey, l)
			}
		}
		let fileKey = __goscript_json_formatter.FieldMap_resolve(fieldMap, "file")
		{
			let [l, ok] = $.mapGet(data, fileKey, null)
			if (ok) {
				$.mapSet(data, "fields." + fileKey, l)
			}
		}
	}
}
