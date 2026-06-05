package main

import "reflect"

var (
	table         []int
	remoteCounter int
	stringType    = reflect.TypeFor[string]()
)

var _ = marker
