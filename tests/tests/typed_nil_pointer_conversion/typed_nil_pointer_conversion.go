package main

type node struct {
	next *node
}

func clone(n *node) *node {
	if n == nil {
		return (*node)(nil)
	}
	return &node{next: n.next}
}

func main() {
	var n *node
	cloned := clone(n)
	println(cloned == nil)

	var boxed any = (*node)(nil)
	_, ok := boxed.(*node)
	println(boxed == nil, ok)
}
