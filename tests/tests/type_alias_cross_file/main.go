package main

type source struct{}

func (source) Val() Value {
	return Value("ok")
}

func main() {
	println(string(Read(source{})))
}
