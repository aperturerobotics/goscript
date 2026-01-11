package main

func main() {
	// Simple case that should work
	x := 10
	p1 := &x // p1 is *int, not varref'd
	p2 := p1 // p2 is *int, not varref'd, should copy p1

	println("p1==p2:", p1 == p2) // Should be true
	println("*p1:", *p1)         // Should be 10
	println("*p2:", *p2)         // Should be 10
}
