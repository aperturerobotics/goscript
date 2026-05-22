package main

type aValue struct {
	next *bValue
}

func makeA() aValue {
	return aValue{}
}
