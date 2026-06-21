package main

func main() {
	messages := make(chan string)
	go func() {
		messages <- "go"
	}()
	println(<-messages)

	func() {
		println("plain")
	}()

	defer func() {
		println("defer")
	}()

	stored := func() {
		println("value")
	}
	stored()
}
