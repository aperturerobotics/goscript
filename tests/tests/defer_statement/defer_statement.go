package main

func main() {
	defer println("deferred")
	release := func(name string) {
		defer println("func deferred", name)
		println("func body", name)
	}
	release("first")
	release("second")
	println("main")
}
