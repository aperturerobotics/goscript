package main

func main() {
	values := make(map[string]int)
	values["one"] = 1
	println("before nil:", values["one"])
	values = nil
	println("is nil:", values == nil)
}
