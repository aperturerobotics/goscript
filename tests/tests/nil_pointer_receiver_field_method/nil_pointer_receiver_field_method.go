package main

type child struct {
	value string
}

func (c *child) Clone() *child {
	if c == nil {
		return nil
	}
	return &child{value: c.value}
}

type parent struct {
	child *child
}

func main() {
	var p parent
	if p.child.Clone() == nil {
		println("nil clone")
	}
	p.child = &child{value: "ok"}
	println(p.child.Clone().value)
}
