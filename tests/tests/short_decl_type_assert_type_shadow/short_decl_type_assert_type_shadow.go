package main

type dumper interface {
	Dump() string
}

type item struct{}

func (item) Dump() string {
	return "ok"
}

func use(v any) string {
	dumper, ok := v.(dumper)
	if !ok {
		return "bad"
	}
	return dumper.Dump()
}

func main() {
	println(use(item{}))
}
