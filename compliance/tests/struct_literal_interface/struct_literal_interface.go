package main

import "reflect"

func main() {
	// Test creating reflect.SelectCase struct literals
	cases := []reflect.SelectCase{
		{Dir: reflect.SelectDefault},
	}
	println("Cases len:", len(cases))
	println("First case dir:", cases[0].Dir)
}
