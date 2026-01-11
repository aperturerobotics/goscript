package main

type MyStruct struct {
	Value int
}

func main() {
	original := MyStruct{Value: 30}
	pAlias := &original

	var jAlias interface{} = pAlias

	_, ok := jAlias.(*MyStruct)
	println("pointer assertion result:", ok)
}
