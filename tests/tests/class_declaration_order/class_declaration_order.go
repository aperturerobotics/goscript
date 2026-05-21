package main

type named interface {
	Name() string
}

var defaultNamed named = &lateType{}

type lateType struct{}

func (lateType) Name() string {
	return "late"
}

func main() {
	println(defaultNamed.Name())
}
