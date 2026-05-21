package main

import _ "unsafe"

//go:linkname externalVoid runtime.goscriptExternalVoid
func externalVoid()

//go:linkname externalInt runtime.goscriptExternalInt
func externalInt() int

//go:linkname externalPair runtime.goscriptExternalPair
func externalPair() (int, bool)

func main() {
	externalVoid()
	n, ok := externalPair()
	println("int:", externalInt())
	println("pair:", n, ok)
}
