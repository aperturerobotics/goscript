package main

import "math"

func aboveSignedLimit(v uint64) bool {
	return v > math.MaxInt64+1
}

func main() {
	println(aboveSignedLimit(uint64(10)))
}
