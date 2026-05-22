package main

type outer struct {
	inner inner
}

type inner struct {
	value int
}

var defaultOuter = outer{}

func main() {
	defaultOuter.inner.value = 7
	println(defaultOuter.inner.value)
}
