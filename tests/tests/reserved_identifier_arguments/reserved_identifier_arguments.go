package main

type Parser struct{}

func (Parser) Parse(arguments []string) int {
	return len(arguments)
}

func collect(arguments string) string {
	return arguments + "!"
}

func main() {
	println(Parser{}.Parse([]string{"a", "b"}))
	println(collect("ok"))
}
