package main

func classify(value int) string {
	switch value {
	default:
		fallthrough
	case 1:
		return "one"
	case 2:
		return "two"
	}
}

func main() {
	println(classify(0))
	println(classify(1))
	println(classify(2))
}
