package main

import (
	"encoding/json"
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
		println("Marshal error:", err.Error())
	} else {
		println("Marshal:", string(b))
	}
}
