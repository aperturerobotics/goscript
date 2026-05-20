package main

type item struct {
	name string
}

func (i *item) Name() string {
	if i == nil {
		return ""
	}
	return i.name
}

func main() {
	items := []item{{name: "alpha"}, {name: "beta"}}
	for _, item := range items {
		println(item.Name())
	}
}
