package main

func register(cb func()) func() {
	println("register")
	cb()
	return func() {
		println("release")
	}
}

func main() {
	defer register(func() {
		println("callback")
	})()
	println("body")
}
