package main

import "unique"

type zone struct {
	name string
}

func main() {
	a := unique.Make(zone{name: "eth0"})
	b := unique.Make(zone{name: "eth0"})
	c := unique.Make(zone{name: "eth1"})

	println(a == b)
	println(a == c)
	println(a.Value().name)
}
