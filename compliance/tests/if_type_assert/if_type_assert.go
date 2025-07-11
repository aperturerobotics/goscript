package main

func main() {
	var a any
	a = "this is a string"
	if _, ok := a.(string); ok {
		println("Expected: string")
	} else {
		println("Not Expected: should be a string")
	}
}
