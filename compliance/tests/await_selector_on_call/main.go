package main

// Minimal reproducer for selector on awaited call result
// Ensures compiler emits (await F())!.V rather than await F()!.V

type S struct{ V int }

var ch = make(chan int, 1)

// F is async due to channel send and returns *S
func F() *S {
	ch <- 1 // makes F async in TS
	return &S{V: 42}
}

func main() {
	// Access field on call expression base
	// Should compile to (await F())!.V
	println(F().V)
}
