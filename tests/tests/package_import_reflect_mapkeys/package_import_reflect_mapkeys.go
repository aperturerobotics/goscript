package main

import "reflect"

func main() {
	keys := reflect.ValueOf(map[string]int{
		"alpha": 1,
		"beta":  2,
	}).MapKeys()

	seen := map[string]bool{}
	for _, key := range keys {
		seen[key.String()] = true
	}

	println("keys:", len(keys))
	println("alpha:", seen["alpha"])
	println("beta:", seen["beta"])
}
