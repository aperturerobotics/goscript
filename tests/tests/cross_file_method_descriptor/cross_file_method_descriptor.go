package main

type runner interface {
	Run() string
}

type mode int

func asRunner(m mode) runner {
	return m
}

func main() {
	println(asRunner(mode(1)).Run())
}
