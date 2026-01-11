package main

import (
	"reflect"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

func main() {
	p := Person{Name: "Alice", Age: 30, Active: true}
	t := reflect.TypeOf(p)

	// Simulate what typeFields does
	println("NumField:", t.NumField())
	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		println("Field", i)
		println("  Name:", sf.Name)
		println("  Anonymous:", sf.Anonymous)
		println("  IsExported:", sf.IsExported())

		tag := sf.Tag.Get("json")
		println("  Tag.Get(json):", tag)

		if tag == "-" {
			println("  Skipping (tag is -)")
			continue
		}

		// Simple tag parsing (similar to parseTag)
		name := tag
		if idx := 0; idx < len(tag) {
			for i := 0; i < len(tag); i++ {
				if tag[i] == ',' {
					name = tag[:i]
					break
				}
			}
		}
		println("  Parsed name:", name)
	}
}
