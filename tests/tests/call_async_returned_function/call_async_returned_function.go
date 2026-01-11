package main

import "sync"

var cache sync.Map

// Async function that returns a function
func getCallback() func(string) {
	cache.Load(1)
	return func(msg string) {
		println("Callback:", msg)
	}
}

func main() {
	// Call the function returned by an async function
	// This should generate: (await getCallback())!("hello")
	// NOT: await getCallback()!("hello")
	getCallback()("hello")
}
