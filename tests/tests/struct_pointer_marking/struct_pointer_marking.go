package main

type MyStruct struct {
	Value int
}

func main() {
	println("=== Struct Pointer Marking Test ===")

	// Scenario 1: Address-of Composite Literal vs Value Variable
	println("\n--- Scenario 1: Composite Literal vs Value Variable ---")
	s := MyStruct{Value: 10}  // struct value
	p := &MyStruct{Value: 20} // pointer to struct (should be marked)

	// Type assertions - struct value
	var i interface{} = s
	_, ok1 := i.(MyStruct)                               // should succeed
	_, ok2 := i.(*MyStruct)                              // should fail
	println("struct value -> MyStruct assertion:", ok1)  // Expected: true
	println("struct value -> *MyStruct assertion:", ok2) // Expected: false

	// Type assertions - struct pointer
	var j interface{} = p
	_, ok3 := j.(MyStruct)                                 // should fail
	_, ok4 := j.(*MyStruct)                                // should succeed
	println("struct pointer -> MyStruct assertion:", ok3)  // Expected: false
	println("struct pointer -> *MyStruct assertion:", ok4) // Expected: true

	// Scenario 2: Variable Aliasing
	println("\n--- Scenario 2: Variable Aliasing ---")
	original := MyStruct{Value: 30}
	pAlias := &original // pointer to existing variable

	var iOriginal interface{} = original // struct value in interface
	var jAlias interface{} = pAlias      // struct pointer in interface

	_, ok5 := iOriginal.(MyStruct)                         // should succeed
	_, ok6 := iOriginal.(*MyStruct)                        // should fail
	println("original value -> MyStruct assertion:", ok5)  // Expected: true
	println("original value -> *MyStruct assertion:", ok6) // Expected: false

	_, ok7 := jAlias.(MyStruct)                           // should fail
	_, ok8 := jAlias.(*MyStruct)                          // should succeed
	println("alias pointer -> MyStruct assertion:", ok7)  // Expected: false
	println("alias pointer -> *MyStruct assertion:", ok8) // Expected: true

	// Scenario 3: Multiple Pointers to Same Variable
	println("\n--- Scenario 3: Multiple Pointers to Same Variable ---")
	shared := MyStruct{Value: 40}
	p1 := &shared
	p2 := &shared

	var i1 interface{} = p1
	var i2 interface{} = p2

	_, ok9 := i1.(*MyStruct)                                // should succeed
	_, ok10 := i2.(*MyStruct)                               // should succeed
	println("first pointer -> *MyStruct assertion:", ok9)   // Expected: true
	println("second pointer -> *MyStruct assertion:", ok10) // Expected: true

	// Verify they point to the same data
	if structPtr1, ok := i1.(*MyStruct); ok {
		if structPtr2, ok := i2.(*MyStruct); ok {
			structPtr1.Value = 99
			println("shared modification check:", structPtr2.Value) // Expected: 99
		}
	}

	// Scenario 4: Mixed Assignment Patterns
	println("\n--- Scenario 4: Mixed Assignment Patterns ---")
	mixed := MyStruct{Value: 50}
	pVar := &mixed               // pointer to variable
	pLit := &MyStruct{Value: 60} // pointer to composite literal

	var iVar interface{} = pVar // VarRef in interface
	var iLit interface{} = pLit // marked struct in interface

	_, ok11 := iVar.(*MyStruct)                               // should succeed
	_, ok12 := iLit.(*MyStruct)                               // should succeed
	println("variable pointer -> *MyStruct assertion:", ok11) // Expected: true
	println("literal pointer -> *MyStruct assertion:", ok12)  // Expected: true

	// Scenario 5: Nested Type Assertions
	println("\n--- Scenario 5: Nested Type Assertions ---")
	nested1 := &MyStruct{Value: 70}
	nested2 := MyStruct{Value: 80}

	// Array of interfaces containing both pointers and values
	arr := []interface{}{nested1, nested2, &nested2}

	for i, item := range arr {
		if val, ok := item.(MyStruct); ok {
			println("arr[", i, "] is MyStruct with value:", val.Value)
		} else if ptr, ok := item.(*MyStruct); ok {
			println("arr[", i, "] is *MyStruct with value:", ptr.Value)
		} else {
			println("arr[", i, "] is unknown type")
		}
	}

	// Scenario 6: Type Switch with Mixed Types
	println("\n--- Scenario 6: Type Switch ---")
	testItems := []interface{}{
		MyStruct{Value: 100},
		&MyStruct{Value: 200},
		300,
		"string",
	}

	for i, item := range testItems {
		switch v := item.(type) {
		case MyStruct:
			println("testItems[", i, "] is MyStruct value:", v.Value)
		case *MyStruct:
			println("testItems[", i, "] is *MyStruct pointer:", v.Value)
		case int:
			println("testItems[", i, "] is int:", v)
		case string:
			println("testItems[", i, "] is string:", v)
		default:
			println("testItems[", i, "] is unknown type")
		}
	}

	println("\n=== Test Complete ===")
}
