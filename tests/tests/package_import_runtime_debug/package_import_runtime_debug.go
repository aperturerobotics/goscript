package main

import "runtime/debug"

func main() {
	stack := debug.Stack()
	println("Stack nonempty:", len(stack) > 0)
}
