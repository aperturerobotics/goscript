// Generated file based on reflect_typefor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_other from "./other.gs.ts"

export type MyInterface = null | {
	SomeMethod(): void
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "SomeMethod", args: [], returns: [] }]
)

export class MyStruct {
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Age(): number {
		return this._fields.Age.value
	}
	public set Age(value: number) {
		this._fields.Age.value = value
	}

	public _fields: {
		Name: $.VarRef<string>
		Age: $.VarRef<number>
	}

	constructor(init?: Partial<{Name?: string, Age?: number}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Age: $.varRef(init?.Age ?? 0)
		}
	}

	public clone(): MyStruct {
		const cloned = new MyStruct()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Age: $.varRef(this._fields.Age.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		[],
		MyStruct,
		{"Name": { kind: $.TypeKind.Basic, name: "string" }, "Age": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export async function main(): globalThis.Promise<void> {
	// Test TypeFor with named interface type
	let t1 = reflect.TypeFor({T: { type: "main.MyInterface", zero: () => null, methods: {SomeMethod: (receiver: any, ...args: any[]) => receiver.SomeMethod(...args)} }})
	$.println("TypeFor interface:", $.pointerValue<Exclude<reflect.Type, null>>(t1).String())

	// Test TypeFor with struct type
	let t2 = reflect.TypeFor({T: { type: "main.MyStruct", zero: () => $.markAsStructValue(new MyStruct()) }})
	$.println("TypeFor struct:", $.pointerValue<Exclude<reflect.Type, null>>(t2).String())
	$.println("TypeFor struct kind:", $.pointerValue<Exclude<reflect.Type, null>>(t2).Kind() == reflect.Struct)

	// Test TypeFor with int type
	let t3 = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	$.println("TypeFor int:", $.pointerValue<Exclude<reflect.Type, null>>(t3).String())
	$.println("TypeFor int kind:", $.pointerValue<Exclude<reflect.Type, null>>(t3).Kind() == reflect.Int)

	// Test TypeFor with imported and cross-file named struct types
	let t4 = reflect.TypeFor({T: { type: "time.Time", zero: () => $.markAsStructValue(new time.Time()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...args), AddDate: (receiver: any, ...args: any[]) => receiver.AddDate(...args), After: (receiver: any, ...args: any[]) => receiver.After(...args), AppendBinary: (receiver: any, ...args: any[]) => receiver.AppendBinary(...args), AppendFormat: (receiver: any, ...args: any[]) => receiver.AppendFormat(...args), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...args), Before: (receiver: any, ...args: any[]) => receiver.Before(...args), Clock: (receiver: any, ...args: any[]) => receiver.Clock(...args), Compare: (receiver: any, ...args: any[]) => receiver.Compare(...args), Date: (receiver: any, ...args: any[]) => receiver.Date(...args), Day: (receiver: any, ...args: any[]) => receiver.Day(...args), Equal: (receiver: any, ...args: any[]) => receiver.Equal(...args), Format: (receiver: any, ...args: any[]) => receiver.Format(...args), GoString: (receiver: any, ...args: any[]) => receiver.GoString(...args), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...args), Hour: (receiver: any, ...args: any[]) => receiver.Hour(...args), ISOWeek: (receiver: any, ...args: any[]) => receiver.ISOWeek(...args), In: (receiver: any, ...args: any[]) => receiver.In(...args), IsDST: (receiver: any, ...args: any[]) => receiver.IsDST(...args), IsZero: (receiver: any, ...args: any[]) => receiver.IsZero(...args), Local: (receiver: any, ...args: any[]) => receiver.Local(...args), Location: (receiver: any, ...args: any[]) => receiver.Location(...args), MarshalBinary: (receiver: any, ...args: any[]) => receiver.MarshalBinary(...args), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...args), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...args), Minute: (receiver: any, ...args: any[]) => receiver.Minute(...args), Month: (receiver: any, ...args: any[]) => receiver.Month(...args), Nanosecond: (receiver: any, ...args: any[]) => receiver.Nanosecond(...args), Round: (receiver: any, ...args: any[]) => receiver.Round(...args), Second: (receiver: any, ...args: any[]) => receiver.Second(...args), String: (receiver: any, ...args: any[]) => receiver.String(...args), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...args), Truncate: (receiver: any, ...args: any[]) => receiver.Truncate(...args), UTC: (receiver: any, ...args: any[]) => receiver.UTC(...args), Unix: (receiver: any, ...args: any[]) => receiver.Unix(...args), UnixMicro: (receiver: any, ...args: any[]) => receiver.UnixMicro(...args), UnixMilli: (receiver: any, ...args: any[]) => receiver.UnixMilli(...args), UnixNano: (receiver: any, ...args: any[]) => receiver.UnixNano(...args), Weekday: (receiver: any, ...args: any[]) => receiver.Weekday(...args), Year: (receiver: any, ...args: any[]) => receiver.Year(...args), YearDay: (receiver: any, ...args: any[]) => receiver.YearDay(...args), Zone: (receiver: any, ...args: any[]) => receiver.Zone(...args), ZoneBounds: (receiver: any, ...args: any[]) => receiver.ZoneBounds(...args), absSec: (receiver: any, ...args: any[]) => receiver.absSec(...args), appendFormat: (receiver: any, ...args: any[]) => receiver.appendFormat(...args), appendFormatRFC3339: (receiver: any, ...args: any[]) => receiver.appendFormatRFC3339(...args), appendStrictRFC3339: (receiver: any, ...args: any[]) => receiver.appendStrictRFC3339(...args), appendTo: (receiver: any, ...args: any[]) => receiver.appendTo(...args), locabs: (receiver: any, ...args: any[]) => receiver.locabs(...args)} }})
	$.println("TypeFor imported struct:", $.pointerValue<Exclude<reflect.Type, null>>(t4).String())
	let t5 = reflect.TypeFor({T: { type: "main.OtherStruct", zero: () => $.markAsStructValue(new __goscript_other.OtherStruct()) }})
	$.println("TypeFor cross-file struct:", $.pointerValue<Exclude<reflect.Type, null>>(t5).String())

	// Test Pointer constant (should be same as Ptr)
	$.println("Pointer constant:", (reflect.Pointer as number) == reflect.Pointer)

	$.println("reflect_typefor test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
