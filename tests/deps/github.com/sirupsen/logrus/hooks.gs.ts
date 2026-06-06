// Generated file based on hooks.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import type * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./buffer_pool.gs.ts"
import "./formatter.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./writer.gs.ts"

export type Hook = {
	Fire(_p0: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): $.GoError
	Levels(): $.Slice<__goscript_logrus.Level>
}

$.registerInterfaceType(
	"logrus.Hook",
	null,
	[{ name: "Fire", args: [{ name: "_p0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Levels", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint32", typeName: "logrus.Level" } } }] }]
);

export type LevelHooks = Map<__goscript_logrus.Level, $.Slice<Hook | null>> | null

export async function LevelHooks_Add(hooks: LevelHooks, hook: Hook | null): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = await $.pointerValue<Exclude<Hook, null>>(hook).Levels(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let level = __goscriptRangeTarget0![__rangeIndex]
		$.mapSet(hooks, level, $.append($.mapGet(hooks, level, null)[0], hook))
	}
}

export async function LevelHooks_Fire(hooks: LevelHooks, level: __goscript_logrus.Level, entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): globalThis.Promise<$.GoError> {
	for (let __goscriptRangeTarget1 = $.mapGet(hooks, level, null)[0], __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let hook = __goscriptRangeTarget1![__rangeIndex]
		{
			let err = await $.pointerValue<Exclude<Hook, null>>(hook).Fire(entry)
			if (err != null) {
				return err
			}
		}
	}

	return null
}
