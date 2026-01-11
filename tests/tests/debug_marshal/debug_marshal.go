package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

func main() {
	p := Person{Name: "Alice", Age: 30, Active: true}
	b, err := json.Marshal(p)
	if err != nil {
		fmt.Println("Marshal error:", err)
	} else {
		fmt.Printf("Marshal result: %q (len=%d)\n", string(b), len(b))
		for i, c := range b {
			fmt.Printf("byte[%d]: %d (%c)\n", i, c, c)
		}
	}
}
