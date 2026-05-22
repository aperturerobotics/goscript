package main

import "github.com/aperturerobotics/goscript/tests/tests/imported_generic_function/helper"

func collectValues(value helper.Value) ([]helper.Value, error) {
	return helper.Collect(value)
}

func collectAssigned(value helper.Value) ([]helper.Value, error) {
	values, err := helper.Collect(value)
	if err != nil {
		return nil, err
	}
	return values, nil
}

func main() {
	box := helper.Wrap(21)
	println("wrapped:", box.Value)
	values, err := collectValues(helper.IntValue{N: 34})
	if err != nil {
		println(err.Error())
		return
	}
	println("collected:", values[0].GetValue())
	assigned, err := collectAssigned(helper.IntValue{N: 35})
	if err != nil {
		println(err.Error())
		return
	}
	println("assigned:", assigned[0].GetValue())
}
