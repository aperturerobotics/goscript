package main

type label struct {
	value string
}

func main() {
	item := label{value: "go"}
	println(item.Format())
}
