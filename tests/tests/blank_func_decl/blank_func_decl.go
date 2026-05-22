package main

func _() {
	var x [1]struct{}
	_ = x[0]
}

func _() {
	var x [1]struct{}
	_ = x[0]
}

func main() {
	println("blank funcs ok")
}
