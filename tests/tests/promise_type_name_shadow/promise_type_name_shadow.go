package main

type Promise struct {
	value string
}

func main() {
	p := Promise{value: "ok"}
	println(p.value)
}
