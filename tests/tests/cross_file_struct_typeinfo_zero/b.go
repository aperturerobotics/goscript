package main

type bValue struct {
	inner aValue
}

func makeB() bValue {
	return bValue{}
}
