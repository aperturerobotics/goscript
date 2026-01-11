package main

import (
	"reflect"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

// Simulate what encoding/json typeFields does
func main() {
	t := reflect.TypeOf(Person{})
	println("Type:", t.Name())

	// Simulate typeFields logic
	type field struct {
		name string
		tag  bool
	}

	var fields []field

	for i := 0; i < t.NumField(); i++ {
		sf := t.Field(i)
		println("Processing field", i, ":", sf.Name)
		println("  Anonymous:", sf.Anonymous)
		println("  IsExported:", sf.IsExported())

		if sf.Anonymous {
			println("  Skipping: Anonymous field")
			continue
		}
		if !sf.IsExported() {
			println("  Skipping: Unexported non-embedded field")
			continue
		}

		tag := sf.Tag.Get("json")
		println("  Tag.Get(json):", tag)

		if tag == "-" {
			println("  Skipping: Tag is -")
			continue
		}

		name := tag
		// Parse tag to extract name before comma
		for j := 0; j < len(tag); j++ {
			if tag[j] == ',' {
				name = tag[:j]
				break
			}
		}
		if name == "" {
			name = sf.Name
		}
		println("  Final name:", name)

		fields = append(fields, field{name: name, tag: tag != ""})
	}

	println("=== Fields found ===")
	for i, f := range fields {
		println("Field", i, "name:", f.name, "tagged:", f.tag)
	}
}
