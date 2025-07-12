package main

func main() {
	var a any
	a = "this is a string"
	if _, ok := a.(string); ok {
		println("Expected: string")
	} else {
		println("Not Expected: should be a string")
	}

	// this is from go/ast/filter.go, line 117
	type KV struct {
		Key any
	}

	var list []any
	kv := &KV{Key: "string"}
	list = []any{kv}
	for _, exp := range list {
		switch x := exp.(type) {
		case *KV:
			if x, ok := x.Key.(string); ok {
				println("got string:", x)
			} else {
				println("fail: should be string")
			}
		default:
			println("fail: should be KV")
		}
	}
}
