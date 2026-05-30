package main

import "reflect"

func main() {
	intType := reflect.TypeFor[int]()
	stringType := reflect.TypeFor[string]()
	sliceStringType := reflect.SliceOf(stringType)

	fnType := reflect.FuncOf(
		[]reflect.Type{intType},
		[]reflect.Type{stringType},
		false,
	)
	println(
		"func:",
		fnType.String(),
		fnType.Kind() == reflect.Func,
		fnType.NumIn(),
		fnType.In(0).String(),
		fnType.NumOut(),
		fnType.Out(0).String(),
		fnType.IsVariadic(),
	)

	variadicType := reflect.FuncOf(
		[]reflect.Type{sliceStringType},
		[]reflect.Type{intType},
		true,
	)
	println(
		"variadic:",
		variadicType.String(),
		variadicType.NumIn(),
		variadicType.In(0).String(),
		variadicType.NumOut(),
		variadicType.Out(0).String(),
		variadicType.IsVariadic(),
	)

	println("reflect_func_of test finished")
}
