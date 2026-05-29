// Generated file based on exported.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as time from "@goscript/time/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/time/index.js"
import "@goscript/bytes/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "./buffer_pool.gs.ts"
import "./entry.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./writer.gs.ts"

export var std: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null

export function __goscript_init_std(): void {
	if (((std) as any) === undefined) {
		std = __goscript_logger.New()
	}
}

export function __goscript_get_std(): __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null {
	if (((std) as any) === undefined) {
		__goscript_init_std()
	}
	return std
}

export function __goscript_set_std(__goscriptValue: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null): void {
	std = __goscriptValue
}

export function StandardLogger(): __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null {
	return __goscript_get_std()
}

export async function SetOutput(out: io.Writer | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.SetOutput.call(__goscript_get_std(), out)
}

export async function SetFormatter(formatter: __goscript_formatter.Formatter | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.SetFormatter.call(__goscript_get_std(), formatter)
}

export async function SetReportCaller(include: boolean): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.SetReportCaller.call(__goscript_get_std(), include)
}

export function SetLevel(level: __goscript_logrus.Level): void {
	__goscript_logger.Logger.prototype.SetLevel.call(__goscript_get_std(), $.uint(level, 32))
}

export function GetLevel(): __goscript_logrus.Level {
	return $.uint(__goscript_logger.Logger.prototype.GetLevel.call(__goscript_get_std()), 32)
}

export function IsLevelEnabled(level: __goscript_logrus.Level): boolean {
	return __goscript_logger.Logger.prototype.IsLevelEnabled.call(__goscript_get_std(), $.uint(level, 32))
}

export async function AddHook(hook: __goscript_hooks.Hook | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.AddHook.call(__goscript_get_std(), hook)
}

export async function WithError(err: $.GoError): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
	return await __goscript_logger.Logger.prototype.WithField.call(__goscript_get_std(), __goscript_entry.ErrorKey, (err as any))
}

export async function WithContext(ctx: context.Context | null): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
	return await __goscript_logger.Logger.prototype.WithContext.call(__goscript_get_std(), ctx)
}

export async function WithField(key: string, value: any): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
	return await __goscript_logger.Logger.prototype.WithField.call(__goscript_get_std(), key, value)
}

export async function WithFields(fields: __goscript_logrus.Fields): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
	return await __goscript_logger.Logger.prototype.WithFields.call(__goscript_get_std(), fields)
}

export async function WithTime(t: time.Time): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
	return await __goscript_logger.Logger.prototype.WithTime.call(__goscript_get_std(), $.markAsStructValue($.cloneStructValue(t)))
}

export async function Trace(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Trace.call(__goscript_get_std(), args)
}

export async function Debug(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Debug.call(__goscript_get_std(), args)
}

export async function Print(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Print.call(__goscript_get_std(), args)
}

export async function Info(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Info.call(__goscript_get_std(), args)
}

export async function Warn(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warn.call(__goscript_get_std(), args)
}

export async function Warning(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warning.call(__goscript_get_std(), args)
}

export async function Error(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Error.call(__goscript_get_std(), args)
}

export async function Panic(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Panic.call(__goscript_get_std(), args)
}

export async function Fatal(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Fatal.call(__goscript_get_std(), args)
}

export async function TraceFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.TraceFn.call(__goscript_get_std(), fn)
}

export async function DebugFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.DebugFn.call(__goscript_get_std(), fn)
}

export async function PrintFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.PrintFn.call(__goscript_get_std(), fn)
}

export async function InfoFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.InfoFn.call(__goscript_get_std(), fn)
}

export async function WarnFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.WarnFn.call(__goscript_get_std(), fn)
}

export async function WarningFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.WarningFn.call(__goscript_get_std(), fn)
}

export async function ErrorFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.ErrorFn.call(__goscript_get_std(), fn)
}

export async function PanicFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.PanicFn.call(__goscript_get_std(), fn)
}

export async function FatalFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.FatalFn.call(__goscript_get_std(), fn)
}

export async function Tracef(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Tracef.call(__goscript_get_std(), format, args)
}

export async function Debugf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Debugf.call(__goscript_get_std(), format, args)
}

export async function Printf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Printf.call(__goscript_get_std(), format, args)
}

export async function Infof(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Infof.call(__goscript_get_std(), format, args)
}

export async function Warnf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warnf.call(__goscript_get_std(), format, args)
}

export async function Warningf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warningf.call(__goscript_get_std(), format, args)
}

export async function Errorf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Errorf.call(__goscript_get_std(), format, args)
}

export async function Panicf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Panicf.call(__goscript_get_std(), format, args)
}

export async function Fatalf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Fatalf.call(__goscript_get_std(), format, args)
}

export async function Traceln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Traceln.call(__goscript_get_std(), args)
}

export async function Debugln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Debugln.call(__goscript_get_std(), args)
}

export async function Println(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Println.call(__goscript_get_std(), args)
}

export async function Infoln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Infoln.call(__goscript_get_std(), args)
}

export async function Warnln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warnln.call(__goscript_get_std(), args)
}

export async function Warningln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Warningln.call(__goscript_get_std(), args)
}

export async function Errorln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Errorln.call(__goscript_get_std(), args)
}

export async function Panicln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Panicln.call(__goscript_get_std(), args)
}

export async function Fatalln(args: $.Slice<any>): globalThis.Promise<void> {
	await __goscript_logger.Logger.prototype.Fatalln.call(__goscript_get_std(), args)
}
