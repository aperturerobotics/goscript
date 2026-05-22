package main

import "math"

func aboveSignedLimit(v uint64) bool {
	return v > math.MaxInt64+1
}

func isMinInt64(v int64) bool {
	return v == math.MinInt64
}

func main() {
	println(aboveSignedLimit(uint64(10)))
	println(isMinInt64(0))
}
