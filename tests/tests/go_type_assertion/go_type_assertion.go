package main

func main() {
	var x any = func() {
		println("goroutine executed")
	}
	go x.(func())()
	println("main finished")
}
