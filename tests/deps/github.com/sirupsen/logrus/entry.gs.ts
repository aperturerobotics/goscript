// Generated file based on entry.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as maps from "@goscript/maps/index.js"

import * as os from "@goscript/os/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/fmt/index.js"
import "@goscript/maps/index.js"
import "@goscript/os/index.js"
import "@goscript/reflect/index.js"
import "@goscript/runtime/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/bufio/index.js"
import "@goscript/io/index.js"
import "./buffer_pool.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./writer.gs.ts"

export class Entry {
	// Logger is the Logger that owns this entry and is responsible for
	// formatting, hooks, and output. It must not be nil. An Entry without
	// a Logger is invalid and will panic when logged.
	public get Logger(): __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null {
		return this._fields.Logger.value
	}
	public set Logger(value: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null) {
		this._fields.Logger.value = value
	}

	// Data contains all user-defined fields attached to this entry.
	public get Data(): __goscript_logrus.Fields {
		return this._fields.Data.value
	}
	public set Data(value: __goscript_logrus.Fields) {
		this._fields.Data.value = value
	}

	// Time is the timestamp for the log event. If zero when the entry is
	// logged, it defaults to the current time.
	public get Time(): time.Time {
		return this._fields.Time.value
	}
	public set Time(value: time.Time) {
		this._fields.Time.value = value
	}

	// Level is the severity of the log entry. It is set when the entry
	// is fired and reflects the level used for that log call.
	public get Level(): __goscript_logrus.Level {
		return this._fields.Level.value
	}
	public set Level(value: __goscript_logrus.Level) {
		this._fields.Level.value = value
	}

	// Caller contains the calling method information when caller
	// reporting is enabled.
	public get Caller(): runtime.Frame | $.VarRef<runtime.Frame> | null {
		return this._fields.Caller.value
	}
	public set Caller(value: runtime.Frame | $.VarRef<runtime.Frame> | null) {
		this._fields.Caller.value = value
	}

	// Message is the log message supplied to one of the logging methods
	// (Trace, Debug, Info, Warn, Error, Fatal, or Panic). It is set when
	// the entry is logged.
	public get Message(): string {
		return this._fields.Message.value
	}
	public set Message(value: string) {
		this._fields.Message.value = value
	}

	// Buffer is a reusable buffer provided to the formatter. It is set
	// before formatting in the normal log path; when nil, formatters
	// allocate their own.
	public get Buffer(): bytes.Buffer | $.VarRef<bytes.Buffer> | null {
		return this._fields.Buffer.value
	}
	public set Buffer(value: bytes.Buffer | $.VarRef<bytes.Buffer> | null) {
		this._fields.Buffer.value = value
	}

	// Context carries user-provided context for hooks and formatters.
	public get Context(): context.Context | null {
		return this._fields.Context.value
	}
	public set Context(value: context.Context | null) {
		this._fields.Context.value = value
	}

	// err contains internal field-formatting errors.
	public get err(): string {
		return this._fields.err.value
	}
	public set err(value: string) {
		this._fields.err.value = value
	}

	public _fields: {
		Logger: $.VarRef<__goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null>
		Data: $.VarRef<__goscript_logrus.Fields>
		Time: $.VarRef<time.Time>
		Level: $.VarRef<__goscript_logrus.Level>
		Caller: $.VarRef<runtime.Frame | $.VarRef<runtime.Frame> | null>
		Message: $.VarRef<string>
		Buffer: $.VarRef<bytes.Buffer | $.VarRef<bytes.Buffer> | null>
		Context: $.VarRef<context.Context | null>
		err: $.VarRef<string>
	}

	constructor(init?: Partial<{Logger?: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null, Data?: __goscript_logrus.Fields, Time?: time.Time, Level?: __goscript_logrus.Level, Caller?: runtime.Frame | $.VarRef<runtime.Frame> | null, Message?: string, Buffer?: bytes.Buffer | $.VarRef<bytes.Buffer> | null, Context?: context.Context | null, err?: string}>) {
		this._fields = {
			Logger: $.varRef(init?.Logger ?? null),
			Data: $.varRef(init?.Data ?? null),
			Time: $.varRef(init?.Time ? $.markAsStructValue($.cloneStructValue(init.Time)) : $.markAsStructValue(new time.Time())),
			Level: $.varRef(init?.Level ?? 0),
			Caller: $.varRef(init?.Caller ?? null),
			Message: $.varRef(init?.Message ?? ""),
			Buffer: $.varRef(init?.Buffer ?? null),
			Context: $.varRef(init?.Context ?? null),
			err: $.varRef(init?.err ?? "")
		}
	}

	public clone(): Entry {
		const cloned = new Entry()
		cloned._fields = {
			Logger: $.varRef(this._fields.Logger.value),
			Data: $.varRef(this._fields.Data.value),
			Time: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Time.value))),
			Level: $.varRef(this._fields.Level.value),
			Caller: $.varRef(this._fields.Caller.value),
			Message: $.varRef(this._fields.Message.value),
			Buffer: $.varRef(this._fields.Buffer.value),
			Context: $.varRef(this._fields.Context.value),
			err: $.varRef(this._fields.err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const entry: Entry | $.VarRef<Entry> | null = this
		// Snapshot the formatter under the lock to protect against concurrent
		// SetFormatter calls, then release the lock before formatting.
		// This avoids a data race and prevents a deadlock if Format() triggers
		// reentrant logging (e.g., a field's MarshalJSON calls logrus).
		//
		// See:
		//
		// - https://github.com/sirupsen/logrus/issues/1440
		// - https://github.com/sirupsen/logrus/issues/1448
		await $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Lock()
		let formatter = $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).Formatter
		$.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Unlock()

		return await $.pointerValue<Exclude<__goscript_formatter.Formatter, null>>(formatter).Format(entry)
	}

	public async Debug(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(5, 32), args)
	}

	public async Debugf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(5, 32), format, args)
	}

	public async Debugln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(5, 32), args)
	}

	public Dup(): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		return (() => { const __goscriptLiteralField0 = maps.Clone($.pointerValue<Entry>(entry).Data); return new Entry({Logger: $.pointerValue<Entry>(entry).Logger, Data: __goscriptLiteralField0, Time: $.markAsStructValue($.cloneStructValue($.pointerValue<Entry>(entry).Time)), Context: $.pointerValue<Entry>(entry).Context, err: $.pointerValue<Entry>(entry).err}) })()
	}

	public async Error(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(2, 32), args)
	}

	public async Errorf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(2, 32), format, args)
	}

	public async Errorln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(2, 32), args)
	}

	public async Fatal(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(1, 32), args)
		await __goscript_logger.Logger.prototype.Exit.call($.pointerValue<Entry>(entry).Logger, 1)
	}

	public async Fatalf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(1, 32), format, args)
		await __goscript_logger.Logger.prototype.Exit.call($.pointerValue<Entry>(entry).Logger, 1)
	}

	public async Fatalln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(1, 32), args)
		await __goscript_logger.Logger.prototype.Exit.call($.pointerValue<Entry>(entry).Logger, 1)
	}

	public HasCaller(): boolean {
		const entry = this
		return entry.Caller != null
	}

	public async Info(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(4, 32), args)
	}

	public async Infof(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(4, 32), format, args)
	}

	public async Infoln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(4, 32), args)
	}

	public async Log(level: __goscript_logrus.Level, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		if (__goscript_logger.Logger.prototype.IsLevelEnabled.call($.pointerValue<Entry>(entry).Logger, $.uint(level, 32))) {
			await Entry.prototype.log.call(entry, $.uint(level, 32), fmt.Sprint(...(args ?? [])))
		}
	}

	public async Logf(level: __goscript_logrus.Level, format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		if (__goscript_logger.Logger.prototype.IsLevelEnabled.call($.pointerValue<Entry>(entry).Logger, $.uint(level, 32))) {
			await Entry.prototype.Log.call(entry, $.uint(level, 32), $.arrayToSlice<any>([fmt.Sprintf(format, ...(args ?? []))]))
		}
	}

	public async Logln(level: __goscript_logrus.Level, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		if (__goscript_logger.Logger.prototype.IsLevelEnabled.call($.pointerValue<Entry>(entry).Logger, $.uint(level, 32))) {
			await Entry.prototype.Log.call(entry, $.uint(level, 32), $.arrayToSlice<any>([Entry.prototype.sprintlnn.call(entry, args)]))
		}
	}

	public async Panic(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(0, 32), args)
	}

	public async Panicf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(0, 32), format, args)
	}

	public async Panicln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(0, 32), args)
	}

	public async Print(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Info.call(entry, args)
	}

	public async Printf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Infof.call(entry, format, args)
	}

	public async Println(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Infoln.call(entry, args)
	}

	public async String(): globalThis.Promise<[string, $.GoError]> {
		const entry: Entry | $.VarRef<Entry> | null = this
		let __goscriptTuple0: any = await Entry.prototype.Bytes.call(entry)
		let serialized: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return ["", err]
		}
		let str = $.bytesToString(serialized)
		return [str, null]
	}

	public async Trace(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(6, 32), args)
	}

	public async Tracef(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(6, 32), format, args)
	}

	public async Traceln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(6, 32), args)
	}

	public async Warn(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Log.call(entry, $.uint(3, 32), args)
	}

	public async Warnf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logf.call(entry, $.uint(3, 32), format, args)
	}

	public async Warning(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Warn.call(entry, args)
	}

	public async Warningf(format: string, args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Warnf.call(entry, format, args)
	}

	public async Warningln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Warnln.call(entry, args)
	}

	public async Warnln(args: $.Slice<any>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		await Entry.prototype.Logln.call(entry, $.uint(3, 32), args)
	}

	public WithContext(ctx: context.Context | null): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		return (() => { const __goscriptLiteralField1 = maps.Clone($.pointerValue<Entry>(entry).Data); return new Entry({Logger: $.pointerValue<Entry>(entry).Logger, Data: __goscriptLiteralField1, Time: $.markAsStructValue($.cloneStructValue($.pointerValue<Entry>(entry).Time)), Context: ctx, err: $.pointerValue<Entry>(entry).err}) })()
	}

	public WithError(err: $.GoError): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		// Avoid reflection work in WithFields; we know the type is an error;
		// copy the entry data and set the ErrorKey directly.
		let data: __goscript_logrus.Fields = $.makeMap<string, any>()
		maps.Copy(data, $.pointerValue<Entry>(entry).Data)
		$.mapSet(data, ErrorKey, (err as any))

		return new Entry({Logger: $.pointerValue<Entry>(entry).Logger, Data: data, Time: $.markAsStructValue($.cloneStructValue($.pointerValue<Entry>(entry).Time)), Context: $.pointerValue<Entry>(entry).Context, err: $.pointerValue<Entry>(entry).err})
	}

	public WithField(key: string, value: any): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		return Entry.prototype.WithFields.call(entry, new Map<string, any>([[key, value]]))
	}

	public WithFields(fields: __goscript_logrus.Fields): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		let data: __goscript_logrus.Fields = $.makeMap<string, any>()
		maps.Copy(data, $.pointerValue<Entry>(entry).Data)
		let fieldErr = $.pointerValue<Entry>(entry).err
		for (let [k, v] of fields?.entries() ?? []) {
			let isErrField = false
			{
				let t = reflect.TypeOf(v)
				if (t != null) {
					switch (true) {
						case $.pointerValue<Exclude<reflect.Type, null>>(t).Kind() == reflect.Func:
						case ($.pointerValue<Exclude<reflect.Type, null>>(t).Kind() == reflect.Pointer) && ($.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<Exclude<reflect.Type, null>>(t).Elem()).Kind() == reflect.Func):
						{
							isErrField = true
							break
						}
					}
				}
			}
			if (isErrField) {
				let tmp = fmt.Sprintf("can not add field %q", k)
				if (!$.stringEqual(fieldErr, "")) {
					fieldErr = fieldErr + (", " + tmp)
				} else {
					fieldErr = tmp
				}
			} else {
				$.mapSet(data, k, v)
			}
		}
		return new Entry({Logger: $.pointerValue<Entry>(entry).Logger, Data: data, Time: $.markAsStructValue($.cloneStructValue($.pointerValue<Entry>(entry).Time)), err: fieldErr, Context: $.pointerValue<Entry>(entry).Context})
	}

	public WithTime(t: time.Time): Entry | $.VarRef<Entry> | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		return (() => { const __goscriptLiteralField2 = maps.Clone($.pointerValue<Entry>(entry).Data); return new Entry({Logger: $.pointerValue<Entry>(entry).Logger, Data: __goscriptLiteralField2, Time: $.markAsStructValue($.cloneStructValue(t)), Context: $.pointerValue<Entry>(entry).Context, err: $.pointerValue<Entry>(entry).err}) })()
	}

	public async Writer(): globalThis.Promise<io.PipeWriter | $.VarRef<io.PipeWriter> | null> {
		const entry: Entry | $.VarRef<Entry> | null = this
		return await Entry.prototype.WriterLevel.call(entry, $.uint(4, 32))
	}

	public async WriterLevel(level: __goscript_logrus.Level): globalThis.Promise<io.PipeWriter | $.VarRef<io.PipeWriter> | null> {
		const entry: Entry | $.VarRef<Entry> | null = this
		let __goscriptTuple1: any = io.Pipe()
		let reader: io.PipeReader | $.VarRef<io.PipeReader> | null = __goscriptTuple1[0]
		let writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null = __goscriptTuple1[1]

		let printFunc: ((args: $.Slice<any>) => void) | null = ((__receiver) => (args: $.Slice<any>) => __receiver.Print(args))($.pointerValue<Entry>(entry))

		// ErrorKey defines the key when adding errors using [WithError], [Logger.WithError].
		switch (level) {
			case 6:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Trace(args))($.pointerValue<Entry>(entry))
				break
			}
			case 5:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Debug(args))($.pointerValue<Entry>(entry))
				break
			}
			case 4:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Info(args))($.pointerValue<Entry>(entry))
				break
			}
			case 3:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Warn(args))($.pointerValue<Entry>(entry))
				break
			}
			case 2:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Error(args))($.pointerValue<Entry>(entry))
				break
			}
			case 1:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Fatal(args))($.pointerValue<Entry>(entry))
				break
			}
			case 0:
			{
				printFunc = ((__receiver) => (args: $.Slice<any>) => __receiver.Panic(args))($.pointerValue<Entry>(entry))
				break
			}
		}

		queueMicrotask(async () => { await Entry.prototype.writerScanner.call(entry, reader, printFunc) })

		runtime.SetFinalizer($.interfaceValue<any>(writer, "*io.PipeWriter"), $.interfaceValue<any>(__goscript_writer.writerFinalizer, "func(writer *io.PipeWriter)"))

		return writer
	}

	public async fireHooks(hooks: $.Slice<__goscript_hooks.Hook | null>): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		for (let __goscriptRangeTarget0 = hooks, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let hook = __goscriptRangeTarget0![__rangeIndex]
			{
				let err = $.pointerValue<Exclude<__goscript_hooks.Hook, null>>(hook).Fire(entry)
				if (err != null) {
					await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "Failed to fire hook:", (err as any))
					return
				}
			}
		}
	}

	public getBufferPool(): __goscript_buffer_pool.BufferPool | null {
		const entry: Entry | $.VarRef<Entry> | null = this
		let pool: __goscript_buffer_pool.BufferPool | null = null as __goscript_buffer_pool.BufferPool | null
		if ($.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).BufferPool != null) {
			return $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).BufferPool
		}
		return __goscript_buffer_pool.bufferPool
	}

	public async log(level: __goscript_logrus.Level, msg: string): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		using __defer = new $.DisposableStack()
		let newEntry: Entry | $.VarRef<Entry> | null = Entry.prototype.Dup.call(entry)
		let logger: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null = $.pointerValue<Entry>(newEntry).Logger

		if ($.markAsStructValue($.cloneStructValue($.pointerValue<Entry>(newEntry).Time)).IsZero()) {
			$.pointerValue<Entry>(newEntry).Time = $.markAsStructValue($.cloneStructValue(time.Now()))
		}

		$.pointerValue<Entry>(newEntry).Level = $.uint(level, 32)
		$.pointerValue<Entry>(newEntry).Message = msg

		await $.pointerValue<__goscript_logger.Logger>(logger).mu.Lock()
		let reportCaller = $.pointerValue<__goscript_logger.Logger>(logger).ReportCaller
		let bufPool = Entry.prototype.getBufferPool.call(newEntry)
		$.pointerValue<__goscript_logger.Logger>(logger).mu.Unlock()

		if (reportCaller) {
			$.pointerValue<Entry>(newEntry).Caller = await getCaller()
		}

		// Select hooks based on the level for this log call. Hooks receive the
		// Entry and may mutate it, but that does not affect which hooks are
		// fired for this event.
		let hooks: $.Slice<__goscript_hooks.Hook | null> = await __goscript_logger.Logger.prototype.hooksForLevel.call(logger, $.uint(level, 32))
		await Entry.prototype.fireHooks.call(newEntry, hooks)

		let buffer: bytes.Buffer | $.VarRef<bytes.Buffer> | null = await $.pointerValue<Exclude<__goscript_buffer_pool.BufferPool, null>>(bufPool).Get()
		__defer.defer(() => { ($.functionValue((): void => {
			$.pointerValue<Entry>(newEntry).Buffer = null
			bytes.Buffer.prototype.Reset.call($.pointerValue<bytes.Buffer>(buffer))
			$.pointerValue<Exclude<__goscript_buffer_pool.BufferPool, null>>(bufPool).Put(buffer)
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })
		bytes.Buffer.prototype.Reset.call($.pointerValue<bytes.Buffer>(buffer))
		$.pointerValue<Entry>(newEntry).Buffer = buffer
		await Entry.prototype.write.call(newEntry)
		$.pointerValue<Entry>(newEntry).Buffer = null

		// To avoid Entry#log() returning a value that only would make sense for
		// panic() to use in Entry#Panic(), we avoid the allocation by checking
		// directly here.
		if (level <= 0) {
			$.panic($.interfaceValue<any>(newEntry, "*logrus.Entry"))
		}
	}

	public sprintlnn(args: $.Slice<any>): string {
		const entry: Entry | $.VarRef<Entry> | null = this
		let msg = fmt.Sprintln(...(args ?? []))
		return $.sliceStringOrBytes(msg, undefined, $.len(msg) - 1)
	}

	public async write(): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		using __defer = new $.DisposableStack()
		// Snapshot the formatter under the lock to protect against concurrent
		// SetFormatter calls, then release the lock before formatting.
		// This avoids a deadlock when Format() triggers reentrant logging (e.g.,
		// a field's MarshalJSON calls logrus). See #1448, #1440.
		await $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Lock()
		let formatter = $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).Formatter
		$.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Unlock()

		let __goscriptTuple2: any = await $.pointerValue<Exclude<__goscript_formatter.Formatter, null>>(formatter).Format(entry)
		let serialized: $.Slice<number> = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "Failed to format entry:", (err as any))
			return
		}

		// Re-acquire the lock to serialize writes to the underlying io.Writer.
		await $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Lock()
		__defer.defer(() => { $.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).mu.Unlock() })
		{
			let [, __goscriptShadow0] = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<__goscript_logger.Logger>($.pointerValue<Entry>(entry).Logger).Out).Write(serialized)
			if (__goscriptShadow0 != null) {
				await fmt.Fprintln($.pointerValueOrNil($.interfaceValue<io.Writer | null>(os.Stderr, "*os.File"))!, "Failed to write to log:", (__goscriptShadow0 as any))
			}
		}
	}

	public async writerScanner(reader: io.PipeReader | $.VarRef<io.PipeReader> | null, printFunc: ((args: $.Slice<any>) => void) | null): globalThis.Promise<void> {
		const entry: Entry | $.VarRef<Entry> | null = this
		let scanner: bufio.Scanner | $.VarRef<bufio.Scanner> | null = bufio.NewScanner($.interfaceValue<io.Reader | null>(reader, "*io.PipeReader"))

		bufio.Scanner.prototype.Buffer.call(scanner, $.makeSlice<number>(bufio.MaxScanTokenSize, undefined, "byte"), bufio.MaxScanTokenSize)
		// Caller contains the calling method information when caller
		// reporting is enabled.
		let chunkSize = bufio.MaxScanTokenSize
		let splitFunc: ((data: $.Slice<number>, atEOF: boolean) => [number, $.Slice<number>, $.GoError] | globalThis.Promise<[number, $.Slice<number>, $.GoError]>) | null = $.functionValue((data: $.Slice<number>, atEOF: boolean): [number, $.Slice<number>, $.GoError] => {
			if ($.len(data) >= chunkSize) {
				return [chunkSize, $.goSlice(data, undefined, chunkSize), null]
			}

			return bufio.ScanLines(data, atEOF)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))

		bufio.Scanner.prototype.Split.call(scanner, splitFunc)

		// Context carries user-provided context for hooks and formatters.
		while (await bufio.Scanner.prototype.Scan.call(scanner)) {
			await printFunc!($.arrayToSlice<any>([strings.TrimRight(bufio.Scanner.prototype.Text.call(scanner), "\r\n")]))
		}

		{
			let err = bufio.Scanner.prototype.Err.call(scanner)
			if (err != null) {
				await Entry.prototype.Errorf.call(entry, "Error while reading from Writer: %s", $.arrayToSlice<any>([(err as any)]))
			}
		}

		io.PipeReader.prototype.Close.call($.pointerValue<io.PipeReader>(reader))
	}

	static __typeInfo = $.registerStructType(
		"logrus.Entry",
		() => new Entry(),
		[{ name: "Bytes", args: [], returns: [] }, { name: "Debug", args: [], returns: [] }, { name: "Debugf", args: [], returns: [] }, { name: "Debugln", args: [], returns: [] }, { name: "Dup", args: [], returns: [] }, { name: "Error", args: [], returns: [] }, { name: "Errorf", args: [], returns: [] }, { name: "Errorln", args: [], returns: [] }, { name: "Fatal", args: [], returns: [] }, { name: "Fatalf", args: [], returns: [] }, { name: "Fatalln", args: [], returns: [] }, { name: "HasCaller", args: [], returns: [] }, { name: "Info", args: [], returns: [] }, { name: "Infof", args: [], returns: [] }, { name: "Infoln", args: [], returns: [] }, { name: "Log", args: [], returns: [] }, { name: "Logf", args: [], returns: [] }, { name: "Logln", args: [], returns: [] }, { name: "Panic", args: [], returns: [] }, { name: "Panicf", args: [], returns: [] }, { name: "Panicln", args: [], returns: [] }, { name: "Print", args: [], returns: [] }, { name: "Printf", args: [], returns: [] }, { name: "Println", args: [], returns: [] }, { name: "String", args: [], returns: [] }, { name: "Trace", args: [], returns: [] }, { name: "Tracef", args: [], returns: [] }, { name: "Traceln", args: [], returns: [] }, { name: "Warn", args: [], returns: [] }, { name: "Warnf", args: [], returns: [] }, { name: "Warning", args: [], returns: [] }, { name: "Warningf", args: [], returns: [] }, { name: "Warningln", args: [], returns: [] }, { name: "Warnln", args: [], returns: [] }, { name: "WithContext", args: [], returns: [] }, { name: "WithError", args: [], returns: [] }, { name: "WithField", args: [], returns: [] }, { name: "WithFields", args: [], returns: [] }, { name: "WithTime", args: [], returns: [] }, { name: "Writer", args: [], returns: [] }, { name: "WriterLevel", args: [], returns: [] }, { name: "fireHooks", args: [], returns: [] }, { name: "getBufferPool", args: [], returns: [] }, { name: "log", args: [], returns: [] }, { name: "sprintlnn", args: [], returns: [] }, { name: "write", args: [], returns: [] }, { name: "writerScanner", args: [], returns: [] }],
		Entry,
		{"Logger": { kind: $.TypeKind.Pointer, elemType: "logrus.Logger" }, "Data": "logrus.Fields", "Time": "time.Time", "Level": { kind: $.TypeKind.Basic, name: "uint32", typeName: "logrus.Level" }, "Caller": { kind: $.TypeKind.Pointer, elemType: "runtime.Frame" }, "Message": { kind: $.TypeKind.Basic, name: "string" }, "Buffer": { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }, "Context": "context.Context", "err": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export const maximumCallerDepth: number = 25

export const knownLogrusFrames: number = 4

export let logrusPackage: string = ""

export function __goscript_set_logrusPackage(__goscriptValue: string): void {
	logrusPackage = __goscriptValue
}

export let minimumCallerDepth: number = 1

export function __goscript_set_minimumCallerDepth(__goscriptValue: number): void {
	minimumCallerDepth = __goscriptValue
}

export let callerInitOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_callerInitOnce(__goscriptValue: sync.Once): void {
	callerInitOnce.value = __goscriptValue
}

export let ErrorKey: string = "error"

export function __goscript_set_ErrorKey(__goscriptValue: string): void {
	ErrorKey = __goscriptValue
}

export function NewEntry(logger: __goscript_logger.Logger | $.VarRef<__goscript_logger.Logger> | null): Entry | $.VarRef<Entry> | null {
	return new Entry({Logger: logger, Data: $.makeMap<string, any>()})
}

export function getPackageName(f: string): string {
	while (true) {
		let lastPeriod = strings.LastIndex(f, ".")
		let lastSlash = strings.LastIndex(f, "/")
		if (lastPeriod > lastSlash) {
			f = $.sliceStringOrBytes(f, undefined, lastPeriod)
		} else {
			break
		}
	}

	return f
}

export async function getCaller(): globalThis.Promise<runtime.Frame | $.VarRef<runtime.Frame> | null> {
	// cache this package's fully-qualified name
	await callerInitOnce.value.Do($.functionValue((): void => {
		let pcs: $.Slice<number> = $.makeSlice<number>(25, undefined, "number")
		runtime.Callers(0, pcs)

		// dynamic get the package name and the minimum caller depth
		for (let i = 0; i < 25; i++) {
			let funcName = runtime.Func.prototype.Name.call($.pointerValue<runtime.Func>(runtime.FuncForPC($.uint(pcs![i], 64))))
			if (strings.Contains(funcName, "getCaller")) {
				logrusPackage = getPackageName(funcName)
				break
			}
		}

		minimumCallerDepth = 4
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	// Restrict the lookback frames to avoid runaway lookups
	let pcs: $.Slice<number> = $.makeSlice<number>(25, undefined, "number")
	let depth = runtime.Callers(minimumCallerDepth, pcs)
	let frames: runtime.Frames | $.VarRef<runtime.Frames> | null = runtime.CallersFrames($.goSlice(pcs, undefined, depth))

	for (let __goscriptTuple3 = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(frames)), f = $.varRef(__goscriptTuple3[0]), again = __goscriptTuple3[1]; again; [f.value, again] = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(frames))) {
		let pkg = getPackageName(f.value.Function)

		// If the caller isn't part of this package, we're done
		if (!$.stringEqual(pkg, logrusPackage)) {
			return f
		}
	}

	// if we got here, we failed to find the caller's context
	return null
}
