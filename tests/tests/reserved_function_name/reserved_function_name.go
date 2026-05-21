package main

func throw(value string) string {
	return value + "!"
}

func main() {
	println(throw("ok"))
}
