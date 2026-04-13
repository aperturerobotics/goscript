package main

func main() {
	var w any = "test"
	println("value is", w.(string))
}
