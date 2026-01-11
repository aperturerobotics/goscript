package main

type MyStruct struct {
	Value int
}

func main() {
	// Scenario 1: Composite literal pointers (should work correctly)
	var i1 interface{} = &MyStruct{Value: 10}
	_, ok1 := i1.(*MyStruct)
	println("Scenario 1 - Composite literal pointer assertion:", ok1)

	// Scenario 2: Variable aliasing (fixed by our change)
	original := MyStruct{Value: 30}
	pAlias := &original
	var i2 interface{} = pAlias
	_, ok2 := i2.(*MyStruct)
	println("Scenario 2 - Variable pointer assertion:", ok2)

	// Scenario 3: Multiple pointer variables
	s1 := MyStruct{Value: 40}
	s2 := MyStruct{Value: 50}
	p1 := &s1
	p2 := &s2
	var i3a interface{} = p1
	var i3b interface{} = p2
	_, ok3a := i3a.(*MyStruct)
	_, ok3b := i3b.(*MyStruct)
	println("Scenario 3a - Multiple pointer 1 assertion:", ok3a)
	println("Scenario 3b - Multiple pointer 2 assertion:", ok3b)

	// Scenario 4: Mixed patterns
	s4 := MyStruct{Value: 60}
	p4 := &s4
	var i4a interface{} = &MyStruct{Value: 70} // composite literal pointer
	var i4b interface{} = p4                   // variable pointer
	_, ok4a := i4a.(*MyStruct)
	_, ok4b := i4b.(*MyStruct)
	println("Scenario 4a - Mixed composite literal assertion:", ok4a)
	println("Scenario 4b - Mixed variable pointer assertion:", ok4b)

	// Scenario 5: Nested pointer assignment
	s5 := MyStruct{Value: 80}
	p5a := &s5
	p5b := p5a // p5b points to same varref as p5a
	var i5 interface{} = p5b
	_, ok5 := i5.(*MyStruct)
	println("Scenario 5 - Nested pointer assignment assertion:", ok5)

	// Scenario 6: Struct value vs pointer distinction
	s6 := MyStruct{Value: 90}
	p6 := &s6
	s6copy := s6                 // struct value copy
	var i6a interface{} = s6copy // struct value (should fail pointer assertion)
	var i6b interface{} = p6     // struct pointer (should succeed)
	_, ok6a := i6a.(*MyStruct)   // should be false
	_, ok6b := i6b.(*MyStruct)   // should be true
	_, ok6c := i6a.(MyStruct)    // should be true
	println("Scenario 6a - Struct value to pointer assertion (should be false):", ok6a)
	println("Scenario 6b - Struct pointer to pointer assertion (should be true):", ok6b)
	println("Scenario 6c - Struct value to value assertion (should be true):", ok6c)
}
