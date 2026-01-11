package main

import (
	"reflect"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

// Simplified version of what encoding/json typeFields does
func main() {
	t := reflect.TypeOf(Person{})
	println("Type:", t.Name(), "Kind:", t.Kind().String(), "NumField:", t.NumField())

	// Iterate over fields like typeFields does
	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		println("Field", i, ":", sf.Name)
		println("  Anonymous:", sf.Anonymous)
		println("  IsExported:", sf.IsExported())

		// Get the json tag like typeFields does
		tag := sf.Tag.Get("json")
		println("  Tag.Get(\"json\"):", tag)

		// Skip if unexported non-embedded field
		if !sf.Anonymous && !sf.IsExported() {
			println("  -> Skipped (unexported)")
			continue
		}

		// Skip if tag is "-"
		if tag == "-" {
			println("  -> Skipped (tag is -)")
			continue
		}

		// Parse the tag to extract the name
		name := tag
		for j := 0; j < len(tag); j++ {
			if tag[j] == ',' {
				name = tag[:j]
				break
			}
		}
		if name == "" {
			name = sf.Name
		}
		println("  -> Name after parsing:", name)
	}
}
