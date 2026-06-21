package main

func choose(arguments int) (eval int) {
	eval = arguments + 1
	arguments = eval + arguments
	return
}

func main() {
	eval := choose(1)
	arguments := eval + 1
	println(eval, arguments)
}
