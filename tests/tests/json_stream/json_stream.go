package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

func main() {
	// Compact preserves number literal spelling.
	var c bytes.Buffer
	json.Compact(&c, []byte(`{"n": 1e+00, "big": 9007199254740993}`))
	fmt.Println(c.String())

	// Indent lays out the compact form with Go spacing.
	var ind bytes.Buffer
	json.Indent(&ind, []byte(`{"a":1,"b":[2,3]}`), "", "  ")
	fmt.Println(ind.String())

	// Decoder reads one value per call and buffers the rest of the stream.
	dec := json.NewDecoder(strings.NewReader("1 2 3"))
	var n int
	for dec.Decode(&n) == nil {
		fmt.Println("decoded", n)
	}

	// UseNumber keeps the exact source literal beyond float64 precision.
	und := json.NewDecoder(strings.NewReader(`{"big":9007199254740993}`))
	und.UseNumber()
	var m map[string]any
	und.Decode(&m)
	fmt.Println("big", m["big"])

	// A malformed document yields a *json.SyntaxError with the Go byte offset.
	var v any
	err := json.Unmarshal([]byte("[1,]"), &v)
	if se, ok := err.(*json.SyntaxError); ok {
		fmt.Println("offset", se.Offset)
	}

	// Token advances the stream; More reports remaining container elements.
	mdec := json.NewDecoder(strings.NewReader("[10,20]"))
	mdec.Token()
	fmt.Println("more", mdec.More())
	mdec.Token()
	mdec.Token()
	fmt.Println("more", mdec.More())
}
