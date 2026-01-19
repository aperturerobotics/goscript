package main

// Test for indirect circular dependencies via slices
// This is valid Go code that should compile with goscript
// See: https://github.com/aperturerobotics/goscript/issues/125

type A struct {
	BB []B
}

type B struct {
	AA []A
}

func main() {
	a1 := A{}
	b1 := B{}

	a2 := A{BB: []B{b1}}
	b2 := B{AA: []A{a1}}

	println("a1:", a1.BB == nil)
	println("b1:", b1.AA == nil)
	println("a2 has", len(a2.BB), "B items")
	println("b2 has", len(b2.AA), "A items")
}
