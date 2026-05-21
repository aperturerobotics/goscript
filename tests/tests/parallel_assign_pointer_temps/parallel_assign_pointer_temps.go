package main

type node struct {
	next int
}

type queue struct {
	value int
}

func main() {
	left := &queue{value: 1}
	right := &queue{value: 2}
	left, right = right, left
	println(left.value, right.value)

	nodes := [2]node{{next: 1}, {next: 0}}
	pc := 0
	inst := &nodes[pc]
	pc, inst = inst.next, &nodes[inst.next]
	println(pc, inst.next)
}
