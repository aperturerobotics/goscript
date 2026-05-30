// Generated file based on text_formatter.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as maps from "@goscript/maps/index.js"

import * as os from "@goscript/os/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import type * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_json_formatter from "./json_formatter.gs.ts"

import * as __goscript_level from "./level.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_terminal_check_no_terminal from "./terminal_check_no_terminal.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"
import "@goscript/maps/index.js"
import "@goscript/os/index.js"
import "@goscript/runtime/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "./buffer_pool.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./json_formatter.gs.ts"
import "./level.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./terminal_check_no_terminal.gs.ts"
import "./writer.gs.ts"

export class TextFormatter {
	// Set to true to bypass checking for a TTY before outputting colors.
	public get ForceColors(): boolean {
		return this._fields.ForceColors.value
	}
	public set ForceColors(value: boolean) {
		this._fields.ForceColors.value = value
	}

	// Force disabling colors.
	public get DisableColors(): boolean {
		return this._fields.DisableColors.value
	}
	public set DisableColors(value: boolean) {
		this._fields.DisableColors.value = value
	}

	// Force quoting of all values
	public get ForceQuote(): boolean {
		return this._fields.ForceQuote.value
	}
	public set ForceQuote(value: boolean) {
		this._fields.ForceQuote.value = value
	}

	// DisableQuote disables quoting for all values.
	// DisableQuote will have a lower priority than ForceQuote.
	// If both of them are set to true, quote will be forced on all values.
	public get DisableQuote(): boolean {
		return this._fields.DisableQuote.value
	}
	public set DisableQuote(value: boolean) {
		this._fields.DisableQuote.value = value
	}

	// Override coloring based on CLICOLOR and CLICOLOR_FORCE. - https://bixense.com/clicolors/
	public get EnvironmentOverrideColors(): boolean {
		return this._fields.EnvironmentOverrideColors.value
	}
	public set EnvironmentOverrideColors(value: boolean) {
		this._fields.EnvironmentOverrideColors.value = value
	}

	// Disable timestamp logging. useful when output is redirected to logging
	// system that already adds timestamps.
	public get DisableTimestamp(): boolean {
		return this._fields.DisableTimestamp.value
	}
	public set DisableTimestamp(value: boolean) {
		this._fields.DisableTimestamp.value = value
	}

	// Enable logging the full timestamp when a TTY is attached instead of just
	// the time passed since beginning of execution.
	public get FullTimestamp(): boolean {
		return this._fields.FullTimestamp.value
	}
	public set FullTimestamp(value: boolean) {
		this._fields.FullTimestamp.value = value
	}

	// TimestampFormat to use for display when a full timestamp is printed.
	// The format to use is the same than for time.Format or time.Parse from the standard
	// library.
	// The standard Library already provides a set of predefined format.
	public get TimestampFormat(): string {
		return this._fields.TimestampFormat.value
	}
	public set TimestampFormat(value: string) {
		this._fields.TimestampFormat.value = value
	}

	// The fields are sorted by default for a consistent output. For applications
	// that log extremely frequently and don't use the JSON formatter this may not
	// be desired.
	public get DisableSorting(): boolean {
		return this._fields.DisableSorting.value
	}
	public set DisableSorting(value: boolean) {
		this._fields.DisableSorting.value = value
	}

	// The keys sorting function, when uninitialized it uses slices.Sort.
	public get SortingFunc(): ((_p0: $.Slice<string>) => void) | null {
		return this._fields.SortingFunc.value
	}
	public set SortingFunc(value: ((_p0: $.Slice<string>) => void) | null) {
		this._fields.SortingFunc.value = value
	}

	// Disables the truncation of the level text to 4 characters.
	public get DisableLevelTruncation(): boolean {
		return this._fields.DisableLevelTruncation.value
	}
	public set DisableLevelTruncation(value: boolean) {
		this._fields.DisableLevelTruncation.value = value
	}

	// PadLevelText Adds padding the level text so that all the levels output at the same length
	// PadLevelText is a superset of the DisableLevelTruncation option
	public get PadLevelText(): boolean {
		return this._fields.PadLevelText.value
	}
	public set PadLevelText(value: boolean) {
		this._fields.PadLevelText.value = value
	}

	// QuoteEmptyFields will wrap empty fields in quotes if true
	public get QuoteEmptyFields(): boolean {
		return this._fields.QuoteEmptyFields.value
	}
	public set QuoteEmptyFields(value: boolean) {
		this._fields.QuoteEmptyFields.value = value
	}

	// Whether the logger's out is to a terminal. Don't use this field
	// directly; use TextFormatter.isTerminal instead.
	public get terminal(): boolean {
		return this._fields.terminal.value
	}
	public set terminal(value: boolean) {
		this._fields.terminal.value = value
	}

	// FieldMap allows users to customize the names of keys for default fields.
	// Mapped keys are written as-is, so they should be safe for plain-text output.
	//
	// As an example:
	//
	// formatter := &TextFormatter{
	// 	FieldMap: FieldMap{
	// 		FieldKeyTime:  "@timestamp",
	// 		FieldKeyLevel: "@level",
	// 		FieldKeyMsg:   "@message",
	// 	},
	// }
	public get FieldMap(): __goscript_json_formatter.FieldMap {
		return this._fields.FieldMap.value
	}
	public set FieldMap(value: __goscript_json_formatter.FieldMap) {
		this._fields.FieldMap.value = value
	}

	// CallerPrettyfier can be set by the user to modify the content
	// of the function and file keys in the data when ReportCaller is
	// activated. If any of the returned value is the empty string the
	// corresponding key will be removed from fields.
	public get CallerPrettyfier(): ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null {
		return this._fields.CallerPrettyfier.value
	}
	public set CallerPrettyfier(value: ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null) {
		this._fields.CallerPrettyfier.value = value
	}

	public get terminalInitOnce(): sync.Once {
		return this._fields.terminalInitOnce.value
	}
	public set terminalInitOnce(value: sync.Once) {
		this._fields.terminalInitOnce.value = value
	}

	public _fields: {
		ForceColors: $.VarRef<boolean>
		DisableColors: $.VarRef<boolean>
		ForceQuote: $.VarRef<boolean>
		DisableQuote: $.VarRef<boolean>
		EnvironmentOverrideColors: $.VarRef<boolean>
		DisableTimestamp: $.VarRef<boolean>
		FullTimestamp: $.VarRef<boolean>
		TimestampFormat: $.VarRef<string>
		DisableSorting: $.VarRef<boolean>
		SortingFunc: $.VarRef<((_p0: $.Slice<string>) => void) | null>
		DisableLevelTruncation: $.VarRef<boolean>
		PadLevelText: $.VarRef<boolean>
		QuoteEmptyFields: $.VarRef<boolean>
		terminal: $.VarRef<boolean>
		FieldMap: $.VarRef<__goscript_json_formatter.FieldMap>
		CallerPrettyfier: $.VarRef<((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null>
		terminalInitOnce: $.VarRef<sync.Once>
	}

	constructor(init?: Partial<{ForceColors?: boolean, DisableColors?: boolean, ForceQuote?: boolean, DisableQuote?: boolean, EnvironmentOverrideColors?: boolean, DisableTimestamp?: boolean, FullTimestamp?: boolean, TimestampFormat?: string, DisableSorting?: boolean, SortingFunc?: ((_p0: $.Slice<string>) => void) | null, DisableLevelTruncation?: boolean, PadLevelText?: boolean, QuoteEmptyFields?: boolean, terminal?: boolean, FieldMap?: __goscript_json_formatter.FieldMap, CallerPrettyfier?: ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null, terminalInitOnce?: sync.Once}>) {
		this._fields = {
			ForceColors: $.varRef(init?.ForceColors ?? false),
			DisableColors: $.varRef(init?.DisableColors ?? false),
			ForceQuote: $.varRef(init?.ForceQuote ?? false),
			DisableQuote: $.varRef(init?.DisableQuote ?? false),
			EnvironmentOverrideColors: $.varRef(init?.EnvironmentOverrideColors ?? false),
			DisableTimestamp: $.varRef(init?.DisableTimestamp ?? false),
			FullTimestamp: $.varRef(init?.FullTimestamp ?? false),
			TimestampFormat: $.varRef(init?.TimestampFormat ?? ""),
			DisableSorting: $.varRef(init?.DisableSorting ?? false),
			SortingFunc: $.varRef(init?.SortingFunc ?? null),
			DisableLevelTruncation: $.varRef(init?.DisableLevelTruncation ?? false),
			PadLevelText: $.varRef(init?.PadLevelText ?? false),
			QuoteEmptyFields: $.varRef(init?.QuoteEmptyFields ?? false),
			terminal: $.varRef(init?.terminal ?? false),
			FieldMap: $.varRef(init?.FieldMap ?? null),
			CallerPrettyfier: $.varRef(init?.CallerPrettyfier ?? null),
			terminalInitOnce: $.varRef(init?.terminalInitOnce ? $.markAsStructValue($.cloneStructValue(init.terminalInitOnce)) : $.markAsStructValue(new sync.Once()))
		}
	}

	public clone(): TextFormatter {
		const cloned = new TextFormatter()
		cloned._fields = {
			ForceColors: $.varRef(this._fields.ForceColors.value),
			DisableColors: $.varRef(this._fields.DisableColors.value),
			ForceQuote: $.varRef(this._fields.ForceQuote.value),
			DisableQuote: $.varRef(this._fields.DisableQuote.value),
			EnvironmentOverrideColors: $.varRef(this._fields.EnvironmentOverrideColors.value),
			DisableTimestamp: $.varRef(this._fields.DisableTimestamp.value),
			FullTimestamp: $.varRef(this._fields.FullTimestamp.value),
			TimestampFormat: $.varRef(this._fields.TimestampFormat.value),
			DisableSorting: $.varRef(this._fields.DisableSorting.value),
			SortingFunc: $.varRef(this._fields.SortingFunc.value),
			DisableLevelTruncation: $.varRef(this._fields.DisableLevelTruncation.value),
			PadLevelText: $.varRef(this._fields.PadLevelText.value),
			QuoteEmptyFields: $.varRef(this._fields.QuoteEmptyFields.value),
			terminal: $.varRef(this._fields.terminal.value),
			FieldMap: $.varRef(this._fields.FieldMap.value),
			CallerPrettyfier: $.varRef(this._fields.CallerPrettyfier.value),
			terminalInitOnce: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.terminalInitOnce.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Format(entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		let data: __goscript_logrus.Fields = $.makeMap<string, any>()
		maps.Copy(data, $.pointerValue<__goscript_entry.Entry>(entry).Data)
		let isColored = TextFormatter.prototype.isColored.call(f, await TextFormatter.prototype.isTerminal.call(f, entry))

		let caller: runtime.Frame | $.VarRef<runtime.Frame> | null = $.pointerValue<__goscript_entry.Entry>(entry).Caller
		let hasCaller = caller != null
		__goscript_formatter.prefixFieldClashes(data, $.pointerValue<TextFormatter>(f).FieldMap, hasCaller)
		let keys: $.Slice<string> = $.makeSlice<string>(0, $.len(data), "string")
		for (const [k, __rangeValue] of data?.entries() ?? []) {
			keys = $.append(keys, k)
		}

		let b: bytes.Buffer | $.VarRef<bytes.Buffer> | null = $.pointerValue<__goscript_entry.Entry>(entry).Buffer
		if (b == null) {
			b = new bytes.Buffer()
		}

		if (isColored) {
			await TextFormatter.prototype.printColored.call(f, b, entry, keys, data)
		} else {
			await TextFormatter.prototype.printPlain.call(f, b, entry, keys, data)
		}

		return [bytes.Buffer.prototype.Bytes.call($.pointerValue<bytes.Buffer>(b)), null]
	}

	public appendBytes(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, bs: $.Slice<number>): void {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		let quote = ($.pointerValue<TextFormatter>(f).ForceQuote || ($.pointerValue<TextFormatter>(f).QuoteEmptyFields && ($.len(bs) == 0))) || (!$.pointerValue<TextFormatter>(f).DisableQuote && needsQuotingBytes(bs))
		if (!quote) {
			bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), bs)
			return
		}
		if ($.len(bs) == 0) {
			bytes.Buffer.prototype.WriteString.call($.pointerValue<bytes.Buffer>(b), "\"\"")
			return
		}

		let tmp: Uint8Array = new Uint8Array(128)
		bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), strconv.AppendQuote($.goSlice(tmp, undefined, 0), $.bytesToString(bs)))
	}

	public async appendKeyValue(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, key: string, value: any): globalThis.Promise<void> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		if (bytes.Buffer.prototype.Len.call($.pointerValue<bytes.Buffer>(b)) > 0) {
			bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(32, 8))
		}
		bytes.Buffer.prototype.WriteString.call($.pointerValue<bytes.Buffer>(b), key)
		bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(61, 8))
		await TextFormatter.prototype.appendValue.call(f, b, value)
	}

	public appendNumeric(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, out: $.Slice<number>): void {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		if ($.pointerValue<TextFormatter>(f).ForceQuote) {
			let tmp: Uint8Array = new Uint8Array(128)
			bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), strconv.AppendQuote($.goSlice(tmp, undefined, 0), $.bytesToString(out)))
			return
		}
		bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), out)
	}

	public appendString(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, s: string): void {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		let quote = ($.pointerValue<TextFormatter>(f).ForceQuote || ($.pointerValue<TextFormatter>(f).QuoteEmptyFields && ($.len(s) == 0))) || (!$.pointerValue<TextFormatter>(f).DisableQuote && needsQuoting(s))
		if (!quote) {
			bytes.Buffer.prototype.WriteString.call($.pointerValue<bytes.Buffer>(b), s)
			return
		}
		if ($.len(s) == 0) {
			bytes.Buffer.prototype.WriteString.call($.pointerValue<bytes.Buffer>(b), "\"\"")
			return
		}

		let tmp: Uint8Array = new Uint8Array(128)
		bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), strconv.AppendQuote($.goSlice(tmp, undefined, 0), s))
	}

	public async appendValue(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, value: any): globalThis.Promise<void> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		// Fast paths.
		{
			const __goscriptTypeSwitchValue = value
			switch (true) {
				case $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).ok:
					{
						let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "string" }).value
						TextFormatter.prototype.appendString.call(f, b, v)
						return
					}
					break
				case $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
					{
						let v: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
						TextFormatter.prototype.appendBytes.call(f, b, v)
						return
					}
					break
				case $.typeAssert<boolean>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).ok:
					{
						let v: boolean = $.typeAssert<boolean>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "bool" }).value
						let raw: Uint8Array = new Uint8Array(8)
						TextFormatter.prototype.appendBytes.call(f, b, strconv.AppendBool($.goSlice(raw, undefined, 0), v))
						return
					}
					break
				case $.typeAssert<Exclude<$.GoError, null>>(__goscriptTypeSwitchValue, "error").ok:
					{
						let v: Exclude<$.GoError, null> = $.typeAssert<Exclude<$.GoError, null>>(__goscriptTypeSwitchValue, "error").value
						TextFormatter.prototype.appendString.call(f, b, await $.pointerValue<Exclude<$.GoError, null>>(v).Error())
						return
					}
					break
				case $.typeAssert<Exclude<fmt.Stringer, null>>(__goscriptTypeSwitchValue, "fmt.Stringer").ok:
					{
						let v: Exclude<fmt.Stringer, null> = $.typeAssert<Exclude<fmt.Stringer, null>>(__goscriptTypeSwitchValue, "fmt.Stringer").value
						TextFormatter.prototype.appendString.call(f, b, $.pointerValue<Exclude<fmt.Stringer, null>>(v).String())
						return
					}
					break
			}
		}

		// Handle common primitives.
		let raw: Uint8Array = new Uint8Array(64)
		let num: $.Slice<number> = null as $.Slice<number>

		{
			const __goscriptTypeSwitchValue = value
			switch (true) {
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int" }).value
						num = strconv.AppendInt($.goSlice(raw, undefined, 0), $.int($.int(v)), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int8" }).value
						num = strconv.AppendInt($.goSlice(raw, undefined, 0), $.int($.int(v)), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int16" }).value
						num = strconv.AppendInt($.goSlice(raw, undefined, 0), $.int($.int(v)), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int32" }).value
						num = strconv.AppendInt($.goSlice(raw, undefined, 0), $.int($.int(v)), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "int64" }).value
						num = strconv.AppendInt($.goSlice(raw, undefined, 0), $.int(v), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint($.uint(v, 64), 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint8" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint($.uint(v, 64), 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint16" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint($.uint(v, 64), 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint32" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint($.uint(v, 64), 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uint64" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint(v, 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uintptr" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "uintptr" }).value
						num = strconv.AppendUint($.goSlice(raw, undefined, 0), $.uint($.uint(v, 64), 64), 10)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float32" }).value
						num = strconv.AppendFloat($.goSlice(raw, undefined, 0), v, $.uint(103, 8), -1, 32)
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Basic, name: "float64" }).value
						num = strconv.AppendFloat($.goSlice(raw, undefined, 0), v, $.uint(103, 8), -1, 64)
					}
					break
				default:
					{
						let v: any = __goscriptTypeSwitchValue
						TextFormatter.prototype.appendString.call(f, b, fmt.Sprint(value))
						return
					}
					break
			}
		}

		TextFormatter.prototype.appendNumeric.call(f, b, num)
	}

	public isColored(isTerminal: boolean): boolean {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		if ($.pointerValue<TextFormatter>(f).DisableColors) {
			return false
		}

		let colored = $.pointerValue<TextFormatter>(f).ForceColors || (isTerminal && (!$.stringEqual(runtime.GOOS, "windows")))
		if (!$.pointerValue<TextFormatter>(f).EnvironmentOverrideColors) {
			return colored
		}
		{
			let [force, ok] = os.LookupEnv("CLICOLOR_FORCE")
			if (ok) {
				return !$.stringEqual(force, "0")
			}
		}
		if ($.stringEqual(os.Getenv("CLICOLOR"), "0")) {
			return false
		}
		return colored
	}

	public async isTerminal(entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): globalThis.Promise<boolean> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		if ((entry == null) || ($.pointerValue<__goscript_entry.Entry>(entry).Logger == null)) {
			// Don't run the terminalInitOnce without a logger, otherwise we'd
			// cache the default (false) forever even if a logger is attached
			// later.
			return false
		}

		await $.pointerValue<TextFormatter>(f).terminalInitOnce.Do($.functionValue(async (): globalThis.Promise<void> => {
			await $.pointerValue<__goscript_logger.Logger>($.pointerValue<__goscript_entry.Entry>(entry).Logger).mu.Lock()
			let out = $.pointerValue<__goscript_logger.Logger>($.pointerValue<__goscript_entry.Entry>(entry).Logger).Out
			$.pointerValue<__goscript_logger.Logger>($.pointerValue<__goscript_entry.Entry>(entry).Logger).mu.Unlock()

			$.pointerValue<TextFormatter>(f).terminal = __goscript_terminal_check_no_terminal.checkIfTerminal((out as any))
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

		return $.pointerValue<TextFormatter>(f).terminal
	}

	public async printColored(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null, keys: $.Slice<string>, data: __goscript_logrus.Fields): globalThis.Promise<void> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		// Remove a single newline if it already exists in the message to keep
		// the behavior of logrus text_formatter the same as the stdlib log package
		$.pointerValue<__goscript_entry.Entry>(entry).Message = strings.TrimSuffix($.pointerValue<__goscript_entry.Entry>(entry).Message, "\n")

		let callerText: string = ""
		{
			let caller: runtime.Frame | $.VarRef<runtime.Frame> | null = $.pointerValue<__goscript_entry.Entry>(entry).Caller
			if (caller != null) {
				let funcVal: string = ""
				let fileVal: string = ""
				if ($.pointerValue<TextFormatter>(f).CallerPrettyfier != null) {
					let __goscriptTuple0: any = await $.pointerValue<TextFormatter>(f).CallerPrettyfier!(caller)
					funcVal = __goscriptTuple0[0]
					fileVal = __goscriptTuple0[1]
				} else {
					if (!$.stringEqual($.pointerValue<runtime.Frame>(caller).Function, "")) {
						funcVal = $.pointerValue<runtime.Frame>(caller).Function + "()"
					}
					fileVal = ($.pointerValue<runtime.Frame>(caller).File + ":") + strconv.FormatInt($.int($.int($.pointerValue<runtime.Frame>(caller).Line)), 10)
				}

				if ($.stringEqual(fileVal, "")) {
					callerText = funcVal
				} else {
					if ($.stringEqual(funcVal, "")) {
						callerText = fileVal
					} else {
						callerText = (fileVal + " ") + funcVal
					}
				}
			}
		}

		let levelText = await __goscript_level.levelPrefix($.uint($.pointerValue<__goscript_entry.Entry>(entry).Level, 32), $.pointerValue<TextFormatter>(f).DisableLevelTruncation, $.pointerValue<TextFormatter>(f).PadLevelText)
		switch (true) {
			case $.pointerValue<TextFormatter>(f).DisableTimestamp:
			{
				await fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*bytes.Buffer"))!, "%s%s %-44s ", levelText, callerText, $.pointerValue<__goscript_entry.Entry>(entry).Message)
				break
			}
			case !$.pointerValue<TextFormatter>(f).FullTimestamp:
			{
				await fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*bytes.Buffer"))!, "%s[%04d]%s %-44s ", levelText, $.namedValueInterfaceValue<any>($.int($.int64Div($.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_entry.Entry>(entry).Time)).Sub($.markAsStructValue($.cloneStructValue(baseTimestamp))), time.Second)), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), callerText, $.pointerValue<__goscript_entry.Entry>(entry).Message)
				break
			}
			default:
			{
				let timestampFormat = $.pointerValue<TextFormatter>(f).TimestampFormat
				if ($.stringEqual(timestampFormat, "")) {
					timestampFormat = "2006-01-02T15:04:05Z07:00"
				}
				await fmt.Fprintf($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*bytes.Buffer"))!, "%s[%s]%s %-44s ", levelText, $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_entry.Entry>(entry).Time)).Format(timestampFormat), callerText, $.pointerValue<__goscript_entry.Entry>(entry).Message)
				break
			}
		}

		if (!$.pointerValue<TextFormatter>(f).DisableSorting) {
			if ($.pointerValue<TextFormatter>(f).SortingFunc == null) {
				slices.Sort(keys)
			} else {
				await $.pointerValue<TextFormatter>(f).SortingFunc!(keys)
			}
		}

		// Keys use the same color as the level-prefix.
		for (let __goscriptRangeTarget0 = keys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let k = __goscriptRangeTarget0![__rangeIndex]
			bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(32, 8))
			bytes.Buffer.prototype.WriteString.call($.pointerValue<bytes.Buffer>(b), __goscript_level.colorize($.uint($.pointerValue<__goscript_entry.Entry>(entry).Level, 32), k))
			bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(61, 8))
			await TextFormatter.prototype.appendValue.call(f, b, $.mapGet(data, k, null)[0])
		}

		bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(10, 8))
	}

	public async printPlain(b: bytes.Buffer | $.VarRef<bytes.Buffer> | null, entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null, keys: $.Slice<string>, data: __goscript_logrus.Fields): globalThis.Promise<void> {
		const f: TextFormatter | $.VarRef<TextFormatter> | null = this
		let caller: runtime.Frame | $.VarRef<runtime.Frame> | null = $.pointerValue<__goscript_entry.Entry>(entry).Caller
		let hasCaller = caller != null

		let fixedKeys: $.Slice<string> = $.makeSlice<string>(0, $.len(keys) + 3, "string")
		if (!$.pointerValue<TextFormatter>(f).DisableTimestamp) {
			fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "time"))
		}
		fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "level"))
		if (!$.stringEqual($.pointerValue<__goscript_entry.Entry>(entry).Message, "")) {
			fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "msg"))
		}
		if (!$.stringEqual($.pointerValue<__goscript_entry.Entry>(entry).err, "")) {
			fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "logrus_error"))
		}

		let funcVal: string = ""
		let fileVal: string = ""
		if (caller != null) {
			if ($.pointerValue<TextFormatter>(f).CallerPrettyfier != null) {
				let __goscriptTuple1: any = await $.pointerValue<TextFormatter>(f).CallerPrettyfier!(caller)
				funcVal = __goscriptTuple1[0]
				fileVal = __goscriptTuple1[1]
			} else {
				funcVal = $.pointerValue<runtime.Frame>(caller).Function
				fileVal = ($.pointerValue<runtime.Frame>(caller).File + ":") + strconv.FormatInt($.int($.int($.pointerValue<runtime.Frame>(caller).Line)), 10)
			}

			if (!$.stringEqual(funcVal, "")) {
				fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "func"))
			}
			if (!$.stringEqual(fileVal, "")) {
				fixedKeys = $.append(fixedKeys, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "file"))
			}
		}

		if (!$.pointerValue<TextFormatter>(f).DisableSorting) {
			if ($.pointerValue<TextFormatter>(f).SortingFunc == null) {
				// Default sorting does not sort the "fixed keys";
				// see https://github.com/sirupsen/logrus/commit/73bc94e60c753099e8bae902f81fbd6e7dd95f26
				slices.Sort(keys)
				fixedKeys = $.append(fixedKeys, ...(keys ?? []))
			} else {
				fixedKeys = $.append(fixedKeys, ...(keys ?? []))
				await $.pointerValue<TextFormatter>(f).SortingFunc!(fixedKeys)
			}
		} else {
			fixedKeys = $.append(fixedKeys, ...(keys ?? []))
		}

		for (let __goscriptRangeTarget1 = fixedKeys, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let key = __goscriptRangeTarget1![__rangeIndex]
			let value: any = null as any
			switch (true) {
				case $.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "time")):
				{
					if ($.stringEqual($.pointerValue<TextFormatter>(f).TimestampFormat, "")) {
						value = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_entry.Entry>(entry).Time)).Format("2006-01-02T15:04:05Z07:00")
					} else {
						value = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_entry.Entry>(entry).Time)).Format($.pointerValue<TextFormatter>(f).TimestampFormat)
					}
					break
				}
				case $.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "level")):
				{
					value = __goscript_logrus.Level_String($.pointerValue<__goscript_entry.Entry>(entry).Level)
					break
				}
				case $.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "msg")):
				{
					value = $.pointerValue<__goscript_entry.Entry>(entry).Message
					break
				}
				case $.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "logrus_error")):
				{
					value = $.pointerValue<__goscript_entry.Entry>(entry).err
					break
				}
				case ($.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "func"))) && hasCaller:
				{
					value = funcVal
					break
				}
				case ($.stringEqual(key, __goscript_json_formatter.FieldMap_resolve($.pointerValue<TextFormatter>(f).FieldMap, "file"))) && hasCaller:
				{
					value = fileVal
					break
				}
				default:
				{
					value = $.mapGet(data, key, null)[0]
					break
				}
			}
			await TextFormatter.prototype.appendKeyValue.call(f, b, key, value)
		}

		bytes.Buffer.prototype.WriteByte.call($.pointerValue<bytes.Buffer>(b), $.uint(10, 8))
	}

	static __typeInfo = $.registerStructType(
		"logrus.TextFormatter",
		() => new TextFormatter(),
		[{ name: "Format", args: [{ name: "entry", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "appendBytes", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "bs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "appendKeyValue", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "key", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }, { name: "appendNumeric", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "appendString", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "appendValue", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }, { name: "isColored", args: [{ name: "isTerminal", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "isTerminal", args: [{ name: "entry", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "printColored", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "entry", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }, { name: "keys", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "data", type: "logrus.Fields" }], returns: [] }, { name: "printPlain", args: [{ name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" } }, { name: "entry", type: { kind: $.TypeKind.Pointer, elemType: "logrus.Entry" } }, { name: "keys", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } } }, { name: "data", type: "logrus.Fields" }], returns: [] }],
		TextFormatter,
		[{ name: "ForceColors", key: "ForceColors", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [0], offset: 0, exported: true }, { name: "DisableColors", key: "DisableColors", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 1, exported: true }, { name: "ForceQuote", key: "ForceQuote", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 2, exported: true }, { name: "DisableQuote", key: "DisableQuote", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [3], offset: 3, exported: true }, { name: "EnvironmentOverrideColors", key: "EnvironmentOverrideColors", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [4], offset: 4, exported: true }, { name: "DisableTimestamp", key: "DisableTimestamp", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [5], offset: 5, exported: true }, { name: "FullTimestamp", key: "FullTimestamp", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [6], offset: 6, exported: true }, { name: "TimestampFormat", key: "TimestampFormat", type: { kind: $.TypeKind.Basic, name: "string" }, index: [7], offset: 8, exported: true }, { name: "DisableSorting", key: "DisableSorting", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [8], offset: 24, exported: true }, { name: "SortingFunc", key: "SortingFunc", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }], results: [] } as $.FunctionTypeInfo), index: [9], offset: 32, exported: true }, { name: "DisableLevelTruncation", key: "DisableLevelTruncation", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [10], offset: 40, exported: true }, { name: "PadLevelText", key: "PadLevelText", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [11], offset: 41, exported: true }, { name: "QuoteEmptyFields", key: "QuoteEmptyFields", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [12], offset: 42, exported: true }, { name: "terminal", key: "terminal", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "github.com/sirupsen/logrus", index: [13], offset: 43, exported: false }, { name: "FieldMap", key: "FieldMap", type: "logrus.FieldMap", index: [14], offset: 48, exported: true }, { name: "CallerPrettyfier", key: "CallerPrettyfier", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "runtime.Frame" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo), index: [15], offset: 56, exported: true }, { name: "terminalInitOnce", key: "terminalInitOnce", type: "sync.Once", pkgPath: "github.com/sirupsen/logrus", index: [16], offset: 64, exported: false }]
	)
}

export let baseTimestamp: time.Time = $.markAsStructValue($.cloneStructValue(time.Now()))

export function __goscript_set_baseTimestamp(__goscriptValue: time.Time): void {
	baseTimestamp = __goscriptValue
}

export function needsQuoting(s: string): boolean {
	// use an index loop (avoid rune decoding).
	for (let i = 0; i < $.len(s); i++) {
		let c = $.uint($.indexStringOrBytes(s, i), 8)
		if (!isSafeByte($.uint(c, 8))) {
			return true
		}
	}
	return false
}

export function needsQuotingBytes(bs: $.Slice<number>): boolean {
	for (let __goscriptRangeTarget2 = bs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let c = __goscriptRangeTarget2![__rangeIndex]
		if (!isSafeByte($.uint(c, 8))) {
			return true
		}
	}
	return false
}

export function isSafeByte(ch: number): boolean {
	let ok = (ch < 0x80) && ((((ch >= 97) && (ch <= 122)) || ((ch >= 65) && (ch <= 90))) || ((ch >= 48) && (ch <= 57)))
	if (ok) {
		return true
	}
	switch (ch) {
		case 45:
		case 46:
		case 95:
		case 47:
		case 64:
		case 94:
		case 43:
		{
			return true
			break
		}
		default:
		{
			return false
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}
