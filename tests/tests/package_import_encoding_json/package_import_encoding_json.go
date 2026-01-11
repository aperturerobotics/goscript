package main

import (
	"encoding/json"
	"slices"
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
		results = append(results, "Unmarshal struct: Name="+q.Name+", Age="+itoa(q.Age)+", Active="+boolstr(q.Active))
	}

	// Unmarshal into a map[string]any
	var m map[string]any
	if err := json.Unmarshal([]byte(`{"name":"Carol","age":22,"active":true}`), &m); err != nil {
		results = append(results, "Unmarshal map error: "+err.Error())
	} else {
		name := m["name"].(string)
		age := int(m["age"].(float64))
		active := m["active"].(bool)
		results = append(results, "Unmarshal map: name="+name+", age="+itoa(age)+", active="+boolstr(active))
	}

	// Sort results for deterministic output
	slices.Sort(results)

	for _, r := range results {
		println("JSON result:", r)
	}

	println("encoding/json test finished")
}

// minimal helpers to avoid imports
func itoa(i int) string {
	// simple positive int conversion sufficient for this test
	if i == 0 {
		return "0"
	}
	neg := false
	if i < 0 {
		neg = true
		i = -i
	}
	buf := make([]byte, 0, 20)
	for i > 0 {
		d := byte(i % 10)
		buf = append(buf, '0'+d)
		i /= 10
	}
	// reverse
	for l, r := 0, len(buf)-1; l < r; l, r = l+1, r-1 {
		buf[l], buf[r] = buf[r], buf[l]
	}
	if neg {
		return "-" + string(buf)
	}
	return string(buf)
}

func boolstr(b bool) string {
	if b {
		return "true"
	}
	return "false"
}
