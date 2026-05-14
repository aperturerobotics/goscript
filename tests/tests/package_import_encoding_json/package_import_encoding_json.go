package main

import (
	"encoding/json"
	"slices"
	"strconv"
)

type Person struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Active bool   `json:"active"`
}

func main() {
	var results []string

	// Marshal a simple struct
	p := Person{Name: "Alice", Age: 30, Active: true}
	b, err := json.Marshal(p)
	if err != nil {
		results = append(results, "Marshal error: "+err.Error())
	} else {
		results = append(results, "Marshal: "+string(b))
	}

	// Unmarshal into a struct
	var q Person
	if err := json.Unmarshal([]byte(`{"name":"Bob","age":25,"active":false}`), &q); err != nil {
		results = append(results, "Unmarshal struct error: "+err.Error())
	} else {
		results = append(results, "Unmarshal struct: Name="+q.Name+", Age="+strconv.Itoa(q.Age)+", Active="+strconv.FormatBool(q.Active))
	}

	// Unmarshal into a map[string]any
	var m map[string]any
	if err := json.Unmarshal([]byte(`{"name":"Carol","age":22,"active":true}`), &m); err != nil {
		results = append(results, "Unmarshal map error: "+err.Error())
	} else {
		name := m["name"].(string)
		age := int(m["age"].(float64))
		active := m["active"].(bool)
		results = append(results, "Unmarshal map: name="+name+", age="+strconv.Itoa(age)+", active="+strconv.FormatBool(active))
	}

	// Sort results for deterministic output
	slices.Sort(results)

	for _, r := range results {
		println("JSON result:", r)
	}

	println("encoding/json test finished")
}
