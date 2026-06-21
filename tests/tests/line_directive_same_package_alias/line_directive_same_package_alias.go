package main

func main() {
	var sym yySymType
	sym.value = 3
	parser := yyNewParser()
	println(sym.value, parser != nil)
}
