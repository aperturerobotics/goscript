package main

// This test demonstrates that a non-nil interface can contain a nil value.
// In Go, an interface has two components: (type, value).
// An interface is nil only if BOTH type and value are nil.
// If you assign a typed nil pointer to an interface, the interface is NOT nil.

type Animal interface {
	Name() string
}

type Dog struct {
	name string
}

type Cat struct {
	name string
}

func (d *Dog) Name() string {
	if d == nil {
		return "unknown dog"
	}
	return d.name
}

func (c *Cat) Name() string {
	if c == nil {
		return "unknown cat"
	}
	return c.name
}

func FindDog() *Dog {
	return nil // Returns a typed nil
}

func FindCat() *Cat {
	return &Cat{name: "Whiskers"}
}

func FindAnimal() Animal {
	// This is a common bug pattern in Go:
	// dog is a *Dog with value nil
	// When assigned to Animal interface, the interface is NOT nil
	// because it has type *Dog (even though value is nil)
	if dog := Animal(FindDog()); dog != nil {
		// In Go, this branch IS taken because dog != nil
		// The interface has type=*Dog, value=nil
		return dog
	}
	return FindCat()
}

func main() {
	animal := FindAnimal()

	// Test 1: The interface should NOT be nil
	if animal == nil {
		println("animal is nil")
	} else {
		println("animal is not nil")
	}

	// Test 2: Calling method on nil receiver should work
	// The method dispatch uses the type (*Dog) to find Name()
	// Then passes nil as the receiver
	println(animal.Name())
	var directNilDog *Dog
	println(directNilDog.Name())

	// Test 3: Type assertions preserve the typed nil pointer
	if d, ok := animal.(*Dog); ok && d == nil {
		println("typed nil dog assertion ok")
	} else {
		println("typed nil dog assertion failed")
	}
	if c, ok := animal.(*Cat); ok || c != nil {
		println("typed nil cat assertion accepted")
	} else {
		println("typed nil cat assertion rejected")
	}

	// Test 4: Direct nil pointer to interface assignment
	var dog *Dog = nil
	var a Animal = dog

	if a == nil {
		println("a is nil")
	} else {
		println("a is not nil")
	}

	// Test 5: Truly nil interface
	var b Animal = nil
	if b == nil {
		println("b is nil")
	} else {
		println("b is not nil")
	}
}
