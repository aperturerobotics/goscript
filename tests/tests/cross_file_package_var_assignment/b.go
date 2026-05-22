package main

func init() {
	hook = func() int {
		return 2
	}
}

func main() {
	println(read())
}
