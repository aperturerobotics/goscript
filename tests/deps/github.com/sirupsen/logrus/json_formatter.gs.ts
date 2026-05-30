// Generated file based on json_formatter.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as context from "@goscript/context/index.js"

import * as io from "@goscript/io/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import type * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"

import * as __goscript_writer from "./writer.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/fmt/index.js"
import "@goscript/runtime/index.js"
import "@goscript/strconv/index.js"
import "@goscript/context/index.js"
import "@goscript/io/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./buffer_pool.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"
import "./writer.gs.ts"

export type FieldMap = Map<fieldKey, string> | null

export class JSONFormatter {
	// TimestampFormat sets the format used for marshaling timestamps.
	// The format to use is the same than for time.Format or time.Parse from the standard
	// library.
	// The standard Library already provides a set of predefined format.
	public get TimestampFormat(): string {
		return this._fields.TimestampFormat.value
	}
	public set TimestampFormat(value: string) {
		this._fields.TimestampFormat.value = value
	}

	// DisableTimestamp allows disabling automatic timestamps in output
	public get DisableTimestamp(): boolean {
		return this._fields.DisableTimestamp.value
	}
	public set DisableTimestamp(value: boolean) {
		this._fields.DisableTimestamp.value = value
	}

	// DisableHTMLEscape allows disabling html escaping in output
	public get DisableHTMLEscape(): boolean {
		return this._fields.DisableHTMLEscape.value
	}
	public set DisableHTMLEscape(value: boolean) {
		this._fields.DisableHTMLEscape.value = value
	}

	// DataKey allows users to put all the log entry parameters into a nested dictionary at a given key.
	public get DataKey(): string {
		return this._fields.DataKey.value
	}
	public set DataKey(value: string) {
		this._fields.DataKey.value = value
	}

	// FieldMap allows users to customize the names of keys for default fields.
	// As an example:
	// formatter := &JSONFormatter{
	//   	FieldMap: FieldMap{
	// 		 FieldKeyTime:  "@timestamp",
	// 		 FieldKeyLevel: "@level",
	// 		 FieldKeyMsg:   "@message",
	// 		 FieldKeyFunc:  "@caller",
	//    },
	// }
	public get FieldMap(): FieldMap {
		return this._fields.FieldMap.value
	}
	public set FieldMap(value: FieldMap) {
		this._fields.FieldMap.value = value
	}

	// CallerPrettyfier can be set by the user to modify the content
	// of the function and file keys in the json data when ReportCaller is
	// activated. If any of the returned value is the empty string the
	// corresponding key will be removed from json fields.
	public get CallerPrettyfier(): ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null {
		return this._fields.CallerPrettyfier.value
	}
	public set CallerPrettyfier(value: ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null) {
		this._fields.CallerPrettyfier.value = value
	}

	// PrettyPrint will indent all json logs
	public get PrettyPrint(): boolean {
		return this._fields.PrettyPrint.value
	}
	public set PrettyPrint(value: boolean) {
		this._fields.PrettyPrint.value = value
	}

	public _fields: {
		TimestampFormat: $.VarRef<string>
		DisableTimestamp: $.VarRef<boolean>
		DisableHTMLEscape: $.VarRef<boolean>
		DataKey: $.VarRef<string>
		FieldMap: $.VarRef<FieldMap>
		CallerPrettyfier: $.VarRef<((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null>
		PrettyPrint: $.VarRef<boolean>
	}

	constructor(init?: Partial<{TimestampFormat?: string, DisableTimestamp?: boolean, DisableHTMLEscape?: boolean, DataKey?: string, FieldMap?: FieldMap, CallerPrettyfier?: ((_p0: runtime.Frame | $.VarRef<runtime.Frame> | null) => [string, string] | globalThis.Promise<[string, string]>) | null, PrettyPrint?: boolean}>) {
		this._fields = {
			TimestampFormat: $.varRef(init?.TimestampFormat ?? ""),
			DisableTimestamp: $.varRef(init?.DisableTimestamp ?? false),
			DisableHTMLEscape: $.varRef(init?.DisableHTMLEscape ?? false),
			DataKey: $.varRef(init?.DataKey ?? ""),
			FieldMap: $.varRef(init?.FieldMap ?? null),
			CallerPrettyfier: $.varRef(init?.CallerPrettyfier ?? null),
			PrettyPrint: $.varRef(init?.PrettyPrint ?? false)
		}
	}

	public clone(): JSONFormatter {
		const cloned = new JSONFormatter()
		cloned._fields = {
			TimestampFormat: $.varRef(this._fields.TimestampFormat.value),
			DisableTimestamp: $.varRef(this._fields.DisableTimestamp.value),
			DisableHTMLEscape: $.varRef(this._fields.DisableHTMLEscape.value),
			DataKey: $.varRef(this._fields.DataKey.value),
			FieldMap: $.varRef(this._fields.FieldMap.value),
			CallerPrettyfier: $.varRef(this._fields.CallerPrettyfier.value),
			PrettyPrint: $.varRef(this._fields.PrettyPrint.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Format(entry: __goscript_entry.Entry | $.VarRef<__goscript_entry.Entry> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let f: JSONFormatter | $.VarRef<JSONFormatter> | null = this
		let caller: runtime.Frame | $.VarRef<runtime.Frame> | null = $.pointerValue<__goscript_entry.Entry>(entry).Caller
		let data: __goscript_logrus.Fields = $.makeMap<string, any>()
		for (let [k, v] of $.pointerValue<__goscript_entry.Entry>(entry).Data?.entries() ?? []) {
			{
				const __goscriptTypeSwitchValue = v
				switch (true) {
					case $.typeAssert<Exclude<$.GoError, null>>(__goscriptTypeSwitchValue, "error").ok:
						{
							let v: Exclude<$.GoError, null> = $.typeAssert<Exclude<$.GoError, null>>(__goscriptTypeSwitchValue, "error").value
							$.mapSet(data, k, await $.pointerValue<Exclude<$.GoError, null>>(v).Error())
						}
						break
					default:
						{
							let v: any = __goscriptTypeSwitchValue
							$.mapSet(data, k, v)
						}
						break
				}
			}
		}

		if ((!$.stringEqual($.pointerValue<JSONFormatter>(f).DataKey, "")) && ($.len($.pointerValue<__goscript_entry.Entry>(entry).Data) > 0)) {
			let newData: __goscript_logrus.Fields = $.makeMap<string, any>()
			$.mapSet(newData, $.pointerValue<JSONFormatter>(f).DataKey, $.interfaceValue<any>(data, "logrus.Fields"))
			data = newData
		}

		let hasCaller = caller != null
		__goscript_formatter.prefixFieldClashes(data, $.pointerValue<JSONFormatter>(f).FieldMap, hasCaller)

		let timestampFormat = $.pointerValue<JSONFormatter>(f).TimestampFormat
		if ($.stringEqual(timestampFormat, "")) {
			timestampFormat = "2006-01-02T15:04:05Z07:00"
		}

		if (!$.stringEqual($.pointerValue<__goscript_entry.Entry>(entry).err, "")) {
			$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "logrus_error"), $.pointerValue<__goscript_entry.Entry>(entry).err)
		}
		if (!$.pointerValue<JSONFormatter>(f).DisableTimestamp) {
			$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "time"), $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_entry.Entry>(entry).Time)).Format(timestampFormat))
		}
		$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "msg"), $.pointerValue<__goscript_entry.Entry>(entry).Message)
		$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "level"), __goscript_logrus.Level_String($.pointerValue<__goscript_entry.Entry>(entry).Level))
		if (caller != null) {
			let funcVal: string = ""
			let fileVal: string = ""
			if ($.pointerValue<JSONFormatter>(f).CallerPrettyfier != null) {
				let __goscriptTuple0: any = await $.pointerValue<JSONFormatter>(f).CallerPrettyfier!(caller)
				funcVal = __goscriptTuple0[0]
				fileVal = __goscriptTuple0[1]
			} else {
				funcVal = $.pointerValue<runtime.Frame>(caller).Function
				fileVal = ($.pointerValue<runtime.Frame>(caller).File + ":") + strconv.FormatInt($.int($.int($.pointerValue<runtime.Frame>(caller).Line)), 10)
			}
			if (!$.stringEqual(funcVal, "")) {
				$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "func"), funcVal)
			}
			if (!$.stringEqual(fileVal, "")) {
				$.mapSet(data, FieldMap_resolve($.pointerValue<JSONFormatter>(f).FieldMap, "file"), fileVal)
			}
		}

		let b: bytes.Buffer | $.VarRef<bytes.Buffer> | null = $.pointerValue<__goscript_entry.Entry>(entry).Buffer
		if (b == null) {
			b = new bytes.Buffer()
		}

		let encoder: json.Encoder | $.VarRef<json.Encoder> | null = json.NewEncoder($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*bytes.Buffer"))!)
		json.Encoder.prototype.SetEscapeHTML.call($.pointerValue<json.Encoder>(encoder), !$.pointerValue<JSONFormatter>(f).DisableHTMLEscape)
		if ($.pointerValue<JSONFormatter>(f).PrettyPrint) {
			json.Encoder.prototype.SetIndent.call($.pointerValue<json.Encoder>(encoder), "", "  ")
		}
		{
			let err = json.Encoder.prototype.Encode.call($.pointerValue<json.Encoder>(encoder), $.interfaceValue<any>(data, "logrus.Fields"))
			if (err != null) {
				return [null, fmt.Errorf("failed to marshal fields to JSON, %w", (err as any))]
			}
		}

		return [bytes.Buffer.prototype.Bytes.call($.pointerValue<bytes.Buffer>(b)), null]
	}

	static __typeInfo = $.registerStructType(
		"logrus.JSONFormatter",
		() => new JSONFormatter(),
		[{ name: "Format", args: [], returns: [] }],
		JSONFormatter,
		[{ name: "TimestampFormat", key: "TimestampFormat", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "DisableTimestamp", key: "DisableTimestamp", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [1], offset: 16, exported: true }, { name: "DisableHTMLEscape", key: "DisableHTMLEscape", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 17, exported: true }, { name: "DataKey", key: "DataKey", type: { kind: $.TypeKind.Basic, name: "string" }, index: [3], offset: 24, exported: true }, { name: "FieldMap", key: "FieldMap", type: "logrus.FieldMap", index: [4], offset: 40, exported: true }, { name: "CallerPrettyfier", key: "CallerPrettyfier", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "runtime.Frame" }], results: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }] } as $.FunctionTypeInfo), index: [5], offset: 48, exported: true }, { name: "PrettyPrint", key: "PrettyPrint", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [6], offset: 56, exported: true }]
	)
}

export type fieldKey = string

export function FieldMap_resolve(f: FieldMap, key: fieldKey): string {
	{
		let [k, ok] = $.mapGet(f, key, "")
		if (ok) {
			return k
		}
	}

	return key
}
