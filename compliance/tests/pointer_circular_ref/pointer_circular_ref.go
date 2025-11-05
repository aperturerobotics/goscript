package main

// This creates a circular reference through pointers
// which should NOT cause a circular dependency error
// because pointers don't require initialization dependencies

type Node struct {
	value    int
	next     *Node   // Pointer to Node - this should NOT create a dependency
	parent   *Node   // Another pointer - also should NOT create a dependency
	children []*Node //nolint:unused // Slice of pointers - also should NOT create a dependency
}

type TreeNode struct {
	data   string    //nolint:unused
	left   *TreeNode //nolint:unused
	right  *TreeNode //nolint:unused
	parent *TreeNode //nolint:unused
}

// This creates a mutual circular reference through pointers
type Person struct {
	name   string
	spouse *Employee // Pointer to Employee
}

type Employee struct {
	id     int
	person *Person // Pointer back to Person
}

func main() {
	// Create a simple linked list
	node1 := &Node{value: 1}
	node2 := &Node{value: 2}
	node1.next = node2
	node2.parent = node1

	println("Node 1 value:", node1.value)
	println("Node 2 value:", node2.value)

	// Create person/employee relationship
	person := &Person{name: "John"}
	employee := &Employee{id: 123}
	person.spouse = employee
	employee.person = person

	println("Person name:", person.name)
	println("Employee ID:", employee.id)

	println("Pointer circular references work fine!")
}
