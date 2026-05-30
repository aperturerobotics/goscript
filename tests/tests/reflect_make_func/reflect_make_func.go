package main

import "reflect"

func main() {
	intType := reflect.TypeFor[int]()
	stringType := reflect.TypeFor[string]()
	boolType := reflect.TypeFor[bool]()

	unaryType := reflect.FuncOf(
		[]reflect.Type{intType},
		[]reflect.Type{stringType},
		false,
	)
	unaryValue := reflect.MakeFunc(unaryType, func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf("value-" + string(rune('0'+args[0].Int())))}
	})
	unary := unaryValue.Interface().(func(int) string)
	println("direct:", unary(7))
	reflectedUnary := unaryValue.Call([]reflect.Value{reflect.ValueOf(8)})
	println("reflected:", reflectedUnary[0].String())
	_, wrong := unaryValue.Interface().(func(string) string)
	println("wrong assertion:", wrong)

	zeroType := reflect.FuncOf(nil, nil, false)
	zeroCalled := false
	zeroValue := reflect.MakeFunc(zeroType, func(args []reflect.Value) []reflect.Value {
		zeroCalled = true
		return nil
	})
	zeroValue.Interface().(func())()
	println("zero:", zeroCalled)

	tupleType := reflect.FuncOf(nil, []reflect.Type{intType, boolType}, false)
	tupleValue := reflect.MakeFunc(tupleType, func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf(3), reflect.ValueOf(true)}
	})
	tuple := tupleValue.Interface().(func() (int, bool))
	number, ok := tuple()
	println("tuple direct:", number, ok)
	reflectedTuple := tupleValue.Call(nil)
	println("tuple reflected:", reflectedTuple[0].Int(), reflectedTuple[1].Bool())

	variadicType := reflect.FuncOf(
		[]reflect.Type{intType, reflect.SliceOf(stringType)},
		[]reflect.Type{intType},
		true,
	)
	variadicValue := reflect.MakeFunc(variadicType, func(args []reflect.Value) []reflect.Value {
		return []reflect.Value{reflect.ValueOf(int(args[0].Int()) + args[1].Len())}
	})
	variadic := variadicValue.Interface().(func(int, ...string) int)
	println("variadic direct:", variadic(10, "a", "b"))
	reflectedVariadic := variadicValue.Call([]reflect.Value{
		reflect.ValueOf(20),
		reflect.ValueOf("a"),
		reflect.ValueOf("b"),
		reflect.ValueOf("c"),
	})
	println("variadic reflected:", reflectedVariadic[0].Int())
	reflectedSlice := variadicValue.CallSlice([]reflect.Value{
		reflect.ValueOf(30),
		reflect.ValueOf([]string{"a", "b"}),
	})
	println("variadic callslice:", reflectedSlice[0].Int())

	println("reflect_make_func test finished")
}
