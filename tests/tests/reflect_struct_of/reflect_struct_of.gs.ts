// Generated file based on reflect_struct_of.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	let intType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }})
	let stringType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }})
	let byteType = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "uint8" }, zero: () => 0 }})

	let fields: $.Slice<reflect.StructField> = $.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "Name", Type: stringType, Tag: "json:\"name\""})), $.markAsStructValue(new reflect.StructField({Name: "Count", Type: intType, Tag: "json:\"count\""}))])
	let typ = reflect.StructOf(fields)
	$.println("type:", await $.pointerValue<Exclude<reflect.Type, null>>(typ).String(), await $.pointerValue<Exclude<reflect.Type, null>>(typ).Name(), await $.pointerValue<Exclude<reflect.Type, null>>(typ).PkgPath(), await $.pointerValue<Exclude<reflect.Type, null>>(typ).NumField(), (await $.pointerValue<Exclude<reflect.Type, null>>(typ).Field(1)).Offset > 0, await $.pointerValue<Exclude<reflect.Type, null>>(typ).Comparable())

	let value = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(typ)!))).Elem()))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(value)).FieldByName("Name"))).SetString("Ada")
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(value)).Field(1))).SetInt(3n)
	let __goscriptTuple0: any = json.Marshal($.markAsStructValue($.cloneStructValue(value)).Interface())
	let data: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("json error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("json:", $.bytesToString(data))

	let layout = reflect.StructOf($.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "A", Type: byteType})), $.markAsStructValue(new reflect.StructField({Name: "B", Type: intType}))]))
	$.println("layout:", $.uint((await $.pointerValue<Exclude<reflect.Type, null>>(layout).Field(0)).Offset, 64), $.uint((await $.pointerValue<Exclude<reflect.Type, null>>(layout).Field(1)).Offset, 64), $.uint(await $.pointerValue<Exclude<reflect.Type, null>>(layout).Size(), 64), $.arrayIndex((await $.pointerValue<Exclude<reflect.Type, null>>(layout).Field(0)).Index!, 0))

	let inner = reflect.StructOf($.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "ID", Type: intType})), $.markAsStructValue(new reflect.StructField({Name: "Label", Type: stringType}))]))
	let outer = reflect.StructOf($.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "Inner", Type: inner, Anonymous: true})), $.markAsStructValue(new reflect.StructField({Name: "Count", Type: intType}))]))
	let visible: $.Slice<reflect.StructField> = reflect.VisibleFields($.pointerValueOrNil(outer)!)
	$.println("visible:", $.len(visible), $.arrayIndex(visible!, 0).Name, $.len($.arrayIndex(visible!, 1).Index), $.arrayIndex($.arrayIndex(visible!, 1).Index!, 0), $.arrayIndex($.arrayIndex(visible!, 1).Index!, 1))

	let outerValue = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(outer)!))).Elem()))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(outerValue)).FieldByIndex($.arrayToSlice<number>([0, 0])))).SetInt(9n)
	$.println("promoted:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(outerValue)).FieldByName("ID"))).Int())

	$.println("same:", $.comparableEqual(typ, reflect.StructOf(fields)))
	$.println("different-pkg:", $.comparableEqual(reflect.StructOf($.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "x", PkgPath: "a", Type: intType}))])), reflect.StructOf($.arrayToSlice<reflect.StructField>([$.markAsStructValue(new reflect.StructField({Name: "x", PkgPath: "b", Type: intType}))]))))
	$.println("reflect_struct_of test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}
