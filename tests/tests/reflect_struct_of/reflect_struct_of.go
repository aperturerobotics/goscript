package main

import (
	"encoding/json"
	"reflect"
)

func main() {
	intType := reflect.TypeFor[int]()
	stringType := reflect.TypeFor[string]()
	byteType := reflect.TypeFor[byte]()

	fields := []reflect.StructField{
		{Name: "Name", Type: stringType, Tag: `json:"name"`},
		{Name: "Count", Type: intType, Tag: `json:"count"`},
	}
	typ := reflect.StructOf(fields)
	println("type:", typ.String(), typ.Name(), typ.PkgPath(), typ.NumField(), typ.Field(1).Offset > 0, typ.Comparable())

	value := reflect.New(typ).Elem()
	value.FieldByName("Name").SetString("Ada")
	value.Field(1).SetInt(3)
	data, err := json.Marshal(value.Interface())
	if err != nil {
		println("json error:", err.Error())
		return
	}
	println("json:", string(data))

	layout := reflect.StructOf([]reflect.StructField{
		{Name: "A", Type: byteType},
		{Name: "B", Type: intType},
	})
	println("layout:", layout.Field(0).Offset, layout.Field(1).Offset, layout.Size(), layout.Field(0).Index[0])

	inner := reflect.StructOf([]reflect.StructField{
		{Name: "ID", Type: intType},
		{Name: "Label", Type: stringType},
	})
	outer := reflect.StructOf([]reflect.StructField{
		{Name: "Inner", Type: inner, Anonymous: true},
		{Name: "Count", Type: intType},
	})
	visible := reflect.VisibleFields(outer)
	println("visible:", len(visible), visible[0].Name, len(visible[1].Index), visible[1].Index[0], visible[1].Index[1])

	outerValue := reflect.New(outer).Elem()
	outerValue.FieldByIndex([]int{0, 0}).SetInt(9)
	println("promoted:", outerValue.FieldByName("ID").Int())

	println("same:", typ == reflect.StructOf(fields))
	println("different-pkg:", reflect.StructOf([]reflect.StructField{{Name: "x", PkgPath: "a", Type: intType}}) == reflect.StructOf([]reflect.StructField{{Name: "x", PkgPath: "b", Type: intType}}))
	println("reflect_struct_of test finished")
}
