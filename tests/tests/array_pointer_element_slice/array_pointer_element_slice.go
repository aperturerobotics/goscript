package main

type node struct {
	sub  []*node
	sub0 [1]*node
}

func main() {
	root := &node{}
	child := &node{}
	root.sub = append(root.sub0[:0], child)

	println(len(root.sub), root.sub[0] == child)
}
