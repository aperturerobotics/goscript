package main

type Node interface {
	Key() string
}

type Table struct {
	name string
}

func (t *Table) Key() string {
	return t.name
}

func main() {
	var node Node = &Table{name: "users"}
	seen := map[Node]bool{node: true}
	if table, ok := node.(*Table); ok {
		value, found := seen[table]
		println(value, found)
	}
}
