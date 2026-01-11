package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	// Test basic types
	s := "hello"
	b1, err1 := json.Marshal(s)
	if err1 != nil {
		fmt.Println("String marshal error:", err1)
	} else {
		fmt.Printf("String marshal: %q\n", string(b1))
	}

	n := 42
	b2, err2 := json.Marshal(n)
	if err2 != nil {
		fmt.Println("Int marshal error:", err2)
	} else {
		fmt.Printf("Int marshal: %q\n", string(b2))
	}
}
