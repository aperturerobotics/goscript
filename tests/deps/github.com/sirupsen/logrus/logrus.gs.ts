// Generated file based on logrus.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as log from "@goscript/log/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"
import "@goscript/log/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./buffer_pool.gs.ts"
import "./entry.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./logger.gs.ts"
import "./writer.gs.ts"

export type Fields = Map<string, any> | null

export type Level = number

export type StdLogger = {
	Fatal(args: $.Slice<any>): void
	Fatalf(format: string, args: $.Slice<any>): void
	Fatalln(args: $.Slice<any>): void
	Panic(args: $.Slice<any>): void
	Panicf(format: string, args: $.Slice<any>): void
	Panicln(args: $.Slice<any>): void
	Print(args: $.Slice<any>): void
	Printf(format: string, args: $.Slice<any>): void
	Println(args: $.Slice<any>): void
}

$.registerInterfaceType(
	"logrus.StdLogger",
	null,
	[{ name: "Fatal", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panic", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Print", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Printf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Println", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }]
)

export type FieldLogger = {
	Debug(args: $.Slice<any>): void
	Debugf(format: string, args: $.Slice<any>): void
	Debugln(args: $.Slice<any>): void
	Error(args: $.Slice<any>): void
	Errorf(format: string, args: $.Slice<any>): void
	Errorln(args: $.Slice<any>): void
	Fatal(args: $.Slice<any>): void
	Fatalf(format: string, args: $.Slice<any>): void
	Fatalln(args: $.Slice<any>): void
	Info(args: $.Slice<any>): void
	Infof(format: string, args: $.Slice<any>): void
	Infoln(args: $.Slice<any>): void
	Panic(args: $.Slice<any>): void
	Panicf(format: string, args: $.Slice<any>): void
	Panicln(args: $.Slice<any>): void
	Print(args: $.Slice<any>): void
	Printf(format: string, args: $.Slice<any>): void
	Println(args: $.Slice<any>): void
	Warn(args: $.Slice<any>): void
	Warnf(format: string, args: $.Slice<any>): void
	Warning(args: $.Slice<any>): void
	Warningf(format: string, args: $.Slice<any>): void
	Warningln(args: $.Slice<any>): void
	Warnln(args: $.Slice<any>): void
	WithError(err: $.GoError): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
	WithField(key: string, value: any): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
	WithFields(fields: Fields): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
}

$.registerInterfaceType(
	"logrus.FieldLogger",
	null,
	[{ name: "Debug", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Debugf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Debugln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Error", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Errorf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Errorln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatal", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Info", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Infof", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Infoln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panic", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Print", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Printf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Println", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warn", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warnf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warning", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warningf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warningln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warnln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "WithError", args: [{ name: "err", type: "error" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }, { name: "WithField", args: [{ name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }, { name: "WithFields", args: [{ name: "fields", type: "logrus.Fields" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }]
)

export type Ext1FieldLogger = {
	Debug(args: $.Slice<any>): void
	Debugf(format: string, args: $.Slice<any>): void
	Debugln(args: $.Slice<any>): void
	Error(args: $.Slice<any>): void
	Errorf(format: string, args: $.Slice<any>): void
	Errorln(args: $.Slice<any>): void
	Fatal(args: $.Slice<any>): void
	Fatalf(format: string, args: $.Slice<any>): void
	Fatalln(args: $.Slice<any>): void
	Info(args: $.Slice<any>): void
	Infof(format: string, args: $.Slice<any>): void
	Infoln(args: $.Slice<any>): void
	Panic(args: $.Slice<any>): void
	Panicf(format: string, args: $.Slice<any>): void
	Panicln(args: $.Slice<any>): void
	Print(args: $.Slice<any>): void
	Printf(format: string, args: $.Slice<any>): void
	Println(args: $.Slice<any>): void
	Trace(args: $.Slice<any>): void
	Tracef(format: string, args: $.Slice<any>): void
	Traceln(args: $.Slice<any>): void
	Warn(args: $.Slice<any>): void
	Warnf(format: string, args: $.Slice<any>): void
	Warning(args: $.Slice<any>): void
	Warningf(format: string, args: $.Slice<any>): void
	Warningln(args: $.Slice<any>): void
	Warnln(args: $.Slice<any>): void
	WithError(err: $.GoError): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
	WithField(key: string, value: any): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
	WithFields(fields: Fields): __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null | globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>
}

$.registerInterfaceType(
	"logrus.Ext1FieldLogger",
	null,
	[{ name: "Debug", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Debugf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Debugln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Error", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Errorf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Errorln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatal", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Fatalln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Info", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Infof", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Infoln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panic", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Panicln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Print", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Printf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Println", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Trace", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Tracef", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Traceln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warn", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warnf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warning", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warningf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warningln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "Warnln", args: [{ name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "WithError", args: [{ name: "err", type: "error" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }, { name: "WithField", args: [{ name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }, { name: "WithFields", args: [{ name: "fields", type: "logrus.Fields" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }] }]
)

export const PanicLevel: Level = 0

export const FatalLevel: Level = 1

export const ErrorLevel: Level = 2

export const WarnLevel: Level = 3

export const InfoLevel: Level = 4

export const DebugLevel: Level = 5

export const TraceLevel: Level = 6

export function Level_String(level: Level): string {
	switch (level) {
		case 6:
		{
			return "trace"
			break
		}
		case 5:
		{
			return "debug"
			break
		}
		case 4:
		{
			return "info"
			break
		}
		case 3:
		{
			return "warning"
			break
		}
		case 2:
		{
			return "error"
			break
		}
		case 1:
		{
			return "fatal"
			break
		}
		case 0:
		{
			return "panic"
			break
		}
		default:
		{
			return "unknown"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function ParseLevel(lvl: string): [Level, $.GoError] {
	const __goscriptReturn0 = parseLevel($.stringToBytes(lvl))
	return [$.uint(__goscriptReturn0[0], 32), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export function parseLevel(b: $.Slice<number>): [Level, $.GoError] {
	switch (true) {
		case bytes.EqualFold(b, new Uint8Array([112, 97, 110, 105, 99])):
		{
			return [$.uint(0, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([102, 97, 116, 97, 108])):
		{
			return [$.uint(1, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([101, 114, 114, 111, 114])):
		{
			return [$.uint(2, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([119, 97, 114, 110])):
		case bytes.EqualFold(b, new Uint8Array([119, 97, 114, 110, 105, 110, 103])):
		{
			return [$.uint(3, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([105, 110, 102, 111])):
		{
			return [$.uint(4, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([100, 101, 98, 117, 103])):
		{
			return [$.uint(5, 32), null]
			break
		}
		case bytes.EqualFold(b, new Uint8Array([116, 114, 97, 99, 101])):
		{
			return [$.uint(6, 32), null]
			break
		}
		default:
		{
			return [$.uint(0, 32), fmt.Errorf("not a valid logrus Level: %q", $.interfaceValue<any>(b, "[]byte"))]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function Level_UnmarshalText(level: $.VarRef<Level> | null, text: $.Slice<number>): $.GoError {
	let __goscriptTuple0: any = parseLevel(text)
	let l = $.uint(__goscriptTuple0[0], 32)
	let err = __goscriptTuple0[1]
	if (err != null) {
		return err
	}

	level!.value = $.uint(l, 32)

	return null
}

export function Level_MarshalText(level: Level): [$.Slice<number>, $.GoError] {
	switch (level) {
		case 6:
		case 5:
		case 4:
		case 3:
		case 2:
		case 1:
		case 0:
		{
			return [$.stringToBytes(Level_String(level)), null]
			break
		}
		default:
		{
			return [null, fmt.Errorf("not a valid logrus level %d", $.namedValueInterfaceValue<any>(level, "logrus.Level", {MarshalText: (receiver: any, ...args: any[]) => (Level_MarshalText as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (Level_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint32", typeName: "logrus.Level" }))]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export var AllLevels: $.Slice<Level>

export function __goscript_init_AllLevels(): void {
	if (((AllLevels) as any) === undefined) {
		AllLevels = $.arrayToSlice<Level>([$.uint(0, 32), $.uint(1, 32), $.uint(2, 32), $.uint(3, 32), $.uint(4, 32), $.uint(5, 32), $.uint(6, 32)])
	}
}

export function __goscript_get_AllLevels(): $.Slice<Level> {
	if (((AllLevels) as any) === undefined) {
		__goscript_init_AllLevels()
	}
	return AllLevels
}

export function __goscript_set_AllLevels(__goscriptValue: $.Slice<Level>): void {
	AllLevels = __goscriptValue
}
