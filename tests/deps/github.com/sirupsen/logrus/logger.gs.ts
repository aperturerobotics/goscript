// Generated file based on logger.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as strings from "@goscript/strings/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as __goscript_alt_exit from "./alt_exit.gs.ts"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_json_formatter from "./json_formatter.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_text_formatter from "./text_formatter.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "@goscript/bufio/index.js"
import "@goscript/runtime/index.js"
import "@goscript/strings/index.js"
import "@goscript/bytes/index.js"
import "./alt_exit.gs.ts"
import "./buffer_pool.gs.ts"
import "./entry.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./json_formatter.gs.ts"
import "./logrus.gs.ts"
import "./text_formatter.gs.ts"
import "./writer.gs.ts"

export type LogFunction = (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null

export class MutexWrap {
	public get lock(): sync.Mutex {
		return this._fields.lock.value
	}
	public set lock(value: sync.Mutex) {
		this._fields.lock.value = value
	}

	public get disabled(): boolean {
		return this._fields.disabled.value
	}
	public set disabled(value: boolean) {
		this._fields.disabled.value = value
	}

	public _fields: {
		lock: $.VarRef<sync.Mutex>
		disabled: $.VarRef<boolean>
	}

	constructor(init?: Partial<{lock?: sync.Mutex, disabled?: boolean}>) {
		this._fields = {
			lock: $.varRef(init?.lock ? $.markAsStructValue($.cloneStructValue(init.lock)) : $.markAsStructValue(new sync.Mutex())),
			disabled: $.varRef(init?.disabled ?? false)
		}
	}

	public clone(): MutexWrap {
		const cloned = new MutexWrap()
		cloned._fields = {
			lock: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lock.value))),
			disabled: $.varRef(this._fields.disabled.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Disable(): void {
		let mw: MutexWrap | $.VarRef<MutexWrap> | null = this
		$.pointerValue<MutexWrap>(mw).disabled = true
	}

	public async Lock(): globalThis.Promise<void> {
		const mw: MutexWrap | $.VarRef<MutexWrap> | null = this
		if (!$.pointerValue<MutexWrap>(mw).disabled) {
			await $.pointerValue<MutexWrap>(mw).lock.Lock()
		}
	}

	public Unlock(): void {
		const mw: MutexWrap | $.VarRef<MutexWrap> | null = this
		if (!$.pointerValue<MutexWrap>(mw).disabled) {
			$.pointerValue<MutexWrap>(mw).lock.Unlock()
		}
	}

	static __typeInfo = $.registerStructType(
		"logrus.MutexWrap",
		() => new MutexWrap(),
		[{ name: "Disable", args: [], returns: [] }, { name: "Lock", args: [], returns: [] }, { name: "Unlock", args: [], returns: [] }],
		MutexWrap,
		[{ name: "lock", key: "lock", type: "sync.Mutex", pkgPath: "github.com/sirupsen/logrus", index: [0], offset: 0, exported: false }, { name: "disabled", key: "disabled", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/sirupsen/logrus", index: [1], offset: 8, exported: false }]
	)
}

export class Logger {
	// The logs are `io.Copy`'d to this in a mutex. It's common to set this to a
	// file, or leave it default which is `os.Stderr`. You can also set this to
	// something more adventurous, such as logging to Kafka.
	public get Out(): io.Writer | null {
		return this._fields.Out.value
	}
	public set Out(value: io.Writer | null) {
		this._fields.Out.value = value
	}

	// Hooks for the logger instance. These allow firing events based on logging
	// levels and log entries. For example, to send errors to an error tracking
	// service, log to StatsD or dump the core on fatal errors.
	public get Hooks(): __goscript_hooks.LevelHooks {
		return this._fields.Hooks.value
	}
	public set Hooks(value: __goscript_hooks.LevelHooks) {
		this._fields.Hooks.value = value
	}

	// All log entries pass through the formatter before logged to Out. The
	// included formatters are `TextFormatter` and `JSONFormatter` for which
	// TextFormatter is the default. In development (when a TTY is attached) it
	// logs with colors, but to a file it wouldn't. You can easily implement your
	// own that implements the `Formatter` interface, see the `README` or included
	// formatters for examples.
	public get Formatter(): __goscript_formatter.Formatter | null {
		return this._fields.Formatter.value
	}
	public set Formatter(value: __goscript_formatter.Formatter | null) {
		this._fields.Formatter.value = value
	}

	// Flag for whether to log caller info (off by default)
	public get ReportCaller(): boolean {
		return this._fields.ReportCaller.value
	}
	public set ReportCaller(value: boolean) {
		this._fields.ReportCaller.value = value
	}

	// The logging level the logger should log at. This is typically (and defaults
	// to) `logrus.Info`, which allows Info(), Warn(), Error() and Fatal() to be
	// logged.
	public get Level(): __goscript_logrus.Level {
		return this._fields.Level.value
	}
	public set Level(value: __goscript_logrus.Level) {
		this._fields.Level.value = value
	}

	// Used to sync writing to the log. Locking is enabled by Default
	public get mu(): MutexWrap {
		return this._fields.mu.value
	}
	public set mu(value: MutexWrap) {
		this._fields.mu.value = value
	}

	// Reusable empty entry
	public get entryPool(): sync.Pool {
		return this._fields.entryPool.value
	}
	public set entryPool(value: sync.Pool) {
		this._fields.entryPool.value = value
	}

	// Function to exit the application, defaults to `os.Exit()`
	public get ExitFunc(): ((_p0: number) => void) | null {
		return this._fields.ExitFunc.value
	}
	public set ExitFunc(value: ((_p0: number) => void) | null) {
		this._fields.ExitFunc.value = value
	}

	// The buffer pool used to format the log. If it is nil, the default global
	// buffer pool will be used.
	public get BufferPool(): __goscript_buffer_pool.BufferPool | null {
		return this._fields.BufferPool.value
	}
	public set BufferPool(value: __goscript_buffer_pool.BufferPool | null) {
		this._fields.BufferPool.value = value
	}

	public _fields: {
		Out: $.VarRef<io.Writer | null>
		Hooks: $.VarRef<__goscript_hooks.LevelHooks>
		Formatter: $.VarRef<__goscript_formatter.Formatter | null>
		ReportCaller: $.VarRef<boolean>
		Level: $.VarRef<__goscript_logrus.Level>
		mu: $.VarRef<MutexWrap>
		entryPool: $.VarRef<sync.Pool>
		ExitFunc: $.VarRef<((_p0: number) => void) | null>
		BufferPool: $.VarRef<__goscript_buffer_pool.BufferPool | null>
	}

	constructor(init?: Partial<{Out?: io.Writer | null, Hooks?: __goscript_hooks.LevelHooks, Formatter?: __goscript_formatter.Formatter | null, ReportCaller?: boolean, Level?: __goscript_logrus.Level, mu?: MutexWrap, entryPool?: sync.Pool, ExitFunc?: ((_p0: number) => void) | null, BufferPool?: __goscript_buffer_pool.BufferPool | null}>) {
		this._fields = {
			Out: $.varRef(init?.Out ?? null),
			Hooks: $.varRef(init?.Hooks ?? null),
			Formatter: $.varRef(init?.Formatter ?? null),
			ReportCaller: $.varRef(init?.ReportCaller ?? false),
			Level: $.varRef(init?.Level ?? 0),
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new MutexWrap())),
			entryPool: $.varRef(init?.entryPool ? $.markAsStructValue($.cloneStructValue(init.entryPool)) : $.markAsStructValue(new sync.Pool())),
			ExitFunc: $.varRef(init?.ExitFunc ?? null),
			BufferPool: $.varRef(init?.BufferPool ?? null)
		}
	}

	public clone(): Logger {
		const cloned = new Logger()
		cloned._fields = {
			Out: $.varRef(this._fields.Out.value),
			Hooks: $.varRef(this._fields.Hooks.value),
			Formatter: $.varRef(this._fields.Formatter.value),
			ReportCaller: $.varRef(this._fields.ReportCaller.value),
			Level: $.varRef(this._fields.Level.value),
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value))),
			entryPool: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.entryPool.value))),
			ExitFunc: $.varRef(this._fields.ExitFunc.value),
			BufferPool: $.varRef(this._fields.BufferPool.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AddHook(hook: __goscript_hooks.Hook | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		__goscript_hooks.LevelHooks_Add($.pointerValue<Logger>(logger).Hooks, hook)
	}

	public async Debug(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(5, 32), args)
	}

	public async DebugFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(5, 32), fn)
	}

	public async Debugf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(5, 32), format, args)
	}

	public async Debugln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(5, 32), args)
	}

	public async Error(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(2, 32), args)
	}

	public async ErrorFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(2, 32), fn)
	}

	public async Errorf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(2, 32), format, args)
	}

	public async Errorln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(2, 32), args)
	}

	public async Exit(code: number): globalThis.Promise<void> {
		let logger: Logger | $.VarRef<Logger> | null = this
		await __goscript_alt_exit.runHandlers()
		if ($.pointerValue<Logger>(logger).ExitFunc == null) {
			$.pointerValue<Logger>(logger).ExitFunc = os.Exit
		}
		await $.pointerValue<Logger>(logger).ExitFunc!(code)
	}

	public async Fatal(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(1, 32), args)
		await Logger.prototype.Exit.call(logger, 1)
	}

	public async FatalFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(1, 32), fn)
		await Logger.prototype.Exit.call(logger, 1)
	}

	public async Fatalf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(1, 32), format, args)
		await Logger.prototype.Exit.call(logger, 1)
	}

	public async Fatalln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(1, 32), args)
		await Logger.prototype.Exit.call(logger, 1)
	}

	public GetLevel(): __goscript_logrus.Level {
		const logger: Logger | $.VarRef<Logger> | null = this
		return $.uint(Logger.prototype.level.call(logger), 32)
	}

	public async Info(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(4, 32), args)
	}

	public async InfoFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(4, 32), fn)
	}

	public async Infof(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(4, 32), format, args)
	}

	public async Infoln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(4, 32), args)
	}

	public IsLevelEnabled(level: __goscript_logrus.Level): boolean {
		const logger: Logger | $.VarRef<Logger> | null = this
		return Logger.prototype.level.call(logger) >= level
	}

	public async Log(level: __goscript_logrus.Level, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		if (Logger.prototype.IsLevelEnabled.call(logger, $.uint(level, 32))) {
			let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
			await __goscript_entry.Entry.prototype.Log.call(entry, $.uint(level, 32), args)
			Logger.prototype.releaseEntry.call(logger, entry)
		}
	}

	public async LogFn(level: __goscript_logrus.Level, fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		if (Logger.prototype.IsLevelEnabled.call(logger, $.uint(level, 32))) {
			let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
			await __goscript_entry.Entry.prototype.Log.call(entry, $.uint(level, 32), await fn!())
			Logger.prototype.releaseEntry.call(logger, entry)
		}
	}

	public async Logf(level: __goscript_logrus.Level, format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		if (Logger.prototype.IsLevelEnabled.call(logger, $.uint(level, 32))) {
			let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
			await __goscript_entry.Entry.prototype.Logf.call(entry, $.uint(level, 32), format, args)
			Logger.prototype.releaseEntry.call(logger, entry)
		}
	}

	public async Logln(level: __goscript_logrus.Level, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		if (Logger.prototype.IsLevelEnabled.call(logger, $.uint(level, 32))) {
			let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
			await __goscript_entry.Entry.prototype.Logln.call(entry, $.uint(level, 32), args)
			Logger.prototype.releaseEntry.call(logger, entry)
		}
	}

	public async Panic(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(0, 32), args)
	}

	public async PanicFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(0, 32), fn)
	}

	public async Panicf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(0, 32), format, args)
	}

	public async Panicln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(0, 32), args)
	}

	public async Print(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		await __goscript_entry.Entry.prototype.Print.call(entry, args)
		Logger.prototype.releaseEntry.call(logger, entry)
	}

	public async PrintFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		await __goscript_entry.Entry.prototype.Print.call(entry, await fn!())
		Logger.prototype.releaseEntry.call(logger, entry)
	}

	public async Printf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		await __goscript_entry.Entry.prototype.Printf.call(entry, format, args)
		Logger.prototype.releaseEntry.call(logger, entry)
	}

	public async Println(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		await __goscript_entry.Entry.prototype.Println.call(entry, args)
		Logger.prototype.releaseEntry.call(logger, entry)
	}

	public async ReplaceHooks(hooks: __goscript_hooks.LevelHooks): globalThis.Promise<__goscript_hooks.LevelHooks> {
		let logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		let oldHooks: __goscript_hooks.LevelHooks = $.pointerValue<Logger>(logger).Hooks
		$.pointerValue<Logger>(logger).Hooks = hooks
		return oldHooks
	}

	public async SetBufferPool(pool: __goscript_buffer_pool.BufferPool | null): globalThis.Promise<void> {
		let logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		$.pointerValue<Logger>(logger).BufferPool = pool
	}

	public async SetFormatter(formatter: __goscript_formatter.Formatter | null): globalThis.Promise<void> {
		let logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		$.pointerValue<Logger>(logger).Formatter = formatter
	}

	public SetLevel(level: __goscript_logrus.Level): void {
		const logger: Logger | $.VarRef<Logger> | null = this
		atomic.StoreUint32($.pointerValue<Logger>(logger)._fields.Level, $.uint($.uint(level, 32), 32))
	}

	public SetNoLock(): void {
		const logger: Logger | $.VarRef<Logger> | null = this
		$.pointerValue<Logger>(logger).mu.Disable()
	}

	public async SetOutput(output: io.Writer | null): globalThis.Promise<void> {
		let logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		$.pointerValue<Logger>(logger).Out = output
	}

	public async SetReportCaller(reportCaller: boolean): globalThis.Promise<void> {
		let logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		await $.pointerValue<Logger>(logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<Logger>(logger).mu.Unlock() })
		$.pointerValue<Logger>(logger).ReportCaller = reportCaller
	}

	public async Trace(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(6, 32), args)
	}

	public async TraceFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(6, 32), fn)
	}

	public async Tracef(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(6, 32), format, args)
	}

	public async Traceln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(6, 32), args)
	}

	public async Warn(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Log.call(logger, $.uint(3, 32), args)
	}

	public async WarnFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.LogFn.call(logger, $.uint(3, 32), fn)
	}

	public async Warnf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logf.call(logger, $.uint(3, 32), format, args)
	}

	public async Warning(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Warn.call(logger, args)
	}

	public async WarningFn(fn: (() => $.Slice<any> | globalThis.Promise<$.Slice<any>>) | null): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.WarnFn.call(logger, fn)
	}

	public async Warningf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Warnf.call(logger, format, args)
	}

	public async Warningln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Warnln.call(logger, args)
	}

	public async Warnln(args: $.Slice<any>): globalThis.Promise<void> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await Logger.prototype.Logln.call(logger, $.uint(3, 32), args)
	}

	public async WithContext(ctx: context.Context | null): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		__defer.defer(() => { Logger.prototype.releaseEntry.call(logger, entry) })
		return __goscript_entry.Entry.prototype.WithContext.call(entry, ctx)
	}

	public async WithError(err: $.GoError): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		__defer.defer(() => { Logger.prototype.releaseEntry.call(logger, entry) })
		return __goscript_entry.Entry.prototype.WithError.call(entry, err)
	}

	public async WithField(key: string, value: any): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		__defer.defer(() => { Logger.prototype.releaseEntry.call(logger, entry) })
		return __goscript_entry.Entry.prototype.WithField.call(entry, key, value)
	}

	public async WithFields(fields: __goscript_logrus.Fields): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		__defer.defer(() => { Logger.prototype.releaseEntry.call(logger, entry) })
		return __goscript_entry.Entry.prototype.WithFields.call(entry, fields)
	}

	public async WithTime(t: time.Time): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		using __defer = new $.DisposableStack()
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = await Logger.prototype.newEntry.call(logger)
		__defer.defer(() => { Logger.prototype.releaseEntry.call(logger, entry) })
		return __goscript_entry.Entry.prototype.WithTime.call(entry, $.markAsStructValue($.cloneStructValue(t)))
	}

	public async Writer(): globalThis.Promise<io.PipeWriter | $.VarRef<io.PipeWriter> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		return await Logger.prototype.WriterLevel.call(logger, $.uint(4, 32))
	}

	public async WriterLevel(level: __goscript_logrus.Level): globalThis.Promise<io.PipeWriter | $.VarRef<io.PipeWriter> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		return await __goscript_entry.Entry.prototype.WriterLevel.call(__goscript_entry.NewEntry(logger), $.uint(level, 32))
	}

	public async hooksForLevel(level: __goscript_logrus.Level): globalThis.Promise<$.Slice<__goscript_hooks.Hook | null>> {
		const logger: Logger | $.VarRef<Logger> | null = this
		await $.pointerValue<Logger>(logger).mu.Lock()
		let hooks: $.Slice<__goscript_hooks.Hook | null> = $.mapGet($.pointerValue<Logger>(logger).Hooks, level, null)[0]
		if ($.len(hooks) == 0) {
			$.pointerValue<Logger>(logger).mu.Unlock()
			return null
		}
		let out: $.Slice<__goscript_hooks.Hook | null> = $.makeSlice<__goscript_hooks.Hook | null>($.len(hooks))
		$.copy(out, hooks)
		$.pointerValue<Logger>(logger).mu.Unlock()
		return out
	}

	public level(): __goscript_logrus.Level {
		const logger: Logger | $.VarRef<Logger> | null = this
		return $.uint(atomic.LoadUint32($.pointerValue<Logger>(logger)._fields.Level), 32)
	}

	public async newEntry(): globalThis.Promise<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null> {
		const logger: Logger | $.VarRef<Logger> | null = this
		let __goscriptTuple0: any = $.typeAssertTuple<__goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null>(await $.pointerValue<Logger>(logger).entryPool.Get(), { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" })
		let entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			return entry
		}
		return __goscript_entry.NewEntry(logger)
	}

	public releaseEntry(entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): void {
		const logger: Logger | $.VarRef<Logger> | null = this
		$.pointerValue<__goscript_entry.Entry>(entry).Data = new Map<string, any>([])
		$.pointerValue<Logger>(logger).entryPool.Put($.interfaceValue<any>(entry, "*logrus.Entry"))
	}

	static __typeInfo = $.registerStructType(
		"logrus.Logger",
		() => new Logger(),
		[{ name: "AddHook", args: [], returns: [] }, { name: "Debug", args: [], returns: [] }, { name: "DebugFn", args: [], returns: [] }, { name: "Debugf", args: [], returns: [] }, { name: "Debugln", args: [], returns: [] }, { name: "Error", args: [], returns: [] }, { name: "ErrorFn", args: [], returns: [] }, { name: "Errorf", args: [], returns: [] }, { name: "Errorln", args: [], returns: [] }, { name: "Exit", args: [], returns: [] }, { name: "Fatal", args: [], returns: [] }, { name: "FatalFn", args: [], returns: [] }, { name: "Fatalf", args: [], returns: [] }, { name: "Fatalln", args: [], returns: [] }, { name: "GetLevel", args: [], returns: [] }, { name: "Info", args: [], returns: [] }, { name: "InfoFn", args: [], returns: [] }, { name: "Infof", args: [], returns: [] }, { name: "Infoln", args: [], returns: [] }, { name: "IsLevelEnabled", args: [], returns: [] }, { name: "Log", args: [], returns: [] }, { name: "LogFn", args: [], returns: [] }, { name: "Logf", args: [], returns: [] }, { name: "Logln", args: [], returns: [] }, { name: "Panic", args: [], returns: [] }, { name: "PanicFn", args: [], returns: [] }, { name: "Panicf", args: [], returns: [] }, { name: "Panicln", args: [], returns: [] }, { name: "Print", args: [], returns: [] }, { name: "PrintFn", args: [], returns: [] }, { name: "Printf", args: [], returns: [] }, { name: "Println", args: [], returns: [] }, { name: "ReplaceHooks", args: [], returns: [] }, { name: "SetBufferPool", args: [], returns: [] }, { name: "SetFormatter", args: [], returns: [] }, { name: "SetLevel", args: [], returns: [] }, { name: "SetNoLock", args: [], returns: [] }, { name: "SetOutput", args: [], returns: [] }, { name: "SetReportCaller", args: [], returns: [] }, { name: "Trace", args: [], returns: [] }, { name: "TraceFn", args: [], returns: [] }, { name: "Tracef", args: [], returns: [] }, { name: "Traceln", args: [], returns: [] }, { name: "Warn", args: [], returns: [] }, { name: "WarnFn", args: [], returns: [] }, { name: "Warnf", args: [], returns: [] }, { name: "Warning", args: [], returns: [] }, { name: "WarningFn", args: [], returns: [] }, { name: "Warningf", args: [], returns: [] }, { name: "Warningln", args: [], returns: [] }, { name: "Warnln", args: [], returns: [] }, { name: "WithContext", args: [], returns: [] }, { name: "WithError", args: [], returns: [] }, { name: "WithField", args: [], returns: [] }, { name: "WithFields", args: [], returns: [] }, { name: "WithTime", args: [], returns: [] }, { name: "Writer", args: [], returns: [] }, { name: "WriterLevel", args: [], returns: [] }, { name: "hooksForLevel", args: [], returns: [] }, { name: "level", args: [], returns: [] }, { name: "newEntry", args: [], returns: [] }, { name: "releaseEntry", args: [], returns: [] }],
		Logger,
		[{ name: "Out", key: "Out", type: "io.Writer", index: [0], offset: 0, exported: true }, { name: "Hooks", key: "Hooks", type: "logrus.LevelHooks", index: [1], offset: 16, exported: true }, { name: "Formatter", key: "Formatter", type: "logrus.Formatter", index: [2], offset: 24, exported: true }, { name: "ReportCaller", key: "ReportCaller", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [3], offset: 40, exported: true }, { name: "Level", key: "Level", type: { kind: $.TypeKind.Basic, name: "uint32", typeName: "logrus.Level" }, index: [4], offset: 44, exported: true }, { name: "mu", key: "mu", type: "logrus.MutexWrap", pkgPath: "github.com/sirupsen/logrus", index: [5], offset: 48, exported: false }, { name: "entryPool", key: "entryPool", type: "sync.Pool", pkgPath: "github.com/sirupsen/logrus", index: [6], offset: 64, exported: false }, { name: "ExitFunc", key: "ExitFunc", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo), index: [7], offset: 104, exported: true }, { name: "BufferPool", key: "BufferPool", type: "logrus.BufferPool", index: [8], offset: 112, exported: true }]
	)
}

export function New(): Logger | $.VarRef<Logger> | null {
	return new Logger({Out: $.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"), Formatter: $.interfaceValue<__goscript_formatter.Formatter | null>(new __goscript_text_formatter.TextFormatter(), "*logrus.TextFormatter"), Hooks: $.makeMap<__goscript_logrus.Level, $.Slice<__goscript_hooks.Hook | null>>(), Level: $.uint(4, 32), ExitFunc: os.Exit, ReportCaller: false})
}
