package main

import (
	"encoding/json"
)

type Simple struct {
	X int `json:"x"`
}

func main() {
	s := Simple{X: 42}
	b, err := json.Marshal(s)
	if err != nil {
		println("Error:", err.Error())
	} else {
		println("Result:", string(b))
	}
}
