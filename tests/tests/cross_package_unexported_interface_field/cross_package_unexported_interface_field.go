package main

import "github.com/s4wave/goscript/tests/tests/cross_package_unexported_interface_field/dep"

func main() {
	holder := dep.NewHolder()
	println(holder.Hidden.Ping())
}
