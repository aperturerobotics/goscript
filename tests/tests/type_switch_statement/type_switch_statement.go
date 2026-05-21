package main

func main() {
	// Basic type switch with variable and default case
	var i any = "hello"
	switch v := i.(type) {
	case int:
		println("int", v)
	case string:
		println("string", v)
	default:
		println("unknown")
	}

	// Type switch without variable
	var x any = 123
	switch x.(type) {
	case bool:
		println("bool")
	case int:
		println("int")
	}

	// Type switch with multiple types in a case
	var y any = true
	switch v := y.(type) {
	case int, float64:
		println("number", v)
	case string, bool:
		println("string or bool", v)
	}

	// Type switch with initialization statement
	switch z := getInterface(); v := z.(type) {
	case int:
		println("z is int", v)
	}

	// Default-only type switch
	var w any = "test"
	switch w.(type) {
	default:
		println("default only")
	}
	switch w.(type) {
	default:
		println("default only, value is", w.(string))
	}

	for _, v := range []any{int32(7)} {
		switch v := v.(type) {
		default:
			println("shadow default", v.(int32))
		}
	}

	count := 0
	for _, v := range []any{1, "skip", 2} {
		switch v := v.(type) {
		case string:
			println("continue", v)
			continue
		case int:
			count += v
		}
		println("after switch")
	}
	println("type switch count", count)
}

func getInterface() any {
	return 42
}
