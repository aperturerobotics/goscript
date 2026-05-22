package main

type thing struct{}

var Seen int

func newThing() thing {
	return thing{}
}

func init() {
	Seen = Store
}
